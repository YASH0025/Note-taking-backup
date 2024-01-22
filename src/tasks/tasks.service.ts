import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { CommonFunctions } from '../common/common_functions/commonfunctions'
import { TaskData, CategoryList } from '../common/entities/tasks.entity'
import { CommonMongooseFunctions } from '../common/common_functions/commonMongooseQuries'
import { CONSTANTS } from '../constants'
import { Message, User } from '../common/entities/user.entity'
import { PaginationtInput } from '../common/entities/pagination.input'

@Injectable()
export class TasksService {
  private mongooseFunction: CommonMongooseFunctions<any>
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    private readonly commonFunctions: CommonFunctions
  ) {
    this.mongooseFunction = new CommonMongooseFunctions<any>(this.userModel)
  }

  async createTask(data: any) {
    const fileInfos: any = []
    let response: any
    const { file, info, user } = data
    console.log(user)

    if (file && file.length > 0) {
      for (const item of file) {
        const fileInfo = await this.commonFunctions.addFile(item, info.category)
        if (fileInfo?.message) {
          return fileInfo.message
        }
        fileInfos.push(fileInfo)
      }
    }
    try {
      const update: any = {
        $push: {
          tasks: {
            ...info,
            urls: fileInfos
          }
        }
      }

      const categoryExist = await this.mongooseFunction.findOne({
        _id: user._id,
        'categoryList.name': info.category
      })

      if (!categoryExist) {
        update.$push.categoryList = {
          name: info.category
        }
      }
      const result = await this.mongooseFunction.updateOne(
        {
          _id: user._id
        },
        update
      )
      console.log('dfdrg===========:', result)

      if (Object.keys(result).length > 0) {
        response = {
          tasks: result,
          message: 'Task inserted successfully',
          statusCode: HttpStatus.CREATED
        }
      } else {
        response = {
          tasks: {},
          message: 'Task not created',
          statusCode: HttpStatus.NOT_MODIFIED
        }
      }
    } catch (error) {
      console.log('error', error)
      response = {
        tasks: {},
        message: error.toString(),
        statusCode: HttpStatus.BAD_REQUEST
      }
    }
    return response as TaskData
  }

  async getTasksList(data: any, filter: any = {}) {
    const query = [
      { $match: { _id: data._id } },
      {
        $project: {
          tasks: {
            $filter: {
              input: '$tasks',
              as: 'item',
              cond: {
                $and: [
                  ...(filter.category
                    ? [{ $eq: ['$$item.category', filter.category] }]
                    : []),
                  ...(filter.createdAt
                    ? [
                        {
                          $eq: ['$$item.createdAt', new Date(filter.createdAt)]
                        }
                      ]
                    : [])
                ]
              }
            }
          }
        }
      }
    ]
    console.log('test', filter)
    const result = await this.mongooseFunction.aggregatedData(query)
    const res = result.length > 0 ? result[0].tasks : result
    return res
  }
  async getOneTasks(_id: any) {
    const result = await this.mongooseFunction.findById(_id)
    return result
  }

  async deleteTask(_id: any) {
    let message: object
    const result = await this.mongooseFunction.deleteOne({ _id: _id })
    console.log(result)
    if (result) {
      message = {
        message: CONSTANTS.TASK_DELETE_SUCCESS,
        statusCode: HttpStatus.OK
      } as Message
      if (result.urls.length > 0) {
        result.urls.map((item: any) =>
          this.commonFunctions.unLinkFile(result.category, item.filename)
        )
      }
      return message
    } else {
      message = {
        message: CONSTANTS.TASK_DELETE_ERROR,
        statusCode: HttpStatus.FORBIDDEN
      } as Message
      return message
    }
  }

  async updateTask(data: any) {
    const { file, info } = data
    const filter = { _id: info._id }
    let response = {}
    const fileInfos: any = []

    const update: any = { $set: {} }
    if (file && file.length > 0) {
      for (const item of file) {
        const fileInfo = await this.commonFunctions.addFile(item, info.category)
        if (fileInfo?.message) {
          return fileInfo.message
        }
        fileInfos.push(fileInfo)
        if (fileInfos.length > 0) {
          update.$push = { urls: { $each: fileInfos } }
        }
      }
    }
    Object.keys(info).forEach(async (key) => {
      if (key !== '_id') update.$set[key] = data.info[key]
    })

    if (Object.keys(update.$set).length === 0) {
      console.error('No valid fields provided for update.')
      response = {
        tasks: {},
        message: 'Task not updated',
        statusCode: HttpStatus.NOT_MODIFIED
      }
    }

    try {
      const result = await this.mongooseFunction.updateOne(filter, update)
      if (Object.keys(result).length > 0) {
        response = {
          tasks: result,
          message: 'Task Updated successfully',
          statusCode: HttpStatus.CREATED
        }
      } else {
        response = {
          tasks: {},
          message: 'Task not updated',
          statusCode: HttpStatus.NOT_MODIFIED
        }
      }
    } catch (error) {
      response = {
        tasks: {},
        message: error.toString(),
        statusCode: HttpStatus.BAD_REQUEST
      }
    }
    return response
  }

  async findByPagination(user: any, paginate?: PaginationtInput): Promise<any> {
    try {
      const response: any = await this.mongooseFunction.findByPaginations(
        paginate.page,
        paginate.limit,
        user._id
      )

      if (!response || !response.data || !Array.isArray(response.data)) {
        console.error('Invalid response format:', response)
        throw new Error('Invalid response format')
      }

      const datas = response.data
      const data = datas.map((entry) => entry.task)
      console.log('filtered tasks:', data)

      return data
    } catch (error) {
      console.error('Error in findByPagination:', error)
      throw new Error('Error in findByPagination')
    }

    // return data.task
  }
  // filterTasksData(tasksData: any): any[] {
  //   console.log('ddgh', tasksData.task)

  //   try {
  //     if (tasksData || tasksData.task) {
  //       const task = tasksData.task

  //       return [
  //         {
  //           _id: task?._id || null,
  //           title: task?.title || null,
  //           description: task?.description || null,
  //           category: task?.category || null,
  //           userId: task?.userId || null,
  //           urls: task?.urls || []
  //         }
  //       ]
  //     }
  //   } catch (error) {
  //     console.error('Error in filterTasksData:', error)
  //     throw error
  //   }
  // }

  async getCategoryList(user) {
    try {
      const categoryList = await this.mongooseFunction.findOne({
        userId: user._id
      })
      return categoryList as CategoryList
    } catch (error) {}
  }

  async vlaueExists(categoryName: string, id: string) {
    try {
      const categoryDocument = await this.mongooseFunction.findOne({
        userId: id,
        category: {
          $elemMatch: {
            name: categoryName
          }
        }
      })

      return !!categoryDocument
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  }
}
