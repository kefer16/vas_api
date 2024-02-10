import { Injectable } from "@nestjs/common";
import { MSSQLService, ProcedureParameter } from "src/db/mssql.service";
import { GetCompaniesResDto } from "./dto/responses/get-companies-res.dto";
import { GetCompanyResDto } from "./dto/responses/get-company-res.dto";
import { CreateCompanyResDto } from "./dto/responses/create-company-res.dto";
import { CreateCompanyReqDto } from "./dto/requests/create-company-req.dto";
import { UpdateCompanyResDto } from "./dto/responses/update-company-res.dto";
import { UpdateCompanyReqDto } from "./dto/requests/update-company-req.dto";
import { Bit, DateTime, UniqueIdentifier, VarChar } from "mssql";

@Injectable()
export class CompaniesService {
   constructor(private mssql: MSSQLService) {}

   async getCompanies(): Promise<GetCompaniesResDto[]> {
      const result = await this.mssql.executeProcedureList("spGetCompanies");

      const resultMapper: GetCompaniesResDto[] = result.map(
         (item) =>
            ({
               CompanyId: item.CompanyId ?? "",
               Name: item.Name ?? "",
               Email: item.Email ?? "",
               CreationDate: item.CreationDate ?? new Date(),
               IsActive: item.IsActive ?? false,
            }) as GetCompaniesResDto,
      );

      return resultMapper;
   }

   async getCompany(pId: string): Promise<GetCompanyResDto> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piCompanyIda",
            typeVariable: UniqueIdentifier,
            value: pId,
         },
      ];
      const result = await this.mssql.executeProcedure(
         "spGetCompany",
         parameters,
      );

      const resultMapper: UpdateCompanyResDto = {
         CompanyId: result.CompanyId ?? "",
         Name: result.Name ?? "",
         Email: result.Email ?? "",
         CreationDate: result.CreationDate ?? new Date(),
         IsActive: result.IsActive ?? false,
      };

      return resultMapper;
   }

   async createCompany(
      pBody: CreateCompanyReqDto,
   ): Promise<CreateCompanyResDto> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piName",
            typeVariable: VarChar(300),
            value: pBody.Name,
         },
         {
            variableName: "piEmail",
            typeVariable: VarChar(500),
            value: pBody.Email,
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
      ];

      const result = await this.mssql.executeProcedure(
         "spCreateCompany",
         parameters,
      );

      const resultMapper: CreateCompanyResDto = {
         CompanyId: result.CompanyId ?? "",
         Name: result.Name ?? "",
         Email: result.Email ?? "",
         CreationDate: result.CreationDate ?? new Date(),
         IsActive: result.IsActive ?? false,
      };

      return resultMapper;
   }

   async updateCompany(
      pId: string,
      pBody: UpdateCompanyReqDto,
   ): Promise<UpdateCompanyResDto> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piCompanyId",
            typeVariable: UniqueIdentifier,
            value: pId,
         },
         {
            variableName: "piName",
            typeVariable: VarChar(300),
            value: pBody.Name,
         },
         {
            variableName: "piEmail",
            typeVariable: VarChar(500),
            value: pBody.Email,
         },
         {
            variableName: "piIsActive",
            typeVariable: Bit,
            value: pBody.IsActive,
         },
      ];

      const result = await this.mssql.executeProcedure(
         "spUpdateCompany",
         parameters,
      );

      const resultMapper: UpdateCompanyResDto = {
         CompanyId: result.CompanyId ?? "",
         Name: result.Name ?? "",
         Email: result.Email ?? "",
         CreationDate: result.CreationDate ?? new Date(),
         IsActive: result.IsActive ?? false,
      };

      return resultMapper;
   }

   async deleteCompany(pId: string): Promise<boolean> {
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piCompanyId",
            typeVariable: UniqueIdentifier,
            value: pId,
         },
      ];

      return await this.mssql.executeProcedureIsSuccess(
         "spDeleteCompany",
         parameters,
      );
   }
}
