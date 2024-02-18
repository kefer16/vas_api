import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthorizationsModule } from "src/authorizations/authorizations.module";

@Module({
   imports: [AuthorizationsModule],
   controllers: [UsersController],
   providers: [UsersService],
   exports: [UsersService],
})
export class UsersModule {}
