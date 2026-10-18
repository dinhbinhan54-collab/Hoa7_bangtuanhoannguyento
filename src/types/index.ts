export type AssessmentLevel = 'nhan_biet' | 'thong_hieu' | 'van_dung';

export interface StudentInfo {
  studentId: string; // Mã học sinh / Số báo danh
  fullName: string;  // Họ và tên
  className: string; // Lớp (ví dụ: 7A1, 7A2, 8A...)
  schoolName: string; // Tên trường học
  emailOrPhone?: string; // Liên hệ / Email
  avatarIcon?: string;
  startTime?: string;
}

export interface BlankItem {
  id: string;             // unique id e.g. "q1_b1"
  acceptedKeywords: string[]; // Các từ khóa chấp nhận (ví dụ ["điện tích hạt nhân", "Điện tích hạt nhân"])
  hint?: string;          // Gợi ý
  userAnswer?: string;    // Câu trả lời của học sinh
  isCorrect?: boolean;    // Kết quả sau khi chấm
  explanation: string;    // Trích dẫn giải thích khoa học từ SGK
}

export interface QuestionPart {
  textBefore?: string;
  blankId?: string;       // ID ô trống cần điền
}

export interface TheoryQuestion {
  id: string;
  title: string;
  level: AssessmentLevel;
  levelName: string;      // Nhận biết, Thông hiểu, Vận dụng
  competencyTarget: string; // Yêu cầu cần đạt
  badgeColor: string;
  contextNote?: string;   // Ghi chú hình minh họa (Hình 4.1, 4.2...)
  paragraphs: {
    id: string;
    parts: QuestionPart[];
  }[];
  blanks: BlankItem[];
}

export interface SubmissionRecord {
  submissionId: string;
  timestamp: string;      // ISO string or formatted datetime
  studentId: string;
  fullName: string;
  className: string;
  schoolName: string;
  durationSeconds: number; // Thời gian hoàn thành
  totalScore: number;     // Thang điểm 10
  scoreNhanBiet: number;  // Thang điểm 10
  scoreThongHieu: number; // Thang điểm 10
  scoreVanDung: number;   // Thang điểm 10
  correctCount: number;
  totalBlanks: number;
  details: {
    blankId: string;
    questionTitle: string;
    level: AssessmentLevel;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
  teacherRemarks?: string;
  syncStatus: 'synced' | 'pending' | 'error' | 'local_only';
  syncMessage?: string;
}

export interface SyncConfig {
  googleAppsScriptUrl: string; // URL web app của Google Apps Script
  sheetId?: string;
  syncPassword?: string;       // Mã PIN bảo mật giáo viên
  autoSyncOnSubmit: boolean;
  lastSyncedAt?: string;
}
