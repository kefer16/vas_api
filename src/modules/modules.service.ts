import { Injectable } from "@nestjs/common";
import { MSSQLService, ProcedureParameter } from "src/db/mssql.service";
import { ModuleResDto } from "./dto/responses/module-res.dto";
import { Bit, DateTime, UniqueIdentifier, VarChar } from "mssql";
import { CreateModuleReqDto } from "./dto/requests/create-module-req.dto";
import { UpdateModuleReqDto } from "./dto/requests/update-module-req.dto";

@Injectable()
export class ModulesService {
   constructor(private srvMSSQL: MSSQLService) {}

   async getModules(): Promise<ModuleResDto[]> {
      const result = await this.srvMSSQL.executeProcedure("spGetModules");

      const resultMapper: ModuleResDto[] = JSON.parse(result.JSON);

      return resultMapper;
   }

   async getModule(pId: string): Promise<ModuleResDto> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piModuleId",
            typeVariable: UniqueIdentifier,
            value: pId,
         },
      ];
      const result = await this.srvMSSQL.executeProcedure(
         "spGetModule",
         parameters,
      );

      const resultMapper: ModuleResDto[] = JSON.parse(result.JSON);

      return resultMapper[0];
   }

   async createModule(pBody: CreateModuleReqDto): Promise<ModuleResDto> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piName",
            typeVariable: VarChar(300),
            value: pBody.Name,
         },
         {
            variableName: "piCreationDate",
            typeVariable: DateTime,
            value: pBody.CreationDate,
         },
         {
            variableName: "piIsActive",
            typeVariable: Bit,
            value: pBody.IsActive,
         },
         {
            variableName: "piFkCompanyId",
            typeVariable: UniqueIdentifier,
            value: pBody.FkCompanyId,
         },
         {
            variableName: "piFkUserId",
            typeVariable: UniqueIdentifier,
            value: pBody.FkUserId,
         },
      ];

      const result = await this.srvMSSQL.executeProcedure(
         "spCreateModule",
         parameters,
      );

      const resultMapper: ModuleResDto[] = JSON.parse(result.JSON);

      return resultMapper[0];
   }

   async updateModule(
      pId: string,
      pBody: UpdateModuleReqDto,
   ): Promise<ModuleResDto> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piModuleId",
            typeVariable: UniqueIdentifier,
            value: pId,
         },
         {
            variableName: "piName",
            typeVariable: VarChar(100),
            value: pBody.Name,
         },
         {
            variableName: "piIsActive",
            typeVariable: Bit,
            value: pBody.IsActive,
         },
         {
            variableName: "piFkCompanyId",
            typeVariable: UniqueIdentifier,
            value: pBody.FkCompanyId,
         },
         {
            variableName: "piFkUserId",
            typeVariable: UniqueIdentifier,
            value: pBody.FkUserId,
         },
      ];

      const result = await this.srvMSSQL.executeProcedure(
         "spUpdateModule",
         parameters,
      );

      const resultMapper: ModuleResDto[] = JSON.parse(result.JSON);

      return resultMapper[0];
   }

   async deleteModule(pId: string): Promise<boolean> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piModuleId",
            typeVariable: UniqueIdentifier,
            value: pId,
         },
      ];

      return await this.srvMSSQL.executeProcedureIsSuccess(
         "spDeleteModule",
         parameters,
      );
   }
}
