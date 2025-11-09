import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Star,
  BarChart2,
  Sparkles,
  Palette,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import ProfileBar from "./ProfileBar";
import { getUser, ensureUserRanking, loadData, saveData } from "./cloud";
import { supabase } from "./supabaseClient"; // ← must be up here

/* -------------------- CONSTANTS / HELPERS (OUTSIDE COMPONENT) -------------------- */

/* -------------------- SCHOOL BANK -------------------- */
const DENTAL_SCHOOLS = [
  // Alabama
  { key: "uab", name: "University of Alabama School of Dentistry", city: "Birmingham", state: "AL" },

  // Arizona
  { key: "atsu-az", name: "Arizona School of Dentistry & Oral Health (ATSU)", city: "Mesa", state: "AZ" },
  { key: "midwestern-az", name: "Midwestern University College of Dental Medicine–Arizona", city: "Glendale", state: "AZ" },

  // Arkansas
  { key: "lyon", name: "Lyon College School of Dental Medicine", city: "Batesville", state: "AR", note: "opening July 2025" },

  // California
  { key: "cnsu", name: "California Northstate University College of Dental Medicine", city: "Elk Grove", state: "CA" },
  { key: "usc", name: "Herman Ostrow School of Dentistry of USC", city: "Los Angeles", state: "CA" },
  { key: "loma-linda", name: "Loma Linda University School of Dentistry", city: "Loma Linda", state: "CA" },
  { key: "ucla", name: "University of California, Los Angeles School of Dentistry", city: "Los Angeles", state: "CA" },
  { key: "ucsf", name: "University of California, San Francisco School of Dentistry", city: "San Francisco", state: "CA" },
  { key: "pacific-dugoni", name: "University of the Pacific Arthur A. Dugoni School of Dentistry", city: "San Francisco", state: "CA" },
  { key: "westernu", name: "Western University of Health Sciences College of Dental Medicine", city: "Pomona", state: "CA" },

  // Colorado
  { key: "cu", name: "University of Colorado School of Dental Medicine", city: "Aurora", state: "CO" },

  // Connecticut
  { key: "uconn", name: "University of Connecticut School of Dental Medicine", city: "Farmington", state: "CT" },

  // District of Columbia
  { key: "howard", name: "Howard University College of Dentistry", city: "Washington", state: "DC" },

  // Florida
  { key: "lecom", name: "LECOM School of Dental Medicine", city: "Bradenton", state: "FL" },
  { key: "nova", name: "Nova Southeastern University College of Dental Medicine", city: "Ft. Lauderdale", state: "FL" },
  { key: "uf", name: "University of Florida College of Dentistry", city: "Gainesville", state: "FL" },

  // Georgia
  { key: "augusta", name: "The Dental College of Georgia at Augusta University", city: "Augusta", state: "GA" },

  // Illinois
  { key: "uic", name: "University of Illinois Chicago College of Dentistry", city: "Chicago", state: "IL" },
  { key: "midwestern-il", name: "Midwestern University College of Dental Medicine–Illinois", city: "Downers Grove", state: "IL" },
  { key: "siu", name: "Southern Illinois University School of Dental Medicine", city: "Alton", state: "IL" },

  // Indiana
  { key: "iu", name: "Indiana University School of Dentistry", city: "Indianapolis", state: "IN" },

  // Iowa
  { key: "uiowa", name: "The University of Iowa College of Dentistry and Dental Clinics", city: "Iowa City", state: "IA" },

  // Kentucky
  { key: "uky", name: "University of Kentucky College of Dentistry", city: "Lexington", state: "KY" },
  { key: "ul", name: "University of Louisville School of Dentistry", city: "Louisville", state: "KY" },

  // Louisiana
  { key: "lsu", name: "Louisiana State University Health Sciences Center School of Dentistry", city: "New Orleans", state: "LA" },

  // Maine
  { key: "une", name: "University of New England College of Dental Medicine", city: "Portland", state: "ME" },

  // Maryland
  { key: "umaryland", name: "University of Maryland School of Dentistry", city: "Baltimore", state: "MD" },

  // Massachusetts
  { key: "bu", name: "Boston University Henry M. Goldman School of Dental Medicine", city: "Boston", state: "MA" },
  { key: "harvard", name: "Harvard School of Dental Medicine", city: "Boston", state: "MA" },
  { key: "tufts", name: "Tufts University School of Dental Medicine", city: "Boston", state: "MA" },

  // Michigan
  { key: "udm", name: "University of Detroit Mercy School of Dentistry", city: "Detroit", state: "MI" },
  { key: "umich", name: "University of Michigan School of Dentistry", city: "Ann Arbor", state: "MI" },

  // Minnesota
  { key: "umn", name: "University of Minnesota School of Dentistry", city: "Minneapolis", state: "MN" },

  // Mississippi
  { key: "umc", name: "University of Mississippi Medical Center School of Dentistry", city: "Jackson", state: "MS" },

  // Missouri
  { key: "kcu", name: "Kansas City University College of Dental Medicine", city: "Joplin", state: "MO" },
  { key: "atsu-mo", name: "Missouri School of Dentistry & Oral Health (ATSU)", city: "Kirksville", state: "MO" },
  { key: "umkc", name: "University of Missouri–Kansas City School of Dentistry", city: "Kansas City", state: "MO" },

  // Nebraska
  { key: "creighton", name: "Creighton University School of Dentistry", city: "Omaha", state: "NE" },
  { key: "unmc", name: "University of Nebraska Medical Center College of Dentistry", city: "Lincoln", state: "NE" },

  // Nevada
  { key: "unlv", name: "University of Nevada, Las Vegas School of Dental Medicine", city: "Las Vegas", state: "NV" },

  // New Jersey
  { key: "rutgers", name: "Rutgers School of Dental Medicine", city: "Newark", state: "NJ" },

  // New York
  { key: "columbia", name: "Columbia University College of Dental Medicine", city: "New York", state: "NY" },
  { key: "nyu", name: "New York University College of Dentistry", city: "New York", state: "NY" },
  { key: "stony-brook", name: "Stony Brook University School of Dental Medicine", city: "Stony Brook", state: "NY" },
  { key: "touro", name: "Touro College of Dental Medicine at New York Medical College", city: "Hawthorne", state: "NY" },
  { key: "buffalo", name: "University at Buffalo School of Dental Medicine", city: "Buffalo", state: "NY" },

  // North Carolina
  { key: "ecu", name: "East Carolina University School of Dental Medicine", city: "Greenville", state: "NC" },
  { key: "hpu", name: "High Point University School of Dental Medicine and Oral Health", city: "High Point", state: "NC" },
  { key: "unc", name: "University of North Carolina Chapel Hill School of Dentistry", city: "Chapel Hill", state: "NC" },

  // Ohio
  { key: "cwr", name: "Case Western Reserve University School of Dental Medicine", city: "Cleveland", state: "OH" },
  { key: "neomed", name: "Northeast Ohio Medical University Bitonte School of Dentistry", city: "Rootstown", state: "OH", note: "opening July 2025" },
  { key: "osu", name: "Ohio State University College of Dentistry", city: "Columbus", state: "OH" },

  // Oklahoma
  { key: "ou", name: "University of Oklahoma College of Dentistry", city: "Oklahoma City", state: "OK" },

  // Oregon
  { key: "ohsu", name: "Oregon Health & Science University School of Dentistry", city: "Portland", state: "OR" },

  // Pennsylvania
  { key: "penn", name: "University of Pennsylvania School of Dental Medicine", city: "Philadelphia", state: "PA" },
  { key: "pitt", name: "University of Pittsburgh School of Dental Medicine", city: "Pittsburgh", state: "PA" },
  { key: "temple", name: "Temple University Kornberg School of Dentistry", city: "Philadelphia", state: "PA" },

  // Puerto Rico
  { key: "upr", name: "University of Puerto Rico School of Dental Medicine", city: "San Juan", state: "PR" },
  { key: "uagm", name: "Universidad Ana G. Méndez School of Dental Medicine", city: "Gurabo", state: "PR" },
  { key: "ponce", name: "Ponce Health Sciences University School of Dental Medicine", city: "Ponce", state: "PR" },

  // South Carolina
  { key: "musc", name: "Medical University of South Carolina College of Dental Medicine", city: "Charleston", state: "SC" },

  // Tennessee
  { key: "lmu", name: "Lincoln Memorial University–College of Dental Medicine", city: "Knoxville", state: "TN" }, // add city if you want to fix
  { key: "meharry", name: "Meharry Medical College School of Dentistry", city: "Nashville", state: "TN" },
  { key: "uthsc", name: "University of Tennessee Health Science Center College of Dentistry", city: "Memphis", state: "TN" },

  // Texas
  { key: "tamudallas", name: "Texas A&M University College of Dentistry", city: "Dallas", state: "TX" },
  { key: "ttuhsc-elpaso", name: "Texas Tech University Health Sciences Center El Paso — Hunt School of Dentistry", city: "El Paso", state: "TX" },
  { key: "uth-houston", name: "University of Texas Health Science Center at Houston School of Dentistry", city: "Houston", state: "TX" },
  { key: "utsa", name: "University of Texas Health Science Center at San Antonio School of Dentistry", city: "San Antonio", state: "TX" },

  // Utah
  { key: "roseman", name: "Roseman University of Health Sciences College of Dental Medicine", city: "South Jordan", state: "UT" },
  { key: "utah", name: "University of Utah School of Dentistry", city: "Salt Lake City", state: "UT" },

  // Virginia
  { key: "vcu", name: "Virginia Commonwealth University School of Dentistry", city: "Richmond", state: "VA" },

  // Washington
  { key: "pnwu", name: "Pacific Northwest University School of Dental Medicine", city: "Yakima", state: "WA", note: "opening July 2025" },
  { key: "uw", name: "University of Washington School of Dentistry", city: "Seattle", state: "WA" },

  // West Virginia
  { key: "wvu", name: "West Virginia University School of Dentistry", city: "Morgantown", state: "WV" },

  // Wisconsin
  { key: "marquette", name: "Marquette University School of Dentistry", city: "Milwaukee", state: "WI" },
];


