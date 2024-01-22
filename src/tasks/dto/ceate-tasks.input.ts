/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CreateTask {
  @Field((type) => String)
  title: string

  @Field((type) => String)
  // @Validate(TaskCategoryValidator, { message: 'Invalid Category' })
  category: string

  @Field((type) => String, { nullable: true })
  description: string
}
