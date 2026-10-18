import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Code2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Save, 
  Download,
  AlertCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { SyncConfig } from '../types';
import { GOOGLE_APPS_SCRIPT_CODE } from '../utils/googleSheetsSync';

interface GoogleSheetSetupGuideProps {
  syncConfig: SyncConfig;
  onSaveConfig: (cfg: SyncConfig) => void;
  onBackToGame: () => void;
}

export const GoogleSheetSetupGuide: React.FC<GoogleSheetSetupGuideProps> = ({
  syncConfig,
  onSaveConfig,
  onBackToGame
}) => {
  const [scriptUrl, setScriptUrl] = useState(syncConfig.googleAppsScriptUrl || '');
  const [pin, setPin] = useState(syncConfig.syncPassword || '123456');
  const [autoSync, setAutoSync] = useState(syncConfig.autoSyncOnSubmit ?? true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'testing' | 'success' | 'error'; message: string }>({
    status: 'idle',
    message: ''
  });
  const [saveFeedback, setSaveFeedback] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...syncConfig,
      googleAppsScriptUrl: scriptUrl.trim(),
      syncPassword: pin.trim() || '123456',
      autoSyncOnSubmit: autoSync
    });
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 3000);
  };

  const handleTestConnection = async () => {
    if (!scriptUrl.trim()) {
      setTestResult({
        status: 'error',
        message: 'Vui lòng dán URL Web App của Google Apps Script trước.'
      });
      return;
    }

    setTestResult({ status: 'testing', message: 'Đang gửi yêu cầu kiểm tra kết nối...' });

    try {
      const res = await fetch(`${scriptUrl.trim()}?action=getScores`, {
        method: 'GET',
        mode: 'cors'
      });
      const data = await res.json();
      if (data && data.status === 'success') {
        setTestResult({
          status: 'success',
          message: `Kết nối thành công! Đã tìm thấy trang tính với ${data.count ?? 0} dòng dữ liệu.`
        });
      } else {
        setTestResult({
          status: 'error',
          message: data.message || 'Phản hồi không xác định từ Google Apps Script.'
        });
      }
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: 'Không thể kết nối. Hãy đảm bảo bạn đã chọn quyền "Ai có quyền truy cập: Bất kỳ ai" (Anyone) khi Triển khai Web App.'
      });
    }
  };

  const handleDownloadSampleCSV = () => {
    const headers = [
      'Mã Phiếu', 'Dấu Thời Gian', 'Mã Học Sinh', 'Họ Và Tên', 'Lớp', 'Trường',
      'Tổng Điểm (10)', 'Nhận Biết (10)', 'Thông Hiểu (10)', 'Vận Dụng (10)',
      'Số Câu Đúng', 'Tổng Số Câu', 'Thời Gian Làm (giây)', 'Nhận Xét Giáo Viên', 'Trạng Thái'
    ];
    const sampleRow = [
      'SUB_DEMO_01', '18/10/2026 09:30:00', 'HS0801', 'Nguyễn Minh Quân', '7A1', 'THCS Lê Quý Đôn',
      '9.5', '10', '10', '8.8', '30', '32', '185', 'Nắm vững kiến thức bài 4', 'Đã ghi sổ điểm'
    ];
    const csvContent = '\uFEFF' + headers.join(',') + '\n' + sampleRow.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Mau_Trang_Tinh_So_Diem_Hoa_Hoc_7A.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Cấu trúc tập lệnh ứng dụng & Trang tính Google
          </span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          Cài Đặt Đồng Bộ 2 Chiều "Sổ Điểm & Báo Cáo Học Sinh"
        </h1>
        <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl">
          Hướng dẫn tích hợp Google Sheets thông qua Google Apps Script Web App giúp học sinh nộp bài tự động ghi sổ và giáo viên theo dõi kết quả 2 chiều theo thời gian thực.
        </p>
      </div>

      {/* Configuration Form Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h2 className="text-base font-extrabold text-slate-900 mb-1 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
          Thông Tin Kết Nối Google Sheets Của Lớp Bạn
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Dán đường dẫn Web App đã triển khai từ Google Apps Script của bạn vào ô dưới đây.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              URL Web App (Google Apps Script Endpoint) <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={scriptUrl}
                onChange={e => setScriptUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleTestConnection}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors shrink-0"
              >
                Kiểm tra kết nối
              </button>
            </div>
          </div>

          {testResult.message && (
            <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
              testResult.status === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : testResult.status === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
            }`}>
              {testResult.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {testResult.status === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mã PIN bảo mật Sổ Điểm Giáo Viên
              </label>
              <input
                type="text"
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="123456"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Mã này dùng để mở khóa tab "Sổ Điểm & Báo Cáo"
              </span>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={e => setAutoSync(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-0 w-4 h-4"
                />
                <span>Tự động đồng bộ lên Google Sheets ngay khi học sinh nộp bài</span>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {saveFeedback && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Đã lưu cấu hình thành công!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-200 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Cấu Hình</span>
            </button>
          </div>

        </form>
      </div>

      {/* Step by Step Guide */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
          4 Bước Cài Đặt Tập Lệnh Ứng Dụng (Google Apps Script)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
              Tạo trang tính Google Sheets mới
            </div>
            <p className="text-slate-600 text-xs">
              Vào <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline inline-flex items-center gap-0.5">sheets.new <ExternalLink className="w-3 h-3" /></a> để tạo trang tính mới. Đặt tên trang tính ví dụ: <i>"SoDiem_HoaHoc_7A"</i>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
              Mở Trình biên tập Apps Script
            </div>
            <p className="text-slate-600 text-xs">
              Trên thanh công cụ Google Sheets, nhấp vào <b>Tiện ích mở rộng (Extensions)</b> → <b>Apps Script</b>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">3</span>
              Dán mã nguồn Code.gs
            </div>
            <p className="text-slate-600 text-xs">
              Sao chép đoạn mã hoàn chỉnh bên dưới, dán đè vào tệp <code>Code.gs</code> rồi nhấn biểu tượng <b>Lưu (Ctrl + S)</b>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">4</span>
              Triển khai ứng dụng web
            </div>
            <p className="text-slate-600 text-xs">
              Bấm <b>Triển khai (Deploy)</b> → <b>Triển khai mới</b> → Chọn loại <b>Ứng dụng web (Web app)</b>. Tại mục <i>"Ai có quyền truy cập" (Who has access)</i>, chọn <b>"Bất kỳ ai" (Anyone)</b>. Sao chép link URL nhận được dán vào ô trên!
            </p>
          </div>

        </div>

        {/* Copyable Code Block */}
        <div className="border border-slate-300 rounded-2xl overflow-hidden">
          <div className="bg-slate-900 px-4 py-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold">Code.gs (Tập lệnh ứng dụng Google Sheets)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadSampleCSV}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Tải tệp mẫu CSV cấu trúc 15 cột"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tải tệp mẫu CSV</span>
              </button>

              <button
                onClick={handleCopyCode}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Đã sao chép!' : 'Sao chép mã Code.gs'}</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 p-4 max-h-72 overflow-y-auto text-xs font-mono text-emerald-300">
            <pre>{GOOGLE_APPS_SCRIPT_CODE}</pre>
          </div>
        </div>

        {/* Structure Preview */}
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
          <h4 className="text-xs font-bold text-emerald-900 mb-2">
            Cấu trúc 15 Cột Dữ Liệu Tự Động Tạo Trên Google Sheet (Sheet: "SoDiem_BaoCao"):
          </h4>
          <div className="flex flex-wrap gap-1 text-[11px]">
            {[
              '1. Mã Phiếu', '2. Dấu Thời Gian', '3. Mã Học Sinh', '4. Họ Và Tên', '5. Lớp',
              '6. Trường', '7. Tổng Điểm (10)', '8. Nhận Biết (10)', '9. Thông Hiểu (10)',
              '10. Vận Dụng (10)', '11. Số Câu Đúng', '12. Tổng Số Câu', '13. Thời Gian (giây)',
              '14. Nhận Xét Giáo Viên', '15. Trạng Thái'
            ].map((col, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-800 font-medium">
                {col}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
