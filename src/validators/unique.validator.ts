import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments) {
    const [entity, column] = args.constraints;
    const repository = this.dataSource.getRepository(entity);

    const record = await repository.findOne({ where: { [column]: value } });
    return !record;
  }

  defaultMessage(args: ValidationArguments) {
    const [, column] = args.constraints;
    const japaneseColumn =
      {
        name: '名前',
        email: 'Email',
      }[column] ?? column;

    return `${japaneseColumn}は既に使用されています`;
  }
}
