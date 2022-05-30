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

  get beautyName(): string {
    return this.name.split(' ').map((w) => {
      return w[0].toUpperCase() + w.slice(1);
    }).join(' ')
  }
}
