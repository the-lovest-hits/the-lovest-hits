import { InjectRepository } from '@nestjs/typeorm';
import { Event, EventType } from '../../entities/event';
import { Repository } from 'typeorm';
import { AccountsService } from './accounts.service';
import { Account } from '../../entities/account';
import { Artist } from '../../entities/artist';
import { ArtistsService } from '../artists/artists.service';
import { forwardRef, Inject } from '@nestjs/common';

interface SimpleEvent {
  from?: string | Account;
  to: string | Account;
  type: EventType;
  artist: Artist['id'] | Artist;
  meta?: Event['meta'];
}

export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    private readonly accountsService: AccountsService,
    @Inject(forwardRef(() => ArtistsService)) private readonly artistsService: ArtistsService,
  ) {
  }

  async createAndSave(ev: SimpleEvent): Promise<Event> {

    let { from, to, type, meta, artist } = ev;

    if (from && typeof from === 'string') {
      from = await this.accountsService.getByAddress(from);
    }

    if (to && typeof to === 'string') {
      to = await this.accountsService.getByAddress(to);
    }

    if (typeof artist === 'string') {
      artist = await this.artistsService.getById(artist);
    }

    const event = this.eventRepository.create({
      type,
      meta,
      artist,
      to: to as Account,
      from: from as Account,
    });

    await this.eventRepository.save(event);
    return event;
  }

}
