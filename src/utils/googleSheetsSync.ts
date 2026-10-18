import { SubmissionRecord, SyncConfig } from '../types';

export const LOCAL_STORAGE_KEY_SUBMISSIONS = 'hoa_hoc_submissions_v1';
export const LOCAL_STORAGE_KEY_CONFIG = 'hoa_hoc_sync_config_v1';
export const DEFAULT_TEACHER_PIN = '123456';

export const DEFAULT_SYNC_CONFIG: SyncConfig = {
  googleAppsScriptUrl: '',
  sheetId: '',
  syncPassword: DEFAULT_TEACHER_PIN,
  autoSyncOnSubmit: true,
  lastSyncedAt: undefined
};

// Initial realistic demo submissions for instant teacher review
export const INITIAL_DEMO_SUBMISSIONS: SubmissionRecord[] = [
  {
    submissionId: 'sub_demo_001',
    timestamp: new Date(Date.now() - 3600000 * 2).toLocaleString('vi-VN'),
    studentId: 'HS0801',
    fullName: 'Nguyễn Minh Quân',
    className: '7A1',
    schoolName: 'THCS Lê Quý Đôn',
    durationSeconds: 185,
    totalScore: 9.5,
    scoreNhanBiet: 10,
    scoreThongHieu: 10,
    scoreVanDung: 8.8,
    correctCount: 30,
    totalBlanks: 32,
    details: [],
    teacherRemarks: 'Hiểu bài rất chắc, nắm vững vị trí kim loại và phi kim.',
    syncStatus: 'synced',
    syncMessage: 'Đã đồng bộ với Google Sheets'
  },
  {
    submissionId: 'sub_demo_002',
    timestamp: new Date(Date.now() - 3600000 * 5).toLocaleString('vi-VN'),
    studentId: 'HS0802',
    fullName: 'Trần Thị Thu Hà',
    className: '7A1',
    schoolName: 'THCS Lê Quý Đôn',
    durationSeconds: 240,
    totalScore: 8.2,
    scoreNhanBiet: 9.0,
    scoreThongHieu: 8.5,
    scoreVanDung: 7.0,
    correctCount: 26,
    totalBlanks: 32,
    details: [],
    teacherRemarks: 'Cần ôn thêm phần KLNT của Aluminium và Chlorine.',
    syncStatus: 'synced',
    syncMessage: 'Đã đồng bộ với Google Sheets'
  },
  {
    submissionId: 'sub_demo_003',
    timestamp: new Date(Date.now() - 3600000 * 12).toLocaleString('vi-VN'),
    studentId: 'HS0815',
    fullName: 'Lê Hoàng Long',
    className: '7A2',
    schoolName: 'THCS Lê Quý Đôn',
    durationSeconds: 310,
    totalScore: 6.8,
    scoreNhanBiet: 8.0,
    scoreThongHieu: 6.5,
    scoreVanDung: 5.5,
    correctCount: 22,
    totalBlanks: 32,
    details: [],
    teacherRemarks: 'Xem lại mối quan hệ giữa chu kì và số lớp electron.',
    syncStatus: 'local_only',
    syncMessage: 'Chưa đẩy lên Google Sheets'
  }
];

export function getLocalSubmissions(): SubmissionRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_SUBMISSIONS);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY_SUBMISSIONS, JSON.stringify(INITIAL_DEMO_SUBMISSIONS));
      return INITIAL_DEMO_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load local submissions:', err);
    return INITIAL_DEMO_SUBMISSIONS;
  }
}

export function saveLocalSubmissions(submissions: SubmissionRecord[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_SUBMISSIONS, JSON.stringify(submissions));
  } catch (err) {
    console.error('Failed to save local submissions:', err);
  }
}

export function getSyncConfig(): SyncConfig {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_CONFIG);
    if (!raw) return DEFAULT_SYNC_CONFIG;
    return { ...DEFAULT_SYNC_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SYNC_CONFIG;
  }
}

export function saveSyncConfig(cfg: SyncConfig): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_CONFIG, JSON.stringify(cfg));
  } catch (err) {
    console.error('Failed to save sync config:', err);
  }
}

/**
 * Sends a single student submission to the Google Apps Script Web App
 */
export async function pushSubmissionToGoogleSheet(
  submission: SubmissionRecord,
  scriptUrl: string
): Promise<{ success: boolean; message: string }> {
  if (!scriptUrl || !scriptUrl.startsWith('http')) {
    return { success: false, message: 'Chưa cấu hình URL Google Apps Script.' };
  }

  try {
    const payload = {
      action: 'submitScore',
      data: submission
    };

    const res = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // Text plain avoids preflight CORS restrictions on Apps Script
      },
      body: JSON.stringify(payload),
      mode: 'cors'
    });

    const result = await res.json();
    if (result && result.status === 'success') {
      return { success: true, message: result.message || 'Đồng bộ thành công lên Google Sheets' };
    }
    return { success: false, message: result.message || 'Lỗi phản hồi từ Google Sheets' };
  } catch (err: any) {
    // If CORS fails or network fails, try fallback or report
    console.warn('Apps Script sync direct post error:', err);
    return { success: false, message: err.message || 'Không thể kết nối đến Google Apps Script' };
  }
}

/**
 * 2-way sync: Fetches latest data from Google Sheet and merges with local data
 */