// pastel fallback
const pastelColors = [
  "#FDE68A",
  "#FBCFE8",
  "#BFDBFE",
  "#C7D2FE",
  "#A7F3D0",
  "#FCA5A5",
  "#E9D5FF",
  "#99F6E4",
  "#FDE2E4",
  "#FFD6A5",
];

// rainbow helpers
function rainbowColor(i, total, sat = 72, light = 60) {
  const hue = Math.round((360 * i) / Math.max(total, 1));
  return `hsl(${hue} ${sat}% ${light}%)`;
}
function rainbowAlpha(i, total, alpha = 0.15) {
  const hue = Math.round((360 * i) / Math.max(total, 1));
  return `hsla(${hue}, 80%, 60%, ${alpha})`;
}

// small utils
const makeId = () => Math.random().toString(36).slice(2, 9);
function shorten(str, n) {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}
function parseNumberOrNull(v) {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function safeKey(s) {
  return (
    String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 32) || `k_${makeId()}`
  );
}

// storage
const STORAGE_KEY = "dental-ranking-data-v1";

// master criteria
// this is your master list of criteria — neutral + generally applicable
const ALL_CRITERIA = [
  {
    key: "price",
    label: "Cost / COA",
    higherIsBetter: false,
    tip: "Total cost of attendance or best estimate. Lower is better.",
  },
  {
    key: "cityLike",
    label: "Location Fit",
    higherIsBetter: true,
    tip: "How much you'd actually want to live there (0–10).",
  },
  {
    key: "weatherWarmth",
    label: "Weather / Climate",
    higherIsBetter: true,
    tip: "Warmer / nicer weather scores higher.",
  },
  {
    key: "looks",
    label: "Campus / Facility Aesthetic",
    higherIsBetter: true,
    tip: "How nice the school, clinic, and facilities look to you.",
  },
  {
    key: "curriculum",
    label: "Curriculum / Schedule",
    higherIsBetter: true,
    tip: "Block vs traditional, P/F, exam spread, built-in study time.",
  },
  {
    key: "clinical",
    label: "Clinical Exposure",
    higherIsBetter: true,
    tip: "How early/often you get patients, rotations, and real cases.",
  },
  {
    key: "timeline",
    label: "Breaks / Academic Calendar",
    higherIsBetter: true,
    tip: "More breaks or better-distributed ones = higher score.",
  },
];


