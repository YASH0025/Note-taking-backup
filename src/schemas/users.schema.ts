import * as mongoose from 'mongoose'

const UrlSchema = new mongoose.Schema({
  filename: String,
  mimetype: String,
  encoding: String,
  path: String
})

const TaskSchema = new mongoose.Schema(
  {
    title: String,
    description: { type: String, default: '' },
    userId: String,
    urls: [UrlSchema],
    category: String
  },
  {
    timestamps: true
  }
)

const CategroySchema = new mongoose.Schema({
  name: String
})

export const UsersSchema = new mongoose.Schema(
  {
    password: String,
    fullName: String,
    otpGenerateTime: String,
    accountStatus: String,
    email: String,
    otp: Number,
    isVerified: Boolean,
    tasks: [TaskSchema],
    categoryList: [CategroySchema]
  },
  { timestamps: true }
)
