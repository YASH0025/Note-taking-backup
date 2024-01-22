import {
  ValidatorConstraint,
  ValidatorConstraintInterface
} from '@nestjs/class-validator'
@ValidatorConstraint()
export class MobileNumberValidator implements ValidatorConstraintInterface {
  async validate(text: string) {
    const regex = /^(?:\+|\d)[0-9]{6,14}$/

    return regex.test(text)
  }
}
