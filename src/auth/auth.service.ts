import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateAuthInput } from './dto/create-auth.input'
import { Model } from 'mongoose'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { CommonMongooseFunctions } from '../common/common_functions/commonMongooseQuries'
import {
  Data,
  Email,
  Message,
  User,
  UserAuthentication
} from '../common/entities/user.entity'
import { LoginAuth } from './dto/update-auth.input'
import { CONSTANTS } from '../constants'
import { jwtSecret } from './constants'
import { CommonFunctions } from '../common/common_functions/commonfunctions'
import { UsersService } from '../users/users.service'
// import { log } from 'console'
import { GoogleVerificationService } from './verify-googleuser'
import { FacebookVerificationService } from './verify-facebookuser'

@Injectable()
export class AuthService {
  private mongooseFunction: CommonMongooseFunctions<any>

  constructor(
    private jwtService: JwtService,
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    @Inject('USER_MODEL')
    private UserDetailsModel: Model<UserAuthentication>,
    private readonly commonFunctions: CommonFunctions,
    private readonly userService: UsersService
  ) {
    this.mongooseFunction = new CommonMongooseFunctions<any>(this.userModel)
  }

  // Register uer service
  async signUpUser(createAuthInput: CreateAuthInput) {
    let message: Message
    // const newValues = await this.commonFunctions.trimedValues(createAuthInput)
    // if (newValues !== '') {
    //   const data = {
    //     message: CONSTANTS.TERMS_AGREE,
    //     statusCode: HttpStatus.NOT_MODIFIED
    //   }
    //   return data as Data
    // }
    // if (!createAuthInput.agreeTerms) {
    //   const data = {
    //     message: CONSTANTS.TERMS_AGREE,
    //     statusCode: HttpStatus.NOT_MODIFIED
    //   }
    //   return data as Data
    // }
    let user = await this.mongooseFunction.findOne({
      email: createAuthInput.email
    })

    if (!user) {
      const salt = await bcrypt.genSalt()
      const hashPassword = await bcrypt.hash(createAuthInput.password, salt)
      createAuthInput.password = hashPassword
      createAuthInput
      user = await this.mongooseFunction.insertOne({
        ...createAuthInput,
        isVerified: false
      })

      const payload = {
        _id: user._id,
        email: user.email,
        tokenType: 'accountVerification'
      }

      const verification_token = await this.jwtService.signAsync(payload, {
        expiresIn: '9h'
      })
      const path = 'src/templates/registrationTemplate.ejs'
      const html = await this.commonFunctions.renderWithData(
        {
          user: user,
          link: `${process.env.LOCAL_DOMAIN_NAME}account/verify/${verification_token}`,
          appName: process.env.APP_NAME
        },
        path
      )

      const data = {
        to: user?.email,
        subject: `${CONSTANTS.USER_REGISTRATION_EMAIL_SUBJECT} ${process.env.APP_NAME}`,
        html: html
      }
      await this.commonFunctions
        .sendEmail(data)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .then((d: any) => {
          message = {
            message: CONSTANTS.REGISTRATION_SUCCESSFULL,
            statusCode: HttpStatus.OK
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((err) => {
          console.log('sdfh', err)

          message = {
            statusCode: HttpStatus.NOT_MODIFIED,
            message: CONSTANTS.UNKNOWN_ERROR
          }
        })
      return message as Message
    } else {
      message = {
        message: CONSTANTS.USER_ALREADY_EXISTS,
        statusCode: HttpStatus.NOT_MODIFIED
      }
      return message as Message
    }
  }

  async resendAccountVerificationEmail(email: Email) {
    const user = await this.mongooseFunction.findOne(email)
    let message: Message
    if (user) {
      if (user && !user.isVerified) {
        const payload = {
          _id: user._id,
          email: user.email,
          tokenType: 'accountVerification'
        }
        const verification_token = await this.jwtService.signAsync(payload, {
          expiresIn: '9h'
        })
        const path = 'src/templates/registrationTemplate.ejs'
        const html = await this.commonFunctions.renderWithData(
          {
            user: user,
            link: `${process.env.LOCAL_DOMAIN_NAME}account/verify/${verification_token}`,
            appName: process.env.APP_NAME
          },
          path
        )

        const data = {
          to: user?.email,
          subject: `${CONSTANTS.USER_REGISTRATION_EMAIL_SUBJECT} ${process.env.APP_NAME}`,
          html: html
        }
        await this.commonFunctions
          .sendEmail(data)
          .then(() => {
            message = {
              message: CONSTANTS.USER_VERIFICATION_EMAIL,
              statusCode: HttpStatus.OK
            }
          })
          .catch(() => {
            message = {
              statusCode: HttpStatus.NOT_MODIFIED,
              message: CONSTANTS.UNKNOWN_ERROR
            }
          })
        return message
      } else {
        message = {
          message: 'User already verified',
          statusCode: 201
        }
        return message
      }
    } else {
      message = {
        message: CONSTANTS.EMAIL_NOT_FOUND,
        statusCode: HttpStatus.FORBIDDEN
      }
      return message
    }
  }

  //Verify user
  async verifyUser(token: string) {
    const details = await this.jwtService
      .verifyAsync(token, { secret: jwtSecret })
      .catch((error) => {
        return { message: error }
      })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let data: any

    if (
      details._id &&
      (await this.commonFunctions.tokenExpiryCheck(details.exp))
    ) {
      const userDetails = await this.mongooseFunction.findOne({
        _id: details._id
      })
      if (userDetails && !userDetails.isVerified) {
        userDetails.isVerified = true
        userDetails.save()
        const path = 'src/templates/successRegistration.ejs'
        const html = await this.commonFunctions.renderWithData(
          { user: userDetails, appName: process.env.APP_NAME },
          path
        )
        const emailData = {
          to: userDetails?.email,
          subject: `${CONSTANTS.SUCCESSFULL_VERIFICATION} ${process.env.APP_NAME}`,
          html: html
        }
        await this.commonFunctions
          .sendEmail(emailData)
          .then(() => {
            data = {
              message: `${CONSTANTS.SUCCESSFULL_VERIFICATION} ${process.env.APP_NAME}`,
              statusCode: HttpStatus.OK
            }
          })
          .catch(() => {
            data = {
              statusCode: HttpStatus.NOT_MODIFIED,
              message: CONSTANTS.UNKNOWN_ERROR
            }
          })
        return '<h1>User verified successfully</h1>'
      } else {
        return '<h1>User already verified</h1>'
      }
    } else {
      return '<h1>Invalid url</h1>'
    }
  }

  // Login user and create auth token
  async signInUser(loginAuthInput: LoginAuth) {
    const query: Record<string, string> = {}
    if (loginAuthInput.email && loginAuthInput.email !== '')
      query.email = loginAuthInput.email

    const user = await this.UserDetailsModel.findOne(query).lean()

    if (user) {
      const hashPassword = await bcrypt.compare(
        loginAuthInput.password,
        user.password
      )
      if (hashPassword) {
        const payload = { _id: user._id, email: user.email }
        const auth_token = await this.jwtService.signAsync(payload)
        const message = {
          message: CONSTANTS.SIGNEDIN_SUCCESS,
          statusCode: HttpStatus.OK
        }
        console.log(auth_token)

        const data = {
          user: { ...user, auth_token: auth_token },
          ...message
        }
        return data as Data
      } else {
        const message = {
          statusCode: HttpStatus.ACCEPTED,
          message:
            loginAuthInput.email !== ''
              ? CONSTANTS.INVALID_EMAIL_PASSWORD
              : CONSTANTS.INVALID_USERNAMNE_PASSWORD
        }
        const data = {
          user: null,
          ...message
        }
        return data as Data
      }
    } else {
      return {
        user: null,
        statusCode: 201,
        message: CONSTANTS.EMAIL_NOT_FOUND
      } as Data
    }
  }

  async registerGoogleUser(accessToken: any): Promise<any> {
    try {
      const profile =
        await GoogleVerificationService.verifyAccessToken(accessToken)

      console.log('profile:', profile)

      const email = profile.email

      if (!email) {
        throw new BadRequestException('Invalid email format')
      }

      const existingUser = await this.mongooseFunction.findOne({ email })

      if (existingUser) {
        throw new BadRequestException('User already exists')
      } else {
        const user = {
          email,
          fullName: profile.profile.name,
          isVerified: true
        }
        const newUser = await this.mongooseFunction.insertOne(user)

        // const payload = {
        //   _id: newUser._id,
        //   email: newUser.email,
        //   tokenType: 'googleAuthentication'
        // }
        // const authToken = await this.jwtService.signAsync(payload, {
        //   expiresIn: '1h'
        // })

        return { user: newUser }
      }
    } catch (error) {
      console.error('Error in registerUser:', error)
      throw error
    }
  }
  async loginGoogleUser(accessToken: any): Promise<any> {
    try {
      const profile =
        await GoogleVerificationService.verifyAccessToken(accessToken)

      console.log('profile:', profile)

      const email = profile.email

      if (!email) {
        throw new BadRequestException('Invalid email format')
      }

      const existingUser = await this.mongooseFunction.findOne({ email })

      if (existingUser) {
        const payload = {
          _id: existingUser._id,
          email: existingUser.email,
          tokenType: 'googleAuthentication'
        }
        const authToken = await this.jwtService.signAsync(payload, {
          expiresIn: '1h'
        })
        console.log(authToken)

        return { user: existingUser, authToken }
      } else {
        throw new NotFoundException('User not found')
      }
    } catch (error) {
      console.error('Error in loginUser:', error)
      throw error
    }
  }

  async registerFacebookUser(accessToken: any): Promise<any> {
    try {
      const profile =
        await FacebookVerificationService.verifyAccessToken(accessToken)

      console.log('profile:', profile.profile.name)

      const email = profile.profile.email
      if (!email) {
        throw new BadRequestException('Invalid email format')
      }

      const existingUser = await this.mongooseFunction.findOne({ email })

      if (existingUser) {
        throw new BadRequestException('User already exists')
      } else {
        const user = {
          fullName: profile.profile.name,
          email: email,
          isVerified: true
        }
        const newUser = await this.mongooseFunction.insertOne(user)

        // const payload = {
        //   _id: newUser._id,
        //   email: newUser.email,
        //   tokenType: 'facebookAuthentication'
        // }
        // const authToken = await this.jwtService.signAsync(payload, {
        //   expiresIn: '1h'
        // })

        return { user: newUser }
      }
    } catch (error) {
      console.error('Error in registerFacebookUser:', error)
      throw error
    }
  }

  async loginFacebookUser(accessToken: any): Promise<any> {
    try {
      const profile =
        await FacebookVerificationService.verifyAccessToken(accessToken)

      console.log('profile:', profile.profile.name)

      const email = profile.profile.email
      if (!email) {
        throw new BadRequestException('Invalid email format')
      }

      const existingUser = await this.mongooseFunction.findOne({ email })

      if (existingUser) {
        const payload = {
          _id: existingUser._id,
          email: existingUser.email,
          tokenType: 'facebookAuthentication'
        }
        const authToken = await this.jwtService.signAsync(payload, {
          expiresIn: '1h'
        })
        console.log(authToken)

        return { user: existingUser, authToken }
      } else {
        throw new NotFoundException('User not found')
      }
    } catch (error) {
      console.error('Error in loginFacebookUser:', error)
      throw error
    }
  }
}
