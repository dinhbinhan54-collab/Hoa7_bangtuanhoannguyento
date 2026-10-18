import React, { useState } from 'react';
import { User, School, Sparkles, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { StudentInfo } from '../types';

interface StudentInfoFormProps {
  initialInfo: StudentInfo | null;
  onSave: (info: StudentInfo) => void;
  onCancel?: () => void;
}

export const StudentInfoForm: React.FC<StudentInfoFormProps> = ({
  initialInfo,
  onSave,
  onCancel
}) => {
  const [fullName, setFullName] = useState(initialInfo?.fullName || '');
  const [className, setClassName] = useState(initialInfo?.className || '7A1');
  const [studentId, setStudentId] = useState(
    initialInfo?.studentId || 'HS' + Math.floor(1000 + Math.random() * 9000)
  );
  const [schoolName, setSchoolName] = useState(initialInfo?.schoolName || 'Trường THCS Lê Quý Đôn');
  const [emailOrPhone, setEmailOrPhone] = useState(initialInfo?.emailOrPhone || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Vui lòng nhập Họ và tên của bạn.');
      return;
    }
    if (!className.trim()) {
      setError('Vui lòng chọn hoặc nhập tên lớp.');
      return;
    }

    onSave({
      fullName: fullName.trim(),
      className: className.trim(),
      studentId: studentId.trim() || 'HS' + Math.floor(1000 + Math.random() * 9000),
      schoolName: schoolName.trim() || 'Trường THCS',
      emailOrPhone: emailOrPhone.trim(),
      startTime: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 px-6 py-6 text-white text-center relative">
          <div className="w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-md mx-auto flex items-center justify-center shadow-inner mb-3">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            Thông Tin Học Sinh Tham Gia
          </h2>
          <p className="text-xs text-indigo-100 mt-1 max-w-sm mx-auto">
            Trò chơi học tập môn Hoá học: Sơ lược về bảng tuần hoàn các nguyên tố (Nhận biết - Thông hiểu - Vận dụng)
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Họ và tên học sinh <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={e => {
                  setFullName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Ví dụ: Nguyễn Văn An"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium text-slate-900"
                autoFocus
              />
              <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Lớp học <span className="text-rose-500">*</span>
              </label>
              <select
                value={className}
                onChange={e => setClassName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium text-slate-900 bg-white"
              >
                <option value="7A1">Lớp 7A1</option>
                <option value="7A2">Lớp 7A2</option>
                <option value="7A3">Lớp 7A3</option>
                <option value="7A4">Lớp 7A4</option>
                <option value="8A1">Lớp 8A1</option>
                <option value="8A2">Lớp 8A2</option>
                <option value="Khác">Lớp khác</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mã học sinh / SBD
              </label>
              <input
                type="text"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                placeholder="HS0123"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Trường học
            </label>
            <div className="relative">
              <input
                type="text"
                value={schoolName}
                onChange={e => setSchoolName(e.target.value)}
                placeholder="Tên trường THCS..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium text-slate-900"
              />
              <School className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Lưu ý khi làm bài:
            </p>
            <p>• Ngân hàng từ khóa được trộn ngẫu nhiên mỗi lần mở ứng dụng.</p>
            <p>• Bạn có thể nhấp chọn từ khóa hoặc kéo thả vào các ô trống.</p>
            <p>• Kết quả và đánh giá 3 mức độ sẽ được lưu tự động vào Sổ Điểm Google Sheets.</p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-1/3 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors"
              >
                Hủy bỏ
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
            >
              <span>Vào Làm Bài Tập Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
