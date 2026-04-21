import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWalletAuth } from '../hooks/useWalletAuth';

interface Props {
  onStart: (nickname: string) => void;
  loading: boolean;
}

export function OnboardingScreen({ onStart, loading }: Props) {
  const [nickname, setNickname] = useState('');
  const { connectWallet, loading: walletLoading } = useWalletAuth();

  const handleWalletConnect = async () => {
    const pubkey = await connectWallet();
    if (pubkey) {
      const shortKey = pubkey.slice(0, 4) + '...' + pubkey.slice(-4);
      onStart(shortKey);
    }
  };

  const handleStart = () => {
    const name = nickname.trim() || 'Player' + Math.floor(Math.random() * 9999);
    onStart(name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.logoBox}>
          <Text style={styles.logo2048}>2048</Text>
          <Text style={styles.logoPvP}>PvP</Text>
        </View>

        <Text style={styles.desc}>Real-time 2048 battles on Solana</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="Enter your nickname..."
            placeholderTextColor="#bbada0"
            maxLength={16}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={handleStart}
            disabled={loading}
            style={[styles.startBtn, loading && styles.disabled]}
          >
            <Text style={styles.startBtnText}>
              {loading ? 'Loading...' : '▶  Start Playing'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            onPress={handleWalletConnect}
            disabled={walletLoading}
            style={[styles.walletBtn, walletLoading && styles.disabled]}
          >
            <Text style={styles.walletIcon}>◎</Text>
            <Text style={styles.walletBtnText}>
              {walletLoading ? 'Connecting...' : 'Connect Solana Wallet'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.features}>
          <Text style={styles.feature}>⚔️  Real-time PvP matches</Text>
          <Text style={styles.feature}>🏆  Global ELO leaderboard</Text>
          <Text style={styles.feature}>⚡  Skill-based ranking</Text>
          <Text style={styles.feature}>◎  Powered by Solana</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf8ef' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  logoBox: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 },
  logo2048: { fontSize: 72, fontWeight: '900', color: '#776e65', letterSpacing: -2 },
  logoPvP: {
    fontSize: 32, fontWeight: '900', color: '#f65e3b',
    marginLeft: 8, marginBottom: 12, letterSpacing: 2,
  },
  desc: {
    fontSize: 15, color: '#bbada0', textAlign: 'center',
    marginBottom: 36, letterSpacing: 0.5,
  },
  form: { width: '100%', marginBottom: 32 },
  input: {
    backgroundColor: '#fff', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 18, fontWeight: '600', color: '#776e65',
    borderWidth: 2, borderColor: '#e0d6cc', marginBottom: 12,
  },
  startBtn: {
    backgroundColor: '#f65e3b', borderRadius: 12,
    paddingVertical: 18, alignItems: 'center',
  },
  startBtnText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  disabled: { opacity: 0.6 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e0d6cc' },
  dividerText: { marginHorizontal: 12, color: '#bbada0', fontWeight: '600', fontSize: 13 },
  walletBtn: {
    backgroundColor: '#1a1a2e', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: 10,
  },
  walletIcon: { color: '#9945FF', fontSize: 22, fontWeight: '900' },
  walletBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  features: { gap: 10, alignSelf: 'flex-start' },
  feature: { fontSize: 14, color: '#776e65', fontWeight: '500' },
});
