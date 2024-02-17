import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { OperatorsController } from "./operators/operators.controller";
import { ConfigModule } from "@nestjs/config";
import { PrivilegiesController } from "./privilegies/privilegies.controller";
import { CompaniesController } from "./companies/companies.controller";
import { GlobalMiddleware } from "./global/global.middleware";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./http-exception/http-exception.filter";
import { ModulesController } from "./modules/modules.controller";
import { AuthorizationsUsersModule } from "./authorizations-users/authorizations-users.module";
import { UsersModule } from "./users/users.module";
import { MssqlModule } from "./mssql/mssql.module";
import { CompaniesModule } from "./companies/companies.module";
import { ModulesModule } from "./modules/modules.module";
import { OperatorsModule } from "./operators/operators.module";
import { PrivilegiesModule } from "./privilegies/privilegies.module";
import { ResponsesService } from "./responses/responses.service";

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
      }),
      AuthorizationsUsersModule,
      UsersModule,
      MssqlModule,
      CompaniesModule,
      ModulesModule,
      OperatorsModule,
      PrivilegiesModule,
   ],
   providers: [
      ResponsesService,
      {
         provide: APP_FILTER,
         useClass: HttpExceptionFilter,
      },
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
