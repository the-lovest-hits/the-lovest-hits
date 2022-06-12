import { Keyring } from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import {
  mnemonicGenerate,
  mnemonicToMiniSecret,
  cryptoWaitReady,
} from '@polkadot/util-crypto';

const mnemonic = mnemonicGenerate();
const mnemonic2 = 'grief catch uphold series shuffle silly always impact feel ready leopard gloom';
console.log(`mnemonic: ${mnemonic}`);
console.log(`mnemonic: ${mnemonic2}`);

const seedBytes = mnemonicToMiniSecret(mnemonic2);
const seedString = u8aToHex(seedBytes);
console.log(`seed: ${seedString}`);

export async function exportKeyfile() {
  await cryptoWaitReady();

  const account = new Keyring({ type: 'sr25519' }).addFromSeed(seedBytes);
  const keyfile = account.toJson();
  console.log(`keyfile:`, keyfile);
}

// exportKeyfile();
