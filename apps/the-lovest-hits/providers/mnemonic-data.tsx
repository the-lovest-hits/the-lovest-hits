import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  exportKeyfile,
  generateMnemonicData
} from "../shared/services/generate-mnemonic.service";

interface MnemonicData {
  mnemonic: string;
  seed: string;
  seedBytes: Uint8Array;
  json?: string;
}

interface AccountContext extends MnemonicData{
  generateMnemonic: () => void;
}

const MnemonicDataContext = createContext<AccountContext>(null);

export const useMnemonicData = () => useContext(MnemonicDataContext);

export const MnemonicDataProvider = ({ children }) => {
  const [mnemonicData, setMnemonicData] = useState<MnemonicData>(() => generateMnemonicData());

  const generateMnemonic = async () => {
    return setMnemonicData(() => generateMnemonicData());
  };

  useEffect(() => {
    const fetchKeyJson = async () => {
      const json = await exportKeyfile(mnemonicData.seedBytes);

      setMnemonicData(mnemonicData => ({...mnemonicData, json}));
    }

    fetchKeyJson().catch(console.error);
  }, []);

  return (
    <MnemonicDataContext.Provider
      value={{ ...mnemonicData, generateMnemonic }}
    >
      {children}
    </MnemonicDataContext.Provider>
  );
};
