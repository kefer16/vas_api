import { Injectable } from "@nestjs/common";
import { ResponseResDto } from "./response-res.dto";
import { ErrorResDto } from "src/errors/error-res.dto";

@Injectable()
export class ResponsesService<TData> {
   repuestaCorrecta(_data: TData): ResponseResDto<TData> {
      const result = new ResponseResDto<TData>();
      result.code = 200;
      result.data = _data;
      result.error = new ErrorResDto(false, "0", "");
      return result;
   }
}
