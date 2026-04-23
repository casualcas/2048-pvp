import { useState, useCallback } from 'react';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { PublicKey } from '@solana/web3.js';
import { toUint8Array } from 'js-base64';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WALLET_KEY = 'wallet_pubkey_2048pvp';

const APP_IDENTITY = {
  name: '2048 PvP',
  uri: 'https://casualcas.github.io/2048-pvp/',
};

export function useWalletAuth() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = useCallback(async (): Promise<string | null> => {
    setLoading(true);
    try {
      const account = await transact(async (wallet) => {
        const authResult = await wallet.authorize({
          identity: APP_IDENTITY,
          chain: 'solana:mainnet',
        });
        const firstAccount = authResult.accounts[0];
        return {
          address: firstAccount.address,
          publicKey: new PublicKey(toUint8Array(firstAccount.address)),
        };
      });

      const pubkey = account.publicKey.toBase58();
      await AsyncStorage.setItem(WALLET_KEY, pubkey);
      setWalletAddress(pubkey);
      return pubkey;
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
