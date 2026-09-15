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
import { 
  isVercelDbConfigured, 
  saveToVercelKv, 
  loadFromVercelKv 
} from './vercelDb';

const KEYS = {
  SETTINGS: 'lbh_ansor_settings_v2',
  MENU_ITEMS: 'lbh_ansor_menu_v2',
  CASES: 'lbh_ansor_cases_v2',
  ARTICLES: 'lbh_ansor_articles_v2',
  LAWYERS: 'lbh_ansor_lawyers_v2',
  BRANCHES: 'lbh_ansor_branches_v2',
  EXECUTIVE_LEADERS: 'lbh_ansor_exec_leaders_v3',
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
  } catch (err: any) {
    console.error(`Error saving key ${key} to storage:`, err);
    // If quota exceeded, clean legacy storage keys and retry
    if (err && (err.name === 'QuotaExceededError' || err.code === 22 || err.number === -2147024882)) {
      console.warn('LocalStorage quota reached! Cleaning legacy cache items...');
      try {
        localStorage.removeItem('lbh_ansor_cases');
        localStorage.removeItem('lbh_ansor_articles');
        localStorage.removeItem('lbh_ansor_lawyers');
        localStorage.removeItem('lbh_ansor_settings');
        localStorage.removeItem('lbh_ansor_menu');
        localStorage.setItem(key, JSON.stringify(data));
      } catch (retryErr) {
        console.error('Save failed even after clearing legacy keys:', retryErr);
      }
    }
  }
}

// ---------------- Site Settings ----------------
export function getStoredSettings(): SiteSettings {
  const stored = safeGet<SiteSettings>(KEYS.SETTINGS, initialSiteSettings);
  const merged: SiteSettings = { ...initialSiteSettings, ...stored };
  if (merged.centerpieceLogoUrl === '/images/lbh_ansor_logo.jpg' || !merged.centerpieceLogoUrl) {
    merged.centerpieceLogoUrl = '/images/logo_lbh_ansor_official.svg';
  }
  return merged;
}

export async function saveStoredSettings(settings: SiteSettings): Promise<void> {
  safeSet(KEYS.SETTINGS, settings);

  // Sync to Vercel KV / Vercel Database if configured
  if (isVercelDbConfigured()) {
    try {
      await saveToVercelKv('lbh_settings', settings);
    } catch (err) {
      console.warn('Vercel sync settings error:', err);
    }
  }
}

// ---------------- Menu Items ----------------
export function getStoredMenuItems(): MenuItem[] {
  const items = safeGet<MenuItem[]>(KEYS.MENU_ITEMS, initialMenuItems);
  const filtered = items.filter(m => m.href !== '#posko' && m.href !== '#advokat' && m.href !== '#cek-status');
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

  // Sync to Vercel Database if configured
  if (isVercelDbConfigured()) {
    try {
      await saveToVercelKv('lbh_cases', updated);
    } catch (err) {
      console.warn('Vercel sync insert case error:', err);
    }
  }
}

export async function updateStoredCase(updatedCase: CaseConsultation): Promise<void> {
  const current = getStoredCases();
  const updated = current.map(c => c.id === updatedCase.id ? updatedCase : c);
  safeSet(KEYS.CASES, updated);

  if (isVercelDbConfigured()) {
    try {
      await saveToVercelKv('lbh_cases', updated);
    } catch (err) {
      console.warn('Vercel sync update case error:', err);
    }
  }
}

export function deleteStoredCase(id: string): void {
  const current = getStoredCases();
  const updated = current.filter(c => c.id !== id);
  safeSet(KEYS.CASES, updated);

  if (isVercelDbConfigured()) {
    saveToVercelKv('lbh_cases', updated).catch(() => {});
  }
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

  if (isVercelDbConfigured()) {
    try {
      await saveToVercelKv('lbh_articles', updated);
    } catch (err) {
      console.warn('Vercel sync article error:', err);
    }
  }
}

export function deleteStoredArticle(id: string): void {
  const current = getStoredArticles();
  const updated = current.filter(a => a.id !== id);
  safeSet(KEYS.ARTICLES, updated);

  if (isVercelDbConfigured()) {
    saveToVercelKv('lbh_articles', updated).catch(() => {});
  }
}

// ---------------- Executive Leaders (Ketua, Sekretaris, Bendahara) ----------------
export interface ExecutiveLeadersRecord {
  ketua?: Lawyer;
  sekretaris?: Lawyer;
  bendahara?: Lawyer;
}

