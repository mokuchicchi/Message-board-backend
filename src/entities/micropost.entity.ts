import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from 'typeorm';

@Entity('post')
export class MicroPost {
  @PrimaryGeneratedColumn({ type: 'int' })
  readonly id: number;

  @Column({ type: 'uuid' })
  uuid: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt?: Date;
}
