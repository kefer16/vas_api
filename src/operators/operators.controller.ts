import { Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OperatorsService } from "./operators.service";
import { GetOpertorsDto } from "./dto/get-operators.dto";
import { ResponseDto } from "src/responses/response.dto";
import { ResponsesService } from "src/responses/responses.service";
import {
   ApiModelResponseArray,
   ApiModelResponseObject,
} from "src/responses/response.model";
import { GetOpertorDto } from "./dto/get-operator.dto";

@ApiTags("Operators")
@Controller("operators")
export class OperatorsController {
   constructor(private srvOperador: OperatorsService) {}

   @Get()
   @ApiModelResponseArray(GetOpertorsDto)
   async getOperators(): Promise<ResponseDto<GetOpertorsDto[]>> {
      const result = new ResponsesService<GetOpertorsDto[]>();

      return result.repuestaCorrecta(await this.srvOperador.getOperators());
   }

   @Get(":id")
   @ApiModelResponseObject(GetOpertorDto)
   async getOperator(
      @Param("id") id: string,
   ): Promise<ResponseDto<GetOpertorDto>> {
      const result = new ResponsesService<GetOpertorDto>();

      return result.repuestaCorrecta(await this.srvOperador.getOperator(id));
   }

   @Put(":id")
   @ApiModelResponseObject(GetOpertorDto)
   async updateOperator(
      @Param("id") id: string,
   ): Promise<ResponseDto<GetOpertorDto>> {
      const result = new ResponsesService<GetOpertorDto>();

      return result.repuestaCorrecta(await this.srvOperador.getOperator(id));
   }

   @Post(":id")
   @ApiModelResponseObject(GetOpertorDto)
   async createOperator(
      @Param("id") id: string,
   ): Promise<ResponseDto<GetOpertorDto>> {
      const result = new ResponsesService<GetOpertorDto>();

      return result.repuestaCorrecta(await this.srvOperador.getOperator(id));
   }
   @Delete(":id")
   @ApiModelResponseObject(GetOpertorDto)
   async deleteOperator(
      @Param("id") id: string,
   ): Promise<ResponseDto<GetOpertorDto>> {
      const result = new ResponsesService<GetOpertorDto>();

      return result.repuestaCorrecta(await this.srvOperador.getOperator(id));
   }
}
