import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CompaniesService } from "./companies.service";
import { GetCompaniesResDto } from "./dto/responses/get-companies-res.dto";
import { ResponseResDto } from "src/responses/response-res.dto";
import {
   ApiModelResponse,
   ApiModelResponseArray,
   ApiModelResponseObject,
} from "src/responses/response.model";
import { ResponsesService } from "src/responses/responses.service";
import { GetCompanyResDto } from "./dto/responses/get-company-res.dto";
import { CreateCompanyResDto } from "./dto/responses/create-company-res.dto";
import { CreateCompanyReqDto } from "./dto/requests/create-company-req.dto";
import { UpdateCompanyReqDto } from "./dto/requests/update-company-req.dto";
import { UpdateCompanyResDto } from "./dto/responses/update-company-res.dto";
@ApiBearerAuth()
@ApiTags("Companies")
@Controller("companies")
export class CompaniesController {
   constructor(private srvCompany: CompaniesService) {}

   @Get()
   @ApiModelResponseArray(GetCompaniesResDto)
   async getCompanies(): Promise<ResponseResDto<GetCompaniesResDto[]>> {
      const result = new ResponsesService<GetCompaniesResDto[]>();

      return result.repuestaCorrecta(await this.srvCompany.getCompanies());
   }

   @Post()
   @ApiModelResponseObject(CreateCompanyResDto)
   async createCompany(
      @Body() pBody: CreateCompanyReqDto,
   ): Promise<ResponseResDto<CreateCompanyResDto>> {
      const result = new ResponsesService<CreateCompanyResDto>();

      return result.repuestaCorrecta(
         await this.srvCompany.createCompany(pBody),
      );
   }

   @Get(":id")
   @ApiModelResponseObject(GetCompanyResDto)
   async getCompany(
      @Param("id") pId: string,
   ): Promise<ResponseResDto<GetCompanyResDto>> {
      const result = new ResponsesService<GetCompanyResDto>();
      return result.repuestaCorrecta(await this.srvCompany.getCompany(pId));
   }

   @Put(":id")
   @ApiModelResponseObject(UpdateCompanyResDto)
   async updateCompany(
      @Param("id") pId: string,
      @Body() pBody: UpdateCompanyReqDto,
   ): Promise<ResponseResDto<UpdateCompanyResDto>> {
      const result = new ResponsesService<UpdateCompanyResDto>();

      return result.repuestaCorrecta(
         await this.srvCompany.updateCompany(pId, pBody),
      );
   }
   @Delete(":id")
   @ApiModelResponse("boolean")
   async deleteCompany(
      @Param("id") pId: string,
   ): Promise<ResponseResDto<boolean>> {
      const result = new ResponsesService<boolean>();

      return result.repuestaCorrecta(await this.srvCompany.deleteCompany(pId));
   }
}
