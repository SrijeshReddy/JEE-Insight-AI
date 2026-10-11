import React, { useState, useEffect } from 'react';
import { NavPage, Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { LandingPage } from './pages/LandingPage';
import { OverviewPage } from './pages/OverviewPage';
import { MockTestsPage } from './pages/MockTestsPage';
import { ResultsPage } from './pages/ResultsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { WeakConceptsPage } from './pages/WeakConceptsPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { ScoreSimulatorPage } from './pages/ScoreSimulatorPage';
import { AICoachPage } from './pages/AICoachPage';
import { ProgressHistoryPage } from './pages/ProgressHistoryPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { profileService } from './services/profileService';
import { StudentProfile } from './types';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavPage>('landing');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [isCbtTestActive, setIsCbtTestActive] = useState<boolean>(false);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [topicContext, setTopicContext] = useState<string | undefined>(undefined);
  const [activeAttemptId, setActiveAttemptId] = useState<string | undefined>(undefined);

  useEffect(() => {
    profileService.getProfile().then(p => {
      setStudentProfile(p);
      if (p.theme === 'dark') {
        setIsDarkTheme(true);
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    });
  }, []);

  const handleToggleTheme = () => {
    setIsDarkTheme(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      return next;
    });
  };

  const handleNavigate = (page: NavPage, context?: string) => {
    setIsCbtTestActive(false);
    setCurrentPage(page);
    if (page === 'results' && context) {
      setActiveAttemptId(context);
    } else if (context) {
      setTopicContext(context);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTestSubmitted = (attemptId: string) => {
    setIsCbtTestActive(false);
    setActiveAttemptId(attemptId);
    setCurrentPage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If on Landing Page, render the full public experience
  if (currentPage === 'landing') {
    return <LandingPage onNavigate={handleNavigate} />;
  }

  // If taking an active test, render full-screen distraction-free CBT exam
  if (currentPage === 'mock-tests' && isCbtTestActive) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
        <MockTestsPage
          onNavigate={handleNavigate}
          onTestSubmitted={handleTestSubmitted}
          onTestActiveChange={setIsCbtTestActive}
        />
      </div>
    );
  }

  // Otherwise render platform shell with sidebar and topbar
  return (
    <div className="app-shell">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        studentName={studentProfile?.name}
        targetExam={studentProfile?.targetExam}
      />

      <div className="main-content-wrapper">
        <Topbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          isDarkTheme={isDarkTheme}
          onToggleTheme={handleToggleTheme}
        />

        <main style={{ flex: 1 }}>
          {currentPage === 'overview' && (
            <OverviewPage
              onNavigate={handleNavigate}
              studentName={studentProfile?.name || 'Aarav'}
            />
          )}

          {currentPage === 'mock-tests' && (
            <MockTestsPage
              onNavigate={handleNavigate}
              onTestSubmitted={handleTestSubmitted}
              onTestActiveChange={setIsCbtTestActive}
            />
          )}

          {currentPage === 'results' && (
            <ResultsPage
              onNavigate={handleNavigate}
              selectedAttemptId={activeAttemptId}
            />
          )}

          {currentPage === 'analytics' && <AnalyticsPage />}

          {currentPage === 'weak-concepts' && (
            <WeakConceptsPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'study-planner' && <StudyPlannerPage />}

          {currentPage === 'score-simulator' && (
            <ScoreSimulatorPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'ai-coach' && (
            <AICoachPage
              onNavigate={handleNavigate}
              initialTopicContext={topicContext}
            />
          )}

          {currentPage === 'history' && (
            <ProgressHistoryPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'settings' && (
            <ProfileSettingsPage
              onProfileUpdated={setStudentProfile}
              isDarkTheme={isDarkTheme}
              onToggleTheme={handleToggleTheme}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
