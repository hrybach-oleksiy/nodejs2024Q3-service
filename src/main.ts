import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';

import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import * as jsYaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const filePath = path.resolve(process.cwd(), 'doc', 'api.yaml');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const swaggerObject = jsYaml.load(fileContent) as OpenAPIObject;
  SwaggerModule.setup('/doc', app, swaggerObject);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
