# 내 첫 요가매트 찾기 🧘

초보 요기니의 매트 고민을 질문 8개로 끝내주는 추천 퀴즈. obud.dobby 릴스 연계용.

## 실행

```bash
npm install
npm run dev        # http://localhost:3000
npm run dist       # 모든 답변 조합(7,776개) 결과 분포 확인
npm run build
```

`.env.example` → `.env.local` 복사 후 `NEXT_PUBLIC_OBUD_URL`, `NEXT_PUBLIC_GA_ID` 설정.

## 구조

```
src/
  data/mats.ts        매트 12종 + 속성 점수(0~5), 가격 tier, 라텍스 여부
  data/questions.ts   질문 8개 + 옵션별 가중치
  lib/scoring.ts      점수 계산, 유형(persona), 대안 픽, URL 인코딩
  lib/track.ts        GA4 이벤트 + obud CTA UTM
  components/Quiz.tsx    인트로 → 질문 → 로딩 → 결과
  components/Result.tsx  공유 카드(이미지 저장), 상세, 대안 2개, obud CTA
scripts/distribution.ts  결과 쏠림 체크
```

## 추천 로직

- 매트 점수 = Σ (속성 − 3) × 가중치. 중앙값 기준이라, 사용자가 중요하게 본 속성이 약한 매트는 감점됨
- 기본 가중치: 마른 손 그립 / 안정감 / 내구성 각 +1 (매트 기본기)
- 예산 초과: tier 1단계당 −15
- 라텍스 알레르기: 천연고무 매트 하드 필터
- 결과: 1등 + 가성비 픽 + 오래가는 픽 (예산 초과 시 "나중에 업그레이드 픽")
- 공유 링크: `?a=00022020` (질문 순서대로 고른 옵션 index). **질문/옵션 순서를 바꾸면 기존 링크 결과가 바뀜**

## 트래킹 이벤트

`quiz_start`, `quiz_answer`(q, option, step), `result_view`(from), `save_image`, `share`, `shop_click`, `obud_cta_click`

## TODO

- [ ] 매트 무게/두께/가격 tier 공식 스펙으로 검수 (`mats.ts` 주석 참고)
- [ ] 실제 매트 사진 (지금은 이모지)
- [ ] 결과별 OG 이미지 (`next/og` + 한글 폰트)
- [ ] obud 랜딩 URL 확정
