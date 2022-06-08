import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import { Sdk } from '@unique-nft/sdk';
import { createSigner } from '@unique-nft/sdk/sign';
import '@unique-nft/sdk/state-queries';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/balance';

import { Config } from './modules/config/config.module';

export class UniqueSdk extends Sdk {}

export const uniqueSdkProvider: Provider = {
  inject: [ConfigService],
  provide: UniqueSdk,
  useFactory: async (configService: ConfigService<Config>) => {

    const { seed, wss } = configService.get<Config['unique']>('unique');

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
