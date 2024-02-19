import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConnectionPool, ISqlType, Transaction } from "mssql";

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
         await this.connect();
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
         await this.connect();
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
      pIsTransacction?: boolean,
   ): Promise<boolean> {
      try {
         const request = this.pool.request();
         console.log(request.parameters);
         parameters.forEach((item: ProcedureParameter) => {
            request.input(item.variableName, item.typeVariable, item.value);
         });
         await request.execute(nameProcedure);

         return true;
      } catch (error) {
         if (pIsTransacction) {
            throw error;
         } else {
            throw new HttpException(
               `Error al ejecutar la consulta: ${error.message}`,
               HttpStatus.INTERNAL_SERVER_ERROR,
            );
         }
      }
   }

   async executeTransacctionIsSuccess(
      pMessageValidation: string,
      pOperations: () => Promise<boolean>,
   ): Promise<boolean> {
      await this.connect();
      const transaction = new Transaction(this.pool);
      try {
         await transaction.begin();
         await pOperations();
         console.log("antes del commit");

         await transaction.commit();
         console.log("despues del commit");
         return true;
      } catch (error) {
         await transaction.rollback();
         throw new HttpException(
            pMessageValidation,
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      } finally {
         await this.pool.close();
      }
   }

   async executeProcedureCount(
      nameProcedure: string,
      parameters: ProcedureParameter[],
   ): Promise<number> {
      try {
         await this.connect();
         const request = this.pool.request();
         parameters.forEach((item: ProcedureParameter) => {
            request.input(item.variableName, item.typeVariable, item.value);
         });
         const result = await request.execute(nameProcedure);
         return result.recordset[0].COUNT;
      } catch (error) {
         throw new HttpException(
            `Error al ejecutar la consulta: ${error.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      }
   }

   async executeProcedureJSON(
      nameProcedure: string,
      parameters: ProcedureParameter[],
   ): Promise<string> {
      try {
         await this.connect();
         const request = this.pool.request();
         parameters.forEach((item: ProcedureParameter) => {
            request.input(item.variableName, item.typeVariable, item.value);
         });
         const result = await request.execute(nameProcedure);
         return result.recordset[0].JSON;
      } catch (error) {
         throw new HttpException(
            `Error al ejecutar la consulta: ${error.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      }
   }
}
