import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Platform
} from 'react-native';
import { colors } from './src/theme/colors';

import HeaderBar from './src/components/HeaderBar';
import PhaseControlPanel from './src/components/PhaseControlPanel';
import HeaderCard from './src/components/HeaderCard';
import JudgeCard from './src/components/JudgeCard';
import CountdownBanner from './src/components/CountdownBanner';
import ImportantDatesGrid from './src/components/ImportantDatesGrid';
import PreviousWinners from './src/components/PreviousWinners';
import TabbedContent from './src/components/TabbedContent';
import RewardsTable from './src/components/RewardsTable';
import PresentationalBanners from './src/components/PresentationalBanners';
import BottomCTA from './src/components/BottomCTA';
import BottomNavBar from './src/components/BottomNavBar';
import VideoModal from './src/components/VideoModal';
import SubmissionModal from './src/components/SubmissionModal';

import {
  fetchCompetitionDetails,
  registerUser,
  submitEntry,
  seedDatabase,
  setSpotsRemaining
} from './src/api/competitionApi';

export default function App() {
  const [lang, setLang] = useState('ENG');
  const [selectedUser, setSelectedUser] = useState('user_demo_1');
  const [phaseOffsetDays, setPhaseOffsetDays] = useState(0);

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modals
  const [videoModal, setVideoModal] = useState({ visible: false, title: '', url: '' });
  const [submissionModalVisible, setSubmissionModalVisible] = useState(false);

  // Calculate simulated date based on offset days
  const getSimulatedNow = useCallback(() => {
    if (phaseOffsetDays === 0) return null;
    const now = new Date();
    now.setDate(now.getDate() + phaseOffsetDays);
    return now.toISOString();
  }, [phaseOffsetDays]);

  // Load competition details from API
  const loadDetails = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    setError(null);
    try {
      const simulatedNow = getSimulatedNow();
      const res = await fetchCompetitionDetails('default', selectedUser, simulatedNow);
      setData(res);
    } catch (err) {
      console.error('Error fetching competition:', err);
      setError(err.message || 'Could not load competition details');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedUser, getSimulatedNow]);

  useEffect(() => {
    loadDetails(true);
  }, [loadDetails]);

  const showAlert = (title, msg) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${msg}`);
    } else {
      Alert.alert(title, msg);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadDetails(false);
  };

  // Handle CTA Action
  const handleCTAAction = async (actionType) => {
    if (!data || !data.competition) return;

    if (actionType === 'REGISTER') {
      setIsActionLoading(true);
      try {
        const simulatedNow = getSimulatedNow();
        const res = await registerUser(data.competition._id, selectedUser, simulatedNow);
        
        showAlert('Registration Successful!', 'You are now registered for this competition.');
        await loadDetails(false);
      } catch (err) {
        showAlert('Registration Error', err.message || 'Could not complete registration');
      } finally {
        setIsActionLoading(false);
      }
    } else if (actionType === 'SUBMIT') {
      setSubmissionModalVisible(true);
    } else if (actionType === 'VIEW_RESULTS') {
      showAlert('Results', 'Check out the previous winners and final scores above!');
    }
  };

  // Handle Submission Modal Submit
  const handlePerformSubmit = async (fileUrl, notes) => {
    if (!data || !data.competition) return;
    setIsActionLoading(true);
    try {
      const simulatedNow = getSimulatedNow();
      await submitEntry(data.competition._id, selectedUser, fileUrl, notes, simulatedNow);
      setSubmissionModalVisible(false);
      showAlert('Submission Received!', 'Your entry has been uploaded successfully.');
      await loadDetails(false);
    } catch (err) {
      showAlert('Submission Failed', err.message || 'Could not upload entry');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Reset Demo Data Handler
  const handleResetDemoData = async () => {
    setIsLoading(true);
    try {
      await seedDatabase();
      setPhaseOffsetDays(0);
      showAlert('Demo Data Reset', 'Competition reset to initial state (1/20 booked, default dates, fresh user sessions).');
      await loadDetails(false);
    } catch (err) {
      showAlert('Reset Error', err.message || 'Could not reset demo data');
    } finally {
      setIsLoading(false);
    }
  };

  // Set 1 Spot Left Handler (Race condition demo)
  const handleSetOneSpotLeft = async () => {
    setIsLoading(true);
    try {
      await setSpotsRemaining('default', 1);
      setPhaseOffsetDays(0);
      showAlert('1 Spot Left Configured', 'Competition updated to 19/20 booked (Only 1 spot remaining!). Ready to test race condition.');
      await loadDetails(false);
    } catch (err) {
      showAlert('Error', err.message || 'Could not set spots left');
    } finally {
      setIsLoading(false);
    }
  };

  const competition = data?.competition;
  const lifecycle = data?.lifecycle;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Top Header Bar */}
      <HeaderBar
        lang={lang}
        onToggleLang={setLang}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />

      {/* Evaluator Phase Tester Bar */}
      <PhaseControlPanel
        currentPhase={lifecycle?.phase}
        simulatedNow={phaseOffsetDays}
        onSetPhaseOffset={setPhaseOffsetDays}
        onResetDemoData={handleResetDemoData}
        onSetOneSpotLeft={handleSetOneSpotLeft}
      />

      {isLoading && !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Fetching competition details...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Unable to connect to backend</Text>
          <Text style={styles.errorSub}>{error}</Text>
          <Text style={styles.errorHelp}>
            Make sure the Express server is running on http://localhost:5000
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
        >
          {/* 1. Header Card (Title, Tags, Certificate, Fees, Spots Left) */}
          <HeaderCard
            competition={competition}
            isRegistered={lifecycle?.isRegistered}
          />

          {/* 2. Judge Card */}
          <JudgeCard
            judge={competition?.judge}
            onPlayVideo={(url, title) => setVideoModal({ visible: true, url, title })}
          />

          {/* 3. Live Countdown Banner */}
          <CountdownBanner
            targetDate={
              lifecycle?.phase === 'SUBMISSION_OPEN'
                ? competition?.submissionEndsAt
                : competition?.registrationDeadline
            }
            phase={lifecycle?.phase}
          />

          {/* 4. Important Dates Grid */}
          <ImportantDatesGrid competition={competition} />

          {/* 5. Previous Winners */}
          <PreviousWinners
            winners={competition?.previousWinners}
            onPlayVideo={(url, title) => setVideoModal({ visible: true, url, title })}
          />

          {/* 6. Tabbed Content (About / Judging / Rules) */}
          <TabbedContent competition={competition} />

          {/* 7. Rewards Table */}
          <RewardsTable rewards={competition?.rewards} />

          {/* 8. Presentational Banners (Trust, Razorpay, Refer & Earn, Disclaimer) */}
          <PresentationalBanners
            referralCode={competition?.referralCode}
            onPlayVideo={(url, title) => setVideoModal({ visible: true, url, title })}
          />

          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

      {/* Dynamic Bottom CTA */}
      <BottomCTA
        ctaState={lifecycle?.ctaState}
        isLoading={isActionLoading}
        onPressAction={handleCTAAction}
      />

      {/* Bottom App Navigation Bar */}
      <BottomNavBar activeTab="Competitions" />

      {/* Video Preview Modal */}
      <VideoModal
        visible={videoModal.visible}
        videoTitle={videoModal.title}
        videoUrl={videoModal.url}
        onClose={() => setVideoModal({ visible: false, title: '', url: '' })}
      />

      {/* Submission Upload Modal */}
      <SubmissionModal
        visible={submissionModalVisible}
        isSubmitting={isActionLoading}
        onSubmit={handlePerformSubmit}
        onClose={() => setSubmissionModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.error,
  },
  errorSub: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
  errorHelp: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 10,
  },
  bottomSpacer: {
    height: 30,
  },
});
