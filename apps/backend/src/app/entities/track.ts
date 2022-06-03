import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Album } from './album';
import { Artist } from './artist';

@Entity({
  name: 'tracks',
})
export class Track {

  @PrimaryColumn({
    type: 'varchar',
  })
  id: number;

  @Column({
    default: 0,
  })
  popularity: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
    name: 'spotify_uri',
    type: 'varchar',
  })
  spotifyUri: string;

  @Column({
    name: 'token_id',
    nullable: false,
    default: 0,
    type: 'integer',
  })
  tokenId: number;

  @Column({
    name: 'collection_id',
    nullable: false,
    default: 0,
    type: 'integer',
  })
  collectionId: number;

  @Column({
    name: 'track_number',
    nullable: false,
    default: 0,
    type: 'integer',
  })
  trackNumber: number;

  @ManyToOne(
    () => Album,
    (album) => album.tracks,
  )
  @JoinColumn({ name: "album_id" })
  album: Album;

  @Column({
    name: 'album_id',
  })
  albumId: Album['id'];

  @ManyToOne(
    () => Artist,
    (artist) => artist.tracks,
    { eager: true },
  )
  artist: Artist;

  @Column({
    name: 'artist_id',
    nullable: true, // todo remove this
  })
  artistId: string;

  @Column({
    name: 'ipfs_pin',
    nullable: true,
  })
  ipfsPin: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