export function getStoredExecutiveLeaders(): ExecutiveLeadersRecord {
  return safeGet<ExecutiveLeadersRecord>(KEYS.EXECUTIVE_LEADERS, {});
}

export function saveStoredExecutiveLeaders(leaders: { ketua?: Lawyer; sekretaris?: Lawyer; bendahara?: Lawyer }): void {
  const current = getStoredExecutiveLeaders();
  const updated: ExecutiveLeadersRecord = {
    ...current,
    ...(leaders.ketua ? { ketua: leaders.ketua } : {}),
    ...(leaders.sekretaris ? { sekretaris: leaders.sekretaris } : {}),
    ...(leaders.bendahara ? { bendahara: leaders.bendahara } : {}),
  };
  safeSet(KEYS.EXECUTIVE_LEADERS, updated);

  // Synchronize into KEYS.LAWYERS as well
  const currentLawyers = safeGet<Lawyer[]>(KEYS.LAWYERS, initialLawyers);
  let lawyerList = [...currentLawyers];
  
  const toSync = [leaders.ketua, leaders.sekretaris, leaders.bendahara].filter(Boolean) as Lawyer[];
  for (const item of toSync) {
    const idx = lawyerList.findIndex(l => l.id === item.id);
    if (idx >= 0) {
      lawyerList[idx] = item;
    } else {
      lawyerList.unshift(item);
    }
  }
  safeSet(KEYS.LAWYERS, lawyerList);

  if (isVercelDbConfigured()) {
    saveToVercelKv('lbh_exec_leaders', updated).catch(() => {});
    saveToVercelKv('lbh_lawyers', lawyerList).catch(() => {});
  }
}

// ---------------- Lawyers ----------------
export function getStoredLawyers(): Lawyer[] {
  let stored = safeGet<Lawyer[]>(KEYS.LAWYERS, initialLawyers);
  const execs = getStoredExecutiveLeaders();
  
  // If executive leaders were custom-saved, ensure they are merged with top priority
  if (execs.ketua || execs.sekretaris || execs.bendahara) {
    const execMap = new Map<string, Lawyer>();
    if (execs.ketua) execMap.set(execs.ketua.id || 'law-rojak', execs.ketua);
    if (execs.sekretaris) execMap.set(execs.sekretaris.id || 'law-mulhat', execs.sekretaris);
    if (execs.bendahara) execMap.set(execs.bendahara.id || 'law-dede', execs.bendahara);

    stored = stored.map(l => execMap.get(l.id) || l);
    execMap.forEach((val, id) => {
      if (!stored.some(l => l.id === id)) {
        stored.unshift(val);
      }
    });
  } else {
    const storedIds = new Set(stored.map(l => l.id));
    const coreLeaderIds = ['law-rojak', 'law-mulhat', 'law-dede'];
    const missingLeaders = initialLawyers.filter(l => coreLeaderIds.includes(l.id) && !storedIds.has(l.id));
    
    if (missingLeaders.length > 0) {
      stored = [...missingLeaders, ...stored];
      safeSet(KEYS.LAWYERS, stored);
    }
  }

  return stored;
}

export function saveStoredLawyer(lawyer: Lawyer): void {
  const current = getStoredLawyers();
  const exists = current.some(l => l.id === lawyer.id);
  const updated = exists 
    ? current.map(l => l.id === lawyer.id ? lawyer : l)
    : [...current, lawyer];
  safeSet(KEYS.LAWYERS, updated);

  // If this is an executive leader, update dedicated storage too
  if (lawyer.id === 'law-rojak') {
    saveStoredExecutiveLeaders({ ketua: lawyer });
  } else if (lawyer.id === 'law-mulhat') {
    saveStoredExecutiveLeaders({ sekretaris: lawyer });
  } else if (lawyer.id === 'law-dede') {
    saveStoredExecutiveLeaders({ bendahara: lawyer });
  }

  if (isVercelDbConfigured()) {
    saveToVercelKv('lbh_lawyers', updated).catch(() => {});
  }
}

export function deleteStoredLawyer(id: string): void {
  const current = getStoredLawyers();
  const updated = current.filter(l => l.id !== id);
  safeSet(KEYS.LAWYERS, updated);

  if (isVercelDbConfigured()) {
    saveToVercelKv('lbh_lawyers', updated).catch(() => {});
  }
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

  if (isVercelDbConfigured()) {
    saveToVercelKv('lbh_branches', updated).catch(() => {});
  }
}

