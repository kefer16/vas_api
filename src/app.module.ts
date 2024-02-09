import { Module } from "@nestjs/common";
import { UsersService } from "./users/users.service";
import { UsersController } from "./users/users.controller";
import { OperatorsController } from "./operators/operators.controller";
import { OperatorsService } from "./operators/operators.service";
import { ResponsesService } from "./responses/responses.service";
import { MSSQLService } from "./db/mssql.service";
import { ConfigModule } from "@nestjs/config";
import { PrivilegiesController } from './privilegies/privilegies.controller';
import { PrivilegiesService } from './privilegies/privilegies.service';
import { CompaniesController } from './companies/companies.controller';
import { CompaniesService } from './companies/companies.service';

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
      }),
   ],
   controllers: [UsersController, OperatorsController, PrivilegiesController, CompaniesController],
   providers: [MSSQLService, UsersService, OperatorsService, ResponsesService, PrivilegiesService, CompaniesService],
})
export class AppModule {}
