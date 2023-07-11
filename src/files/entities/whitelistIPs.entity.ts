import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class WhitelistIps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ip: string;
}
