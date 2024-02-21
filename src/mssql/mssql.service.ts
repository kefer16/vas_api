import {
   HttpException,
   HttpStatus,
   Injectable,
   OnModuleDestroy,
} from "@nestjs/common";
import { ConnectionPool, ISqlType, Request, Transaction } from "mssql";

export interface ProcedureParameter {
   variableName: string;
   typeVariable: (() => ISqlType) | ISqlType;
   value: string | number | boolean | Date;
}

@Injectable()
export class MSSQLService implements OnModuleDestroy {
   private pool: ConnectionPool;

   private async createConnection() {
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

   async getConnection() {
      if (!this.pool) {
         await this.createConnection();
      }
      return this.pool;
   }

   async onModuleDestroy() {
      console.log("cierra conexion");

      await this.pool.close();
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
      pTransacction?: Transaction,
   ): Promise<boolean> {
      try {
         const request = pTransacction
            ? new Request(pTransacction)
            : new Request();

         parameters.forEach((item: ProcedureParameter) => {
            request.input(item.variableName, item.typeVariable, item.value);
         });
         await request.execute(nameProcedure);

         return true;
      } catch (error) {
         if (pTransacction) {
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
      pOperations: (pTransacction: Transaction) => Promise<boolean>,
   ): Promise<boolean> {
      const connection = await this.getConnection();
      const transaction = new Transaction(connection);
      try {
         await transaction.begin();
         await pOperations(transaction);
         await transaction.commit();
         return true;
      } catch (error) {
         console.log("entra a rollback");

         await transaction.rollback();
         console.log(error.message);

         throw new HttpException(
            pMessageValidation,
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      } finally {
         // await this.pool.close();
      }
   }

   async executeProcedureCount(
      nameProcedure: string,
      parameters: ProcedureParameter[],
   ): Promise<number> {
      try {
         // await this.connect();
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
