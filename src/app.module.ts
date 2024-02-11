import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UsersService } from "./users/users.service";
import { UsersController } from "./users/users.controller";
import { OperatorsController } from "./operators/operators.controller";
import { OperatorsService } from "./operators/operators.service";
import { ResponsesService } from "./responses/responses.service";
import { MSSQLService } from "./db/mssql.service";
import { ConfigModule } from "@nestjs/config";
import { PrivilegiesController } from "./privilegies/privilegies.controller";
import { PrivilegiesService } from "./privilegies/privilegies.service";
import { CompaniesController } from "./companies/companies.controller";
import { CompaniesService } from "./companies/companies.service";
import { ErrorsService } from "./errors/errors.service";
import { GlobalMiddleware } from "./global/global.middleware";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./http-exception/http-exception.filter";
import { ModulesService } from "./modules/modules.service";
import { ModulesController } from "./modules/modules.controller";

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
      }),
   ],
   controllers: [
      UsersController,
      OperatorsController,
      PrivilegiesController,
      CompaniesController,
      ModulesController,
   ],
   providers: [
      MSSQLService,
      UsersService,
      OperatorsService,
      ResponsesService,
      PrivilegiesService,
      CompaniesService,
      ErrorsService,
      {
         provide: APP_FILTER,
         useClass: HttpExceptionFilter,
      },
      ModulesService,
   ],
})
export class AppModule implements NestModule {
   configure(consumer: MiddlewareConsumer) {
      consumer
         .apply(GlobalMiddleware)
         .forRoutes(
            OperatorsController,
            PrivilegiesController,
            CompaniesController,
            ModulesController,
         );
   }
}
