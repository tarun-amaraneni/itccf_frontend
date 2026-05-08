import { useState, useRef, useEffect, ChangeEvent } from "react";
import {
  User, Camera, FileSignature, ArrowLeft, ChevronDown,
  CalendarDays, ChevronLeft, ChevronRight, AlertCircle, RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════
   API map: Academic value → endpoint URL
═══════════════════════════════════════════════════════════ */
const BASE = "http://192.168.0.7:8000/api";

const ACADEMIC_API: Record<string, string> = {
  "SSC":             `${BASE}/vocational/`,
  "Intermediate":    `${BASE}/intermediate/`,
  "Polytechnic":      `${BASE}/polytechnic/`,   // add when ready
  "ITI":             `${BASE}/iti/`,
  "U.G (Degree)":   `${BASE}/degree/`,
  "P.G (Degree)":   `${BASE}/degree/`,
  "U.G(B.Tech/B.E)": `${BASE}/ug/`,
  "P.G(M.Tech/M.E)": `${BASE}/pg/`,
};

// These academics have NO specialization dropdown
const NO_SPEC = new Set(["Below SSC"]);

// These are not yet implemented — show a placeholder
const NOT_YET = new Set(["U.G (Degree)", "P.G (Degree)"]);

/* ═══════════════════════════════════════════════════════════
   Field
═══════════════════════════════════════════════════════════ */
interface FieldProps {
  label: string;
  field: string;
  value: string;
  onChange: (field: string, val: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}

const Field = ({
  label, field, value, onChange,
  type = "text", placeholder, className = ""
}: FieldProps) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder ?? label}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(field, e.target.value)}
      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800
        placeholder:text-slate-300 transition-all duration-150
        focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
    />
  </div>
);

/* ═══════════════════════════════════════════════════════════
   Dropdown (generic, static options)
═══════════════════════════════════════════════════════════ */
interface DropdownProps {
  label: string;
  field: string;
  value: string;
  onChange: (field: string, val: string) => void;
  options?: string[];
  className?: string;
}

const Dropdown = ({
  label, field, value, onChange, options = [], className = ""
}: DropdownProps) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(field, e.target.value)}
        className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8
          text-sm text-slate-800 cursor-pointer transition-all duration-150
          focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   SpecField — smart specialization dropdown
   • Hides itself when academic = "Below SSC" or empty
   • Shows placeholder when academic = U.G (Degree) / P.G (Degree)
   • Fetches from API for all other mapped academics
   • Caches results so switching back doesn't re-fetch
═══════════════════════════════════════════════════════════ */
interface SpecFieldProps {
  academic: string;
  value: string;
  onChange: (field: string, val: string) => void;
}

