import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn,
  ManyToOne, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account';
import { Artist } from './artist';
import { Track } from './track';

export enum EventType {
  Meta = 'meta',
  InitialPurchaseRequest = 'initial_purchase_request',
  PurchaseApproved = 'purchase_approved',
  CollectionCreated = 'collection_created',
  ArtistTokenCreated = 'artist_token_created',
  TrackTokenCreated = 'track_token_created',
  AddedToWhiteList = 'added_to_white_list',
  RemovedFromWhiteList = 'removed_from_white_list',
}

@Entity({
  name: 'events',
})
export class Event {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Account, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({
    name: 'from',
  })
  from: Account;

  @ManyToOne(() => Account, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({
    name: 'to',
  })
  to: Account;

  @ManyToOne(() => Artist, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({
    name: 'artist_id',
  })
  artist: Artist;

  @ManyToOne(() => Track, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({
    name: 'track_id',
  })
  track: Track;

  @Column({
    type: 'simple-enum',
    enum: EventType,
    default: EventType.Meta,
  })
  type: EventType;

  @Column({
    name: 'meta',
    type: 'simple-json',
    default: {},
  })
  meta: Record<string, any>;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
