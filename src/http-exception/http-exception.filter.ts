import {
   ArgumentsHost,
   Catch,
   ExceptionFilter,
   HttpException,
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
   catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      // const request = ctx.getRequest<Request>();
      const status = exception.getStatus();

      response.status(status).json({
         code: status,
         data: null,
         error: {
            isValidate: true,
            code: "0",
            message: exception.message,
         },
      });
   }
}
