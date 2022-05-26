import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'genres',
})
export class Genre {

  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    nullable: false,
    type: 'varchar',
  })
  name: string;
}
