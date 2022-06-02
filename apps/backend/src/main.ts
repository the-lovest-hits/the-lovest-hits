/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Config } from './app/modules/config/config.module';
import { BlockchainModule } from './app/modules/blockchain/blockchain.module';
import { BlockchainService } from './app/modules/blockchain/blockchain.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService<Config> = app.get(ConfigService);
  let globalPrefix = '';
  if (config.get('prefix')) {
    globalPrefix = config.get('prefix');
    app.setGlobalPrefix(globalPrefix);
  }

  // todo remove this
  // const collectionId = config.get('unique').collectionId;
  // const bc = app.select(BlockchainModule).get(BlockchainService);
  // // @ts-ignore
  // const collection = (await bc.uniqueGatekeeper.rpc.unique.collectionById(+collectionId)).toHuman();
  // if (!collection) {
  //   bc.createRootCollection().then((createCollectionId) => {
  //     console.log('UNIQUE_COLLECTION_ID=', createCollectionId);
  //   });
  //   return;
  // }

  const port = config.get('port');
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
