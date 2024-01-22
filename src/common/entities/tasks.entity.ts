/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectType, Field, InputType } from '@nestjs/graphql'
import { Message } from './user.entity'

@ObjectType()
export class Tasks {
  @Field((type) => String, { defaultValue: '' })
  _id: string

  @Field((type) => String, { defaultValue: '' })
  title: string

  @Field((type) => String, { defaultValue: '' })
  description: string

  @Field((type) => String, { defaultValue: '' })
  category: string

  @Field((type) => String, { defaultValue: '' })
  userId: string

  @Field((type) => [FileObject], { defaultValue: [] })
  urls: FileObject[]
}

@ObjectType()
export class FileObject {
  @Field((type) => String, { defaultValue: '' })
  filename: string

  @Field((type) => String, { defaultValue: '' })
  mimetype: string

  @Field((type) => String, { defaultValue: '' })
  encoding: string

  @Field((type) => String, { defaultValue: '' })
  path: string
}

@ObjectType()
export class TaskData extends Message {
  @Field((type) => Tasks, { nullable: true })
  tasks: Tasks
}

@InputType()
export class Category {
  @Field((type) => String)
  userId: string

  @Field((type) => [String])
  category: string[]
}

@ObjectType()
class CategorySchema {
  @Field((type) => String)
  _id: string

  @Field((type) => String)
  name: string
}

@ObjectType()
export class CategoryList {
  @Field((type) => String)
  userId: string

  @Field((type) => [CategorySchema])
  category: CategorySchema[]
}

@InputType()
export class Filters {
  @Field((type) => String, { defaultValue: '', nullable: true })
  createdAt: string

  @Field((type) => String, { defaultValue: '', nullable: true })
  category: string
}

export class Task {
  _id: string
  title: string
  description: string
  category: string
  userId: string
  urls?: FileObject[] // Make 'urls' property optional

  // ... other fields
}

export class PaginatedResponse {
  data: Task[]
  total: number
}
