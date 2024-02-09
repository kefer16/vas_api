import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CompaniesService } from "./companies.service";
import { GetCompaniesResDto } from "./dto/responses/get-companies-res.dto";
import { ResponseResDto } from "src/responses/response-res.dto";
import { ApiModelResponseArray } from "src/responses/response.model";
import { ResponsesService } from "src/responses/responses.service";

@ApiTags("Companies")
@Controller("companies")
export class CompaniesController {
   constructor(private srvCompany: CompaniesService) {}

   @Get()
   @ApiModelResponseArray(GetCompaniesResDto)
   async getOperators(): Promise<ResponseResDto<GetCompaniesResDto[]>> {
      const result = new ResponsesService<GetCompaniesResDto[]>();

      return result.repuestaCorrecta(await this.srvCompany.getCompanies());
   }
}
