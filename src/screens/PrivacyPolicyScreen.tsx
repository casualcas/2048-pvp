import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';

interface Props {
  onBack: () => void;
  url?: string;
}

export function PrivacyPolicyScreen({ onBack, url }: Props) {
  const isTerms = !!url;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{isTerms ? 'Terms of Service' : 'Privacy Policy'}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {isTerms ? (
          <>
            <Text style={styles.updated}>Last updated: June 2026</Text>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.text}>By using 2048 PvP, you agree to these Terms of Service. If you do not agree, do not use the app.</Text>
            <Text style={styles.sectionTitle}>2. Description of Service</Text>
            <Text style={styles.text}>2048 PvP is a mobile puzzle game with real-time PvP matches using Solana wallet authentication, matchmaking, leaderboards, and bot matches.</Text>
            <Text style={styles.sectionTitle}>3. Eligibility</Text>
            <Text style={styles.text}>You must be at least 13 years old to use this app.</Text>
            <Text style={styles.sectionTitle}>4. User Accounts</Text>
            <Text style={styles.text}>You must connect a valid Solana wallet to play PvP matches. You are responsible for your wallet security.</Text>
            <Text style={styles.sectionTitle}>5. Acceptable Use</Text>
            <Text style={styles.text}>You agree not to cheat, exploit bugs, harass other users, reverse engineer the app, or use it for illegal purposes.</Text>
            <Text style={styles.sectionTitle}>6. Advertising</Text>
            <Text style={styles.text}>The app displays ads via Google AdMob. By using the app, you consent to the display of such advertisements.</Text>
            <Text style={styles.sectionTitle}>7. Disclaimer</Text>
            <Text style={styles.text}>The app is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service.</Text>
            <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
            <Text style={styles.text}>We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the app.</Text>
            <Text style={styles.sectionTitle}>9. Contact</Text>
            <Text style={styles.text}>For questions: nininbini111@gmail.com</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://casualcas.github.io/2048-pvp/terms.html')} style={styles.link}>
              <Text style={styles.linkText}>View full Terms of Service</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.updated}>Last updated: June 2026</Text>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.text}>2048 PvP collects: Solana wallet address, device ID, game statistics, and match data to provide matchmaking and leaderboard services.</Text>
            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.text}>We use collected information to enable multiplayer matchmaking, display leaderboards, save your game progress, and improve game performance.</Text>
            <Text style={styles.sectionTitle}>3. Data Storage</Text>
            <Text style={styles.text}>Your data is stored securely using Supabase cloud services. Local data is stored on your device using AsyncStorage. We do not sell your data to third parties.</Text>
            <Text style={styles.sectionTitle}>4. Advertising</Text>
            <Text style={styles.text}>2048 PvP uses Google AdMob to display advertisements. AdMob may collect device information and advertising ID to show relevant ads. You can opt out of personalized ads in your device settings.</Text>
            <Text style={styles.sectionTitle}>5. Children Privacy</Text>
            <Text style={styles.text}>2048 PvP is not directed to children under 13. We do not knowingly collect personal information from children under 13.</Text>
            <Text style={styles.sectionTitle}>6. Data Deletion</Text>
            <Text style={styles.text}>You can request deletion of your data by contacting us at nininbini111@gmail.com.</Text>
            <Text style={styles.sectionTitle}>7. Contact Us</Text>
            <Text style={styles.text}>If you have questions about this Privacy Policy, contact us at nininbini111@gmail.com</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://casualcas.github.io/2048-pvp/privacy.html')} style={styles.link}>
              <Text style={styles.linkText}>View full Privacy Policy</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: theme.colors.bgCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: theme.colors.border,
  },
  backBtnText: { fontSize: 20, fontWeight: '900', color: theme.colors.text },
  title: { fontSize: 18, fontWeight: '900', color: theme.colors.text },
  placeholder: { width: 40 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  updated: { fontSize: 13, color: theme.colors.text3, marginBottom: 20, fontStyle: 'italic' },
  sectionTitle: {
    fontSize: 16, fontWeight: '800', color: theme.colors.text,
    marginTop: 20, marginBottom: 8,
  },
  text: { fontSize: 14, color: theme.colors.text2, lineHeight: 22 },
  link: { marginTop: 24, alignItems: 'center' },
  linkText: { fontSize: 14, color: '#9945FF', fontWeight: '700', textDecorationLine: 'underline' },
});
