/**
 * 가능한 모든 답변 조합을 돌려서 1등 매트 / 유형 분포를 출력.
 * 매트 점수나 가중치를 바꾼 뒤 `npm run dist`로 한쪽에 쏠리지 않는지 확인용.
 */
import { MATS } from "../src/data/mats";
import { QUESTIONS } from "../src/data/questions";
import { scoreMats } from "../src/lib/scoring";

const sizes = QUESTIONS.map((q) => q.options.length);
const total = sizes.reduce((a, b) => a * b, 1);

const bestCount: Record<string, number> = Object.fromEntries(MATS.map((m) => [m.id, 0]));
const personaCount: Record<string, number> = {};
let missingAlt = 0;

for (let n = 0; n < total; n++) {
  let x = n;
  const answers = sizes.map((s) => {
    const v = x % s;
    x = Math.floor(x / s);
    return v;
  });
  const r = scoreMats(answers);
  bestCount[r.best.mat.id]++;
  const p = `${r.persona.emoji} ${r.persona.name}`;
  personaCount[p] = (personaCount[p] ?? 0) + 1;
  if (!r.valuePick || !r.longPick) missingAlt++;
}

const pct = (v: number) => ((v / total) * 100).toFixed(1).padStart(5) + "%";
console.log(`총 조합: ${total}\n\n[1등 매트 분포]`);
for (const [id, c] of Object.entries(bestCount).sort((a, b) => b[1] - a[1]))
  console.log(`${pct(c)}  ${id}`);
console.log(`\n[유형 분포]`);
for (const [p, c] of Object.entries(personaCount).sort((a, b) => b[1] - a[1])) console.log(`${pct(c)}  ${p}`);
console.log(`\n대안 픽 누락: ${missingAlt}건`);
