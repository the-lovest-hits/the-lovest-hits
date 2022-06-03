import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from '../../entities/artist';
import { In, Repository } from 'typeorm';
import { Genre } from '../../entities/genre';
import { SpotifyService } from '../spotify/spotify.service';
import { isBefore, sub } from 'date-fns';
import { pluck } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/config.module';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist) private readonly artistRepository: Repository<Artist>,
    @InjectRepository(Genre) private readonly genreRepository: Repository<Genre>,
    private readonly spotifyService: SpotifyService,
    private readonly configService: ConfigService<Config>,
  ) {
  }

  async updateMintingInfo(
    id: string | number,
    collectionId: number,
    tokenId: number,
  ): Promise<Artist> {
    const artist = await this.getById(String(id));
    artist.tokenId = tokenId;
    artist.collectionId = collectionId;
    await this.artistRepository.save(artist);
    return artist;
  }

  async getById(id: string): Promise<Artist> {
    let artist = await this.artistRepository.findOne(id);

    if (!artist || isBefore(artist.updated, sub(new Date(), { months: 1}))) {
      const spotify = await this.spotifyService.http.get(`artists/${id}`).pipe(
        pluck('data'),
      ).toPromise();
      artist = artist || this.artistRepository.create();
      artist.id = spotify.id;
      artist.name = spotify.name;
      artist.popularity = spotify.popularity;
      artist.images = spotify.images;
      artist.spotifyUri = spotify.uri;
      const genres = await this.genreRepository.find({
        name: In(spotify.genres as string[]),
      });
      artist.genres = spotify.genres.map(name => {
        return genres.find(g => g.name === name) || this.genreRepository.create({ name });
      });
      await this.genreRepository.save(artist.genres);
      await this.artistRepository.save(artist);
    }

    return artist;
  }

  async getArtistPrice(id: string): Promise<{
    price: number,
    commission: number,
  }> {
    const artist: Artist = await this.getById(id);
    const { commission, priceMultiplier } = this.configService.get('market');
    return {
      commission,
      price: Math.round(
        (artist.popularity * artist.popularity * priceMultiplier) * 100
      ) / 100,
    };
  }
}