const SpecField = ({ academic, value, onChange }: SpecFieldProps) => {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const cache = useRef<Record<string, string[]>>({});

  const fetchOptions = async (ac: string) => {
    const url = ACADEMIC_API[ac];
    if (!url) return;

    // Return from cache if available
    if (cache.current[ac]) {
      setOptions(cache.current[ac]);
      return;
    }

    setLoading(true);
    setError(null);
    setOptions([]);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const specs: string[] = Array.isArray(data)
        ? [...new Set<string>(
            data.map((item: { specialization: string }) => item.specialization)
          )]
        : [];
      cache.current[ac] = specs;
      setOptions(specs);
    } catch {
      setError("Could not load options.");
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset on academic change
    setOptions([]);
    setError(null);
    onChange("specialization", "");

    if (academic && ACADEMIC_API[academic]) {
      fetchOptions(academic);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [academic]);

  // ── Don't render anything for Below SSC or empty ──
  if (!academic || NO_SPEC.has(academic)) return null;

  // ── Degree UG/PG not yet implemented ──
  if (NOT_YET.has(academic)) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">
          Specialization
        </label>
        <div className="h-10 rounded-lg border border-dashed border-slate-200 bg-slate-50
          flex items-center px-3">
          <span className="text-xs text-slate-300 font-semibold italic">
            Not applicable for {academic}
          </span>
        </div>
      </div>
    );
  }

  // ── No mapping (safety net) ──
  if (!ACADEMIC_API[academic]) return null;

  // ── Normal dropdown (loading / error / populated) ──
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">
        Specialization
      </label>

      <div className="relative">
        <select
          value={value}
          disabled={loading || !!error}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onChange("specialization", e.target.value)
          }
          className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8
            text-sm text-slate-800 cursor-pointer transition-all duration-150
            focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
            disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-50"
        >
          <option value="">
            {loading ? "Loading…" : error ? "Failed to load" : "Select…"}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>

        {loading ? (
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2
              w-3.5 h-3.5 animate-spin text-indigo-400"
            viewBox="0 0 24 24" fill="none"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2
            -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        )}
      </div>

      {/* Error row with retry */}
      {error && (
        <div className="flex items-center gap-2 mt-0.5">
          <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
          <span className="text-[10px] text-red-500 font-semibold">{error}</span>
          <button
            type="button"
            onClick={() => {
              delete cache.current[academic];
              fetchOptions(academic);
            }}
            className="ml-auto flex items-center gap-1 text-[10px] font-bold
              text-indigo-500 hover:text-indigo-700 transition-colors"
          >
            <RefreshCw className="w-2.5 h-2.5" /> Retry
          </button>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Divider
═══════════════════════════════════════════════════════════ */
const Divider = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 my-6">
    <div className="h-px flex-1 bg-slate-100" />
    <span className="text-[9px] font-black tracking-[0.22em] uppercase text-slate-300 px-1">
      {label}
    </span>
    <div className="h-px flex-1 bg-slate-100" />
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PhotoUpload
═══════════════════════════════════════════════════════════ */
const PhotoUpload = ({ label, tall = false }: { label: string; tall?: boolean }) => (
  <div className={`flex flex-col items-center justify-center gap-1.5 w-full rounded-xl
    border-2 border-dashed border-slate-200 bg-slate-50/80
    hover:border-indigo-300 hover:bg-indigo-50/40 transition-all duration-200 cursor-pointer group
    ${tall ? "h-24" : "h-28"}`}>
    <Camera className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
    <span className="text-[9px] font-extrabold tracking-[0.18em] uppercase
      text-slate-300 group-hover:text-indigo-400">
      {label}
    </span>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   DOB Picker
═══════════════════════════════════════════════════════════ */
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

interface DOBPickerProps {
  dob_d: string; dob_m: string; dob_y: string;
  onChange: (field: string, val: string) => void;
}

const DOBPicker = ({ dob_d, dob_m, dob_y, onChange }: DOBPickerProps) => {
  const [open, setOpen] = useState(false);
  const [calYear, setCalYear] = useState(() => {
    const y = parseInt(dob_y); return isNaN(y) ? new Date().getFullYear() - 20 : y;
  });
  const [calMonth, setCalMonth] = useState(() => {
    const m = parseInt(dob_m); return isNaN(m) ? 0 : m - 1;
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const calcAge = () => {
    const d = parseInt(dob_d), m = parseInt(dob_m), y = parseInt(dob_y);
    if (!d || !m || !y || y < 1900 || y > new Date().getFullYear()) return null;
    const today = new Date();
    let age = today.getFullYear() - y;
    if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) age--;
    return age >= 0 ? age : null;
  };

  const age = calcAge();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay    = new Date(calYear, calMonth, 1).getDay();

  const selectDay = (day: number) => {
    onChange("dob_d", String(day).padStart(2, "0"));
    onChange("dob_m", String(calMonth + 1).padStart(2, "0"));
    onChange("dob_y", String(calYear));
    setOpen(false);
  };

  const inputCls =
    "h-10 rounded-lg border border-slate-200 bg-white text-center text-sm text-slate-800 " +
    "placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 " +
    "focus:ring-2 focus:ring-indigo-100 transition-all";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">
          Date of Birth
        </label>
        {age !== null && (
          <span className="text-[10px] font-extrabold tracking-wide text-teal-600
            bg-teal-50 px-2 py-0.5 rounded-full">
            {age} yrs
          </span>
        )}
      </div>

      <div className="relative" ref={ref}>
        <div className="flex gap-1.5 items-center">
          <input
            placeholder="DD" value={dob_d} maxLength={2}
            onChange={e => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 2);
              onChange("dob_d", v);
            }}
            className={`${inputCls} w-14`}
          />
          <input
            placeholder="MM" value={dob_m} maxLength={2}
            onChange={e => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 2);
              onChange("dob_m", v);
              if (parseInt(v) >= 1 && parseInt(v) <= 12) setCalMonth(parseInt(v) - 1);
            }}
            className={`${inputCls} w-14`}
          />
          <input
            placeholder="YYYY" value={dob_y} maxLength={4}
            onChange={e => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 4);
              onChange("dob_y", v);
              if (v.length === 4) setCalYear(parseInt(v));
            }}
            className={`${inputCls} flex-1`}
          />
          <button
            type="button" onClick={() => setOpen(o => !o)}
            className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg
              border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 transition-all"
          >
            <CalendarDays className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {open && (
          <div className="absolute top-12 left-0 z-50 bg-white rounded-2xl
            border border-slate-200 shadow-xl p-4 w-72">
            {/* Month / Year nav */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => {
                  if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
                  else setCalMonth(m => m - 1);
                }}
                className="w-7 h-7 flex items-center justify-center rounded-lg
                  hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-slate-500" />
              </button>

              <div className="flex items-center gap-2">
                <select
                  value={calMonth}
                  onChange={e => setCalMonth(parseInt(e.target.value))}
                  className="text-xs font-bold text-slate-700 bg-transparent
                    border-none outline-none cursor-pointer"
                >
                  {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
                <input
                  type="number" value={calYear}
                  onChange={e => setCalYear(parseInt(e.target.value) || calYear)}
                  className="text-xs font-bold text-slate-700 w-14 text-center
                    border border-slate-200 rounded-md px-1 py-0.5
                    focus:outline-none focus:border-violet-400"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
                  else setCalMonth(m => m + 1);
                }}
                className="w-7 h-7 flex items-center justify-center rounded-lg
                  hover:bg-slate-100 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                <div key={d}
                  className="text-center text-[9px] font-black tracking-wider
                    text-slate-300 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-y-0.5">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const selected =
                  parseInt(dob_d) === day &&
                  parseInt(dob_m) === calMonth + 1 &&
                  parseInt(dob_y) === calYear;
                return (
                  <button
                    key={day} type="button" onClick={() => selectDay(day)}
                    className={`h-8 w-full rounded-lg text-xs font-semibold transition-all
                      ${selected
                        ? "bg-indigo-600 text-white"
                        : "hover:bg-indigo-50 text-slate-700"}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Aadhar Field
═══════════════════════════════════════════════════════════ */
interface AadharFieldProps {
  value: string;
  onChange: (field: string, val: string) => void;
}

const AadharField = ({ value, onChange }: AadharFieldProps) => {
  const format = (raw: string) =>
    raw.replace(/\D/g, "").slice(0, 12).replace(/(\d{4})(?=\d)/g, "$1-");

  const digits   = value.replace(/-/g, "");
  const complete = digits.length === 12;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">
          Aadhar No.
        </label>
        <span className={`text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded-full transition-all
          ${complete ? "text-emerald-600 bg-emerald-50" : "text-slate-300 bg-slate-50"}`}>
          {digits.length}/12
        </span>
      </div>
      <input
        value={value}
        onChange={e => onChange("aadharNo", format(e.target.value))}
        placeholder="XXXX-XXXX-XXXX"
        maxLength={14}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm
          text-slate-800 placeholder:text-slate-300 font-mono tracking-widest
          transition-all duration-150
          focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Experience Field
═══════════════════════════════════════════════════════════ */
interface ExperienceFieldProps {
  years: string; months: string;
  onChange: (field: string, val: string) => void;
}

const ExperienceField = ({ years, months, onChange }: ExperienceFieldProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">
      Experience
    </label>
    <div className="flex gap-2">
      <div className="relative flex-1">
        <select
          value={years}
          onChange={e => onChange("experienceYears", e.target.value)}
          className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white
            pl-3 pr-7 text-sm text-slate-800 cursor-pointer transition-all
            focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Yrs</option>
          {["Fresher","1","2","3","4","5","6","7","8","9","10","10+"].map(o => (
            <option key={o} value={o}>
              {o === "Fresher" ? "Fresher" : `${o} yr${o === "1" ? "" : "s"}`}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2
          -translate-y-1/2 w-3 h-3 text-slate-400" />
      </div>

      <div className="relative flex-1">
        <select
          value={months}
          onChange={e => onChange("experienceMonths", e.target.value)}
          className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white
            pl-3 pr-7 text-sm text-slate-800 cursor-pointer transition-all
            focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Mos</option>
          {["0","1","2","3","4","5","6","7","8","9","10","11"].map(o => (
            <option key={o} value={o}>{o} mo{o === "1" ? "" : "s"}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2
          -translate-y-1/2 w-3 h-3 text-slate-400" />
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   Form initial state
═══════════════════════════════════════════════════════════ */
const INIT = {
  hrName: "", idNo: "", password: "", loginsCount: "",
  percentageObtained: "", successRate: "",
  surname: "", name: "", dob_d: "", dob_m: "", dob_y: "",
  regnNo: "", date: "", fatherMotherName: "",
  academic: "", specialization: "", extraCurricular: "",
  additionalQualification: "", experienceYears: "", experienceMonths: "",
  drivingLicence: "",
  aadharNo: "", mobilePersonal: "", mobileReference: "",
  hNo: "", streetColony: "", area: "", district: "",
  houseOwnRent: "", email: "", reservation: "",
  height: "", weight: "", eyeSite: "", bloodGroup: "", anyJob: "",
  coreSpecialization: "", technical: "", nonTechnical: "",
  generalCategory: "", anyJobNature: "",
};
type F = typeof INIT;

/* ═══════════════════════════════════════════════════════════
   Card
═══════════════════════════════════════════════════════════ */
const Card = ({
  children, className = ""
}: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({
  dot, title, badge
}: { dot: string; title: string; badge?: string }) => (
  <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
    <span className={`w-2.5 h-2.5 rounded-full ${dot} shrink-0`} />
    <span className="text-[11px] font-black tracking-[0.18em] uppercase text-slate-700">
      {title}
    </span>
    {badge && (
      <span className="ml-auto text-[9px] font-extrabold tracking-widest uppercase
        text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════ */
const StudentProfile = () => {
  const [form, setForm] = useState<F>(INIT);

  const set = (field: string, val: string) =>
    setForm(p => ({ ...p, [field]: val }));

  const v = (k: keyof F) => form[k];

  // Whether to show the specialization column
  const showSpec = !!form.academic && !NO_SPEC.has(form.academic);

  return (
    <div className="min-h-screen bg-[#EEF0F8]" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur
        border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-semibold
              text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center
              justify-center shadow-md shadow-indigo-200">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-black tracking-tight text-slate-800">
              Candidate Enrollment
            </span>
          </div>

          <span className="text-[9px] font-extrabold tracking-[0.18em] text-indigo-500
            uppercase bg-indigo-50 px-2.5 py-1 rounded-full">
            Form
          </span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-5 pb-24">

        <p className="text-xs font-semibold text-slate-400 px-1 tracking-wide">
          Fill in all details below and click{" "}
          <span className="text-indigo-600 font-bold">Submit Enrollment</span> when done.
        </p>

        {/* ══════════════ HR Information ══════════════ */}
        <Card>
          <CardHeader dot="bg-amber-400" title="HR Information" badge="Internal" />
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-4 space-y-4">
              <Field label="HR Name"             field="hrName"             value={v("hrName")}             onChange={set} />
              <Field label="ID No."              field="idNo"               value={v("idNo")}               onChange={set} />
              <Field label="Password"            field="password"           value={v("password")}           onChange={set} type="password" />
            </div>
            <div className="md:col-span-4 space-y-4">
              <Field label="No. of Logins Done"  field="loginsCount"        value={v("loginsCount")}        onChange={set} />
              <Field label="Percentage Obtained" field="percentageObtained" value={v("percentageObtained")} onChange={set} />
              <Field label="Success Rate"        field="successRate"        value={v("successRate")}        onChange={set} />
            </div>
            <div className="md:col-span-4 flex flex-col items-center gap-2 pt-5">
              <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">
                HR Photo
              </span>
              <div className="w-28"><PhotoUpload label="Upload" /></div>
            </div>
          </div>
        </Card>

        {/* ══════════════ Candidate Details ══════════════ */}
        <Card>
          <CardHeader dot="bg-indigo-500" title="Candidate Details" />
          <div className="p-6">

            {/* Row 1 — Name + Photo */}
            <div className="flex gap-4 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Surname"              field="surname"          value={v("surname")}          onChange={set} />
                <Field label="First Name"           field="name"             value={v("name")}             onChange={set} />
                <Field label="Father / Mother Name" field="fatherMotherName" value={v("fatherMotherName")} onChange={set} />
              </div>
              <div className="shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
                <span className="text-[10px] font-extrabold tracking-[0.15em]
                  uppercase text-slate-400">Photo</span>
                <div className="w-[72px]"><PhotoUpload label="Upload" /></div>
              </div>
            </div>

            {/* Row 2 — DOB + Regn No + Date */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <DOBPicker dob_d={v("dob_d")} dob_m={v("dob_m")} dob_y={v("dob_y")} onChange={set} />
              <Field label="Regn. No." field="regnNo" value={v("regnNo")} onChange={set} />
              <Field label="Date"      field="date"   value={v("date")}   onChange={set} />
            </div>

            {/* ── Qualification ── */}
            <Divider label="Qualification" />

            <div className={`grid grid-cols-1 gap-4
              ${showSpec ? "md:grid-cols-3" : "md:grid-cols-2"}`}>

              {/* Academic — resets specialization on change */}
              <Dropdown
                label="Academic"
                field="academic"
                value={v("academic")}
                onChange={(field, val) => {
                  set(field, val);
                  set("specialization", "");
                }}
                options={[
                  "Below SSC","SSC","Intermediate","Polytechnic","ITI",
                  "U.G (Degree)","P.G (Degree)","U.G(B.Tech/B.E)","P.G(M.Tech/M.E)"
                ]}
              />

              {/* SpecField renders itself or null based on academic */}
              <SpecField
                academic={v("academic")}
                value={v("specialization")}
                onChange={set}
              />

              <Dropdown
                label="Extra Curricular"
                field="extraCurricular"
                value={v("extraCurricular")}
                onChange={set}
                options={["Sports","Music","Dance","Drama","NCC","NSS","None"]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Dropdown
                label="Additional Qualification"
                field="additionalQualification"
                value={v("additionalQualification")}
                onChange={set}
                options={["Tally","AutoCAD","MS Office","Photoshop","Programming","None"]}
              />
              <ExperienceField
                years={v("experienceYears")}
                months={v("experienceMonths")}
                onChange={set}
              />
              <Dropdown
                label="Driving Licence"
                field="drivingLicence"
                value={v("drivingLicence")}
                onChange={set}
                options={["2 Wheeler","4 Wheeler","Both","None"]}
              />
            </div>

            {/* ── Contact & Identity ── */}
            <Divider label="Contact & Identity" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AadharField value={v("aadharNo")} onChange={set} />
              <Field label="Mobile (Personal)"  field="mobilePersonal"  value={v("mobilePersonal")}  onChange={set} />
              <Field label="Mobile (Reference)" field="mobileReference" value={v("mobileReference")} onChange={set} />
            </div>

            {/* ── Address ── */}
            <Divider label="Address" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Field    label="H. No."          field="hNo"          value={v("hNo")}          onChange={set} />
              <Field    label="Street / Colony"  field="streetColony" value={v("streetColony")} onChange={set} />
              <Field    label="Area"             field="area"         value={v("area")}         onChange={set} />
              <Dropdown label="District"         field="district"     value={v("district")}     onChange={set}
                options={["Hyderabad","Rangareddy","Medchal","Sangareddy",
                          "Nalgonda","Warangal","Karimnagar","Other"]} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Dropdown label="House Own / Rent"    field="houseOwnRent" value={v("houseOwnRent")} onChange={set}
                options={["Own","Rent"]} />
              <Field    label="Email Address"        field="email"        value={v("email")}        onChange={set} type="email" />
              <Field    label="Reservation (if any)" field="reservation"  value={v("reservation")}  onChange={set} />
            </div>

            {/* ── Physical Information ── */}
            <Divider label="Physical Information" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Field    label="Height (cm)" field="height"     value={v("height")}     onChange={set} />
              <Field    label="Weight (kg)" field="weight"     value={v("weight")}     onChange={set} />
              <Field    label="Eye Sight"   field="eyeSite"    value={v("eyeSite")}    onChange={set} />
              <Dropdown label="Blood Group" field="bloodGroup" value={v("bloodGroup")} onChange={set}
                options={["A+","A-","B+","B-","AB+","AB-","O+","O-"]} />
              <Dropdown label="Any Job"     field="anyJob"     value={v("anyJob")}     onChange={set}
                options={["Yes","No"]} />
            </div>

            {/* ── Digital Signature ── */}
            <div className="mt-6 flex justify-end">
              <div className="flex flex-col gap-1.5 items-end w-52">
                <span className="text-[10px] font-extrabold tracking-[0.15em]
                  uppercase text-slate-400">Digital Signature</span>
                <div className="w-full">
                  <div className="flex items-center justify-center gap-2 h-14 rounded-xl
                    border-2 border-dashed border-slate-200 bg-slate-50
                    hover:border-teal-300 hover:bg-teal-50/40
                    transition-all cursor-pointer group">
                    <FileSignature className="w-4 h-4 text-slate-300
                      group-hover:text-teal-500 transition-colors" />
                    <span className="text-xs font-bold text-slate-300
                      group-hover:text-teal-500 tracking-wide">Sign here</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Nature of Job Interested ── */}
            <Divider label="Nature of Job Interested" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Dropdown label="Core Specialization" field="coreSpecialization" value={v("coreSpecialization")} onChange={set}
                options={["Mechanical","Electrical","Civil","IT","Electronics"]} />
              <Dropdown label="Technical"            field="technical"          value={v("technical")}          onChange={set}
                options={["Software","Hardware","Networking","Embedded","Other"]} />
              <Dropdown label="Non-Technical"        field="nonTechnical"       value={v("nonTechnical")}       onChange={set}
                options={["Sales","Marketing","HR","Admin","Finance"]} />
              <Dropdown label="General Category"     field="generalCategory"    value={v("generalCategory")}    onChange={set}
                options={["Skilled","Semi-Skilled","Unskilled"]} />
              <Dropdown label="Any Job Nature"       field="anyJobNature"       value={v("anyJobNature")}       onChange={set}
                options={["Full Time","Part Time","Contract","Internship"]} />
            </div>

          </div>
        </Card>

        {/* ── Submit ── */}
        <div className="flex flex-col items-center gap-2.5 pt-2">
          <button className="group relative px-16 py-3.5 rounded-xl bg-indigo-600 text-white
            text-sm font-extrabold tracking-wide shadow-lg shadow-indigo-300/50
            hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0
            transition-all duration-200 overflow-hidden">
            <span className="relative z-10">Submit Enrollment</span>
          </button>
          <p className="text-xs text-slate-400 tracking-wide">
            Ensure all fields are complete before submitting
          </p>
        </div>

      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
      `}</style>
    </div>
  );
};

export default StudentProfile;