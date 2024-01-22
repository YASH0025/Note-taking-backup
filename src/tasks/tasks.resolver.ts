import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql'
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import * as processRequest from 'graphql-upload/processRequest.js'
import { CreateTask } from './dto/ceate-tasks.input'
import { UpdateTask } from './dto/update-tasks.input'
import { TasksService } from './tasks.service'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard'
import {
  CategoryList,
  Filters,
  TaskData,
  Tasks
} from '../common/entities/tasks.entity'
import { Message } from '../common/entities/user.entity'
import {
  PaginatedResponse,
  PaginationtInput
} from '../common/entities/pagination.input'

@Resolver('File')
export class TasksResolver {
  constructor(private readonly taskService: TasksService) {}

  @UseGuards(GqlAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => [Tasks])
  async getTaskList(
    @Args('filters', { nullable: true }) filter: Filters | null,
    @Context() context: any
  ) {
    const result = await this.taskService.getTasksList(
      context?.req?.user,
      filter
    )

    return result
  }

  @UseGuards(GqlAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => Tasks)
  async getOneTasks(@Args({ name: '_id', type: () => String }) _id: string) {
    const result = await this.taskService.getOneTasks(_id)
    return result
  }

  @UseGuards(GqlAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => PaginatedResponse, { name: 'paginatedTasks' })
  async getListInPagination(
    @Context() ctx: any,
    @Args('pageinate') paginate?: PaginationtInput
  ): Promise<PaginatedResponse> {
    const { user } = ctx?.req
    const responseData = await this.taskService.findByPagination(user, paginate)
    console.log(responseData)
    const total = responseData.length // Replace this with the actual total count

    return { data: responseData, total }
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TaskData, { name: 'addTasks' })
  async addTasks(
    @Args({ name: 'file', type: () => [GraphQLUpload], nullable: true })
    file: processRequest.FileUpload[] | null | undefined,
    @Args('info') cr: CreateTask,
    @Context() context: any
  ) {
    const user = context.req.user
    const res = await this.taskService.createTask({
      file,
      info: cr,
      user: user
    })
    return res
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TaskData, { name: 'updateTasks' })
  async updateTasks(
    @Args({ name: 'file', type: () => [GraphQLUpload], nullable: true })
    file: processRequest.FileUpload[] | null | undefined,
    @Args('info') cr: UpdateTask
  ) {
    const res = await this.taskService.updateTask({ file, info: cr })

    return res
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Message)
  async deleteTask(@Args({ name: '_id', type: () => String }) _id: string) {
    const result = this.taskService.deleteTask(_id)
    return result
  }

  @UseGuards(GqlAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => CategoryList)
  async getCategoryList(@Context() context: any): Promise<CategoryList> {
    const user = context.req.user
    const data = await this.taskService.getCategoryList(user)
    return data as CategoryList
  }
}
