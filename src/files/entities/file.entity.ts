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

  @ManyToMany(() => WhitelistedIP, {
    cascade: true,
  })
  @JoinTable({
    name: 'file_whitelistedIP',
    joinColumn: { name: 'file_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'ip_id', referencedColumnName: 'id' },
  })
  whitelistedIPs: WhitelistedIP[];
}
