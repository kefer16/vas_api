import { Body, Controller, Post, Put } from "@nestjs/common";
import { ResponseResDto } from "src/responses/response-res.dto";
import { ApiModelResponse } from "src/responses/response.model";
import { ResponsesService } from "src/responses/responses.service";
import { AuthorizationsUsersService } from "./authorizations-users.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ActiveAccountReqDto } from "./dto/requests/active-account-req.dto";
import { CreateAccountReqDto } from "./dto/requests/create-account-req.dto";

@ApiBearerAuth()
@ApiTags("Authorizations Users")
@Controller("authorizations-users")
export class AuthorizationsUsersController {
   constructor(private srvAuthoUser: AuthorizationsUsersService) {}

   @Post("create-account")
   @ApiModelResponse("boolean")
   async createAccount(
      @Body() pBody: CreateAccountReqDto,
   ): Promise<ResponseResDto<boolean>> {
      const result = new ResponsesService<boolean>();

      return result.repuestaCorrecta(
         await this.srvAuthoUser.createAccount(pBody),
      );
   }

   @Put("activate-account")
   @ApiModelResponse("boolean")
   async activateAccount(
      @Body() pBody: ActiveAccountReqDto,
   ): Promise<ResponseResDto<boolean>> {
      const result = new ResponsesService<boolean>();

      return result.repuestaCorrecta(
         await this.srvAuthoUser.activateAccount(pBody),
      );
   }
}
