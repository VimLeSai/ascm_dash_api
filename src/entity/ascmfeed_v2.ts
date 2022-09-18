import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
export class ascmfeed_v2 {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column()
  index: Date;

  @Column()
  count: number;
}
