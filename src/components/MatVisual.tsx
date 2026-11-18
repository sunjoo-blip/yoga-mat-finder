"use client";

import { useState } from "react";
import type { Mat } from "@/data/mats";

interface Props {
  mat: Mat;
  /** 박스 높이(px). 너비는 부모에 맞춰 늘어남 */
  height?: number;
  className?: string;
}

/**
 * 매트 이미지.
 * - mat.image 가 있으면 상품 사진 (판매처 이미지 URL 또는 public/mats/)
 * - 없거나 로드 실패하면 매트 색·두께·소재로 그린 롤 매트 일러스트
 */
export default function MatVisual({ mat, height = 140, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  if (mat.image && !failed) {
    return (
      <div className={`mat-visual photo ${className}`} style={{ height }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mat.image}
          alt={mat.name}
          loading="lazy"
          style={
            mat.imageFit === "cover"
              ? { objectFit: "cover", objectPosition: mat.imagePosition ?? "50% 50%", padding: 0 }
              : undefined
          }
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }
  return (
    <div className={`mat-visual ${className}`} style={{ height, ["--mat" as string]: mat.color }}>
      <RolledMat mat={mat} />
    </div>
  );
}

function RolledMat({ mat }: { mat: Mat }) {
  const mm = parseFloat(mat.thickness) || 4;
  const t = Math.min(14, Math.max(2.5, mm * 1.3)); // 화면상 두께
  const r = Math.min(34, 18 + mm * 1.6); // 말린 부분 반지름
  const floor = 100;
  const cx = 168;
  const cy = floor - r;
  const id = `m-${mat.id}`;
  const dark = `color-mix(in srgb, ${mat.color} 70%, black)`;
  const light = `color-mix(in srgb, ${mat.color} 75%, white)`;

  // 소재별 표면 패턴
  const pattern =
    mat.id === "cork" ? (
      <pattern id={`${id}-p`} width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="0.9" fill="rgba(60,35,10,0.35)" />
        <circle cx="5" cy="4.5" r="0.6" fill="rgba(60,35,10,0.25)" />
      </pattern>
    ) : mat.material.includes("TPE") || mat.material === "NBR" ? (
      <pattern id={`${id}-p`} width="7" height="7" patternUnits="userSpaceOnUse">
        <rect width="7" height="7" fill="transparent" />
        <path d="M0 3.5h7" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      </pattern>
    ) : (
      <pattern id={`${id}-p`} width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="transparent" />
      </pattern>
    );

  return (
    <svg viewBox="0 0 220 120" role="img" aria-label={`${mat.name} 일러스트`}>
      <defs>
        {pattern}
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="1" stopColor={mat.color} />
        </linearGradient>
        <radialGradient id={`${id}-r`} cx="0.35" cy="0.35" r="0.75">
          <stop offset="0" stopColor={light} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
      </defs>

      {/* 그림자 */}
      <ellipse cx="110" cy={floor + 6} rx="100" ry="5" fill="rgba(0,0,0,0.08)" />

      {/* 펼쳐진 부분 */}
      <rect x="14" y={floor - t} width={cx - 14} height={t} rx={Math.min(3, t / 2)} fill={`url(#${id}-g)`} />
      <rect x="14" y={floor - t} width={cx - 14} height={t} rx={Math.min(3, t / 2)} fill={`url(#${id}-p)`} />
      <rect x="14" y={floor - t} width={cx - 14} height="1.2" fill="rgba(255,255,255,0.35)" />

      {/* 말린 부분 */}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-r)`} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-p)`} />
      {[0.72, 0.46, 0.22].map((k) => (
        <circle key={k} cx={cx + (1 - k) * 2} cy={cy - (1 - k) * 1.5} r={r * k} fill="none" stroke={dark} strokeOpacity="0.45" strokeWidth={Math.max(1, t / 3)} />
      ))}

      {/* 천연고무 등 정렬 라인 있는 매트 표시 */}
      {mat.id === "liforme" && (
        <g stroke="rgba(255,255,255,0.6)" strokeWidth="0.8">
          <line x1="40" y1={floor - t / 2} x2="140" y2={floor - t / 2} />
        </g>
      )}
    </svg>
  );
}
