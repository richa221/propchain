import React, { createContext, useContext, useEffect, useState } from 'react';

type WalletContextType = {
  account: string | null;
  connectMetaMask: () => Promise<void>;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(() => {
    try {
      return localStorage.getItem('connectedAccount');
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (account) localStorage.setItem('connectedAccount', account);
      else localStorage.removeItem('connectedAccount');
    } catch {}
  }, [account]);

  useEffect(() => {
    const anyWin = window as any;
    const eth = anyWin?.ethereum;
    if (!eth || !eth.on) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (Array.isArray(accounts) && accounts.length > 0) setAccount(accounts[0]);
      else setAccount(null);
    };

    eth.on('accountsChanged', handleAccountsChanged);
    return () => {
      try {
        eth.removeListener?.('accountsChanged', handleAccountsChanged);
      } catch {}
    };
  }, []);

  const connectMetaMask = async () => {
    const anyWin = window as any;
    const eth = anyWin?.ethereum;
    if (!eth) {
      const err: any = new Error('MetaMask not installed');
      err.code = 'NO_METAMASK';
      throw err;
    }

    try {
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length) setAccount(accounts[0]);
      else setAccount(null);
    } catch (err) {
      throw err;
    }
  };

  const disconnect = () => {
    setAccount(null);
    try {
      localStorage.removeItem('connectedAccount');
    } catch {}
  };

  return (
    <WalletContext.Provider value={{ account, connectMetaMask, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
};