// what shows up for brand-new users
const CRITERIA_DEFAULT = [
  { key: "price", label: "Cost / COA", higherIsBetter: false, tip: "Lower is better." },
  { key: "cityLike", label: "Location Fit", higherIsBetter: true, tip: "Do I want to live here?" },
  { key: "weatherWarmth", label: "Weather / Climate", higherIsBetter: true, tip: "Nicer climate scores higher." },
  { key: "looks", label: "Campus / Facility Aesthetic", higherIsBetter: true, tip: "How good the school looks to you." },
  { key: "curriculum", label: "Curriculum / Schedule", higherIsBetter: true, tip: "Flexible, chill, or P/F → higher." },
  { key: "clinical", label: "Clinical Exposure", higherIsBetter: true, tip: "Earlier/more patients → higher." },
  { key: "timeline", label: "Breaks / Academic Calendar", higherIsBetter: true, tip: "More breaks → better." },
];


const defaultWeights = {
  price: 18,
  cityLike: 16,
  weatherWarmth: 8,
  looks: 10,
  curriculum: 14,
  clinical: 18,
  timeline: 8,
};


// normalization
function minMax(values) {
  const nums = values.filter((v) => typeof v === "number" && !Number.isNaN(v));
  if (nums.length === 0) return { scale: () => 50 };
  const mn = Math.min(...nums);
  const mx = Math.max(...nums);
  if (mn === mx) return { scale: () => 50 };
  return {
    scale: (v) =>
      v == null || Number.isNaN(Number(v)) ? 50 : ((Number(v) - mn) / (mx - mn)) * 100,
  };
}
function normalizeCriterion(rows, key, higherIsBetter) {
  const scaler = minMax(rows.map((r) => r[key]));
  return rows.map((r) => {
    const s = scaler.scale(r[key]);
    return higherIsBetter ? s : 100 - s;
  });
}

/* -------------------- LANDING -------------------- */

