import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn,
  ManyToOne,
  OneToMany, OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Track } from './track';
import { Artist } from './artist';

@Entity({
  name: 'albums',
})
export class Album {

  @PrimaryColumn({
    type: 'varchar',
  })
  id: number;

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

  @Column("simple-json")
  images: {
    height: number;
    width: number;
    url: string;
  }[];

  @Column({
    name: 'release_date',
    type: 'date',
  })
  releaseDate: Date;

  @OneToMany(
    () => Track,
    (track) => track.album,
    { eager: true },
  )
  tracks: Track[];

  @ManyToOne(
    () => Artist,
    { eager: true },
  )
  @JoinColumn({
    name: 'artist_id',
  })
  artist: Artist;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