export async function syncTwoWayWithGoogleSheet(
  scriptUrl: string
): Promise<{ success: boolean; data?: SubmissionRecord[]; message: string }> {
  if (!scriptUrl || !scriptUrl.startsWith('http')) {
    return { success: false, message: 'Vui lòng cung cấp URL Google Apps Script hợp lệ.' };
  }

  try {
    const res = await fetch(`${scriptUrl}?action=getScores`, {
      method: 'GET',
      mode: 'cors'
    });

    const result = await res.json();
    if (result && result.status === 'success' && Array.isArray(result.data)) {
      const remoteData: SubmissionRecord[] = result.data;
      const localData = getLocalSubmissions();

      // Merge by submissionId
      const mergedMap = new Map<string, SubmissionRecord>();
      localData.forEach(item => mergedMap.set(item.submissionId, item));
      remoteData.forEach(item => mergedMap.set(item.submissionId, { ...item, syncStatus: 'synced' }));

      const mergedList = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      saveLocalSubmissions(mergedList);
      return {
        success: true,
        data: mergedList,
        message: `Đã đồng bộ 2 chiều thành công (${mergedList.length} học sinh trong sổ điểm).`
      };
    }

    return { success: false, message: result.message || 'Không thể lấy dữ liệu từ Google Sheets.' };
  } catch (err: any) {
    console.error('Two-way sync error:', err);
    return { success: false, message: 'Lỗi đồng bộ: ' + (err.message || 'Kiểm tra lại quyền truy cập Anyone của Web App') };
  }
}

/**
 * Full, ready-to-paste Google Apps Script source code
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * TẬP LỆNH ỨNG DỤNG GOOGLE (GOOGLE APPS SCRIPT)
 * ĐỒNG BỘ 2 CHIỀU "SỔ ĐIỂM & BÁO CÁO HỌC SINH" - BẢNG TUẦN HOÀN HOÁ HỌC
 * 
 * Hướng dẫn triển khai:
 * 1. Mở trang tính Google Sheets của bạn.
 * 2. Vào menu "Tiện ích mở rộng" -> "Apps Script" (Extensions -> Apps Script).
 * 3. Xoá hết mã cũ và dán toàn bộ đoạn mã này vào tệp Code.gs.
 * 4. Nhấn nút "Lưu" (Save - biểu tượng đĩa mềm).
 * 5. Nhấn "Triển khai" -> "Triển khai mới" (Deploy -> New deployment).
 * 6. Chọn loại: "Ứng dụng web" (Web app).
 *    - Mô tả: "Đồng bộ sổ điểm Hóa học"
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me)
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone)
 * 7. Nhấn "Triển khai", cấp quyền và sao chép URL ứng dụng web dán vào ứng dụng!
 */

const SHEET_NAME = "SoDiem_BaoCao";

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Tạo tiêu đề các cột chuẩn hoá
    const headers = [
      "Mã Phiếu",
      "Dấu Thời Gian",
      "Mã Học Sinh",
      "Họ Và Tên",
      "Lớp",
      "Trường",
      "Tổng Điểm (10)",
      "Nhận Biết (10)",
      "Thông Hiểu (10)",
      "Vận Dụng (10)",
      "Số Câu Đúng",
      "Tổng Số Câu",
      "Thời Gian Làm (giây)",
      "Nhận Xét Giáo Viên",
      "Trạng Thái"
    ];
    sheet.appendRow(headers);
    // Định dạng dòng tiêu đề
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#1e293b");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Xử lý lấy dữ liệu (GET) - Đồng bộ từ Google Sheets về App
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const rows = sheet.getDataRange().getValues();
    const headers = rows[0];
    const data = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[0]) continue;
      data.push({
        submissionId: String(row[0]),
        timestamp: String(row[1]),
        studentId: String(row[2]),
        fullName: String(row[3]),
        className: String(row[4]),
        schoolName: String(row[5]),
        totalScore: Number(row[6]) || 0,
        scoreNhanBiet: Number(row[7]) || 0,
        scoreThongHieu: Number(row[8]) || 0,
        scoreVanDung: Number(row[9]) || 0,
        correctCount: Number(row[10]) || 0,
        totalBlanks: Number(row[11]) || 0,
        durationSeconds: Number(row[12]) || 0,
        teacherRemarks: String(row[13] || ""),
        syncStatus: "synced"
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      count: data.length,
      data: data
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Xử lý ghi dữ liệu (POST) - Học sinh nộp bài hoặc Giáo viên cập nhật
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    let body = {};
    if (e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    const action = body.action || "submitScore";
    const data = body.data;

    if (!data) {
      throw new Error("Không có dữ liệu bài nộp.");
    }

    if (action === "submitScore") {
      // Kiểm tra xem đã có mã phiếu submissionId này chưa
      const values = sheet.getDataRange().getValues();
      let rowIndex = -1;
      for (let i = 1; i < values.length; i++) {
        if (values[i][0] == data.submissionId) {
          rowIndex = i + 1;
          break;
        }
      }

      const rowData = [
        data.submissionId,
        data.timestamp || new Date().toLocaleString("vi-VN"),
        data.studentId,
        data.fullName,
        data.className,
        data.schoolName,
        data.totalScore,
        data.scoreNhanBiet,
        data.scoreThongHieu,
        data.scoreVanDung,
        data.correctCount,
        data.totalBlanks,
        data.durationSeconds,
        data.teacherRemarks || "",
        "Đã ghi sổ điểm"
      ];

      if (rowIndex > 0) {
        sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
      } else {
        sheet.appendRow(rowData);
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Đã lưu kết quả học sinh vào Sổ Điểm Google Sheets thành công!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "updateRemark") {
      const values = sheet.getDataRange().getValues();
      let found = false;
      for (let i = 1; i < values.length; i++) {
        if (values[i][0] == data.submissionId) {
          sheet.getRange(i + 1, 14).setValue(data.teacherRemarks);
          found = true;
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: found ? "success" : "not_found",
        message: found ? "Đã cập nhật nhận xét giáo viên" : "Không tìm thấy mã phiếu"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Action không hợp lệ: " + action
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;
