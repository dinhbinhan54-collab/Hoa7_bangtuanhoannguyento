import { THEORY_QUESTIONS } from '../data/theoryQuestions';

export interface WordBankItem {
  id: string;
  text: string;
  isUsed?: boolean;
  categoryTag?: 'Khái niệm' | 'Nguyên tố' | 'Con số' | 'Màu sắc/Vị trí';
}

// Extra realistic educational distractors for richer game bank
const DISTRACTORS: { text: string; categoryTag: WordBankItem['categoryTag'] }[] = [
  { text: 'số neutron', categoryTag: 'Khái niệm' },
  { text: 'khối lượng hạt nhân', categoryTag: 'Khái niệm' },
  { text: 'chu kì trung bình', categoryTag: 'Khái niệm' },
  { text: 'kim loại chuyển tiếp', categoryTag: 'Khái niệm' },
  { text: 'màu tím', categoryTag: 'Màu sắc/Vị trí' },
  { text: 'ở giữa bảng', categoryTag: 'Màu sắc/Vị trí' },
  { text: 'Magnesium', categoryTag: 'Nguyên tố' },
  { text: 'Potassium', categoryTag: 'Nguyên tố' },
  { text: 'Zinc', categoryTag: 'Nguyên tố' },
  { text: '6', categoryTag: 'Con số' },
  { text: '10', categoryTag: 'Con số' },
  { text: '14', categoryTag: 'Con số' },
  { text: '18', categoryTag: 'Con số' },
];

/**
 * Fisher-Yates shuffle algorithm for true randomness
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Categorize words for smart filtering in UI
 */
function guessCategory(text: string): WordBankItem['categoryTag'] {
  if (/^\d+/.test(text)) return 'Con số';
  if (['trái', 'phải', 'xanh lam', 'hồng', 'vàng'].includes(text.toLowerCase())) return 'Màu sắc/Vị trí';
  if (['hydrogen', 'carbon', 'oxygen', 'sodium', 'aluminium', 'iron', 'copper', 'chlorine', 'neon', 'nhôm', 'đồng', 'men-đê-lê-ép'].some(el => text.toLowerCase().includes(el))) {
    return 'Nguyên tố';
  }
  return 'Khái niệm';
}

/**
 * Build the complete shuffled word bank for the session
 */
export function generateShuffledWordBank(): WordBankItem[] {
  const extractedWords = new Set<string>();

  THEORY_QUESTIONS.forEach(section => {
    section.blanks.forEach(b => {
      // Use the canonical first accepted keyword
      if (b.acceptedKeywords.length > 0) {
        extractedWords.add(b.acceptedKeywords[0]);
      }
    });
  });

  const items: WordBankItem[] = Array.from(extractedWords).map((word, index) => ({
    id: `wb_${index}_${word.replace(/\s+/g, '_')}`,
    text: word,
    isUsed: false,
    categoryTag: guessCategory(word)
  }));

  // Add some distractors
  DISTRACTORS.forEach((d, idx) => {
    if (!extractedWords.has(d.text)) {
      items.push({
        id: `distractor_${idx}`,
        text: d.text,
        isUsed: false,
        categoryTag: d.categoryTag
      });
    }
  });

  // Shuffle upon generation
  return shuffleArray(items);
}

/**
 * Normalizes text for lenient yet accurate chemistry grading
 */
export function normalizeAnswer(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[,\.]/g, match => match === ',' ? ',' : '.');
}

/**
 * Checks if user's answer matches any accepted keywords
 */
export function isAnswerCorrect(userAns: string, accepted: string[]): boolean {
  if (!userAns) return false;
  const normalizedUser = normalizeAnswer(userAns);
  return accepted.some(ans => {
    const normAns = normalizeAnswer(ans);
    if (normalizedUser === normAns) return true;
    // Allow minor variations like "nhôm" vs "aluminium", or "35.5" vs "35,5"
    if (normalizedUser.replace(',', '.') === normAns.replace(',', '.')) return true;
    return false;
  });
}
