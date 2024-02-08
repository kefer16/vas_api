import { Injectable } from "@nestjs/common";
import * as sql from "mssql";

export interface ProcedureParameter {
   variableName: string;
   typeVariable: sql.Int | sql.Varchar;
   value: string;
}

@Injectable()
export class MSSQLService {
   private pool: sql.ConnectionPool;

   constructor() {
      this.connect();
   }

   private async connect() {
      try {
         this.pool = await new sql.ConnectionPool({
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
      parameters: ProcedureParameter[],
   ): Promise<any> {
      try {
         const request = this.pool.request();
         parameters.forEach((item: ProcedureParameter) => {
            request.input(item.variableName, item.typeVariable, item.value);
         });
         const result = await request.execute(nameProcedure);

         return result.recordset[0];
      } catch (error) {
         console.error("Error al ejecutar la consulta:", error.message);
      }
   }

   async executeProcedureList(
      nameProcedure: string,
      parameters: ProcedureParameter[],
   ): Promise<any> {
      try {
         const request = this.pool.request();
         parameters.forEach((item: ProcedureParameter) => {
            request.input(item.variableName, item.typeVariable, item.value);
         });
         const result = await request.execute(nameProcedure);
         return result.recordset;
      } catch (error) {
         console.error("Error al ejecutar la consulta:", error.message);
      }
   }
}