function AlignMyNextLanding({ onGuest, onSignIn }) {
  const [mode, setMode] = React.useState("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [forgotOpen, setForgotOpen] = React.useState(false); // ADD


  async function handleSignIn(e) {
    e?.preventDefault?.();
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data?.session?.user) {
      onSignIn?.({
        user: { id: data.session.user.id, email: data.session.user.email },
      });
    } else if (data?.user) {
      onSignIn?.({ user: { id: data.user.id, email: data.user.email } });
    }
  }

  async function handleSignUp(e) {
    e?.preventDefault?.();
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data?.user) {
      onSignIn?.({ user: { id: data.user.id, email: data.user.email } });
    }
  }

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-6
        bg-[radial-gradient(1200px_600px_at_0%_0%,#fff0,rgba(255,0,122,0.12)),radial-gradient(900px_600px_at_100%_0%,#fff0,rgba(0,255,150,0.12))]
        transition-all duration-300`}
    >
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/20 backdrop-blur-xl shadow-2xl p-6 md:p-8 space-y-6">
        {/* title */}
        <div className="text-center space-y-4">
  <h1 className="font-heading text-4xl font-extrabold tracking-tight rainbow-text">
    AlignMyNext
  </h1>


  <p className="text-sm rainbow-text">
    Where Data Meets Destiny
  </p>

 {/* Explainer — all bold */}
<div className="rounded-2xl border border-white/30 bg-white/25 backdrop-blur-md p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)] text-center">
  <p className="text-sm md:text-[12px] font-semibold text-slate-800 leading-relaxed">
    Rate dental schools, law schools, or medical schools based on your priorities and watch a live, weighted ranking update in real time.
  </p>

  <p className="text-center italic text-xs text-slate-500 mt-2">
    Create an account to save your progress!
    </p>
  </div>
</div>


        {/* tabs */}
        <div className="flex rounded-2xl bg-white/20 p-1 gap-1">
  <button
    onClick={() => { setMode("signin"); setError(""); }}
    className={`flex-1 py-2 rounded-xl text-sm font-medium ${
      mode === "signin" ? "bg-white/90 text-black" : "text-black"
    }`}
  >
    Sign in
  </button>
  <button
    onClick={() => { setMode("signup"); setError(""); }}
    className={`flex-1 py-2 rounded-xl text-sm font-medium ${
      mode === "signup" ? "bg-white/90 text-black" : "text-black"
    }`}
  >
    Create account
  </button>
  <button
    onClick={() => onGuest?.()}
    className="flex-1 py-2 rounded-xl text-sm font-medium text-black hover:bg-white/10"
  >
    Guest
  </button>
</div>

        {/* form */}
        <form
          onSubmit={mode === "signin" ? handleSignIn : handleSignUp}
          className="space-y-4"
        >
          <div>
            <label className="text-xs rainbow-text">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl px-3 py-2 bg-white/80 outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs rainbow-text">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl px-3 py-2 bg-white/80 outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="button"
            onClick={() => setForgotOpen(true)}
            className="text-xs text-slate-600 hover:underline"
          >
            Forgot your password?
          </button>

          {error && (
            <div className="text-xs text-rose-100 bg-rose-500/30 border border-rose-200/60 rounded-xl px-3 py-2">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl py-2.5 text-sm font-semibold text-white bg-[linear-gradient(90deg,#f97316,#ec4899,#6366f1)] hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? mode === "signin"
                ? "Signing in…"
                : "Creating account…"
              : mode === "signin"
              ? "Sign in"
              : "Create account"}
          </button>
        </form>

        <p className="text-[10px] rainbow-text text-center">
          Or continue as guest – data will be saved to this browser only.
        </p>
        {forgotOpen && <ForgotPasswordModal onClose={() => setForgotOpen(false)} />}
      </div>
    </div>
  );
}

/* -------------------- MAIN APP -------------------- */

export default function DentalRankingApp() {
  // 1. auth gate
  const [session, setSession] = useState(null);
  const [guestMode, setGuestMode] = useState(() => {
    return localStorage.getItem("AlignMyNext_guest") === "1";
  });

  function onSignedIn(sessionObj) {
    setSession(sessionObj);
    localStorage.removeItem("AlignMyNext_guest");
    setGuestMode(false);
  }

  function continueAsGuest() {
    localStorage.setItem("AlignMyNext_guest", "1");
    setGuestMode(true);
    setSession(null);
  }

  async function signOutEverywhere() {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("supabase signout failed (ok in guest):", e);
    }
    setSession(null);
    localStorage.removeItem("AlignMyNext_guest");
    setGuestMode(false);
  }

  // 2. core UI state
  const [schools, setSchools] = useState([]);
  const [weights, setWeights] = useState({});
  const [rainbowMode, setRainbowMode] = useState(true);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [criteria, setCriteria] = useState(ALL_CRITERIA);
  const [enabledCriteriaKeys, setEnabledCriteriaKeys] = useState([]);
  const [activeTab, setActiveTab] = useState("data");
  const [addOpen, setAddOpen] = useState(false);
  const [newCrit, setNewCrit] = useState({
    label: "",
    key: "",
    higherIsBetter: true,
    tip: "",
  });
  const [addError, setAddError] = useState("");
  const [raterOpen, setRaterOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  // NEW — dropdown picker for Add School
  const [addPickerOpen, setAddPickerOpen] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [selectedBankKey, setSelectedBankKey] = useState(DENTAL_SCHOOLS[0]?.key ?? null);
  const [selectedKeys, setSelectedKeys] = useState(new Set());



  // cloud
  const [user, setUser] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [saving, setSaving] = useState("idle");

  // 3. load
  useEffect(() => {
    let mounted = true;
    (async () => {
      const u = await getUser();
      if (!mounted) return;
      setUser(u);

      if (u) {
        const id = await ensureUserRanking(u.id);
        if (!mounted) return;
        setRecordId(id);

        const cloud = await loadData(id);
        if (!mounted) return;
        if (cloud) {
          if (Array.isArray(cloud.schools)) setSchools(cloud.schools);
          if (cloud.weights && typeof cloud.weights === "object")
            setWeights(cloud.weights);
          if (Array.isArray(cloud.enabledCriteriaKeys))
            setEnabledCriteriaKeys(cloud.enabledCriteriaKeys);
          if (typeof cloud.rainbowMode === "boolean")
            setRainbowMode(cloud.rainbowMode);
        }
      } else {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed.schools)) setSchools(parsed.schools);
            if (parsed.weights && typeof parsed.weights === "object")
              setWeights(parsed.weights);
            if (Array.isArray(parsed.enabledCriteriaKeys))
              setEnabledCriteriaKeys(parsed.enabledCriteriaKeys);
            if (typeof parsed.rainbowMode === "boolean")
              setRainbowMode(parsed.rainbowMode);
          }
        } catch (e) {
          console.warn("Local load failed", e);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 4. autosave
  useEffect(() => {
    const payload = { schools, weights, enabledCriteriaKeys, rainbowMode };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}

    if (!user || !recordId) return;

    setSaving("saving");
    const t = setTimeout(async () => {
      try {
        await saveData(recordId, payload);
        setSaving("saved");
        setTimeout(() => setSaving("idle"), 1200);
      } catch (e) {
        console.error(e);
        setSaving("idle");
      }
    }, 600);

    return () => clearTimeout(t);
  }, [user, recordId, schools, weights, enabledCriteriaKeys, rainbowMode]);

  // --- listen for password-recovery redirect from Supabase ---
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setResetOpen(true);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const h = window.location.hash || "";
    const q = window.location.search || "";
    if (h.includes("type=recovery") || q.includes("type=recovery") || window.location.pathname === "/reset") {
      setResetOpen(true);
    }
  }, []);

  // 5. derived
  const ACTIVE = useMemo(
    () => ALL_CRITERIA.filter((c) => enabledCriteriaKeys.includes(c.key)),
    [enabledCriteriaKeys]
  );

  const totalWeight = useMemo(
    () => ACTIVE.reduce((sum, c) => sum + Number(weights[c.key] || 0), 0),
    [weights, ACTIVE]
  );

  const rowsWithScores = useMemo(() => {
    if (!schools.length) return [];

    if (!ACTIVE.length) {
      return schools.map((s, i) => ({ ...s, composite: 0, rank: i + 1 }));
    }

    const norm = {};
    ACTIVE.forEach((c) => {
      norm[c.key] = normalizeCriterion(schools, c.key, c.higherIsBetter);
    });

    const denom = totalWeight || 1;

    const rows = schools.map((s, idx) => {
      let composite = 0;
      for (const c of ACTIVE) {
        const w = Number(weights[c.key] || 0);
        const sc = norm[c.key][idx] ?? 50;
        composite += (w / denom) * sc;
      }
      return { ...s, composite: Number(composite.toFixed(2)) };
    });

    rows.sort((a, b) => (b.composite ?? 0) - (a.composite ?? 0));
    return rows.map((r, i) => ({ ...r, rank: i + 1 }));
  }, [schools, weights, ACTIVE, totalWeight]);

  // 6. helpers
  function removeCriterion(key) {
    setCriteria((prev) => prev.filter((c) => c.key !== key));
    setWeights((w) => {
      const nw = { ...w };
      delete nw[key];
      return nw;
    });
  }
  function restoreDefaultCriteria() {
    setCriteria(CRITERIA_DEFAULT);
    setWeights({ ...defaultWeights });
  }
  function deleteSelected() {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected school(s)?`)) return;
    setSchools((prev) => prev.filter((s) => !selectedIds.has(s.id)));
    setSelectedIds(new Set());
  }
  const allSelected =
    rowsWithScores.length > 0 &&
    rowsWithScores.every((r) => selectedIds.has(r.id));

  const chartData = rowsWithScores.map((r) => ({
    name: `#${r.rank} ${shorten(r.name, 24)}`,
    score: r.composite,
  }));

  function toggleCriterionKey(key) {
    setEnabledCriteriaKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
    setWeights((w) => (w[key] == null ? { ...w, [key]: 10 } : w));
  }

  function removeEnabledCriterion(key) {
    setEnabledCriteriaKeys((prev) => prev.filter((k) => k !== key));
    setWeights((w) => {
      const { [key]: _drop, ...rest } = w;
      return rest;
    });
  }

  function updateField(sid, key, value) {
    setSchools((prev) =>
      prev.map((s) => (s.id === sid ? { ...s, [key]: value } : s))
    );
  }
  function addSchool() {
    setSchools((prev) => [
      ...prev,
      { id: makeId(), name: "New School", city: "", state: "", deadline: "" },
    ]);
  }

  
  function addSchoolFromBank(key) {
    const template = DENTAL_SCHOOLS.find(s => s.key === key);
    if (!template) return;

    // avoid duplicates by name
    const nameExists = schools.some(
      s => s.name.trim().toLowerCase() === template.name.trim().toLowerCase()
    );
    const id = makeId();

    setSchools(prev => [
      ...prev,
      {
        id,
        name: nameExists
          ? `${template.name} (${prev.filter(p => p.name.startsWith(template.name)).length + 1})`
          : template.name,
        city: template.city || "",
        state: template.state || "",
        deadline: template.deadline || "",
        // criteria fields stay empty so user fills them later
      },
    ]);
  }

  function toggleSelected(k) {
  setSelectedKeys(prev => {
    const s = new Set(prev);
    if (s.has(k)) s.delete(k);
    else s.add(k);
    return s;
  });
}

