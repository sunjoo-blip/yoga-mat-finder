"use client";

import { useEffect, useMemo, useState } from "react";
import { QUESTIONS } from "@/data/questions";
import { decodeAnswers, encodeAnswers, scoreMats } from "@/lib/scoring";
import { track } from "@/lib/track";
import Result from "./Result";

type Stage = "intro" | "quiz" | "loading" | "result";

const LOADING_MS = 1400;
const MAX_NAME = 10;

/** 공백 정리 + 길이 제한 (URL로도 들어오니 여기서 한 번 거름) */
const cleanName = (v: string | null) => (v ?? "").replace(/\s+/g, " ").slice(0, MAX_NAME);

export default function Quiz() {
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [name, setName] = useState("");

  // 공유 링크(?a=01210010)로 들어오면 바로 결과
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const a = decodeAnswers(params.get("a"));
    setName(cleanName(params.get("n")));
    if (a) {
      setAnswers(a);
      setStage("result");
      track("result_view", { from: "share_link" });
    }
  }, []);

  const result = useMemo(
    () => (stage === "result" && answers.length === QUESTIONS.length ? scoreMats(answers) : null),
    [stage, answers],
  );

  const start = () => {
    setAnswers([]);
    setStep(0);
    setPicked(null);
    setStage("quiz");
    window.history.replaceState(null, "", window.location.pathname);
    track("quiz_start", { has_name: Boolean(name.trim()) });
  };

  const choose = (optIdx: number) => {
    if (picked !== null) return;
    setPicked(optIdx);
    const q = QUESTIONS[step];
    track("quiz_answer", { q: q.id, option: q.options[optIdx].id, step });

    setTimeout(() => {
      const next = [...answers.slice(0, step), optIdx];
      setAnswers(next);
      setPicked(null);
      if (step + 1 < QUESTIONS.length) {
        setStep(step + 1);
      } else {
        setStage("loading");
        const qs = new URLSearchParams({ a: encodeAnswers(next) });
        if (name.trim()) qs.set("n", name.trim());
        window.history.replaceState(null, "", `?${qs}`);
        setTimeout(() => {
          setStage("result");
          track("result_view", { from: "quiz" });
        }, LOADING_MS);
      }
    }, 220);
  };

  const back = () => {
    if (step === 0) setStage("intro");
    else setStep(step - 1);
  };

  if (stage === "intro") {
    return (
      <section className="intro fade-in">
        <div className="intro-mat" aria-hidden>
          🧘‍♀️
        </div>
        <p className="eyebrow">초보 요기니를 위한</p>
        <h1>
          내 첫 요가매트
          <br />
          찾기
        </h1>
        <p className="lead">
          땀손인지, 무릎이 예민한지, 가성비가 중요한지.
          <br />
          질문 {QUESTIONS.length}개면 매트 고민 끝.
        </p>
        <form
          className="name-form"
          onSubmit={(e) => {
            e.preventDefault();
            start();
          }}
        >
          <label htmlFor="name" className="name-label">
            이름이나 닉네임을 알려주세요
          </label>
          <input
            id="name"
            className="name-input"
            value={name}
            onChange={(e) => setName(cleanName(e.target.value))}
            placeholder="예: 도비"
            maxLength={MAX_NAME}
            autoComplete="nickname"
          />
          <button type="submit" className="btn primary big" disabled={!name.trim()}>
            {name.trim() ? `${name.trim()}님 매트 찾기 시작` : "시작하기"}
          </button>
        </form>
        <p className="meta">약 1분 · 회원가입 없음</p>
      </section>
    );
  }

  if (stage === "loading") {
    return (
      <section className="loading fade-in">
        <div className="spinner" aria-hidden />
        <p>{name.trim() ? `${name.trim()}님이랑 ` : ""}매트 12종 궁합 보는 중…</p>
      </section>
    );
  }

  if (stage === "result" && result) {
    return <Result result={result} answers={answers} name={name.trim()} onRetry={start} />;
  }

  const q = QUESTIONS[step];
  return (
    <section className="quiz">
      <div className="quiz-top">
        <button className="back" onClick={back} aria-label="이전">
          ←
        </button>
        <div className="progress">
          <div className="progress-bar" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
        </div>
        <span className="step">
          {step + 1}/{QUESTIONS.length}
        </span>
      </div>

      <div key={q.id} className="question slide-in">
        <h2>{q.title}</h2>
        {q.hint && <p className="hint">{q.hint}</p>}
        <div className="options">
          {q.options.map((o, i) => (
            <button
              key={o.id}
              className={`option${picked === i ? " picked" : ""}${answers[step] === i && picked === null ? " prev" : ""}`}
              onClick={() => choose(i)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
