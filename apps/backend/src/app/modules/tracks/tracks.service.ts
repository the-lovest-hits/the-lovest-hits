import { Track } from '../../entities/track';
import { isBefore, sub } from 'date-fns';
import { pluck } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from '../../entities/album';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from './albums.service';
import { SpotifyService } from '../spotify/spotify.service';

export class TracksService {
  constructor(
    @InjectRepository(Track) private readonly trackRepository: Repository<Track>,
    @InjectRepository(Album) private readonly albumRepository: Repository<Album>,
    private readonly artistsService: ArtistsService,
    private readonly albumsService: AlbumsService,
    private readonly spotifyService: SpotifyService,
  ) {
  }

  async getById(id: string): Promise<Track> {
    let track = await this.trackRepository.findOne(id);

    if (!track || isBefore(track.updated, sub(new Date(), { months: 1}))) {
      const spotify = await this.spotifyService.http.get(`tracks/${id}`).pipe(
        pluck('data'),
      ).toPromise();
      track = track || this.trackRepository.create();
      track.id = spotify.id;
      track.name = spotify.name;
      track.popularity = spotify.popularity;
      track.spotifyUri = spotify.uri;
      track.trackNumber = spotify.track_number;
      track.album = await this.albumsService.getById(spotify.album.id);
      track.artist = track.album.artist;
      console.log('alb', track.album);
      console.log('track.artist', track.artist);
      await this.trackRepository.save(track);
    }

    return track;
  }
}
