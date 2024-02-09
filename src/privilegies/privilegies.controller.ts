import { Controller, Get } from "@nestjs/common";
import { PrivilegiesService } from "./privilegies.service";
import { ApiModelResponseArray } from "src/responses/response.model";
import { ResponseResDto } from "src/responses/response-res.dto";
import { GetPrivilegiesResDto } from "./dto/responses/get-privilegies-res.dto";
import { ResponsesService } from "src/responses/responses.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Privilegies")
@Controller("privilegies")
export class PrivilegiesController {
   constructor(private srvPrivilege: PrivilegiesService) {}

   @Get()
   @ApiModelResponseArray(GetPrivilegiesResDto)
   async getOperators(): Promise<ResponseResDto<GetPrivilegiesResDto[]>> {
      const result = new ResponsesService<GetPrivilegiesResDto[]>();

      return result.repuestaCorrecta(await this.srvPrivilege.getPrivilegies());
   }
}
