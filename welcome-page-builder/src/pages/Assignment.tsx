import { useState, useEffect } from "react";
import {
  ArrowLeft, ClipboardList, Clock, CheckCircle,
  ChevronDown, ChevronUp, Loader2, AlertCircle, RefreshCw
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════
   API base
═══════════════════════════════════════════════════════════ */
const BASE = "http://192.168.0.7:8000/api";

/* ═══════════════════════════════════════════════════════════
   Types
═══════════════════════════════════════════════════════════ */
interface Question {
  id: number;
  question: string;
  section?: string; // API may or may not return this
}

interface APIResponse {
  student_id: number;
  student_name: string;
  questions: Question[] | string[]; // handle both shapes
}

/* ═══════════════════════════════════════════════════════════
   Normalise whatever the API returns into { id, question, section }
   Supports:
     - Array of strings           → ["Q1 text", "Q2 text", ...]
     - Array of objects           → [{ id, question, section? }, ...]
     - Object with section keys   → { Academic: [...], Aptitude: [...] }
═══════════════════════════════════════════════════════════ */
interface NormQuestion { id: number; question: string; section: string; }

const normalise = (raw: APIResponse): NormQuestion[] => {
  const qs = raw.questions;

  // Case 1: plain string array
  if (Array.isArray(qs) && typeof qs[0] === "string") {
    return (qs as string[]).map((q, i) => ({
      id: i + 1,
      question: q,
      section: i < Math.ceil(qs.length / 2) ? "Academic" : "Aptitude",
    }));
  }

  // Case 2: object array
  if (Array.isArray(qs)) {
    return (qs as Question[]).map((q, i) => ({
      id: q.id ?? i + 1,
      question: q.question,
      section: q.section ?? (i < qs.length / 2 ? "Academic" : "Aptitude"),
    }));
  }

  // Case 3: object keyed by section  { Academic: [...], Aptitude: [...] }
  const obj = qs as unknown as Record<string, string[] | Question[]>;
  const result: NormQuestion[] = [];
  let counter = 1;
  Object.entries(obj).forEach(([section, items]) => {
    (items as (string | Question)[]).forEach(item => {
      result.push({
        id: counter++,
        question: typeof item === "string" ? item : item.question,
        section,
      });
    });
  });
  return result;
};

/* ═══════════════════════════════════════════════════════════
   Section style map
═══════════════════════════════════════════════════════════ */
const SECTION_STYLE: Record<string, { badge: string; header: string }> = {
  Academic: {
    badge:  "bg-indigo-50 text-indigo-600 border-indigo-200",
    header: "bg-indigo-600 hover:bg-indigo-700",
  },
  Aptitude: {
    badge:  "bg-amber-50 text-amber-600 border-amber-200",
    header: "bg-amber-500 hover:bg-amber-600",
  },
};

const getSectionStyle = (section: string) =>
  SECTION_STYLE[section] ?? {
    badge:  "bg-slate-50 text-slate-600 border-slate-200",
    header: "bg-slate-600 hover:bg-slate-700",
  };

/* ═══════════════════════════════════════════════════════════
   QuestionCard
═══════════════════════════════════════════════════════════ */
interface QuestionCardProps {
  q: NormQuestion;
  globalIdx: number;
  answer: string;
  onChange: (id: number, val: string) => void;
}

const QuestionCard = ({ q, globalIdx, answer, onChange }: QuestionCardProps) => {
  const filled = answer.trim().length > 0;
  const style  = getSectionStyle(q.section);

  return (
    <div className={`rounded-2xl border transition-all duration-200 bg-white overflow-hidden
      ${filled ? "border-indigo-200 shadow-sm shadow-indigo-100" : "border-slate-200"}`}>

      {/* Header */}
      <div className="flex items-start gap-4 px-5 pt-5 pb-3">
        {/* Number badge */}
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-black
          ${filled ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
          {String(globalIdx + 1).padStart(2, "0")}
        </div>

        <div className="flex-1 min-w-0">
          {/* Section tag */}
          <span className={`inline-block text-[9px] font-extrabold tracking-[0.18em] uppercase
            border rounded-full px-2.5 py-0.5 mb-2 ${style.badge}`}>
            {q.section}
          </span>
          {/* Question text */}
          <p className="text-sm font-semibold text-slate-700 leading-relaxed">{q.question}</p>
        </div>
      </div>

      {/* Answer textarea */}
      <div className="px-5 pb-5">
        <textarea
          rows={3}
          value={answer}
          onChange={e => onChange(q.id, e.target.value)}
          placeholder="Type your answer here…"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3
            text-sm text-slate-800 placeholder:text-slate-300 resize-none
            transition-all duration-150
            focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
            focus:bg-white"
        />
        <div className="flex justify-end mt-1">
          <span className="text-[10px] text-slate-300 font-semibold">
            {answer.trim().length} chars
          </span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ProgressBar
═══════════════════════════════════════════════════════════ */
const ProgressBar = ({ answered, total }: { answered: number; total: number }) => {
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-extrabold text-slate-400 shrink-0">
        {answered}/{total}
      </span>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   SectionBlock — collapsible group of questions
═══════════════════════════════════════════════════════════ */
interface SectionBlockProps {
  section: string;
  questions: NormQuestion[];
  allQuestions: NormQuestion[];
  answers: Record<number, string>;
  onChange: (id: number, val: string) => void;
}

const SectionBlock = ({ section, questions, allQuestions, answers, onChange }: SectionBlockProps) => {
  const [open, setOpen] = useState(true);
  const style = getSectionStyle(section);
  const sectionAnswered = questions.filter(q => (answers[q.id] || "").trim().length > 0).length;

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-5 py-3 rounded-xl
          text-white mb-3 transition-colors ${style.header}`}>
        <span className="text-[11px] font-black tracking-[0.18em] uppercase">
          {section}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold opacity-75">
            {sectionAnswered}/{questions.length} answered
          </span>
          {open
            ? <ChevronUp className="w-4 h-4 opacity-75" />
            : <ChevronDown className="w-4 h-4 opacity-75" />}
        </div>
      </button>

      {open && (
        <div className="space-y-4">
          {questions.map(q => (
            <QuestionCard
              key={q.id}
              q={q}
              globalIdx={allQuestions.findIndex(aq => aq.id === q.id)}
              answer={answers[q.id] || ""}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════ */
const Assignment = () => {
  const location  = useLocation();
  const state     = location.state as { studentId?: number; name?: string; regnNo?: string } | null;
  const studentId = state?.studentId;
  const name      = state?.name   || "Candidate";
  const regnNo    = state?.regnNo || "—";

  /* ── Fetch state ── */
  const [questions, setQuestions]   = useState<NormQuestion[]>([]);
  const [fetchStatus, setFetchStatus] = useState<"loading" | "success" | "error">("loading");
  const [fetchError, setFetchError]   = useState("");

  /* ── Answer + submit state ── */
  const [answers, setAnswers]     = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  /* ── Fetch questions ── */
  const fetchQuestions = async () => {
    if (!studentId) {
      setFetchStatus("error");
      setFetchError("No student ID found. Please go back and resubmit the enrollment form.");
      return;
    }

    setFetchStatus("loading");
    setFetchError("");

    try {
      const res = await fetch(`${BASE}/auth/students/${studentId}/generate_questions/`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data: APIResponse = await res.json();
      const normalised = normalise(data);
      if (normalised.length === 0) throw new Error("No questions returned from API.");
      setQuestions(normalised);
      setFetchStatus("success");
    } catch (err: unknown) {
      setFetchStatus("error");
      setFetchError(err instanceof Error ? err.message : "Failed to load questions.");
    }
  };

  useEffect(() => { fetchQuestions(); }, [studentId]);

  /* ── Derived ── */
  const sections  = [...new Set(questions.map(q => q.section))];
  const answered  = questions.filter(q => (answers[q.id] || "").trim().length > 0).length;
  const allDone   = questions.length > 0 && answered === questions.length;

  const setAnswer = (id: number, val: string) =>
    setAnswers(prev => ({ ...prev, [id]: val }));

  const handleSubmit = () => {
    if (!allDone) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ════════════════════════════════════════════════════════
     SUCCESS SCREEN
  ════════════════════════════════════════════════════════ */
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#EEF0F8] flex items-center justify-center px-4"
        style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200
            flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">
            Assignment Submitted!
          </h2>
          <p className="text-sm text-slate-400 font-semibold mb-1">
            All {questions.length} answers recorded for
          </p>
          <p className="text-base font-extrabold text-indigo-600 mb-6">{name}</p>
          <Link to="/"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600
              text-white text-sm font-extrabold tracking-wide shadow-lg shadow-indigo-200
              hover:bg-indigo-700 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');`}</style>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════
     MAIN RENDER
  ════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#EEF0F8]" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── Sticky Navbar ── */}
      <nav className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-sm font-semibold
            text-slate-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center
              justify-center shadow-md shadow-indigo-200">
              <ClipboardList className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-black tracking-tight text-slate-800">Assignment</span>
          </div>

          <span className="text-[9px] font-extrabold tracking-[0.18em] text-indigo-500
            uppercase bg-indigo-50 px-2.5 py-1 rounded-full">
            {fetchStatus === "success" ? `${questions.length} Qs` : "Loading…"}
          </span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-32 space-y-6">

        {/* ── Header card ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.18em] uppercase text-slate-400 mb-1">
                Candidate Assignment
              </p>
              <h1 className="text-lg font-black text-slate-800 tracking-tight">{name}</h1>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Regn. No: {regnNo}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold">No time limit</span>
            </div>
          </div>

          {/* Progress — only when loaded */}
          {fetchStatus === "success" && (
            <>
              <div className="mt-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">
                    Progress
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full
                    ${allDone ? "text-emerald-600 bg-emerald-50" : "text-indigo-500 bg-indigo-50"}`}>
                    {allDone ? "All answered ✓" : `${questions.length - answered} remaining`}
                  </span>
                </div>
                <ProgressBar answered={answered} total={questions.length} />
              </div>

              {/* Section legend */}
              {sections.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {sections.map(sec => {
                    const style = getSectionStyle(sec);
                    const count = questions.filter(q => q.section === sec).length;
                    return (
                      <div key={sec} className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-extrabold tracking-[0.15em] uppercase
                          border rounded-full px-2 py-0.5 ${style.badge}`}>
                          {sec}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">{count} questions</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── LOADING ── */}
        {fetchStatus === "loading" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12
            flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100
              flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-700">Generating your questions…</p>
              <p className="text-xs text-slate-400 mt-1">This may take a few seconds</p>
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {fetchStatus === "error" && (
          <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8
            flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100
              flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-600 mb-1">Failed to load questions</p>
              <p className="text-xs text-slate-400 mb-4 max-w-sm">{fetchError}</p>
              <button
                onClick={fetchQuestions}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl
                  bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          </div>
        )}

        {/* ── QUESTIONS — grouped by section ── */}
        {fetchStatus === "success" && sections.map(section => (
          <SectionBlock
            key={section}
            section={section}
            questions={questions.filter(q => q.section === section)}
            allQuestions={questions}
            answers={answers}
            onChange={setAnswer}
          />
        ))}

      </main>

      {/* ── Sticky Submit Footer — only when loaded ── */}
      {fetchStatus === "success" && (
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur
          border-t border-slate-200 shadow-lg px-4 py-4">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <div className="flex-1">
              <ProgressBar answered={answered} total={questions.length} />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!allDone}
              className="shrink-0 px-8 py-3 rounded-xl bg-indigo-600 text-white text-sm
                font-extrabold tracking-wide shadow-lg shadow-indigo-300/40
                hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0
                transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0">
              Submit Assignment
            </button>
          </div>
          {!allDone && (
            <p className="text-center text-[10px] text-slate-400 font-semibold mt-2">
              Answer all {questions.length - answered} remaining question{questions.length - answered !== 1 ? "s" : ""} to submit
            </p>
          )}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
      `}</style>
    </div>
  );
};

export default Assignment;