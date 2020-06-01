import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import session from 'express-session';
import { SESSION_SECRET } from './constants';
import Store from 'connect-redis';
import redis from 'redis';
// const session = require('express-session');

dotenv.config();

async function bootstrap() {

  const RedisStore = Store(session);
  const redisClient = redis.createClient();
  const app = await NestFactory.create(AppModule);
  app.use(session({
    store: new RedisStore({client:redisClient}),
    name: 'votingapp',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly:true, secure: false,  maxAge: 60 * 60 * 10 }
  }))
  await app.listen(3000);
}
bootstrap();