export function deleteStoredBranch(id: string): void {
  const current = getStoredBranches();
  const updated = current.filter(b => b.id !== id);
  safeSet(KEYS.BRANCHES, updated);

  if (isVercelDbConfigured()) {
    saveToVercelKv('lbh_branches', updated).catch(() => {});
  }
}

// Generate next unique ticket number
export function generateTicketNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `LBH-BTN-${year}-${randomSuffix}`;
}

// ---------------- Unified Bulk Helpers for App.tsx ----------------
export async function loadInitialData() {
  let cases = getStoredCases();
  let articles = getStoredArticles();
  let lawyers = getStoredLawyers();
  let branches = getStoredBranches();
  let settings = getStoredSettings();
  let menuItems = getStoredMenuItems();

  // If Vercel Database is active, attempt to fetch live remote data from Vercel KV / Storage
  if (isVercelDbConfigured()) {
    try {
      const [remoteCases, remoteArticles, remoteSettings, remoteLawyers, remoteBranches, remoteExecs] = await Promise.all([
        loadFromVercelKv<CaseConsultation[]>('lbh_cases'),
        loadFromVercelKv<Article[]>('lbh_articles'),
        loadFromVercelKv<SiteSettings>('lbh_settings'),
        loadFromVercelKv<Lawyer[]>('lbh_lawyers'),
        loadFromVercelKv<BranchOffice[]>('lbh_branches'),
        loadFromVercelKv<ExecutiveLeadersRecord>('lbh_exec_leaders'),
      ]);

      if (remoteCases && Array.isArray(remoteCases) && remoteCases.length > 0) {
        cases = remoteCases;
        safeSet(KEYS.CASES, cases);
      }

      if (remoteArticles && Array.isArray(remoteArticles) && remoteArticles.length > 0) {
        articles = remoteArticles;
        safeSet(KEYS.ARTICLES, articles);
      }

      if (remoteExecs && (remoteExecs.ketua || remoteExecs.sekretaris || remoteExecs.bendahara)) {
        safeSet(KEYS.EXECUTIVE_LEADERS, remoteExecs);
      }

      if (remoteLawyers && Array.isArray(remoteLawyers) && remoteLawyers.length > 0) {
        lawyers = remoteLawyers;
        safeSet(KEYS.LAWYERS, lawyers);
      }

      if (remoteBranches && Array.isArray(remoteBranches) && remoteBranches.length > 0) {
        branches = remoteBranches;
        safeSet(KEYS.BRANCHES, branches);
      }

      if (remoteSettings && typeof remoteSettings === 'object') {
        settings = { ...settings, ...remoteSettings };
        safeSet(KEYS.SETTINGS, settings);
      }
    } catch (err) {
      console.warn('Vercel remote fetch warning, falling back to local storage:', err);
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
  if (isVercelDbConfigured()) {
    saveToVercelKv('lbh_cases', cases).catch(() => {});
  }
}

export async function saveArticlesToStorage(articles: Article[]): Promise<void> {
  safeSet(KEYS.ARTICLES, articles);
  if (isVercelDbConfigured()) {
    saveToVercelKv('lbh_articles', articles).catch(() => {});
  }
}

export async function saveLawyersToStorage(lawyers: Lawyer[]): Promise<void> {
  safeSet(KEYS.LAWYERS, lawyers);

  // Also preserve executive leaders in dedicated storage
  const ketua = lawyers.find(l => l.id === 'law-rojak');
  const sekretaris = lawyers.find(l => l.id === 'law-mulhat');
  const bendahara = lawyers.find(l => l.id === 'law-dede');
  if (ketua || sekretaris || bendahara) {
    const current = getStoredExecutiveLeaders();
    saveStoredExecutiveLeaders({
      ketua: ketua || current.ketua,
      sekretaris: sekretaris || current.sekretaris,
      bendahara: bendahara || current.bendahara,
    });
  }

  if (isVercelDbConfigured()) {
    saveToVercelKv('lbh_lawyers', lawyers).catch(() => {});
  }
}

export async function saveBranchesToStorage(branches: BranchOffice[]): Promise<void> {
  safeSet(KEYS.BRANCHES, branches);
  if (isVercelDbConfigured()) {
    saveToVercelKv('lbh_branches', branches).catch(() => {});
  }
}

export async function saveSettingsToStorage(settings: SiteSettings): Promise<void> {
  await saveStoredSettings(settings);
}

export async function saveMenuItemsToStorage(menuItems: MenuItem[]): Promise<void> {
  safeSet(KEYS.MENU_ITEMS, menuItems);
}
