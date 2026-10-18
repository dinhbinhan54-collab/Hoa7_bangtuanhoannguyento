import React, { useState, useEffect } from 'react';
import { 
  Shuffle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Send, 
  BookOpen, 
  HelpCircle, 
  Award,
  Layers,
  ChevronRight,
  Info,
  Clock,
  Check,
  X
} from 'lucide-react';
import { THEORY_QUESTIONS } from '../data/theoryQuestions';
import { generateShuffledWordBank, WordBankItem, isAnswerCorrect } from '../utils/shuffle';
import { StudentInfo, AssessmentLevel, SubmissionRecord } from '../types';
import confetti from 'canvas-confetti';

interface TheoryFillGameProps {
  studentInfo: StudentInfo | null;
  onOpenStudentModal: () => void;
  onSubmitResults: (record: SubmissionRecord) => void;
  elapsedSeconds: number;
}

export const TheoryFillGame: React.FC<TheoryFillGameProps> = ({
  studentInfo,
  onOpenStudentModal,
  onSubmitResults,
  elapsedSeconds
}) => {
  // Shuffled word bank generated upon mounting (Requirement 3)
  const [wordBank, setWordBank] = useState<WordBankItem[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [activeBlankId, setActiveBlankId] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<AssessmentLevel | 'all'>('all');
  const [bankCategoryFilter, setBankCategoryFilter] = useState<string>('all');
  const [showOnlyUnused, setShowOnlyUnused] = useState<boolean>(false);
  const [isGraded, setIsGraded] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize and shuffle word bank on link open
  useEffect(() => {
    handleShuffleBank();
  }, []);

  const handleShuffleBank = () => {
    const shuffled = generateShuffledWordBank();
    setWordBank(shuffled);
  };

  // Calculate used words
  const usedWordsSet = new Set(Object.values(userAnswers).map(v => v.trim().toLowerCase()));

  // Count total blanks and filled blanks
  const allBlanks = THEORY_QUESTIONS.flatMap(q => q.blanks);
  const totalBlanksCount = allBlanks.length;
  const filledCount = Object.keys(userAnswers).filter(k => userAnswers[k]?.trim()).length;

  // Handle word selection from bank
  const handleSelectWord = (wordText: string) => {
    if (isGraded) return;

    // If an active blank is selected, place word there
    if (activeBlankId) {
      setUserAnswers(prev => ({
        ...prev,
        [activeBlankId]: wordText
      }));
      // Move to next empty blank automatically
      const nextEmptyBlank = allBlanks.find(b => b.id !== activeBlankId && !userAnswers[b.id]);
      if (nextEmptyBlank) {
        setActiveBlankId(nextEmptyBlank.id);
      } else {
        setActiveBlankId(null);
      }
      return;
    }

    // Otherwise find the first empty blank in view
    const firstEmpty = allBlanks.find(b => !userAnswers[b.id]);
    if (firstEmpty) {
      setUserAnswers(prev => ({
        ...prev,
        [firstEmpty.id]: wordText
      }));
      setActiveBlankId(firstEmpty.id);
    }
  };

  // Remove word from blank
  const handleRemoveFromBlank = (blankId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isGraded) return;
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[blankId];
      return copy;
    });
    setActiveBlankId(blankId);
  };

  // Manual typing in blank
  const handleBlankChange = (blankId: string, value: string) => {
    if (isGraded) return;
    setUserAnswers(prev => ({
      ...prev,
      [blankId]: value
    }));
  };

  // Drag and Drop support
  const handleDragStart = (e: React.DragEvent, text: string) => {
    e.dataTransfer.setData('text/plain', text);
  };

  const handleDrop = (e: React.DragEvent, blankId: string) => {
    e.preventDefault();
    if (isGraded) return;
    const wordText = e.dataTransfer.getData('text/plain');
    if (wordText) {
      setUserAnswers(prev => ({
        ...prev,
        [blankId]: wordText
      }));
      setActiveBlankId(blankId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Reset entire game
  const handleResetGame = () => {
    if (window.confirm('Bạn có chắc muốn xoá hết bài làm để làm lại từ đầu không?')) {
      setUserAnswers({});
      setIsGraded(false);
      setActiveBlankId(null);
      handleShuffleBank();
    }
  };

  // Grade and calculate scores
  const handleGradeAndSubmit = async () => {
    if (!studentInfo) {
      onOpenStudentModal();
      return;
    }

    setIsSubmitting(true);
    setIsGraded(true);

    let totalCorrect = 0;
    let nbCorrect = 0;
    let nbTotal = 0;
    let thCorrect = 0;
    let thTotal = 0;
    let vdCorrect = 0;
    let vdTotal = 0;

    const details = THEORY_QUESTIONS.flatMap(q => {
      return q.blanks.map(blank => {
        const userAns = userAnswers[blank.id] || '';
        const correct = isAnswerCorrect(userAns, blank.acceptedKeywords);
        
        if (correct) totalCorrect++;

        if (q.level === 'nhan_biet') {
          nbTotal++;
          if (correct) nbCorrect++;
        } else if (q.level === 'thong_hieu') {
          thTotal++;
          if (correct) thCorrect++;
        } else if (q.level === 'van_dung') {
          vdTotal++;
          if (correct) vdCorrect++;
        }

        return {
          blankId: blank.id,
          questionTitle: q.title,
          level: q.level,
          userAnswer: userAns,
          correctAnswer: blank.acceptedKeywords[0],
          isCorrect: correct
        };
      });
    });

    const totalScore = Number(((totalCorrect / totalBlanksCount) * 10).toFixed(1));
    const scoreNhanBiet = nbTotal > 0 ? Number(((nbCorrect / nbTotal) * 10).toFixed(1)) : 10;
    const scoreThongHieu = thTotal > 0 ? Number(((thCorrect / thTotal) * 10).toFixed(1)) : 10;
    const scoreVanDung = vdTotal > 0 ? Number(((vdCorrect / vdTotal) * 10).toFixed(1)) : 10;

    const submission: SubmissionRecord = {
      submissionId: 'SUB_' + Date.now().toString(36).toUpperCase(),
      timestamp: new Date().toLocaleString('vi-VN'),
      studentId: studentInfo.studentId,
      fullName: studentInfo.fullName,
      className: studentInfo.className,
      schoolName: studentInfo.schoolName,
      durationSeconds: elapsedSeconds || 120,
      totalScore,
      scoreNhanBiet,
      scoreThongHieu,
      scoreVanDung,
      correctCount: totalCorrect,
      totalBlanks: totalBlanksCount,
      details,
      teacherRemarks: '',
      syncStatus: 'local_only',
      syncMessage: 'Đang chuẩn bị đồng bộ...'
    };

    // Trigger confetti if high score
    if (totalScore >= 8.0) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Ignore if confetti not supported
      }
    }

    onSubmitResults(submission);
    setIsSubmitting(false);
  };

  // Filter questions
  const filteredQuestions = THEORY_QUESTIONS.filter(q => {
    if (filterLevel === 'all') return true;
    return q.level === filterLevel;
  });

  // Filter word bank items
  const filteredWordBank = wordBank.filter(item => {
    const isUsed = usedWordsSet.has(item.text.toLowerCase());
    if (showOnlyUnused && isUsed) return false;
    if (bankCategoryFilter !== 'all' && item.categoryTag !== bankCategoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Instructions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              Chương trình GDPT mới • SGK Bài 4
            </span>
            <span className="text-xs text-slate-500 font-medium">
              3 Cấp độ Yêu cầu cần đạt
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Trò Chơi Điền Lý Thuyết Bảng Tuần Hoàn
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Kéo thả hoặc nhấp chọn từ khóa từ ngân hàng phía dưới vào chỗ trống tương ứng.
          </p>
        </div>

        {/* Progress Tracker & Quick Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tiến độ điền
            </div>
            <div className="text-lg font-black text-indigo-600">
              {filledCount} / {totalBlanksCount} <span className="text-xs font-normal text-slate-500">ô trống</span>
            </div>
          </div>

          <div className="w-24 sm:w-32 bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(filledCount / totalBlanksCount) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Level Filter Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterLevel('all')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterLevel === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tất cả nội dung ({THEORY_QUESTIONS.length} bài)
          </button>
          <button
            onClick={() => setFilterLevel('nhan_biet')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              filterLevel === 'nhan_biet'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            1. Nhận biết (Nguyên tắc & Cấu tạo)
          </button>
          <button
            onClick={() => setFilterLevel('thong_hieu')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              filterLevel === 'thong_hieu'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            2. Thông hiểu (Kim loại, Phi kim, Khí hiếm)
          </button>
          <button
            onClick={() => setFilterLevel('van_dung')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              filterLevel === 'van_dung'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            3. Vận dụng (KLNT & Số proton)
          </button>
        </div>

        {isGraded && (
          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã chấm điểm xong</span>
          </div>
        )}
      </div>

      {/* Main Grid: Left = Theory Paragraphs with Blanks, Right = Shuffled Word Bank */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Theory Fill Exercises (7 Cols on LG) */}
        <div className="lg:col-span-8 space-y-6">
          {filteredQuestions.map((question) => (
            <div
              key={question.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${question.badgeColor}`}>
                    Mức {question.levelName}
                  </span>
                  <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    {question.title}
                  </h2>
                </div>
                {question.contextNote && (
                  <span className="text-[11px] font-medium text-slate-500 italic">
                    {question.contextNote}
                  </span>
                )}
              </div>

              <div className="text-xs text-indigo-700 font-semibold mb-3 flex items-center gap-1.5 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>Yêu cầu cần đạt: {question.competencyTarget}</span>
              </div>

              {/* Paragraphs with Interactive Blanks */}
              <div className="space-y-4 text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
                {question.paragraphs.map(p => (
                  <div key={p.id} className="whitespace-pre-line">
                    {p.parts.map((part, pIdx) => {
                      const blankDef = part.blankId ? question.blanks.find(b => b.id === part.blankId) : null;
                      const userVal = part.blankId ? userAnswers[part.blankId] || '' : '';
                      const isTargetActive = activeBlankId === part.blankId;
                      const isCorrect = blankDef && isGraded ? isAnswerCorrect(userVal, blankDef.acceptedKeywords) : null;

                      return (
                        <React.Fragment key={pIdx}>
                          <span>{part.textBefore}</span>
                          {part.blankId && blankDef && (
                            <span className="inline-block mx-1 my-1 align-middle">
                              <span
                                onDrop={(e) => handleDrop(e, part.blankId!)}
                                onDragOver={handleDragOver}
                                onClick={() => {
                                  if (!isGraded) {
                                    setActiveBlankId(part.blankId!);
                                  }
                                }}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold text-xs sm:text-sm border-2 transition-all cursor-pointer select-none ${
                                  isGraded
                                    ? isCorrect
                                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                                      : 'bg-rose-50 border-rose-500 text-rose-900'
                                    : userVal
                                    ? isTargetActive
                                      ? 'bg-indigo-100 border-indigo-600 text-indigo-900 shadow-xs'
                                      : 'bg-indigo-50 border-indigo-300 text-indigo-800 hover:border-indigo-500'
                                    : isTargetActive
                                    ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs animate-pulse ring-2 ring-amber-300'
                                    : 'bg-slate-100 border-dashed border-slate-300 text-slate-400 hover:border-indigo-400 hover:bg-indigo-50/40'
                                }`}
                                title={blankDef.hint || 'Nhấp để chọn từ khóa'}
                              >
                                {isGraded && (
                                  isCorrect ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                                  ) : (
                                    <X className="w-3.5 h-3.5 text-rose-600 stroke-[3]" />
                                  )
                                )}

                                <span className={userVal ? 'font-bold' : 'italic text-slate-400'}>
                                  {userVal || `[ ${blankDef.hint || 'Chọn từ...'} ]`}
                                </span>

                                {!isGraded && userVal && (
                                  <button
                                    onClick={(e) => handleRemoveFromBlank(part.blankId!, e)}
                                    className="ml-1 p-0.5 rounded-full hover:bg-slate-200/80 text-slate-500 transition-colors"
                                    title="Xoá để chọn lại"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </span>

                              {/* Grading Correction Indicator */}
                              {isGraded && !isCorrect && (
                                <span className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
                                  <span>Đ/A đúng:</span>
                                  <span className="underline">{blankDef.acceptedKeywords[0]}</span>
                                </span>
                              )}
                            </span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Explanations shown after grading */}
              {isGraded && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Giải thích chi tiết theo SGK Bài 4:
                  </span>
                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    {question.blanks.map(b => (
                      <div key={b.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                        <span className="font-bold text-slate-900">"{b.acceptedKeywords[0]}": </span>
                        <span>{b.explanation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Action Bottom Bar */}
          <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetGame}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm Lại Từ Đầu</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleGradeAndSubmit}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-200 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>{isGraded ? 'Xem Lại Điểm & Đồng Bộ' : 'Nộp Bài & Chấm Điểm Tức Thì'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Shuffled Word Bank (5 Cols on LG, Sticky) */}
        <div className="lg:col-span-4">
          <div className="sticky top-20 space-y-4">
            
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              
              {/* Word Bank Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      Ngân Hàng Từ Khóa
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Đã xáo trộn ngẫu nhiên (Yêu cầu 3)
                    </p>
                  </div>
                </div>

                {/* Reshuffle Button */}
                <button
                  onClick={handleShuffleBank}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1 text-xs font-bold"
                  title="Trộn ngẫu nhiên lại vị trí từ khóa"
                >
                  <Shuffle className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Trộn lại</span>
                </button>
              </div>

              {/* Guidance Notice */}
              <div className="my-3 p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900">
                💡 <b>Mẹo:</b> Nhấp vào một từ để điền vào ô trống đang chọn ({activeBlankId ? 'Đang chọn 1 ô' : 'Tự động chọn ô trống tiếp theo'}), hoặc kéo thả trực tiếp!
              </div>

              {/* Word Bank Filter Chips */}
              <div className="flex items-center gap-1 flex-wrap mb-3 pb-2 border-b border-slate-100">
                <button
                  onClick={() => setBankCategoryFilter('all')}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                    bankCategoryFilter === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất cả ({wordBank.length})
                </button>
                <button
                  onClick={() => setBankCategoryFilter('Nguyên tố')}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                    bankCategoryFilter === 'Nguyên tố'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
                  }`}
                >
                  Nguyên tố
                </button>
                <button
                  onClick={() => setBankCategoryFilter('Khái niệm')}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                    bankCategoryFilter === 'Khái niệm'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  Khái niệm
                </button>
                <button
                  onClick={() => setBankCategoryFilter('Con số')}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                    bankCategoryFilter === 'Con số'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  Con số
                </button>

                <label className="flex items-center gap-1 text-[11px] text-slate-600 ml-auto cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyUnused}
                    onChange={e => setShowOnlyUnused(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-0"
                  />
                  <span>Chưa dùng</span>
                </label>
              </div>

              {/* Words Chips Grid */}
              <div className="max-h-[60vh] overflow-y-auto pr-1 flex flex-wrap gap-1.5">
                {filteredWordBank.map((item) => {
                  const isUsed = usedWordsSet.has(item.text.toLowerCase());

                  return (
                    <button
                      key={item.id}
                      draggable={!isUsed && !isGraded}
                      onDragStart={(e) => handleDragStart(e, item.text)}
                      onClick={() => handleSelectWord(item.text)}
                      disabled={isGraded}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left select-none ${
                        isUsed
                          ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 line-through'
                          : 'bg-white border-slate-300 text-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 hover:text-indigo-900 shadow-2xs active:scale-95'
                      }`}
                    >
                      <span>{item.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Status footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Số từ đã dùng: {usedWordsSet.size} từ</span>
                <span>Còn lại: {wordBank.length - usedWordsSet.size} từ</span>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
