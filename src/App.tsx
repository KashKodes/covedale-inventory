import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import {
  Search,
  Car,
  Package,
  DollarSign,
  MapPin,
  Wrench,
  FileText,
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock3,
  X,
  Lock,
  Mail,
  LogOut,
  Shield,
  User,
  Database,
  Trash2,
  Pencil,
  Eye,
  Cloud,
  RefreshCw,
  Plus,
  KeyRound,
  Upload,
  Download,
} from "lucide-react";

const STORAGE_KEY = "covedale_inventory_system_v3";

// Paste your Supabase project values here for production deployment.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const isCloudMode = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const supabase = isCloudMode ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const seedUsers = [
  {
    id: 1,
    name: "Mike Reynolds",
    email: "admin@covedaleservicecenter.com",
    password: "admin123",
    role: "Admin",
  },
  {
    id: 2,
    name: "Service Writer",
    email: "staff@covedaleservicecenter.com",
    password: "staff123",
    role: "Staff",
  },
];

const seedParts = [
  {
    id: "CSC-1001",
    partName: "Front Bumper Cover",
    category: "Body",
    condition: "Used - Grade A",
    sourceVin: "1HGCV1F34KA123456",
    sourceVehicle: "2019 Honda Accord Sport 1.5T",
    fitsVehicle: "2018-2020 Honda Accord",
    oemNumber: "04711-TVA-A90ZZ",
    stockQty: 2,
    price: 325,
    cost: 180,
    location: "Aisle A / Rack 02",
    supplier: "Covedale Dismantle Yard",
    acquiredDate: "2026-03-20",
    warranty: "30 Days",
    status: "In Stock",
    notes: "Minor scuff on lower passenger edge.",
    createdBy: "Mike Reynolds",
    updatedAt: "2026-03-20 09:14",
  },
  {
    id: "CSC-1002",
    partName: "Alternator",
    category: "Electrical",
    condition: "Tested - Good",
    sourceVin: "1FTFW1E50JFA22451",
    sourceVehicle: "2018 Ford F-150 XLT 5.0",
    fitsVehicle: "2018-2020 Ford F-150 5.0L",
    oemNumber: "GL3T-10300-AB",
    stockQty: 4,
    price: 215,
    cost: 120,
    location: "Aisle C / Bin 14",
    supplier: "Midwest Salvage",
    acquiredDate: "2026-03-18",
    warranty: "60 Days",
    status: "In Stock",
    notes: "Bench-tested before intake.",
    createdBy: "Service Writer",
    updatedAt: "2026-03-18 13:42",
  },
  {
    id: "CSC-1003",
    partName: "Driver Side Headlight",
    category: "Lighting",
    condition: "Used - Grade B",
    sourceVin: "1N4BL4BV2LC214598",
    sourceVehicle: "2020 Nissan Altima SV",
    fitsVehicle: "2019-2021 Nissan Altima",
    oemNumber: "26060-6CA0A",
    stockQty: 1,
    price: 145,
    cost: 70,
    location: "Aisle B / Shelf 07",
    supplier: "Tri-State Auto Recyclers",
    acquiredDate: "2026-03-15",
    warranty: "30 Days",
    status: "Reserved",
    notes: "Lens has light hazing.",
    createdBy: "Mike Reynolds",
    updatedAt: "2026-03-16 10:22",
  },
  {
    id: "CSC-1004",
    partName: "Transmission Control Module",
    category: "Electronics",
    condition: "Pulled / Untested",
    sourceVin: "2C4RC1BG9KR612349",
    sourceVehicle: "2019 Chrysler Pacifica Touring L",
    fitsVehicle: "2018-2020 Chrysler Pacifica",
    oemNumber: "68352763AA",
    stockQty: 1,
    price: 390,
    cost: 200,
    location: "Secure Cabinet / E-04",
    supplier: "Covedale Service Center",
    acquiredDate: "2026-03-10",
    warranty: "No Warranty",
    status: "Inspection Needed",
    notes: "Needs programming verification before sale.",
    createdBy: "Mike Reynolds",
    updatedAt: "2026-03-10 15:08",
  },
];

const emptyForm = {
  id: "",
  partName: "",
  category: "Engine",
  condition: "Used - Grade A",
  sourceVin: "",
  sourceVehicle: "",
  fitsVehicle: "",
  oemNumber: "",
  stockQty: 1,
  price: "",
  cost: "",
  location: "",
  supplier: "",
  acquiredDate: new Date().toISOString().slice(0, 10),
  warranty: "30 Days",
  status: "In Stock",
  notes: "",
};

