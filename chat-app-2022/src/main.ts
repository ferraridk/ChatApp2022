import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as http from "http";

async function bootstrap() {
  const SocketIo = require("socket.io")(http);
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
