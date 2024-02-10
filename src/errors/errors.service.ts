import { Injectable } from "@nestjs/common";
import { ResponsesService } from "src/responses/responses.service";

@Injectable()
export class ErrorsService {
   obtenerFechaLocal = (): string => {
      const local = new Date();
      local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
      return local.toJSON();
   };

   obtenerArchivoError(error: any): string {
      const stackTrace = error.stack;
      const fileNameMatches = stackTrace.match(/at\s+.+\((.+):\d+:\d+\)/);

      if (fileNameMatches && fileNameMatches.length > 1) {
         const fileName = fileNameMatches[1];
         return fileName.toString();
      } else {
         return "";
      }
   }
   grabarErrorSQL(pError: Error) {
      const result = new ResponsesService<null>();

      return result.repuestaErrorSQL(true, "0", pError.message);
   }
}
