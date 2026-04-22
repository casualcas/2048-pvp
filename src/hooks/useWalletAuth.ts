import { useState, useCallback } from 'react';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WALLET_KEY = 'wallet_pubkey_2048pvp';

export function useWalletAuth() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = useCallback(async (): Promise<string | null> => {
    setLoading(true);
    try {
      const result = await transact(async (wallet) => {
        const authResult = await wallet.authorize({
          cluster: __DEV__ ? 'devnet' : 'mainnet-beta',
          identity: {
            name: '2048 PvP',
            uri: 'https://casualcas.github.io/2048-pvp/',
            icon: 'https://casualcas.github.io/2048-pvp/assets/icon.png',
          },
        });
        console.log('Auth result:', JSON.stringify(authResult.accounts[0]));
        const address = authResult.accounts[0].address;
        console.log('Address type:', typeof address, 'value:', address);
        try {
          const pubkeyBytes = Buffer.from(address, 'base64');
          const pk = new PublicKey(pubkeyBytes).toBase58();
          console.log('Pubkey:', pk);
          return pk;
        } catch(e) {
          console.log('Buffer decode failed, trying direct:', e);
          return address as string;
        }
      });
      const pubkey = result as string;
      console.log('Final pubkey:', pubkey);
      await AsyncStorage.setItem(WALLET_KEY, pubkey);
      setWalletAddress(pubkey);
      return pubkey;
    } catch (e: any) {
      console.warn('Wallet connect error:', e);
      if (e?.message?.includes('No wallet found') || e?.errorCode === 'ERROR_WALLET_NOT_FOUND') {
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
