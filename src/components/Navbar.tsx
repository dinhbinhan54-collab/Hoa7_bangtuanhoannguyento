import React from 'react';
import { 
  FlaskConical, 
  TableProperties, 
  GraduationCap, 
  FileSpreadsheet, 
  Lock, 
  User, 
  Clock, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { StudentInfo } from '../types';

interface NavbarProps {
  activeTab: 'game' | 'periodic_table' | 'gradebook' | 'sheets_guide';
  setActiveTab: (tab: 'game' | 'periodic_table' | 'gradebook' | 'sheets_guide') => void;
  studentInfo: StudentInfo | null;
  onEditStudent: () => void;
  isTeacherUnlocked: boolean;
  onTeacherLockToggle: () => void;
  elapsedSeconds: number;
  isGameActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  studentInfo,
  onEditStudent,
  isTeacherUnlocked,
  onTeacherLockToggle,
  elapsedSeconds,
  isGameActive
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Subject Info */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('game')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  Hóa Học KHTN 7-8
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Bài 4: Bảng Tuần Hoàn
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden md:block">
                Trò chơi điền lý thuyết • Trộn từ khóa • Sổ điểm Google Sheets
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('game')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'game'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Bài Tập Điền Từ</span>
            </button>

            <button
              onClick={() => setActiveTab('periodic_table')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'periodic_table'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TableProperties className="w-4 h-4" />
              <span className="hidden sm:inline">Tra Cứu</span> Bảng Tuần Hoàn
            </button>

            {/* Sổ điểm (Khu vực thành viên / giáo viên) */}
            <button
              onClick={() => setActiveTab('gradebook')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all border ${
                activeTab === 'gradebook'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : isTeacherUnlocked
                  ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  : 'text-slate-600 border-dashed border-slate-300 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Khu vực dành riêng cho Thành viên & Giáo viên"
            >
              {isTeacherUnlocked ? (
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              ) : (
                <Lock className="w-4 h-4 text-amber-600" />
              )}
              <span>Sổ Điểm & Báo Cáo</span>
            </button>

            {/* Cài đặt Google Sheet */}
            <button
              onClick={() => setActiveTab('sheets_guide')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'sheets_guide'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Đồng Bộ Google Sheets</span>
            </button>
          </nav>

          {/* Right Status: Timer & Student / Teacher Status */}
          <div className="flex items-center gap-2">
            {isGameActive && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold">
                <Clock className="w-3.5 h-3.5 animate-spin text-amber-600" style={{ animationDuration: '4s' }} />
                <span>{formatTime(elapsedSeconds)}</span>
              </div>
            )}

            {studentInfo ? (
              <button
                onClick={onEditStudent}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-left"
                title="Nhấn để sửa thông tin học sinh"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  {studentInfo.fullName.slice(0, 1)}
                </div>
                <div className="hidden xl:block text-xs">
                  <p className="font-bold text-slate-800 line-clamp-1">{studentInfo.fullName}</p>
                  <p className="text-slate-500">{studentInfo.className || 'Chưa chọn lớp'}</p>
                </div>
              </button>
            ) : (
              <button
                onClick={onEditStudent}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Học sinh</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
