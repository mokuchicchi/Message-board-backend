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
    if (!name) {
      throw new UnauthorizedException('名前を入力してください');
    }
    if (!password) {
      throw new UnauthorizedException('パスワードを入力してください');
    }

    const hash = crypto.createHash('md5').update(password).digest('hex');
    const user = await this.userRepository.findOne({
      where: { name: Equal(name), hash: Equal(hash) },
    });

    if (!user) {
      throw new UnauthorizedException('パスワードが異なります');
    }

    const ret = {
      uuid: user.uuid,
      token: '',
    };

    let expire = new Date();
    expire.setDate(expire.getDate() + 1);
    const auth = await this.authRepository.findOne({
      where: { uuid: Equal(user.uuid) },
    });

    if (auth) {
      // 更新
      auth.expireAt = expire;
      await this.authRepository.save(auth);
      ret.token = auth.token;
    } else {
      // 新規作成
      const token = crypto.randomUUID();
      const record = {
        uuid: user.uuid,
        token: token,
        expireAt: expire.toISOString(),
      };
      await this.authRepository.save(record);
      ret.token = token;
    }

    return ret;
  }
}
