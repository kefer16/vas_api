import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { HttpExceptionFilter } from "./http-exception/http-exception.filter";

async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   app.useGlobalFilters(new HttpExceptionFilter());
   const config = new DocumentBuilder()
      .setTitle("Api Vas")
      .setDescription("API Rest para uso exclusivo del aplicativo Vas")
      .setVersion("1.0")
      .addBearerAuth()
      .setExternalDoc("JSON", "api-json")
      .build();
   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup("api", app, document);
   await app.listen(3000);
}
bootstrap();
