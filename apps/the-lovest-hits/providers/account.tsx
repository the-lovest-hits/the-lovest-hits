import { createContext, useContext, useEffect, useState } from 'react';



interface Account {
  name: string;
  address: string;
  signer: any;
}

interface AccountContext {
  active: Account | null;
  accounts: Account[];
  setAccounts: (accounts: Account[]) => void;
  setActive: (account: Account) => void;
  enablePolkadotApp: () => void;
  addAccount: (account: Account) => void;
}

export const AccountContext = createContext<AccountContext>({
  active: null,
  accounts: [],
  setAccounts: () => {},
  setActive: () => {},
  enablePolkadotApp: () => {},
  addAccount: () => {},
});
export const useAccount = () => useContext(AccountContext);

const POLKADOT_ENABLED_KEY = 'polkadot-enabled'

export const AccountProvider = ({ children }) => {
  const [ accounts, setAccounts ] = useState<Account[]>([]);
  const [ active, setActive ] = useState<Account>(null);

  async function enablePolkadotApp() {
    localStorage.setItem(POLKADOT_ENABLED_KEY, 'true');
    const { web3Enable, web3Accounts, web3FromAddress } = await import('@polkadot/extension-dapp');
    await web3Enable('The Lovest Hits');
    const allAccounts = await web3Accounts();
    allAccounts.forEach(({ address, meta }) => {
      (async () => {
        const injector = await web3FromAddress(address);
        addAccount({ address, name: meta.name, signer: injector.signer });
      })();
    });
  }

  function addAccount(account: Account) {
    // todo normalize address
    setAccounts([
      ... accounts,
      account,
    ]);
  }

  useEffect(() => {
    if (accounts.length && !active) {
      setActive(accounts[0]);
    }
  }, [ accounts, active ]);

  useEffect(()  => {
    if (localStorage.getItem(POLKADOT_ENABLED_KEY)) {
      enablePolkadotApp();
    }
  }, [ ]);

  return (
    <AccountContext.Provider
      value={{ active, accounts, setAccounts, setActive, enablePolkadotApp, addAccount }}
    >
      {children}
    </AccountContext.Provider>
  );
};
