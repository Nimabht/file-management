import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { File } from './file.entity';

@Entity()
export class WhitelistedIP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ipAddress: string;

  @ManyToMany(() => File, (file) => file.whitelistedIPs)
  files: File[];
}
