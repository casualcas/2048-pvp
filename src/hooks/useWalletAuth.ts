import { useState, useCallback } from 'react';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WALLET_KEY = 'wallet_pubkey_2048pvp';

export function useWalletAuth() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = useCallback(async (): Promise<string | null> => {
    setLoading(true);
    try {
      const authResult = await transact(async (wallet) => {
        return await wallet.authorize({
          cluster: __DEV__ ? 'devnet' : 'mainnet-beta',
          identity: {
            name: '2048 PvP',
            uri: 'https://casualcas.github.io/2048-pvp/',
            icon: 'https://casualcas.github.io/2048-pvp/assets/icon.png',
          },
        });
      });

      console.log('Auth result keys:', Object.keys(authResult));
      console.log('Accounts:', JSON.stringify(authResult.accounts));

      // publicKey доступен напрямую в web3js wrapper
      const account = authResult.accounts[0];
      const pubkey = (account as any).publicKey?.toBase58?.() 
        || (account as any).address 
        || '';
      
      console.log('Pubkey:', pubkey);
      
      if (pubkey) {
        await AsyncStorage.setItem(WALLET_KEY, pubkey);
        setWalletAddress(pubkey);
        return pubkey;
      }
      return null;
    } catch (e: any) {
      console.warn('Wallet connect error:', e?.message || e);
      if (e?.message?.includes('No wallet') || e?.errorCode === 'ERROR_WALLET_NOT_FOUND') {
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
