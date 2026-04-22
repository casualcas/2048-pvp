import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWalletAuth } from '../hooks/useWalletAuth';

const { width } = Dimensions.get('window');

interface Props {
  onStart: (nickname: string) => void;
  loading: boolean;
}

export function OnboardingScreen({ onStart, loading }: Props) {
  const { connectWallet, loading: walletLoading } = useWalletAuth();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const tile1 = useRef(new Animated.Value(0)).current;
  const tile2 = useRef(new Animated.Value(0)).current;
  const tile3 = useRef(new Animated.Value(0)).current;
  const tile4 = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.stagger(120, [
        Animated.spring(tile1, { toValue: 1, friction: 5, tension: 200, useNativeDriver: true }),
        Animated.spring(tile2, { toValue: 1, friction: 5, tension: 200, useNativeDriver: true }),
        Animated.spring(tile3, { toValue: 1, friction: 5, tension: 200, useNativeDriver: true }),
        Animated.spring(tile4, { toValue: 1, friction: 5, tension: 200, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, delay: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, delay: 400, useNativeDriver: true }),
    ]).start();

    Animated.spring(btnScale, { toValue: 1, friction: 4, tension: 150, delay: 800, useNativeDriver: true }).start();

    // Пульсация кнопки
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleWalletConnect = async () => {
    try {
      const pubkey = await connectWallet();
      if (pubkey) {
        const shortKey = pubkey.slice(0, 6) + '...' + pubkey.slice(-4);
        onStart(shortKey);
      }
    } catch (e: any) {
      if (e?.message === 'NO_WALLET') {
        Alert.alert(
          'No Wallet Found',
          'Please install Phantom or another Solana wallet.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const tiles = [
    { anim: tile1, value: '2', bg: '#EEE4DA', color: '#776e65' },
    { anim: tile2, value: '4', bg: '#EDE0C8', color: '#776e65' },
    { anim: tile3, value: '8', bg: '#F2B179', color: '#fff' },
    { anim: tile4, value: '16', bg: '#F65E3B', color: '#fff' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Тайлы */}
        <View style={styles.tilesRow}>
          {tiles.map((tile, i) => (
            <Animated.View
              key={i}
              style={[
                styles.tile,
                { backgroundColor: tile.bg },
                {
                  opacity: tile.anim,
                  transform: [{ scale: tile.anim }],
                },
              ]}
            >
              <Text style={[styles.tileText, { color: tile.color }]}>{tile.value}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Заголовок */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.title}>2048 <Text style={styles.titleAccent}>PvP</Text></Text>
          <Text style={styles.subtitle}>Real-time battles on Solana</Text>
        </Animated.View>

        {/* Фичи */}
        <Animated.View style={[styles.features, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {[
            { icon: '⚔️', text: 'Real-time PvP matches' },
            { icon: '🏆', text: 'Global ELO leaderboard' },
            { icon: '⚡', text: 'Skill-based ranking' },
            { icon: '◎', text: 'Powered by Solana' },
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Кнопка */}
        <Animated.View style={{ transform: [{ scale: btnScale }], width: '100%' }}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              onPress={handleWalletConnect}
              disabled={walletLoading || loading}
              style={[styles.walletBtn, (walletLoading || loading) && styles.disabled]}
              activeOpacity={0.85}
            >
              <Text style={styles.walletIcon}>◎</Text>
              <Text style={styles.walletBtnText}>
                {walletLoading ? 'Connecting...' : 'Connect Solana Wallet'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <Text style={styles.hint}>Supports Phantom, Solflare & more</Text>
      </View>
    </SafeAreaView>
  );
}

const TILE_SIZE = (width - 80) / 4;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf8ef' },
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: 24, gap: 28,
  },
  tilesRow: {
    flexDirection: 'row', gap: 8,
  },
  tile: {
    width: TILE_SIZE, height: TILE_SIZE,
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 6,
  },
  tileText: { fontSize: TILE_SIZE * 0.38, fontWeight: '900' },
  title: {
    fontSize: 56, fontWeight: '900', color: '#776e65',
    textAlign: 'center', letterSpacing: -1,
  },
  titleAccent: { color: '#f65e3b' },
  subtitle: {
    fontSize: 16, color: '#bbada0', textAlign: 'center',
    marginTop: 4, letterSpacing: 0.5,
  },
  features: {
    width: '100%', gap: 12,
    backgroundColor: '#fff', borderRadius: 16,
    padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  featureText: { fontSize: 15, color: '#776e65', fontWeight: '600' },
  walletBtn: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16, paddingVertical: 18,
    alignItems: 'center', flexDirection: 'row',
    justifyContent: 'center', gap: 10, width: '100%',
    shadowColor: '#9945FF', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  walletIcon: { color: '#9945FF', fontSize: 24, fontWeight: '900' },
  walletBtnText: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
  disabled: { opacity: 0.6 },
  hint: { fontSize: 12, color: '#bbada0', textAlign: 'center' },
});
