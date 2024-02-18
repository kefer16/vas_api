import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrivilegesController } from "./privileges/privileges.controller";
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
import { PrivilegesModule } from "./privileges/privileges.module";
import { ResponsesService } from "./responses/responses.service";
import { AuthorizationsModule } from "./authorizations/authorizations.module";
import { EmailsModule } from "./emails/emails.module";
import { AuthorizationsUsersController } from "./authorizations-users/authorizations-users.controller";

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
      PrivilegesModule,
      AuthorizationsModule,
      EmailsModule,
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
            PrivilegesController,
            AuthorizationsUsersController,
            CompaniesController,
            ModulesController,
         );
   }
}