function addSelectedSchools(closeAfter = true) {
  if (selectedKeys.size === 0) return;
  [...selectedKeys].forEach(k => addSchoolFromBank(k));
  setSelectedKeys(new Set());
  if (closeAfter) setAddPickerOpen(false);
}

  function removeSchool(sid) {
    setSchools((prev) => prev.filter((s) => s.id !== sid));
  }

  function downloadFile(filename, text) {
    const a = document.createElement("a");
    a.href = "data:text/json;charset=utf-8," + encodeURIComponent(text);
    a.download = filename;
    a.click();
  }
  function exportJSON() {
    downloadFile(
      "dental-ranking-data.json",
      JSON.stringify({ schools, weights, criteria }, null, 2)
    );
  }
  function resetToDefaults() {
    if (!confirm("Reset to initial data?")) return;
    setSchools([]);
    setWeights({ ...defaultWeights });
    setCriteria(CRITERIA_DEFAULT);
  }
  function clearSaved() {
    localStorage.removeItem(STORAGE_KEY);
    alert("Saved copy cleared from this browser.");
  }
  function importJSON(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.schools) setSchools(parsed.schools);
        if (parsed.weights) setWeights(parsed.weights);
        if (parsed.criteria) setCriteria(parsed.criteria);
      } catch {
        alert("Could not parse file");
      }
    };
    reader.readAsText(file);
  }

  function addCriterionSubmit(e) {
    e?.preventDefault?.();
    setAddError("");
    const label = (newCrit.label || "").trim();
    if (!label) {
      setAddError("Label is required");
      return;
    }
    let key = newCrit.key.trim();
    if (!key) key = safeKey(label);
    key = safeKey(key);
    const reserved = new Set(["id", "name", "city", "state", "deadline"]);
    if (reserved.has(key)) {
      setAddError("That key is reserved. Try a different one.");
      return;
    }
    if (criteria.some((c) => c.key === key)) {
      setAddError("A criterion with that key already exists.");
      return;
    }
    const crit = {
      key,
      label,
      higherIsBetter: Boolean(newCrit.higherIsBetter),
      tip: newCrit.tip || "",
    };
    setCriteria((prev) => [...prev, crit]);
    setWeights((w) => ({ ...w, [key]: 0 }));
    setAddOpen(false);
    setNewCrit({ label: "", key: "", higherIsBetter: true, tip: "" });
  }

  const bgRainbow =
    "bg-[radial-gradient(1200px_600px_at_0%_0%,#fff0,rgba(255,0,122,0.12)),radial-gradient(900px_600px_at_100%_0%,#fff0,rgba(0,200,255,0.12)),radial-gradient(900px_600px_at_100%_100%,#fff0,rgba(0,255,150,0.12)),radial-gradient(900px_600px_at_0%_100%,#fff0,rgba(255,170,0,0.12))]";

  // 7. auth gate
