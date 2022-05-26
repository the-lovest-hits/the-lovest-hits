import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from '../../entities/album';
import { In, Repository } from 'typeorm';
import { isBefore, sub } from 'date-fns';
import { pluck } from 'rxjs';
import { SpotifyService } from '../spotify/spotify.service';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from './tracks.service';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album) private readonly albumRepository: Repository<Album>,
    private readonly spotifyService: SpotifyService,
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => TracksService)) private readonly tracksService: TracksService,
  ) {
  }

  async getById(id: string): Promise<Album> {
    let album = await this.albumRepository.findOne(id);

    if (!album || isBefore(album.updated, sub(new Date(), { months: 1}))) {
      const spotify = await this.spotifyService.http.get(`albums/${id}`).pipe(
        pluck('data'),
      ).toPromise();
      album = album || this.albumRepository.create();
      album.id = spotify.id;
      album.name = spotify.name;
      album.images = spotify.images;
      album.spotifyUri = spotify.uri;
      album.releaseDate = spotify.release_date;

      album.artist = await this.artistsService.getById(spotify.artists[0].id);

      (async () => {
        spotify.tracks.items.forEach(({ id }) => {
          this.tracksService.getById(id).then();
        });
      })();

      await this.albumRepository.save(album);
    }

    return album;
  }
}
