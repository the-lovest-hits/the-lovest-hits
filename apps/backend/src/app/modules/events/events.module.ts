import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../../entities/event';
import { Account } from '../../entities/account';
import { AccountsService } from './accounts.service';
import { EventsService } from './events.service';
import { ArtistsModule } from '../artists/artists.module';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event, Account,
    ]),
    forwardRef(() => ArtistsModule),
    forwardRef(() => TracksModule),
  ],
  providers: [
    AccountsService,
    EventsService,
  ],
  exports: [
    AccountsService,
    EventsService,
  ],
})
export class EventsModule {}
