// import { useState, useRef, useEffect, useCallback } from "react";
// import { Mail, ChevronRight } from "lucide-react";

// const navLinks = [
//   "HOME", "ABOUT US", "AUTHORISED HRS", "CORE COMMITTEE",
//   "SERVICES", "PROJECTS", "ASSOCIATES", "GALLERY", "CONTACT US"
// ];

// const topTabs = [
//   "PG & Degree Colleges (MBA/ BBA/BBM/B.com)",
//   "Industrial Associates",
//   "Entrepreneur Sources",
//   "Entrepreneur Sources"
// ];

// const jobData = [
//   { org: "Hospitals", vacancies: 25, jobType: "Medical / Admin Staff" },
//   { org: "Schools", vacancies: 12, jobType: "Teaching / Admin" },
//   { org: "Colleges", vacancies: 19, jobType: "Faculty / Admin" },
//   { org: "IT Industry", vacancies: 124, jobType: "Software / Support Eng." },
//   { org: "Hardware Industry", vacancies: 22, jobType: "Technician / Engineer" },
//   { org: "Service Sector", vacancies: 232, jobType: "Customer Support / Ops" },
//   { org: "Banks", vacancies: 34, jobType: "HR Manager / Executive" },
// ];

// const PAGE_SIZE = 4;

// function JobGrid() {
//   const [filterText, setFilterText] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);
//   const [sortConfig, setSortConfig] = useState({ key: null, dir: "asc" });

//   const filtered = jobData.filter((r) => {
//     const q = filterText.toLowerCase();
//     return (
//       r.org.toLowerCase().includes(q) ||
//       r.jobType.toLowerCase().includes(q) ||
//       String(r.vacancies).includes(q)
//     );
//   });

//   const sorted = [...filtered].sort((a, b) => {
//     if (!sortConfig.key) return 0;
//     const valA = a[sortConfig.key];
//     const valB = b[sortConfig.key];
//     if (typeof valA === "number") {
//       return sortConfig.dir === "asc" ? valA - valB : valB - valA;
//     }
//     return sortConfig.dir === "asc"
//       ? String(valA).localeCompare(String(valB))
//       : String(valB).localeCompare(String(valA));
//   });

//   const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
//   const paginated = sorted.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

//   const handleSort = (key) => {
//     setSortConfig((prev) =>
//       prev.key === key
//         ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
//         : { key, dir: "asc" }
//     );
//     setCurrentPage(0);
//   };

//   const SortIcon = ({ col }) => {
//     if (sortConfig.key !== col) return <span className="text-gray-300 ml-1">⇅</span>;
//     return <span className="ml-1">{sortConfig.dir === "asc" ? "↑" : "↓"}</span>;
//   };

//   return (
//     <div className="border border-border rounded">
//       <h3 className="text-destructive font-bold px-3 pt-3 pb-1 text-sm">
//         Search for JOB
//       </h3>
//       <div className="m-2">
//         {/* Quick filter */}
//         <div className="flex items-center gap-2 mb-2">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={filterText}
//             onChange={(e) => {
//               setFilterText(e.target.value);
//               setCurrentPage(0);
//             }}
//             className="w-full px-2 py-1 text-xs border border-border rounded bg-card focus:outline-none focus:ring-1 focus:ring-primary"
//           />
//           {filterText && (
//             <button
//               onClick={() => { setFilterText(""); setCurrentPage(0); }}
//               className="text-xs text-muted-foreground hover:text-foreground"
//             >
//               ✕
//             </button>
//           )}
//         </div>

//         {/* AG-style grid table */}
//         <div className="border border-border rounded overflow-hidden text-xs">
//           {/* Header */}
//           <div className="grid grid-cols-[2fr_1fr_2fr] bg-[hsl(210,40%,88%)] font-bold text-foreground border-b border-border">
//             {[
//               { label: "Organization Type", key: "org" },
//               { label: "Vacancies", key: "vacancies" },
//               { label: "Type / Nature of Job", key: "jobType" },
//             ].map((col) => (
//               <button
//                 key={col.key}
//                 onClick={() => handleSort(col.key)}
//                 className="px-2 py-2 text-left hover:bg-[hsl(210,40%,82%)] border-r last:border-r-0 border-border flex items-center gap-1 w-full"
//               >
//                 {col.label}
//                 <SortIcon col={col.key} />
//               </button>
//             ))}
//           </div>

//           {/* Rows */}
//           {paginated.length === 0 ? (
//             <div className="text-center text-muted-foreground py-6 text-xs">
//               No results found.
//             </div>
//           ) : (
//             paginated.map((row, i) => (
//               <div
//                 key={i}
//                 className="grid grid-cols-[2fr_1fr_2fr] border-b last:border-b-0 border-border bg-[hsl(80,40%,88%)] hover:bg-[hsl(80,40%,82%)] transition-colors"
//               >
//                 <div className="px-2 py-2 border-r border-border font-medium truncate">
//                   {row.org}
//                 </div>
//                 <div className="px-2 py-2 border-r border-border text-center">
//                   <span className="bg-blue-100 text-blue-800 font-semibold rounded-full px-2 py-0.5 text-[11px]">
//                     {row.vacancies}
//                   </span>
//                 </div>
//                 <div className="px-2 py-2 text-muted-foreground truncate">
//                   {row.jobType}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Pagination */}
//         <div className="flex items-center justify-between mt-2">
//           <div className="flex gap-1">
//             <button
//               disabled={currentPage === 0}
//               onClick={() => setCurrentPage((p) => p - 1)}
//               className="px-2 py-0.5 text-xs border border-border rounded disabled:opacity-40 hover:bg-accent"
//             >
//               ‹ Prev
//             </button>
//             <button
//               disabled={currentPage >= totalPages - 1}
//               onClick={() => setCurrentPage((p) => p + 1)}
//               className="px-2 py-0.5 text-xs border border-border rounded disabled:opacity-40 hover:bg-accent"
//             >
//               Next ›
//             </button>
//           </div>
//           <span className="text-[11px] text-muted-foreground">
//             Page {currentPage + 1} of {totalPages} · {sorted.length} rows
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// const Index = () => {
//   const [hrId, setHrId] = useState("");
//   const [hrPass, setHrPass] = useState("");
//   const [empId, setEmpId] = useState("");
//   const [empPass, setEmpPass] = useState("");

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Top Header */}
//       <div className="bg-gradient-to-b from-[hsl(210,50%,92%)] to-[hsl(210,50%,85%)] border-b-2 border-primary">
//         <div className="max-w-6xl mx-auto flex items-center gap-3 py-3 px-4">
//           <div className="flex items-center gap-2 shrink-0">
//             <div className="w-14 h-14 rounded-full border-2 border-muted-foreground flex items-center justify-center bg-card">
//               <span className="text-primary font-bold text-lg italic">HR</span>
//             </div>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {topTabs.map((tab, i) => (
//               <button
//                 key={i}
//                 className="px-3 py-1.5 border border-border bg-card hover:bg-accent text-sm text-primary font-semibold underline rounded"
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Navigation Bar */}
//       <nav className="bg-gradient-to-r from-[hsl(210,70%,55%)] to-[hsl(210,70%,45%)] text-primary-foreground">
//         <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-1 px-4 py-1.5">
//           {navLinks.map((link, i) => (
//             <a
//               key={i}
//               href="#"
//               className="px-2 py-0.5 text-xs font-bold tracking-wide hover:underline uppercase"
//             >
//               {link}
//               {i < navLinks.length - 1 && <span className="ml-2">:</span>}
//             </a>
//           ))}
//         </div>
//       </nav>

//       {/* Main Content - 1:1:3 columns */}
//       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1fr_3fr] gap-4 p-4">
//         {/* Authorised HR Login */}
//         <div className="border border-border rounded">
//           <h3 className="text-primary font-bold underline px-3 pt-3 pb-1 text-sm">
//             Authorised HR Login
//           </h3>
//           <div className="bg-[hsl(20,40%,90%)] m-2 rounded p-3 min-h-[280px] flex flex-col justify-between">
//             <div>
//               <p className="text-xs text-foreground mb-3">
//                 ID No:...... Password:.........
//               </p>
//               <input
//                 type="text"
//                 placeholder="ID No"
//                 value={hrId}
//                 onChange={(e) => setHrId(e.target.value)}
//                 className="w-full mb-2 px-2 py-1 text-sm border border-border rounded bg-card"
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={hrPass}
//                 onChange={(e) => setHrPass(e.target.value)}
//                 className="w-full mb-2 px-2 py-1 text-sm border border-border rounded bg-card"
//               />
//               <button className="px-4 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90">
//                 Login
//               </button>
//             </div>
//             <p className="text-xs text-foreground mt-4">
//               Declaration Form*: and Security insurance ECS
//             </p>
//           </div>
//         </div>

//         {/* Employer Login */}
//         <div className="border border-border rounded">
//           <h3 className="font-bold px-3 pt-3 pb-1 text-sm text-foreground">
//             Employer Login for Staff Requirement:
//           </h3>
//           <div className="bg-[hsl(140,30%,92%)] m-2 rounded p-3 min-h-[280px] flex flex-col justify-between">
//             <div>
//               <p className="text-xs text-foreground mb-3">
//                 ID No:...... Password:.........
//               </p>
//               <input
//                 type="text"
//                 placeholder="ID No"
//                 value={empId}
//                 onChange={(e) => setEmpId(e.target.value)}
//                 className="w-full mb-2 px-2 py-1 text-sm border border-border rounded bg-card"
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={empPass}
//                 onChange={(e) => setEmpPass(e.target.value)}
//                 className="w-full mb-2 px-2 py-1 text-sm border border-border rounded bg-card"
//               />
//               <button className="px-4 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90">
//                 Login
//               </button>
//             </div>
//             <div className="mt-4">
//               <p className="text-sm text-foreground">Organization Profile</p>
//               <p className="text-xs text-foreground mt-2">Terms & conditions apply**:</p>
//             </div>
//           </div>
//         </div>

//         {/* Search for JOB — AG Grid */}
//         <JobGrid />
//       </div>

//       {/* Bottom Bar */}
//       <div className="max-w-6xl mx-auto px-4 pb-4">
//         <div className="border-t-2 border-primary pt-3">
//           <div className="flex flex-wrap items-center justify-between gap-4">
//             <div>
//               <p className="text-xs font-bold italic text-foreground mb-1">
//                 Qualification wise data folders
//               </p>
//               <div className="flex gap-3 items-center">
//                 {["SSC", "ITI", "Diploma", "Intermediate", "Degree", "PG"].map((item, i) => (
//                   <div key={i} className="flex flex-col items-center">
//                     <Mail className="w-14 h-14 text-orange-500" fill="orange" strokeWidth={1.5} />
//                     <span className="text-[10px] font-bold text-foreground mt-1">{item}</span>
//                   </div>
//                 ))}
//                 <ChevronRight className="w-10 h-10 text-pink-500 self-start mt-1" />
//               </div>
//             </div>
//             <a href="#" className="text-sm font-bold text-foreground hover:underline">
//               HR login for New Membership &gt;&gt;&gt;
//             </a>
//             <a href="#" className="text-sm font-bold text-foreground hover:underline">
//               Admin Login &gt;&gt;&gt;
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;









// import { useState } from "react";
// import {
//   Mail, ChevronRight, Search, X, ChevronUp, ChevronDown,
//   ChevronsUpDown, LogIn, Briefcase, Building2, GraduationCap,
//   ArrowRight, Users, Shield, ChevronLeft
// } from "lucide-react";

