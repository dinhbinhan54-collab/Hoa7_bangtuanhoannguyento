import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StudentInfoForm } from './components/StudentInfoForm';
import { TheoryFillGame } from './components/TheoryFillGame';
import { PeriodicTableExplorer } from './components/PeriodicTableExplorer';
import { TeacherGradebook } from './components/TeacherGradebook';
import { GoogleSheetSetupGuide } from './components/GoogleSheetSetupGuide';
import { GradingResultModal } from './components/GradingResultModal';
import { StudentInfo, SubmissionRecord, SyncConfig } from './types';
import { 
  getLocalSubmissions, 
  saveLocalSubmissions, 
  getSyncConfig, 
  saveSyncConfig,
  pushSubmissionToGoogleSheet 
} from './utils/googleSheetsSync';

export default function App() {
  const [activeTab, setActiveTab] = useState<'game' | 'periodic_table' | 'gradebook' | 'sheets_guide'>('game');
  
  // Student state
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(() => {
    try {
      const saved = localStorage.getItem('hoa_hoc_student_info');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showStudentModal, setShowStudentModal] = useState<boolean>(false);

  // Submissions & sync config
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(() => getLocalSubmissions());
  const [syncConfig, setSyncConfig] = useState<SyncConfig>(() => getSyncConfig());
  const [latestSubmission, setLatestSubmission] = useState<SubmissionRecord | null>(null);

  // Teacher lock state (Requirement 2: "phần này chỉ có thành viên được xem")
  const [isTeacherUnlocked, setIsTeacherUnlocked] = useState<boolean>(false);

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Run timer when student is active
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Open student modal on first arrival if not registered
  useEffect(() => {
    if (!studentInfo) {
      setShowStudentModal(true);
    }
  }, []);

  const handleSaveStudent = (info: StudentInfo) => {
    setStudentInfo(info);
    setShowStudentModal(false);
    try {
      localStorage.setItem('hoa_hoc_student_info', JSON.stringify(info));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSyncConfig = (cfg: SyncConfig) => {
    setSyncConfig(cfg);
    saveSyncConfig(cfg);
  };

  const handleUpdateSubmissions = (subs: SubmissionRecord[]) => {
    setSubmissions(subs);
    saveLocalSubmissions(subs);
  };

  // When student submits their test
  const handleGameSubmit = async (record: SubmissionRecord) => {
    setIsTimerRunning(false);

    // Save to local storage
    const currentList = getLocalSubmissions();
    const updated = [record, ...currentList.filter(s => s.submissionId !== record.submissionId)];
    setSubmissions(updated);
    saveLocalSubmissions(updated);
    setLatestSubmission(record);

    // Auto-sync to Google Sheets if configured (Requirement 2)
    if (syncConfig.autoSyncOnSubmit && syncConfig.googleAppsScriptUrl) {
      pushSubmissionToGoogleSheet(record, syncConfig.googleAppsScriptUrl).then(res => {
        if (res.success) {
          const syncedList = updated.map(item =>
            item.submissionId === record.submissionId
              ? { ...item, syncStatus: 'synced' as const, syncMessage: res.message }
              : item
          );
          setSubmissions(syncedList);
          saveLocalSubmissions(syncedList);
          setLatestSubmission(prev => prev ? { ...prev, syncStatus: 'synced', syncMessage: res.message } : null);
        }
      });
    }
  };

  const handleRetryTest = () => {
    setLatestSubmission(null);
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    setActiveTab('game');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentInfo={studentInfo}
        onEditStudent={() => setShowStudentModal(true)}
        isTeacherUnlocked={isTeacherUnlocked}
        onTeacherLockToggle={() => setIsTeacherUnlocked(!isTeacherUnlocked)}
        elapsedSeconds={elapsedSeconds}
        isGameActive={isTimerRunning && activeTab === 'game'}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'game' && (
          <TheoryFillGame
            studentInfo={studentInfo}
            onOpenStudentModal={() => setShowStudentModal(true)}
            onSubmitResults={handleGameSubmit}
            elapsedSeconds={elapsedSeconds}
          />
        )}

        {activeTab === 'periodic_table' && (
          <PeriodicTableExplorer />
        )}

        {activeTab === 'gradebook' && (
          <TeacherGradebook
            submissions={submissions}
            onUpdateSubmissions={handleUpdateSubmissions}
            syncConfig={syncConfig}
            onOpenSyncGuide={() => setActiveTab('sheets_guide')}
            isUnlocked={isTeacherUnlocked}
            onUnlockSuccess={() => setIsTeacherUnlocked(true)}
            onLock={() => setIsTeacherUnlocked(false)}
          />
        )}

        {activeTab === 'sheets_guide' && (
          <GoogleSheetSetupGuide
            syncConfig={syncConfig}
            onSaveConfig={handleSaveSyncConfig}
            onBackToGame={() => setActiveTab('game')}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700">
            Ứng Dụng Học Tập Môn Hoá Học - Sơ Lược Về Bảng Tuần Hoàn (KHTN Kết Nối Tri Thức Với Cuộc Sống)
          </p>
          <p>
            Tích hợp đánh giá 3 mức độ: Nhận biết • Thông hiểu • Vận dụng — Đồng bộ 2 chiều với Google Sheets
          </p>
        </div>
      </footer>

      {/* Student Profile Registration Modal */}
      {showStudentModal && (
        <StudentInfoForm
          initialInfo={studentInfo}
          onSave={handleSaveStudent}
          onCancel={studentInfo ? () => setShowStudentModal(false) : undefined}
        />
      )}

      {/* Grading Result Modal */}
      {latestSubmission && (
        <GradingResultModal
          submission={latestSubmission}
          onClose={() => setLatestSubmission(null)}
          onRetry={handleRetryTest}
          syncConfig={syncConfig}
          onOpenSyncGuide={() => {
            setLatestSubmission(null);
            setActiveTab('sheets_guide');
          }}
        />
      )}

    </div>
  );
}
