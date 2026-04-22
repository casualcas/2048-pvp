import { useState, useCallback } from 'react';
import { transact } from '@wallet-ui/react-native-web3js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WALLET_KEY = 'wallet_pubkey_2048pvp';

const APP_IDENTITY = {
  name: '2048 PvP',
  uri: 'https://casualcas.github.io/2048-pvp/',
  icon: 'https://casualcas.github.io/2048-pvp/assets/icon.png',
};

export function useWalletAuth() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = useCallback(async (): Promise<string | null> => {
    setLoading(true);
    try {
      const result = await transact(async (wallet) => {
        const authResult = await wallet.authorize({
          cluster: 'mainnet-beta',
          identity: APP_IDENTITY,
        });
        return authResult.accounts[0].address;
      });

      const pubkey = result as string;
      console.log('Connected wallet:', pubkey);

      if (pubkey) {
        await AsyncStorage.setItem(WALLET_KEY, pubkey);
        setWalletAddress(pubkey);
        return pubkey;
      }
      return null;
    } catch (e: any) {
      console.warn('Wallet connect error:', e?.message || e);
      if (e?.message?.includes('No wallet') || e?.message?.includes('not found')) {
        throw new Error('NO_WALLET');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    await AsyncStorage.removeItem(WALLET_KEY);
    setWalletAddress(null);
  }, []);

  const loadSavedWallet = useCallback(async () => {
    const saved = await AsyncStorage.getItem(WALLET_KEY);
    if (saved) setWalletAddress(saved);
    return saved;
  }, []);

  return { walletAddress, loading, connectWallet, disconnectWallet, loadSavedWallet };
}
