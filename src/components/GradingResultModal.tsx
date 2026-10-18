import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Share2, 
  FileSpreadsheet, 
  RotateCcw, 
  X, 
  Clock, 
  TrendingUp, 
  Check, 
  Copy,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { SubmissionRecord, SyncConfig } from '../types';
import { pushSubmissionToGoogleSheet, saveLocalSubmissions, getLocalSubmissions } from '../utils/googleSheetsSync';

interface GradingResultModalProps {
  submission: SubmissionRecord;
  onClose: () => void;
  onRetry: () => void;
  syncConfig: SyncConfig;
  onOpenSyncGuide: () => void;
}

export const GradingResultModal: React.FC<GradingResultModalProps> = ({
  submission,
  onClose,
  onRetry,
  syncConfig,
  onOpenSyncGuide
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>(submission.syncStatus);
  const [syncFeedback, setSyncFeedback] = useState<string>(submission.syncMessage || '');
  const [copied, setCopied] = useState(false);

  // Determine ranking
  let rankTitle = 'Xuất sắc';
  let rankColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  let emoji = '🏆';
  if (submission.totalScore >= 9.0) {
    rankTitle = 'Xuất sắc';
    emoji = '🏆';
    rankColor = 'bg-emerald-500 text-white';
  } else if (submission.totalScore >= 8.0) {
    rankTitle = 'Giỏi';
    emoji = '🌟';
    rankColor = 'bg-blue-500 text-white';
  } else if (submission.totalScore >= 6.5) {
    rankTitle = 'Khá';
    emoji = '👍';
    rankColor = 'bg-indigo-500 text-white';
  } else if (submission.totalScore >= 5.0) {
    rankTitle = 'Trung bình / Đạt';
    emoji = '📖';
    rankColor = 'bg-amber-500 text-white';
  } else {
    rankTitle = 'Cần cố gắng thêm';
    emoji = '💪';
    rankColor = 'bg-rose-500 text-white';
  }

  const handlePushToGoogleSheets = async () => {
    if (!syncConfig.googleAppsScriptUrl) {
      setSyncFeedback('Chưa cấu hình URL Google Apps Script. Vui lòng xem hướng dẫn cài đặt trang tính.');
      return;
    }

    setIsSyncing(true);
    setSyncFeedback('Đang gửi dữ liệu lên Google Sheets...');

    const res = await pushSubmissionToGoogleSheet(submission, syncConfig.googleAppsScriptUrl);
    setIsSyncing(false);

    if (res.success) {
      setSyncStatus('synced');
      setSyncFeedback(res.message);
      // Update local storage record status
      const list = getLocalSubmissions();
      const updated = list.map(item =>
        item.submissionId === submission.submissionId
          ? { ...item, syncStatus: 'synced' as const, syncMessage: res.message }
          : item
      );
      saveLocalSubmissions(updated);
    } else {
      setSyncStatus('error');
      setSyncFeedback(res.message);
    }
  };

  const handleCopySummary = () => {
    const text = `KẾT QUẢ BÀI TẬP BẢNG TUẦN HOÀN - HOÁ HỌC
Học sinh: ${submission.fullName} - Lớp: ${submission.className} (${submission.schoolName})
Tổng điểm: ${submission.totalScore}/10 (${rankTitle})
- Mức Nhận biết: ${submission.scoreNhanBiet}/10
- Mức Thông hiểu: ${submission.scoreThongHieu}/10
- Mức Vận dụng: ${submission.scoreVanDung}/10
Số câu đúng: ${submission.correctCount}/${submission.totalBlanks}
Thời gian hoàn thành: ${Math.floor(submission.durationSeconds / 60)} phút ${submission.durationSeconds % 60} giây
Ngày nộp: ${submission.timestamp}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden transition-all animate-in fade-in zoom-in-95 my-8">
        
        {/* Top Result Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-700 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md mb-2">
            <span>{emoji}</span>
            <span>Xếp loại: {rankTitle}</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            Kết Quả Chấm Điểm Bài Tập Lý Thuyết
          </h2>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-5xl font-black text-white">{submission.totalScore}</span>
            <span className="text-xl font-bold text-indigo-200">/ 10 Điểm</span>
          </div>

          <p className="text-xs text-indigo-100 mt-2 font-medium">
            Học sinh: <span className="font-bold text-white">{submission.fullName}</span> • Lớp: <span className="font-bold text-white">{submission.className}</span> • {submission.schoolName}
          </p>
        </div>

        {/* Evaluation Metrics according to Curriculum */}
        <div className="p-6 space-y-6">
          
          <div>
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">
              Đánh Giá Năng Lực Theo Yêu Cầu Cần Đạt (SGK Bài 4)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Nhận biết */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-1">
                  <span>1. Nhận biết</span>
                  <span className="text-sm font-black">{submission.scoreNhanBiet}/10</span>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: `${submission.scoreNhanBiet * 10}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-emerald-700 leading-tight">
                  Nguyên tắc xây dựng bảng và cấu tạo ô, chu kì, nhóm.
                </p>
              </div>

              {/* Thông hiểu */}
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-800 mb-1">
                  <span>2. Thông hiểu</span>
                  <span className="text-sm font-black">{submission.scoreThongHieu}/10</span>
                </div>
                <div className="w-full bg-indigo-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${submission.scoreThongHieu * 10}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-indigo-700 leading-tight">
                  Chỉ ra vị trí kim loại, phi kim, khí hiếm & ứng dụng đời sống.
                </p>
              </div>

              {/* Vận dụng */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center justify-between text-xs font-bold text-amber-800 mb-1">
                  <span>3. Vận dụng</span>
                  <span className="text-sm font-black">{submission.scoreVanDung}/10</span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-amber-600 h-2 rounded-full"
                    style={{ width: `${submission.scoreVanDung * 10}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-amber-700 leading-tight">
                  Tìm nguyên tố theo KLNT & mối liên hệ số hiệu nguyên tử với số proton.
                </p>
              </div>

            </div>
          </div>

          {/* Google Sheets Sync Box (Requirement 2) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold text-slate-800">
                  Đồng Bộ Sổ Điểm Google Sheets
                </span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                syncStatus === 'synced'
                  ? 'bg-emerald-100 text-emerald-800'
                  : syncStatus === 'error'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {syncStatus === 'synced' ? 'Đã ghi sổ điểm' : syncStatus === 'error' ? 'Lỗi kết nối' : 'Lưu cục bộ'}
              </span>
            </div>

            {syncFeedback && (
              <p className="text-xs text-slate-600 font-medium">
                {syncFeedback}
              </p>
            )}

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <button
                onClick={handlePushToGoogleSheets}
                disabled={isSyncing}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{isSyncing ? 'Đang gửi...' : 'Gửi Kết Quả Lên Google Sheets'}</span>
              </button>

              <button
                onClick={onOpenSyncGuide}
                className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>Cài Đặt / Tệp Mẫu Sheet</span>
              </button>

              <button
                onClick={handleCopySummary}
                className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors flex items-center gap-1 ml-auto"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép kết quả'}</span>
              </button>
            </div>
          </div>

          {/* Question Breakdown Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Chi Tiết Các Ô Đã Điền ({submission.correctCount}/{submission.totalBlanks} đúng)
              </h4>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2 pr-1 text-xs">
              {submission.details.map((d, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                    d.isCorrect
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50/60 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {d.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="truncate">
                      <b>Trả lời:</b> "{d.userAnswer || '(Bỏ trống)'}"
                    </span>
                  </div>

                  {!d.isCorrect && (
                    <span className="shrink-0 text-emerald-700 font-bold bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                      Đ/A: {d.correctAnswer}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={onRetry}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm Lại Lượt Mới (Trộn từ khóa)</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 transition-colors"
            >
              Đóng & Xem Lại Toàn Bài
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
