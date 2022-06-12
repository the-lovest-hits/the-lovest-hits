import { KeyringPair$Json } from '@polkadot/keyring/types';
import { SignatureType } from '@unique-nft/sdk/types';

export interface KeyfileSignerOptions {
  keyfile: KeyringPair$Json;
  passwordCallback: () => Promise<string>;
  type?: SignatureType;
}
