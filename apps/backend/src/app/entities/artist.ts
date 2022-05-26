import {
  Column,
  CreateDateColumn,
  Entity, JoinTable, ManyToMany, OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Genre } from './genre';
import { Track } from './track';
import { Album } from './album';

@Entity({
  name: 'artists',
})
export class Artist {

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

  @ManyToMany(() => Genre)
  @JoinTable({
    name: 'artists_genres',
  })
  genres: Genre[];

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

  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[];

  @OneToMany(() => Track, (track) => track.artist)
  tracks: Track[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