const categories = [
  "Engine",
  "Transmission",
  "Body",
  "Electrical",
  "Electronics",
  "Lighting",
  "Suspension",
  "Interior",
  "Cooling",
  "Brakes",
  "Wheels",
  "Other",
];

const statuses = ["In Stock", "Reserved", "Sold", "Inspection Needed"];
const conditions = [
  "Used - Grade A",
  "Used - Grade B",
  "Refurbished",
  "Tested - Good",
  "Pulled / Untested",
  "New",
];

function nowStamp() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
}

function saveLocalSystem(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadLocalSystem() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  const starter = { users: seedUsers, parts: seedParts };
  saveLocalSystem(starter);
  return starter;
}

function normalizePartForUI(part) {
  return {
    id: part.id,
    partName: part.partName ?? part.part_name ?? "",
    category: part.category ?? "Other",
    condition: part.condition ?? "",
    sourceVin: part.sourceVin ?? part.source_vin ?? "",
    sourceVehicle: part.sourceVehicle ?? part.source_vehicle ?? "",
    fitsVehicle: part.fitsVehicle ?? part.fits_vehicle ?? "",
    oemNumber: part.oemNumber ?? part.oem_number ?? "",
    stockQty: Number(part.stockQty ?? part.stock_qty ?? 0),
    price: Number(part.price ?? 0),
    cost: Number(part.cost ?? 0),
    location: part.location ?? "",
    supplier: part.supplier ?? "",
    acquiredDate: part.acquiredDate ?? part.acquired_date ?? "",
    warranty: part.warranty ?? "",
    status: part.status ?? "In Stock",
    notes: part.notes ?? "",
    createdBy: part.createdBy ?? part.created_by ?? "",
    updatedAt: part.updatedAt ?? part.updated_at ?? "",
  };
}

