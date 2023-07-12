import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class WhitelistedIP extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ipAddress: string;
}
