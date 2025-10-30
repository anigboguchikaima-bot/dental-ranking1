import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Star,
  BarChart2,
  Sparkles,
  Palette,
  Download as DownloadIcon,
  Upload as UploadIcon,
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
const ALL_CRITERIA = [
  { key: "cityBlackPct", label: "% Black in City", higherIsBetter: true, tip: "" },
  { key: "classBlackPct", label: "% Black in Class", higherIsBetter: true, tip: "" },
  { key: "weatherWarmth", label: "Weather (Warmth)", higherIsBetter: true, tip: "" },
  { key: "cityLike", label: "How Much I Like the City", higherIsBetter: true, tip: "" },
  { key: "looks", label: "Aesthetic (Your Score)", higherIsBetter: true, tip: "" },
  { key: "price", label: "Price / Cost of Attendance", higherIsBetter: false, tip: "" },
  { key: "timeline", label: "Breaks per Year", higherIsBetter: true, tip: "" },
  { key: "perks", label: "Perks", higherIsBetter: true, tip: "" },
  { key: "gradReqs", label: "Grad Requirements Burden", higherIsBetter: false, tip: "" },
  { key: "specialty", label: "Specialty Placements", higherIsBetter: true, tip: "" },
];

const CRITERIA_DEFAULT = [
  { key: "cityBlackPct", label: "% Black in City", higherIsBetter: true, tip: "" },
  { key: "weatherWarmth", label: "Weather (Warmth)", higherIsBetter: true, tip: "" },
  { key: "cityLike", label: "How Much I Like the City", higherIsBetter: true, tip: "" },
  { key: "looks", label: "Aesthetic (Your Score)", higherIsBetter: true, tip: "" },
  { key: "price", label: "Price / Cost of Attendance", higherIsBetter: false, tip: "" },
  { key: "timeline", label: "Breaks per Year", higherIsBetter: true, tip: "" },
  { key: "perks", label: "Perks", higherIsBetter: true, tip: "" },
  { key: "gradReqs", label: "Grad Requirements Burden", higherIsBetter: false, tip: "" },
  { key: "specialty", label: "Specialty Placements", higherIsBetter: true, tip: "" },
];

const defaultWeights = {
  cityBlackPct: 25,
  weatherWarmth: 12,
  looks: 10,
  price: 12,
  timeline: 8,
  perks: 6,
  gradReqs: 6,
  specialty: 6,
  cityLike: 15,
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

function EduAlignLanding({ onGuest, onSignIn }) {
  const [mode, setMode] = React.useState("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);


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
  <h1 className="text-4xl font-extrabold tracking-tight rainbow-text">
    EduAlign
  </h1>

  <p className="text-sm rainbow-text">
    Where Data Meets Destiny
  </p>

  {/* Explanation */}
  <div className="mt-3 text-left bg-white/40 backdrop-blur-md rounded-2xl p-4 text-sm text-black/80 border border-white/30 mx-auto max-w-sm space-y-2 shadow-inner">
    <p className="leading-relaxed">
      <strong>EduAlign</strong> helps you make smarter, personalized school decisions.
      It turns the data you care about — location, cost, diversity, weather, and more —
      into a ranked list built around your unique priorities.
    </p>

    <div>
      <h3 className="text-sm font-semibold rainbow-text mb-1 text-center">
        How It Works
      </h3>
      <ol className="list-decimal list-inside space-y-1">
        <li>Pick the schools you’re interested in.</li>
        <li>Rate each one based on the factors that matter to you.</li>
        <li>Watch EduAlign create a living bar chart that updates in real time.</li>
      </ol>
    </div>

    <p className="text-xs text-black/70 italic text-center pt-1">
      Sign in or continue as guest to start aligning your data with your destiny.
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
      </div>
    </div>
  );
}

/* -------------------- MAIN APP -------------------- */

export default function DentalRankingApp() {
  // 1. auth gate
  const [session, setSession] = useState(null);
  const [guestMode, setGuestMode] = useState(() => {
    return localStorage.getItem("edualign_guest") === "1";
  });

  function onSignedIn(sessionObj) {
    setSession(sessionObj);
    localStorage.removeItem("edualign_guest");
    setGuestMode(false);
  }

  function continueAsGuest() {
    localStorage.setItem("edualign_guest", "1");
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
    localStorage.removeItem("edualign_guest");
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
      <EduAlignLanding
        onGuest={continueAsGuest}
        onSignIn={onSignedIn}
      />
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
              EduAlign
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
            onClick={addSchool}
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

          <label className="inline-flex items-center gap-2 cursor-pointer border rounded-2xl px-3 py-2 bg-white/80">
            <UploadIcon className="w-4 h-4" />
            <span>Import</span>
            <input
              type="file"
              accept="application/json"
              onChange={importJSON}
              className="hidden"
            />
          </label>

          <button
            onClick={exportJSON}
            className="rounded-2xl px-3 py-2 border border-fuchsia-200 bg-white flex items-center gap-2"
          >
            <DownloadIcon className="w-4 h-4" />
            Export
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

      {/* main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* weights panel */}
        <div className="xl:col-span-1 rounded-3xl shadow-sm border-2 border-rose-100 bg-white/90 backdrop-blur p-6 space-y-5">
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
        <div className="xl:col-span-2 rounded-3xl shadow-sm border-2 border-sky-100 bg-white/90 backdrop-blur p-6 space-y-4">
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
                    <th className="p-3 text-left w-[40px]">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => {
                          if (allSelected) {
                            setSelectedIds(new Set());
                          } else {
                            setSelectedIds(
                              new Set(rowsWithScores.map((r) => r.id))
                            );
                          }
                        }}
                      />
                    </th>
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
                    <th className="p-3 text-left"></th>
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
                      {criteria.map((c) => (
                        <td key={String(c.key)} className="p-3 w-[120px]">
                          <NumericCell
                            value={row[c.key]}
                            onChange={(v) => updateField(row.id, c.key, v)}
                            placeholder={
                              c.key === "looks"
                                ? "← your score"
                                : c.key === "cityLike"
                                ? "0–10"
                                : ""
                            }
                          />
                        </td>
                      ))}
                      <td className="p-3 font-semibold">
                        {(row.composite ?? 0).toFixed(1)}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => removeSchool(row.id)}
                          className="p-2 rounded-xl hover:bg-rose-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
            <li>Use Export/Import to move data between devices or share.</li>
          </ul>
        </div>
      </div>

      <InternalChecks />
    </div>
  );
}

/* -------------------- SMALL COMPONENTS -------------------- */

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
