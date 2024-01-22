import {
  ValidatorConstraint,
  ValidatorConstraintInterface
} from '@nestjs/class-validator'
import { taskConstants } from '../../constants'

@ValidatorConstraint()
export class TaskCategoryValidator implements ValidatorConstraintInterface {
  async validate(text: string) {
    const istrue = taskConstants.categoryTypes.includes(text.toUpperCase())
    return istrue
  }
}
