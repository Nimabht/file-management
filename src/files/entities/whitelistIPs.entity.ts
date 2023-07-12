import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { File } from './file.entity';

@Entity()
export class WhitelistedIP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ipAddress: string;

  @ManyToMany(() => File)
  files: File[];
}
