import { useState, useCallback, useEffect } from 'react';
import { useMobileWallet } from '../utils/useMobileWallet';
import { useAuthorization } from '../utils/useAuthorization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WALLET_KEY = 'wallet_pubkey_2048pvp';

export function useWalletAuth() {
  const { connect, disconnect } = useMobileWallet();
  const { selectedAccount } = useAuthorization();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Синхронизируем с selectedAccount
  useEffect(() => {
    if (selectedAccount?.publicKey) {
      const addr = selectedAccount.publicKey.toBase58();
      setWalletAddress(addr);
      AsyncStorage.setItem(WALLET_KEY, addr);
    }
  }, [selectedAccount]);

  const connectWallet = useCallback(async (): Promise<string | null> => {
    setLoading(true);
    try {
      const account = await connect();
      if (account?.publicKey) {
        const addr = account.publicKey.toBase58();
        await AsyncStorage.setItem(WALLET_KEY, addr);
        setWalletAddress(addr);
        return addr;
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
  }, [connect]);

  const disconnectWallet = useCallback(async () => {
    try {
      await disconnect();
    } catch (e) {
      console.warn('Disconnect error:', e);
    }
    await AsyncStorage.removeItem(WALLET_KEY);
    setWalletAddress(null);
  }, [disconnect]);

  const loadSavedWallet = useCallback(async () => {
    const saved = await AsyncStorage.getItem(WALLET_KEY);
    if (saved) setWalletAddress(saved);
    return saved;
  }, []);

  return { walletAddress, loading, connectWallet, disconnectWallet, loadSavedWallet };
}
