import { 
  SiteSettings, 
  MenuItem, 
  CaseConsultation, 
  Article, 
  Lawyer, 
  BranchOffice 
} from '../types';
import { 
  initialSiteSettings, 
  initialMenuItems, 
  initialCases, 
  initialArticles, 
  initialLawyers, 
  initialBranches 
} from '../data/initialData';
import { getSupabaseClient, SUPABASE_TABLES } from './supabase';

const KEYS = {
  SETTINGS: 'lbh_ansor_settings_v2',
  MENU_ITEMS: 'lbh_ansor_menu_v2',
  CASES: 'lbh_ansor_cases_v2',
  ARTICLES: 'lbh_ansor_articles_v2',
  LAWYERS: 'lbh_ansor_lawyers_v2',
  BRANCHES: 'lbh_ansor_branches_v2',
};

// Safe JSON parse helper
function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading key ${key} from storage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving key ${key} to storage:`, err);
  }
}

// ---------------- Site Settings ----------------
export function getStoredSettings(): SiteSettings {
  return safeGet<SiteSettings>(KEYS.SETTINGS, initialSiteSettings);
}

export async function saveStoredSettings(settings: SiteSettings): Promise<void> {
  safeSet(KEYS.SETTINGS, settings);

  // Sync to Supabase if connected
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase
        .from(SUPABASE_TABLES.SETTINGS)
        .upsert({ id: 'default_settings', data: settings, updated_at: new Date().toISOString() });
    } catch (err) {
      console.warn('Supabase sync settings error:', err);
    }
  }
}

// ---------------- Menu Items ----------------
export function getStoredMenuItems(): MenuItem[] {
  const items = safeGet<MenuItem[]>(KEYS.MENU_ITEMS, initialMenuItems);
  const filtered = items.filter(m => m.href !== '#posko' && m.href !== '#advokat');
  return filtered;
}

export function saveStoredMenuItems(items: MenuItem[]): void {
  safeSet(KEYS.MENU_ITEMS, items);
}

// ---------------- Cases ----------------
export function getStoredCases(): CaseConsultation[] {
  return safeGet<CaseConsultation[]>(KEYS.CASES, initialCases);
}

export async function addStoredCase(newCase: CaseConsultation): Promise<void> {
  const current = getStoredCases();
  const updated = [newCase, ...current];
  safeSet(KEYS.CASES, updated);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from(SUPABASE_TABLES.CASES).insert({
        id: newCase.id,
        ticket_number: newCase.ticketNumber,
        client_name: newCase.clientName,
        client_phone: newCase.clientPhone,
        client_email: newCase.clientEmail,
        id_card_number: newCase.idCardNumber,
        regency: newCase.regency,
        category: newCase.category,
        case_title: newCase.caseTitle,
        chronology: newCase.chronology,
        evidence_url: newCase.evidenceUrl,
        evidence_file_name: newCase.evidenceFileName,
        status: newCase.status,
        status_notes: newCase.statusNotes,
        assigned_lawyer_id: newCase.assignedLawyerId,
        assigned_lawyer_name: newCase.assignedLawyerName,
        created_at: newCase.createdAt,
        updated_at: newCase.updatedAt,
      });
    } catch (err) {
      console.warn('Supabase insert case error:', err);
    }
  }
}

export async function updateStoredCase(updatedCase: CaseConsultation): Promise<void> {
  const current = getStoredCases();
  const updated = current.map(c => c.id === updatedCase.id ? updatedCase : c);
  safeSet(KEYS.CASES, updated);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from(SUPABASE_TABLES.CASES).update({
        status: updatedCase.status,
        status_notes: updatedCase.statusNotes,
        assigned_lawyer_id: updatedCase.assignedLawyerId,
        assigned_lawyer_name: updatedCase.assignedLawyerName,
        updated_at: new Date().toISOString(),
      }).eq('id', updatedCase.id);
    } catch (err) {
      console.warn('Supabase update case error:', err);
    }
  }
}

export function deleteStoredCase(id: string): void {
  const current = getStoredCases();
  safeSet(KEYS.CASES, current.filter(c => c.id !== id));
}

// ---------------- Articles ----------------
export function getStoredArticles(): Article[] {
  const stored = safeGet<Article[]>(KEYS.ARTICLES, initialArticles);
  if (stored.length < initialArticles.length) {
    const storedIds = new Set(stored.map(a => a.id));
    const missing = initialArticles.filter(a => !storedIds.has(a.id));
    const merged = [...stored, ...missing];
    safeSet(KEYS.ARTICLES, merged);
    return merged;
  }
  return stored;
}

export async function saveStoredArticle(article: Article): Promise<void> {
  const current = getStoredArticles();
  const exists = current.some(a => a.id === article.id);
  const updated = exists 
    ? current.map(a => a.id === article.id ? article : a)
    : [article, ...current];
  safeSet(KEYS.ARTICLES, updated);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from(SUPABASE_TABLES.ARTICLES).upsert({
        id: article.id,
        slug: article.slug,
        title: article.title,
        category: article.category,
        summary: article.summary,
        content: article.content,
        image_url: article.imageUrl,
        author: article.author,
        author_role: article.authorRole,
        published_at: article.publishedAt,
        read_time_minutes: article.readTimeMinutes,
        tags: article.tags,
      });
    } catch (err) {
      console.warn('Supabase upsert article error:', err);
    }
  }
}

export function deleteStoredArticle(id: string): void {
  const current = getStoredArticles();
  safeSet(KEYS.ARTICLES, current.filter(a => a.id !== id));
}

// ---------------- Lawyers ----------------
export function getStoredLawyers(): Lawyer[] {
  return safeGet<Lawyer[]>(KEYS.LAWYERS, initialLawyers);
}

export function saveStoredLawyer(lawyer: Lawyer): void {
  const current = getStoredLawyers();
  const exists = current.some(l => l.id === lawyer.id);
  const updated = exists 
    ? current.map(l => l.id === lawyer.id ? lawyer : l)
    : [...current, lawyer];
  safeSet(KEYS.LAWYERS, updated);
}

export function deleteStoredLawyer(id: string): void {
  const current = getStoredLawyers();
  safeSet(KEYS.LAWYERS, current.filter(l => l.id !== id));
}

// ---------------- Branches ----------------
export function getStoredBranches(): BranchOffice[] {
  return safeGet<BranchOffice[]>(KEYS.BRANCHES, initialBranches);
}

export function saveStoredBranch(branch: BranchOffice): void {
  const current = getStoredBranches();
  const exists = current.some(b => b.id === branch.id);
  const updated = exists 
    ? current.map(b => b.id === branch.id ? branch : b)
    : [...current, branch];
  safeSet(KEYS.BRANCHES, updated);
}

export function deleteStoredBranch(id: string): void {
  const current = getStoredBranches();
  safeSet(KEYS.BRANCHES, current.filter(b => b.id !== id));
}

// Generate next unique ticket number
export function generateTicketNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `LBH-BTN-${year}-${randomSuffix}`;
}

// ---------------- Unified Bulk Helpers for App.tsx ----------------
export async function loadInitialData() {
  const supabase = getSupabaseClient();

  let cases = getStoredCases();
  let articles = getStoredArticles();
  let lawyers = getStoredLawyers();
  let branches = getStoredBranches();
  let settings = getStoredSettings();
  let menuItems = getStoredMenuItems();

  // If Supabase is active, attempt to fetch live remote data
  if (supabase) {
    try {
      const [casesRes, articlesRes] = await Promise.all([
        supabase.from(SUPABASE_TABLES.CASES).select('*'),
        supabase.from(SUPABASE_TABLES.ARTICLES).select('*'),
      ]);

      if (casesRes.data && casesRes.data.length > 0) {
        cases = casesRes.data.map((c: any) => ({
          id: c.id,
          ticketNumber: c.ticket_number,
          clientName: c.client_name,
          clientPhone: c.client_phone,
          clientEmail: c.client_email,
          idCardNumber: c.id_card_number,
          regency: c.regency,
          category: c.category,
          caseTitle: c.case_title,
          chronology: c.chronology,
          evidenceUrl: c.evidence_url,
          evidenceFileName: c.evidence_file_name,
          status: c.status,
          statusNotes: c.status_notes,
          assignedLawyerId: c.assigned_lawyer_id,
          assignedLawyerName: c.assigned_lawyer_name,
          createdAt: c.created_at,
          updatedAt: c.updated_at,
        }));
        safeSet(KEYS.CASES, cases);
      }

      if (articlesRes.data && articlesRes.data.length > 0) {
        articles = articlesRes.data.map((a: any) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          category: a.category,
          summary: a.summary,
          content: a.content,
          imageUrl: a.image_url,
          author: a.author,
          authorRole: a.author_role,
          publishedAt: a.published_at,
          readTimeMinutes: a.read_time_minutes,
          tags: a.tags || [],
        }));
        safeSet(KEYS.ARTICLES, articles);
      }
    } catch (err) {
      console.warn('Supabase remote fetch warning, falling back to local storage:', err);
    }
  }

  return {
    cases,
    articles,
    lawyers,
    branches,
    settings,
    menuItems,
  };
}

export async function saveCasesToStorage(cases: CaseConsultation[]): Promise<void> {
  safeSet(KEYS.CASES, cases);
}

export async function saveArticlesToStorage(articles: Article[]): Promise<void> {
  safeSet(KEYS.ARTICLES, articles);
}

export async function saveLawyersToStorage(lawyers: Lawyer[]): Promise<void> {
  safeSet(KEYS.LAWYERS, lawyers);
}

export async function saveBranchesToStorage(branches: BranchOffice[]): Promise<void> {
  safeSet(KEYS.BRANCHES, branches);
}

export async function saveSettingsToStorage(settings: SiteSettings): Promise<void> {
  await saveStoredSettings(settings);
}

export async function saveMenuItemsToStorage(menuItems: MenuItem[]): Promise<void> {
  safeSet(KEYS.MENU_ITEMS, menuItems);
}

