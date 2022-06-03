import { forwardRef, Module } from '@nestjs/common';
import { SpotifyModule } from '../spotify/spotify.module';
import { ArtistsController } from './artists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from '../../entities/artist';
import { Genre } from '../../entities/genre';
import { ArtistsService } from './artists.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    SpotifyModule,
    forwardRef(() => EventsModule),
    TypeOrmModule.forFeature([
      Artist,
      Genre,
    ]),
  ],
  controllers: [
    ArtistsController,
  ],
  providers: [
    ArtistsService,
  ],
  exports: [
    ArtistsService,
  ],
})
export class ArtistsModule {}