// /* ─────────────────────────── DATA ─────────────────────────── */

// const navLinks = [
//   "Home", "About Us", "Authorised HRs", "Core Committee",
//   "Services", "Projects", "Associates", "Gallery", "Contact Us",
// ];

// const topTabs = [
//   "PG & Degree Colleges",
//   "Industrial Associates",
//   "Entrepreneur Sources",
//   "Entrepreneur Network",
// ];

// const jobData = [
//   { org: "Hospitals",        vacancies: 25,  jobType: "Medical / Admin Staff"     },
//   { org: "Schools",          vacancies: 12,  jobType: "Teaching / Admin"           },
//   { org: "Colleges",         vacancies: 19,  jobType: "Faculty / Admin"            },
//   { org: "IT Industry",      vacancies: 124, jobType: "Software / Support Eng."    },
//   { org: "Hardware Industry",vacancies: 22,  jobType: "Technician / Engineer"      },
//   { org: "Service Sector",   vacancies: 232, jobType: "Customer Support / Ops"     },
//   { org: "Banks",            vacancies: 34,  jobType: "HR Manager / Executive"     },
// ];

// const qualifications = ["SSC", "ITI", "Diploma", "Intermediate", "Degree", "PG"];

// /* ─────────────────────────── PALETTE ──────────────────────── */
// /*  Background : #F0F4FF (very light lavender-blue)
//     Surface    : #FFFFFF
//     Primary    : #6366F1 (indigo-500)  — HR card accent
//     Secondary  : #10B981 (emerald-500) — Employer card accent
//     Nav        : #EEF2FF (indigo-50 tint)
//     Border     : #E2E8F0 (slate-200)
//     Text-main  : #1E293B (slate-800)
//     Text-muted : #64748B (slate-500)
//     Badge hi   : #ECFDF5 / #065F46
//     Badge mid  : #EFF6FF / #1E40AF
//     Badge low  : #F1F5F9 / #475569            */

// const ROW_HEIGHT  = 52;   // px per data row
// const PAGE_SIZE   = 5;    // rows per page
// const TABLE_H     = ROW_HEIGHT * PAGE_SIZE; // 260 px — fixed body height

// /* ─────────────────────── VACANCY BADGE ────────────────────── */
// const vacancyStyle = (n) => {
//   if (n >= 100) return { pill: "bg-emerald-50 text-emerald-700 border border-emerald-200", bar: "#10B981" };
//   if (n >=  30) return { pill: "bg-blue-50   text-blue-700   border border-blue-200",     bar: "#3B82F6" };
//   return              { pill: "bg-slate-100  text-slate-600  border border-slate-200",    bar: "#94A3B8" };
// };

// /* ─────────────────────── SORT ICON ────────────────────────── */
// function SortIcon({ active, dir }) {
//   if (!active) return <ChevronsUpDown className="w-3 h-3 text-slate-300 shrink-0" />;
//   return dir === "asc"
//     ? <ChevronUp   className="w-3 h-3 text-violet-500 shrink-0" />
//     : <ChevronDown className="w-3 h-3 text-violet-500 shrink-0" />;
// }

// /* ──────────────────────── JOB GRID ────────────────────────── */
// function JobGrid() {
//   const [q,    setQ]    = useState("");
//   const [page, setPage] = useState(0);
//   const [sort, setSort] = useState({ key: null, dir: "asc" });

//   const filtered = jobData.filter((r) => {
//     const lq = q.toLowerCase();
//     return r.org.toLowerCase().includes(lq)
//         || r.jobType.toLowerCase().includes(lq)
//         || String(r.vacancies).includes(lq);
//   });

//   const sorted = [...filtered].sort((a, b) => {
//     if (!sort.key) return 0;
//     const A = a[sort.key], B = b[sort.key];
//     if (typeof A === "number") return sort.dir === "asc" ? A - B : B - A;
//     return sort.dir === "asc"
//       ? String(A).localeCompare(String(B))
//       : String(B).localeCompare(String(A));
//   });

//   const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
//   const safeP      = Math.min(page, totalPages - 1);
//   const rows       = sorted.slice(safeP * PAGE_SIZE, (safeP + 1) * PAGE_SIZE);
//   // Pad rows so table height stays fixed
//   const padded     = [...rows, ...Array(PAGE_SIZE - rows.length).fill(null)];
//   const maxV       = Math.max(...jobData.map((d) => d.vacancies));

//   const handleSort = (key) => {
//     setSort((p) => p.key === key ? { key, dir: p.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
//     setPage(0);
//   };

//   const cols = [
//     { label: "Organization",   key: "org",       w: "40%" },
//     { label: "Openings",       key: "vacancies", w: "20%" },
//     { label: "Role Category",  key: "jobType",   w: "40%" },
//   ];

//   /* page numbers */
//   const pageNums = Array.from({ length: totalPages }, (_, i) => i);

//   return (
//     <div
//       className="flex flex-col rounded-2xl overflow-hidden"
//       style={{
//         background: "#FFFFFF",
//         border: "1px solid #E2E8F0",
//         boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(99,102,241,0.07)",
//       }}
//     >
//       {/* ── Card top bar ── */}
//       <div
//         className="flex items-center justify-between px-5 py-4"
//         style={{ borderBottom: "1px solid #F1F5F9", background: "#FAFBFF" }}
//       >
//         <div className="flex items-center gap-3">
//           <div
//             className="w-9 h-9 rounded-xl flex items-center justify-center"
//             style={{ background: "linear-gradient(135deg,#818CF8,#6366F1)" }}
//           >
//             <Briefcase className="w-4 h-4 text-white" />
//           </div>
//           <div>
//             <p className="font-semibold text-sm" style={{ color: "#1E293B" }}>Job Listings</p>
//             <p className="text-xs" style={{ color: "#94A3B8" }}>{filtered.length} positions available</p>
//           </div>
//         </div>

//         {/* Search */}
//         <div className="relative" style={{ width: 240 }}>
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#94A3B8" }} />
//           <input
//             type="text"
//             placeholder="Search roles…"
//             value={q}
//             onChange={(e) => { setQ(e.target.value); setPage(0); }}
//             style={{
//               width: "100%", paddingLeft: 32, paddingRight: q ? 28 : 12,
//               paddingTop: 7, paddingBottom: 7,
//               fontSize: 13, background: "#F8FAFC",
//               border: "1px solid #E2E8F0", borderRadius: 10,
//               outline: "none", color: "#1E293B",
//             }}
//             onFocus={(e) => { e.target.style.borderColor = "#818CF8"; e.target.style.boxShadow = "0 0 0 3px rgba(129,140,248,0.15)"; }}
//             onBlur={(e)  => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
//           />
//           {q && (
//             <button
//               onClick={() => { setQ(""); setPage(0); }}
//               className="absolute right-2.5 top-1/2 -translate-y-1/2"
//               style={{ color: "#94A3B8", lineHeight: 1 }}
//             >
//               <X className="w-3.5 h-3.5" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ── Table header ── */}
//       <div className="flex" style={{ background: "#F8F9FF", borderBottom: "1px solid #E2E8F0" }}>
//         {cols.map((col) => (
//           <button
//             key={col.key}
//             onClick={() => handleSort(col.key)}
//             style={{ width: col.w, textAlign: "left" }}
//             className="flex items-center gap-1.5 px-4 py-3 text-left transition-colors"
//             onMouseEnter={(e) => e.currentTarget.style.background = "#EEF2FF"}
//             onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
//           >
//             <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: "#64748B", textTransform: "uppercase" }}>
//               {col.label}
//             </span>
//             <SortIcon active={sort.key === col.key} dir={sort.dir} />
//           </button>
//         ))}
//       </div>

//       {/* ── Fixed-height table body ── */}
//       <div style={{ height: TABLE_H, overflow: "hidden" }}>
//         {padded.map((row, i) =>
//           row === null ? (
//             /* Empty padding row */
//             <div
//               key={`pad-${i}`}
//               className="flex"
//               style={{ height: ROW_HEIGHT, borderBottom: "1px solid #F8FAFC", background: i % 2 === 0 ? "#FEFEFE" : "#FAFBFF" }}
//             />
//           ) : (
//             /* Data row */
//             <div
//               key={i}
//               className="flex items-center transition-colors cursor-pointer group"
//               style={{
//                 height: ROW_HEIGHT,
//                 borderBottom: "1px solid #F1F5F9",
//                 background: i % 2 === 0 ? "#FFFFFF" : "#FAFBFF",
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.background = "#F0F4FF"}
//               onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? "#FFFFFF" : "#FAFBFF"}
//             >
//               {/* Org */}
//               <div className="flex items-center gap-2.5 px-4" style={{ width: "40%" }}>
//                 <div
//                   className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors"
//                   style={{ background: "#EEF2FF" }}
//                 >
//                   <Building2 className="w-3.5 h-3.5" style={{ color: "#6366F1" }} />
//                 </div>
//                 <span className="truncate text-sm font-medium" style={{ color: "#1E293B" }}>{row.org}</span>
//               </div>

//               {/* Vacancies */}
//               <div className="px-4 flex flex-col gap-1" style={{ width: "20%" }}>
//                 <span
//                   className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block w-fit ${vacancyStyle(row.vacancies).pill}`}
//                 >
//                   {row.vacancies}
//                 </span>
//                 <div style={{ height: 3, background: "#F1F5F9", borderRadius: 99, width: "80%" }}>
//                   <div style={{
//                     height: "100%", borderRadius: 99,
//                     width: `${(row.vacancies / maxV) * 100}%`,
//                     background: vacancyStyle(row.vacancies).bar,
//                     transition: "width 0.3s ease",
//                   }} />
//                 </div>
//               </div>

//               {/* Job type */}
//               <div className="px-4 flex items-center justify-between" style={{ width: "40%" }}>
//                 <span className="truncate text-sm" style={{ color: "#64748B" }}>{row.jobType}</span>
//                 <ArrowRight
//                   className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
//                   style={{ color: "#6366F1" }}
//                 />
//               </div>
//             </div>
//           )
//         )}
//       </div>

//       {/* ── Pagination ── */}
//       <div
//         className="flex items-center justify-between px-5 py-3"
//         style={{ borderTop: "1px solid #F1F5F9", background: "#FAFBFF" }}
//       >
//         {/* Left: row info */}
//         <p style={{ fontSize: 12, color: "#94A3B8" }}>
//           Showing{" "}
//           <span style={{ fontWeight: 600, color: "#475569" }}>
//             {sorted.length === 0 ? 0 : safeP * PAGE_SIZE + 1}–{Math.min((safeP + 1) * PAGE_SIZE, sorted.length)}
//           </span>{" "}
//           of <span style={{ fontWeight: 600, color: "#475569" }}>{sorted.length}</span>
//         </p>

//         {/* Right: page controls */}
//         <div className="flex items-center gap-1">
//           <button
//             disabled={safeP === 0}
//             onClick={() => setPage((p) => p - 1)}
//             className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors disabled:opacity-30"
//             style={{ border: "1px solid #E2E8F0", background: "#FFF" }}
//             onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = "#EEF2FF")}
//             onMouseLeave={(e) => e.currentTarget.style.background = "#FFF"}
//           >
//             <ChevronLeft className="w-3.5 h-3.5" style={{ color: "#475569" }} />
//           </button>

