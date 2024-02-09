import { Type, applyDecorators } from "@nestjs/common";
import {
   ApiBadRequestResponse,
   ApiExtraModels,
   ApiOkResponse,
   ApiUnauthorizedResponse,
   getSchemaPath,
} from "@nestjs/swagger";
import { ResponseResDto } from "./response-res.dto";
import { ErrorResDto } from "src/errors/error-res.dto";

export const ApiModelResponseArray = <TModel extends Type<any>>(
   model: TModel,
) => {
   return applyDecorators(
      ApiExtraModels(ResponseResDto, model),
      ApiOkResponse({
         schema: {
            title: "ResponseResDto",
            allOf: [
               { $ref: getSchemaPath(ResponseResDto) },
               {
                  properties: {
                     data: {
                        type: "array",
                        items: { $ref: getSchemaPath(model) },
                     },
                  },
               },
            ],
         },
      }),
      ApiBadRequestResponse({
         schema: {
            title: "ResponseResDto",
            type: "object",
            properties: {
               code: { type: "number", default: 400 },
               data: { type: "array", default: null },
               error: { $ref: getSchemaPath(ErrorResDto) },
            },
         },
      }),
      ApiUnauthorizedResponse({
         schema: {
            title: "ResponseResDto",
            type: "object",
            properties: {
               code: { type: "number", default: 401 },
               data: { type: "array", default: null },
               error: { $ref: getSchemaPath(ErrorResDto) },
            },
         },
      }),
   );
};

export const ApiModelResponseObject = <TModel extends Type<any>>(
   model: TModel,
) => {
   return applyDecorators(
      ApiExtraModels(ResponseResDto, model),
      ApiOkResponse({
         schema: {
            title: "RespuestaDto",
            $ref: getSchemaPath(ResponseResDto),
            properties: {
               data: {
                  $ref: getSchemaPath(model),
               },
            },
         },
      }),
      ApiBadRequestResponse({
         schema: {
            title: "ResponseResDto",
            type: "object",
            properties: {
               code: { type: "number", default: 400 },
               data: { type: "object", default: null },
               error: { $ref: getSchemaPath(ErrorResDto) },
            },
         },
      }),
      ApiUnauthorizedResponse({
         schema: {
            title: "ResponseResDto",
            type: "object",
            properties: {
               code: { type: "number", default: 401 },
               data: { type: "object", default: null },
               error: { $ref: getSchemaPath(ErrorResDto) },
            },
         },
      }),
   );
};

export const ApiModelResponse = (
   tipoDeDato: "number" | "string" | "boolean",
) => {
   return applyDecorators(
      ApiExtraModels(ResponseResDto),
      ApiOkResponse({
         schema: {
            title: "ResponseResDto",
            type: "object",

            properties: {
               code: { type: "number" },
               data: { type: tipoDeDato },
               error: { $ref: getSchemaPath(ErrorResDto) },
            },
         },
      }),
      ApiBadRequestResponse({
         schema: {
            title: "ResponseResDto",
            type: "object",
            properties: {
               code: { type: "number", default: 400 },
               data: { type: tipoDeDato, default: null },
               error: { $ref: getSchemaPath(ErrorResDto) },
            },
         },
      }),
      ApiUnauthorizedResponse({
         schema: {
            title: "ResponseResDto",
            type: "object",
            properties: {
               code: { type: "number", default: 401 },
               data: { type: tipoDeDato, default: null },
               error: { $ref: getSchemaPath(ErrorResDto) },
            },
         },
      }),
   );
};
