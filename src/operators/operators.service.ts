import { Injectable } from "@nestjs/common";
import { MSSQLService, ProcedureParameter } from "src/db/mssql.service";
import { GetOperatorsResDto } from "./dto/responses/get-operators-res.dto";
import { GetOperatorResDto } from "./dto/responses/get-operator-res.dto";
import { CreateOperatorReqDto } from "./dto/requests/create-operator-req.dto";
import { CreateOperatorResDto } from "./dto/responses/create-operator-res.dto";
import { UpdateOperatorReqDto } from "./dto/requests/update-operator-req.dto";
import { UpdateOperatorResDto } from "./dto/responses/update-operator-res.dto";
import { Bit, DateTime, UniqueIdentifier, VarChar } from "mssql";

@Injectable()
export class OperatorsService {
   constructor(private mssql: MSSQLService) {}

   async getOperators(): Promise<GetOperatorsResDto[]> {
      const result = await this.mssql.executeProcedureList(
         "spGetOperators",
         [],
      );

      const resultMapper: GetOperatorsResDto[] = result.map(
         (item) =>
            ({
               OperatorId: item.OperatorId ?? "",
               Name: item.Name ?? "",
            }) as GetOperatorsResDto,
      );

      return resultMapper;
   }

   async getOperator(id: string): Promise<GetOperatorResDto> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piOperatorId",
            typeVariable: UniqueIdentifier,
            value: id,
         },
      ];
      const result = await this.mssql.executeProcedure(
         "spGetOperator",
         parameters,
      );
      if (!result) {
         return {} as GetOperatorResDto;
      }
      const resultMapper: GetOperatorResDto = {
         OperatorId: result.OperatorId ?? "",
         Name: result.Name ?? "",
      } as GetOperatorResDto;

      return resultMapper;
   }

   async createOperator(
      pBody: CreateOperatorReqDto,
   ): Promise<CreateOperatorResDto> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piName",
            typeVariable: VarChar(10),
            value: pBody.Name,
         },
         {
            variableName: "piIsActive",
            typeVariable: Bit,
            value: pBody.IsActive,
         },
         {
            variableName: "piCreationDate",
            typeVariable: DateTime,
            value: pBody.CreationDate,
         },
      ];
      const result = await this.mssql.executeProcedure(
         "spCreateOperator",
         parameters,
      );
      if (!result) {
         return {} as CreateOperatorResDto;
      }
      const resultMapper: CreateOperatorResDto = {
         OperatorId: result.OperatorId ?? "",
         Name: result.Name ?? "",
         IsActive: result.IsActive ?? false,
         CreationDate: result.CreationDate ?? new Date(),
      } as CreateOperatorResDto;

      return resultMapper;
   }

   async updateOperator(
      pId: string,
      pdata: UpdateOperatorReqDto,
   ): Promise<UpdateOperatorResDto> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piOperatorId",
            typeVariable: UniqueIdentifier,
            value: pId,
         },
         {
            variableName: "piName",
            typeVariable: VarChar(15),
            value: pdata.Name,
         },
         {
            variableName: "piIsActive",
            typeVariable: Bit,
            value: pdata.IsActive,
         },
      ];
      const result = await this.mssql.executeProcedure(
         "spUpdateOperator",
         parameters,
      );
      if (!result) {
         return {} as UpdateOperatorResDto;
      }
      const resultMapper: UpdateOperatorResDto = {
         OperatorId: result.OperatorId ?? "",
         Name: result.Name ?? "",
         IsActive: result.IsActive ?? false,
         CreationDate: result.CreationDate ?? new Date(),
      } as UpdateOperatorResDto;

      return resultMapper;
   }

   async deleteOperator(pId: string): Promise<boolean> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piOperatorId",
            typeVariable: UniqueIdentifier,
            value: pId,
         },
      ];
      return await this.mssql.executeProcedureIsSuccess(
         "spDeleteOperator",
         parameters,
      );
   }
}
