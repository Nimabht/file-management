import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { WhitelistedIP } from './whitelistIPs.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column({ default: 0 })
  remaining_downloads: number;

  @ManyToMany(() => WhitelistedIP)
  @JoinTable()
  whitelistedIPs: WhitelistedIP[];
}
