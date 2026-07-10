'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const translations = {
  hu: {
    title: 'Cimbi AI Asszisztens',
    subtitle: 'Online • Színházi asztalos múlt',
    placeholder: 'Kérdezzen bátran...',
    typing: 'Cimbi ír...',
    close: 'Bezárás',
    welcome: 'Szia! Czimber Tibor (Cimbi) AI asszisztense vagyok. Miben segíthetek ma? Kérdezhetsz a színházi díszletépítő múltamról, egyedi konyha-, fürdőszoba- vagy előszobabútoraimról, osztrák kiszállításról, vagy akár az [Ajánlatkérés](#quote) menetéről!',
    quickReplies: [
      { text: 'Színházi múlt? 🎭', prompt: 'Mesélj a színházi díszletépítő múltadról! Hogyan hat ez a bútorok minőségére?' },
      { text: 'Ausztriába is szállítasz? 🇦🇹', prompt: 'Hogyan működik a felmérés és kiszállítás Ausztriába (pl. Graz, Burgenland)?' },
      { text: 'Árajánlat menete? 📝', prompt: 'Hogyan kérhetek árajánlatot, és mennyi idő alatt válaszolsz?' },
      { text: 'Milyen bútort készítesz? 🍳', prompt: 'Milyen prémium egyedi bútorkategóriákat készítesz?' }
    ]
  },
  de: {
    title: 'Cimbi KI-Assistent',
    subtitle: 'Online • Theater-Schreiner Vergangenheit',
    placeholder: 'Stellen Sie eine Frage...',
    typing: 'Cimbi schreibt...',
    close: 'Schließen',
    welcome: 'Hallo! Ich bin der KI-Assistent von Czimber Tibor (Cimbi). Wie kann ich Ihnen heute helfen? Sie können nach meiner Theater-Schreiner Vergangenheit, Lieferungen nach Österreich, maßgefertigten Möbeln oder dem Ablauf für ein [Angebot anfordern](#quote) fragen!',
    quickReplies: [
      { text: 'Theater-Vergangenheit? 🎭', prompt: 'Erzählen Sie mir von Ihrer Zeit beim Theater! Wie beeinflusst das die Qualität Ihrer Arbeit?' },
      { text: 'Lieferung nach Österreich? 🇦🇹', prompt: 'Wie läuft die Vermessung und Lieferung nach Österreich (z. B. Graz, Burgenland)?' },
      { text: 'Ablauf des Angebots? 📝', prompt: 'Wie kann ich ein Angebot anfordern und wie schnell antworten Sie?' },
      { text: 'Welche Möbel bauen Sie? 🍳', prompt: 'Welche Arten von maßgefertigten Premium-Möbeln stellen Sie her?' }
    ]
  },
  en: {
    title: 'Cimbi AI Assistant',
    subtitle: 'Online • Theatrical carpentry background',
    placeholder: 'Ask a question...',
    typing: 'Cimbi is typing...',
    close: 'Close',
    welcome: 'Hello! I am Czimber Tibor\'s (Cimbi) AI assistant. How can I help you today? You can ask about my theatrical scenery building background, custom kitchen, bathroom, or hallway furniture, delivery to Austria, or the [Quote request](#quote) process!',
    quickReplies: [
      { text: 'Theater background? 🎭', prompt: 'Tell me about your theater scenery building background! How does it affect your furniture quality?' },
      { text: 'Delivery to Austria? 🇦🇹', prompt: 'How does onsite measurement and delivery to Austria (e.g. Graz, Burgenland) work?' },
      { text: 'Quote process? 📝', prompt: 'How can I get a quote and how quickly do you respond?' },
      { text: 'What furniture do you make? 🍳', prompt: 'What kinds of premium custom furniture categories do you build?' }
    ]
  }
};

type SupportedLocale = 'hu' | 'de' | 'en';

