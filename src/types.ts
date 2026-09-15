export type CaseStatus = 
  | 'verifikasi'    // Menunggu Verifikasi Berkas
  | 'ditelaah'      // Sedang Ditelaah Advokat
  | 'proses'        // Proses Pendampingan / Mediasi / Sidang
  | 'selesai'       // Kasus Selesai
  | 'ditolak';      // Ditolak / Di luar Kewenangan

export type LegalCategory = 
  | 'pidana'
  | 'perdata'
  | 'agraria'
  | 'ketenagakerjaan'
  | 'keluarga'
  | 'kdrt_anak'
  | 'ite_siber'
  | 'publik_lingkungan'
  | 'lainnya';

export interface CaseConsultation {
  id: string;
  ticketNumber: string; // e.g., LBH-BTN-2025-0812
  clientName: string;
  clientPhone: string;  // WhatsApp number
  clientEmail?: string;
  idCardNumber?: string;
  regency: string; // Serang, Cilegon, Pandeglang, Lebak, Tangerang, etc.
  category: LegalCategory;
  caseTitle: string;
  chronology: string;
  evidenceUrl?: string;
  evidenceFileName?: string;
  status: CaseStatus;
  statusNotes?: string;
  assignedLawyerId?: string;
  assignedLawyerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lawyer {
  id: string;
  name: string;
  title: string; // S.H., M.H.
  role: string;  // Ketua Wilayah, Direktur LBH, Advokat Senior, Paralegal
  regency: string;
  specialization: string[];
  photoUrl: string;
  experienceYears: number;
  barNumber?: string; // No. KTA / Peradi / LBH Ansor
  isAvailable: boolean;
  phone?: string;
}

export interface BranchOffice {
  id: string;
  name: string;
  regency: string;
  address: string;
  phone: string;
  operationalHours: string;
  latitude: number;
  longitude: number;
  googleMapsUrl?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  imageUrl: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTimeMinutes: number;
  tags: string[];
}

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  isExternal: boolean;
  isVisible: boolean;
  order: number;
}

export interface SiteSettings {
  siteTitle: string;
  siteTagline: string;
  siteLogoUrl: string;
  heroBannerUrl: string;
  heroHeading: string;
  heroSubheading: string;
  hotlineWhatsapp: string;
  officialEmail: string;
  headquartersAddress: string;
  footerAbout: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;
  adminPin: string;
  // Centerpiece Fiat Justitia Ruat Caelum Logo / Photo
  centerpieceLogoUrl?: string;
  // Vercel Database Config (Vercel Postgres & Storage)
  vercelPostgresUrl?: string;
  vercelStorageToken?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isFallback?: boolean;
}
