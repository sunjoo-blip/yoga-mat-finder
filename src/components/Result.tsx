"use client";

import { useRef, useState } from "react";
import { buyLink, priceText, type Mat } from "@/data/mats";
import { QUESTIONS } from "@/data/questions";
import { resolveOptions, type QuizResult, type ScoredMat } from "@/lib/scoring";
import { obudUrl, track } from "@/lib/track";
import MatVisual from "./MatVisual";
import obudLogo from "@/app/obud_logo_circle.png";

interface Props {
  result: QuizResult;
  answers: number[];
  /** 인트로에서 받은 이름. 공유 링크로 들어오면 비어 있을 수 있음 */
  name: string;
  onRetry: () => void;
}

export default function Result({ result, answers, name, onRetry }: Props) {
  const { persona, best, valuePick, longPick } = result;
  const cardRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<string | null>(null);

  const budgetIdx = QUESTIONS.findIndex((q) => q.id === "budget");
  const budgetTier = (QUESTIONS[budgetIdx]?.options[answers[budgetIdx]]?.budget ?? 3) as number;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const saveImage = async () => {
    if (!cardRef.current) return;
    track("save_image", { mat: best.mat.id });
    const fileName = `${name || "my"}-yoga-mat-${best.mat.id}.png`;
    try {
      const { toBlob } = await import("html-to-image");
      const blob = await toBlob(cardRef.current, { pixelRatio: 3, cacheBust: true });
      if (!blob) throw new Error("no blob");

      // iOS Safari는 <a download>를 무시한다. 파일 공유가 가능하면 공유 시트로 → "이미지 저장" 선택 가능.
      const file = new File([blob], fileName, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file] });
          return;
        } catch (err) {
          // 사용자가 공유를 취소한 경우엔 조용히 종료
          if (err instanceof DOMException && err.name === "AbortError") return;
          // 그 외에는 아래 다운로드 폴백으로 진행
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      // download 속성이 동작하는 브라우저(데스크톱/안드로이드)
      if ("download" in a && typeof a.download === "string") {
        a.click();
        showToast("이미지 저장 완료! 스토리에 올려보세요 📸");
      } else {
        // 최후 폴백: 새 탭으로 열어 길게 눌러 저장
        window.open(url, "_blank");
        showToast("이미지를 길게 눌러 저장해 주세요 📸");
      }
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {
      showToast("저장에 실패했어요. 스크린샷으로 부탁해요 🙏");
    }
  };

  const share = async () => {
    const url = window.location.href;
    const text = name
      ? `${name}님은 ${persona.emoji} ${persona.name}! 찰떡 요가매트는 ${best.mat.name}`
      : `나는 ${persona.emoji} ${persona.name}! 내 요가매트는 ${best.mat.name}`;
    track("share", { mat: best.mat.id });
    if (navigator.share) {
      try {
        await navigator.share({ title: "내 첫 요가매트 찾기", text, url });
        return;
      } catch {
        /* 취소 → 복사로 폴백하지 않음 */
        return;
      }
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
    showToast("링크 복사 완료!");
  };

  return (
    <section className="result fade-in">
      {/* ---- 저장/공유용 카드 ---- */}
      <div ref={cardRef} className="share-card" style={{ ["--mat" as string]: best.mat.color }}>
        <p className="share-eyebrow">{name ? `${name}님 요가매트 추천` : "나의 요가매트 추천"}</p>
        <p className="persona-emoji">{persona.emoji}</p>
        <h1 className="persona-name">{persona.name}</h1>
        <p className="persona-desc">{persona.desc}</p>

        <div className="share-mat">
          <p className="share-label">찰떡 매트</p>
          <p className="share-mat-name">
            {best.mat.emoji} {best.mat.name}
          </p>
          <p className="share-match">매칭률 {best.match}%</p>
        </div>
        <p className="share-footer">내 첫 요가매트 찾기 · @obud.dobby</p>
      </div>

      {/* ---- 상세 ---- */}
      <MatDetail sm={best} />

      <h3 className="section-title">이런 선택지도 있어요</h3>
      <div className="alts">
        {valuePick && <AltCard label="💸 가성비 픽" sm={valuePick} />}
        {longPick && (
          <AltCard label={longPick.mat.priceTier > budgetTier ? "💎 나중에 업그레이드 픽" : "🛡️ 오래가는 픽"} sm={longPick} />
        )}
      </div>

      <h3 className="section-title">알아두면 좋은 팁</h3>
      <ul className="tips">
        {getTips(best.mat, resolveOptions(answers).map((o) => o.id)).map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <a
        className="cta"
        href={obudUrl(best.mat.id)}
        target="_blank"
        rel="noopener"
        onClick={() => track("obud_cta_click", { mat: best.mat.id })}
      >
        <img className="cta-logo" src={obudLogo.src} alt="오붓" width={52} height={52} />
        <span className="cta-text">
          <span className="cta-sub">매트 골랐으면 이제 첫 수업 👉</span>
          <span className="cta-main">오붓에서 내 근처 요가원 찾기</span>
        </span>
      </a>

      <div className="actions">
        <button className="btn primary" onClick={saveImage}>
          결과 이미지 저장
        </button>
        <button className="btn" onClick={share}>
          공유하기
        </button>
        <button className="btn ghost" onClick={onRetry}>
          다시 하기
        </button>
      </div>

      <p className="disclaimer">
        추천은 일반적인 소재 특성을 바탕으로 한 참고용, 브랜드 제휴, 광고 없음
      </p>

      {toast && <div className="toast">{toast}</div>}
    </section>
  );
}

function MatDetail({ sm }: { sm: ScoredMat }) {
  const m = sm.mat;
  return (
    <article className="mat-detail" style={{ ["--mat" as string]: m.color }}>
      <MatVisual mat={m} height={170} className="hero" />
      <div className="mat-head">
        <span className="mat-emoji">{m.emoji}</span>
        <div>
          <p className="mat-brand">{m.brand}</p>
          <h2 className="mat-name">{m.name}</h2>
          <p className="mat-tagline">{m.tagline}</p>
        </div>
      </div>

      {sm.reasons.length > 0 && (
        <ul className="reasons">
          {sm.reasons.map((r) => (
            <li key={r}>✔ {r}</li>
          ))}
        </ul>
      )}

      <div className="chips">
        <span>{m.material}</span>
        <span>{m.thickness}</span>
        <span>{m.weight}</span>
        <span>{priceText(m)}</span>
        {m.latex && <span className="warn">천연고무 포함</span>}
      </div>

      <div className="proscons">
        <div>
          <p className="pc-title">좋은 점</p>
          {m.pros.map((p) => (
            <p key={p}>👍 {p}</p>
          ))}
        </div>
        <div>
          <p className="pc-title">알아둘 점</p>
          {m.cons.map((c) => (
            <p key={c}>⚠️ {c}</p>
          ))}
        </div>
      </div>

      <a
        className="shop-link"
        href={buyLink(m).url}
        target="_blank"
        rel="noopener"
        onClick={() => track("shop_click", { mat: m.id, slot: "best", store: buyLink(m).label })}
      >
        {buyLink(m).label}에서 가격 보기 →
      </a>
    </article>
  );
}

function AltCard({ label, sm }: { label: string; sm: ScoredMat }) {
  const m = sm.mat;
  return (
    <a
      className="alt"
      href={buyLink(m).url}
      target="_blank"
      rel="noopener"
      style={{ ["--mat" as string]: m.color }}
      onClick={() => track("shop_click", { mat: m.id, slot: label, store: buyLink(m).label })}
    >
      <MatVisual mat={m} height={80} className="small" />
      <p className="alt-label">{label}</p>
      <p className="alt-name">
        {m.emoji} {m.name}
      </p>
      <p className="alt-tagline">{m.tagline}</p>
      <p className="alt-meta">
        {priceText(m)} · 매칭 {sm.match}%
      </p>
    </a>
  );
}

function getTips(m: Mat, optionIds: string[]): string[] {
  const tips: string[] = [];
  if (optionIds.includes("sweat-high") || m.attrs.gripWet <= 2)
    tips.push("🧺 요가 핸드타월 하나 챙기기. 다운독 미끄럼이 확 줄어요");
  tips.push("🚫 매트·타월 빨 때 섬유유연제 금지. 오히려 미끄러워져요");
  if (m.latex) tips.push("🌬️ 새 매트는 하루 이틀 펼쳐두고 고무 냄새 빼기");
  if (m.id.startsWith("manduka-pro")) tips.push("🧂 만두카 PRO는 처음에 미끄러워요. 굵은 소금으로 문질러 길들이는 사람도 많아요");
  tips.push("🧽 땀 흘린 날은 닦고 그늘에서 말리기");
  return tips;
}
