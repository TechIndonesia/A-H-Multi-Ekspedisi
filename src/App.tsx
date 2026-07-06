import { useState, useEffect, useMemo, useRef, FormEvent } from "react";
import {
  Search,
  Truck,
  Calculator,
  Plus,
  Phone,
  MapPin,
  Layers,
  Send,
  History,
  User,
  Calendar,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Settings,
  AlertCircle,
  Clock,
  Briefcase,
  SlidersHorizontal,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VENDORS, Vendor } from "./data/vendors";

interface ShipmentOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  senderName: string;
  senderPhone: string;
  senderOrigin: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientDestination: string;
  packageName: string;
  packageWeight: number;
  serviceTier: string;
  notes: string;
  createdAt: string;
}

export default function App() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"formulir" | "ongkir" | "resi" | "riwayat">("formulir");

  // Selection state
  const [selectedVendor, setSelectedVendor] = useState<Vendor>(VENDORS[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFeature, setFilterFeature] = useState<"all" | "cargo" | "sameday" | "cod">("all");

  // Admin settings
  const [adminPhone, setAdminPhone] = useState("085366573886");
  const [showAdminConfig, setShowAdminConfig] = useState(false);

  // Form states
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderOrigin, setSenderOrigin] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [recipientDestination, setRecipientDestination] = useState("");
  const [packageName, setPackageName] = useState("");
  const [packageWeight, setPackageWeight] = useState(1);
  const [serviceTier, setServiceTier] = useState("Reguler");
  const [notes, setNotes] = useState("");

  // Tracking states
  const [trackingVendorId, setTrackingVendorId] = useState(VENDORS[0].id);
  const [trackingResi, setTrackingResi] = useState("");

  // History state
  const [history, setHistory] = useState<ShipmentOrder[]>([]);
  const [notification, setNotification] = useState<{ type: "success" | "info"; message: string } | null>(null);

  // Ref for scrolling
  const formRef = useRef<HTMLDivElement>(null);

  // Load persistence from localStorage
  useEffect(() => {
    const savedPhone = localStorage.getItem("indo_exp_admin_phone");
    if (savedPhone) {
      setAdminPhone(savedPhone);
    }

    const savedHistory = localStorage.getItem("indo_exp_shipment_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error parsing shipment history:", e);
      }
    }
  }, []);

  // Filter vendors based on search and filters
  const filteredVendors = useMemo(() => {
    return VENDORS.filter((v) => {
      const matchSearch =
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchSearch) return false;

      if (filterFeature === "cargo") {
        return v.id.includes("cargo") || v.id === "wahana" || v.id === "sap";
      }
      if (filterFeature === "sameday") {
        return v.id === "paxel" || v.id === "anteraja" || v.id === "jne";
      }
      if (filterFeature === "cod") {
        return v.id === "sap" || v.id === "jnt" || v.id === "sicepat";
      }

      return true;
    });
  }, [searchTerm, filterFeature]);

  // Set default tracking vendor whenever selected vendor changes in other contexts
  useEffect(() => {
    setTrackingVendorId(selectedVendor.id);
  }, [selectedVendor]);

  // Save admin phone to localStorage
  const handleSaveAdminPhone = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    setAdminPhone(cleanPhone);
    localStorage.setItem("indo_exp_admin_phone", cleanPhone);
    showTempNotification("success", `Nomor WA Admin berhasil disimpan: ${cleanPhone}`);
  };

  const showTempNotification = (type: "success" | "info", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Submit and Redirect to WhatsApp Admin
  const handleSendToWhatsApp = (e: FormEvent) => {
    e.preventDefault();

    if (!senderName || !senderPhone || !senderOrigin || !recipientName || !recipientPhone || !recipientAddress || !recipientDestination || !packageName) {
      showTempNotification("info", "Harap lengkapi semua kolom formulir wajib pengiriman.");
      return;
    }

    // Format WA Number (e.g. 0812... to 62812...)
    let formattedAdminPhone = adminPhone.trim();
    if (formattedAdminPhone.startsWith("0")) {
      formattedAdminPhone = "62" + formattedAdminPhone.slice(1);
    } else if (formattedAdminPhone.startsWith("+")) {
      formattedAdminPhone = formattedAdminPhone.slice(1);
    }

    // Construct the elegant Message body
    const waMessage = `*PENGIRIMAN BARU - ${selectedVendor.name.toUpperCase()}*

📦 *INFO EKSPEDISI*
• Vendor: ${selectedVendor.name} (${selectedVendor.fullName})
• Layanan: ${serviceTier}

👤 *PENGIRIM (SENDER)*
• Nama: ${senderName}
• No. HP: ${senderPhone}
• Kota Asal: ${senderOrigin}

👤 *PENERIMA (RECIPIENT)*
• Nama: ${recipientName}
• No. HP: ${recipientPhone}
• Kota Tujuan: ${recipientDestination}
• Alamat Lengkap: ${recipientAddress}

📦 *DETAIL PAKET*
• Deskripsi Barang: ${packageName}
• Berat Paket: ${packageWeight} Kg
${notes ? `• Catatan Tambahan: ${notes}` : ""}

---
_Dikirim via Portal Ekspedisi Indonesia_`;

    // Save order in history
    const newOrder: ShipmentOrder = {
      id: "EXP-" + Math.floor(Math.random() * 900000 + 100000),
      vendorId: selectedVendor.id,
      vendorName: selectedVendor.name,
      senderName,
      senderPhone,
      senderOrigin,
      recipientName,
      recipientPhone,
      recipientAddress,
      recipientDestination,
      packageName,
      packageWeight,
      serviceTier,
      notes,
      createdAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    const updatedHistory = [newOrder, ...history].slice(0, 50); // limit to 50
    setHistory(updatedHistory);
    localStorage.setItem("indo_exp_shipment_history", JSON.stringify(updatedHistory));

    // Clear non-contact form values for next use if desired
    setPackageName("");
    setNotes("");

    showTempNotification("success", "Mengalihkan Anda ke WhatsApp Admin...");

    // Redirect to WA
    const waUrl = `https://api.whatsapp.com/send?phone=${formattedAdminPhone}&text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl, "_blank");
  };

  const clearHistory = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua riwayat pengiriman?")) {
      setHistory([]);
      localStorage.removeItem("indo_exp_shipment_history");
      showTempNotification("info", "Semua riwayat pengiriman berhasil dihapus.");
    }
  };

  // Redirect to official Cek Ongkir per kg URL
  const handleRedirectRates = (vendor: Vendor) => {
    showTempNotification("info", `Membuka halaman tarif resmi ${vendor.name}...`);
    window.open(vendor.ratesUrl, "_blank");
  };

  // Redirect to official Tracking URL
  const handleRedirectTracking = (e: FormEvent) => {
    e.preventDefault();
    const vendor = VENDORS.find((v) => v.id === trackingVendorId);
    if (!vendor) return;

    if (trackingResi) {
      showTempNotification("success", `Mengarahkan ke pelacakan resi ${trackingResi} di ${vendor.name}...`);
    } else {
      showTempNotification("info", `Membuka portal pelacakan resmi ${vendor.name}...`);
    }

    // In most cases, opening the official tracking portal is necessary. 
    // We open the official tracking page where user can paste/enter the code easily.
    window.open(vendor.trackingUrl, "_blank");
  };

  // Select vendor and scroll to form
  const handleSelectVendorAndScroll = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setActiveTab("formulir");
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-rose-500 selection:text-white">
      {/* Dynamic Toast Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className={`p-4 rounded-xl shadow-xl border flex items-start gap-3 backdrop-blur-md ${
              notification.type === "success" 
                ? "bg-emerald-50/95 border-emerald-500/30 text-emerald-900" 
                : "bg-blue-50/95 border-blue-500/30 text-blue-900"
            }`}>
              {notification.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              )}
              <div className="text-sm font-medium">{notification.message}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern High-End Top Navigation Bar */}
      <nav id="navbar-portal" className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-rose-600 p-2.5 rounded-xl shadow-md text-white flex items-center justify-center">
                <Truck className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-950 block">Portal Ekspedisi</span>
                <span className="text-xs text-slate-500 font-medium block -mt-1">Directory & WhatsApp Gateway</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-settings"
                onClick={() => setShowAdminConfig(!showAdminConfig)}
                className={`p-2 rounded-xl transition-all duration-200 border flex items-center gap-1.5 text-sm font-medium ${
                  showAdminConfig 
                    ? "bg-slate-100 border-slate-300 text-slate-900" 
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Settings className={`w-4 h-4 ${showAdminConfig ? 'rotate-45' : ''} transition-transform`} />
                <span className="hidden sm:inline">No. WA Admin</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Settings Drawer */}
      <AnimatePresence>
        {showAdminConfig && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="max-w-3xl mx-auto px-4 py-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Ubah Nomor WhatsApp Admin</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Setiap kali formulir kirim paket disubmit, data akan dikirimkan ke nomor WhatsApp yang terdaftar di bawah ini.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 max-w-md">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">WA:</span>
                    <input
                      type="text"
                      placeholder="Contoh: 081234567890"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-mono"
                    />
                  </div>
                  <button
                    onClick={() => handleSaveAdminPhone(adminPhone)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all shadow-sm"
                  >
                    Simpan
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  *Gunakan format nomor HP lokal Indonesia (misal: 0812xxx) atau internasional (misal: 62812xxx).
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200/50 rounded-full text-rose-700 text-xs font-semibold mb-4">
            <span className="w-2 h-2 bg-rose-600 rounded-full animate-ping" />
            12 Vendor Ekspedisi Terintegrasi Resmi
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Hubungkan Pengiriman Anda ke Seluruh Nusantara
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-2xl mx-auto mt-4 leading-relaxed">
            Pilih vendor ekspedisi andalan Anda, isi detail formulir kirim paket ke WhatsApp admin secara instan, atau lakukan pelacakan resi dan cek tarif per kg secara langsung.
          </p>
        </div>
      </header>

      {/* Main Work Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Core Task Selection Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 bg-slate-200/60 p-1.5 rounded-2xl max-w-2xl mx-auto border border-slate-200">
          <button
            onClick={() => setActiveTab("formulir")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex-1 justify-center ${
              activeTab === "formulir"
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Plus className="w-4 h-4 text-rose-600" />
            Isi Formulir WA
          </button>
          
          <button
            onClick={() => setActiveTab("ongkir")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex-1 justify-center ${
              activeTab === "ongkir"
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Calculator className="w-4 h-4 text-emerald-600" />
            Cek Ongkir / Kg
          </button>

          <button
            onClick={() => setActiveTab("resi")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex-1 justify-center ${
              activeTab === "resi"
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Search className="w-4 h-4 text-blue-600" />
            Cek & Lacak Resi
          </button>

          <button
            onClick={() => setActiveTab("riwayat")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex-1 justify-center ${
              activeTab === "riwayat"
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <History className="w-4 h-4 text-slate-600" />
            Riwayat ({history.length})
          </button>
        </div>

        {/* Vendors Directory Filter UI */}
        <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                <Layers className="w-5 h-5 text-rose-600" />
                Pilih Vendor Ekspedisi Terlebih Dahulu
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih ekspedisi di bawah untuk menyesuaikan formulir, cek tarif resmi, atau melacak resi kiriman.
              </p>
            </div>

            {/* Quick search & filter panel */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari ekspedisi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 w-48 transition-all"
                />
              </div>

              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-600">
                <button
                  onClick={() => setFilterFeature("all")}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    filterFeature === "all" ? "bg-white text-slate-950 shadow-xs" : "hover:text-slate-950"
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterFeature("cargo")}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    filterFeature === "cargo" ? "bg-white text-slate-950 shadow-xs" : "hover:text-slate-950"
                  }`}
                >
                  Kargo
                </button>
                <button
                  onClick={() => setFilterFeature("sameday")}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    filterFeature === "sameday" ? "bg-white text-slate-950 shadow-xs" : "hover:text-slate-950"
                  }`}
                >
                  Same Day
                </button>
                <button
                  onClick={() => setFilterFeature("cod")}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    filterFeature === "cod" ? "bg-white text-slate-950 shadow-xs" : "hover:text-slate-950"
                  }`}
                >
                  COD
                </button>
              </div>
            </div>
          </div>

          {/* Vendors grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => {
                const isSelected = selectedVendor.id === vendor.id;
                return (
                  <button
                    key={vendor.id}
                    onClick={() => setSelectedVendor(vendor)}
                    className={`p-4 rounded-2xl text-left border transition-all relative flex flex-col justify-between h-36 ${vendor.hoverColor} ${
                      isSelected
                        ? `bg-slate-50/80 ring-2 ring-slate-900 border-slate-950`
                        : `bg-white border-slate-200`
                    }`}
                  >
                    {/* Selected Badge */}
                    {isSelected && (
                      <span className="absolute top-3 right-3 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                      </span>
                    )}

                    {/* Logo Emblem Placeholder & Initial Text Badge */}
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm text-sm ${vendor.color}`}>
                        {vendor.name.charAt(0)}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                        {vendor.id === 'jnt' ? 'J&T' : vendor.id === 'jnt-cargo' ? 'Cargo' : vendor.id}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-snug line-clamp-1">
                        {vendor.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed font-medium">
                        {vendor.fullName}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-bounce" />
                <p className="text-sm font-medium text-slate-600">Vendor tidak ditemukan</p>
                <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Panels Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Active Work Panel (Form WA, Rates, Tracking, etc.) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Formulir Pengiriman WhatsApp */}
              {activeTab === "formulir" && (
                <motion.div
                  key="form-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  ref={formRef}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  {/* Form Banner Header */}
                  <div className={`p-6 text-white ${selectedVendor.color} transition-all duration-300 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 transform translate-x-6 -translate-y-6 opacity-10 pointer-events-none">
                      <Truck className="w-48 h-48" />
                    </div>
                    
                    <div className="flex flex-wrap justify-between items-center gap-4 relative z-10">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-2">
                          Form Pengiriman WhatsApp
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                          Kirim Paket dengan {selectedVendor.name}
                        </h2>
                        <p className="text-xs text-white/80 mt-1 max-w-xl leading-relaxed">
                          {selectedVendor.description}
                        </p>
                      </div>

                      <div className="bg-white/15 px-4 py-2.5 rounded-2xl border border-white/20 backdrop-blur-xs text-right hidden sm:block shrink-0">
                        <span className="block text-[10px] font-bold text-white/70 uppercase">Tujuan Admin WhatsApp</span>
                        <span className="text-sm font-mono font-bold tracking-wider text-white">{adminPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Form Body */}
                  <form onSubmit={handleSendToWhatsApp} className="p-6 sm:p-8 space-y-6">
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/50 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-950 leading-relaxed">
                        <span className="font-bold block mb-0.5">Konfirmasi Manual & No Automatic Resi Generation:</span>
                        Seluruh data pengiriman akan langsung diformat rapi dan dikirim ke nomor WhatsApp Admin untuk diproses. Resi pengiriman resmi akan dikeluarkan langsung oleh admin setelah fisik paket diterima, bukan dibuat secara otomatis oleh sistem kami.
                      </div>
                    </div>

                    {/* Section 1: Data Pengirim */}
                    <div>
                      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">1</span>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Identitas Pengirim</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nama Pengirim <span className="text-rose-500">*</span></label>
                          <input
                            type="text"
                            required
                            placeholder="Masukkan nama pengirim"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">No. HP Pengirim <span className="text-rose-500">*</span></label>
                          <input
                            type="tel"
                            required
                            placeholder="Contoh: 0812xxxxxxxx"
                            value={senderPhone}
                            onChange={(e) => setSenderPhone(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white transition-all font-mono"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Kota / Kecamatan Asal <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              required
                              placeholder="Kota pengiriman asal (Contoh: Surabaya Selatan)"
                              value={senderOrigin}
                              onChange={(e) => setSenderOrigin(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Data Penerima */}
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">2</span>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Identitas Penerima</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nama Lengkap Penerima <span className="text-rose-500">*</span></label>
                          <input
                            type="text"
                            required
                            placeholder="Masukkan nama penerima"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">No. HP Penerima <span className="text-rose-500">*</span></label>
                          <input
                            type="tel"
                            required
                            placeholder="Contoh: 0857xxxxxxxx"
                            value={recipientPhone}
                            onChange={(e) => setRecipientPhone(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white transition-all font-mono"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Kota / Kecamatan Tujuan <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              required
                              placeholder="Kota pengiriman tujuan (Contoh: Balikpapan Utara)"
                              value={recipientDestination}
                              onChange={(e) => setRecipientDestination(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white transition-all"
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Alamat Lengkap Penerima <span className="text-rose-500">*</span></label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Nama Jalan, RT/RW, Dusun, Kelurahan, Kode Pos"
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white transition-all resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Data Barang */}
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">3</span>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Detail Barang & Layanan</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nama Barang / Jenis Paket <span className="text-rose-500">*</span></label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Pakaian, Sparepart, Dokumen penting"
                            value={packageName}
                            onChange={(e) => setPackageName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Perkiraan Berat (kg) <span className="text-rose-500">*</span></label>
                          <input
                            type="number"
                            required
                            min="0.1"
                            step="0.1"
                            value={packageWeight}
                            onChange={(e) => setPackageWeight(Number(e.target.value))}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white transition-all font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Kategori Layanan</label>
                          <select
                            value={serviceTier}
                            onChange={(e) => setServiceTier(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white transition-all font-semibold"
                          >
                            <option value="Reguler">Reguler (Standar)</option>
                            <option value="Cargo">Cargo (Paket Berat)</option>
                            <option value="Ekonomis">Ekonomis (Hemat)</option>
                            <option value="Same Day">Same Day (Satu Hari)</option>
                            <option value="Next Day">Next Day (Esok Hari)</option>
                            <option value="Instant">Instant (Sangat Cepat)</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Catatan Tambahan (Instruksi Khusus)</label>
                          <input
                            type="text"
                            placeholder="Contoh: Barang mudah pecah, Harap ditaruh teras rumah"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        Terakhir diupdate: Hari Ini, 18:01 WIB
                      </div>
                      
                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98] transition-all text-sm w-full sm:w-auto"
                      >
                        <Send className="w-4 h-4" />
                        Kirim ke WhatsApp Admin 💬
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Tab 2: Cek Ongkir per Kg */}
              {activeTab === "ongkir" && (
                <motion.div
                  key="rates-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl shadow-xs">
                      <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Cek Ongkir Per Kg Resmi</h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Kami mengarahkan Anda langsung ke portal kalkulator tarif resmi untuk akurasi biaya pengiriman terkini.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/50 text-xs text-slate-600 leading-relaxed mb-6">
                    Masing-masing kurir ekspedisi di Indonesia memiliki tarif progresif per kg, asuransi, volume dimensi, dan biaya daerah terpencil yang diperbarui secara langsung di database masing-masing vendor. Klik salah satu kurir di bawah untuk langsung menghitung tarif resmi secara akurat.
                  </div>

                  {/* List of links for rates check */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {VENDORS.map((v) => (
                      <div
                        key={`rate-card-${v.id}`}
                        className="p-4 rounded-2xl border border-slate-150 bg-white flex justify-between items-center hover:shadow-md hover:border-slate-300 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white ${v.color}`}>
                            {v.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-sm block text-slate-900">{v.name}</span>
                            <span className="text-[10px] text-slate-400 block">{v.fullName}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRedirectRates(v)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${v.textColor} ${v.borderColor} group-hover:bg-slate-50 transition-colors`}
                        >
                          Cek Ongkir ↗
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Cek & Lacak Resi */}
              {activeTab === "resi" && (
                <motion.div
                  key="tracking-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 text-blue-800 rounded-2xl shadow-xs">
                      <Search className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Cek & Lacak Resi Pengiriman</h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Lacak posisi paket terkini secara langsung di website resmi maskapai kurir masing-masing.
                      </p>
                    </div>
                  </div>

                  {/* Single Track form redirect */}
                  <form onSubmit={handleRedirectTracking} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/50 space-y-4 max-w-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">1. Pilih Vendor Kurir</label>
                        <select
                          value={trackingVendorId}
                          onChange={(e) => setTrackingVendorId(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                        >
                          {VENDORS.map((v) => (
                            <option key={`track-opt-${v.id}`} value={v.id}>
                              {v.name} ({v.fullName})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">2. No. Resi Pengiriman (Opsional)</label>
                        <input
                          type="text"
                          placeholder="Contoh: JT123456789"
                          value={trackingResi}
                          onChange={(e) => setTrackingResi(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <p className="text-[10px] text-slate-400 max-w-sm leading-normal">
                        *Klik tombol di samping untuk dialihkan ke pelacakan resmi. Anda tinggal menempelkan (paste) nomor resi jika diminta verifikasi captcha demi keamanan.
                      </p>
                      
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm text-xs shrink-0 transition-colors"
                      >
                        Lacak Resi ↗
                      </button>
                    </div>
                  </form>

                  {/* Direct vendor check links */}
                  <div className="mt-8">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Akses Cepat Tracking Semua Vendor</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {VENDORS.map((v) => (
                        <button
                          key={`track-quick-${v.id}`}
                          onClick={() => {
                            setTrackingVendorId(v.id);
                            window.open(v.trackingUrl, "_blank");
                          }}
                          className="p-3.5 rounded-xl border border-slate-150 bg-white hover:bg-slate-50 transition-all text-left flex justify-between items-center group"
                        >
                          <div>
                            <span className="font-bold text-xs block text-slate-900">{v.name}</span>
                            <span className="text-[9px] text-slate-400 block font-medium">Klik Lacak</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 4: Riwayat Pengiriman */}
              {activeTab === "riwayat" && (
                <motion.div
                  key="history-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8"
                >
                  <div className="flex justify-between items-start gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-slate-100 text-slate-800 rounded-2xl shadow-xs">
                        <History className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Riwayat Pengiriman WA</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Daftar formulir pengiriman yang baru saja Anda kirimkan ke Admin WhatsApp (Tersimpan di browser).
                        </p>
                      </div>
                    </div>

                    {history.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Bersihkan
                      </button>
                    )}
                  </div>

                  {history.length > 0 ? (
                    <div className="space-y-4">
                      {history.map((order) => {
                        const vendor = VENDORS.find((v) => v.id === order.vendorId) || VENDORS[0];
                        return (
                          <div
                            key={order.id}
                            className="p-5 rounded-2xl border border-slate-150 hover:border-slate-250 bg-white shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-mono font-bold text-slate-500">
                                  {order.id}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white ${vendor.color}`}>
                                  {order.vendorName}
                                </span>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[10px] font-bold">
                                  {order.serviceTier}
                                </span>
                                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium ml-1">
                                  <Clock className="w-3 h-3" /> {order.createdAt}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1.5">
                                <div>
                                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Pengirim</span>
                                  <span className="text-xs font-bold text-slate-800 line-clamp-1">{order.senderName} ({order.senderOrigin})</span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Penerima</span>
                                  <span className="text-xs font-bold text-slate-800 line-clamp-1">{order.recipientName} ({order.recipientDestination})</span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Isi Paket</span>
                                  <span className="text-xs font-bold text-slate-800 line-clamp-1">{order.packageName}</span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Berat</span>
                                  <span className="text-xs font-mono font-bold text-slate-800">{order.packageWeight} Kg</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                // Re-create and send the message if they click "Kirim Ulang WA"
                                setSelectedVendor(vendor);
                                setSenderName(order.senderName);
                                setSenderPhone(order.senderPhone);
                                setSenderOrigin(order.senderOrigin);
                                setRecipientName(order.recipientName);
                                setRecipientPhone(order.recipientPhone);
                                setRecipientAddress(order.recipientAddress);
                                setRecipientDestination(order.recipientDestination);
                                setPackageName(order.packageName);
                                setPackageWeight(order.packageWeight);
                                setServiceTier(order.serviceTier);
                                setNotes(order.notes);
                                setActiveTab("formulir");
                                showTempNotification("info", "Formulir berhasil dimuat ulang ke editor di atas!");
                              }}
                              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold border border-slate-200 shrink-0 transition-colors"
                            >
                              Edit / Kirim Ulang
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-16 text-center border-2 border-dashed border-slate-150 rounded-2xl bg-slate-50">
                      <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-600">Belum ada riwayat pengiriman</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                        Formulir yang Anda kirimkan ke WhatsApp Admin akan tercatat secara lokal di sini untuk memudahkan pemantauan.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Right Column: Informative Panel / Quick Guides */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Courier Selection Details Guide */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
                <ShieldCheck className="w-40 h-40" />
              </div>
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${selectedVendor.color}`} />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Spesifikasi Kurir</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold tracking-tight">{selectedVendor.name}</h3>
                  <p className="text-[11px] text-slate-400 font-medium">{selectedVendor.fullName}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {selectedVendor.description}
                </p>

                <div className="pt-2 border-t border-slate-800 space-y-3">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aksi Langsung:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleRedirectRates(selectedVendor)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[11px] font-semibold transition-colors border border-slate-700"
                    >
                      Cek Tarif Resmi ↗
                    </button>
                    <button
                      onClick={() => {
                        setTrackingVendorId(selectedVendor.id);
                        setActiveTab("resi");
                      }}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[11px] font-semibold transition-colors border border-slate-700"
                    >
                      Lacak Paket ↗
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectVendorAndScroll(selectedVendor)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-rose-600 hover:bg-rose-500 rounded-2xl text-xs font-bold transition-all shadow-sm shadow-rose-600/10 hover:shadow-md"
                >
                  Gunakan untuk Pengiriman WA
                </button>
              </div>
            </div>

            {/* Quick Step Guide */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                Cara Kerja Portal
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Pilih Vendor Ekspedisi</span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Klik salah satu dari 12 logo ekspedisi terkemuka di Indonesia di grid atas untuk diset menjadi kurir pengiriman.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Lengkapi Formulir WA</span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Masukkan identitas lengkap pengirim, penerima, deskripsi jenis barang, serta berat aktual paket.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Kirim Data ke Admin WA</span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Sistem memformat data dan dialihkan ke WhatsApp Admin. Paket akan diproses dan resi diterbitkan secara resmi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer & Policy Box */}
            <div className="bg-blue-50/60 rounded-3xl border border-blue-100 p-5 flex items-start gap-3">
              <Info className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-blue-900 leading-relaxed">
                <strong className="block mb-0.5">Kebijakan Penggunaan Resmi</strong>
                Situs portal pengiriman ini murni bersifat agregator informasi dan jembatan data (gateway) via WhatsApp ke Admin Ekspedisi. Kami tidak memungut biaya apa pun dan tidak menyimpan data sensitif pribadi Anda di server luar, seluruh riwayat disimpan secara lokal di browser Anda.
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Modern High-End Footer */}
      <footer className="bg-white border-t border-slate-100 mt-16 py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto space-y-3">
          <p className="text-xs text-slate-400 font-medium">
            © 2026 Portal Ekspedisi Indonesia. Dikembangkan secara mandiri untuk kemudahan pengiriman paket nusantara.
          </p>
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span>Lion Parcel</span>
            <span>•</span>
            <span>J&T Cargo</span>
            <span>•</span>
            <span>Wahana</span>
            <span>•</span>
            <span>J&T Express</span>
            <span>•</span>
            <span>Ninja Xpress</span>
            <span>•</span>
            <span>SAP Express</span>
            <span>•</span>
            <span>Paxel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
