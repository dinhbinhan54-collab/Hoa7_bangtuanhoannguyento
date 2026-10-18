import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  FileSpreadsheet, 
  RefreshCw, 
  Search, 
  Filter, 
  Download, 
  UserCheck, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  Save,
  Check,
  ChevronDown,
  Trash2,
  Settings
} from 'lucide-react';
import { SubmissionRecord, SyncConfig } from '../types';
import { 
  syncTwoWayWithGoogleSheet, 
  saveLocalSubmissions, 
  DEFAULT_TEACHER_PIN 
} from '../utils/googleSheetsSync';

interface TeacherGradebookProps {
  submissions: SubmissionRecord[];
  onUpdateSubmissions: (subs: SubmissionRecord[]) => void;
  syncConfig: SyncConfig;
  onOpenSyncGuide: () => void;
  isUnlocked: boolean;
  onUnlockSuccess: () => void;
  onLock: () => void;
}

export const TeacherGradebook: React.FC<TeacherGradebookProps> = ({
  submissions,
  onUpdateSubmissions,
  syncConfig,
  onOpenSyncGuide,
  isUnlocked,
  onUnlockSuccess,
  onLock
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedRank, setSelectedRank] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [editingRemarksId, setEditingRemarksId] = useState<string | null>(null);
  const [editingRemarksText, setEditingRemarksText] = useState<string>('');
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionRecord | null>(null);

  // Authentication gate
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = syncConfig.syncPassword || DEFAULT_TEACHER_PIN;
    if (pinInput.trim() === correctPin) {
      onUnlockSuccess();
      setPinError('');
      setPinInput('');
    } else {
      setPinError('Mã PIN không đúng. Mã mặc định là 123456.');
    }
  };

  // Perform 2-way sync with Google Sheets
  const handleTwoWaySync = async () => {
    if (!syncConfig.googleAppsScriptUrl) {
      setSyncMessage('Chưa thiết lập URL Google Apps Script. Vui lòng nhấn vào "Cài đặt đồng bộ" để xem hướng dẫn.');
      return;
    }

    setIsSyncing(true);
    setSyncMessage('Đang kết nối và đồng bộ 2 chiều với Google Sheets...');

    const res = await syncTwoWayWithGoogleSheet(syncConfig.googleAppsScriptUrl);
    setIsSyncing(false);

    if (res.success && res.data) {
      onUpdateSubmissions(res.data);
      setSyncMessage(res.message);
    } else {
      setSyncMessage(res.message);
    }
  };

  // Save teacher remark
  const handleSaveRemark = (subId: string) => {
    const updated = submissions.map(item => {
      if (item.submissionId === subId) {
        return { ...item, teacherRemarks: editingRemarksText };
      }
      return item;
    });

    onUpdateSubmissions(updated);
    saveLocalSubmissions(updated);
    setEditingRemarksId(null);

    // Optionally push to Google Sheets in background
    if (syncConfig.googleAppsScriptUrl) {
      fetch(syncConfig.googleAppsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'updateRemark',
          data: { submissionId: subId, teacherRemarks: editingRemarksText }
        })
      }).catch(err => console.warn('Background remark sync notice:', err));
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (submissions.length === 0) return;
    const headers = [
      'Mã Phiếu',
      'Thời Gian',
      'Mã Học Sinh',
      'Họ Và Tên',
      'Lớp',
      'Trường',
      'Tổng Điểm',
      'Nhận Biết',
      'Thông Hiểu',
      'Vận Dụng',
      'Số Câu Đúng',
      'Tổng Số Ô',
      'Thời Gian (giây)',
      'Nhận Xét Giáo Viên'
    ];

    const rows = submissions.map(s => [
      `"${s.submissionId}"`,
      `"${s.timestamp}"`,
      `"${s.studentId}"`,
      `"${s.fullName}"`,
      `"${s.className}"`,
      `"${s.schoolName}"`,
      s.totalScore,
      s.scoreNhanBiet,
      s.scoreThongHieu,
      s.scoreVanDung,
      s.correctCount,
      s.totalBlanks,
      s.durationSeconds,
      `"${s.teacherRemarks || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SoDiem_HoaHoc_BangTuanHoan_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Calculate statistics
  const totalCount = submissions.length;
  const avgScore = totalCount > 0 ? (submissions.reduce((acc, s) => acc + s.totalScore, 0) / totalCount).toFixed(1) : '0';
  const avgNB = totalCount > 0 ? (submissions.reduce((acc, s) => acc + s.scoreNhanBiet, 0) / totalCount).toFixed(1) : '0';
  const avgTH = totalCount > 0 ? (submissions.reduce((acc, s) => acc + s.scoreThongHieu, 0) / totalCount).toFixed(1) : '0';
  const avgVD = totalCount > 0 ? (submissions.reduce((acc, s) => acc + s.scoreVanDung, 0) / totalCount).toFixed(1) : '0';
  const passRate = totalCount > 0 ? Math.round((submissions.filter(s => s.totalScore >= 5.0).length / totalCount) * 100) : 0;
  const maxScore = totalCount > 0 ? Math.max(...submissions.map(s => s.totalScore)) : 0;

  // Filtered submissions
  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.className.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = selectedClass === 'all' || s.className === selectedClass;

    let matchesRank = true;
    if (selectedRank === 'xuat_sac') matchesRank = s.totalScore >= 9.0;
    else if (selectedRank === 'gioi') matchesRank = s.totalScore >= 8.0 && s.totalScore < 9.0;
    else if (selectedRank === 'kha') matchesRank = s.totalScore >= 6.5 && s.totalScore < 8.0;
    else if (selectedRank === 'trung_binh') matchesRank = s.totalScore >= 5.0 && s.totalScore < 6.5;
    else if (selectedRank === 'yeu') matchesRank = s.totalScore < 5.0;

    return matchesSearch && matchesClass && matchesRank;
  });

  const availableClasses = Array.from(new Set(submissions.map(s => s.className)));

  // If locked, show security password gate
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl mx-auto flex items-center justify-center backdrop-blur-md mb-3">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight">
            Khu Vực Quản Trị & Sổ Điểm
          </h2>
          <p className="text-xs text-amber-100 mt-1">
            Chỉ dành cho Thành viên & Giáo viên bộ môn Hóa học
          </p>
        </div>

        <form onSubmit={handleVerifyPin} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 text-center">
            Vui lòng nhập mã PIN bảo mật để truy cập bảng điểm và đồng bộ dữ liệu với Google Sheets.
          </p>

          <div>
            <input
              type="password"
              value={pinInput}
              onChange={e => {
                setPinInput(e.target.value);
                if (pinError) setPinError('');
              }}
              placeholder="Nhập mã PIN (Mặc định: 123456)"
              className="w-full text-center px-4 py-3 rounded-xl border border-slate-300 text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
              autoFocus
            />
          </div>

          {pinError && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
              {pinError}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-200 transition-colors flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Mở Khóa Sổ Điểm</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Gợi ý: Mã PIN mặc định dùng thử là <span className="font-mono font-bold text-slate-600">123456</span>
          </p>
        </form>
      </div>
    );
  }

  // Once unlocked: Complete Gradebook & 2-Way Sync Dashboard
  return (
    <div className="space-y-6">
      
      {/* Top Banner with 2-Way Sync Actions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
              <Unlock className="w-3 h-3 text-amber-700" />
              Chế độ Giáo viên • Đã mở khóa
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Sổ Điểm & Báo Cáo Học Sinh
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Điểm Số & Đồng Bộ 2 Chiều Google Sheets
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Tự động cập nhật kết quả khi học sinh nộp bài và kéo dữ liệu mới nhất từ Google Sheets.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          <button
            onClick={handleTwoWaySync}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng Bộ 2 Chiều Google Sheets'}</span>
          </button>

          <button
            onClick={onOpenSyncGuide}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Cài Đặt Web App</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
            title="Xuất tệp Excel / CSV để lưu trữ"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Xuất CSV</span>
          </button>

          <button
            onClick={onLock}
            className="px-3 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
            title="Khóa lại khu vực bảo mật"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-medium flex items-center justify-between">
          <span>{syncMessage}</span>
          <button onClick={() => setSyncMessage('')} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Học sinh đã nộp
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {totalCount} <span className="text-xs font-normal text-slate-400">em</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Tỷ lệ đạt: {passRate}%
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Điểm trung bình
          </span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">
            {avgScore} <span className="text-xs font-normal text-slate-400">/ 10</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Điểm cao nhất: {maxScore}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs col-span-2 sm:col-span-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Phổ Điểm Theo 3 Mức Độ Cần Đạt (SGK Bài 4)
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="block text-[10px] font-bold text-emerald-800">1. Nhận biết</span>
              <span className="text-base font-black text-emerald-900">{avgNB}</span>
            </div>
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200">
              <span className="block text-[10px] font-bold text-indigo-800">2. Thông hiểu</span>
              <span className="text-base font-black text-indigo-900">{avgTH}</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
              <span className="block text-[10px] font-bold text-amber-800">3. Vận dụng</span>
              <span className="text-base font-black text-amber-900">{avgVD}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên học sinh, mã HS, lớp..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Class */}
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800"
          >
            <option value="all">Tất cả các lớp</option>
            {availableClasses.map(c => (
              <option key={c} value={c}>Lớp {c}</option>
            ))}
          </select>

          {/* Filter Rank */}
          <select
            value={selectedRank}
            onChange={e => setSelectedRank(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800"
          >
            <option value="all">Tất cả xếp loại</option>
            <option value="xuat_sac">Xuất sắc (≥ 9.0)</option>
            <option value="gioi">Giỏi (8.0 - 8.9)</option>
            <option value="kha">Khá (6.5 - 7.9)</option>
            <option value="trung_binh">Trung bình (5.0 - 6.4)</option>
            <option value="yeu">Cần cố gắng (&lt; 5.0)</option>
          </select>
        </div>
      </div>

      {/* Gradebook Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4">Mã HS</th>
                <th className="py-3.5 px-4">Họ và Tên</th>
                <th className="py-3.5 px-4">Lớp</th>
                <th className="py-3.5 px-4 text-center">Tổng Điểm</th>
                <th className="py-3.5 px-3 text-center">Nhận Biết</th>
                <th className="py-3.5 px-3 text-center">Thông Hiểu</th>
                <th className="py-3.5 px-3 text-center">Vận Dụng</th>
                <th className="py-3.5 px-4">Thời Gian Nộp</th>
                <th className="py-3.5 px-4">Nhận Xét Của Giáo Viên</th>
                <th className="py-3.5 px-4 text-center">Đồng Bộ Sheet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSubmissions.map((sub) => {
                const isEditing = editingRemarksId === sub.submissionId;

                return (
                  <tr key={sub.submissionId} className="hover:bg-slate-50/80 transition-colors">
                    
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                      {sub.studentId}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{sub.fullName}</div>
                      <div className="text-[11px] text-slate-400">{sub.schoolName}</div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {sub.className}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-lg font-black text-sm ${
                        sub.totalScore >= 8.5
                          ? 'bg-emerald-100 text-emerald-900'
                          : sub.totalScore >= 6.5
                          ? 'bg-blue-100 text-blue-900'
                          : sub.totalScore >= 5.0
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-900'
                      }`}>
                        {sub.totalScore}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center font-bold text-emerald-800">
                      {sub.scoreNhanBiet}
                    </td>

                    <td className="py-3 px-3 text-center font-bold text-indigo-800">
                      {sub.scoreThongHieu}
                    </td>

                    <td className="py-3 px-3 text-center font-bold text-amber-800">
                      {sub.scoreVanDung}
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {sub.timestamp}
                    </td>

                    {/* Teacher Remarks Column with inline editing */}
                    <td className="py-3 px-4 min-w-[200px]">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editingRemarksText}
                            onChange={e => setEditingRemarksText(e.target.value)}
                            className="w-full px-2 py-1 rounded-lg border border-indigo-400 text-xs focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveRemark(sub.submissionId)}
                            className="p-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                            title="Lưu nhận xét"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingRemarksId(sub.submissionId);
                            setEditingRemarksText(sub.teacherRemarks || '');
                          }}
                          className="group cursor-pointer flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-slate-100"
                          title="Nhấp để nhập hoặc sửa nhận xét"
                        >
                          <span className={sub.teacherRemarks ? 'text-slate-800 font-medium' : 'text-slate-400 italic'}>
                            {sub.teacherRemarks || '+ Thêm nhận xét...'}
                          </span>
                          <MessageSquare className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 shrink-0 ml-1" />
                        </div>
                      )}
                    </td>

                    {/* Sync Status Badge */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        sub.syncStatus === 'synced'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.syncStatus === 'synced' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Đã đồng bộ</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span>Cục bộ</span>
                          </>
                        )}
                      </span>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-sm">
            Không tìm thấy học sinh nào phù hợp với bộ lọc tìm kiếm.
          </div>
        )}
      </div>

    </div>
  );
};
