/**
 * 매트 후보 데이터.
 *
 * attrs는 0~5 상대 점수 (초보자 관점 체감 기준). 브랜드 공식 스펙이 아니라
 * "추천 로직용 가중치"라서, 실제 써본 느낌에 맞게 자유롭게 조정하면 됨.
 * 무게/두께는 대표 스펙 근사치 — 배포 전에 공식 페이지로 한 번 검수할 것.
 *
 * priceTier: 1 = ~3만원, 2 = 3~10만원, 3 = 10만원+
 */

export type Attr =
  | "gripDry" // 마른 손 그립
  | "gripWet" // 땀날 때 그립
  | "cushion" // 쿠션감 (무릎·손목)
  | "stability" // 서기 자세 안정감 (너무 푹신하면 낮음)
  | "light" // 가벼움 / 휴대성
  | "durability" // 내구성
  | "value" // 가격 부담 적음
  | "lowSmell" // 냄새 적음
  | "design"; // 사진발

export const ATTRS: Attr[] = [
  "gripDry",
  "gripWet",
  "cushion",
  "stability",
  "light",
  "durability",
  "value",
  "lowSmell",
  "design",
];

export interface Mat {
  id: string;
  name: string;
  brand: string;
  emoji: string;
  /** 한 줄 소개 */
  tagline: string;
  material: string;
  thickness: string;
  weight: string;
  priceTier: 1 | 2 | 3;
  /** 천연고무(라텍스) 포함 여부 — 알레르기 하드 필터용 */
  latex: boolean;
  attrs: Record<Attr, number>;
  pros: string[];
  cons: string[];
  /** 네이버 검색어 (buyUrl 없을 때 사용, 제휴 링크 아님) */
  searchQuery: string;
  /** 공식몰 등 직접 링크가 있으면 네이버 검색 대신 이걸로 연결 */
  buy?: { label: string; url: string };
  /** 결과 카드 색 (사진 없을 때 일러스트 색으로도 사용) */
  color: string;
  /**
   * 매트 사진 경로. public/mats/<id>.jpg 를 넣고 "/mats/<id>.jpg" 로 지정.
   * 직접 찍은 사진만 넣을 것 (브랜드 공식 이미지는 저작권 있음). 없으면 일러스트.
   */
  image?: string;
}