//           {pageNums.map((n) => (
//             <button
//               key={n}
//               onClick={() => setPage(n)}
//               className="flex items-center justify-center w-7 h-7 rounded-lg transition-all"
//               style={{
//                 fontSize: 12, fontWeight: 600,
//                 border: n === safeP ? "1px solid #6366F1" : "1px solid #E2E8F0",
//                 background: n === safeP ? "#6366F1" : "#FFF",
//                 color: n === safeP ? "#FFF" : "#64748B",
//               }}
//             >
//               {n + 1}
//             </button>
//           ))}

//           <button
//             disabled={safeP >= totalPages - 1}
//             onClick={() => setPage((p) => p + 1)}
//             className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors disabled:opacity-30"
//             style={{ border: "1px solid #E2E8F0", background: "#FFF" }}
//             onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = "#EEF2FF")}
//             onMouseLeave={(e) => e.currentTarget.style.background = "#FFF"}
//           >
//             <ChevronRight className="w-3.5 h-3.5" style={{ color: "#475569" }} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ──────────────────────── LOGIN CARD ──────────────────────── */
// function LoginCard({ title, subtitle, iconColor, iconBg, btnColor, btnHover, footerText, fields }) {
//   const [vals, setVals] = useState(fields.map(() => ""));

//   return (
//     <div
//       className="rounded-2xl flex flex-col overflow-hidden"
//       style={{
//         background: "#FFFFFF",
//         border: "1px solid #E2E8F0",
//         boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)",
//       }}
//     >
//       {/* Accent top strip */}
//       <div style={{ height: 4, background: `linear-gradient(90deg, ${iconColor}, ${btnColor})` }} />

//       <div className="p-5 flex flex-col gap-4 flex-1">
//         {/* Header */}
//         <div className="flex items-start gap-3">
//           <div
//             className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
//             style={{ background: iconBg }}
//           >
//             <LogIn className="w-4.5 h-4.5" style={{ color: iconColor, width: 18, height: 18 }} />
//           </div>
//           <div>
//             <p className="text-sm font-semibold" style={{ color: "#1E293B" }}>{title}</p>
//             <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{subtitle}</p>
//           </div>
//         </div>

//         {/* Fields */}
//         <div className="flex flex-col gap-2.5">
//           {fields.map((f, i) => (
//             <input
//               key={i}
//               type={f.type}
//               placeholder={f.placeholder}
//               value={vals[i]}
//               onChange={(e) => setVals((v) => v.map((x, j) => j === i ? e.target.value : x))}
//               style={{
//                 width: "100%", padding: "8px 12px", fontSize: 13,
//                 background: "#F8FAFC", border: "1px solid #E2E8F0",
//                 borderRadius: 10, outline: "none", color: "#1E293B",
//               }}
//               onFocus={(e) => {
//                 e.target.style.borderColor = iconColor;
//                 e.target.style.boxShadow = `0 0 0 3px ${iconBg}`;
//               }}
//               onBlur={(e) => {
//                 e.target.style.borderColor = "#E2E8F0";
//                 e.target.style.boxShadow = "none";
//               }}
//             />
//           ))}

//           <button
//             className="w-full py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
//             style={{ background: btnColor, marginTop: 2 }}
//             onMouseEnter={(e) => e.currentTarget.style.background = btnHover}
//             onMouseLeave={(e) => e.currentTarget.style.background = btnColor}
//           >
//             Sign In
//           </button>
//         </div>

//         {/* Footer */}
//         <p className="text-xs mt-auto pt-3" style={{ color: "#94A3B8", borderTop: "1px solid #F1F5F9", lineHeight: 1.6 }}>
//           {footerText}
//         </p>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────── QUAL FOLDER ──────────────────────── */
// const qualColors = [
//   { bg: "#FFF7ED", border: "#FED7AA", icon: "#F97316" },
//   { bg: "#F0FDF4", border: "#BBF7D0", icon: "#22C55E" },
//   { bg: "#EFF6FF", border: "#BFDBFE", icon: "#3B82F6" },
//   { bg: "#FDF4FF", border: "#E9D5FF", icon: "#A855F7" },
//   { bg: "#FFF1F2", border: "#FECDD3", icon: "#F43F5E" },
//   { bg: "#F0FDFA", border: "#99F6E4", icon: "#14B8A6" },
// ];

// /* ─────────────────────── ROOT COMPONENT ───────────────────── */
// const Index = () => (
//   <div className="min-h-screen" style={{ background: "#F0F4FF", fontFamily: "'Inter', system-ui, sans-serif" }}>

//     {/* ════════════════ HEADER ════════════════ */}
//     <header style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
//       <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center gap-4 flex-wrap">
//         {/* Logo */}
//         <div className="flex items-center gap-3 shrink-0">
//           <div
//             className="w-10 h-10 rounded-2xl flex items-center justify-center"
//             style={{ background: "linear-gradient(135deg,#818CF8,#6366F1)", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}
//           >
//             <span style={{ color: "#FFF", fontWeight: 700, fontSize: 15, letterSpacing: "-0.5px" }}>HR</span>
//           </div>
//           <div>
//             <p style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
//               Connect Portal
//             </p>
//             <p style={{ fontSize: 14, color: "#1E293B", fontWeight: 700, lineHeight: 1.2 }}>HR Network</p>
//           </div>
//         </div>

//         {/* Top tabs */}
//         <div className="flex flex-wrap gap-2 ml-2">
//           {topTabs.map((tab, i) => (
//             <button
//               key={i}
//               style={{
//                 padding: "5px 12px", fontSize: 12, fontWeight: 500,
//                 color: "#6366F1", background: "#EEF2FF",
//                 border: "1px solid #C7D2FE", borderRadius: 8,
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.background = "#E0E7FF"}
//               onMouseLeave={(e) => e.currentTarget.style.background = "#EEF2FF"}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>
//     </header>

//     {/* ════════════════ NAVBAR ════════════════ */}
//     <nav style={{ background: "#EEF2FF", borderBottom: "1px solid #C7D2FE" }}>
//       <div className="max-w-screen-xl mx-auto px-6 flex flex-wrap gap-0.5 py-1.5">
//         {navLinks.map((link, i) => (
//           <a
//             key={i}
//             href="#"
//             style={{
//               padding: "5px 12px", fontSize: 11.5, fontWeight: 600,
//               color: "#4338CA", letterSpacing: "0.04em",
//               textDecoration: "none", borderRadius: 8,
//               textTransform: "uppercase",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#C7D2FE";
//               e.currentTarget.style.color = "#312E81";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "transparent";
//               e.currentTarget.style.color = "#4338CA";
//             }}
//           >
//             {link}
//           </a>
//         ))}
//       </div>
//     </nav>

//     {/* ════════════════ MAIN GRID ════════════════ */}
//     <main className="max-w-screen-xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-[1fr_1fr_3fr] gap-5 items-start">

//       {/* HR Login */}
//       <LoginCard
//         title="Authorised HR Login"
//         subtitle="Access your HR dashboard"
//         iconColor="#6366F1"
//         iconBg="#EEF2FF"
//         btnColor="#6366F1"
//         btnHover="#4F46E5"
//         footerText="Declaration Form & Security Insurance ECS required for portal activation."
//         fields={[
//           { type: "text",     placeholder: "HR ID No." },
//           { type: "password", placeholder: "Password"  },
//         ]}
//       />

//       {/* Employer Login */}
//       <LoginCard
//         title="Employer Login"
//         subtitle="Post staff requirements"
//         iconColor="#10B981"
//         iconBg="#ECFDF5"
//         btnColor="#10B981"
//         btnHover="#059669"
//         footerText="Organization Profile required. Terms & conditions apply to all listings."
//         fields={[
//           { type: "text",     placeholder: "Employer ID No." },
//           { type: "password", placeholder: "Password"         },
//         ]}
//       />

//       {/* Job Grid */}
//       <JobGrid />
//     </main>

//     {/* ════════════════ FOOTER STRIP ════════════════ */}
//     <footer className="max-w-screen-xl mx-auto px-6 pb-8">
//       <div
//         className="rounded-2xl px-6 py-5 flex flex-wrap items-center justify-between gap-6"
//         style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
//       >
//         {/* Qual folders */}
//         <div>
//           <p
//             className="flex items-center gap-1.5 mb-3"
//             style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}
//           >
//             <GraduationCap style={{ width: 13, height: 13 }} />
//             Qualification-wise Data Folders
//           </p>
//           <div className="flex gap-3 items-end flex-wrap">
//             {qualifications.map((item, i) => {
//               const c = qualColors[i % qualColors.length];
//               return (
//                 <button
//                   key={i}
//                   className="flex flex-col items-center gap-1.5 group"
//                   style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
//                 >
//                   <div
//                     className="w-11 h-11 rounded-xl flex items-center justify-center transition-all"
//                     style={{ background: c.bg, border: `1px solid ${c.border}` }}
//                     onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
//                     onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
//                   >
//                     <Mail style={{ width: 18, height: 18, color: c.icon }} />
//                   </div>
//                   <span style={{ fontSize: 10, fontWeight: 700, color: "#64748B" }}>{item}</span>
//                 </button>
//               );
//             })}
//             <ChevronRight style={{ width: 16, height: 16, color: "#C4B5FD", marginBottom: 16 }} />
//           </div>
//         </div>

//         {/* Action links */}
//         <div className="flex flex-col gap-3">
//           <a
//             href="#"
//             className="flex items-center gap-2 group"
//             style={{ textDecoration: "none", fontSize: 13, fontWeight: 600, color: "#6366F1" }}
//           >
//             <span>HR Login for New Membership</span>
//             <ArrowRight
//               style={{ width: 14, height: 14, transition: "transform 0.2s" }}
//               onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(4px)"}
//             />
//           </a>
//           <a
//             href="#"
//             className="flex items-center gap-2 group"
//             style={{ textDecoration: "none", fontSize: 13, fontWeight: 600, color: "#64748B" }}
//           >
//             <span>Admin Login</span>
//             <ArrowRight style={{ width: 14, height: 14 }} />
//           </a>
//         </div>
//       </div>
//     </footer>
//   </div>
// );

// export default Index;








// import { useState } from "react";
// import {
//   Mail, Search, X, ChevronUp, ChevronDown, ChevronsUpDown,
//   Briefcase, Building2, GraduationCap, ArrowRight,
//   ChevronLeft, ChevronRight, LogIn, Sparkles, TrendingUp,
// } from "lucide-react";

// /* ───────────────────────────── DATA ───────────────────────────── */
// const navLinks = ["Home","About Us","Authorised HRs","Core Committee","Services","Projects","Associates","Gallery","Contact Us"];
// const topTabs  = ["PG & Degree Colleges","Industrial Associates","Entrepreneur Sources","Entrepreneur Network"];
// const jobData  = [
//   { org:"Hospitals",         vacancies:25,  jobType:"Medical / Admin Staff"    },
//   { org:"Schools",           vacancies:12,  jobType:"Teaching / Admin"          },
//   { org:"Colleges",          vacancies:19,  jobType:"Faculty / Admin"           },
//   { org:"IT Industry",       vacancies:124, jobType:"Software / Support Eng."   },
//   { org:"Hardware Industry", vacancies:22,  jobType:"Technician / Engineer"     },
//   { org:"Service Sector",    vacancies:232, jobType:"Customer Support / Ops"    },
//   { org:"Banks",             vacancies:34,  jobType:"HR Manager / Executive"    },
// ];
// const qualifications = ["SSC","ITI","Diploma","Intermediate","Degree","PG"];

// /* ───────────────────────── CONSTANTS ──────────────────────────── */
// const ROW_H    = 54;
// const PAGE_SZ  = 5;
// const TABLE_H  = ROW_H * PAGE_SZ;

