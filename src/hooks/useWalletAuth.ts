import { useState, useCallback } from 'react';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WALLET_KEY = 'wallet_pubkey_2048pvp';

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToBase58(bytes: Uint8Array): string {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let num = BigInt(0);
  for (const byte of bytes) {
    num = num * BigInt(256) + BigInt(byte);
  }
  let result = '';
  while (num > BigInt(0)) {
    result = ALPHABET[Number(num % BigInt(58))] + result;
    num = num / BigInt(58);
  }
  for (const byte of bytes) {
    if (byte === 0) result = '1' + result;
    else break;
  }
  return result;
}

export function useWalletAuth() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = useCallback(async (): Promise<string | null> => {
    setLoading(true);
    try {
      const pubkey = await transact(async (wallet) => {
        const authResult = await wallet.authorize({
          cluster: __DEV__ ? 'devnet' : 'mainnet-beta',
          identity: {
            name: '2048 PvP',
            uri: 'https://casualcas.github.io/2048-pvp/',
            icon: 'https://casualcas.github.io/2048-pvp/assets/icon.png',
          },
        });
        const account = authResult.accounts[0];
        console.log('Account:', JSON.stringify(account));
        const address = account.address;
        // address может быть строкой base64 или уже base58
        try {
          const bytes = base64ToUint8Array(address);
          if (bytes.length === 32) {
            return uint8ArrayToBase58(bytes);
          }
        } catch (e) {
          console.log('Not base64, using as-is');
        }
        return address;
      });
      console.log('Connected pubkey:', pubkey);
      await AsyncStorage.setItem(WALLET_KEY, pubkey);
      setWalletAddress(pubkey);
      return pubkey;
    } catch (e: any) {
      console.warn('Wallet connect error:', e);
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
