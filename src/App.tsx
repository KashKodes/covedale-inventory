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
  Download,
  ChevronRight,
} from "lucide-react";

const STORAGE_KEY = "covedale_inventory_system_mobile_v1";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const isCloudMode = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const supabase = isCloudMode
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

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
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function saveLocalSystem(data: any) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadLocalSystem() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  const starter = { users: seedUsers, parts: seedParts };
  saveLocalSystem(starter);
  return starter;
}

function normalizePartForUI(part: any) {
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

function normalizePartForDb(part: any) {
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

function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "In Stock": "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
    Reserved: "bg-amber-500/15 text-amber-300 border-amber-400/20",
    Sold: "bg-slate-500/15 text-slate-300 border-slate-400/20",
    "Inspection Needed":
      "bg-rose-500/15 text-rose-300 border-rose-400/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
        styles[status] || "bg-white/10 text-white border-white/10"
      }`}
    >
      {status}
    </span>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: any;
  subtitle: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            {value}
          </h3>
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
        </div>
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3">
          <Icon className="h-5 w-5 text-cyan-300" />
        </div>
      </div>
    </motion.div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      {children}
    </label>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
      <h2 className="text-xl font-semibold">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </div>
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
}: any) {
  const [tab, setTab] = useState("login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.14),_transparent_24%),linear-gradient(to_bottom,_#020617,_#020617)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-400/10">
            <Wrench className="h-8 w-8 text-cyan-300" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-white sm:text-3xl">
            Covedale Service Center
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Inventory access for shop staff and administrators
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/50 px-3 py-1 text-xs text-slate-300">
            {mode === "cloud" ? (
              <Cloud className="h-3.5 w-3.5 text-cyan-300" />
            ) : (
              <Database className="h-3.5 w-3.5 text-cyan-300" />
            )}
            {mode === "cloud" ? "Cloud production mode" : "Local demo mode"}
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-slate-900/45 p-1">
          <button
            onClick={() => setTab("login")}
            className={`rounded-xl px-4 py-2.5 text-sm ${
              tab === "login" ? "bg-cyan-400/15 text-cyan-100" : "text-slate-300"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab("register")}
            className={`rounded-xl px-4 py-2.5 text-sm ${
              tab === "register"
                ? "bg-cyan-400/15 text-cyan-100"
                : "text-slate-300"
            }`}
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
                  onChange={(e) =>
                    setLoginForm((prev: any) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
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
                  onChange={(e) =>
                    setLoginForm((prev: any) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
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
                onChange={(e) =>
                  setRegisterForm((prev: any) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                placeholder="Enter full name"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm((prev: any) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                placeholder="Enter work email"
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm((prev: any) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
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
              {loading
                ? "Creating Account..."
                : mode === "cloud"
                ? "Create Cloud Account"
                : "Create Demo Account"}
            </button>
          </form>
        )}

        {mode === "local" && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/45 p-4 text-sm text-slate-300">
            <p className="font-medium text-white">Demo credentials</p>
            <p className="mt-2">
              Admin: admin@covedaleservicecenter.com / admin123
            </p>
            <p>Staff: staff@covedaleservicecenter.com / staff123</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function PartDetailsContent({ part }: { part: any }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="rounded-3xl border border-white/10 bg-slate-900/45 p-4">
        <div className="mb-3 flex items-center gap-2 text-slate-200">
          <Car className="h-4 w-4 text-cyan-300" /> Source Information
        </div>
        <div className="space-y-2 text-slate-300">
          <p>
            <span className="text-slate-500">VIN:</span> {part.sourceVin}
          </p>
          <p>
            <span className="text-slate-500">Vehicle:</span> {part.sourceVehicle}
          </p>
          <p>
            <span className="text-slate-500">Future Fitment:</span>{" "}
            {part.fitsVehicle}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-900/45 p-4">
        <div className="mb-3 flex items-center gap-2 text-slate-200">
          <DollarSign className="h-4 w-4 text-cyan-300" /> Pricing & Inventory
        </div>
        <div className="grid gap-2 text-slate-300 sm:grid-cols-2">
          <p>
            <span className="text-slate-500">Retail Price:</span> ${part.price}
          </p>
          <p>
            <span className="text-slate-500">Internal Cost:</span> ${part.cost}
          </p>
          <p>
            <span className="text-slate-500">Quantity:</span> {part.stockQty}
          </p>
          <p>
            <span className="text-slate-500">Warranty:</span> {part.warranty}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-900/45 p-4">
        <div className="mb-3 flex items-center gap-2 text-slate-200">
          <MapPin className="h-4 w-4 text-cyan-300" /> Storage & Metadata
        </div>
        <div className="space-y-2 text-slate-300">
          <p>
            <span className="text-slate-500">Location:</span> {part.location}
          </p>
          <p>
            <span className="text-slate-500">Supplier:</span> {part.supplier}
          </p>
          <p>
            <span className="text-slate-500">Acquired:</span> {part.acquiredDate}
          </p>
          <p>
            <span className="text-slate-500">Condition:</span> {part.condition}
          </p>
          <p>
            <span className="text-slate-500">OEM #:</span> {part.oemNumber}
          </p>
          <p>
            <span className="text-slate-500">Updated At:</span> {part.updatedAt}
          </p>
          <p>
            <span className="text-slate-500">Created By:</span> {part.createdBy}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-900/45 p-4">
        <div className="mb-3 flex items-center gap-2 text-slate-200">
          <FileText className="h-4 w-4 text-cyan-300" /> Notes
        </div>
        <p className="leading-6 text-slate-300">
          {part.notes || "No notes recorded for this part yet."}
        </p>
      </div>
    </div>
  );
}

export default function CovedaleInventoryMobileOptimizedApp() {
  const [mode] = useState(isCloudMode ? "cloud" : "local");
  const [system, setSystem] = useState<{ users: any[]; parts: any[] }>({
    users: [],
    parts: [],
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loginForm, setLoginForm] = useState({
    email: mode === "local" ? "admin@covedaleservicecenter.com" : "",
    password: mode === "local" ? "admin123" : "",
  });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPart, setSelectedPart] = useState<any>(null);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);
  const [showPartModal, setShowPartModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({
    ...emptyForm,
    id: `CSC-${Math.floor(1000 + Math.random() * 9000)}`,
  });
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [banner, setBanner] = useState("");

  const showBanner = (text: string) => {
    setBanner(text);
    window.clearTimeout((showBanner as any)._timer);
    (showBanner as any)._timer = window.setTimeout(() => setBanner(""), 3000);
  };

  const bootLocal = () => {
    const loaded = loadLocalSystem();
    const normalizedParts = (loaded.parts || []).map(normalizePartForUI);
    setSystem({ users: loaded.users || [], parts: normalizedParts });
    setSelectedPart(normalizedParts[0] || null);
    setLoading(false);
  };

  const fetchCloudParts = async () => {
    const { data, error } = await supabase!
      .from("parts_inventory")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;
    const normalized = (data || []).map(normalizePartForUI);
    setSystem((prev) => ({ ...prev, parts: normalized }));
    setSelectedPart(
      (current) =>
        normalized.find((item) => item.id === current?.id) ||
        normalized[0] ||
        null
    );
  };

  const hydrateCloudUser = async (authUser?: any) => {
    const user = authUser || (await supabase!.auth.getUser()).data.user;
    if (!user) return null;

    const { data: profile } = await supabase!
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
    let unsubscribe: any;

    const init = async () => {
      try {
        if (mode === "cloud") {
          const { data: sessionData } = await supabase!.auth.getSession();
          if (!mounted) return;

          if (sessionData.session?.user) {
            await hydrateCloudUser(sessionData.session.user);
            await fetchCloudParts();
          }

          const { data } = supabase!.auth.onAuthStateChange(
            async (_event, session) => {
              if (!mounted) return;
              if (session?.user) {
                await hydrateCloudUser(session.user);
                await fetchCloudParts();
              } else {
                setCurrentUser(null);
              }
            }
          );
          unsubscribe = data.subscription.unsubscribe;
          setLoading(false);
          return;
        }

        bootLocal();
      } catch (error: any) {
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

      const matchesCategory =
        categoryFilter === "All" || part.category === categoryFilter;
      const matchesStatus =
        statusFilter === "All" || part.status === statusFilter;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [system.parts, query, categoryFilter, statusFilter]);

  const stats = useMemo(() => {
    const totalUnits = system.parts.reduce(
      (sum, item) => sum + Number(item.stockQty || 0),
      0
    );
    const inventoryValue = system.parts.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.stockQty || 0),
      0
    );
    const lowStock = system.parts.filter(
      (item) => Number(item.stockQty) <= 1
    ).length;
    const inspections = system.parts.filter(
      (item) => item.status === "Inspection Needed"
    ).length;
    return { totalUnits, inventoryValue, lowStock, inspections };
  }, [system.parts]);

  const handleLogin = async () => {
    setAuthLoading(true);
    setLoginError("");
    try {
      if (mode === "cloud") {
        const { data, error } = await supabase!.auth.signInWithPassword({
          email: loginForm.email,
          password: loginForm.password,
        });
        if (error) throw error;
        await hydrateCloudUser(data.user);
        await fetchCloudParts();
      } else {
        const match = system.users.find(
          (user) =>
            user.email.toLowerCase() === loginForm.email.toLowerCase() &&
            user.password === loginForm.password
        );
        if (!match) throw new Error("Invalid email or password.");
        setCurrentUser(match);
      }
    } catch (error: any) {
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
        const { data, error } = await supabase!.auth.signUp({
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
          const { error: profileError } = await supabase!
            .from("user_profiles")
            .upsert({
              id: data.user.id,
              full_name: registerForm.name,
              role: "Staff",
              email: registerForm.email,
            });
          if (profileError) throw profileError;
        }

        showBanner("Cloud account created. Sign in with your new credentials.");
      } else {
        const exists = system.users.some(
          (u) => u.email.toLowerCase() === registerForm.email.toLowerCase()
        );
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
    } catch (error: any) {
      setRegisterError(error.message || "Unable to create account.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (mode === "cloud") {
      await supabase!.auth.signOut();
    }
    setCurrentUser(null);
  };

  const refreshCloud = async () => {
    if (mode !== "cloud") return;
    setSyncing(true);
    try {
      await fetchCloudParts();
      showBanner("Inventory synced from cloud database.");
    } catch (error: any) {
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
        .map((key) => `"${String((part as any)[key] ?? "").replaceAll('"', '""')}"`)
        .join(",")
    );

    downloadTextFile(
      "covedale-inventory-export.csv",
      [headers.join(","), ...rows].join("\n")
    );
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

  const openEdit = (part: any) => {
    setForm({ ...part });
    setEditingId(part.id);
    setShowPartModal(true);
  };

  const openPartDetails = (part: any) => {
    setSelectedPart(part);
    if (window.innerWidth < 1024) {
      setMobileDetailsOpen(true);
    }
  };

  const savePart = async (e: React.FormEvent) => {
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
        const { data, error } = await supabase!
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
    } catch (error: any) {
      showBanner(error.message || "Unable to save part.");
    }
  };

  const deletePart = async (partId: string) => {
    try {
      if (mode === "cloud") {
        const { error } = await supabase!
          .from("parts_inventory")
          .delete()
          .eq("id", partId);
        if (error) throw error;
      }

      const updatedParts = system.parts.filter((item) => item.id !== partId);
      setSystem((prev) => ({ ...prev, parts: updatedParts }));
      if (selectedPart?.id === partId) setSelectedPart(updatedParts[0] || null);
      showBanner("Part deleted successfully.");
      setMobileDetailsOpen(false);
    } catch (error: any) {
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

      <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex flex-col gap-5 p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                {mode === "cloud" ? (
                  <Cloud className="h-3.5 w-3.5" />
                ) : (
                  <Database className="h-3.5 w-3.5" />
                )}
                {mode === "cloud" ? "Cloud Inventory System" : "Demo Inventory System"} · Covedale Service Center
              </div>

              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Parts Inventory Portal
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                Track sourced parts by VIN, fitment, pricing, quantity, and storage
                location in one clean shop-ready system.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[340px]">
              <div className="rounded-2xl border border-white/10 bg-slate-900/55 px-4 py-3">
                <p className="text-xs text-slate-500">Signed in as</p>
                <div className="mt-1 flex items-center gap-2 text-sm text-white">
                  {currentUser.role === "Admin" ? (
                    <Shield className="h-4 w-4 text-cyan-300" />
                  ) : (
                    <User className="h-4 w-4 text-cyan-300" />
                  )}
                  {currentUser.name} · {currentUser.role}
                </div>
              </div>

              <div className="flex gap-3 sm:justify-end">
                {mode === "cloud" && (
                  <button
                    onClick={refreshCloud}
                    className="flex-1 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20 sm:flex-none"
                  >
                    <span className="inline-flex items-center gap-2">
                      <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                      Sync
                    </span>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 sm:flex-none"
                >
                  <span className="inline-flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {banner && (
          <div className="mb-6 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
            {banner}
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Units"
            value={stats.totalUnits}
            icon={Package}
            subtitle="All inventory units"
          />
          <StatCard
            title="Inventory Value"
            value={`$${stats.inventoryValue.toLocaleString()}`}
            icon={DollarSign}
            subtitle="Current retail pricing"
          />
          <StatCard
            title="Low Stock Alerts"
            value={stats.lowStock}
            icon={AlertCircle}
            subtitle="Quantity at 1 or below"
          />
          <StatCard
            title="Inspection Needed"
            value={stats.inspections}
            icon={Clock3}
            subtitle="Items awaiting verification"
          />
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
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
          </div>

          <div className="flex flex-col gap-3 sm:ml-auto sm:flex-row sm:flex-wrap">
            <button
              onClick={openCreate}
              className="rounded-2xl border border-cyan-300/30 bg-cyan-400/15 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
            >
              <span className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Part
              </span>
            </button>

            <button
              onClick={exportCsv}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              <span className="inline-flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </span>
            </button>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <SectionCard
              title="Recent Inventory Activity"
              description="Newest records added or updated in the system"
            >
              <div className="space-y-3">
                {system.parts.slice(0, 5).map((part) => (
                  <button
                    key={part.id}
                    onClick={() => openPartDetails(part)}
                    className="w-full rounded-3xl border border-white/10 bg-slate-900/45 p-4 text-left transition hover:bg-white/10"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium text-white">{part.partName}</h3>
                          <StatusBadge status={part.status} />
                        </div>
                        <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                          <p>
                            <span className="text-slate-500">Part ID:</span> {part.id}
                          </p>
                          <p>
                            <span className="text-slate-500">Source VIN:</span>{" "}
                            {part.sourceVin}
                          </p>
                          <p>
                            <span className="text-slate-500">Source Vehicle:</span>{" "}
                            {part.sourceVehicle}
                          </p>
                          <p>
                            <span className="text-slate-500">Fits:</span>{" "}
                            {part.fitsVehicle}
                          </p>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-2xl font-semibold text-white">
                          ${part.price}
                        </p>
                        <p className="mt-2 text-sm text-slate-400">
                          Updated: {part.updatedAt}
                        </p>
                        <p className="text-sm text-slate-400">By: {part.createdBy}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </SectionCard>

            <div className="space-y-6">
              <SectionCard title="System Highlights">
                <div className="grid gap-3">
                  {[
                    "Secure staff login with cloud-backed access",
                    "VIN source tracking for every inventory item",
                    "Future fitment tracking for compatible vehicles",
                    "Pricing, cost, quantity, warranty, and supplier fields",
                    "Clean search, edit, and inventory workflow",
                    "Built for daily shop use across desktop and mobile browsers",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-slate-200"
                    >
                      <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                      {item}
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Built for Covedale Service Center">
                <div className="space-y-3 text-sm text-slate-300">
                  <p className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                    Track every part by source VIN, source vehicle, and future fitment
                    in one place.
                  </p>
                  <p className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                    Give staff a polished internal system for inventory lookup,
                    intake, pricing, and updates.
                  </p>
                  <p className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                    Present a clean, professional product experience that is ready
                    for real shop operations.
                  </p>
                </div>
              </SectionCard>
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <SectionCard
              title="Inventory Records"
              description="Search by VIN, vehicle, fitment, part ID, OEM number, or location."
            >
              <div className="mb-5 grid gap-3 md:grid-cols-3">
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

              <div className="grid gap-3">
                {filteredParts.map((part) => (
                  <div
                    key={part.id}
                    className={`rounded-3xl border p-4 transition ${
                      selectedPart?.id === part.id
                        ? "border-cyan-300/30 bg-cyan-400/10"
                        : "border-white/10 bg-slate-900/50 hover:bg-white/10"
                    }`}
                  >
                    <button
                      onClick={() => openPartDetails(part)}
                      className="w-full text-left"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-semibold text-white">
                                {part.partName}
                              </h3>
                              <StatusBadge status={part.status} />
                            </div>
                            <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                              <p>
                                <span className="text-slate-500">Part ID:</span>{" "}
                                {part.id}
                              </p>
                              <p>
                                <span className="text-slate-500">Category:</span>{" "}
                                {part.category}
                              </p>
                              <p>
                                <span className="text-slate-500">VIN:</span>{" "}
                                {part.sourceVin}
                              </p>
                              <p>
                                <span className="text-slate-500">Fits:</span>{" "}
                                {part.fitsVehicle}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-2xl font-semibold text-white">
                              ${part.price}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              Qty: {part.stockQty}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-slate-400">
                          <span>{part.location}</span>
                          <span className="inline-flex items-center gap-1 text-cyan-200">
                            View Details <ChevronRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </button>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => openPartDetails(part)}
                        className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-200 hover:bg-white/10"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          View
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openEdit(part)}
                        className="flex-1 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-3 text-sm text-cyan-100 hover:bg-cyan-400/20"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Pencil className="h-4 w-4" />
                          Edit
                        </span>
                      </button>

                      {currentUser.role === "Admin" && (
                        <button
                          type="button"
                          onClick={() => deletePart(part.id)}
                          className="rounded-2xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 hover:bg-rose-500/20"
                        >
                          <span className="inline-flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <div className="hidden lg:block">
              <SectionCard title="Part Details">
                {selectedPart ? (
                  <>
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-cyan-200">Selected Part</p>
                        <h2 className="mt-1 text-2xl font-semibold">
                          {selectedPart.partName}
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                          {selectedPart.id}
                        </p>
                      </div>
                      <StatusBadge status={selectedPart.status} />
                    </div>
                    <PartDetailsContent part={selectedPart} />
                  </>
                ) : (
                  <div className="flex min-h-[300px] items-center justify-center text-slate-400">
                    Select a part to view details.
                  </div>
                )}
              </SectionCard>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {mobileDetailsOpen && selectedPart && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="flex h-[100dvh] flex-col bg-slate-950"
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/10 p-4">
                <div>
                  <p className="text-sm text-cyan-200">Part Details</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {selectedPart.partName}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">{selectedPart.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedPart.status} />
                  <button
                    onClick={() => setMobileDetailsOpen(false)}
                    className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <PartDetailsContent part={selectedPart} />
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-white/10 p-4">
                <button
                  onClick={() => {
                    setMobileDetailsOpen(false);
                    openEdit(selectedPart);
                  }}
                  className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-100"
                >
                  <span className="inline-flex items-center gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </span>
                </button>

                {currentUser.role === "Admin" ? (
                  <button
                    onClick={() => deletePart(selectedPart.id)}
                    className="rounded-2xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => setMobileDetailsOpen(false)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200"
                  >
                    Close
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPartModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.99 }}
              className="flex h-[100dvh] w-full flex-col overflow-hidden bg-slate-950 sm:m-4 sm:h-[calc(100dvh-2rem)] sm:rounded-[30px] sm:border sm:border-white/10"
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/10 p-4 sm:p-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {editingId ? "Edit Inventory Part" : "Add Inventory Part"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Capture VIN source, fitment, pricing, stock, and intake details.
                  </p>
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

              <form
                onSubmit={savePart}
                className="flex min-h-0 flex-1 flex-col"
              >
                <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Field label="Part ID">
                      <input
                        value={form.id}
                        onChange={(e) =>
                          setForm((p: any) => ({ ...p, id: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                        required
                      />
                    </Field>

                    <Field label="Part Name">
                      <input
                        value={form.partName}
                        onChange={(e) =>
                          setForm((p: any) => ({
                            ...p,
                            partName: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                        required
                      />
                    </Field>

                    <Field label="Category">
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm((p: any) => ({
                            ...p,
                            category: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                      >
                        {categories.map((category) => (
                          <option key={category}>{category}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Source VIN">
                      <input
                        value={form.sourceVin}
                        onChange={(e) =>
                          setForm((p: any) => ({
                            ...p,
                            sourceVin: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                        required
                      />
                    </Field>

                    <Field label="Source Vehicle">
                      <input
                        value={form.sourceVehicle}
                        onChange={(e) =>
                          setForm((p: any) => ({
                            ...p,
                            sourceVehicle: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                        required
                      />
                    </Field>

                    <Field label="Future Fitment">
                      <input
                        value={form.fitsVehicle}
                        onChange={(e) =>
                          setForm((p: any) => ({
                            ...p,
                            fitsVehicle: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                        required
                      />
                    </Field>

                    <Field label="OEM Number">
                      <input
                        value={form.oemNumber}
                        onChange={(e) =>
                          setForm((p: any) => ({
                            ...p,
                            oemNumber: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                      />
                    </Field>

                    <Field label="Condition">
                      <select
                        value={form.condition}
                        onChange={(e) =>
                          setForm((p: any) => ({
                            ...p,
                            condition: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                      >
                        {conditions.map((condition) => (
                          <option key={condition}>{condition}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Status">
                      <select
                        value={form.status}
                        onChange={(e) =>
                          setForm((p: any) => ({
                            ...p,
                            status: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                      >
                        {statuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Stock Quantity">
                      <input
                        type="number"
                        value={form.stockQty}
                        onChange={(e) =>
                          setForm((p: any) => ({
                            ...p,
                            stockQty: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                        required
                      />
                    </Field>

                    <Field label="Retail Price">
                      <input
                        type="number"
                        value={form.price}
                        onChange={(e) =>
                          setForm((p: any) => ({
                            ...p,
                            price: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                        required
                      />
                    </Field>

                    <Field label="Internal Cost">
                      <input
                        type="number"
                        value={form.cost}
                        onChange={(e) =>
                          setForm((p: any) => ({
                            ...p,
                            cost: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                      />
                    </Field>

                    <Field label="Storage Location">
                      <input
                        value={form.location}
                        onChange={(e) =>
                          setForm((p: any) => ({
                            ...p,
                            location: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                        required
                      />
                    </Field>

                    <Field label="Supplier">
                      <input
                        value={form.supplier}
                        onChange={(e) =>
                          setForm((p: any) => ({
                            ...p,
                            supplier: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                      />
                    </Field>

                    <Field label="Acquired Date">
                      <input
                        type="date"
                        value={form.acquiredDate}
                        onChange={(e) =>
                          setForm((p: any) => ({
                            ...p,
                            acquiredDate: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                      />
                    </Field>

                    <Field label="Warranty">
                      <input
                        value={form.warranty}
                        onChange={(e) =>
                          setForm((p: any) => ({
                            ...p,
                            warranty: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                      />
                    </Field>

                    <label className="block md:col-span-2 xl:col-span-3">
                      <span className="mb-2 block text-sm text-slate-300">
                        Notes
                      </span>
                      <textarea
                        value={form.notes}
                        onChange={(e) =>
                          setForm((p: any) => ({
                            ...p,
                            notes: e.target.value,
                          }))
                        }
                        rows={5}
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none"
                        placeholder="Damage notes, test notes, cosmetic details, interchange notes, etc."
                      />
                    </label>
                  </div>
                </div>

                <div className="grid gap-3 border-t border-white/10 p-4 sm:flex sm:justify-end sm:p-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-slate-200 transition hover:bg-white/10"
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    className="rounded-2xl border border-cyan-300/30 bg-cyan-400/15 px-5 py-3 font-medium text-cyan-100 transition hover:bg-cyan-400/20"
                  >
                    {editingId ? "Save Changes" : "Add Inventory Item"}
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