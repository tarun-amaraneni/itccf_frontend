import { useState, useRef, useEffect, ChangeEvent } from "react";
import {
  User, Camera, FileSignature, ArrowLeft, ChevronDown,
  CalendarDays, ChevronLeft, ChevronRight, AlertCircle, RefreshCw,
  CheckCircle, Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════
   API map
═══════════════════════════════════════════════════════════ */
const BASE = "http://192.168.0.7:8000/api";

const ACADEMIC_API: Record<string, string> = {
  "SSC":              `${BASE}/vocational/`,
  "Intermediate":     `${BASE}/intermediate/`,
  "Polytechnic":      `${BASE}/polytechnic/`,
  "ITI":              `${BASE}/iti/`,
  "U.G (Degree)":    `${BASE}/degree/`,
  "P.G (Degree)":    `${BASE}/degree/`,
  "U.G(B.Tech/B.E)": `${BASE}/ug/`,
  "P.G(M.Tech/M.E)": `${BASE}/pg/`,
};

const NO_SPEC = new Set(["Below SSC"]);
const NOT_YET = new Set<string>([]);

/* ═══════════════════════════════════════════════════════════
   Nature-of-Job rows config
═══════════════════════════════════════════════════════════ */
const JOB_ROWS = [
  { field: "coreSpec",   label: "Core Specialization", opt1: "Interest Field 1", opt2: "Interest Field 2" },
  { field: "technical",  label: "Technical",           opt1: "Interest Field 1", opt2: "Interest Field 2" },
  { field: "nonTech",    label: "Non-Technical",       opt1: "Interest Field 1", opt2: "Interest Field 2" },
  { field: "generalCat", label: "General Category",    opt1: "Interest Field 1", opt2: "Interest Field 2" },
  { field: "jobNature",  label: "Any Job Nature",      opt1: "Interest Field 1", opt2: "Interest Field 2" },
];

/* ═══════════════════════════════════════════════════════════
   Field
═══════════════════════════════════════════════════════════ */
interface FieldProps {
  label: string; field: string; value: string;
  onChange: (field: string, val: string) => void;
  type?: string; placeholder?: string; className?: string;
}
const Field = ({ label, field, value, onChange, type = "text", placeholder, className = "" }: FieldProps) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">{label}</label>
    <input
      type={type} placeholder={placeholder ?? label} value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(field, e.target.value)}
      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800
        placeholder:text-slate-300 transition-all duration-150
        focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
    />
  </div>
);

/* ═══════════════════════════════════════════════════════════
   Dropdown
═══════════════════════════════════════════════════════════ */
interface DropdownProps {
  label: string; field: string; value: string;
  onChange: (field: string, val: string) => void;
  options?: string[]; className?: string;
}
const Dropdown = ({ label, field, value, onChange, options = [], className = "" }: DropdownProps) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">{label}</label>
    <div className="relative">
      <select value={value} onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(field, e.target.value)}
        className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8
          text-sm text-slate-800 cursor-pointer transition-all duration-150
          focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   SpecField
