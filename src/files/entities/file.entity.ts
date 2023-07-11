import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { WhitelistIps } from './whitelistIPs.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  file_name: string;

  @Column()
  remaining_downloads: number;

  @ManyToMany(() => WhitelistIps)
  @JoinTable()
  whitelistIps: WhitelistIps[];
}
