/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputType, Field } from '@nestjs/graphql'
import { CreateTask } from './ceate-tasks.input'

@InputType()
export class UpdateTask extends CreateTask {
  @Field((type) => String)
  _id: string
}