export const MATS: Mat[] = [
  {
    id: "manduka-pro",
    name: "만두카 PRO 6mm",
    brand: "Manduka",
    emoji: "🖤",
    tagline: "한 번 사면 10년, 요가계의 평생템",
    material: "PVC (밀폐 셀)",
    thickness: "6mm",
    weight: "약 3.4kg",
    priceTier: 3,
    latex: false,
    attrs: { gripDry: 4, gripWet: 2, cushion: 4, stability: 5, light: 1, durability: 5, value: 1, lowSmell: 5, design: 3 },
    pros: ["압도적인 내구성", "단단하면서 쿠션 있는 밀도", "땀이 스며들지 않아 위생적"],
    cons: ["새 매트는 미끄러워서 길들이기 필요", "무거워서 매일 들고 다니긴 힘듦"],
    searchQuery: "만두카 프로 요가매트 6mm",
    color: "#2f2f35",
  },
  {
    id: "manduka-prolite",
    name: "만두카 PROlite 4.7mm",
    brand: "Manduka",
    emoji: "🤍",
    tagline: "PRO의 내구성, 들고 다닐 수 있는 무게",
    material: "PVC (밀폐 셀)",
    thickness: "4.7mm",
    weight: "약 1.8kg",
    priceTier: 3,
    latex: false,
    attrs: { gripDry: 4, gripWet: 2, cushion: 3, stability: 4, light: 3, durability: 5, value: 2, lowSmell: 5, design: 3 },
    pros: ["PRO 라인 내구성 그대로", "요가원 출퇴근 가능한 무게"],
    cons: ["역시 길들이기 기간이 있음", "땀 많으면 수건 필요"],
    searchQuery: "만두카 프로라이트 요가매트",
    color: "#8a8f98",
  },
  {
    id: "manduka-grp",
    name: "만두카 GRP 어댑트 5mm",
    brand: "Manduka",
    emoji: "🔥",
    tagline: "핫요가·땀손을 위해 만든 그립",
    material: "PU 상판 + 천연고무",
    thickness: "5mm",
    weight: "약 2.5kg",
    priceTier: 3,
    latex: true,
    attrs: { gripDry: 4, gripWet: 5, cushion: 4, stability: 4, light: 1, durability: 4, value: 1, lowSmell: 3, design: 3 },
    pros: ["땀 흡수형 상판이라 젖어도 그립 유지", "쿠션도 넉넉"],
    cons: ["가격대 높음", "무거운 편이라 홈요가에 더 적합"],
    searchQuery: "만두카 GRP 어댑트 요가매트",
    color: "#3c4a3e",
  },
  {
    id: "lululemon-5mm",
    name: "룰루레몬 The Mat 5mm",
    brand: "lululemon",
    emoji: "💦",
    tagline: "땀손 요기니들의 1순위",
    material: "PU 상판 + 천연고무",
    thickness: "5mm",
    weight: "약 2.4kg",
    priceTier: 3,
    latex: true,
    attrs: { gripDry: 5, gripWet: 5, cushion: 4, stability: 4, light: 2, durability: 3, value: 2, lowSmell: 2, design: 5 },
    pros: ["땀나도 쫀득한 PU 그립", "컬러가 예뻐서 사진발 최고"],
    cons: ["처음엔 고무 냄새", "상판이 오일·햇빛에 약해 관리 필요"],
    searchQuery: "룰루레몬 더매트 5mm",
    buy: {
      label: "룰루레몬 공식몰",
      url: "https://www.lululemon.co.kr/ko-kr/p/%EB%8D%94-%EB%A7%A4%ED%8A%B8-5mm-*%EC%B2%9C%EC%97%B0%EA%B3%A0%EB%AC%B4-%EC%82%AC%EC%9A%A9/142152346.html",
    },
    color: "#b5485d",
  },
  {
    id: "lululemon-3mm",
    name: "룰루레몬 The Mat 3mm",
    brand: "lululemon",
    emoji: "🎒",
    tagline: "룰루 그립 그대로, 더 가볍게",
    material: "PU 상판 + 천연고무",
    thickness: "3mm",
    weight: "약 1.9kg",
    priceTier: 2,
    latex: true,
    attrs: { gripDry: 5, gripWet: 5, cushion: 2, stability: 5, light: 3, durability: 3, value: 3, lowSmell: 2, design: 5 },
    pros: ["얇아서 서기 자세가 안정적", "5mm보다 가벼움"],
    cons: ["무릎 대는 자세는 살짝 딱딱", "처음엔 고무 냄새"],
    searchQuery: "룰루레몬 더매트 3mm",
    buy: { label: "룰루레몬 공식몰", url: "https://www.lululemon.co.kr/ko-kr/c/yoga-mats" },
    color: "#d07a8a",
  },
  {
    id: "liforme",
    name: "리포미 요가매트",
    brand: "Liforme",
    emoji: "📐",
    tagline: "정렬 라인이 자세를 잡아주는 매트",
    material: "PU 상판 + 천연고무",
    thickness: "4.2mm",
    weight: "약 2.5kg",
    priceTier: 3,
    latex: true,
    attrs: { gripDry: 5, gripWet: 5, cushion: 3, stability: 5, light: 2, durability: 4, value: 1, lowSmell: 3, design: 5 },
    pros: ["매트 위 정렬 라인이 초보 자세 교정에 도움", "그립 최상급"],
    cons: ["가격이 제일 높은 편", "무게가 있어 매일 들고 다니긴 부담"],
    searchQuery: "리포미 요가매트",
    color: "#5b6b8c",
  },
  {
    id: "jade-harmony",
    name: "제이드 하모니 4.8mm",
    brand: "JadeYoga",
    emoji: "🌿",
    tagline: "천연고무 특유의 쫀쫀함",
    material: "천연고무 (오픈 셀)",
    thickness: "4.8mm",
    weight: "약 2.3kg",
    priceTier: 3,
    latex: true,
    attrs: { gripDry: 5, gripWet: 3, cushion: 4, stability: 4, light: 2, durability: 2, value: 2, lowSmell: 1, design: 4 },
    pros: ["마른 손 그립 최강", "푹신하면서 탄탄"],
    cons: ["고무 냄새가 꽤 오래감", "햇빛·오래 쓰면 부스러짐"],
    searchQuery: "제이드 하모니 요가매트",
    color: "#4f7a5a",
  },
  {
    id: "pu-mid",
    name: "PU 요가매트 (국내 가성비)",
    brand: "카테고리 추천",
    emoji: "✨",
    tagline: "룰루 느낌을 반값에",
    material: "PU 상판 + 고무",
    thickness: "4~5mm",
    weight: "약 2~2.5kg",
    priceTier: 2,
    latex: true,
    attrs: { gripDry: 4, gripWet: 4, cushion: 3, stability: 4, light: 2, durability: 3, value: 4, lowSmell: 3, design: 3 },
    pros: ["PU 그립을 합리적인 가격에", "선택지가 다양함"],
    cons: ["브랜드마다 품질 편차 큼", "후기 꼼꼼히 보고 고르기"],
    searchQuery: "PU 요가매트",
    color: "#a07c5b",
  },
  {
    id: "cork",
    name: "코르크 요가매트",
    brand: "카테고리 추천",
    emoji: "🪵",
    tagline: "젖을수록 더 잡히는 코르크",
    material: "코르크 상판 + TPE/고무",
    thickness: "4~6mm",
    weight: "약 1.5~2kg",
    priceTier: 2,
    latex: false,
    attrs: { gripDry: 3, gripWet: 4, cushion: 3, stability: 4, light: 3, durability: 3, value: 3, lowSmell: 4, design: 4 },
    pros: ["땀이 나면 오히려 그립이 좋아짐", "냄새 적고 감성 있는 디자인"],
    cons: ["완전 마른 손에선 살짝 미끄러울 수 있음", "하판 소재는 제품마다 확인"],
    searchQuery: "코르크 요가매트",
    color: "#b08455",
  },
  {
    id: "tpe",
    name: "TPE 요가매트 6mm",
    brand: "카테고리 추천",
    emoji: "🌱",
    tagline: "일단 시작하는 사람의 첫 매트",
    material: "TPE",
    thickness: "6mm",
    weight: "약 1kg",
    priceTier: 1,
    latex: false,
    attrs: { gripDry: 3, gripWet: 1, cushion: 4, stability: 2, light: 5, durability: 2, value: 5, lowSmell: 4, design: 3 },
    pros: ["가볍고 저렴", "냄새 거의 없음"],
    cons: ["땀나면 미끄러움", "1~2년 쓰면 눌리고 갈라짐"],
    searchQuery: "TPE 요가매트 6mm",
    color: "#6aa38a",
  },
  {
    id: "nbr",
    name: "NBR 두꺼운 매트 10mm+",
    brand: "카테고리 추천",
    emoji: "☁️",
    tagline: "홈트·필라테스 매트운동용 구름 매트",
    material: "NBR",
    thickness: "10~15mm",
    weight: "약 1~1.5kg",
    priceTier: 1,
    latex: false,
    attrs: { gripDry: 2, gripWet: 1, cushion: 5, stability: 1, light: 3, durability: 2, value: 5, lowSmell: 3, design: 2 },
    pros: ["무릎·허리 대는 운동이 편함", "아주 저렴"],
    cons: ["너무 푹신해서 서기·밸런스 자세는 흔들림", "요가 전용으론 아쉬움"],
    searchQuery: "NBR 요가매트 10mm",
    color: "#7d8fb3",
  },
  {
    id: "travel",
    name: "트래블 매트 1.5mm",
    brand: "카테고리 추천",
    emoji: "🧳",
    tagline: "요가원 매트 위에 까는 내 매트",
    material: "천연고무 등 (제품별 상이)",
    thickness: "1~2mm",
    weight: "약 1kg",
    priceTier: 2,
    latex: true,
    attrs: { gripDry: 4, gripWet: 3, cushion: 0, stability: 4, light: 5, durability: 3, value: 3, lowSmell: 2, design: 3 },
    pros: ["접어서 가방에 쏙", "요가원 공용 매트 위생 걱정 끝"],
    cons: ["단독으로 쓰기엔 쿠션 없음", "천연고무 제품이 많음"],
    searchQuery: "트래블 요가매트 접이식",
    color: "#c49a6c",
  },
];

export const MAT_BY_ID: Record<string, Mat> = Object.fromEntries(MATS.map((m) => [m.id, m]));

/**
 * 구매 링크. search.shopping.naver.com/search/all 은 봇 차단(418)·개편으로 깨지는 경우가 있어서
 * 항상 열리는 네이버 통합검색으로 보냄 (상단에 네이버플러스스토어 쇼핑 영역이 같이 뜸).
 */
export function buyLink(m: Mat): { label: string; url: string } {
  if (m.buy) return m.buy;
  return {
    label: "네이버",
    url: `https://search.naver.com/search.naver?where=nexearch&query=${encodeURIComponent(m.searchQuery)}`,
  };
}

export const PRICE_LABEL: Record<Mat["priceTier"], string> = {
  1: "₩ (~3만원)",
  2: "₩₩ (3~10만원)",
  3: "₩₩₩ (10만원+)",
};
