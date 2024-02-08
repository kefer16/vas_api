import { Module } from "@nestjs/common";
import { UsersService } from "./users/users.service";
import { UsersController } from "./users/users.controller";
import { OperatorsController } from "./operators/operators.controller";
import { OperatorsService } from "./operators/operators.service";
import { ResponsesService } from "./responses/responses.service";
import { MSSQLService } from "./db/mssql.service";
import { ConfigModule } from "@nestjs/config";

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
      }),
   ],
   controllers: [UsersController, OperatorsController],
   providers: [MSSQLService, UsersService, OperatorsService, ResponsesService],
})
export class AppModule {}
