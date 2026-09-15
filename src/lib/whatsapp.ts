import { CaseConsultation } from '../types';

/**
 * Normalize Indonesian phone numbers to international format (628xxx)
 */
export function formatPhoneNumberForWa(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export function getStatusLabelIndonesian(status: CaseConsultation['status']): string {
  switch (status) {
    case 'verifikasi':
      return '🟡 Menunggu Verifikasi Berkas';
    case 'ditelaah':
      return '🔵 Berkas Sedang Ditelaah Tim Advokat';
    case 'proses':
      return '🟢 Dalam Proses Pendampingan Hukum / Mediasi';
    case 'selesai':
      return '✅ Perkara Selesai';
    case 'ditolak':
      return '🔴 Permohonan Ditolak / Dirujuk';
    default:
      return status;
  }
}

/**
 * Generate official WhatsApp message template for case status update
 */
export function generateWhatsAppStatusMessage(
  caseItem: CaseConsultation,
  siteTitle: string,
  appUrl: string = window.location.origin
): string {
  const statusLabel = getStatusLabelIndonesian(caseItem.status);
  const now = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `*NOTIFIKASI PEMBARUAN STATUS KASUS HUKUM*
*${siteTitle.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━━
Kepada Yth.
*${caseItem.clientName}*
Nomor Registrasi: *${caseItem.ticketNumber}*
Perkara: _${caseItem.caseTitle}_

Status Terkini:
👉 *${statusLabel}*

Advokat Pendamping:
👤 *${caseItem.assignedLawyerName || 'Divisi Pelayanan & Advokasi LBH Ansor Banten'}*

Catatan & Tindak Lanjut:
📝 _"${caseItem.statusNotes || 'Berkas Anda telah dicatat dalam sistem data LBH Ansor Banten. Tim kami akan segera menindaklanjuti.'}"_

Pembaruan Pada:
📅 ${now} WIB

━━━━━━━━━━━━━━━━━━━━━
Anda dapat mengecek perkembangan berkas secara berkala melalui tautan:
🔗 ${appUrl}#cek-status?ticket=${caseItem.ticketNumber}

_Layanan Bantuan Hukum LBH Gerakan Pemuda Ansor Wilayah Banten._
_Membela Yang Hak, Mendampingi Kaum Mustadh'afin._`;
}

/**
 * Create a direct wa.me link with encoded message
 */
export function getWhatsAppSendUrl(
  caseItem: CaseConsultation,
  siteTitle: string,
  customNotes?: string
): string {
  const recipient = formatPhoneNumberForWa(caseItem.clientPhone);
  
  // Clone case if customNotes passed
  const targetCase = customNotes 
    ? { ...caseItem, statusNotes: customNotes }
    : caseItem;

  const message = generateWhatsAppStatusMessage(targetCase, siteTitle);
  return `https://wa.me/${recipient}?text=${encodeURIComponent(message)}`;
}