if (!session && !guestMode) {
  return (
    <>
      <AlignMyNextLanding onGuest={continueAsGuest} onSignIn={onSignedIn} />
      {resetOpen && <ResetPasswordModal onClose={() => setResetOpen(false)} />}
    </>
  );
}


  // 8. MAIN RENDER (everything in one return)
  return (
    <div
      className={`min-h-screen p-4 md:p-8 space-y-6 ${
        rainbowMode
          ? bgRainbow
          : "bg-gradient-to-b from-rose-50 via-sky-50 to-violet-50"
      }`}
    >
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight flex items-center gap-2">
            <span className="bg-clip-text text-transparent bg-[conic-gradient(from_0deg_at_50%_50%,#ef4444,#f59e0b,#84cc16,#06b6d4,#8b5cf6,#ef4444)]">
              AlignMyNext
            </span>
            <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-fuchsia-500" />
          </h1>
          <p className="mt-1 text-sm md:text-base text-white/90 drop-shadow-[0_1px_1px_rgb(0_0_0_/_0.25)]">
            <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#f43f5e,#f59e0b,#22c55e,#06b6d4,#8b5cf6)]">
              Where Data Meets Destiny
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={signOutEverywhere}
            className="rounded-2xl px-3 py-2 border bg-white hover:bg-rose-50 text-sm font-semibold"
          >
            Log out
          </button>

          <label className="flex items-center gap-2 px-3 py-2 rounded-2xl border bg-white/70 cursor-pointer select-none">
            <Palette className="w-4 h-4" />
            <span className="text-sm">Rainbow mode</span>
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={rainbowMode}
              onChange={(e) => setRainbowMode(e.target.checked)}
            />
          </label>


          <button
            onClick={() => setAddPickerOpen(true)}
            className="rounded-2xl px-3 py-2 text-white bg-[linear-gradient(90deg,#ff80b5,#9089fc)] hover:opacity-90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add School
          </button>

        
          <button
            onClick={deleteSelected}
            disabled={selectedIds.size === 0}
            className={`rounded-2xl px-3 py-2 border ${
              selectedIds.size === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-rose-50"
            }`}
          >
            Delete Selected
          </button>

          <button
            onClick={restoreDefaultCriteria}
            className="rounded-2xl px-3 py-2 border bg-white hover:bg-sky-50"
          >
            Restore Default Criteria
          </button>
        </div>
      </header>

      {/* Blank canvas banner */}
      {schools.length === 0 && criteria.length === 0 && (
        <div className="my-6 rounded-2xl border-2 border-dashed border-white/60 bg-white/70 backdrop-blur p-6 text-center space-y-3">
          <h2 className="text-xl font-semibold">Start Your Comparison</h2>
          <p className="text-slate-600">
            Add at least one school and one criterion to begin. You can
            customize everything.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={addSchool}
              className="rounded-xl px-3 py-2 bg-[linear-gradient(90deg,#ff80b5,#9089fc)] text-white hover:opacity-90"
            >
              + Add School
            </button>
            <button
              onClick={() => setAddOpen(true)}
              className="rounded-xl px-3 py-2 border bg-white hover:bg-slate-50"
            >
              + Add Criterion
            </button>
            <button
              onClick={restoreDefaultCriteria}
              className="rounded-xl px-3 py-2 border bg-white hover:bg-slate-50"
            >
              Load Starter Criteria
            </button>
          </div>
        </div>
      )}

     {addPickerOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-3xl w-full max-w-2xl p-6 md:p-7 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#f43f5e,#f59e0b,#22c55e,#06b6d4,#8b5cf6)]">
            Pick a Dental School
          </span>
        </h3>
        <button
          className="text-sm px-2 py-1 rounded-xl hover:bg-slate-100"
          onClick={() => setAddPickerOpen(false)}
        >
          Close
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={schoolSearch}
          onChange={(e) => setSchoolSearch(e.target.value)}
          placeholder="Search schools…"
          className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-200"
        />
      </div>

      {/* List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Choose school(s)</label>
          <div className="text-xs text-slate-500">
            Selected: <span className="font-semibold">{selectedKeys.size}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/60 max-h-[50vh] overflow-y-auto p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {DENTAL_SCHOOLS
              .filter((s) => {
                const q = schoolSearch.trim().toLowerCase();
                if (!q) return true;
                return (
                  s.name.toLowerCase().includes(q) ||
                  (s.city || "").toLowerCase().includes(q) ||
                  (s.state || "").toLowerCase().includes(q)
                );
              })
              .map((s, i) => {
                const checked = selectedKeys.has(s.key);
                return (
                  <label
                    key={s.key}
                    className={`flex items-start gap-3 rounded-2xl border px-3 py-3 cursor-pointer transition
                      ${checked ? "border-fuchsia-300 bg-fuchsia-50/60" : "border-slate-200 hover:bg-slate-50"}`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4"
                      checked={checked}
                      onChange={() => toggleSelected(s.key)}
                    />
                    <div className="text-sm">
                      <div className="font-medium">
                        {s.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {s.city}{s.city && s.state ? ", " : ""}{s.state}
                      </div>
                    </div>
                  </label>
                );
              })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <button
            className="px-2 py-1 rounded-xl border hover:bg-slate-50"
            onClick={() => setSelectedKeys(new Set())}
          >
            Clear
          </button>
          <button
            className="px-2 py-1 rounded-xl border hover:bg-slate-50"
            onClick={() => {
              // select all visible in current filter
              const visible = DENTAL_SCHOOLS.filter((s) => {
                const q = schoolSearch.trim().toLowerCase();
                if (!q) return true;
                return (
                  s.name.toLowerCase().includes(q) ||
                  (s.city || "").toLowerCase().includes(q) ||
                  (s.state || "").toLowerCase().includes(q)
                );
              }).map((s) => s.key);
              setSelectedKeys(new Set(visible));
            }}
          >
            Select all (filtered)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="rounded-2xl px-4 py-2 border"
            onClick={() => setAddPickerOpen(false)}
          >
            Cancel
          </button>
          {/* Add & stay */}
          <button
            disabled={selectedKeys.size === 0}
            className="rounded-2xl px-4 py-2 text-white bg-[linear-gradient(90deg,#34d399,#60a5fa)] disabled:opacity-50"
            onClick={() => addSelectedSchools(false)}
            title="Add selected and keep picking"
          >
            Add {selectedKeys.size > 0 ? `(${selectedKeys.size})` : ""}
          </button>
          {/* Add & close */}
          <button
            disabled={selectedKeys.size === 0}
            className="rounded-2xl px-4 py-2 text-white bg-[linear-gradient(90deg,#f97316,#ec4899,#6366f1)] disabled:opacity-50"
            onClick={() => addSelectedSchools(true)}
            title="Add selected and close"
          >
            Add & Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      
      {/* main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* weights panel */}
        <div className="order-2 xl:order-1 xl:col-span-1 rounded-3xl shadow-sm border-2 border-rose-100 bg-white/90 backdrop-blur p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Weights ({totalWeight})</h2>
            <button
              onClick={() => setAddOpen(true)}
              className="text-sm rounded-xl px-3 py-1.5 border bg-white hover:bg-emerald-50 inline-flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Criterion
            </button>
          </div>
          <p className="text-sm text-slate-600">
            We normalize factors (min→max) before combining; lower-is-better
            factors are auto-inverted.
          </p>

          {/* Add criterion modal */}
          {addOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <form
                onSubmit={addCriterionSubmit}
                className="bg-white rounded-3xl w-full max-w-md p-4 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Add Criterion</h3>
                  <button
                    type="button"
                    className="text-sm px-2 py-1 rounded-xl hover:bg-slate-100"
                    onClick={() => {
                      setAddOpen(false);
                      setAddError("");
                    }}
                  >
                    Close
                  </button>
                </div>
                {addError && (
                  <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                    {addError}
                  </div>
                )}
                <div className="grid gap-2">
                  <label className="text-sm">
                    Label
                    <input
                      className="mt-1 w-full border rounded-xl px-2 py-1"
                      value={newCrit.label}
                      onChange={(e) =>
                        setNewCrit((n) => ({ ...n, label: e.target.value }))
                      }
                      placeholder="e.g., Clinic Hours"
                    />
                  </label>
                  <label className="text-sm">
                    Key (optional)
                    <input
                      className="mt-1 w-full border rounded-xl px-2 py-1 font-mono"
                      value={newCrit.key}
                      onChange={(e) =>
                        setNewCrit((n) => ({ ...n, key: e.target.value }))
                      }
                      placeholder="clinic_hours"
                    />
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={newCrit.higherIsBetter}
                      onChange={(e) =>
                        setNewCrit((n) => ({
                          ...n,
                          higherIsBetter: e.target.checked,
                        }))
                      }
                    />
                    Higher is better
                  </label>
                  <label className="text-sm">
                    Help text (optional)
                    <input
                      className="mt-1 w-full border rounded-xl px-2 py-1"
                      value={newCrit.tip}
                      onChange={(e) =>
                        setNewCrit((n) => ({ ...n, tip: e.target.value }))
                      }
                      placeholder="How to score this (0–10, %, etc.)"
                    />
                  </label>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    className="rounded-xl px-3 py-2 border"
                    onClick={() => {
                      setAddOpen(false);
                      setAddError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl px-3 py-2 text-white bg-[linear-gradient(90deg,#34d399,#60a5fa)]"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {criteria.map((c, i) => (
              <div key={String(c.key)} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{
                        background: rainbowMode
                          ? rainbowColor(i, criteria.length)
                          : pastelColors[i % pastelColors.length],
                      }}
                    />
                    {c.label}
                    <button
                      onClick={() => removeCriterion(c.key)}
                      className="ml-2 text-xs px-2 py-1 rounded-xl border hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                  <span className="text-sm text-slate-500" title={c.tip}>
                    {weights[c.key] ?? 0}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={Number(weights[c.key] || 0)}
                  onChange={(e) =>
                    setWeights((w) => ({
                      ...w,
                      [c.key]: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
                <div className="text-xs text-slate-500">
                  {c.higherIsBetter
                    ? "Higher is better"
                    : "Lower is better (auto-inverted)"}
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-500 pt-2">
            Tip: Total weight doesn’t need to equal 100 — we normalize internally.
          </div>
        </div>

        {/* table + editors */}
        <div className="order-1 xl:order-2 xl:col-span-2 rounded-3xl shadow-sm border-2 border-sky-100 bg-white/90 backdrop-blur p-6 space-y-4">
          <div className="inline-flex rounded-2xl border overflow-hidden">
            <button
              onClick={() => setActiveTab("data")}
              className={`px-3 py-2 text-sm ${
                activeTab === "data" ? "bg-fuchsia-100" : "bg-white"
              }`}
            >
              Data Table
            </button>
            <button
              onClick={() => setActiveTab("chart")}
              className={`px-3 py-2 text-sm flex items-center gap-1 ${
                activeTab === "chart" ? "bg-fuchsia-100" : "bg-white"
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              Chart
            </button>
          </div>

          {activeTab === "data" && (
            <div className="overflow-x-auto rounded-2xl border">
              <table className="w-full text-sm">
                <thead className="bg-pink-50/70">
  <tr>
    {/* select-all checkbox */}
    <th className="p-3 text-left w-[40px]">
      <input
        type="checkbox"
        checked={allSelected}
        onChange={() => {
          if (allSelected) {
            setSelectedIds(new Set());
          } else {
            setSelectedIds(new Set(rowsWithScores.map((r) => r.id)));
          }
        }}
      />
    </th>

    {/* NEW: delete column header */}
    <th className="p-3 text-left w-[50px]">Del</th>

    <th className="p-3 text-left">Rank</th>
    <th className="p-3 text-left">School</th>
    <th className="p-3 text-left">City</th>
    <th className="p-3 text-left">State</th>
    <th className="p-3 text-left">Deadline</th>

    {criteria.map((c) => (
      <th
        key={String(c.key)}
        className="p-3 text-left whitespace-nowrap"
        title={c.tip}
      >
        {c.label}
      </th>
    ))}

    <th className="p-3 text-left">Combined</th>
  </tr>
</thead>

                <tbody>
                 {rowsWithScores.map((row, i) => (
  <tr
    key={row.id}
    className="border-t transition-colors"
    style={{
      background: rainbowMode
        ? rainbowAlpha(i, rowsWithScores.length, 0.08)
        : undefined,
    }}
  >
    {/* 1. row checkbox */}
    <td className="p-3">
      <input
        type="checkbox"
        checked={selectedIds.has(row.id)}
        onChange={() => {
          setSelectedIds((prev) => {
            const s = new Set(prev);
            if (s.has(row.id)) s.delete(row.id);
            else s.add(row.id);
            return s;
          });
        }}
      />
    </td>

    {/* 2. NEW: delete button on the left */}
    <td className="p-3">
      <button
        onClick={() => removeSchool(row.id)}
        className="p-2 rounded-xl hover:bg-rose-100"
        title="Delete this school"
      >
        <Trash2 className="w-4 h-4 text-rose-500" />
      </button>
    </td>

    {/* 3. rank */}
    <td className="p-3 font-medium">
      <span className="inline-flex items-center gap-2">
        <span
          className="inline-block w-2 h-5 rounded-full"
          style={{
            background: rainbowMode
              ? rainbowColor(i, rowsWithScores.length)
              : pastelColors[i % pastelColors.length],
          }}
        />
        {row.rank}
      </span>
    </td>

    {/* 4. school + rest, same as before */}
    <td className="p-3 min-w-[260px]">
      <InlineEdit
        value={row.name}
        onChange={(v) => updateField(row.id, "name", v)}
      />
    </td>
    <td className="p-3">
      <InlineEdit
        value={row.city || ""}
        onChange={(v) => updateField(row.id, "city", v)}
      />
    </td>
    <td className="p-3 w-[80px]">
      <InlineEdit
        value={row.state || ""}
        onChange={(v) => updateField(row.id, "state", v)}
      />
    </td>
    <td className="p-3 w-[140px]">
      <InlineEdit
        value={row.deadline || ""}
        placeholder="YYYY-MM-DD"
        onChange={(v) => updateField(row.id, "deadline", v)}
      />
    </td>

    {/* criteria cells – keep exactly how you had them */}
    {criteria.map((c) => (
      <td key={String(c.key)} className="p-3 w-[120px]">
        <NumericCell
          value={row[c.key]}
          onChange={(v) => updateField(row.id, c.key, v)}
          placeholder={
            c.key === "looks"
              ? "rate the campus 0–10"
              : c.key === "cityLike"
              ? "0–10"
              : c.key === "curriculum"
              ? "flexibility 0–10"
              : c.key === "clinical"
              ? "exposure 0–10"
              : ""
          }
        />
      </td>
    ))}

    {/* combined score */}
    <td className="p-3 font-semibold">
      {(row.composite ?? 0).toFixed(1)}
    </td>
  </tr>
))}

                </tbody>
              </table>
            </div>
          )}

          {activeTab === "chart" && (
            <>
              {chartData.length > 0 ? (
                <div className="h-[460px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    >
                      <XAxis
                        dataKey="name"
                        hide={true}
                        tick={false}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        formatter={(v, _k, p) => [
                          `${Number(v).toFixed(1)}`,
                          p && p.payload ? p.payload.rawName : "",
                        ]}
                        labelFormatter={() => ""}
                      />
                      <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                        {chartData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={
                              rainbowMode
                                ? rainbowColor(i, chartData.length)
                                : pastelColors[i % pastelColors.length]
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center text-slate-600 text-sm py-10 bg-white/60 rounded-xl shadow-sm">
                  Add schools and criteria to generate a chart.
                </div>
              )}
            </>
          )}

          {/* aesthetic rater */}
          <div>
            <button
              onClick={() => setRaterOpen(true)}
              className="rounded-2xl px-3 py-2 text-white bg-[linear-gradient(90deg,#ff80b5,#9089fc)] hover:opacity-90 inline-flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              Open Rater
            </button>
            {raterOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                <div className="bg-white rounded-3xl w-full max-w-2xl p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">
                      Rate Aesthetics (0–10)
                    </h3>
                    <button
                      className="text-sm px-2 py-1 rounded-xl hover:bg-slate-100"
                      onClick={() => setRaterOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3">
                    {schools.map((s, i) => (
                      <div
                        key={s.id}
                        className="grid grid-cols-[1fr,120px] gap-3 items-center"
                      >
                        <div className="text-sm">
                          <span className="font-medium flex items-center gap-2">
                            <span
                              className="inline-block w-3 h-3 rounded-full"
                              style={{
                                background: rainbowColor(i, schools.length),
                              }}
                            />
                            {s.name}
                          </span>
                          <div className="text-slate-500">
                            {s.city}, {s.state}
                          </div>
                        </div>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          className="border rounded-xl px-2 py-1"
                          value={s.looks ?? ""}
                          onChange={(e) =>
                            updateField(
                              s.id,
                              "looks",
                              parseNumberOrNull(e.target.value)
                            )
                          }
                          placeholder="0–10"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      className="rounded-2xl px-3 py-2 border"
                      onClick={() => setRaterOpen(false)}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-3xl shadow-sm border-2 border-violet-100 bg-white/90 backdrop-blur p-6 grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Quick Notes</h3>
          <ul className="text-sm text-slate-600 list-disc pl-5 space-y-2">
            <li>
              We normalize each factor with min→max scaling to 0–100 and
              auto-invert lower-is-better ones (Price, Grad Requirements).
            </li>
            <li>
              Composite score is a weighted average of those standardized scores.
            </li>
            <li>
              Leave a field blank if you don’t know it — we treat it neutrally (~50
              after scaling).
            </li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Tips</h3>
          <ul className="text-sm text-slate-600 list-disc pl-5 space-y-2">
            <li>
              Use <strong>How Much I Like the City</strong> (0–10) for your personal
              preference.
            </li>
          </ul>
        </div>
      </div>

      <InternalChecks />
      
      {resetOpen && (
        <ResetPasswordModal onClose={() => setResetOpen(false)} />
      )}
    </div>
  );
}

/* -------------------- SMALL COMPONENTS -------------------- */

function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function sendReset(e) {
    e.preventDefault();
    setMsg("");
    if (!email) return setMsg("Please enter your email.");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset`,
    });

    if (error) setMsg(error.message);
    else setMsg("Check your inbox for a reset link.");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={sendReset}
        className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-xl"
      >
        <h3 className="text-lg font-semibold">Reset your password</h3>
        {msg && <div className="text-sm text-slate-700">{msg}</div>}

        <label className="block text-sm">
          Email
          <input
            type="email"
            className="mt-1 w-full border rounded-xl px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-xl px-3 py-2 text-white bg-[linear-gradient(90deg,#ff80b5,#9089fc)]"
        >
          Send reset link
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full text-sm text-slate-600 hover:underline"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}


function ResetPasswordModal({ onClose }) {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [msg, setMsg] = useState("");

  async function submitNewPassword(e) {
    e.preventDefault();
    setMsg("");

    if (p1.length < 6) return setMsg("Password must be at least 6 characters.");
    if (p1 !== p2) return setMsg("Passwords do not match.");

    const { error } = await supabase.auth.updateUser({ password: p1 });
    if (error) setMsg(error.message);
    else {
      setMsg("Password updated. You can close this window.");
      setTimeout(() => onClose(), 1200);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={submitNewPassword}
        className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-xl"
      >
        <h3 className="text-lg font-semibold">Set a new password</h3>
        {msg && <div className="text-sm text-slate-700">{msg}</div>}

        <label className="block text-sm">
          New password
          <input
            type="password"
            className="mt-1 w-full border rounded-xl px-3 py-2"
            value={p1}
            onChange={(e) => setP1(e.target.value)}
            required
          />
        </label>

        <label className="block text-sm">
          Confirm new password
          <input
            type="password"
            className="mt-1 w-full border rounded-xl px-3 py-2"
            value={p2}
            onChange={(e) => setP2(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-xl px-3 py-2 text-white bg-[linear-gradient(90deg,#ff80b5,#9089fc)]"
        >
          Save password
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full text-sm text-slate-600 hover:underline"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

function InlineEdit({ value, onChange, placeholder }) {
  const [v, setV] = useState(value ?? "");
  useEffect(() => setV(value ?? ""), [value]);
  return (
    <input
      className="w-full bg-transparent outline-none border-b border-transparent focus:border-slate-300 transition-colors"
      value={v}
      onChange={(e) => {
        setV(e.target.value);
        if (onChange) onChange(e.target.value);
      }}
      placeholder={placeholder}
    />
  );
}

function NumericCell({ value, onChange, placeholder }) {
  const [v, setV] = useState(value == null ? "" : String(value));
  useEffect(() => setV(value == null ? "" : String(value)), [value]);
  return (
    <input
      className="w-full bg-white border rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-200"
      type="number"
      step="any"
      value={v}
      onChange={(e) => {
        setV(e.target.value);
        if (onChange) onChange(parseNumberOrNull(e.target.value));
      }}
      placeholder={placeholder}
    />
  );
}

function minMaxForTest(arr) {
  return minMax(arr);
}

function InternalChecks() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const out = [];

    const mm = minMaxForTest([0, 50, 100]);
    out.push(Math.abs(mm.scale(0) - 0) < 1e-6 ? "✅ minMax 0" : "❌ minMax 0");
    out.push(
      Math.abs(mm.scale(100) - 100) < 1e-6 ? "✅ minMax 100" : "❌ minMax 100"
    );

    try {
      const rows = [{ price: 100 }, { price: 200 }];
      const inv = normalizeCriterion(rows, "price", false);
      out.push(
        inv[0] > inv[1] ? "✅ lower price scores higher" : "❌ price invert"
      );
    } catch (e) {
      out.push("❌ price invert threw");
    }

    setLogs(out);
  }, []);
  return (
    <div className="rounded-3xl shadow-sm border-2 border-emerald-100 bg-white/90 backdrop-blur p-4">
      <h3 className="text-base font-semibold mb-2">Internal Checks</h3>
      <ul className="text-sm text-slate-700 grid gap-1">
        {logs.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