═══════════════════════════════════════════════════════════ */
interface SpecFieldProps { academic: string; value: string; onChange: (f: string, v: string) => void; }
const SpecField = ({ academic, value, onChange }: SpecFieldProps) => {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const cache = useRef<Record<string, string[]>>({});

  const fetchOptions = async (ac: string) => {
    const url = ACADEMIC_API[ac];
    if (!url) return;
    if (cache.current[ac]) { setOptions(cache.current[ac]); return; }
    setLoading(true); setError(null); setOptions([]);
    try {
      const res  = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const specs: string[] = Array.isArray(data)
        ? [...new Set<string>(data.map((item: { specialization: string }) => item.specialization))]
        : [];
      cache.current[ac] = specs;
      setOptions(specs);
    } catch { setError("Could not load options."); setOptions([]); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    setOptions([]); setError(null); onChange("specialization", "");
    if (academic && ACADEMIC_API[academic]) fetchOptions(academic);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [academic]);

  if (!academic || NO_SPEC.has(academic)) return null;
  if (NOT_YET.has(academic)) return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">Specialization</label>
      <div className="h-10 rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center px-3">
        <span className="text-xs text-slate-300 font-semibold italic">Not applicable for {academic}</span>
      </div>
    </div>
  );
  if (!ACADEMIC_API[academic]) return null;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">Specialization</label>
      <div className="relative">
        <select value={value} disabled={loading || !!error}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange("specialization", e.target.value)}
          className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8
            text-sm text-slate-800 cursor-pointer transition-all duration-150
            focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
            disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-50">
          <option value="">{loading ? "Loading…" : error ? "Failed to load" : "Select…"}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {loading
          ? <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-indigo-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          : <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />}
      </div>
      {error && (
        <div className="flex items-center gap-2 mt-0.5">
          <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
          <span className="text-[10px] text-red-500 font-semibold">{error}</span>
          <button type="button" onClick={() => { delete cache.current[academic]; fetchOptions(academic); }}
            className="ml-auto flex items-center gap-1 text-[10px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors">
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
    <span className="text-[9px] font-black tracking-[0.22em] uppercase text-slate-300 px-1">{label}</span>
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
    <span className="text-[9px] font-extrabold tracking-[0.18em] uppercase text-slate-300 group-hover:text-indigo-400">{label}</span>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   DOB Picker
═══════════════════════════════════════════════════════════ */
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
interface DOBPickerProps { dob_d: string; dob_m: string; dob_y: string; onChange: (f: string, v: string) => void; }
const DOBPicker = ({ dob_d, dob_m, dob_y, onChange }: DOBPickerProps) => {
  const [open, setOpen]         = useState(false);
  const [calYear, setCalYear]   = useState(() => { const y = parseInt(dob_y); return isNaN(y) ? new Date().getFullYear() - 20 : y; });
  const [calMonth, setCalMonth] = useState(() => { const m = parseInt(dob_m); return isNaN(m) ? 0 : m - 1; });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
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
  const selectDay   = (day: number) => {
    onChange("dob_d", String(day).padStart(2, "0"));
    onChange("dob_m", String(calMonth + 1).padStart(2, "0"));
    onChange("dob_y", String(calYear));
    setOpen(false);
  };
  const inputCls = "h-10 rounded-lg border border-slate-200 bg-white text-center text-sm text-slate-800 " +
    "placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">Date of Birth</label>
        {age !== null && <span className="text-[10px] font-extrabold tracking-wide text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{age} yrs</span>}
      </div>
      <div className="relative" ref={ref}>
        <div className="flex gap-1.5 items-center">
          <input placeholder="DD" value={dob_d} maxLength={2}
            onChange={e => onChange("dob_d", e.target.value.replace(/\D/g, "").slice(0, 2))}
            className={`${inputCls} w-14`} />
          <input placeholder="MM" value={dob_m} maxLength={2}
            onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 2); onChange("dob_m", v); if (parseInt(v) >= 1 && parseInt(v) <= 12) setCalMonth(parseInt(v) - 1); }}
            className={`${inputCls} w-14`} />
          <input placeholder="YYYY" value={dob_y} maxLength={4}
            onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); onChange("dob_y", v); if (v.length === 4) setCalYear(parseInt(v)); }}
            className={`${inputCls} flex-1`} />
          <button type="button" onClick={() => setOpen(o => !o)}
            className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 transition-all">
            <CalendarDays className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        {open && (
          <div className="absolute top-12 left-0 z-50 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 w-72">
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                <ChevronLeft className="w-4 h-4 text-slate-500" />
              </button>
              <div className="flex items-center gap-2">
                <select value={calMonth} onChange={e => setCalMonth(parseInt(e.target.value))}
                  className="text-xs font-bold text-slate-700 bg-transparent border-none outline-none cursor-pointer">
                  {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
                <input type="number" value={calYear} onChange={e => setCalYear(parseInt(e.target.value) || calYear)}
                  className="text-xs font-bold text-slate-700 w-14 text-center border border-slate-200 rounded-md px-1 py-0.5 focus:outline-none focus:border-violet-400" />
              </div>
              <button type="button" onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="grid grid-cols-7 mb-1">
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                <div key={d} className="text-center text-[9px] font-black tracking-wider text-slate-300 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-0.5">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const selected = parseInt(dob_d) === day && parseInt(dob_m) === calMonth + 1 && parseInt(dob_y) === calYear;
                return (
                  <button key={day} type="button" onClick={() => selectDay(day)}
                    className={`h-8 w-full rounded-lg text-xs font-semibold transition-all ${selected ? "bg-indigo-600 text-white" : "hover:bg-indigo-50 text-slate-700"}`}>
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
const AadharField = ({ value, onChange }: { value: string; onChange: (f: string, v: string) => void }) => {
  const format   = (raw: string) => raw.replace(/\D/g, "").slice(0, 12).replace(/(\d{4})(?=\d)/g, "$1-");
  const digits   = value.replace(/-/g, "");
  const complete = digits.length === 12;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">Aadhar No.</label>
        <span className={`text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded-full transition-all ${complete ? "text-emerald-600 bg-emerald-50" : "text-slate-300 bg-slate-50"}`}>{digits.length}/12</span>
      </div>
      <input value={value} onChange={e => onChange("aadharNo", format(e.target.value))}
        placeholder="XXXX-XXXX-XXXX" maxLength={14}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800
          placeholder:text-slate-300 font-mono tracking-widest transition-all duration-150
          focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Experience Field
═══════════════════════════════════════════════════════════ */
const ExperienceField = ({ years, months, onChange }: { years: string; months: string; onChange: (f: string, v: string) => void }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">Experience</label>
    <div className="flex gap-2">
      <div className="relative flex-1">
        <select value={years} onChange={e => onChange("experienceYears", e.target.value)}
          className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-7 text-sm text-slate-800 cursor-pointer transition-all focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
          <option value="">Yrs</option>
          {["Fresher","1","2","3","4","5","6","7","8","9","10","10+"].map(o => (
            <option key={o} value={o}>{o === "Fresher" ? "Fresher" : `${o} yr${o === "1" ? "" : "s"}`}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
      </div>
      <div className="relative flex-1">
        <select value={months} onChange={e => onChange("experienceMonths", e.target.value)}
          className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-7 text-sm text-slate-800 cursor-pointer transition-all focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
          <option value="">Mos</option>
          {["0","1","2","3","4","5","6","7","8","9","10","11"].map(o => (
            <option key={o} value={o}>{o} mo{o === "1" ? "" : "s"}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   JobRow
═══════════════════════════════════════════════════════════ */
interface JobRowProps {
  label: string; opt1: string; opt2: string;
  checked: boolean; val1: string; val2: string;
  onCheck: () => void; onVal1: (v: string) => void; onVal2: (v: string) => void;
}
const JobRow = ({ label, opt1, opt2, checked, val1, val2, onCheck, onVal1, onVal2 }: JobRowProps) => (
  <div className={`rounded-xl border transition-all duration-200 overflow-hidden ${checked ? "border-indigo-200 bg-indigo-50/40" : "border-slate-200 bg-white"}`}>
    <label className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none">
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-150
        ${checked ? "bg-indigo-600 border-indigo-600" : "border-slate-300 bg-white"}`} onClick={onCheck}>
        {checked && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-sm font-semibold text-slate-700" onClick={onCheck}>{label}</span>
    </label>
    {checked && (
      <div className="grid grid-cols-2 gap-3 px-4 pb-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-indigo-400">{opt1}</label>
          <input value={val1} onChange={e => onVal1(e.target.value)} placeholder={opt1}
            className="h-9 w-full rounded-lg border border-indigo-200 bg-white px-3 text-sm text-slate-800
              placeholder:text-slate-300 transition-all focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-indigo-400">{opt2}</label>
          <input value={val2} onChange={e => onVal2(e.target.value)} placeholder={opt2}
            className="h-9 w-full rounded-lg border border-indigo-200 bg-white px-3 text-sm text-slate-800
              placeholder:text-slate-300 transition-all focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </div>
      </div>
    )}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   Card
═══════════════════════════════════════════════════════════ */
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>{children}</div>
);
const CardHeader = ({ dot, title, badge }: { dot: string; title: string; badge?: string }) => (
  <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
    <span className={`w-2.5 h-2.5 rounded-full ${dot} shrink-0`} />
    <span className="text-[11px] font-black tracking-[0.18em] uppercase text-slate-700">{title}</span>
    {badge && <span className="ml-auto text-[9px] font-extrabold tracking-widest uppercase text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">{badge}</span>}
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
  additionalQualification: "", drivingLicence: "",
  aadharNo: "", mobilePersonal: "", mobileReference: "",
  hNo: "", streetColony: "", area: "", district: "",
  houseOwnRent: "", email: "", reservation: "",
  height: "", weight: "", eyeSite: "", bloodGroup: "", anyJob: "",
  experienceYears: "", experienceMonths: "",
  companyName: "", designation: "", lastSalary: "",
  reasonLeaving: "", jobType: "", techStack: "",
  coreSpec_checked: false,   coreSpec_v1: "",   coreSpec_v2: "",
  technical_checked: false,  technical_v1: "",  technical_v2: "",
  nonTech_checked: false,    nonTech_v1: "",    nonTech_v2: "",
  generalCat_checked: false, generalCat_v1: "", generalCat_v2: "",
  jobNature_checked: false,  jobNature_v1: "",  jobNature_v2: "",
};
type F = typeof INIT;

/* ═══════════════════════════════════════════════════════════
   Build DOB string yyyy-mm-dd
═══════════════════════════════════════════════════════════ */
const buildDOB = (d: string, m: string, y: string): string | null => {
  if (!d || !m || !y || y.length < 4) return null;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};

/* ═══════════════════════════════════════════════════════════
   Map frontend form → Django model field names
═══════════════════════════════════════════════════════════ */
const buildPayload = (form: F) => ({
  // HR
  hr_name:              form.hrName              || null,
  id_no:                form.idNo                || null,
  password:             form.password            || null,
  logins_count:         form.loginsCount         ? parseInt(form.loginsCount)         : null,
  percentage_obtained:  form.percentageObtained  ? parseFloat(form.percentageObtained) : null,
  success_rate:         form.successRate         ? parseFloat(form.successRate)        : null,
  // Candidate
  surname:              form.surname             || null,
  name:                 form.name               || null,
  father_mother_name:   form.fatherMotherName    || null,
  dob:                  buildDOB(form.dob_d, form.dob_m, form.dob_y),
  regn_no:              form.regnNo             || null,
  date:                 form.date               || null,
  // Qualification
  academic:             form.academic           || null,
  specialization:       form.specialization     || null,
  extra_curricular:     form.extraCurricular    || null,
  additional_qualification: form.additionalQualification || null,
  driving_licence:      form.drivingLicence     || null,
  // Contact
  aadhar_no:            form.aadharNo           || null,
  mobile_personal:      form.mobilePersonal     || null,
  mobile_reference:     form.mobileReference    || null,
  // Address
  h_no:                 form.hNo               || null,
  street_colony:        form.streetColony       || null,
  area:                 form.area              || null,
  district:             form.district          || null,
  house_own_rent:       form.houseOwnRent       || null,
  email:                form.email             || null,
  reservation:          form.reservation        || null,
  // Physical
  height:               form.height  ? parseFloat(form.height)  : null,
  weight:               form.weight  ? parseFloat(form.weight)  : null,
  eye_site:             form.eyeSite            || null,
  blood_group:          form.bloodGroup         || null,
  any_job:              form.anyJob             || null,
  // Experience
  experience_years:     form.experienceYears    || null,
  experience_months:    form.experienceMonths   || null,
  company_name:         form.companyName        || null,
  designation:          form.designation        || null,
  last_salary:          form.lastSalary         || null,
  reason_leaving:       form.reasonLeaving      || null,
  job_type:             form.jobType            || null,
  tech_stack:           form.techStack          || null,
  // Job preferences
  core_spec_checked:    form.coreSpec_checked,
  core_spec_v1:         form.coreSpec_v1        || null,
  core_spec_v2:         form.coreSpec_v2        || null,
  technical_checked:    form.technical_checked,
  technical_v1:         form.technical_v1       || null,
  technical_v2:         form.technical_v2       || null,
  non_tech_checked:     form.nonTech_checked,
  non_tech_v1:          form.nonTech_v1         || null,
  non_tech_v2:          form.nonTech_v2         || null,
  general_cat_checked:  form.generalCat_checked,
  general_cat_v1:       form.generalCat_v1      || null,
  general_cat_v2:       form.generalCat_v2      || null,
  job_nature_checked:   form.jobNature_checked,
  job_nature_v1:        form.jobNature_v1       || null,
  job_nature_v2:        form.jobNature_v2       || null,
});

/* ═══════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════ */
const StudentProfile = () => {
  const [form, setForm]       = useState<F>(INIT);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg]         = useState<string>("");
  const navigate = useNavigate();

  const set = (field: string, val: string | boolean) =>
    setForm(p => ({ ...p, [field]: val }));

  const v  = (k: keyof F) => form[k] as string;
  const vb = (k: keyof F) => form[k] as boolean;

  const showSpec = !!form.academic && !NO_SPEC.has(form.academic);

  /* ── Submit handler ── */
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitStatus("idle");
    setErrorMsg("");

    try {
      const payload = buildPayload(form);
      const res = await fetch(`${BASE}/students/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        // Collect first error messages from each field
        const messages = Object.entries(errData)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`)
          .join(" | ");
        throw new Error(messages || `Server error ${res.status}`);
      }

      const created = await res.json();
      setSubmitStatus("success");
      // Navigate to assignment page after short delay, passing candidate info + DB id
      setTimeout(() => {
        navigate("/assignment", {
          state: {
            studentId: created.id,
            name:      `${form.name} ${form.surname}`.trim() || "Candidate",
            regnNo:    form.regnNo || "—",
          },
        });
      }, 1200);

    } catch (err: unknown) {
      setSubmitStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF0F8]" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-black tracking-tight text-slate-800">Candidate Enrollment</span>
          </div>
          <span className="text-[9px] font-extrabold tracking-[0.18em] text-indigo-500 uppercase bg-indigo-50 px-2.5 py-1 rounded-full">Form</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-5 pb-24">

        <p className="text-xs font-semibold text-slate-400 px-1 tracking-wide">
          Fill in all details below and click <span className="text-indigo-600 font-bold">Submit Enrollment</span> when done.
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
              <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">HR Photo</span>
              <div className="w-28"><PhotoUpload label="Upload" /></div>
            </div>
          </div>
        </Card>

        {/* ══════════════ Candidate Details ══════════════ */}
        <Card>
          <CardHeader dot="bg-indigo-500" title="Candidate Details" />
          <div className="p-6">

            {/* Name + Photo */}
            <div className="flex gap-4 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Surname"              field="surname"          value={v("surname")}          onChange={set} />
                <Field label="First Name"           field="name"             value={v("name")}             onChange={set} />
                <Field label="Father / Mother Name" field="fatherMotherName" value={v("fatherMotherName")} onChange={set} />
              </div>
              <div className="shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
                <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">Photo</span>
                <div className="w-[72px]"><PhotoUpload label="Upload" /></div>
              </div>
            </div>

            {/* DOB + Regn + Date */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <DOBPicker dob_d={v("dob_d")} dob_m={v("dob_m")} dob_y={v("dob_y")} onChange={set} />
              <Field label="Regn. No." field="regnNo" value={v("regnNo")} onChange={set} />
              <Field label="Date"      field="date"   value={v("date")}   onChange={set} />
            </div>

            {/* ── Qualification ── */}
            <Divider label="Qualification" />
            <div className={`grid grid-cols-1 gap-4 ${showSpec ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
              <Dropdown
                label="Academic" field="academic" value={v("academic")}
                onChange={(field, val) => { set(field, val); set("specialization", ""); }}
                options={["Below SSC","SSC","Intermediate","Polytechnic","ITI","U.G (Degree)","P.G (Degree)","U.G(B.Tech/B.E)","P.G(M.Tech/M.E)"]}
              />
              <SpecField academic={v("academic")} value={v("specialization")} onChange={set} />
              <Dropdown label="Extra Curricular" field="extraCurricular" value={v("extraCurricular")} onChange={set}
                options={["Sports","Music","Dance","Drama","NCC","NSS","None"]} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Dropdown label="Additional Qualification" field="additionalQualification" value={v("additionalQualification")} onChange={set}
                options={["Tally","AutoCAD","MS Office","Photoshop","Programming","None"]} />
              <Dropdown label="Driving Licence" field="drivingLicence" value={v("drivingLicence")} onChange={set}
                options={["2 Wheeler","4 Wheeler","Both","None"]} />
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
              <Field    label="H. No."         field="hNo"          value={v("hNo")}          onChange={set} />
              <Field    label="Street / Colony" field="streetColony" value={v("streetColony")} onChange={set} />
              <Field    label="Area"            field="area"         value={v("area")}         onChange={set} />
              <Dropdown label="District"        field="district"     value={v("district")}     onChange={set}
                options={["Hyderabad","Rangareddy","Medchal","Sangareddy","Nalgonda","Warangal","Karimnagar","Other"]} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Dropdown label="House Own / Rent"    field="houseOwnRent" value={v("houseOwnRent")} onChange={set} options={["Own","Rent"]} />
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
              <Dropdown label="Any Job"     field="anyJob"     value={v("anyJob")}     onChange={set} options={["Yes","No"]} />
            </div>

            {/* ── Experience ── */}
            <Divider label="Experience" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ExperienceField years={v("experienceYears")} months={v("experienceMonths")} onChange={set} />
              <Field label="Company Name" field="companyName" value={v("companyName")} onChange={set} />
              <Field label="Designation"  field="designation" value={v("designation")}  onChange={set} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <Field    label="Last Drawn Salary"  field="lastSalary"    value={v("lastSalary")}    onChange={set} />
              <Field    label="Reason for Leaving" field="reasonLeaving" value={v("reasonLeaving")} onChange={set} />
              <Dropdown label="Job Type"           field="jobType"       value={v("jobType")}       onChange={set}
                options={["Full Time","Part Time","Contract","Internship","Self Employed"]} />
              <Field    label="Tech Stack Worked"  field="techStack"     value={v("techStack")}     onChange={set}
                placeholder="e.g. React, Django, SQL" />
            </div>

            {/* ── Digital Signature ── */}
            <div className="mt-6 flex justify-end">
              <div className="flex flex-col gap-1.5 items-end w-52">
                <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-400">Digital Signature</span>
                <div className="flex items-center justify-center gap-2 h-14 w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50
                  hover:border-teal-300 hover:bg-teal-50/40 transition-all cursor-pointer group">
                  <FileSignature className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors" />
                  <span className="text-xs font-bold text-slate-300 group-hover:text-teal-500 tracking-wide">Sign here</span>
                </div>
              </div>
            </div>

            {/* ── Nature of Job Interested ── */}
            <Divider label="Nature of Job Interested" />
            <p className="text-[10px] text-slate-400 font-semibold mb-4 -mt-2">
              Tick any that apply — extra fields will appear to fill in details.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {JOB_ROWS.map(({ field, label, opt1, opt2 }) => (
                <JobRow
                  key={field}
                  label={label} opt1={opt1} opt2={opt2}
                  checked={vb(`${field}_checked` as keyof F)}
                  val1={v(`${field}_v1` as keyof F)}
                  val2={v(`${field}_v2` as keyof F)}
                  onCheck={() => {
                    const cur = vb(`${field}_checked` as keyof F);
                    set(`${field}_checked`, !cur);
                    if (cur) { set(`${field}_v1`, ""); set(`${field}_v2`, ""); }
                  }}
                  onVal1={val => set(`${field}_v1`, val)}
                  onVal2={val => set(`${field}_v2`, val)}
                />
              ))}
            </div>

          </div>
        </Card>

        {/* ── Submit status banner ── */}
        {submitStatus === "success" && (
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-700">Enrollment submitted successfully!</p>
              <p className="text-xs text-emerald-500 mt-0.5">The form will reset shortly.</p>
            </div>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-600">Submission failed</p>
              <p className="text-xs text-red-400 mt-0.5 break-all">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* ── Submit button ── */}
        <div className="flex flex-col items-center gap-2.5 pt-2">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-16 py-3.5 rounded-xl bg-indigo-600 text-white
              text-sm font-extrabold tracking-wide shadow-lg shadow-indigo-300/50
              hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0
              transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {submitting
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
              : "Submit Enrollment"
            }
          </button>
          <p className="text-xs text-slate-400 tracking-wide">Ensure all fields are complete before submitting</p>
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