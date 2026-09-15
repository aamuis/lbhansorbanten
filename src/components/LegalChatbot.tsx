import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Scale, User, RefreshCw, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types';

interface LegalChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation: () => void;
}

const QUICK_PROMPTS = [
  'Di mana alamat & lokasi Google Maps kantor LBH Ansor Banten?',
  'Bagaimana syarat dapat bantuan hukum gratis (pro bono)?',
  'Apa langkah hukum jika terjadi pemutusan kerja (PHK) sepihak?',
  'Ceritakan sejarah Singandaru dan Kesultanan Banten',
  'Bagaimana cara kerja teknologi Artificial Intelligence (AI)?',
  'Bantu buatkan draf surat kronologi pengaduan permasalahan',
];

// Fallback response for offline scenarios
const FALLBACK_KNOWLEDGE: Record<string, string> = {
  pro_bono: `Berdasarkan UU No. 16 Tahun 2011 tentang Bantuan Hukum, masyarakat berhak mendapatkan bantuan hukum cuma-cuma (gratis) jika memenuhi syarat:
1. Menunjukkan KTP/identitas domisili (wilayah Banten).
2. Memiliki Surat Keterangan Tidak Mampu (SKTM) dari Kelurahan/Desa, atau kartu jaminan sosial (KIS/KIP/PKH).
3. Menguraikan pokok masalah perkara secara tertulis.

LBH GP Ansor Banten siap mendampingi Anda tanpa dipungut biaya di Jl. Jagarayu Dalung Serang atau via Hotline WA 0815-1955-5391.`,
  phk: `Terkait Pemutusan Hubungan Kerja (PHK) sepihak:
1. Menurut regulasi ketenagakerjaan, PHK tidak sah jika tanpa alasan yang sah dan tanpa perundingan bipartit.
2. Anda berhak menolak PHK dan meminta perundingan bipartit dalam 30 hari.
3. Anda berhak atas Uang Pesangon (UP), Uang Penghargaan Masa Kerja (UPMK), dan Uang Penggantian Hak (UPH).
4. Jika bipartit buntu, catatkan perselisihan ke Dinas Tenaga Kerja setempat untuk mediasi.`,
  maps: `Kantor Wilayah LBH Ansor Banten beralamat di:
Jl. Jagarayu, Kel. Dalung, Kec. Cipocok Jaya, Kota Serang, Banten 42127 (Gg. Aswaja No. 9 RT 02/02).
Koordinat Google Maps: -6.1352257, 106.1439055
Hotline WhatsApp 24 Jam: 0815-1955-5391
Website Resmi: www.lbhansorbanten.org`,
};

export const LegalChatbot: React.FC<LegalChatbotProps> = ({
  isOpen,
  onClose,
  onOpenConsultation,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Assalamu'alaikum Wr. Wb. Halo! Saya ABI (Ansor Banten Intelligence), asisten cerdas dari LBH Ansor Banten.

Saya siap membantu menjawab pertanyaan Anda layaknya teman ngobrol, seperti:
- Konsultasi hukum atau info bantuan hukum gratis (pro bono) di Banten
- Lokasi kantor dan kontak resmi LBH Ansor Banten
- Pengetahuan umum, sains, teknologi, pendidikan, dan wawasan Islam Aswaja
- Tanya jawab seputar masalah sehari-hari maupun panduan membuat surat

Silakan ketik pertanyaan Anda atau pilih pertanyaan cepat di bawah. Ada yang bisa ABI bantu hari ini?`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call backend API route with history for natural conversational memory
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: query,
          history: messages.slice(-6).map(m => ({
            sender: m.sender,
            text: m.text
          }))
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawReply = data.reply || 'Terima kasih atas pertanyaannya. ABI siap membantu menjawab pertanyaan Anda.';
        const botReply = rawReply.replace(/\*/g, '');
        
        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: botReply,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            isFallback: data.fallback,
          }
        ]);
      } else {
        throw new Error('Gagal menghubungi server');
      }
    } catch (err) {
      // Intelligent fallback response
      let fallbackText = `Terima kasih atas pertanyaan Anda. Tanya ABI siap membantu menjawab segala pertanyaan Anda baik hukum maupun wawasan umum.

Jika Anda membutuhkan konsultasi hukum atau pendampingan perkara di Banten, Anda dapat langsung mengajukan formulir konsultasi di website ini atau hubungi Hotline WhatsApp 0815-1955-5391.`;

      const lower = query.toLowerCase();
      if (lower.includes('gratis') || lower.includes('pro bono') || lower.includes('biaya') || lower.includes('syarat')) {
        fallbackText = FALLBACK_KNOWLEDGE.pro_bono;
      } else if (lower.includes('phk') || lower.includes('pesangon') || lower.includes('buruh')) {
        fallbackText = FALLBACK_KNOWLEDGE.phk;
      } else if (lower.includes('alamat') || lower.includes('lokasi') || lower.includes('maps') || lower.includes('kantor')) {
        fallbackText = FALLBACK_KNOWLEDGE.maps;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: fallbackText.replace(/\*/g, ''),
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          isFallback: true,
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4">
      <div 
        id="legal-chatbot-card"
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl h-[88vh] sm:h-[620px] flex flex-col border border-emerald-800/30 overflow-hidden animate-in slide-in-from-bottom duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-4 flex items-center justify-between border-b border-emerald-800/80">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-800 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-md">
              <Bot className="w-5 h-5" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-emerald-950"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">Tanya ABI</h3>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Ansor Banten AI
                </span>
              </div>
              <p className="text-[11px] text-emerald-200">
                Asisten Bantuan Hukum & Pengetahuan Umum Serba Bisa
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Notice Bar */}
        <div className="bg-emerald-50 px-3 py-1.5 border-b border-emerald-200/80 text-[10px] text-emerald-900 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate">Tanya ABI: Bebas tanyakan hukum, sains, teknologi, dan topik umum lainnya.</span>
          </div>
          <span className="shrink-0 text-[9px] font-bold text-emerald-700 bg-emerald-200/60 px-1.5 py-0.2 rounded">
            24 Jam
          </span>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-900 text-amber-300 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-emerald-800 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text.replace(/\*/g, '')}</div>

                {/* Sub-CTA inside bot messages */}
                {msg.sender === 'bot' && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenConsultation();
                      }}
                      className="font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded transition-colors"
                    >
                      <Scale className="w-3 h-3" />
                      <span>Ajukan Pendampingan Resmi</span>
                    </button>
                  </div>
                )}

                {msg.sender === 'user' && (
                  <div className="text-[10px] text-emerald-200 text-right mt-1">
                    {msg.timestamp}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-slate-500 text-xs py-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-900 text-amber-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-xs">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-bounce delay-150"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-bounce delay-300"></span>
                <span className="text-slate-600 ml-1">ABI sedang menyusun jawaban terbaik...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap flex items-center gap-1.5 no-scrollbar">
          <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0">Pilihan Cepat:</span>
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-[11px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors shrink-0 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2 items-center"
          >
            <input
              type="text"
              placeholder="Tanyakan apa saja kepada ABI di sini..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-700 outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow-md transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
