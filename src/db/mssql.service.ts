import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConnectionPool, ISqlType } from "mssql";

export interface ProcedureParameter {
   variableName: string;
   typeVariable: (() => ISqlType) | ISqlType;
   value: string | number | boolean | Date;
}

@Injectable()
export class MSSQLService {
   private pool: ConnectionPool;

   constructor() {
      this.connect();
   }

   private async connect() {
      try {
         this.pool = await new ConnectionPool({
            user: process.env.DB_USER ?? "",
            password: process.env.DB_PASSWORD ?? "",
            server: process.env.DB_SERVER ?? "",
            database: process.env.DB_NAME ?? "",
            port: Number(process.env.DB_PORT) ?? 0,
            options: {
               encrypt: true,
               trustServerCertificate: true,
            },
         }).connect();
         console.log("Conexión a MSSQL establecida");
      } catch (error) {
         console.error("Error al conectar a MSSQL:", error.message);
      }
   }

   async executeProcedure(
      nameProcedure: string,
      parameters: ProcedureParameter[] = [],
   ): Promise<any> {
      try {
         const request = this.pool.request();
         parameters.forEach((item: ProcedureParameter) => {
            request.input(item.variableName, item.typeVariable, item.value);
         });
         const result = await request.execute(nameProcedure);

         return result.recordset[0];
      } catch (error) {
         throw new HttpException(
            `Error al ejecutar la consulta: ${error.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      }
   }

   async executeProcedureList(
      nameProcedure: string,
      parameters: ProcedureParameter[] = [],
   ): Promise<any> {
      try {
         const request = this.pool.request();
         parameters.forEach((item: ProcedureParameter) => {
            request.input(item.variableName, item.typeVariable, item.value);
         });
         const result = await request.execute(nameProcedure);
         return result.recordset;
      } catch (error) {
         throw new HttpException(
            `Error al ejecutar la consulta: ${error.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      }
   }

   async executeProcedureIsSuccess(
      nameProcedure: string,
      parameters: ProcedureParameter[],
   ): Promise<boolean> {
      try {
         const request = this.pool.request();
         parameters.forEach((item: ProcedureParameter) => {
            request.input(item.variableName, item.typeVariable, item.value);
         });
         await request.execute(nameProcedure);

         return true;
      } catch (error) {
         throw new HttpException(
            `Error al ejecutar la consulta: ${error.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      }
   }
}
