import { Module } from "@nestjs/common";
import { AuthorizationsUsersService } from "./authorizations-users.service";
import { AuthorizationsUsersController } from "./authorizations-users.controller";
import { UsersModule } from "src/users/users.module";

@Module({
   imports: [UsersModule, AuthorizationsUsersModule],
   controllers: [AuthorizationsUsersController],
   providers: [AuthorizationsUsersService],
})
export class AuthorizationsUsersModule {}
