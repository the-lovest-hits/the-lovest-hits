import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import { Sdk } from '@unique-nft/sdk';
import { createSigner } from '@unique-nft/sdk/sign';
import '@unique-nft/sdk/state-queries';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/balance';

import { Config } from './modules/config/config.module';

export class KusamaSdk extends Sdk {

}

export const kusamaSdkProvider: Provider = {
  inject: [ConfigService],
  provide: KusamaSdk,
  useFactory: async (configService: ConfigService<Config>) => {

    const { seed } = configService.get<Config['unique']>('unique');
    const { wss } = configService.get<Config['kusama']>('kusama');

    const signer = await createSigner({
      seed,
    });

    const sdk = new Sdk({
      signer,
      chainWsUrl: wss,
      ipfsGatewayUrl: 'https://ipfs.unique.network/ipfs',
    });

    await sdk.isReady;

    return sdk;
  },
};
