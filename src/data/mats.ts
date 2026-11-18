/**
 * 매트 후보 데이터 — 전부 실제 판매 중인 제품 (2026.11 확인).
 *
 * attrs는 0~5 상대 점수 (초보자 관점 체감 기준). 브랜드 공식 스펙이 아니라
 * "추천 로직용 가중치"라서, 실제 써본 느낌에 맞게 자유롭게 조정하면 됨.
 * price/weight는 판매처 표기 기준이고 수시로 바뀌니 배포 전 한 번 더 확인할 것.
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
  /** 크기·무게 등 (판매처 표기) */
  weight: string;
  priceTier: 1 | 2 | 3;
  /** 표시용 가격 (판매처 표기 기준). 없으면 tier 라벨 표시 */
  price?: string;
  /** 천연고무(라텍스) 포함 여부 — 알레르기 하드 필터용 */
  latex: boolean;
  attrs: Record<Attr, number>;
  pros: string[];
  cons: string[];
  /** 네이버 검색어 (buy 없을 때 사용, 제휴 링크 아님) */
  searchQuery: string;
  /** 판매처 직접 링크. 있으면 네이버 검색 대신 이걸로 연결 */
  buy?: { label: string; url: string };
  /** 결과 카드 색 (사진 없을 때 일러스트 색으로도 사용) */
  color: string;
  /**
   * 매트 사진. 판매처 상품 대표 이미지 URL (2026.11.18 확인) 또는 public/mats/<id>.jpg.
   * 외부 이미지는 판매처 사정으로 바뀌거나 막힐 수 있음 → 로드 실패하면 자동으로 일러스트.
   */
  image?: string;
  /** 사진 여백이 많아 작게 보이면 "cover"로 꽉 채움 (기본 contain) */
  imageFit?: "contain" | "cover";
  /** cover일 때 보여줄 위치 (CSS object-position, 예: "50% 66%" = 아래쪽 매트 부분) */
  imagePosition?: string;
}

