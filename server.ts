import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      institution: "LBH Ansor Banten",
      timestamp: new Date().toISOString(),
    });
  });

  // AI Chatbot endpoint with Google Gemini (@google/genai)
  // Capable of answering ANY question (general knowledge, science, everyday topics, technology, religion)
  // as well as comprehensive legal, institutional, and location data about LBH Ansor Banten
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Pesan tidak boleh kosong" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({
          reply: "Assalamu'alaikum Wr. Wb. Layanan Tanya ABI (Ansor Banten Intelligence) siap membantu Anda. Untuk konsultasi mendalam atau pendampingan hukum darurat, silakan gunakan menu Pengajuan Konsultasi Online atau hubungi Hotline WhatsApp LBH Ansor Banten di 0815-1955-5391.",
          fallback: true
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `Anda adalah "ABI" (Ansor Banten Intelligence / Asisten Bantuan Hukum Ansor Banten), asisten cerdas serba bisa untuk Lembaga Bantuan Hukum (LBH) GP Ansor Wilayah Banten (Nahdlatul Ulama).

PANDUAN UTAMA KEMAMPUAN:
1. NAMA & IDENTITAS:
   - Nama Anda adalah ABI (Ansor Banten Intelligence). Jika ditanya siapa Anda, perkenalkan diri sebagai ABI dari LBH Ansor Banten.
2. DAPAT MENJAWAB SEMUA PERTANYAAN (TIDAK TERBATAS PADA HUKUM):
   - Anda BISA dan DILENGKAPI KEMAMPUAN untuk menjawab SEGALA macam pertanyaan: sains, teknologi, matematika, pemrograman komputer, pengetahuan umum, sejarah, budaya & pariwisata Banten, sastra/puisi/menulis surat, resep masakan, kiat karir & produktivitas, filsafat, serta pendidikan keagamaan Islam Aswaja (Ahlussunnah wal Jama'ah).
   - JANGAN PERNAH menolak pertanyaan hanya karena topiknya di luar hukum. Jawablah setiap pertanyaan umum pengguna dengan ramah, cerdas, akurat, dan komprehensif.

3. PENGETAHUAN HUKUM POSITIF INDONESIA:
   - Jika pengguna bertanya tentang masalah hukum, berikan penjelasan taktis dan solutif berdasarkan hukum positif Indonesia (KUHP, KUHPerdata, UU Bantuan Hukum No. 16/2011, UU Ketenagakerjaan & Cipta Kerja, UU Agraria/Pertanahan No. 5/1960, UU ITE, UU Penghapusan KDRT, Hukum Waris Islam/KHI, dsb).
   - Jelaskan dengan bahasa yang mudah dipahami rakyat awam. Selalu berpihak pada kebenaran dan keadilan bagi masyarakat mustadh'afin (masyarakat tidak mampu, buruh, petani, anak & perempuan korban kekerasan, pekerja migran).
   - Ingatkan bahwa konsultasi chat bersifat edukatif/telaah awal. Untuk pendampingan perkara litigasi/non-litigasi di wilayah Provinsi Banten, arahkan pemohon untuk mengisi Form Konsultasi Online gratis atau menghubungi Hotline Resmi LBH Ansor Banten.

4. DATA RESMI LBH GP ANSOR PROVINSI BANTEN (Dari www.lbhansorbanten.org):
   - Domain Website Resmi: www.lbhansorbanten.org
   - Slogan / Tagline: "Suara Kebenaran, Jalan Keadilan"
   - Motto: "Jangan biarkan masalah hukum membungkam suara Anda. Bersama kami, setiap suara punya jalan menuju keadilan."
   - Nilai Pokok: Berpihak pada Rakyat Kecil, Pendampingan Hukum Profesional & Terjangkau/Gratis (Pro Bono), Nilai Keadilan Berlandaskan Moral & Amanah.
   - Alamat Kantor Resmi: Jl. Jagarayu, Dalung, Kec. Cipocok Jaya, Kota Serang, Banten 42127 (Jl. Jagarayu Gg. Aswaja No. 9 RT 02/02).
   - Koordinat Google Maps: Latitude -6.1352257, Longitude 106.1439055 (Link: https://www.google.com/maps/place/Jl.+Jagarayu,+Kota+Serang,+Banten/@-6.1352257,106.1439055,17z).
   - Kontak Telepon / WhatsApp Hotline 24 Jam: +62 815-1955-5391 (081519555391).
   - Email Resmi: lbhansorbanten@gmail.com
   - Struktur Pimpinan:
     * Ketua LBH Ansor Banten: Rojak, S.H.
     * Sekretaris LBH Ansor Banten: Mulhat, S.H., M.H.
     * Bendahara LBH Ansor Banten: Dede Maulana Pasial, S.H., M.H.
   - Jam Operasional Kantor: Senin - Jumat, 09.00 - 16.00 WIB (Hotline WA siaga 24 Jam).
   - Cakupan Ranah Hukum / Area Praktik: Hukum Keimigrasian & Pekerja Migran, Hukum Bisnis & UMKM, Hukum Pidana, Hukum Perdata & Keluarga/KDRT, Hukum Pertanahan/Agraria, Hukum Ketenagakerjaan/Buruh, Hukum Pendidikan & Perlindungan Anak.

4. GAYA KOMUNIKASI (LAYAKNYA CHAT BIASA TANPA TANDA BINTANG):
   - Jawablah santun, luwes, dan ramah seperti mengobrol lewat chat biasa (misal chat WhatsApp yang komunikatif dan natural).
   - DILARANG KERAS menggunakan tanda bintang (*) dalam bentuk apa pun, baik untuk cetak tebal maupun poin daftar.
   - Sampaikan jawaban dengan teks polos tanpa tanda bintang sama sekali. Gunakan paragraf pendek atau nomor biasa (1, 2, 3) jika merinci langkah.
   - Jika pengguna memberi salam Islami ("Assalamu'alaikum"), balas dengan ramah ("Wa'alaikumussalam Wr. Wb.").`;

      // Build conversation contents with history support
      const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history) && history.length > 0) {
        for (const item of history.slice(-8)) {
          if (item && item.text) {
            const role = (item.sender === "user" || item.role === "user") ? "user" : "model";
            contents.push({
              role,
              parts: [{ text: String(item.text) }],
            });
          }
        }
      }

      // Add the current user query
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      // Prioritize highly-available stable models: gemini-2.5-flash and gemini-flash-latest
      // followed by gemini-3.1-flash-lite and gemini-3.8-flash to handle high demand (503) gracefully
      const modelsToTry = [
        "gemini-2.5-flash",
        "gemini-flash-latest",
        "gemini-3.1-flash-lite",
        "gemini-3.8-flash"
      ];
      let reply = "";

      for (const model of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
          if (response.text) {
            reply = response.text;
            break;
          }
        } catch {
          // Silently proceed to next model if model experiences temporary 503 or busy state
          continue;
        }
      }

      if (!reply) {
        // Fallback gracefully to helpful contextual response without throwing 503
        let helpfulText = "Terima kasih atas pertanyaan Anda. Layanan Tanya ABI siap membantu Anda. Untuk konsultasi hukum langsung atau pendampingan di Banten, Anda dapat mengajukan formulir di website ini atau menghubungi Hotline WhatsApp 0815-1955-5391.";
        const lower = message.toLowerCase();
        if (lower.includes("gratis") || lower.includes("pro bono") || lower.includes("biaya") || lower.includes("syarat")) {
          helpfulText = "Berdasarkan UU No. 16 Tahun 2011 tentang Bantuan Hukum, masyarakat Banten yang kurang mampu berhak memperoleh bantuan hukum cuma-cuma (gratis). Syarat utamanya adalah KTP domisili, Surat Keterangan Tidak Mampu (SKTM) dari Kelurahan/Desa atau kartu jaminan sosial (KIS/KIP/PKH), serta uraian permasalahan. Tim LBH GP Ansor Banten siap mendampingi Anda tanpa dipungut biaya.";
        } else if (lower.includes("alamat") || lower.includes("lokasi") || lower.includes("kantor") || lower.includes("maps")) {
          helpfulText = "Kantor Wilayah LBH GP Ansor Banten beralamat di Jl. Jagarayu, Kelurahan Dalung, Kecamatan Cipocok Jaya, Kota Serang, Banten 42127 (Gg. Aswaja No. 9 RT 02/02). Hotline WhatsApp resmi 24 jam di nomor 0815-1955-5391.";
        } else if (lower.includes("phk") || lower.includes("pesangon") || lower.includes("buruh") || lower.includes("kerja")) {
          helpfulText = "Mengenai pemutusan hubungan kerja (PHK), perusahaan tidak dapat melakukan PHK sepihak tanpa alasan yang sah dan wajib melalui perundingan bipartit. Pekerja berhak atas uang pesangon, uang penghargaan masa kerja, dan penggantian hak. Anda dapat mengajukan permohonan pendampingan melalui formulir konsultasi kami.";
        }
        return res.json({ reply: helpfulText, fallback: true });
      }

      const cleanReply = reply.replace(/\*/g, '').trim();
      return res.json({ reply: cleanReply, fallback: false });
    } catch {
      return res.status(200).json({
        reply: "Terima kasih atas pertanyaan Anda. Layanan Tanya ABI siap membantu. Untuk konsultasi langsung atau pendampingan hukum di Banten, silakan gunakan menu Pengajuan Konsultasi Online atau hubungi WhatsApp Hotline 0815-1955-5391.",
        fallback: true
      });
    }
  });

  // Setup Vite in development or serve static in production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LBH Ansor Banten server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
