import { Email } from '../../common/entities/user.entity'
import { IsStrongPassword } from 'class-validator'
import { InputType, Field, Int } from '@nestjs/graphql'
import { IsString, Length } from '@nestjs/class-validator'
import { CONSTANTS } from '../../constants'

@InputType()
export class OTPValidation {
  @Field(() => String)
  email: string

  @Field(() => Int)
  otp: number
}

@InputType()
export class ResetPasswords extends Email {
  @Field(() => String)
  @IsString()
  @Length(8, 30)
  @IsStrongPassword({}, { message: CONSTANTS.STRONG_PASSWORD })
  newPassword: string

  @Field(() => String)
  @IsString()
  @Length(8, 30)
  @IsStrongPassword({}, { message: CONSTANTS.STRONG_PASSWORD })
  confirmPassword: string

  @Field(() => Int)
  token: number
}

@InputType()
export class UpdatePasswords {
  @Field(() => String)
  @IsString()
  @Length(8, 30)
  @IsStrongPassword({}, { message: CONSTANTS.STRONG_PASSWORD })
  oldPassword: string

  @Field(() => String)
  @IsString()
  @Length(8, 30)
  @IsStrongPassword({}, { message: CONSTANTS.STRONG_PASSWORD })
  newPassword: string

  @Field(() => String)
  @IsString()
  @Length(8, 30)
  @IsStrongPassword({}, { message: CONSTANTS.STRONG_PASSWORD })
  confirmPassword: string
}

@InputType()
export class UpdateUserInput {
  @Field(() => String, { defaultValue: '' })
  fullName: string

  @Field(() => String, { defaultValue: '' })
  firstName: string

  @Field(() => String, { defaultValue: '' })
  lastName: string

  @Field(() => String, { defaultValue: '' })
  mobileNumber: string

  @Field(() => Int, { nullable: true })
  age: number
}
