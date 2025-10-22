import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from 'typeorm';

@Entity('auth')
export class Auth {
  @PrimaryGeneratedColumn({ type: 'int' })
  readonly id: number;

  @Column({ type: 'uuid' })
  uuid: string;

  @Column('varchar')
  token: string;

  @Column({ type: 'timestamp' })
  expireAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt?: Date;
}