// /* ───────────────────────── HELPERS ────────────────────────────── */
// const badgeStyle = (n) => {
//   if (n >= 100) return { from:"#34D399", to:"#059669", text:"#fff" };
//   if (n >=  30) return { from:"#60A5FA", to:"#2563EB", text:"#fff" };
//                 return { from:"#A78BFA", to:"#7C3AED", text:"#fff" };
// };

// const SortIcon = ({ active, dir }) =>
//   !active
//     ? <ChevronsUpDown style={{width:12,height:12,color:"rgba(255,255,255,0.35)",flexShrink:0}}/>
//     : dir==="asc"
//       ? <ChevronUp   style={{width:12,height:12,color:"#FCD34D",flexShrink:0}}/>
//       : <ChevronDown style={{width:12,height:12,color:"#FCD34D",flexShrink:0}}/>;

// /* ═══════════════════════ JOB GRID ═════════════════════════════ */
// function JobGrid() {
//   const [q,    setQ]    = useState("");
//   const [page, setPage] = useState(0);
//   const [sort, setSort] = useState({ key:null, dir:"asc" });

//   const filtered = jobData.filter(r => {
//     const lq = q.toLowerCase();
//     return r.org.toLowerCase().includes(lq)
//         || r.jobType.toLowerCase().includes(lq)
//         || String(r.vacancies).includes(lq);
//   });

//   const sorted = [...filtered].sort((a,b) => {
//     if (!sort.key) return 0;
//     const A=a[sort.key], B=b[sort.key];
//     if (typeof A==="number") return sort.dir==="asc" ? A-B : B-A;
//     return sort.dir==="asc" ? String(A).localeCompare(String(B)) : String(B).localeCompare(String(A));
//   });

//   const totalPages = Math.max(1, Math.ceil(sorted.length/PAGE_SZ));
//   const safeP      = Math.min(page, totalPages-1);
//   const rows       = sorted.slice(safeP*PAGE_SZ, (safeP+1)*PAGE_SZ);
//   const padded     = [...rows, ...Array(PAGE_SZ-rows.length).fill(null)];
//   const maxV       = Math.max(...jobData.map(d=>d.vacancies));

//   const handleSort = key => {
//     setSort(p => p.key===key ? {key, dir:p.dir==="asc"?"desc":"asc"} : {key, dir:"asc"});
//     setPage(0);
//   };

//   const cols = [
//     {label:"Organization",  key:"org",       w:"38%"},
//     {label:"Openings",      key:"vacancies", w:"20%"},
//     {label:"Role Category", key:"jobType",   w:"42%"},
//   ];

//   /* Glassmorphism card style */
//   const cardStyle = {
//     borderRadius: 20,
//     overflow: "hidden",
//     background: "rgba(255,255,255,0.72)",
//     backdropFilter: "blur(20px)",
//     WebkitBackdropFilter: "blur(20px)",
//     border: "1px solid rgba(255,255,255,0.9)",
//     boxShadow: "0 8px 32px rgba(99,102,241,0.13), 0 1.5px 6px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.8)",
//   };

//   return (
//     <div style={cardStyle}>

//       {/* ── Top bar ── */}
//       <div style={{
//         background: "linear-gradient(135deg,#6366F1 0%,#8B5CF6 50%,#A78BFA 100%)",
//         padding: "16px 20px",
//         display:"flex", alignItems:"center", justifyContent:"space-between",
//         position:"relative", overflow:"hidden",
//       }}>
//         {/* Glossy sheen overlay */}
//         <div style={{
//           position:"absolute", inset:0,
//           background:"linear-gradient(135deg,rgba(255,255,255,0.25) 0%,rgba(255,255,255,0.05) 50%,transparent 100%)",
//           pointerEvents:"none",
//         }}/>
//         {/* Decorative orbs */}
//         <div style={{position:"absolute",right:-20,top:-20,width:90,height:90,borderRadius:"50%",background:"rgba(255,255,255,0.08)",pointerEvents:"none"}}/>
//         <div style={{position:"absolute",right:40,bottom:-30,width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,0.06)",pointerEvents:"none"}}/>

//         <div style={{display:"flex",alignItems:"center",gap:12,position:"relative"}}>
//           <div style={{
//             width:38,height:38,borderRadius:12,
//             background:"rgba(255,255,255,0.2)",
//             backdropFilter:"blur(8px)",
//             border:"1px solid rgba(255,255,255,0.35)",
//             display:"flex",alignItems:"center",justifyContent:"center",
//             boxShadow:"0 2px 8px rgba(0,0,0,0.15)",
//           }}>
//             <Briefcase style={{width:18,height:18,color:"#fff"}}/>
//           </div>
//           <div>
//             <p style={{fontSize:15,fontWeight:700,color:"#fff",margin:0,letterSpacing:"-0.2px"}}>Live Job Listings</p>
//             <p style={{fontSize:11,color:"rgba(255,255,255,0.75)",margin:0}}>
//               <Sparkles style={{width:10,height:10,display:"inline",marginRight:3}}/>
//               {filtered.length} positions available
//             </p>
//           </div>
//         </div>

//         {/* Search box */}
//         <div style={{position:"relative",width:230}}>
//           <Search style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",width:13,height:13,color:"rgba(255,255,255,0.6)"}}/>
//           <input
//             type="text"
//             placeholder="Search roles…"
//             value={q}
//             onChange={e=>{setQ(e.target.value);setPage(0);}}
//             style={{
//               width:"100%",paddingLeft:30,paddingRight:q?28:10,
//               paddingTop:7,paddingBottom:7,fontSize:12.5,
//               background:"rgba(255,255,255,0.18)",
//               backdropFilter:"blur(8px)",
//               border:"1px solid rgba(255,255,255,0.35)",
//               borderRadius:10,outline:"none",color:"#fff",
//               boxSizing:"border-box",
//             }}
//             onFocus={e=>{e.target.style.background="rgba(255,255,255,0.28)";e.target.style.borderColor="rgba(255,255,255,0.7)";}}
//             onBlur={e=>{e.target.style.background="rgba(255,255,255,0.18)";e.target.style.borderColor="rgba(255,255,255,0.35)";}}
//           />
//           {q&&<button onClick={()=>{setQ("");setPage(0);}} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:0,color:"rgba(255,255,255,0.7)"}}>
//             <X style={{width:12,height:12}}/>
//           </button>}
//         </div>
//       </div>

//       {/* ── Column headers ── */}
//       <div style={{display:"flex",background:"linear-gradient(180deg,#F5F3FF 0%,#EEF2FF 100%)",borderBottom:"1px solid rgba(99,102,241,0.12)"}}>
//         {cols.map(col=>(
//           <button key={col.key} onClick={()=>handleSort(col.key)}
//             style={{
//               width:col.w,display:"flex",alignItems:"center",gap:5,
//               padding:"10px 16px",background:"transparent",border:"none",cursor:"pointer",
//               fontSize:10.5,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",
//               color:"#6366F1",transition:"background 0.15s",
//             }}
//             onMouseEnter={e=>e.currentTarget.style.background="rgba(99,102,241,0.07)"}
//             onMouseLeave={e=>e.currentTarget.style.background="transparent"}
//           >
//             {col.label}
//             <SortIcon active={sort.key===col.key} dir={sort.dir}/>
//           </button>
//         ))}
//       </div>

//       {/* ── Fixed body ── */}
//       <div style={{height:TABLE_H,overflow:"hidden"}}>
//         {padded.map((row,i)=>{
//           if (!row) return (
//             <div key={`pad-${i}`} style={{
//               height:ROW_H,display:"flex",
//               borderBottom:"1px solid rgba(226,232,240,0.6)",
//               background: i%2===0 ? "#FFFFFF" : "rgba(238,242,255,0.3)",
//             }}/>
//           );

//           const bs = badgeStyle(row.vacancies);
//           const isEven = i%2===0;
//           return (
//             <div key={i}
//               style={{
//                 height:ROW_H,display:"flex",alignItems:"center",
//                 borderBottom:"1px solid rgba(226,232,240,0.6)",
//                 background: isEven ? "#FFFFFF" : "rgba(238,242,255,0.35)",
//                 cursor:"pointer",transition:"background 0.15s, transform 0.1s",
//               }}
//               onMouseEnter={e=>{e.currentTarget.style.background="linear-gradient(90deg,rgba(238,242,255,0.9),rgba(221,214,254,0.35))";}}
//               onMouseLeave={e=>{e.currentTarget.style.background=isEven?"#FFFFFF":"rgba(238,242,255,0.35)";}}
//             >
//               {/* Org */}
//               <div style={{width:"38%",padding:"0 16px",display:"flex",alignItems:"center",gap:10}}>
//                 <div style={{
//                   width:30,height:30,borderRadius:9,flexShrink:0,
//                   background:"linear-gradient(135deg,#EEF2FF,#DDD6FE)",
//                   border:"1px solid rgba(99,102,241,0.2)",
//                   display:"flex",alignItems:"center",justifyContent:"center",
//                   boxShadow:"inset 0 1px 2px rgba(255,255,255,0.8)",
//                 }}>
//                   <Building2 style={{width:14,height:14,color:"#6366F1"}}/>
//                 </div>
//                 <span style={{fontSize:13,fontWeight:600,color:"#1E293B",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{row.org}</span>
//               </div>

//               {/* Vacancies */}
//               <div style={{width:"20%",padding:"0 16px"}}>
//                 <span style={{
//                   display:"inline-block",padding:"3px 11px",borderRadius:99,fontSize:12,fontWeight:700,
//                   background:`linear-gradient(135deg,${bs.from},${bs.to})`,color:bs.text,
//                   boxShadow:`0 2px 8px ${bs.from}55`,letterSpacing:"0.02em",
//                 }}>
//                   {row.vacancies}
//                 </span>
//                 <div style={{height:3,background:"rgba(226,232,240,0.8)",borderRadius:99,marginTop:5,width:"75%",overflow:"hidden"}}>
//                   <div style={{
//                     height:"100%",borderRadius:99,
//                     background:`linear-gradient(90deg,${bs.from},${bs.to})`,
//                     width:`${(row.vacancies/maxV)*100}%`,
//                     boxShadow:`0 0 6px ${bs.from}88`,
//                     transition:"width 0.4s ease",
//                   }}/>
//                 </div>
//               </div>

//               {/* Role */}
//               <div style={{width:"42%",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
//                 <span style={{fontSize:13,color:"#64748B",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{row.jobType}</span>
//                 <div style={{
//                   width:24,height:24,borderRadius:7,background:"rgba(99,102,241,0)",
//                   display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
//                   transition:"background 0.15s",
//                 }}>
//                   <ArrowRight style={{width:13,height:13,color:"#A5B4FC"}}/>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* ── Pagination ── */}
//       <div style={{
//         display:"flex",alignItems:"center",justifyContent:"space-between",
//         padding:"10px 20px",
//         background:"linear-gradient(180deg,#F5F3FF,#EEF2FF)",
//         borderTop:"1px solid rgba(99,102,241,0.1)",
//       }}>
//         <p style={{fontSize:12,color:"#64748B",margin:0}}>
//           Showing{" "}
//           <b style={{color:"#4F46E5"}}>{sorted.length===0?0:safeP*PAGE_SZ+1}–{Math.min((safeP+1)*PAGE_SZ,sorted.length)}</b>
//           {" "}of{" "}
//           <b style={{color:"#4F46E5"}}>{sorted.length}</b>
//         </p>
//         <div style={{display:"flex",alignItems:"center",gap:5}}>
//           {/* Prev */}
//           <button disabled={safeP===0} onClick={()=>setPage(p=>p-1)}
//             style={{
//               width:30,height:30,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",
//               background:safeP===0?"#F1F5F9":"#fff",border:"1px solid rgba(99,102,241,0.2)",
//               cursor:safeP===0?"not-allowed":"pointer",opacity:safeP===0?0.4:1,
//               boxShadow:"0 1px 3px rgba(0,0,0,0.06)",transition:"all 0.15s",
//             }}
//             onMouseEnter={e=>safeP!==0&&(e.currentTarget.style.background="#EEF2FF")}
//             onMouseLeave={e=>e.currentTarget.style.background=safeP===0?"#F1F5F9":"#fff"}
//           >
//             <ChevronLeft style={{width:14,height:14,color:"#6366F1"}}/>
//           </button>

