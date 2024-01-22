import { IsString, Length, Matches } from '@nestjs/class-validator'
import { InputType, Field } from '@nestjs/graphql'
import { IsStrongPassword } from 'class-validator'
import { CONSTANTS } from '../../constants'
import { Email } from '../../common/entities/user.entity'

@InputType()
export class SignInAuthInput extends Email {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  @IsString()
  @Length(8, 30)
  @Matches(/^\S*$/, { message: CONSTANTS.PASSWORD_WHITE_SPACE_MESSAGE })
  @IsStrongPassword({}, { message: CONSTANTS.STRONG_PASSWORD })
  password: string
}

@InputType()
export class CreateAuthInput extends SignInAuthInput {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  @IsString()
  @Length(3, 50, { message: CONSTANTS.ENTER_FULLNAME })
  @Matches(/^([A-Z][a-z]+(?: [A-Za-z]+)*)$/, {
    message: CONSTANTS.FULLNAME_INVALID_MESSAGE
  })
  fullName: string
}

@InputType()
export class RemoveUserInput {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  @IsString()
  @Length(6, 30)
  email: string
}
