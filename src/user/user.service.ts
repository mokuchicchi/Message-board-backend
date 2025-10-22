import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { CreateUserDto } from 'src/dto/create-user.dto';
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

  async createUser(createUserDto: CreateUserDto) {
    const hash = createHash('md5').update(createUserDto.password).digest('hex');
    const record = {
      name: createUserDto.name,
      email: createUserDto.email,
      hash: hash,
    };
    const saved = await this.userRepository.save(record);
    return {
      uuid: saved.uuid,
      name: saved.name,
      email: saved.email,
      hash: saved.hash,
    };
  }

  async getUser(uuid: string, token: string) {
    // ログイン済みチェック
    const now = new Date();
    const auth = await this.authRepository.findOne({
      where: { token: Equal(token), expireAt: MoreThan(now) },
    });
    if (!auth) {
      throw new ForbiddenException();
    }

    // ユーザー情報を取得
    const user = await this.userRepository.findOne({
      where: { uuid: Equal(uuid) },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
