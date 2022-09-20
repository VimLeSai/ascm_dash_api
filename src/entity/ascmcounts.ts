import { PrimaryColumn, Column, Entity } from "typeorm";

@Entity()
export class ascmcounts {
  @PrimaryColumn({
    unique: false,
  })
  id: string;

  @Column()
  form_id: string;

  @Column()
  submit_date: Date;
}
