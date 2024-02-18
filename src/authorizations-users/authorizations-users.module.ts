import { Module } from "@nestjs/common";
import { AuthorizationsUsersService } from "./authorizations-users.service";
import { AuthorizationsUsersController } from "./authorizations-users.controller";
import { UsersModule } from "src/users/users.module";
import { AuthorizationsModule } from "src/authorizations/authorizations.module";

@Module({
   imports: [AuthorizationsModule, UsersModule],
   controllers: [AuthorizationsUsersController],
   providers: [AuthorizationsUsersService],
})
export class AuthorizationsUsersModule {}
