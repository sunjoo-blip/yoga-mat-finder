import type { Attr } from "./mats";

export interface Option {
  id: string;
  label: string;
  /** 속성 가중치 (음수 가능) */
  weights?: Partial<Record<Attr, number>>;
  /** 예산 상한 tier — 넘는 매트는 감점 */
  budget?: 1 | 2 | 3;
  /** 천연고무 매트 제외 */
  excludeLatex?: boolean;
}

export interface Question {
  id: string;
  title: string;
  hint?: string;
  options: Option[];
}

/**
 * 질문 순서 = URL 인코딩 순서. 질문/옵션 순서를 바꾸면 기존 공유 링크 결과가 달라지니 주의.
 */
export const QUESTIONS: Question[] = [
  {
    id: "sweat",
    title: "수련할 때 손발에 땀이 많은 편인가요?",
    hint: "다운독에서 손이 쭉 미끄러진 적 있다면 '네'",
    options: [
      { id: "sweat-high", label: "네, 손이 미끄러져요 💦", weights: { gripWet: 4 } },
      { id: "sweat-mid", label: "보통이에요", weights: { gripWet: 1, gripDry: 1 } },
      { id: "sweat-low", label: "거의 안 나요", weights: { gripDry: 2 } },
    ],
  },
  {
    id: "place",
    title: "매트를 주로 어디서 쓸 건가요?",
    options: [
      { id: "place-studio", label: "요가원에 두고 쓸 거예요 🧘", weights: {} },
      { id: "place-home", label: "집에서 홈요가 위주예요 🏠", weights: { cushion: 1, stability: 1 } },
      { id: "place-both", label: "집이랑 요가원 반반", weights: { light: 1 } },
      { id: "place-carry", label: "매번 들고 다닐 거예요 🎒", weights: { light: 3 } },
    ],
  },
  {
    id: "style",
    title: "주로 어떤 수업을 들으세요?",
    options: [
      { id: "style-dynamic", label: "빈야사·아쉬탕가처럼 땀나는 수업 🔥", weights: { stability: 2, gripWet: 1 } },
      { id: "style-calm", label: "하타·인·힐링처럼 차분한 수업 🧘", weights: { cushion: 2 } },
      { id: "style-mixed", label: "필라테스·홈트도 같이 할 거예요", weights: { cushion: 3, stability: -1 } },
      { id: "style-unknown", label: "아직 잘 모르겠어요", weights: {} },
    ],
  },
  {
    id: "joint",
    title: "무릎이나 손목이 예민한 편인가요?",
    options: [
      { id: "joint-high", label: "네, 무릎 대면 아파요", weights: { cushion: 3 } },
      { id: "joint-mid", label: "가끔 신경 쓰여요", weights: { cushion: 1 } },
      { id: "joint-low", label: "전혀요", weights: { stability: 1 } },
    ],
  },
  {
    id: "budget",
    title: "매트 예산은 어느 정도예요?",
    options: [
      { id: "budget-low", label: "3만원 안팎 💸", weights: { value: 4 }, budget: 1 },
      { id: "budget-mid", label: "10만원 이하", weights: { value: 1 }, budget: 2 },
      { id: "budget-high", label: "좋은 거면 상관없어요 💎", weights: {}, budget: 3 },
    ],
  },
  {
    id: "longevity",
    title: "매트를 얼마나 오래 쓰고 싶어요?",
    options: [
      { id: "long-forever", label: "한 번 사서 평생 쓰고 싶어요", weights: { durability: 3 } },
      { id: "long-mid", label: "1~2년 쓰고 바꿔도 괜찮아요", weights: { durability: 1, value: 1 } },
      { id: "long-try", label: "일단 해보고 계속할지 볼래요", weights: { value: 2 } },
    ],
  },
  {
    id: "smell",
    title: "고무 냄새나 라텍스는 괜찮아요?",
    hint: "천연고무 매트는 처음에 고무 냄새가 나요",
    options: [
      { id: "smell-allergy", label: "라텍스 알레르기가 있어요 ⚠️", excludeLatex: true, weights: { lowSmell: 1 } },
      { id: "smell-sensitive", label: "냄새에 예민한 편이에요", weights: { lowSmell: 3 } },
      { id: "smell-ok", label: "상관없어요", weights: {} },
    ],
  },
  {
    id: "insta",
    title: "마지막! 매트 사진 인스타에 올릴 거예요? 📸",
    options: [
      { id: "insta-yes", label: "당연하죠, 예뻐야 해요", weights: { design: 2 } },
      { id: "insta-no", label: "기능만 좋으면 돼요", weights: {} },
    ],
  },
];