function normalizePartForDb(part) {
  return {
    id: part.id,
    part_name: part.partName,
    category: part.category,
    condition: part.condition,
    source_vin: part.sourceVin,
    source_vehicle: part.sourceVehicle,
    fits_vehicle: part.fitsVehicle,
    oem_number: part.oemNumber,
    stock_qty: Number(part.stockQty),
    price: Number(part.price),
    cost: Number(part.cost),
    location: part.location,
    supplier: part.supplier,
    acquired_date: part.acquiredDate,
    warranty: part.warranty,
    status: part.status,
    notes: part.notes,
    created_by: part.createdBy,
    updated_at: part.updatedAt,
  };
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function StatusBadge({ status }) {
  const styles = {
    "In Stock": "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
    Reserved: "bg-amber-500/15 text-amber-300 border-amber-400/20",
    Sold: "bg-slate-500/15 text-slate-300 border-slate-400/20",
    "Inspection Needed": "bg-rose-500/15 text-rose-300 border-rose-400/20",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${styles[status] || "bg-white/10 text-white border-white/10"}`}>
      {status}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="mt-2 text-3xl font-semibold text-white">{value}</h3>
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
        </div>
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3">
          <Icon className="h-5 w-5 text-cyan-300" />
        </div>
      </div>
    </motion.div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      {children}
    </label>
  );
}

function LoginScreen({
  mode,
  onLogin,
  onRegister,
  loginForm,
  setLoginForm,
  registerForm,
  setRegisterForm,
  loginError,
  registerError,
  loading,
}) {
  const [tab, setTab] = useState("login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.14),_transparent_24%),linear-gradient(to_bottom,_#020617,_#020617)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-400/10">
            <Wrench className="h-8 w-8 text-cyan-300" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold text-white">Covedale Service Center</h1>
          <p className="mt-2 text-sm text-slate-400">Inventory access for shop staff and administrators</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/50 px-3 py-1 text-xs text-slate-300">
            {mode === "cloud" ? <Cloud className="h-3.5 w-3.5 text-cyan-300" /> : <Database className="h-3.5 w-3.5 text-cyan-300" />}
            {mode === "cloud" ? "Cloud production mode" : "Local demo mode"}
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-slate-900/45 p-1">
          <button
            onClick={() => setTab("login")}
            className={`rounded-xl px-4 py-2 text-sm ${tab === "login" ? "bg-cyan-400/15 text-cyan-100" : "text-slate-300"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab("register")}
            className={`rounded-xl px-4 py-2 text-sm ${tab === "register" ? "bg-cyan-400/15 text-cyan-100" : "text-slate-300"}`}
          >
            Request Access
          </button>
        </div>

        {tab === "login" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onLogin();
            }}
            className="space-y-4"
          >
            <Field label="Email">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 py-3 pl-11 pr-4 text-white outline-none"
                  placeholder="Enter your work email"
                />
              </div>
            </Field>

            <Field label="Password">
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 py-3 pl-11 pr-4 text-white outline-none"
                  placeholder="Enter your password"
                />
              </div>
            </Field>

            {loginError && (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl border border-cyan-300/30 bg-cyan-400/15 px-5 py-3 font-medium text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onRegister();
            }}
            className="space-y-4"
          >
            <Field label="Full Name">
              <input
                value={registerForm.name}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                placeholder="Enter full name"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                placeholder="Enter work email"
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                placeholder="Create password"
              />
            </Field>

            {registerError && (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {registerError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl border border-cyan-300/30 bg-cyan-400/15 px-5 py-3 font-medium text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : mode === "cloud" ? "Create Cloud Account" : "Create Demo Account"}
            </button>
          </form>
        )}

        {mode === "local" && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/45 p-4 text-sm text-slate-300">
            <p className="font-medium text-white">Demo credentials</p>
            <p className="mt-2">Admin: admin@covedaleservicecenter.com / admin123</p>
            <p>Staff: staff@covedaleservicecenter.com / staff123</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function CovedaleInventoryDeployableApp() {
  const [mode] = useState(isCloudMode ? "cloud" : "local");
  const [system, setSystem] = useState({ users: [], parts: [] });
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({
    email: mode === "local" ? "admin@covedaleservicecenter.com" : "",
    password: mode === "local" ? "admin123" : "",
  });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPart, setSelectedPart] = useState(null);
  const [showPartModal, setShowPartModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm, id: `CSC-${Math.floor(1000 + Math.random() * 9000)}` });
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [banner, setBanner] = useState("");

  const showBanner = (text) => {
    setBanner(text);
    window.clearTimeout(showBanner._timer);
    showBanner._timer = window.setTimeout(() => setBanner(""), 3000);
  };

  const bootLocal = () => {
    const loaded = loadLocalSystem();
    const normalizedParts = (loaded.parts || []).map(normalizePartForUI);
    setSystem({ users: loaded.users || [], parts: normalizedParts });
    setSelectedPart(normalizedParts[0] || null);
    setLoading(false);
  };

  const fetchCloudParts = async () => {
    const { data, error } = await supabase
      .from("parts_inventory")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;
    const normalized = (data || []).map(normalizePartForUI);
    setSystem((prev) => ({ ...prev, parts: normalized }));
    setSelectedPart((current) => normalized.find((item) => item.id === current?.id) || normalized[0] || null);
  };

  const hydrateCloudUser = async (authUser) => {
    const user = authUser || (await supabase.auth.getUser()).data.user;
    if (!user) return null;

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();

    const mapped = {
      id: user.id,
      name: profile?.full_name || user.email,
      email: user.email,
      role: profile?.role || "Staff",
    };
    setCurrentUser(mapped);
    return mapped;
  };

  useEffect(() => {
    let mounted = true;
    let unsubscribe;

    const init = async () => {
      try {
        if (mode === "cloud") {
          const { data: sessionData } = await supabase.auth.getSession();
          if (!mounted) return;

          if (sessionData.session?.user) {
            await hydrateCloudUser(sessionData.session.user);
            await fetchCloudParts();
          }

          const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!mounted) return;
            if (session?.user) {
              await hydrateCloudUser(session.user);
              await fetchCloudParts();
            } else {
              setCurrentUser(null);
            }
          });
          unsubscribe = data.subscription.unsubscribe;
          setLoading(false);
          return;
        }

        bootLocal();
      } catch (error) {
        if (mounted) {
          showBanner(error.message || "Unable to load system.");
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [mode]);

  useEffect(() => {
    if (mode === "local" && (system.parts.length || system.users.length)) {
      saveLocalSystem(system);
    }
  }, [system, mode]);

  const filteredParts = useMemo(() => {
    return system.parts.filter((part) => {
      const q = query.toLowerCase();
      const matchesQuery =
        part.partName.toLowerCase().includes(q) ||
        part.id.toLowerCase().includes(q) ||
        part.sourceVin.toLowerCase().includes(q) ||
        part.sourceVehicle.toLowerCase().includes(q) ||
        part.fitsVehicle.toLowerCase().includes(q) ||
        part.oemNumber.toLowerCase().includes(q) ||
        part.location.toLowerCase().includes(q);

      const matchesCategory = categoryFilter === "All" || part.category === categoryFilter;
      const matchesStatus = statusFilter === "All" || part.status === statusFilter;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [system.parts, query, categoryFilter, statusFilter]);

  const stats = useMemo(() => {
    const totalUnits = system.parts.reduce((sum, item) => sum + Number(item.stockQty || 0), 0);
    const inventoryValue = system.parts.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.stockQty || 0), 0);
    const lowStock = system.parts.filter((item) => Number(item.stockQty) <= 1).length;
    const inspections = system.parts.filter((item) => item.status === "Inspection Needed").length;
    return { totalUnits, inventoryValue, lowStock, inspections };
  }, [system.parts]);

  const handleLogin = async () => {
    setAuthLoading(true);
    setLoginError("");
    try {
      if (mode === "cloud") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginForm.email,
          password: loginForm.password,
        });
        if (error) throw error;
        await hydrateCloudUser(data.user);
        await fetchCloudParts();
      } else {
        const match = system.users.find(
          (user) => user.email.toLowerCase() === loginForm.email.toLowerCase() && user.password === loginForm.password
        );
        if (!match) throw new Error("Invalid email or password.");
        setCurrentUser(match);
      }
    } catch (error) {
      setLoginError(error.message || "Login failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async () => {
    setAuthLoading(true);
    setRegisterError("");
    try {
      if (!registerForm.name || !registerForm.email || !registerForm.password) {
        throw new Error("Please fill out all account fields.");
      }

      if (mode === "cloud") {
        const { data, error } = await supabase.auth.signUp({
          email: registerForm.email,
          password: registerForm.password,
          options: {
            data: {
              full_name: registerForm.name,
            },
          },
        });
        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await supabase.from("user_profiles").upsert({
            id: data.user.id,
            full_name: registerForm.name,
            role: "Staff",
            email: registerForm.email,
          });
          if (profileError) throw profileError;
        }

        showBanner("Cloud account created. Sign in with your new credentials.");
      } else {
        const exists = system.users.some((u) => u.email.toLowerCase() === registerForm.email.toLowerCase());
        if (exists) throw new Error("An account with that email already exists.");

        const newUser = {
          id: Date.now(),
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password,
          role: "Staff",
        };
        setSystem((prev) => ({ ...prev, users: [...prev.users, newUser] }));
        showBanner("Demo account created successfully.");
      }

      setRegisterForm({ name: "", email: "", password: "" });
    } catch (error) {
      setRegisterError(error.message || "Unable to create account.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (mode === "cloud") {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
  };

  const refreshCloud = async () => {
    if (mode !== "cloud") return;
    setSyncing(true);
    try {
      await fetchCloudParts();
      showBanner("Inventory synced from cloud database.");
    } catch (error) {
      showBanner(error.message || "Sync failed.");
    } finally {
      setSyncing(false);
    }
  };

  const exportCsv = () => {
    const headers = [
      "id",
      "partName",
      "category",
      "condition",
      "sourceVin",
      "sourceVehicle",
      "fitsVehicle",
      "oemNumber",
      "stockQty",
      "price",
      "cost",
      "location",
      "supplier",
      "acquiredDate",
      "warranty",
      "status",
      "notes",
      "createdBy",
      "updatedAt",
    ];

    const rows = system.parts.map((part) =>
      headers
        .map((key) => `"${String(part[key] ?? "").replaceAll('"', '""')}"`)
        .join(",")
    );

    downloadTextFile("covedale-inventory-export.csv", [headers.join(","), ...rows].join("\n"));
  };

  const handleImportJson = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const incoming = Array.isArray(parsed) ? parsed : parsed.parts;
      if (!Array.isArray(incoming)) throw new Error("JSON must contain an array of parts.");

      const normalized = incoming.map(normalizePartForUI);

      if (mode === "cloud") {
        const payload = normalized.map((part) => normalizePartForDb(part));
        const { error } = await supabase.from("parts_inventory").upsert(payload);
        if (error) throw error;
        await fetchCloudParts();
      } else {
        setSystem((prev) => ({ ...prev, parts: normalized }));
        setSelectedPart(normalized[0] || null);
      }

      showBanner("Inventory import completed.");
      event.target.value = "";
    } catch (error) {
      showBanner(error.message || "Import failed.");
    }
  };

  const downloadSetupFiles = () => {
    const sql = `-- Run this in Supabase SQL Editor\n\ncreate table if not exists public.user_profiles (\n  id uuid primary key references auth.users(id) on delete cascade,\n  email text unique,\n  full_name text,\n  role text default 'Staff',\n  created_at timestamptz default now()\n);\n\ncreate table if not exists public.parts_inventory (\n  id text primary key,\n  part_name text not null,\n  category text,\n  condition text,\n  source_vin text,\n  source_vehicle text,\n  fits_vehicle text,\n  oem_number text,\n  stock_qty integer default 0,\n  price numeric default 0,\n  cost numeric default 0,\n  location text,\n  supplier text,\n  acquired_date date,\n  warranty text,\n  status text default 'In Stock',\n  notes text,\n  created_by text,\n  updated_at text\n);\n\nalter table public.user_profiles enable row level security;\nalter table public.parts_inventory enable row level security;\n\ncreate policy \"profiles readable by signed in users\" on public.user_profiles\nfor select to authenticated using (true);\n\ncreate policy \"profiles upsert by signed in users\" on public.user_profiles\nfor all to authenticated using (auth.uid() = id) with check (auth.uid() = id);\n\ncreate policy \"parts readable by signed in users\" on public.parts_inventory\nfor select to authenticated using (true);\n\ncreate policy \"parts insert by signed in users\" on public.parts_inventory\nfor insert to authenticated with check (true);\n\ncreate policy \"parts update by signed in users\" on public.parts_inventory\nfor update to authenticated using (true);\n\ncreate policy \"parts delete by signed in users\" on public.parts_inventory\nfor delete to authenticated using (true);`;

    const env = `# Add these to your Vercel project environment variables\nVITE_SUPABASE_URL=your_supabase_url_here\nVITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here`;

    downloadTextFile("supabase-setup.sql", sql);
    window.setTimeout(() => downloadTextFile("vercel-env.txt", env), 250);
  };

  const resetForm = () => {
    setForm({
      ...emptyForm,
      id: `CSC-${Math.floor(1000 + Math.random() * 9000)}`,
      acquiredDate: new Date().toISOString().slice(0, 10),
    });
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setShowPartModal(true);
  };

  const openEdit = (part) => {
    setForm({ ...part });
    setEditingId(part.id);
    setShowPartModal(true);
  };

  const savePart = async (e) => {
  e.preventDefault();
  console.log("SAVE BUTTON CLICKED");
    e.preventDefault();
    const payload = {
      ...form,
      stockQty: Number(form.stockQty),
      price: Number(form.price),
      cost: Number(form.cost),
      createdBy: editingId ? form.createdBy : currentUser?.name || "System",
      updatedAt: nowStamp(),
    };

    try {
      if (mode === "cloud") {
        const { data, error } = await supabase
          .from("parts_inventory")
          .upsert(normalizePartForDb(payload))
          .select();
        if (error) throw error;
        const saved = normalizePartForUI(data?.[0] || payload);
        const updatedParts = editingId
          ? system.parts.map((item) => (item.id === editingId ? saved : item))
          : [saved, ...system.parts];
        setSystem((prev) => ({ ...prev, parts: updatedParts }));
        setSelectedPart(saved);
      } else {
        const updatedParts = editingId
          ? system.parts.map((item) => (item.id === editingId ? payload : item))
          : [payload, ...system.parts];
        setSystem((prev) => ({ ...prev, parts: updatedParts }));
        setSelectedPart(payload);
      }

      setShowPartModal(false);
      resetForm();
      setActiveTab("inventory");
      showBanner(editingId ? "Part updated successfully." : "Part added successfully.");
    } catch (error) {
      showBanner(error.message || "Unable to save part.");
    }
  };

  const deletePart = async (partId) => {
    try {
      if (mode === "cloud") {
        const { error } = await supabase.from("parts_inventory").delete().eq("id", partId);
        if (error) throw error;
      }

      const updatedParts = system.parts.filter((item) => item.id !== partId);
      setSystem((prev) => ({ ...prev, parts: updatedParts }));
      if (selectedPart?.id === partId) setSelectedPart(updatedParts[0] || null);
      showBanner("Part deleted successfully.");
    } catch (error) {
      showBanner(error.message || "Unable to delete part.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-cyan-300" />
          <p className="mt-4 text-slate-300">Loading inventory system...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <LoginScreen
        mode={mode}
        onLogin={handleLogin}
        onRegister={handleRegister}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        registerForm={registerForm}
        setRegisterForm={setRegisterForm}
        loginError={loginError}
        registerError={registerError}
        loading={authLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.16),_transparent_28%),radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_24%),linear-gradient(to_bottom,_#020617,_#020617)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex flex-col gap-6 p-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                {mode === "cloud" ? <Cloud className="h-3.5 w-3.5" /> : <Database className="h-3.5 w-3.5" />}
                {mode === "cloud" ? "Cloud Inventory System" : "Demo Inventory System"} · Covedale Service Center · Cincinnati, Ohio
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Parts Inventory + Real Auth Portal
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                Built for real daily use with searchable part records, VIN source history, fitment tracking, pricing, staff access, and deployment-ready Supabase support.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-slate-900/55 px-4 py-3">
                <p className="text-xs text-slate-500">Signed in as</p>
                <div className="mt-1 flex items-center gap-2 text-sm text-white">
                  {currentUser.role === "Admin" ? <Shield className="h-4 w-4 text-cyan-300" /> : <User className="h-4 w-4 text-cyan-300" />}
                  {currentUser.name} · {currentUser.role}
                </div>
              </div>
              {mode === "cloud" && (
                <button
                  onClick={refreshCloud}
                  className="inline-flex items-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
                >
                  <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} /> Sync
                </button>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" /> Log Out
              </button>
            </div>
          </div>
        </motion.div>

        {banner && (
          <div className="mb-6 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
            {banner}
          </div>
        )}

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Units" value={stats.totalUnits} icon={Package} subtitle="All live inventory units in the system" />
          <StatCard title="Inventory Value" value={`$${stats.inventoryValue.toLocaleString()}`} icon={DollarSign} subtitle="Based on current retail pricing" />
          <StatCard title="Low Stock Alerts" value={stats.lowStock} icon={AlertCircle} subtitle="Parts with quantity at 1 or below" />
          <StatCard title="Inspection Needed" value={stats.inspections} icon={Clock3} subtitle="Items that still need verification" />
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {[
            ["dashboard", "Dashboard"],
            ["inventory", "Inventory"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                activeTab === key
                  ? "border-cyan-300/30 bg-cyan-400/15 text-cyan-200"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}

          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-400/15 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
          >
            <Plus className="h-4 w-4" /> Add Part
          </button>

          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10">
            <Upload className="h-4 w-4" /> Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={handleImportJson} />
          </label>

          <button
            onClick={downloadSetupFiles}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            <KeyRound className="h-4 w-4" /> Setup Files
          </button>
        </div>

        {activeTab === "dashboard" && (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Recent Inventory Activity</h2>
                  <p className="mt-1 text-sm text-slate-400">Newest records added or updated in the system</p>
                </div>
              </div>
              <div className="space-y-3">
                {system.parts.slice(0, 5).map((part) => (
                  <div key={part.id} className="rounded-3xl border border-white/10 bg-slate-900/45 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium text-white">{part.partName}</h3>
                          <StatusBadge status={part.status} />
                        </div>
                        <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                          <p><span className="text-slate-500">Part ID:</span> {part.id}</p>
                          <p><span className="text-slate-500">Source VIN:</span> {part.sourceVin}</p>
                          <p><span className="text-slate-500">Source Vehicle:</span> {part.sourceVehicle}</p>
                          <p><span className="text-slate-500">Fits:</span> {part.fitsVehicle}</p>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-2xl font-semibold text-white">${part.price}</p>
                        <p className="mt-2 text-sm text-slate-400">Updated: {part.updatedAt}</p>
                        <p className="text-sm text-slate-400">By: {part.createdBy}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
                <h2 className="text-xl font-semibold">Production Checklist</h2>
                <div className="mt-4 grid gap-3">
                  {[
                    "Supabase-ready cloud database wiring included",
                    "Real sign-up and sign-in flow included",
                    "Role support through user_profiles table",
                    "Import and export tools for inventory migration",
                    "Deploy-ready for Vercel after adding env vars",
                    "Still works in local demo mode before launch",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-slate-200">
                      <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
                <h2 className="text-xl font-semibold">Deployment Path</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <p className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">1. Create Supabase project and run the generated SQL.</p>
                  <p className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">2. Add your Supabase URL and anon key in this file or environment variables.</p>
                  <p className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">3. Deploy to Vercel so the shop can access it online from any device.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Inventory Records</h2>
                  <p className="mt-1 text-sm text-slate-400">Search by VIN, vehicle, fitment, part ID, OEM number, or location.</p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search inventory..."
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/60 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500"
                    />
                  </div>

                  <div className="relative">
                    <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-900/60 py-3 pl-10 pr-4 text-sm text-white outline-none"
                    >
                      <option>All</option>
                      {categories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none"
                  >
                    <option>All</option>
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-3">
                {filteredParts.map((part) => (
                  <button
                    key={part.id}
                    onClick={() => setSelectedPart(part)}
                    className={`rounded-3xl border p-4 text-left transition ${
                      selectedPart?.id === part.id ? "border-cyan-300/30 bg-cyan-400/10" : "border-white/10 bg-slate-900/50 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-white">{part.partName}</h3>
                          <StatusBadge status={part.status} />
                        </div>
                        <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                          <p><span className="text-slate-500">Part ID:</span> {part.id}</p>
                          <p><span className="text-slate-500">Category:</span> {part.category}</p>
                          <p><span className="text-slate-500">Source VIN:</span> {part.sourceVin}</p>
                          <p><span className="text-slate-500">Source Car:</span> {part.sourceVehicle}</p>
                          <p><span className="text-slate-500">Fits:</span> {part.fitsVehicle}</p>
                          <p><span className="text-slate-500">Location:</span> {part.location}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 xl:min-w-[180px]">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                          <p className="text-slate-400">Price</p>
                          <p className="text-2xl font-semibold text-white">${part.price}</p>
                          <p className="mt-2 text-slate-400">Qty: {part.stockQty}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPart(part);
                            }}
                            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10"
                          >
                            <span className="inline-flex items-center gap-2"><Eye className="h-3.5 w-3.5" /> View</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(part);
                            }}
                            className="flex-1 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100 hover:bg-cyan-400/20"
                          >
                            <span className="inline-flex items-center gap-2"><Pencil className="h-3.5 w-3.5" /> Edit</span>
                          </button>
                          {currentUser.role === "Admin" && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deletePart(part.id);
                              }}
                              className="rounded-2xl border border-rose-300/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-100 hover:bg-rose-500/20"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
              {selectedPart ? (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-cyan-200">Part Details</p>
                      <h2 className="mt-1 text-2xl font-semibold">{selectedPart.partName}</h2>
                      <p className="mt-2 text-sm text-slate-400">{selectedPart.id}</p>
                    </div>
                    <StatusBadge status={selectedPart.status} />
                  </div>

                  <div className="mt-6 space-y-4 text-sm">
                    <div className="rounded-3xl border border-white/10 bg-slate-900/45 p-4">
                      <div className="mb-3 flex items-center gap-2 text-slate-200">
                        <Car className="h-4 w-4 text-cyan-300" /> Source Information
                      </div>
                      <div className="space-y-2 text-slate-300">
                        <p><span className="text-slate-500">VIN:</span> {selectedPart.sourceVin}</p>
                        <p><span className="text-slate-500">Vehicle:</span> {selectedPart.sourceVehicle}</p>
                        <p><span className="text-slate-500">Future Fitment:</span> {selectedPart.fitsVehicle}</p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-slate-900/45 p-4">
                      <div className="mb-3 flex items-center gap-2 text-slate-200">
                        <DollarSign className="h-4 w-4 text-cyan-300" /> Pricing & Inventory
                      </div>
                      <div className="grid gap-2 text-slate-300 sm:grid-cols-2">
                        <p><span className="text-slate-500">Retail Price:</span> ${selectedPart.price}</p>
                        <p><span className="text-slate-500">Internal Cost:</span> ${selectedPart.cost}</p>
                        <p><span className="text-slate-500">Quantity:</span> {selectedPart.stockQty}</p>
                        <p><span className="text-slate-500">Warranty:</span> {selectedPart.warranty}</p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-slate-900/45 p-4">
                      <div className="mb-3 flex items-center gap-2 text-slate-200">
                        <MapPin className="h-4 w-4 text-cyan-300" /> Storage & Metadata
                      </div>
                      <div className="space-y-2 text-slate-300">
                        <p><span className="text-slate-500">Location:</span> {selectedPart.location}</p>
                        <p><span className="text-slate-500">Supplier:</span> {selectedPart.supplier}</p>
                        <p><span className="text-slate-500">Acquired:</span> {selectedPart.acquiredDate}</p>
                        <p><span className="text-slate-500">Condition:</span> {selectedPart.condition}</p>
                        <p><span className="text-slate-500">OEM #:</span> {selectedPart.oemNumber}</p>
                        <p><span className="text-slate-500">Updated At:</span> {selectedPart.updatedAt}</p>
                        <p><span className="text-slate-500">Created By:</span> {selectedPart.createdBy}</p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-slate-900/45 p-4">
                      <div className="mb-3 flex items-center gap-2 text-slate-200">
                        <FileText className="h-4 w-4 text-cyan-300" /> Notes
                      </div>
                      <p className="leading-6 text-slate-300">{selectedPart.notes || "No notes recorded for this part yet."}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[300px] items-center justify-center text-slate-400">Select a part to view details.</div>
              )}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showPartModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className="w-full max-w-5xl rounded-[30px] border border-white/10 bg-slate-950 p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{editingId ? "Edit Inventory Part" : "Add Inventory Part"}</h2>
                  <p className="mt-1 text-sm text-slate-400">Capture VIN source, fitment, pricing, stock, and intake details.</p>
                </div>
                <button
                  onClick={() => {
                    setShowPartModal(false);
                    resetForm();
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={savePart} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Part ID">
                  <input value={form.id} onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none" required />
                </Field>
                <Field label="Part Name">
                  <input value={form.partName} onChange={(e) => setForm((p) => ({ ...p, partName: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none" required />
                </Field>
                <Field label="Category">
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none">
                    {categories.map((category) => <option key={category}>{category}</option>)}
                  </select>
                </Field>
                <Field label="Source VIN">
                  <input value={form.sourceVin} onChange={(e) => setForm((p) => ({ ...p, sourceVin: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none" required />
                </Field>
                <Field label="Source Vehicle">
                  <input value={form.sourceVehicle} onChange={(e) => setForm((p) => ({ ...p, sourceVehicle: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none" required />
                </Field>
                <Field label="Future Fitment">
                  <input value={form.fitsVehicle} onChange={(e) => setForm((p) => ({ ...p, fitsVehicle: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none" required />
                </Field>
                <Field label="OEM Number">
                  <input value={form.oemNumber} onChange={(e) => setForm((p) => ({ ...p, oemNumber: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none" />
                </Field>
                <Field label="Condition">
                  <select value={form.condition} onChange={(e) => setForm((p) => ({ ...p, condition: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none">
                    {conditions.map((condition) => <option key={condition}>{condition}</option>)}
                  </select>
                </Field>
                <Field label="Status">
                  <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none">
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </Field>
                <Field label="Stock Quantity">
                  <input type="number" value={form.stockQty} onChange={(e) => setForm((p) => ({ ...p, stockQty: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none" required />
                </Field>
                <Field label="Retail Price">
                  <input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none" required />
                </Field>
                <Field label="Internal Cost">
                  <input type="number" value={form.cost} onChange={(e) => setForm((p) => ({ ...p, cost: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none" />
                </Field>
                <Field label="Storage Location">
                  <input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none" required />
                </Field>
                <Field label="Supplier">
                  <input value={form.supplier} onChange={(e) => setForm((p) => ({ ...p, supplier: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none" />
                </Field>
                <Field label="Acquired Date">
                  <input type="date" value={form.acquiredDate} onChange={(e) => setForm((p) => ({ ...p, acquiredDate: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none" />
                </Field>
                <Field label="Warranty">
                  <input value={form.warranty} onChange={(e) => setForm((p) => ({ ...p, warranty: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none" />
                </Field>
                <label className="block md:col-span-2 xl:col-span-3">
                  <span className="mb-2 block text-sm text-slate-300">Notes</span>
                  <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={4} className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none" placeholder="Damage notes, test notes, interchange notes, cosmetic details, etc." />
                </label>
                <div className="md:col-span-2 xl:col-span-3 flex flex-wrap gap-3 pt-2">
                  <button type="submit" className="rounded-2xl border border-cyan-300/30 bg-cyan-400/15 px-5 py-3 font-medium text-cyan-100 transition hover:bg-cyan-400/20">
                    {editingId ? "Save Changes" : "Add Inventory Item"}
                  </button>
                  <button type="button" onClick={resetForm} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-slate-200 transition hover:bg-white/10">
                    Reset
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
