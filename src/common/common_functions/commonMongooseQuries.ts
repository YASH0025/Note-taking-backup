import { Model, Document } from 'mongoose'

export class CommonMongooseFunctions<T extends Document> {
  constructor(private dynamicModel: Model<T>) {}

  async insertOne(query: any) {
    const value = await new this.dynamicModel(query)
    return value.save()
  }

  async findAll() {
    const result = await this.dynamicModel.find()
    return result
  }

  async findSpecific(query) {
    const result = await this.dynamicModel.find(query)
    return result
  }

  async findOne(query: any) {
    const result = await this.dynamicModel.findOne(query)
    return result
  }

  async findById(id: string) {
    const result = await this.dynamicModel.findById(id)
    return result
  }

  async findByPagination(page: number, limit: number) {
    const skip = page > 0 ? (page - 1) * limit : page
    const result = await this.dynamicModel.find().skip(skip).limit(limit)
    const total = await this.dynamicModel.countDocuments().exec()
    const response = {
      total: total,
      data: result
    }
    console.log('response---', response)

    return { data: result }
  }

  // async findByPaginations(page: number, limit: number, _id: any) {
  //   const skip = page > 0 ? (page - 1) * limit : page
  //   const result = await this.dynamicModel
  //     .find({ _id: _id })
  //     .skip(skip)
  //     .limit(limit)
  //   // const total = await this.dynamicModel.countDocuments().exec()
  //   // const response = {
  //   //   total: total,
  //   //   data: result
  //   // }
  //   // console.log('response---', response)

  //   return { data: result }
  // }
  async findByPaginations(page: number, limit: number, _id: any) {
    try {
      const skip = page > 0 ? (page - 1) * limit : 0

      const result = await this.dynamicModel.aggregate([
        { $match: { _id: _id } },
        { $unwind: '$tasks' },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            fullName: 1,
            email: 1,
            isVerified: 1,
            task: '$tasks'
          }
        }
      ])

      console.log('Intermediate Result:', result)
      return { data: result }
    } catch (error) {
      console.error('Error in findByPaginations:', error)
      throw error
    }
  }

  async updateOne(query, valueToBeupdated) {
    const updatedValue = await this.dynamicModel
      .findOneAndUpdate(query, valueToBeupdated, { new: true })
      .exec()
    return updatedValue
  }

  async aggregatedData(query) {
    const data: any = await this.dynamicModel.aggregate(query)
    return data
  }
  async deleteOne(query) {
    const user = await this.dynamicModel.findOneAndDelete(query)
    // try {
    //   const result = await this.dynamicModel.deleteOne({userName:'synsoft'});

    //   if (result.deletedCount === 1) {
    //     console.log('result', result);

    //     return { message: 'Document deleted successfully' };
    //   } else {
    //     console.log('in else', result);
    //     return { message: 'No matching document found for deletion' };
    //   }
    // } catch (error) {
    //   console.error('Error deleting document:', error);
    //   throw error;
    // }
    // const user = true
    // console.log('values is', user, query);

    if (user) {
      return user
    } else {
      return false
    }
  }

  async checkIfTimeExpired(time: any) {
    const currentEpochTimestamp = Date.now()
    const fiveMinutesAgoTimestamp = currentEpochTimestamp - 15 * 60 * 1000
    const isOtpExpired = (await time) < fiveMinutesAgoTimestamp
    return isOtpExpired
  }
}
