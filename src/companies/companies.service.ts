import { Injectable } from "@nestjs/common";
import { MSSQLService, ProcedureParameter } from "src/mssql/mssql.service";
import { GetCompaniesResDto } from "./dto/responses/get-companies-res.dto";
import { GetCompanyResDto } from "./dto/responses/get-company-res.dto";
import { CreateCompanyResDto } from "./dto/responses/create-company-res.dto";
import { CreateCompanyReqDto } from "./dto/requests/create-company-req.dto";
import { UpdateCompanyResDto } from "./dto/responses/update-company-res.dto";
import { UpdateCompanyReqDto } from "./dto/requests/update-company-req.dto";
import { Bit, DateTime, UniqueIdentifier, VarChar } from "mssql";

@Injectable()
export class CompaniesService {
   constructor(private srvMSSQL: MSSQLService) {}

   async getCompanies(): Promise<GetCompaniesResDto[]> {
      const connection = await this.srvMSSQL.createConnection();
      const result = await this.srvMSSQL.executeProcedureList(
         "spGetCompanies",
         [],
         connection,
      );

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
      const connection = await this.srvMSSQL.createConnection();
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piCompanyIda",
            typeVariable: UniqueIdentifier,
            value: pId,
         },
      ];
      const result = await this.srvMSSQL.executeProcedure(
         "spGetCompany",
         parameters,
         connection,
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
      const connection = await this.srvMSSQL.createConnection();
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

      const result = await this.srvMSSQL.executeProcedure(
         "spCreateCompany",
         parameters,
         connection,
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
      const connection = await this.srvMSSQL.createConnection();
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

      const result = await this.srvMSSQL.executeProcedure(
         "spUpdateCompany",
         parameters,
         connection,
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
      const connection = await this.srvMSSQL.createConnection();
      const parameters: ProcedureParameter[] = [
         {
            variableName: "piCompanyId",
            typeVariable: UniqueIdentifier,
            value: pId,
         },
      ];

      return await this.srvMSSQL.executeProcedureIsSuccess(
         "spDeleteCompany",
         parameters,
         connection,
      );
   }
}
