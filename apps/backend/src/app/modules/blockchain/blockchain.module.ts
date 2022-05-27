import { forwardRef, Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/config.module';
import { ArtistsModule } from '../artists/artists.module';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { unique } from '@unique-nft/types/definitions';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService<Config>) => ({
        baseURL: configService.get<Config['unique']>('unique').webGate,
        headers: {
          Authorization: 'Seed ' + configService.get<Config['unique']>('unique').seed,
        },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => ArtistsModule),
  ],
  providers: [
    {
      provide: ApiPromise,
      useFactory: async (configService: ConfigService<Config>) => {

        const { wss } = configService.get<Config['unique']>('unique');

        const provider = new WsProvider(wss);

        const api = new ApiPromise({
          provider,
          rpc: {
            unique: unique.rpc,
          },
        });

        await api.isReady
        return api;
      },
      inject: [ConfigService],
    },
    BlockchainService,
  ],
  exports: [
    BlockchainService,
  ],
})
export class BlockchainModule {}
