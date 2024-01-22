import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { Email, Message, User, UserFind } from '../common/entities/user.entity'
import {
  ResetPasswords,
  UpdatePasswords,
  UpdateUserInput
} from './dto/update-user.input'
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard'
import {
  PaginatedResponse,
  PaginationtInput
} from '../common/entities/pagination.input'

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => [User])
  findAll() {
    return this.usersService.findAll()
  }

  @UseGuards(GqlAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => User, { name: 'findOneUser' })
  async findUser(@Args('userDetail') userDetail: UserFind) {
    const result = this.usersService.findUser(userDetail)
    return result
  }

  // @Mutation((returns) => Message)
  // async generateOTP(@Args('generateOtp') data: Email): Promise<Message> {
  //   const generatedOtp = await this.usersService.generateOTP(data);
  //   return generatedOtp;
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => Message)
  async forgotPassword(@Args('forgotPass') data: Email): Promise<Message> {
    const generatedOtp = await this.usersService.forgotPassword(data)
    return generatedOtp
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Context() context: any
  ) {
    const userId = context?.req?.user._id
    const result = this.usersService.update(userId, updateUserInput)
    return result
  }

  @Mutation(() => Message)
  async resetPassword(@Args('resetPassword') resetPassword: ResetPasswords) {
    const result = await this.usersService.resetPassword(resetPassword)
    return result
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Message)
  async updatePassword(
    @Args('updatePassword') updatePassword: UpdatePasswords,
    @Context() context: any
  ) {
    const userData = context?.req?.user
    const result = await this.usersService.updatePassword(
      userData,
      updatePassword
    )
    return result
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Message)
  // async removeUser(@Args({ name: 'removeUser', type: () => Email }) removeUser: Email) {
  async removeUser(@Context() context: any) {
    const user = context.req.user

    const result = await this.usersService.remove(user)
    return result
  }

  @UseGuards(GqlAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => PaginatedResponse)
  async getListInPagination(
    @Args('pageinate') paginate?: PaginationtInput
  ): Promise<PaginatedResponse> {
    const data = await this.usersService.findByPagination(paginate)
    return data as PaginatedResponse
  }
}
