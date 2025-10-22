import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  readonly id: number;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true, default: '' })
  email: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  hash: string;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt?: Date;
}