export default function AIAssistant() {
  const rawLocale = useLocale();
  const locale = (translations.hasOwnProperty(rawLocale) ? rawLocale : 'hu') as SupportedLocale;
  const t = translations[locale];

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: t.welcome,
      },
    ]);
  }, [t.welcome]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Show a pulse badge on load after a delay if not open
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && messages.length <= 1) {
        setHasNewMessage(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [isOpen, messages.length]);

  const handleSend = async (textToSend: string) => {
    const trimmedText = textToSend.trim();
    if (!trimmedText || isLoading) return;

    const userMessage: Message = { role: 'user', content: trimmedText };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setHasNewMessage(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat completion');
      }

      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content || 'Sajnálom, hiba történt a válasz generálása során.';

      setMessages((prev) => [...prev, { role: 'assistant', content: botReply }]);
    } catch (error) {
      console.error('Error sending message:', error);
      let errorMsg = 'Hiba történt a küldés során. Kérlek próbáld újra!';
      if (locale === 'de') errorMsg = 'Fehler beim Senden. Bitte versuchen Sie es erneut!';
      if (locale === 'en') errorMsg = 'Error sending message. Please try again!';
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMsg,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseMessageText = (text: string) => {
    // Splits text by bold parts **text** and links [label](url)
    const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-bold text-[var(--color-spotlight)]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const isAnchor = href.startsWith('#');
        if (isAnchor) {
          return (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(href.slice(1));
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                  setIsOpen(false);
                }
              }}
              className="text-[var(--color-spotlight)] font-semibold underline hover:text-white transition-colors cursor-pointer inline-block mx-0.5"
            >
              {label}
            </button>
          );
        }
        return (
          <a
            key={idx}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-spotlight)] font-semibold underline hover:text-white transition-colors inline-block mx-0.5"
          >
            {label}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Chat Window Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)] rounded-2xl border border-[var(--color-walnut)]/60 bg-[var(--color-smoke)]/95 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--color-walnut)]/50 bg-black/35 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src="/nkep.jpg"
                    alt="Czimber Tibor"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border border-[var(--color-spotlight)]/40"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[var(--color-smoke)] animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display leading-tight">{t.title}</h3>
                  <p className="text-[10px] text-[var(--color-birch)]/70">{t.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--color-birch)]/50 hover:text-[var(--color-spotlight)] transition-colors p-1"
                aria-label={t.close}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages body */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[var(--color-walnut-light)] scrollbar-track-transparent"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-md ${
                      msg.role === 'user'
                        ? 'bg-[var(--color-walnut-light)] text-[var(--color-birch)] rounded-tr-none'
                        : 'bg-[var(--color-smoke-light)] text-[var(--color-birch)] border border-[var(--color-walnut)]/40 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{parseMessageText(msg.content)}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--color-smoke-light)] text-[var(--color-birch)] border border-[var(--color-walnut)]/40 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-2">
                    <span className="text-xs text-[var(--color-birch)]/60 font-medium">{t.typing}</span>
                    <div className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-spotlight)] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-spotlight)] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-spotlight)] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-[var(--color-walnut)]/30 bg-black/10">
                {t.quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(reply.prompt)}
                    className="px-3 py-1.5 border border-[var(--color-walnut)]/40 bg-[var(--color-stage)] text-[var(--color-birch)]/80 text-xs rounded-full hover:border-[var(--color-spotlight)] hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-[var(--color-spotlight)]/10"
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t border-[var(--color-walnut)]/50 bg-black/25 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                className="flex-1 bg-[var(--color-walnut)]/20 border border-[var(--color-walnut)]/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[var(--color-stone)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--color-spotlight)] focus:border-transparent transition-all duration-200"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-xl bg-[var(--color-spotlight)] text-[var(--color-stage)] font-bold hover:bg-[var(--color-spotlight)]/85 active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:scale-100 flex items-center justify-center cursor-pointer shadow-md shadow-[var(--color-spotlight)]/10 min-w-[42px] min-h-[42px]"
                aria-label="Send"
              >
                <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9-7-9-7v14z" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          setHasNewMessage(false);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-[var(--color-smoke)] border-2 border-[var(--color-spotlight)] shadow-2xl flex items-center justify-center relative cursor-pointer group"
        aria-label="Toggle AI Assistant"
      >
        {/* Glowing aura */}
        <span className="absolute inset-0 rounded-full bg-[var(--color-spotlight)]/10 group-hover:scale-110 transition-transform duration-300" />
        
        {/* Pulsing indicator badge */}
        {hasNewMessage && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-spotlight)] opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[var(--color-spotlight)] text-[var(--color-stage)] text-[9px] font-extrabold items-center justify-center shadow-md">
              1
            </span>
          </span>
        )}

        {/* Dynamic icon depending on open/close state */}
        {isOpen ? (
          <svg className="w-6 h-6 text-[var(--color-spotlight)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="flex flex-col items-center justify-center">
            {/* Custom premium icon: speech bubble + theater masks vibes */}
            <span className="text-xl leading-none">🎭</span>
            <span className="text-[7px] text-[var(--color-spotlight)] font-bold tracking-widest -mt-0.5">AI</span>
          </div>
        )}
      </motion.button>
    </div>
  );
}
