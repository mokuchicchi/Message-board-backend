import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/entities/auth.entity';
import { MicroPost } from 'src/entities/micropost.entity';
import { Equal, MoreThan, Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(MicroPost)
    private readonly microPostsRepository: Repository<MicroPost>,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  async createPost(token: string, message: string) {
    // ログイン済みかチェック
    const now = new Date();
    const auth = await this.authRepository.findOne({
      where: { token: Equal(token), expireAt: MoreThan(now) },
    });
    if (!auth) {
      throw new ForbiddenException();
    }

    const record = {
      uuid: auth.uuid,
      content: message,
    };
    const saved = await this.microPostsRepository.save(record);

    return {
      uuid: saved.uuid,
      content: saved.content,
    };
  }

  async getList(token: string, start: number = 0, nr_records: number = 1) {
    const now = new Date();
    const auth = await this.authRepository.findOne({
      where: { token: Equal(token), expireAt: MoreThan(now) },
    });
    if (!auth) {
      throw new ForbiddenException();
    }

    const qb = await this.microPostsRepository
      .createQueryBuilder('micro_post')
      .leftJoinAndSelect('user', 'user', 'user.uuid=micro_post.uuid')
      .select([
        'micro_post.id as id',
        'user.name as userName',
        'micro_post.content as content',
        'micro_post.createdAt as createdAt',
      ])
      .orderBy('micro_post.createdAt', 'DESC')
      .offset(start)
      .limit(nr_records);

    type ResultType = {
      id: number;
      userName: string;
      content: string;
      createdAt: Date;
    };
    const records = await qb.getRawMany<ResultType>();

    return records;
  }
}
