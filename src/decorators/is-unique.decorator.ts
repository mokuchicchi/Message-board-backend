import { registerDecorator, ValidationOptions } from 'class-validator';
import { UniqueValidator } from '../validators/unique.validator';

export function IsUnique(
  entity: Function,
  column: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, column],
      validator: UniqueValidator,
    });
  };
}