//           {/* Page numbers */}
//           {Array.from({length:totalPages},(_,n)=>(
//             <button key={n} onClick={()=>setPage(n)}
//               style={{
//                 width:30,height:30,borderRadius:9,
//                 display:"flex",alignItems:"center",justifyContent:"center",
//                 fontSize:12,fontWeight:700,cursor:"pointer",
//                 transition:"all 0.15s",
//                 background: n===safeP
//                   ? "linear-gradient(135deg,#6366F1,#8B5CF6)"
//                   : "#fff",
//                 border: n===safeP
//                   ? "1px solid transparent"
//                   : "1px solid rgba(99,102,241,0.2)",
//                 color: n===safeP ? "#fff" : "#6366F1",
//                 boxShadow: n===safeP
//                   ? "0 2px 8px rgba(99,102,241,0.4)"
//                   : "0 1px 3px rgba(0,0,0,0.06)",
//               }}
//             >{n+1}</button>
//           ))}

//           {/* Next */}
//           <button disabled={safeP>=totalPages-1} onClick={()=>setPage(p=>p+1)}
//             style={{
//               width:30,height:30,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",
//               background:safeP>=totalPages-1?"#F1F5F9":"#fff",border:"1px solid rgba(99,102,241,0.2)",
//               cursor:safeP>=totalPages-1?"not-allowed":"pointer",opacity:safeP>=totalPages-1?0.4:1,
//               boxShadow:"0 1px 3px rgba(0,0,0,0.06)",transition:"all 0.15s",
//             }}
//             onMouseEnter={e=>safeP<totalPages-1&&(e.currentTarget.style.background="#EEF2FF")}
//             onMouseLeave={e=>e.currentTarget.style.background=safeP>=totalPages-1?"#F1F5F9":"#fff"}
//           >
//             <ChevronRight style={{width:14,height:14,color:"#6366F1"}}/>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════ LOGIN CARD ════════════════════════════ */
// function LoginCard({ title, subtitle, grad, glowColor, fields }) {
//   const [vals, setVals] = useState(fields.map(()=>""));

//   return (
//     <div style={{
//       borderRadius:20,overflow:"hidden",
//       background:"rgba(255,255,255,0.75)",
//       backdropFilter:"blur(20px)",
//       WebkitBackdropFilter:"blur(20px)",
//       border:"1px solid rgba(255,255,255,0.9)",
//       boxShadow:`0 8px 32px ${glowColor}22, 0 1.5px 6px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)`,
//     }}>
//       {/* Gradient header */}
//       <div style={{
//         background:grad,padding:"18px 18px 16px",position:"relative",overflow:"hidden",
//       }}>
//         <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 60%)",pointerEvents:"none"}}/>
//         <div style={{position:"absolute",right:-15,top:-15,width:70,height:70,borderRadius:"50%",background:"rgba(255,255,255,0.1)",pointerEvents:"none"}}/>
//         <div style={{
//           width:36,height:36,borderRadius:11,marginBottom:10,
//           background:"rgba(255,255,255,0.22)",border:"1px solid rgba(255,255,255,0.4)",
//           backdropFilter:"blur(6px)",
//           display:"flex",alignItems:"center",justifyContent:"center",
//           boxShadow:"0 2px 8px rgba(0,0,0,0.12)",position:"relative",
//         }}>
//           <LogIn style={{width:16,height:16,color:"#fff"}}/>
//         </div>
//         <p style={{fontSize:13.5,fontWeight:700,color:"#fff",margin:0,position:"relative",letterSpacing:"-0.2px"}}>{title}</p>
//         <p style={{fontSize:11,color:"rgba(255,255,255,0.72)",margin:"2px 0 0",position:"relative"}}>{subtitle}</p>
//       </div>

//       {/* Body */}
//       <div style={{padding:16,display:"flex",flexDirection:"column",gap:10}}>
//         {fields.map((f,i)=>(
//           <div key={i} style={{position:"relative"}}>
//             <input
//               type={f.type}
//               placeholder={f.placeholder}
//               value={vals[i]}
//               onChange={e=>setVals(v=>v.map((x,j)=>j===i?e.target.value:x))}
//               style={{
//                 width:"100%",padding:"9px 12px",fontSize:13,
//                 background:"rgba(248,250,252,0.9)",
//                 border:"1px solid rgba(226,232,240,0.8)",
//                 borderRadius:11,outline:"none",color:"#1E293B",
//                 boxSizing:"border-box",
//                 boxShadow:"inset 0 1px 3px rgba(0,0,0,0.04)",
//                 transition:"all 0.2s",
//               }}
//               onFocus={e=>{e.target.style.borderColor=glowColor;e.target.style.boxShadow=`0 0 0 3px ${glowColor}22, inset 0 1px 3px rgba(0,0,0,0.04)`;}}
//               onBlur={e=>{e.target.style.borderColor="rgba(226,232,240,0.8)";e.target.style.boxShadow="inset 0 1px 3px rgba(0,0,0,0.04)";}}
//             />
//           </div>
//         ))}

//         {/* Glossy button */}
//         <button
//           style={{
//             width:"100%",padding:"9px",marginTop:2,
//             background:grad,color:"#fff",fontWeight:700,fontSize:13,
//             border:"none",borderRadius:11,cursor:"pointer",
//             position:"relative",overflow:"hidden",
//             boxShadow:`0 4px 14px ${glowColor}44`,
//             transition:"transform 0.15s, box-shadow 0.15s",
//           }}
//           onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=`0 6px 20px ${glowColor}55`;}}
//           onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=`0 4px 14px ${glowColor}44`;}}
//           onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"}
//           onMouseUp={e=>e.currentTarget.style.transform="translateY(-1px)"}
//         >
//           <span style={{position:"relative",zIndex:1}}>Sign In →</span>
//           <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,0.2) 0%,transparent 60%)",pointerEvents:"none"}}/>
//         </button>

//         <p style={{fontSize:10.5,color:"#94A3B8",lineHeight:1.6,margin:0,paddingTop:8,borderTop:"1px dashed rgba(226,232,240,0.8)"}}>
//           {fields[0].footerText}
//         </p>
//       </div>
//     </div>
//   );
// }

// /* ══════════════════ QUAL FOLDER BUTTON ════════════════════════ */
// const qualCfg = [
//   {from:"#FB923C",to:"#EA580C",glow:"#FB923C"},
//   {from:"#34D399",to:"#059669",glow:"#34D399"},
//   {from:"#60A5FA",to:"#2563EB",glow:"#60A5FA"},
//   {from:"#C084FC",to:"#9333EA",glow:"#C084FC"},
//   {from:"#FB7185",to:"#E11D48",glow:"#FB7185"},
//   {from:"#2DD4BF",to:"#0D9488",glow:"#2DD4BF"},
// ];

// /* ═════════════════════════ ROOT ════════════════════════════════ */
// const Index = () => (
//   <div style={{
//     minHeight:"100vh",
//     fontFamily:"'Inter',system-ui,sans-serif",
//     background:"linear-gradient(135deg,#EEF2FF 0%,#F5F3FF 30%,#FDF4FF 60%,#EFF6FF 100%)",
//     position:"relative",
//   }}>
//     {/* Ambient background blobs */}
//     <div style={{position:"fixed",top:-120,left:-80,width:420,height:420,borderRadius:"50%",background:"radial-gradient(circle,rgba(165,180,252,0.35),transparent 70%)",pointerEvents:"none",zIndex:0}}/>
//     <div style={{position:"fixed",bottom:-100,right:-60,width:380,height:380,borderRadius:"50%",background:"radial-gradient(circle,rgba(196,181,253,0.3),transparent 70%)",pointerEvents:"none",zIndex:0}}/>
//     <div style={{position:"fixed",top:"40%",left:"55%",width:260,height:260,borderRadius:"50%",background:"radial-gradient(circle,rgba(147,197,253,0.2),transparent 70%)",pointerEvents:"none",zIndex:0}}/>

//     <div style={{position:"relative",zIndex:1}}>

//       {/* ══════ HEADER ══════ */}
//       <header style={{
//         background:"rgba(255,255,255,0.75)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
//         borderBottom:"1px solid rgba(255,255,255,0.9)",
//         boxShadow:"0 1px 20px rgba(99,102,241,0.08)",
//       }}>
//         <div style={{maxWidth:1280,margin:"0 auto",padding:"12px 24px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
//           {/* Logo */}
//           <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
//             <div style={{
//               width:44,height:44,borderRadius:14,
//               background:"linear-gradient(135deg,#818CF8,#6366F1,#4F46E5)",
//               boxShadow:"0 4px 16px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.3)",
//               display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",
//             }}>
//               <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,0.25) 0%,transparent 60%)"}}/>
//               <span style={{color:"#fff",fontWeight:800,fontSize:16,letterSpacing:"-0.5px",position:"relative"}}>HR</span>
//             </div>
//             <div>
//               <p style={{fontSize:9.5,color:"#A5B4FC",fontWeight:800,letterSpacing:"0.15em",textTransform:"uppercase",margin:0}}>Connect Portal</p>
//               <p style={{fontSize:15,color:"#1E293B",fontWeight:800,lineHeight:1.15,margin:0,letterSpacing:"-0.4px"}}>HR Network</p>
//             </div>
//           </div>

//           {/* Divider */}
//           <div style={{width:1,height:32,background:"rgba(99,102,241,0.15)",flexShrink:0}}/>

//           {/* Top tabs */}
//           <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
//             {topTabs.map((tab,i)=>(
//               <button key={i} style={{
//                 padding:"5px 13px",fontSize:12,fontWeight:600,
//                 color:"#6366F1",background:"rgba(238,242,255,0.8)",
//                 border:"1px solid rgba(199,210,254,0.7)",borderRadius:99,cursor:"pointer",
//                 backdropFilter:"blur(8px)",
//                 boxShadow:"inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 4px rgba(99,102,241,0.1)",
//                 transition:"all 0.15s",
//               }}
//               onMouseEnter={e=>{e.currentTarget.style.background="rgba(199,210,254,0.8)";e.currentTarget.style.transform="translateY(-1px)";}}
//               onMouseLeave={e=>{e.currentTarget.style.background="rgba(238,242,255,0.8)";e.currentTarget.style.transform="none";}}
//               >{tab}</button>
//             ))}
//           </div>
//         </div>
//       </header>

//       {/* ══════ NAVBAR ══════ */}
//       <nav style={{
//         background:"rgba(238,242,255,0.85)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",
//         borderBottom:"1px solid rgba(199,210,254,0.6)",
//       }}>
//         <div style={{maxWidth:1280,margin:"0 auto",padding:"4px 24px",display:"flex",flexWrap:"wrap",gap:2}}>
//           {navLinks.map((link,i)=>(
//             <a key={i} href="#" style={{
//               padding:"6px 13px",fontSize:11,fontWeight:700,
//               color:"#4338CA",letterSpacing:"0.06em",textDecoration:"none",
//               borderRadius:8,textTransform:"uppercase",transition:"all 0.15s",
//             }}
//             onMouseEnter={e=>{e.currentTarget.style.background="rgba(199,210,254,0.7)";e.currentTarget.style.color="#312E81";}}
//             onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#4338CA";}}
//             >{link}</a>
//           ))}
//         </div>
//       </nav>

