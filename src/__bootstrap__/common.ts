import { Reflector } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { urlencoded, json } from 'express';
import { BaseResponseExceptionFilter } from '../__helpers__';

export function createCommonServerStart(app: INestApplication) {
  app
    .setGlobalPrefix('api')
    .use(json())
    .use(urlencoded({ extended: true }))
    .enableVersioning({ type: VersioningType.URI })
    .useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
    .useGlobalFilters(new BaseResponseExceptionFilter())
    .useGlobalInterceptors(
      new ClassSerializerInterceptor(new Reflector(), {
        strategy: 'excludeAll',
      }),
    );
}
