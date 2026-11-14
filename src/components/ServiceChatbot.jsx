import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Mail } from 'lucide-react';
import { BRAND, createEmailLink, discountedPrice, DISCOUNT_PERCENT } from '../data/siteData';
import { useStudioData } from '../context/StudioDataContext';

const greeting = `Hi! I can help with service prices and quotes. You get ${DISCOUNT_PERCENT}% off every service, and you can tell us your budget to discuss a custom quote. What are you looking for?`;

const normalize = value => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export default function ServiceChatbot() {
  const { services } = useStudioData();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'bot', text: greeting }]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const createReply = (rawMessage) => {
    const message = normalize(rawMessage);
    if (/^(hi|hello|hey|good morning|good evening)$/.test(message)) {
      return greeting;
    }

    if (message.includes('all prices') || message.includes('show prices')) {
      return services
        .map(service => {
          const startingPrice = Math.min(...service.pricing.map(price => discountedPrice(price.price)));
          return `${service.title}: starting from ₹${startingPrice} after ${DISCOUNT_PERCENT}% off`;
        })
        .join('\n');
    }

    const service = services
      .map(item => {
        const words = normalize(item.title).split(' ').filter(word => word.length > 2);
        const score = words.reduce((total, word) => total + (message.includes(word) ? 1 : 0), 0);
        return { item, score };
      })
      .sort((a, b) => b.score - a.score)[0];

    if (!service || service.score === 0) {
      if (message.includes('discount') || message.includes('bargain') || message.includes('negotiate') || message.includes('off')) {
        return `Yes, ${DISCOUNT_PERCENT}% is already taken off every service price shown here. Share the service and your budget, and we’ll help discuss a suitable package.`;
      }
      if (message.includes('contact') || message.includes('human') || message.includes('talk')) {
        return `You can email us at ${BRAND.email} or message @${BRAND.instagramHandle} on Instagram. Tell us the service and your preferred budget.`;
      }
      return 'Tell me the service you need (for example: video editing, poster, logo, thumbnail, business card, or AI video) and I’ll share the prices after your 10% discount.';
    }

    const tier = service.item.pricing.find(price => {
      const tierName = normalize(price.service || price.duration || '');
      return tierName && message.includes(tierName);
    });

    if (tier) {
      const dealPrice = discountedPrice(tier.price);
      return `${service.item.title} — ${tier.service || tier.duration}: listed at ₹${tier.price}; after ${DISCOUNT_PERCENT}% off, ₹${dealPrice}. If you have a budget in mind, share it and we can discuss a suitable option.`;
    }

    const priceList = service.item.pricing
      .map(price => `${price.service || price.duration}: ₹${discountedPrice(price.price)} (listed ₹${price.price})`)
      .join('\n');
    return `${service.item.title} pricing after ${DISCOUNT_PERCENT}% off:\n${priceList}\n\nYou can bargain or share your budget; we’ll discuss a suitable package with you.`;
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages(current => [
      ...current,
      { role: 'user', text },
      { role: 'bot', text: createReply(text) }
    ]);
    setInput('');
  };

  const emailLink = createEmailLink(
    'Service quote and budget enquiry',
    `Hello ${BRAND.name},\n\nI would like to discuss a service and my budget.\n\n`
  );

  return (
    <div className="fixed bottom-24 right-5 z-40 sm:right-6">
      {isOpen && (
        <section
          aria-label="NISHIGLOWSTUDIO price chatbot"
          className="mb-3 flex h-[min(70vh,34rem)] w-[min(22rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-purple-500/30 bg-[#0b0e1b] shadow-2xl shadow-purple-950/60"
        >
          <header className="flex items-center justify-between border-b border-purple-500/20 bg-slate-900/80 p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/25 text-purple-300">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-white">Studio price assistant</h2>
                <p className="text-[11px] text-emerald-300">{DISCOUNT_PERCENT}% off every service</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close price assistant"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`}
                className={`max-w-[90%] whitespace-pre-line rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${
                  message.role === 'user'
                    ? 'ml-auto bg-purple-600 text-white'
                    : 'mr-auto border border-slate-700 bg-slate-900 text-slate-200'
                }`}
              >
                {message.text}
              </p>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-800 p-3">
            <div className="mb-2 flex gap-2 overflow-x-auto">
              {['Show prices', 'How much discount?', 'I want to bargain'].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setInput(prompt === 'Show prices' ? 'Show service prices' : prompt);
                  }}
                  className="shrink-0 rounded-full border border-purple-500/30 px-2.5 py-1 text-[10px] text-purple-200 hover:bg-purple-500/10"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form onSubmit={sendMessage} className="flex items-center gap-2">
              <input
                value={input}
                onChange={event => setInput(event.target.value)}
                placeholder="Ask a price or share your budget"
                aria-label="Message the price assistant"
                maxLength={300}
                className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="rounded-xl bg-purple-600 p-2.5 text-white hover:bg-purple-500 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <a href={emailLink} className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-purple-300">
              <Mail className="h-3 w-3" /> Discuss a custom budget by email
            </a>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(open => !open)}
        aria-label={isOpen ? 'Close price assistant' : 'Open price assistant'}
        aria-expanded={isOpen}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-600/30 transition-transform hover:scale-105"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