//       {/* ══════ MAIN GRID ══════ */}
//       <main style={{maxWidth:1280,margin:"0 auto",padding:"24px 24px",display:"grid",gridTemplateColumns:"1fr 1fr 3fr",gap:20,alignItems:"start"}}>

//         <LoginCard
//           title="Authorised HR Login"
//           subtitle="Access your HR dashboard"
//           grad="linear-gradient(135deg,#818CF8,#6366F1,#4F46E5)"
//           glowColor="#6366F1"
//           fields={[
//             {type:"text",     placeholder:"HR ID No.",      footerText:"Declaration Form & Security Insurance ECS required for portal activation."},
//             {type:"password", placeholder:"Password",       footerText:""},
//           ]}
//         />

//         <LoginCard
//           title="Employer Login"
//           subtitle="Post staff requirements"
//           grad="linear-gradient(135deg,#34D399,#10B981,#059669)"
//           glowColor="#10B981"
//           fields={[
//             {type:"text",     placeholder:"Employer ID No.", footerText:"Organization Profile required. Terms & conditions apply to all listings."},
//             {type:"password", placeholder:"Password",        footerText:""},
//           ]}
//         />

//         <JobGrid/>
//       </main>

//       {/* ══════ FOOTER ══════ */}
//       <footer style={{maxWidth:1280,margin:"0 auto",padding:"0 24px 32px"}}>
//         <div style={{
//           borderRadius:20,padding:"20px 24px",
//           display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:20,
//           background:"rgba(255,255,255,0.72)",
//           backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
//           border:"1px solid rgba(255,255,255,0.9)",
//           boxShadow:"0 4px 24px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
//         }}>

//           {/* Qual folders */}
//           <div>
//             <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
//               <GraduationCap style={{width:13,height:13,color:"#A5B4FC"}}/>
//               <span style={{fontSize:10,fontWeight:800,color:"#A5B4FC",letterSpacing:"0.1em",textTransform:"uppercase"}}>
//                 Qualification-wise Data Folders
//               </span>
//             </div>
//             <div style={{display:"flex",gap:10,alignItems:"flex-end",flexWrap:"wrap"}}>
//               {qualifications.map((item,i)=>{
//                 const c = qualCfg[i%qualCfg.length];
//                 return (
//                   <button key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,background:"none",border:"none",cursor:"pointer",padding:0}}>
//                     <div style={{
//                       width:44,height:44,borderRadius:13,
//                       background:`linear-gradient(135deg,${c.from},${c.to})`,
//                       boxShadow:`0 4px 12px ${c.glow}44, inset 0 1px 0 rgba(255,255,255,0.3)`,
//                       display:"flex",alignItems:"center",justifyContent:"center",
//                       position:"relative",overflow:"hidden",
//                       transition:"transform 0.2s, box-shadow 0.2s",
//                     }}
//                     onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px) scale(1.05)";e.currentTarget.style.boxShadow=`0 8px 20px ${c.glow}55`;}}
//                     onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=`0 4px 12px ${c.glow}44`;}}
//                     >
//                       <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,0.25) 0%,transparent 60%)"}}/>
//                       <Mail style={{width:18,height:18,color:"#fff",position:"relative"}}/>
//                     </div>
//                     <span style={{fontSize:10,fontWeight:700,color:"#64748B"}}>{item}</span>
//                   </button>
//                 );
//               })}
//               <div style={{alignSelf:"flex-start",marginTop:8,opacity:0.5}}>
//                 <ChevronRight style={{width:16,height:16,color:"#818CF8"}}/>
//               </div>
//             </div>
//           </div>

//           {/* Divider */}
//           <div style={{width:1,height:60,background:"rgba(226,232,240,0.8)",flexShrink:0}}/>

//           {/* Links */}
//           <div style={{display:"flex",flexDirection:"column",gap:12}}>
//             {[
//               {label:"HR Login for New Membership",color:"#6366F1",glow:"rgba(99,102,241,0.15)"},
//               {label:"Admin Login",               color:"#64748B",glow:"transparent"},
//             ].map((l,i)=>(
//               <a key={i} href="#" style={{
//                 display:"flex",alignItems:"center",gap:8,textDecoration:"none",
//                 fontSize:13,fontWeight:700,color:l.color,
//                 padding:"7px 14px",borderRadius:10,
//                 background:l.glow,border:`1px solid ${l.glow==="transparent"?"rgba(226,232,240,0.5)":"rgba(99,102,241,0.15)"}`,
//                 transition:"all 0.15s",boxSizing:"border-box",
//               }}
//               onMouseEnter={e=>{e.currentTarget.style.transform="translateX(3px)";}}
//               onMouseLeave={e=>{e.currentTarget.style.transform="none";}}
//               >
//                 <TrendingUp style={{width:14,height:14}}/>
//                 {l.label}
//                 <ArrowRight style={{width:13,height:13,marginLeft:"auto"}}/>
//               </a>
//             ))}
//           </div>
//         </div>
//       </footer>
//     </div>
//   </div>
// );

// export default Index;


import { useState } from "react";
import {
  Mail, Search, X, ChevronUp, ChevronDown, ChevronsUpDown,
  Briefcase, Building2, GraduationCap, ArrowRight,
  ChevronLeft, ChevronRight, LogIn, Zap,
} from "lucide-react";

/* ═══════════════════════ PALETTE ════════════════════════════
   Page bg      #EFF6FF  (blue-50)
   Surface      #FFFFFF
   Primary      #2563EB  (blue-600)
   Primary mid  #3B82F6  (blue-500)
   Primary lite #DBEAFE  (blue-100)
   Accent teal  #0EA5E9  (sky-500)
   Border       #BFDBFE  (blue-200)
   Text head    #1E3A5F
   Text body    #334155
   Text muted   #64748B
═══════════════════════════════════════════════════════════════ */

const NAV  = ["Home","About Us","Authorised HRs","Core Committee","Services","Projects","Associates","Gallery","Contact Us"];
const TABS = ["PG & Degree Colleges","Industrial Associates","Entrepreneur Sources","Entrepreneur Network"];
const JOBS = [
  { org:"Hospitals",         n:25,  role:"Medical / Admin Staff"   },
  { org:"Schools",           n:12,  role:"Teaching / Admin"         },
  { org:"Colleges",          n:19,  role:"Faculty / Admin"          },
  { org:"IT Industry",       n:124, role:"Software / Support Eng."  },
  { org:"Hardware Industry", n:22,  role:"Technician / Engineer"    },
  { org:"Service Sector",    n:232, role:"Customer Support / Ops"   },
  { org:"Banks",             n:34,  role:"HR Manager / Executive"   },
];
const QUALS = [
  { label:"SSC",          from:"#F43F5E", to:"#E11D48" },
  { label:"ITI",          from:"#F59E0B", to:"#D97706" },
  { label:"Diploma",      from:"#10B981", to:"#059669" },
  { label:"Intermediate", from:"#3B82F6", to:"#2563EB" },
  { label:"Degree",       from:"#8B5CF6", to:"#7C3AED" },
  { label:"PG",           from:"#0EA5E9", to:"#0284C7" },
];

const ROW_H   = 54;
const PAGE_SZ = 5;
const TABLE_H = ROW_H * PAGE_SZ;
const MAX_V   = Math.max(...JOBS.map(j => j.n));

const tier = n =>
  n >= 100 ? { a:"#2563EB", b:"#1D4ED8", txt:"#fff", glow:"rgba(37,99,235,0.30)", bar:"#3B82F6" }
: n >=  30 ? { a:"#0EA5E9", b:"#0284C7", txt:"#fff", glow:"rgba(14,165,233,0.28)", bar:"#0EA5E9" }
:            { a:"#6366F1", b:"#4F46E5", txt:"#fff", glow:"rgba(99,102,241,0.25)", bar:"#818CF8" };

const SortIco = ({ on, dir }) =>
  !on ? <ChevronsUpDown style={{width:11,height:11,color:"#93C5FD",flexShrink:0}}/>
: dir === "asc"
  ? <ChevronUp   style={{width:11,height:11,color:"#2563EB",flexShrink:0}}/>
  : <ChevronDown style={{width:11,height:11,color:"#2563EB",flexShrink:0}}/>;

/* card shadow */
const cardShadow = "0 1px 3px rgba(37,99,235,0.06), 0 8px 24px rgba(37,99,235,0.10), 0 1px 0 rgba(255,255,255,0.9) inset";

