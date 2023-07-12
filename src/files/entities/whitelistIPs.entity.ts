import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WhitelistedIP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ipAddress: string;
}