export const MATS: Mat[] = [
  /* ---------------- ~3만원 ---------------- */
  {
    id: "daiso-nbr",
    name: "다이소 NBR 요가매트 10mm",
    brand: "다이소 · 품번 1057546",
    emoji: "☁️",
    tagline: "5천원짜리 구름 매트, 홈트 입문용",
    material: "NBR",
    thickness: "10mm",
    weight: "185×61cm",
    priceTier: 1,
    price: "5,000원",
    latex: false,
    attrs: { gripDry: 2, gripWet: 1, cushion: 5, stability: 1, light: 3, durability: 1, value: 5, lowSmell: 2, design: 2 },
    pros: ["커피 한 잔 값", "두툼해서 무릎·허리 대는 동작이 편함"],
    cons: ["푹신해서 서기·밸런스 자세는 흔들림", "새 제품은 고무 냄새가 있다는 후기 많음"],
    searchQuery: "다이소 NBR 요가매트",
    buy: { label: "다이소몰", url: "https://www.daisomall.co.kr/pd/pdr/SCR_PDR_0001?pdNo=1057546" },
    color: "#6c9a6a",
    image: "https://cdn.daisomall.co.kr/file/PD/20250102/ePjoJs3kWBcAPXjo9Pn11057546_00_00ePjoJs3kWBcAPXjo9Pn1.jpg",
    imageFit: "cover",
    imagePosition: "50% 66%",
  },
  {
    id: "daiso-tpe",
    name: "다이소 TPE 요가매트 5mm",
    brand: "다이소 · 품번 1057545",
    emoji: "🌱",
    tagline: "오래 할지 모르겠다면 일단 이걸로",
    material: "TPE",
    thickness: "5mm",
    weight: "173×61cm",
    priceTier: 1,
    price: "5,000원",
    latex: false,
    attrs: { gripDry: 2, gripWet: 1, cushion: 3, stability: 3, light: 4, durability: 1, value: 5, lowSmell: 4, design: 3 },
    pros: ["가볍고 냄새 적음", "요가 자세용으론 NBR보다 안정적"],
    cons: ["땀나면 미끄러움 (핸드타월 필수)", "길이 173cm라 키 크면 짧을 수 있음"],
    searchQuery: "다이소 TPE 요가매트",
    buy: { label: "다이소몰", url: "https://www.daisomall.co.kr/pd/pdr/SCR_PDR_0001?pdNo=1057545" },
    color: "#8a8a5c",
    image: "https://cdn.daisomall.co.kr/file/PD/20250102/XKAfvIuKbRyuftFXME7h1057545_00_00XKAfvIuKbRyuftFXME7h.jpg",
    imageFit: "cover",
    imagePosition: "50% 66%",
  },
  {
    id: "balancys-tpe",
    name: "밸런시스 TPE 요가매트 6mm",
    brand: "밸런시스",
    emoji: "🧘",
    tagline: "요가원 공용 매트로 자주 보이는 그 매트",
    material: "TPE",
    thickness: "6mm",
    weight: "8mm PRO도 있음",
    priceTier: 1,
    price: "32,900원",
    latex: false,
    attrs: { gripDry: 3, gripWet: 2, cushion: 4, stability: 3, light: 3, durability: 2, value: 4, lowSmell: 4, design: 2 },
    pros: ["표면 패턴 덕에 자세 잡기 쉬움", "가볍고 냄새 거의 없음"],
    cons: ["땀 많으면 수건 필요", "고무 매트보단 쫀득함이 덜함"],
    searchQuery: "밸런시스 TPE 요가매트",
    buy: { label: "11번가", url: "https://www.11st.co.kr/products/1521267590" },
    color: "#8fa0b4",
    image: "https://cdn.011st.com/11dims/resize/720/11src/opt/2/6/7/5/9/0/1521267590/sjdFm/34394133965_B.webp",
  },

  /* ---------------- 3~10만원 ---------------- */
  {
    id: "ganesha-origin",
    name: "가네샤 요가매트 오리진 5mm",
    brand: "가네샤 요가프랍스",
    emoji: "✨",
    tagline: "땀손 입문자의 국민 매트, 룰루 느낌을 반값에",
    material: "PU 상판 + 천연고무",
    thickness: "5mm",
    weight: "컬러 14종",
    priceTier: 2,
    price: "약 5~7만원",
    latex: true,
    attrs: { gripDry: 4, gripWet: 4, cushion: 3, stability: 4, light: 2, durability: 3, value: 4, lowSmell: 3, design: 4 },
    pros: ["PU 코팅이라 땀나도 잘 안 미끄러움", "컬러가 다양하고 예쁨"],
    cons: ["고무라 무게가 좀 있음", "요가원 선생님 통해 싸게 사는 경우도 많음 (물어보기!)"],
    searchQuery: "가네샤 요가매트 오리진 5mm",
    buy: { label: "코오롱몰", url: "https://www.kolonmall.com/Brands/ganesha/Product/K1756361782741044NO14" },
    color: "#8c7aa8",
    image: "https://images.kolonmall.com/Prod_Img/10003391/2024/LM4/K1756361782741044NO14_LM4.jpg",
    imageFit: "cover",
  },
  {
    id: "ganesha-ultracomfort",
    name: "가네샤 요가매트 울트라컴포트 6mm",
    brand: "가네샤 요가프랍스",
    emoji: "🛋️",
    tagline: "땀손인데 무릎까지 예민하다면",
    material: "천연고무 + PU",
    thickness: "6mm",
    weight: "가네샤 라인 중 가장 두꺼움",
    priceTier: 2,
    price: "약 6.7~7.5만원",
    latex: true,
    attrs: { gripDry: 4, gripWet: 4, cushion: 5, stability: 3, light: 1, durability: 3, value: 3, lowSmell: 3, design: 3 },
    pros: ["6mm 쿠션 + PU 그립 조합", "무릎 대는 동작이 편함"],
    cons: ["무거워서 들고 다니긴 부담", "천연고무 포함"],
    searchQuery: "가네샤 요가매트 울트라컴포트 6mm",
    buy: { label: "코오롱몰", url: "https://www.kolonmall.com/Brands/ganesha/Product/K1756433905271027NO01" },
    color: "#6b7f99",
    image: "https://images.kolonmall.com/Prod_Img/10003391/2024/LM5/K1756433905271027NO01_LM5.jpg",
    imageFit: "cover",
  },
  {
    id: "manduka-eko-superlite",
    name: "만두카 eKO 슈퍼라이트 1.5mm",
    brand: "Manduka",
    emoji: "🧳",
    tagline: "요가원 매트 위에 까는 내 매트",
    material: "천연고무",
    thickness: "1.5mm",
    weight: "접어서 가방에 쏙",
    priceTier: 2,
    price: "약 6.7만원",
    latex: true,
    attrs: { gripDry: 4, gripWet: 3, cushion: 0, stability: 4, light: 5, durability: 3, value: 3, lowSmell: 2, design: 3 },
    pros: ["요가원 공용 매트 위생 걱정 끝", "여행·출장에도 챙기기 쉬움"],
    cons: ["단독으로 쓰기엔 쿠션 없음", "천연고무 냄새가 처음에 있음"],
    searchQuery: "만두카 에코 슈퍼라이트 1.5mm",
    buy: { label: "코오롱몰", url: "https://www.kolonmall.com/Product/W2AAX25017LGR" },
    color: "#3d4a66",
    image: "https://images.kolonmall.com/Prod_Img/JA/2025/LM1/W2AAX25017LGR_LM1.jpg",
  },

  /* ---------------- 10만원+ ---------------- */
  {
    id: "lululemon-5mm",
    name: "룰루레몬 더 매트 5mm",
    brand: "lululemon",
    emoji: "💦",
    tagline: "가네샤의 예쁜 상위버전, 땀손 요기니 1순위",
    material: "PU 상판 + 천연고무",
    thickness: "5mm",
    weight: "2.38kg",
    priceTier: 3,
    price: "125,000원",
    latex: true,
    attrs: { gripDry: 5, gripWet: 5, cushion: 4, stability: 4, light: 2, durability: 3, value: 2, lowSmell: 2, design: 5 },
    pros: ["땀나도 쫀득한 PU 그립", "물결무늬·컬러가 예뻐서 사진발 최고"],
    cons: ["처음엔 고무 냄새", "평생템까진 아님 (오래 쓰면 그립 감소)"],
    searchQuery: "룰루레몬 더매트 5mm",
    buy: {
      label: "룰루레몬 공식몰",
      url: "https://www.lululemon.co.kr/ko-kr/p/%EB%8D%94-%EB%A7%A4%ED%8A%B8-5mm-*%EC%B2%9C%EC%97%B0%EA%B3%A0%EB%AC%B4-%EC%82%AC%EC%9A%A9/142152346.html",
    },
    color: "#b5485d",
    image: "https://images.lululemon.com/is/image/lululemon/LU9CJ7S_0001_1?size=800,800",
  },
  {
    id: "lululemon-3mm",
    name: "룰루레몬 더 매트 3mm",
    brand: "lululemon",
    emoji: "🎒",
    tagline: "룰루 그립 그대로, 들고 다니기 좋게",
    material: "PU 상판 + 천연고무",
    thickness: "3mm",
    weight: "1.76kg",
    priceTier: 3,
    latex: true,
    attrs: { gripDry: 5, gripWet: 5, cushion: 2, stability: 5, light: 3, durability: 3, value: 2, lowSmell: 2, design: 5 },
    pros: ["얇아서 서기 자세가 안정적", "5mm보다 600g 가벼움"],
    cons: ["무릎 대는 자세는 살짝 딱딱", "처음엔 고무 냄새"],
    searchQuery: "룰루레몬 더매트 3mm",
    buy: { label: "룰루레몬 공식몰", url: "https://www.lululemon.co.kr/ko-kr/c/yoga-mats" },
    color: "#d07a8a",
    image: "https://images.lululemon.com/is/image/lululemon/LU9CJ1S_0001_1?size=800,800",
  },
  {
    id: "liforme",
    name: "리포미 요가매트",
    brand: "Liforme",
    emoji: "📐",
    tagline: "정렬 라인이 그려진 '비싸고 예쁜 가네샤'",
    material: "PU 상판 + 천연고무",
    thickness: "4.2mm",
    weight: "정렬 라인(AlignForMe) 프린트",
    priceTier: 3,
    latex: true,
    attrs: { gripDry: 5, gripWet: 5, cushion: 3, stability: 5, light: 2, durability: 4, value: 1, lowSmell: 3, design: 5 },
    pros: ["매트 위 정렬 라인이 초보 자세 교정에 도움", "그립 최상급"],
    cons: ["가격이 무지무지 비쌈", "무게가 있어 매일 들고 다니긴 부담"],
    searchQuery: "리포미 요가매트",
    color: "#5b6b8c",
  },
  {
    id: "manduka-grp",
    name: "만두카 GRP 어댑트 5mm",
    brand: "Manduka",
    emoji: "🔥",
    tagline: "핫요가·땀손을 위해 만든 만두카",
    material: "오픈셀 PU 상판",
    thickness: "5mm",
    weight: "2.7kg",
    priceTier: 3,
    latex: true,
    attrs: { gripDry: 4, gripWet: 5, cushion: 4, stability: 4, light: 1, durability: 4, value: 1, lowSmell: 3, design: 3 },
    pros: ["땀 흡수형 상판이라 수건 없이도 그립 유지", "쿠션도 넉넉"],
    cons: ["가격대 높음", "무거워서 홈요가에 더 적합"],
    searchQuery: "만두카 GRP 어댑트 요가매트",
    color: "#3c4a3e",
    image: "https://www.manduka.com/cdn/shop/files/185011030-GRP-ADAPT-2.0-5MM-71-MIDNIGHT_01_ed43598e-2c23-4625-9372-4aae9a9c840c.jpg?v=1790361877",
  },
  {
    id: "manduka-prolite",
    name: "만두카 PROlite 4.7mm",
    brand: "Manduka",
    emoji: "🤍",
    tagline: "PRO의 내구성, 들고 다닐 수 있는 무게",
    material: "PVC (라텍스 프리)",
    thickness: "4.7mm",
    weight: "PRO보다 얇고 가벼움",
    priceTier: 3,
    price: "약 12.9만원 (해외직배송)",
    latex: false,
    attrs: { gripDry: 4, gripWet: 2, cushion: 3, stability: 4, light: 3, durability: 5, value: 2, lowSmell: 5, design: 3 },
    pros: ["PRO 라인 내구성 그대로", "요가원 출퇴근 가능한 무게"],
    cons: ["새 매트는 미끄러워서 길들이기 필요", "땀 많으면 수건 필요"],
    searchQuery: "만두카 프로라이트 요가매트",
    buy: { label: "SSG (해외직배송)", url: "https://www.ssg.com/item/itemView.ssg?itemId=1000033296936" },
    color: "#8a8f98",
    image: "https://sitem.ssgcdn.com/36/69/29/item/1000033296936_i1_1200.jpg",
  },
  {
    id: "manduka-pro",
    name: "만두카 PRO 6mm",
    brand: "Manduka",
    emoji: "🖤",
    tagline: "요가계 에르메스, 진짜 오래 할 사람의 평생템",
    material: "PVC (밀폐 셀)",
    thickness: "6mm",
    weight: "평생 보증",
    priceTier: 3,
    price: "약 17만원 (해외직배송)",
    latex: false,
    attrs: { gripDry: 4, gripWet: 2, cushion: 4, stability: 5, light: 1, durability: 5, value: 1, lowSmell: 5, design: 3 },
    pros: ["쿠션·안정감·내구성 끝판왕", "땀이 스며들지 않아 위생적"],
    cons: ["새 매트는 미끄러워서 길들이기 필요", "무거워서 매일 들고 다니긴 힘듦"],
    searchQuery: "만두카 프로 요가매트 6mm",
    buy: { label: "SSG (해외직배송)", url: "https://www.ssg.com/item/itemView.ssg?itemId=1000033301448" },
    color: "#2f2f35",
    image: "https://sitem.ssgcdn.com/48/14/30/item/1000033301448_i1_1200.jpg",
  },
];

export const MAT_BY_ID: Record<string, Mat> = Object.fromEntries(MATS.map((m) => [m.id, m]));

/**
 * 구매 링크. search.shopping.naver.com/search/all 은 봇 차단(418)·개편으로 깨지는 경우가 있어서
 * 판매처 링크가 없으면 항상 열리는 네이버 통합검색으로 보냄.
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

export const priceText = (m: Mat) => m.price ?? PRICE_LABEL[m.priceTier];