/* ═══════════════════════ JOB GRID ══════════════════════════ */
function JobGrid() {
  const [q,   setQ]  = useState("");
  const [pg,  setPg] = useState(0);
  const [srt, setSrt]= useState({ k:null, d:"asc" });

  const filt = JOBS.filter(r => {
    const lq = q.toLowerCase();
    return r.org.toLowerCase().includes(lq) || r.role.toLowerCase().includes(lq) || String(r.n).includes(lq);
  });
  const srtd = [...filt].sort((a,b) => {
    if (!srt.k) return 0;
    const A=a[srt.k], B=b[srt.k];
    return typeof A === "number"
      ? srt.d==="asc" ? A-B : B-A
      : srt.d==="asc" ? String(A).localeCompare(String(B)) : String(B).localeCompare(String(A));
  });

  const totPg = Math.max(1, Math.ceil(srtd.length / PAGE_SZ));
  const sp    = Math.min(pg, totPg-1);
  const rows  = srtd.slice(sp*PAGE_SZ, (sp+1)*PAGE_SZ);
  const pad   = [...rows, ...Array(PAGE_SZ - rows.length).fill(null)];

  const flip = k => { setSrt(p => p.k===k ? {k,d:p.d==="asc"?"desc":"asc"} : {k,d:"asc"}); setPg(0); };
  const cols = [
    { lbl:"Organization", k:"org",  w:"37%" },
    { lbl:"Openings",     k:"n",    w:"21%" },
    { lbl:"Role",         k:"role", w:"42%" },
  ];

  return (
    <div style={{
      borderRadius:20, overflow:"hidden", background:"#FFFFFF",
      border:"1px solid #BFDBFE",
      boxShadow: cardShadow,
    }}>

      {/* ── hero header ── */}
      <div style={{
        background:"linear-gradient(135deg,#1D4ED8 0%,#2563EB 50%,#3B82F6 100%)",
        padding:"18px 20px", position:"relative", overflow:"hidden",
      }}>
        {/* gloss sheen */}
        <div style={{position:"absolute",inset:0,
          background:"linear-gradient(135deg,rgba(255,255,255,0.22) 0%,rgba(255,255,255,0.05) 50%,transparent 100%)",
          pointerEvents:"none"}}/>
        {/* decorative circles */}
        <div style={{position:"absolute",right:-30,top:-30,width:120,height:120,borderRadius:"50%",
          background:"rgba(255,255,255,0.08)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",right:60,bottom:-35,width:80,height:80,borderRadius:"50%",
          background:"rgba(255,255,255,0.06)",pointerEvents:"none"}}/>

        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative"}}>
          {/* title */}
          <div style={{display:"flex",alignItems:"center",gap:13}}>
            <div style={{
              width:42,height:42,borderRadius:13,
              background:"rgba(255,255,255,0.2)",
              border:"1px solid rgba(255,255,255,0.4)",
              backdropFilter:"blur(8px)",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 4px 12px rgba(0,0,0,0.15),inset 0 1px 0 rgba(255,255,255,0.3)",
            }}>
              <Briefcase style={{width:18,height:18,color:"#fff"}}/>
            </div>
            <div>
              <p style={{margin:0,fontSize:15,fontWeight:700,color:"#fff",letterSpacing:"-0.3px"}}>Live Job Board</p>
              <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.72)"}}>
                <Zap style={{width:9,height:9,display:"inline",marginRight:3,verticalAlign:"middle"}}/>
                {filt.length} active listings
              </p>
            </div>
          </div>

          {/* search */}
          <div style={{position:"relative",width:230}}>
            <Search style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",
              width:13,height:13,color:"rgba(255,255,255,0.6)"}}/>
            <input type="text" placeholder="Search roles…" value={q}
              onChange={e=>{setQ(e.target.value);setPg(0);}}
              style={{
                width:"100%",paddingLeft:30,paddingRight:q?28:12,paddingTop:8,paddingBottom:8,
                fontSize:12.5,background:"rgba(255,255,255,0.18)",
                border:"1px solid rgba(255,255,255,0.35)",borderRadius:10,
                outline:"none",color:"#fff",boxSizing:"border-box",transition:"all 0.2s",
              }}
              onFocus={e=>{e.target.style.background="rgba(255,255,255,0.28)";e.target.style.borderColor="rgba(255,255,255,0.7)";}}
              onBlur={e=>{e.target.style.background="rgba(255,255,255,0.18)";e.target.style.borderColor="rgba(255,255,255,0.35)";}}
            />
            {q && <button onClick={()=>{setQ("");setPg(0);}}
              style={{position:"absolute",right:9,top:"50%",transform:"translateY(-50%)",
                background:"none",border:"none",cursor:"pointer",padding:0,color:"rgba(255,255,255,0.7)"}}>
              <X style={{width:12,height:12}}/>
            </button>}
          </div>
        </div>
      </div>

      {/* ── column headers ── */}
      <div style={{display:"flex",background:"#EFF6FF",borderBottom:"1.5px solid #BFDBFE"}}>
        {cols.map(c => (
          <button key={c.k} onClick={()=>flip(c.k)}
            style={{
              width:c.w,display:"flex",alignItems:"center",gap:5,
              padding:"11px 16px",background:"transparent",border:"none",cursor:"pointer",
              fontSize:10.5,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",
              color:"#3B82F6",transition:"all 0.15s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.background="#DBEAFE";e.currentTarget.style.color="#1D4ED8";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#3B82F6";}}>
            {c.lbl}<SortIco on={srt.k===c.k} dir={srt.d}/>
          </button>
        ))}
      </div>

      {/* ── fixed-height body ── */}
      <div style={{height:TABLE_H,overflow:"hidden"}}>
        {pad.map((row, i) => {
          const even = i % 2 === 0;
          if (!row) return (
            <div key={`p${i}`} style={{
              height:ROW_H,display:"flex",
              background: even ? "#FFFFFF" : "#F8FBFF",
              borderBottom:"1px solid #F0F7FF",
            }}/>
          );
          const t = tier(row.n);
          return (
            <div key={i} style={{
              height:ROW_H,display:"flex",alignItems:"center",
              background: even ? "#FFFFFF" : "#F8FBFF",
              borderBottom:"1px solid #EFF6FF",
              cursor:"pointer",transition:"background 0.15s",
            }}
            onMouseEnter={e=>e.currentTarget.style.background="#EFF6FF"}
            onMouseLeave={e=>e.currentTarget.style.background=even?"#FFFFFF":"#F8FBFF"}>

              {/* org */}
              <div style={{width:"37%",padding:"0 16px",display:"flex",alignItems:"center",gap:10}}>
                <div style={{
                  width:30,height:30,borderRadius:9,flexShrink:0,
                  background:"linear-gradient(135deg,#DBEAFE,#BFDBFE)",
                  border:"1px solid #93C5FD",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  boxShadow:"inset 0 1px 0 rgba(255,255,255,0.8)",
                }}>
                  <Building2 style={{width:13,height:13,color:"#2563EB"}}/>
                </div>
                <span style={{fontSize:13,fontWeight:600,color:"#1E3A5F",
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {row.org}
                </span>
              </div>

              {/* vacancies */}
              <div style={{width:"21%",padding:"0 16px"}}>
                <span style={{
                  display:"inline-block",padding:"3px 11px",borderRadius:99,
                  fontSize:11.5,fontWeight:700,
                  background:`linear-gradient(135deg,${t.a},${t.b})`,
                  color:t.txt,boxShadow:`0 2px 10px ${t.glow}`,letterSpacing:"0.02em",
                }}>
                  {row.n}
                </span>
                <div style={{height:3,background:"#DBEAFE",borderRadius:99,marginTop:6,width:"78%",overflow:"hidden"}}>
                  <div style={{
                    height:"100%",borderRadius:99,
                    background:`linear-gradient(90deg,${t.a},${t.bar})`,
                    width:`${(row.n/MAX_V)*100}%`,
                    transition:"width 0.4s ease",
                  }}/>
                </div>
              </div>

              {/* role */}
              <div style={{width:"42%",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:13,color:"#64748B",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {row.role}
                </span>
                <ArrowRight style={{width:13,height:13,color:"#93C5FD",flexShrink:0}}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── pagination ── */}
      <div style={{
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"10px 20px",background:"#EFF6FF",
        borderTop:"1.5px solid #BFDBFE",
      }}>
        <p style={{margin:0,fontSize:12,color:"#64748B"}}>
          Showing{" "}
          <span style={{fontWeight:700,color:"#2563EB"}}>
            {srtd.length===0?0:sp*PAGE_SZ+1}–{Math.min((sp+1)*PAGE_SZ,srtd.length)}
          </span>
          {" of "}
          <span style={{fontWeight:700,color:"#334155"}}>{srtd.length}</span>
        </p>

        <div style={{display:"flex",alignItems:"center",gap:5}}>
          {/* prev */}
          <button disabled={sp===0} onClick={()=>setPg(p=>p-1)}
            style={{
              width:30,height:30,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",
              background:sp===0?"#F1F5F9":"#FFFFFF",
              border:"1.5px solid",borderColor:sp===0?"#E2E8F0":"#BFDBFE",
              cursor:sp===0?"not-allowed":"pointer",opacity:sp===0?0.4:1,
              boxShadow:sp===0?"none":"0 1px 4px rgba(37,99,235,0.10)",
              transition:"all 0.15s",
            }}
            onMouseEnter={e=>sp!==0&&(e.currentTarget.style.background="#DBEAFE")}
            onMouseLeave={e=>{e.currentTarget.style.background=sp===0?"#F1F5F9":"#FFFFFF";}}>
            <ChevronLeft style={{width:14,height:14,color:"#2563EB"}}/>
          </button>

          {/* page numbers */}
          {Array.from({length:totPg},(_,n)=>(
            <button key={n} onClick={()=>setPg(n)}
              style={{
                width:30,height:30,borderRadius:9,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:12,fontWeight:700,cursor:"pointer",transition:"all 0.15s",
                background: n===sp ? "linear-gradient(135deg,#2563EB,#3B82F6)" : "#FFFFFF",
                border: n===sp ? "1.5px solid #2563EB" : "1.5px solid #BFDBFE",
                color: n===sp ? "#fff" : "#3B82F6",
                boxShadow: n===sp ? "0 3px 10px rgba(37,99,235,0.35)" : "0 1px 3px rgba(37,99,235,0.08)",
              }}>
              {n+1}
            </button>
          ))}

          {/* next */}
          <button disabled={sp>=totPg-1} onClick={()=>setPg(p=>p+1)}
            style={{
              width:30,height:30,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",
              background:sp>=totPg-1?"#F1F5F9":"#FFFFFF",
              border:"1.5px solid",borderColor:sp>=totPg-1?"#E2E8F0":"#BFDBFE",
              cursor:sp>=totPg-1?"not-allowed":"pointer",opacity:sp>=totPg-1?0.4:1,
              boxShadow:sp>=totPg-1?"none":"0 1px 4px rgba(37,99,235,0.10)",
              transition:"all 0.15s",
            }}
            onMouseEnter={e=>sp<totPg-1&&(e.currentTarget.style.background="#DBEAFE")}
            onMouseLeave={e=>{e.currentTarget.style.background=sp>=totPg-1?"#F1F5F9":"#FFFFFF";}}>
            <ChevronRight style={{width:14,height:14,color:"#2563EB"}}/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ LOGIN CARD ════════════════════════ */
function LoginCard({ title, sub, gradA, gradB, accentBorder, accentBg, accentText, btnGlow, fields }) {
  const [v, setV] = useState(["", ""]);
  return (
    <div style={{
      borderRadius:20,overflow:"hidden",background:"#FFFFFF",
      border:`1px solid ${accentBorder}`,
      boxShadow: cardShadow,
    }}>
      {/* gradient header */}
      <div style={{
        background:`linear-gradient(135deg,${gradA},${gradB})`,
        padding:"20px 18px 17px",position:"relative",overflow:"hidden",
      }}>
        <div style={{position:"absolute",inset:0,
          background:"linear-gradient(135deg,rgba(255,255,255,0.22) 0%,rgba(255,255,255,0.04) 60%,transparent 100%)",
          pointerEvents:"none"}}/>
        <div style={{position:"absolute",right:-18,top:-18,width:80,height:80,borderRadius:"50%",
          background:"rgba(255,255,255,0.10)",pointerEvents:"none"}}/>
        <div style={{
          width:38,height:38,borderRadius:12,marginBottom:12,
          background:"rgba(255,255,255,0.22)",border:"1px solid rgba(255,255,255,0.45)",
          backdropFilter:"blur(8px)",
          display:"flex",alignItems:"center",justifyContent:"center",position:"relative",
          boxShadow:"0 3px 10px rgba(0,0,0,0.12),inset 0 1px 0 rgba(255,255,255,0.35)",
        }}>
          <LogIn style={{width:16,height:16,color:"#fff"}}/>
        </div>
        <p style={{margin:0,fontSize:14,fontWeight:700,color:"#fff",letterSpacing:"-0.2px",position:"relative"}}>
          {title}
        </p>
        <p style={{margin:"3px 0 0",fontSize:11,color:"rgba(255,255,255,0.72)",position:"relative"}}>{sub}</p>
      </div>

      {/* body */}
      <div style={{padding:"18px 16px 20px",display:"flex",flexDirection:"column",gap:10}}>
        {fields.map((f,i) => (
          <input key={i} type={f.t} placeholder={f.ph} value={v[i]}
            onChange={e=>setV(x=>x.map((c,j)=>j===i?e.target.value:c))}
            style={{
              width:"100%",padding:"9px 13px",fontSize:13,boxSizing:"border-box",
              background:"#F8FBFF",border:"1.5px solid #BFDBFE",
              borderRadius:10,outline:"none",color:"#1E3A5F",transition:"all 0.2s",
            }}
            onFocus={e=>{e.target.style.borderColor=gradA;e.target.style.background="#EFF6FF";e.target.style.boxShadow=`0 0 0 3px ${accentBg}`;}}
            onBlur={e=>{e.target.style.borderColor="#BFDBFE";e.target.style.background="#F8FBFF";e.target.style.boxShadow="none";}}
          />
        ))}

        {/* glossy CTA */}
        <button style={{
          width:"100%",padding:"10px",marginTop:2,
          background:`linear-gradient(135deg,${gradA},${gradB})`,
          color:"#fff",fontWeight:700,fontSize:13,
          border:"none",borderRadius:11,cursor:"pointer",
          position:"relative",overflow:"hidden",
          boxShadow:`0 4px 16px ${btnGlow}`,
          transition:"transform 0.15s,box-shadow 0.15s",
        }}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1.5px)";e.currentTarget.style.boxShadow=`0 8px 22px ${btnGlow}`;}}
        onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=`0 4px 16px ${btnGlow}`;}}
        onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"}
        onMouseUp={e=>e.currentTarget.style.transform="translateY(-1.5px)"}>
          <div style={{position:"absolute",inset:0,
            background:"linear-gradient(135deg,rgba(255,255,255,0.2) 0%,transparent 60%)",pointerEvents:"none"}}/>
          <span style={{position:"relative"}}>Sign In →</span>
        </button>

        <p style={{
          margin:"4px 0 0",fontSize:10.5,color:"#94A3B8",lineHeight:1.6,
          borderTop:"1px solid #EFF6FF",paddingTop:10,
        }}>
          {fields[0].note}
        </p>
      </div>
    </div>
  );
}

/* ═════════════════════════ ROOT ════════════════════════════ */
export default function Index() {
  return (
    <div style={{
      minHeight:"100vh",fontFamily:"'Inter',system-ui,sans-serif",
      background:"linear-gradient(160deg,#EFF6FF 0%,#DBEAFE 35%,#EFF6FF 65%,#F0F9FF 100%)",
      position:"relative",
    }}>
      {/* subtle ambient blobs */}
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",width:700,height:500,borderRadius:"50%",top:-200,left:-200,
          background:"radial-gradient(ellipse,rgba(147,197,253,0.35) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",bottom:-150,right:-100,
          background:"radial-gradient(ellipse,rgba(186,230,253,0.40) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",top:"30%",right:"15%",
          background:"radial-gradient(ellipse,rgba(219,234,254,0.50) 0%,transparent 70%)"}}/>
      </div>

      <div style={{position:"relative",zIndex:1}}>

        {/* ════ HEADER ════ */}
        <header style={{
          background:"rgba(255,255,255,0.82)",
          backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
          borderBottom:"1px solid #BFDBFE",
          boxShadow:"0 2px 20px rgba(37,99,235,0.09)",
        }}>
          <div style={{maxWidth:1300,margin:"0 auto",padding:"13px 28px",
            display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>

            {/* logo */}
            <div style={{display:"flex",alignItems:"center",gap:13,flexShrink:0}}>
              <div style={{
                width:46,height:46,borderRadius:15,position:"relative",overflow:"hidden",
                background:"linear-gradient(135deg,#2563EB,#1D4ED8)",
                boxShadow:"0 0 0 1px rgba(37,99,235,0.3),0 6px 18px rgba(37,99,235,0.35),inset 0 1px 0 rgba(255,255,255,0.25)",
              }}>
                <div style={{position:"absolute",inset:0,
                  background:"linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 60%)"}}/>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{color:"#fff",fontWeight:800,fontSize:17,letterSpacing:"-0.5px"}}>HR</span>
                </div>
              </div>
              <div>
                <p style={{margin:0,fontSize:9.5,color:"#3B82F6",fontWeight:800,
                  letterSpacing:"0.17em",textTransform:"uppercase"}}>Connect Portal</p>
                <p style={{margin:0,fontSize:16,color:"#1E3A5F",fontWeight:800,letterSpacing:"-0.4px"}}>HR Network</p>
              </div>
            </div>

            <div style={{width:1,height:34,background:"#BFDBFE",flexShrink:0}}/>

            {/* tabs */}
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {TABS.map((t,i) => (
                <button key={i} style={{
                  padding:"5px 14px",fontSize:11.5,fontWeight:600,
                  color:"#2563EB",background:"rgba(219,234,254,0.7)",
                  border:"1px solid #93C5FD",borderRadius:99,cursor:"pointer",
                  boxShadow:"inset 0 1px 0 rgba(255,255,255,0.8)",
                  transition:"all 0.15s",
                }}
                onMouseEnter={e=>{e.currentTarget.style.background="#BFDBFE";e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 2px 8px rgba(37,99,235,0.15),inset 0 1px 0 rgba(255,255,255,0.8)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(219,234,254,0.7)";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="inset 0 1px 0 rgba(255,255,255,0.8)";}}>
                  {t}
                </button>
              ))}
            </div>

{/* live dot — animated */}
<div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:7,flexShrink:0,
  background:"rgba(220,252,231,0.7)",border:"1px solid #86EFAC",
  padding:"4px 10px 4px 7px",borderRadius:99,
  boxShadow:"0 1px 6px rgba(34,197,94,0.12)",
}}>
  {/* pulsing rings */}
  <div style={{position:"relative",width:10,height:10,flexShrink:0}}>
    <div style={{
      position:"absolute",inset:0,borderRadius:"50%",background:"#22C55E",
      animation:"livePulse 1.6s ease-out infinite",
    }}/>
    <div style={{
      position:"absolute",inset:0,borderRadius:"50%",background:"#22C55E",
      animation:"livePulse 1.6s ease-out infinite 0.5s",
    }}/>
    <div style={{
      position:"absolute",inset:"2px",borderRadius:"50%",background:"#16A34A",
      boxShadow:"0 0 4px rgba(22,163,74,0.6)",
    }}/>
  </div>
  <span style={{fontSize:10.5,color:"#15803D",fontWeight:800,letterSpacing:"0.1em"}}>LIVE</span>
  <style>{`
    @keyframes livePulse {
      0%   { transform: scale(1);   opacity: 0.8; }
      70%  { transform: scale(2.4); opacity: 0;   }
      100% { transform: scale(2.4); opacity: 0;   }
    }
  `}</style>
</div>
          </div>
        </header>

        {/* ════ NAVBAR ════ */}
        <nav style={{
          background:"rgba(255,255,255,0.75)",
          backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",
          borderBottom:"1px solid #DBEAFE",
        }}>
          <div style={{maxWidth:1300,margin:"0 auto",padding:"5px 28px",display:"flex",flexWrap:"wrap",gap:2}}>
            {NAV.map((lk,i) => (
              <a key={i} href="#" style={{
                padding:"6px 13px",fontSize:10.5,fontWeight:700,
                color:"#3B82F6",letterSpacing:"0.06em",
                textDecoration:"none",borderRadius:8,textTransform:"uppercase",
                transition:"all 0.15s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.background="#DBEAFE";e.currentTarget.style.color="#1D4ED8";}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#3B82F6";}}>
                {lk}
              </a>
            ))}
          </div>
        </nav>

        {/* ════ MAIN GRID ════ */}
        <main style={{
          maxWidth:1300,margin:"0 auto",padding:"26px 28px",
          display:"grid",gridTemplateColumns:"1fr 1fr 3fr",gap:22,alignItems:"start",
        }}>
          <LoginCard
            title="Authorised HR Login"
            sub="Access your HR dashboard"
            gradA="#1D4ED8" gradB="#3B82F6"
            accentBorder="#BFDBFE" accentBg="rgba(219,234,254,0.5)" accentText="#1D4ED8"
            btnGlow="rgba(37,99,235,0.40)"
            fields={[
              {t:"text",     ph:"HR ID No.",      note:"Declaration Form & Security Insurance ECS required for activation."},
              {t:"password", ph:"Password",        note:""},
            ]}
          />
          <LoginCard
            title="Employer Login"
            sub="Post staff requirements"
            gradA="#0284C7" gradB="#0EA5E9"
            accentBorder="#BAE6FD" accentBg="rgba(186,230,253,0.45)" accentText="#0284C7"
            btnGlow="rgba(14,165,233,0.40)"
            fields={[
              {t:"text",     ph:"Employer ID No.", note:"Organization Profile required. Terms & conditions apply."},
              {t:"password", ph:"Password",         note:""},
            ]}
          />
          <JobGrid/>
        </main>

        {/* ════ FOOTER ════ */}
        <footer style={{maxWidth:1300,margin:"0 auto",padding:"0 28px 36px"}}>
          <div style={{
            borderRadius:22,padding:"22px 28px",
            display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:20,
            background:"rgba(255,255,255,0.82)",
            backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
            border:"1px solid #BFDBFE",
            boxShadow:"0 4px 24px rgba(37,99,235,0.09),inset 0 1px 0 rgba(255,255,255,0.9)",
          }}>

            {/* qual folders */}
            <div>
              <p style={{margin:"0 0 12px",fontSize:10,fontWeight:800,color:"#93C5FD",
                letterSpacing:"0.1em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:6}}>
                <GraduationCap style={{width:12,height:12,color:"#3B82F6"}}/>
                Qualification-wise Data Folders
              </p>
              <div style={{display:"flex",gap:11,alignItems:"flex-end",flexWrap:"wrap"}}>
                {QUALS.map((q,i) => (
                  <button key={i} style={{background:"none",border:"none",cursor:"pointer",padding:0}}>
                    <div style={{
                      width:60,height:60,borderRadius:14,
                      background:`linear-gradient(135deg,${q.from},${q.to})`,
                      boxShadow:`0 4px 14px ${q.from}44,inset 0 1px 0 rgba(255,255,255,0.25)`,
                      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,
                      position:"relative",overflow:"hidden",
                      transition:"transform 0.2s,box-shadow 0.2s",
                    }}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px) scale(1.07)";e.currentTarget.style.boxShadow=`0 10px 22px ${q.from}55`;}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=`0 4px 14px ${q.from}44`;}}>
                      <div style={{position:"absolute",inset:0,
                        background:"linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 60%)"}}/>
                      <Mail style={{width:16,height:16,color:"#fff",position:"relative",flexShrink:0}}/>
                      <span style={{
                        fontSize:9,fontWeight:800,color:"#fff",position:"relative",
                        letterSpacing:"0.03em",textAlign:"center",lineHeight:1,
                        textShadow:"0 1px 3px rgba(0,0,0,0.25)",padding:"0 4px",
                      }}>{q.label}</span>
                    </div>
                  </button>
                ))}
                <ChevronRight style={{width:15,height:15,color:"#93C5FD",opacity:0.7,
                  alignSelf:"flex-start",marginTop:14}}/>
              </div>
            </div>

            {/* divider */}
            <div style={{width:1,height:64,background:"#DBEAFE",flexShrink:0}}/>

            {/* action links */}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[
                {lbl:"HR Login for New Membership", col:"#2563EB", bg:"#EFF6FF",  border:"#BFDBFE"},
                {lbl:"Admin Login",                 col:"#64748B", bg:"#F8FAFC",  border:"#E2E8F0"},
              ].map((l,i) => (
                <a key={i} href="#" style={{
                  display:"flex",alignItems:"center",gap:8,textDecoration:"none",
                  fontSize:12.5,fontWeight:700,color:l.col,
                  padding:"8px 16px",borderRadius:11,
                  background:l.bg,border:`1.5px solid ${l.border}`,
                  boxSizing:"border-box",transition:"all 0.15s",
                  boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateX(4px)";e.currentTarget.style.boxShadow="0 4px 12px rgba(37,99,235,0.14)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.05)";}}>
                  <ArrowRight style={{width:13,height:13,flexShrink:0}}/>
                  {l.lbl}
                  <ArrowRight style={{width:12,height:12,marginLeft:"auto",opacity:0.4}}/>
                </a>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}