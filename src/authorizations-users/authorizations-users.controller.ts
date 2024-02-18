import { Body, Controller, Post } from "@nestjs/common";
import { ResponseResDto } from "src/responses/response-res.dto";
import { ApiModelResponse } from "src/responses/response.model";
import { CreateAuthorizacionUserReqDto } from "./dto/requests/create-authorizacion-user-req.dto";
import { ResponsesService } from "src/responses/responses.service";
import { AuthorizationsUsersService } from "./authorizations-users.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("Authorizations Users")
@Controller("authorizations-users")
export class AuthorizationsUsersController {
   constructor(private srvAuthoUser: AuthorizationsUsersService) {}

   @Post("send-email")
   @ApiModelResponse("boolean")
   async createUser(
      @Body() pBody: CreateAuthorizacionUserReqDto,
   ): Promise<ResponseResDto<boolean>> {
      const result = new ResponsesService<boolean>();

      return result.repuestaCorrecta(
         await this.srvAuthoUser.createAuthorizationUser(pBody),
      );
   }
}
