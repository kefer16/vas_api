import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiModelResponse } from "src/responses/response.model";
import { CreateUserReqDto } from "./dto/requests/create-user-req.dto";
import { UsersService } from "./users.service";
import { ResponsesService } from "src/responses/responses.service";
import { ResponseResDto } from "src/responses/response-res.dto";

@ApiBearerAuth()
@ApiTags("Users")
@Controller("users")
export class UsersController {
   constructor(private srvUser: UsersService) {}
   @Post()
   @ApiModelResponse("boolean")
   async createUser(
      @Body() pBody: CreateUserReqDto,
   ): Promise<ResponseResDto<boolean>> {
      const result = new ResponsesService<boolean>();

      return result.repuestaCorrecta(await this.srvUser.createUser(pBody));
   }
}
