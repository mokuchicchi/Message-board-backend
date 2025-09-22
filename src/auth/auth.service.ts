import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Auth } from 'src/entities/auth.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  async getAuth(name: string, password: string) {
    if (!password) {
      throw new UnauthorizedException();
    }

    const hash = crypto.createHash('md5').update(password).digest('hex');
    const user = await this.userRepository.findOne({
      where: { name: Equal(name), hash: Equal(hash) },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const ret = {
      token: '',
      user_id: user.id,
    };

    let expire = new Date();
    expire.setDate(expire.getDate() + 1);
    const auth = await this.authRepository.findOne({
      where: { user_id: Equal(user.id) },
    });

    if (auth) {
      // 更新
      auth.expire_at = expire;
      await this.authRepository.save(auth);
      ret.token = auth.token;
    } else {
      // 新規作成
      const token = crypto.randomUUID();
      const record = {
        user_id: user.id,
        token: token,
        expire_at: expire.toISOString(),
      };
      await this.authRepository.save(record);
      ret.token = token;
    }

    return ret;
  }
}
