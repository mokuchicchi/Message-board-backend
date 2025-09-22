import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { Auth } from 'src/entities/auth.entity';
import { User } from 'src/entities/user.entity';
import { Equal, MoreThan, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async createUser(name: string, email: string, password: string) {
    const hash = createHash('md5').update(password).digest('hex');
    const record = {
      name: name,
      email: email,
      hash: hash,
    };
    await this.userRepository.save(record);
  }

  async getUser(id: number, token: string) {
    // ログイン済みチェック
    const now = new Date();
    const auth = await this.authRepository.findOne({
      where: { token: Equal(token), expire_at: MoreThan(now) },
    });
    if (!auth) {
      throw new ForbiddenException();
    }

    // ユーザー情報を取得
    const user = await this.userRepository.findOne({
      where: { id: Equal(id) },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
