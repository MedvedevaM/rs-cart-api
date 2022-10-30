import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import {Handler } from 'aws-lambda';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

let cachedServer;

export const handler: Handler = async (event, context) => {
  if (!cachedServer) {
    const nestApp = await NestFactory.create(AppModule);
    await nestApp.init();
    cachedServer = serverlessExpress({ app: nestApp.getHttpAdapter().getInstance() });
  }

  return cachedServer(event, context);
}