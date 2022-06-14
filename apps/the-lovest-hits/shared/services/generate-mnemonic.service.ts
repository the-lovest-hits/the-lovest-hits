import { Keyring } from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import {
  mnemonicGenerate,
  mnemonicToMiniSecret,
  cryptoWaitReady,
} from '@polkadot/util-crypto';

export const generateMnemonicData = () => {
  const mnemonic = mnemonicGenerate();
  const seedBytes = mnemonicToMiniSecret(mnemonic);
  const seed = u8aToHex(seedBytes);

  return ({
    mnemonic,
    seedBytes,
    seed,
  });
}

export async function exportKeyfile(seedBytes: Uint8Array): Promise<string> {
  await cryptoWaitReady();

  const account = new Keyring({ type: 'sr25519' }).addFromSeed(seedBytes);

  return JSON.stringify(account.toJson());
}

export function downloadKeyFile(content: BlobPart, fileName: string): void {
  const a = document.createElement("a");
  const file = new Blob([content], {type: 'application/json'});

  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
