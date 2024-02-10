import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OperatorsService } from "./operators.service";
import { ResponsesService } from "src/responses/responses.service";
import {
   ApiModelResponse,
   ApiModelResponseArray,
   ApiModelResponseObject,
} from "src/responses/response.model";
import { ResponseResDto } from "src/responses/response-res.dto";
import { GetOperatorsResDto } from "./dto/responses/get-operators-res.dto";
import { GetOperatorResDto } from "./dto/responses/get-operator-res.dto";
import { CreateOperatorResDto } from "./dto/responses/create-operator-res.dto";
import { CreateOperatorReqDto } from "./dto/requests/create-operator-req.dto";
import { UpdateOperatorResDto } from "./dto/responses/update-operator-res.dto";
import { UpdateOperatorReqDto } from "./dto/requests/update-operator-req.dto";

@ApiTags("Operators")
@Controller("operators")
export class OperatorsController {
   constructor(private srvOperador: OperatorsService) {}

   @Get()
   @ApiModelResponseArray(GetOperatorsResDto)
   async getOperators(): Promise<ResponseResDto<GetOperatorsResDto[]>> {
      const result = new ResponsesService<GetOperatorsResDto[]>();

      return result.repuestaCorrecta(await this.srvOperador.getOperators());
   }

   @Post()
   @ApiModelResponseObject(CreateOperatorResDto)
   async createOperator(
      @Body() pBody: CreateOperatorReqDto,
   ): Promise<ResponseResDto<CreateOperatorResDto>> {
      const result = new ResponsesService<CreateOperatorResDto>();

      return result.repuestaCorrecta(
         await this.srvOperador.createOperator(pBody),
      );
   }

   @Get(":id")
   @ApiModelResponseObject(GetOperatorResDto)
   async getOperator(
      @Param("id") id: string,
   ): Promise<ResponseResDto<GetOperatorResDto>> {
      const result = new ResponsesService<GetOperatorResDto>();

      return result.repuestaCorrecta(await this.srvOperador.getOperator(id));
   }

   @Put(":id")
   @ApiModelResponseObject(UpdateOperatorResDto)
   async updateOperator(
      @Param("id") pId: string,
      @Body() pBody: UpdateOperatorReqDto,
   ): Promise<ResponseResDto<UpdateOperatorResDto>> {
      const result = new ResponsesService<UpdateOperatorResDto>();

      return result.repuestaCorrecta(
         await this.srvOperador.updateOperator(pId, pBody),
      );
   }

   @Delete(":id")
   @ApiModelResponse("boolean")
   async deleteOperator(
      @Param("id") pId: string,
   ): Promise<ResponseResDto<boolean>> {
      const result = new ResponsesService<boolean>();

      return result.repuestaCorrecta(
         await this.srvOperador.deleteOperator(pId),
      );
   }
}
