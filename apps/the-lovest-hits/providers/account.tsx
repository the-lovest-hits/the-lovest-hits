import { createContext, useContext, useEffect, useState } from 'react';
import { SignerPayloadJSON } from '@polkadot/types/types';

interface Account {
  name: string;
  address: string;
  sign: (payload: {
    signerPayloadJSON: SignerPayloadJSON;
    signerPayloadHex: string;
  }) => Promise<{ signature: string, type: string }>;
}

interface AccountContext {
  account: Account | null;
  accounts: Account[];
  setAccounts: (accounts: Account[]) => void;
  setActive: (account: Account) => void;
  enablePolkadotApp: () => void;
  addAccount: (account: Account) => void;
}

export const AccountContext = createContext<AccountContext>({
  account: null,
  accounts: [],
  setAccounts: () => {},
  setActive: () => {},
  enablePolkadotApp: () => {},
  addAccount: () => {},
});
export const useAccount = () => useContext(AccountContext);

const POLKADOT_ENABLED_KEY = 'polkadot-enabled';

export const AccountProvider = ({ children }) => {
  const [ accounts, setAccounts ] = useState<Account[]>([]);
  const [ account, setActive ] = useState<Account>(null);

  async function enablePolkadotApp() {
    localStorage.setItem(POLKADOT_ENABLED_KEY, 'true');
    const { web3Enable, web3Accounts, web3FromAddress } = await import('@polkadot/extension-dapp');
    await web3Enable('The Lovest Hits');
    const allAccounts = await web3Accounts();
    allAccounts.forEach(({ address, meta, type }) => {
      (async () => {
        const injector = await web3FromAddress(address);
        addAccount({
          address,
          name: meta.name,
          sign: async (payload: {
            signerPayloadJSON: SignerPayloadJSON;
            signerPayloadHex: string;
          }) => {
            const { signature } = await injector.signer.signPayload(payload.signerPayloadJSON);
            return {
              type,
              signature,
            }
          },
        });
      })();
    });
  }

  function addAccount(account: Account) {
    console.log('account', account);
    // todo normalize address
    setAccounts([
      ... accounts,
      account,
    ]);
  }

  useEffect(() => {
    if (accounts.length && !account) {
      setActive(accounts[0]);
    }
  }, [ accounts, account ]);

  useEffect(()  => {
    if (localStorage.getItem(POLKADOT_ENABLED_KEY)) {
      enablePolkadotApp();
    }
  }, [ ]);

  return (
    <AccountContext.Provider
      value={{ account, accounts, setAccounts, setActive, enablePolkadotApp, addAccount }}
    >
      {children}
    </AccountContext.Provider>
  );
};
