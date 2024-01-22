import { Module } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { TasksResolver } from './tasks.resolver'
import { JwtModule } from '@nestjs/jwt'
import { jwtSecret } from '../auth/constants'
import { DatabaseModule } from '../common/database/database.module'
import { CommonFunctions } from '../common/common_functions/commonfunctions'
import { UsersProviders } from '../common/providers/users.providers'

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '9h' }
    })
  ],
  providers: [TasksService, TasksResolver, ...UsersProviders, CommonFunctions]
})
export class TasksModule {}
