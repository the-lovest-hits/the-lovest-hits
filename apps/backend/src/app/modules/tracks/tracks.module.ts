import { forwardRef, Module } from '@nestjs/common';
import { SpotifyModule } from '../spotify/spotify.module';
import { TracksController } from './tracks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from '../../entities/album';
import { Track } from '../../entities/track';
import { Artist } from '../../entities/artist';
import { ArtistsModule } from '../artists/artists.module';
import { AlbumsService } from './albums.service';
import { TracksService } from './tracks.service';
import { AlbumsController } from './albums.controller';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    forwardRef(() => SpotifyModule),
    forwardRef(() => ArtistsModule),
    forwardRef(() => EventsModule),
    TypeOrmModule.forFeature([
      Album,
      Track,
      Artist,
    ]),
  ],
  controllers: [
    TracksController,
    AlbumsController,
  ],
  providers: [
    AlbumsService,
    TracksService,
  ],
  exports: [
    AlbumsService,
    TracksService,
  ],
})
export class TracksModule {}
