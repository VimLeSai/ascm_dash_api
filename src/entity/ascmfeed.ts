import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from "typeorm";

@Entity()
export class ascmfeed {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  date: Date;

  @Column()
  time: Timestamp;

  @Column()
  count: number;
}
