import { ATTRS, MATS, type Attr, type Mat } from "../data/mats";
import { QUESTIONS, type Option } from "../data/questions";

/** 예산 tier 1단계 초과당 감점 */
const BUDGET_PENALTY = 15;
const CENTER = 3;
/** 모든 사용자에게 깔리는 기본 가중치 (요가매트의 기본기) */
const BASE_WEIGHTS: Partial<Record<Attr, number>> = { gripDry: 1, stability: 1, durability: 1 };

export const REASON_TEXT: Record<Attr, string> = {
  gripDry: "마른 손에서도 그립이 단단해요",
  gripWet: "땀이 나도 잘 안 미끄러워요",
  cushion: "무릎·손목이 편한 쿠션감",
  stability: "서기 자세에서 흔들림이 적어요",
  light: "가벼워서 들고 다니기 좋아요",
  durability: "오래 써도 끄떡없는 내구성",
  value: "가격 부담이 적어요",
  lowSmell: "냄새가 적은 편이에요",
  design: "사진에 예쁘게 나와요",
};

export interface Persona {
  emoji: string;
  name: string;
  desc: string;
}

export interface ScoredMat {
  mat: Mat;
  score: number;
  /** 60~99 사이 표시용 매칭률 */
  match: number;
  reasons: string[];
}

export interface QuizResult {
  persona: Persona;
  best: ScoredMat;
  valuePick?: ScoredMat;
  longPick?: ScoredMat;
  ranked: ScoredMat[];
}

/** answers[i] = QUESTIONS[i]의 선택 옵션 index */
export function resolveOptions(answers: number[]): Option[] {
  return QUESTIONS.map((q, i) => q.options[answers[i]]).filter((o): o is Option => Boolean(o));
}

export function buildWeights(options: Option[]): Record<Attr, number> {
  const w = Object.fromEntries(ATTRS.map((a) => [a, BASE_WEIGHTS[a] ?? 0])) as Record<Attr, number>;
  for (const o of options) {
    for (const [k, v] of Object.entries(o.weights ?? {})) w[k as Attr] += v as number;
  }
  return w;
}

export function scoreMats(answers: number[]): QuizResult {
  const options = resolveOptions(answers);
  const weights = buildWeights(options);
  const budget = options.find((o) => o.budget)?.budget ?? 3;
  const excludeLatex = options.some((o) => o.excludeLatex);

  const candidates = MATS.filter((m) => !(excludeLatex && m.latex));

  const raw = candidates.map((mat) => {
    let score = 0;
    const contrib: [Attr, number][] = [];
    for (const a of ATTRS) {
      // 중앙값(3) 기준으로 계산 → 사용자가 중요하게 본 속성이 약하면 감점됨
      const c = (mat.attrs[a] - CENTER) * weights[a];
      score += c;
      if (weights[a] > 0) contrib.push([a, c]);
    }
    if (mat.priceTier > budget) score -= BUDGET_PENALTY * (mat.priceTier - budget);
    // 이유: 기여도 높은 순 + 매트가 실제로 그 속성이 좋은(>=4) 것만
    const reasons = contrib
      .filter(([a]) => mat.attrs[a] >= 4)
      .sort((x, y) => y[1] - x[1])
      .slice(0, 2)
      .map(([a]) => REASON_TEXT[a]);
    return { mat, score, reasons };
  });

  raw.sort((a, b) => b.score - a.score);
  const max = raw[0].score;
  const min = raw[raw.length - 1].score;
  const ranked: ScoredMat[] = raw.map((r) => ({
    ...r,
    match: max === min ? 90 : Math.round(60 + (39 * (r.score - min)) / (max - min)),
  }));

  const [best, ...rest] = ranked;
  const pick = (pool: ScoredMat[], bonus: (m: Mat) => number, cond: (m: Mat) => boolean) =>
    pool
      .filter((r) => cond(r.mat))
      .sort((a, b) => b.score + bonus(b.mat) - (a.score + bonus(a.mat)))[0];

  const valuePick = pick(rest, (m) => m.attrs.value * 4, (m) => m.priceTier < best.mat.priceTier || m.attrs.value >= 4);
  const longPick = pick(
    rest.filter((r) => r !== valuePick),
    (m) => m.attrs.durability * 4,
    (m) => m.attrs.durability >= 4,
  );

  return { persona: getPersona(options), best, valuePick, longPick, ranked };
}

export function getPersona(options: Option[]): Persona {
  const has = (id: string) => options.some((o) => o.id === id);

  if (has("place-overlay"))
    return { emoji: "🧳", name: "요가원 미니멀형", desc: "요가원 매트는 그대로, 위생은 확실하게" };
  if (has("sweat-high") && has("style-dynamic"))
    return { emoji: "🔥", name: "땀손 빈야사형", desc: "흐르는 땀도 그립으로 이겨내는 타입" };
  if (has("sweat-high"))
    return { emoji: "💦", name: "땀손 요기니형", desc: "다운독에서 미끄러지는 건 이제 그만" };
  if (has("joint-high") || has("style-mixed"))
    return { emoji: "☁️", name: "푹신 힐링형", desc: "몸이 편해야 수련도 오래 가는 타입" };
  if (has("long-forever") && has("budget-high"))
    return { emoji: "💎", name: "평생템 수집형", desc: "좋은 거 하나 사서 오래 쓰는 타입" };
  if (has("budget-low") || has("long-try"))
    return { emoji: "🌱", name: "일단 시작형", desc: "장비보다 매트 위에 서는 게 먼저인 타입" };
  if (has("place-carry"))
    return { emoji: "🎒", name: "요가원 출퇴근형", desc: "매트 메고 요가원 가는 게 일상인 타입" };
  return { emoji: "🧘", name: "밸런스 요기니형", desc: "그립·쿠션·가격 다 적당히 챙기는 타입" };
}

/* ---------- URL 인코딩: 답변 index를 한 자리씩 이어붙임 (예: "01210010") ---------- */

export function encodeAnswers(answers: number[]): string {
  return answers.join("");
}

export function decodeAnswers(s: string | null | undefined): number[] | null {
  if (!s || s.length !== QUESTIONS.length || !/^\d+$/.test(s)) return null;
  const arr = s.split("").map(Number);
  return arr.every((v, i) => v < QUESTIONS[i].options.length) ? arr : null;
}
