"use client";

import { useEffect, useMemo, useState } from "react";

type RecordMode = "free" | "mood" | "timer" | "fragment";
type SavedRecord = { id: number; mode: RecordMode; title: string; body: string; emotions: string[]; image?: string; createdAt: string };

const emotionWords = ["편안하다", "안도하다", "설레다", "행복하다", "고맙다", "외롭다", "허전하다", "답답하다", "불안하다", "지친다", "무기력하다", "복잡하다", "잘 모르겠다"];

export default function Home() {
  const [dark, setDark] = useState(false);
  const [composer, setComposer] = useState(false);
  const [mode, setMode] = useState<RecordMode | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [source, setSource] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [image, setImage] = useState<string>();
  const [saved, setSaved] = useState<SavedRecord[]>([]);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(180);
  const today = useMemo(() => new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "long" }).format(new Date()), []);

  useEffect(() => {
    try { setSaved(JSON.parse(localStorage.getItem("sai-records") || "[]")); } catch { setSaved([]); }
  }, []);

  useEffect(() => {
    if (mode !== "timer" || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [mode, seconds]);

  const openComposer = (nextMode: RecordMode | null = null) => { setMode(nextMode); setComposer(true); setError(""); };
  const closeComposer = () => { setComposer(false); setMode(null); setSeconds(180); };
  const resetDraft = () => { setTitle(""); setBody(""); setSource(""); setSelectedEmotions([]); setImage(undefined); setError(""); setSeconds(180); };
  const saveRecord = () => {
    if (!body.trim() && !image && selectedEmotions.length === 0) { setError("글, 사진, 감정 중 하나를 남겨주세요."); return; }
    const next: SavedRecord = { id: Date.now(), mode: mode || "free", title: title.trim(), body: body.trim(), emotions: selectedEmotions, image, createdAt: new Date().toISOString() };
    const records = [next, ...saved].slice(0, 20);
    setSaved(records); localStorage.setItem("sai-records", JSON.stringify(records)); resetDraft(); closeComposer();
  };
  const chooseImage = (file?: File) => { if (!file) return; const reader = new FileReader(); reader.onload = () => setImage(String(reader.result)); reader.readAsDataURL(file); };

  return (
    <main className={dark ? "app dark" : "app"}>
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><i /><i /></span><strong>사이앤사이</strong></div>
        <nav aria-label="주요 메뉴">
          <a className="active" href="#today"><span>○</span>오늘</a>
          <a href="#records"><span>□</span>기록</a>
          <a href="#rhythm"><span>∿</span>감정 리듬</a>
          <a href="#between"><span>···</span>나의 사이</a>
        </nav>
        <div className="sidebar-bottom">
          <button onClick={() => setDark((value) => !value)} aria-label="다크 모드 전환"><span>{dark ? "☀" : "☾"}</span>{dark ? "밝은 화면" : "어두운 화면"}</button>
          <button><span>⚙</span>설정</button>
        </div>
      </aside>

      <section className="content" id="today">
        <header className="topbar"><div className="mobile-brand">사이앤사이</div><div className="date">{today}</div><button className="avatar" aria-label="내 프로필">SA</button></header>
        <div className="home-grid">
          <section className="hero">
            <p className="eyebrow">오늘의 자리</p>
            <h1>지금 마음에<br />남아 있는 것이 있나요?</h1>
            <p className="hero-copy">길게 쓰지 않아도 괜찮아요.<br />오늘을 기억하게 할 흔적 하나면 충분해요.</p>
            <button className="primary" onClick={() => openComposer()}><span>+</span> 오늘을 남기기</button>
          </section>

          <section className="prompt-card">
            <div className="prompt-top"><span>오늘의 질문</span><button aria-label="다른 질문">↻</button></div>
            <blockquote>“요즘 나를 가장 오래<br />머물게 하는 생각은 무엇인가요?”</blockquote>
            <button className="text-button" onClick={() => { setTitle("오늘의 질문"); setBody("요즘 나를 가장 오래 머물게 하는 생각은 무엇인가요?\n\n"); openComposer("free"); }}>이 질문으로 기록하기 <span>→</span></button>
          </section>

          <section className="memory-card">
            <div className="section-heading"><div><span className="eyebrow">기록의 회귀</span><h2>그때의 나에게서</h2></div><span className="ago">3개월 전</span></div>
            <div className="memory-body"><div className="memory-date">5월 15일, 목요일</div><p>요즘은 마음이 복잡하다. 답을 내려고 할수록 더 어려워지는 기분.</p><div className="emotion-row"><span className="plum">복잡함</span><span className="blue">답답함</span></div></div>
            <button className="reflection">지금은 어떤가요? <span>→</span></button>
          </section>

          <section className="rhythm-card" id="rhythm">
            <div className="section-heading"><div><span className="eyebrow">최근 7일</span><h2>마음의 리듬</h2></div><button className="more">자세히 보기</button></div>
            <div className="rhythm-list">
              <div><span className="dot sage" /><strong>편안함</strong><i style={{ "--width": "74%" } as React.CSSProperties} /><b>4</b></div>
              <div><span className="dot blue" /><strong>지침</strong><i style={{ "--width": "48%" } as React.CSSProperties} /><b>3</b></div>
              <div><span className="dot plum" /><strong>복잡함</strong><i style={{ "--width": "34%" } as React.CSSProperties} /><b>2</b></div>
            </div>
            <p className="observation">이번 주에는 <b>편안함</b>이 가장 자주 머물렀어요. 산책을 다녀온 날에 자주 함께 기록되었어요.</p>
          </section>
          {saved.length > 0 && <section className="recent-records" id="records"><div className="section-heading"><div><span className="eyebrow">방금 남긴 흔적</span><h2>나의 최근 기록</h2></div><span className="ago">{saved.length}개</span></div><div className="saved-list">{saved.slice(0, 3).map((record) => <article key={record.id}>{record.image && <img src={record.image} alt="기록에 첨부한 사진" />}<div><time>{new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(record.createdAt))}</time><h3>{record.title || record.body || "오늘의 마음"}</h3>{record.body && <p>{record.body}</p>}<div className="emotion-row">{record.emotions.map((emotion) => <span key={emotion}>{emotion}</span>)}</div></div></article>)}</div></section>}
        </div>
      </section>

      {composer && <div className="modal-backdrop" onMouseDown={closeComposer}><section className={mode ? "composer editor" : "composer"} onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="오늘의 기록">
        <button className="close" onClick={closeComposer} aria-label="닫기">×</button>
        {!mode ? <><span className="eyebrow">오늘을 남기는 방법</span><h2>지금에 맞는 방식을<br />골라보세요.</h2><div className="record-options"><button onClick={() => setMode("free")}><span>✎</span><strong>자유롭게 쓰기</strong><small>문장, 단어, 사진 하나도 좋아요</small></button><button onClick={() => setMode("mood")}><span>◌</span><strong>오늘의 마음</strong><small>마음에 가까운 감정을 골라요</small></button><button onClick={() => setMode("timer")}><span>◷</span><strong>3분 쓰기</strong><small>정리하지 않고 그대로 꺼내요</small></button><button onClick={() => setMode("fragment")}><span>“</span><strong>마음에 남은 것</strong><small>문장과 음악, 장소를 남겨요</small></button></div><p>어떤 방식이든, 여기까지만 남겨도 괜찮아요.</p></> : <>
          <button className="back" onClick={() => setMode(null)}>← 방식 바꾸기</button><span className="eyebrow">{mode === "mood" ? "오늘의 마음" : mode === "timer" ? "3분 쓰기" : mode === "fragment" ? "마음에 남은 것" : "자유롭게 쓰기"}</span>
          {mode === "timer" && <div className={seconds === 0 ? "timer done" : "timer"}>{seconds === 0 ? "3분이 지났어요. 여기에서 마칠까요?" : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`}</div>}
          <input className="title-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder={mode === "fragment" ? "마음에 남은 것" : "제목 (선택)"} />
          {mode === "mood" && <div className="emotion-picker">{emotionWords.map((emotion) => <button key={emotion} className={selectedEmotions.includes(emotion) ? "selected" : ""} onClick={() => setSelectedEmotions((items) => items.includes(emotion) ? items.filter((item) => item !== emotion) : [...items, emotion])}>{emotion}</button>)}</div>}
          <textarea autoFocus value={body} onChange={(event) => setBody(event.target.value)} placeholder={mode === "timer" ? "문장을 만들지 않아도 괜찮아요. 지금 떠오르는 말을 그대로 적어보세요." : mode === "mood" ? "무엇 때문에 이런 마음이 들었나요? (선택)" : "오늘을 남겨보세요."} />
          {mode === "fragment" && <input className="source-input" value={source} onChange={(event) => setSource(event.target.value)} placeholder="출처 (선택)" />}
          <div className="image-row">{image ? <div className="image-preview"><img src={image} alt="첨부한 사진 미리보기" /><button onClick={() => setImage(undefined)}>사진 지우기</button></div> : <label>▧ 사진 한 장 남기기<input type="file" accept="image/*" onChange={(event) => chooseImage(event.target.files?.[0])} /></label>}</div>
          {error && <p className="form-error">{error}</p>}<div className="editor-actions"><button className="quiet" onClick={closeComposer}>취소</button><button className="primary" onClick={saveRecord}>이대로 남기기</button></div>
        </>}
      </section></div>}
    </main>
  );
}
