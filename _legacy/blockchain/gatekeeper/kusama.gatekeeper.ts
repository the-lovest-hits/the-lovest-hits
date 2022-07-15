import { Gatekeeper } from './gatekeeper';
import { Injectable, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '../../config/config.module';
import { WsProvider } from '@polkadot/api';

@Injectable()
export class KusamaGatekeeper extends Gatekeeper {}

@Module({
  imports: [
    Gatekeeper.HttpModule((configService: ConfigService<Config>) => ({
      baseURL: configService.get<Config['unique']>('unique').webGate,
      headers: {
        Authorization: 'Seed ' + configService.get<Config['unique']>('unique').seed,
      },
    })),
  ],
  providers: [
    Gatekeeper.Connect<KusamaGatekeeper>(KusamaGatekeeper, (configService) => {
      const { wss } = configService.get<Config['kusama']>('kusama');
      const provider = new WsProvider(wss);
      return {
        provider,
      }
    },
      (configService) => {
        return configService.get<Config['unique']>('unique').seed; // todo seed
      },
    ),

  ],
  exports: [
    KusamaGatekeeper,
  ],
})
export class KusamaGatekeeperModule {}
