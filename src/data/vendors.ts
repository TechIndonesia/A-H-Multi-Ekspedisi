export interface Vendor {
  id: string;
  name: string;
  fullName: string;
  websiteUrl: string;
  trackingUrl: string;
  ratesUrl: string;
  color: string;
  textColor: string;
  borderColor: string;
  hoverColor: string;
  description: string;
}

export const VENDORS: Vendor[] = [
  {
    id: "jnt",
    name: "J&T Express",
    fullName: "PT Global Jet Express",
    websiteUrl: "https://www.jet.co.id",
    trackingUrl: "https://www.jet.co.id/track",
    ratesUrl: "https://www.jet.co.id/rates",
    color: "bg-red-600",
    textColor: "text-red-600",
    borderColor: "border-red-600/20",
    hoverColor: "hover:bg-red-50",
    description: "Sangat populer dengan layanan jemput di tempat gratis 365 hari tanpa libur."
  },
  {
    id: "jnt-cargo",
    name: "J&T Cargo",
    fullName: "PT Global Jet Cargo",
    websiteUrl: "https://www.jtcargo.id",
    trackingUrl: "https://www.jtcargo.id/",
    ratesUrl: "https://www.jtcargo.id/",
    color: "bg-red-800",
    textColor: "text-red-800",
    borderColor: "border-red-800/20",
    hoverColor: "hover:bg-red-50",
    description: "Spesialis pengiriman paket ukuran besar, berat, dan bervolume tinggi."
  },
  {
    id: "lion-parcel",
    name: "Lion Parcel",
    fullName: "PT Lion Express",
    websiteUrl: "https://lionparcel.com",
    trackingUrl: "https://lionparcel.com/track/",
    ratesUrl: "https://lionparcel.com/tarif",
    color: "bg-rose-600",
    textColor: "text-rose-600",
    borderColor: "border-rose-600/20",
    hoverColor: "hover:bg-rose-50",
    description: "Didukung langsung oleh jaringan armada penerbangan Lion Air Group."
  },
  {
    id: "wahana",
    name: "Wahana Express",
    fullName: "PT Wahana Prestasi Logistik",
    websiteUrl: "https://www.wahana.com",
    trackingUrl: "https://www.wahana.com",
    ratesUrl: "https://www.wahana.com",
    color: "bg-emerald-600",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-600/20",
    hoverColor: "hover:bg-emerald-50",
    description: "Dikenal luas dengan tarif ongkos kirim yang paling hemat dan ekonomis."
  },
  {
    id: "ninja-xpress",
    name: "Ninja Xpress",
    fullName: "PT Ninja Express",
    websiteUrl: "https://www.ninjaxpress.co/id-id",
    trackingUrl: "https://www.ninjaxpress.co/id-id/tracking",
    ratesUrl: "https://www.ninjaxpress.co/id-id/shipper-guide/shipping-rates",
    color: "bg-slate-900",
    textColor: "text-slate-900",
    borderColor: "border-slate-900/20",
    hoverColor: "hover:bg-slate-50",
    description: "Sistem pelacakan modern untuk toko online dan e-commerce Indonesia."
  },
  {
    id: "sap",
    name: "SAP Express",
    fullName: "PT Satria Antaran Prima Tbk",
    websiteUrl: "https://www.sap-express.id",
    trackingUrl: "https://www.sap-express.id/",
    ratesUrl: "https://www.sap-express.id/",
    color: "bg-blue-600",
    textColor: "text-blue-600",
    borderColor: "border-blue-600/20",
    hoverColor: "hover:bg-blue-50",
    description: "Jagonya COD (Cash on Delivery) dengan cakupan terluas hingga pelosok desa."
  },
  {
    id: "paxel",
    name: "Paxel",
    fullName: "PT Paxel Teknologi Unggul",
    websiteUrl: "https://paxel.co",
    trackingUrl: "https://paxel.co/id/track-package",
    ratesUrl: "https://paxel.co/id/kirim-paket",
    color: "bg-purple-600",
    textColor: "text-purple-600",
    borderColor: "border-purple-600/20",
    hoverColor: "hover:bg-purple-50",
    description: "Spesialis layanan Same Day Delivery dan pengiriman frozen food berpendingin."
  },
  {
    id: "jne",
    name: "JNE Express",
    fullName: "PT Jalur Nugraha Ekakurir",
    websiteUrl: "https://www.jne.co.id",
    trackingUrl: "https://www.jne.co.id/id/tracking/trace",
    ratesUrl: "https://www.jne.co.id/id/tracking/tarif",
    color: "bg-cyan-700",
    textColor: "text-cyan-700",
    borderColor: "border-cyan-700/20",
    hoverColor: "hover:bg-cyan-50",
    description: "Pelopor logistik swasta legendaris dengan ribuan agen di seluruh nusantara."
  },
  {
    id: "sicepat",
    name: "SiCepat Ekspres",
    fullName: "PT Sicepat Ekspres Indonesia",
    websiteUrl: "https://www.sicepat.com",
    trackingUrl: "https://www.sicepat.com/tracking",
    ratesUrl: "https://www.sicepat.com/deliveryfee",
    color: "bg-amber-600",
    textColor: "text-amber-600",
    borderColor: "border-amber-600/20",
    hoverColor: "hover:bg-amber-50",
    description: "Kurir andalan seller e-commerce dengan pengiriman reguler secepat kilat."
  },
  {
    id: "pos-indonesia",
    name: "Pos Indonesia",
    fullName: "PT Pos Indonesia (Persero)",
    websiteUrl: "https://www.posindonesia.co.id",
    trackingUrl: "https://www.posindonesia.co.id/id/tracking",
    ratesUrl: "https://www.posindonesia.co.id/id/tarif",
    color: "bg-orange-600",
    textColor: "text-orange-600",
    borderColor: "border-orange-600/20",
    hoverColor: "hover:bg-orange-50",
    description: "BUMN pos tertua dengan keandalan pengiriman dokumen, surat, dan barang."
  },
  {
    id: "anteraja",
    name: "Anteraja",
    fullName: "PT Tri Adi Bersama",
    websiteUrl: "https://anteraja.id",
    trackingUrl: "https://anteraja.id/tracking",
    ratesUrl: "https://anteraja.id/tariffs",
    color: "bg-pink-500",
    textColor: "text-pink-500",
    borderColor: "border-pink-500/20",
    hoverColor: "hover:bg-pink-50",
    description: "Solusi logistik berbasis teknologi cerdas dengan tim kurir (Satria) yang ramah."
  },
  {
    id: "tiki",
    name: "TIKI",
    fullName: "PT Citra Van Titipan Kilat",
    websiteUrl: "https://www.tiki.id",
    trackingUrl: "https://www.tiki.id/id/tracking",
    ratesUrl: "https://www.tiki.id/id/tariff",
    color: "bg-indigo-900",
    textColor: "text-indigo-900",
    borderColor: "border-indigo-900/20",
    hoverColor: "hover:bg-indigo-50",
    description: "Salah satu pelopor jasa kurir tepercaya di Indonesia dengan harga bersahabat."
  }
];
