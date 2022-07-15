import { Global, Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from '../../entities/genre';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/config.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Genre,
    ]),
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService<Config>) => {
        return {
          baseURL: configService.get<Config['unique']>('unique').webGate,
          headers: {
            Authorization: 'Seed ' + configService.get<Config['unique']>('unique').seed,
          },
        }
      },
      inject: [
        ConfigService,
      ]
    }),
  ],
  providers: [
    BlockchainService,
  ],
  exports: [
    BlockchainService,
  ],
})
export class BlockchainModule {}
