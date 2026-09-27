import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShoppingBag,
  Eye,
  Plus,
  Check,
  Minimize2,
  Maximize2,
  Trash2,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import { Product, StoreSettings } from '../types/catalog';
import { HermesMessage, parseHermesResponse, generateOfflineHermesReply } from '../utils/hermesAgentUtils';

interface HermesShoppingAgentProps {
  products: Product[];
  storeSettings: StoreSettings;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

const INITIAL_SUGGESTIONS = [
  '🎁 Recomiéndame un buen regalo',
  '💵 ¿Qué tienen por menos de $20?',
  '🚚 ¿Cómo funcionan los envíos y entregas?',
  '🛒 ¿Cómo hago mi pedido por WhatsApp?',
];

export const HermesShoppingAgent: React.FC<HermesShoppingAgentProps> = ({
  products,
  storeSettings,
  onAddToCart,
  onSelectProduct,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<Set<string>>(new Set());
  const [hasUnreadGreeting, setHasUnreadGreeting] = useState(true);

  const [messages, setMessages] = useState<HermesMessage[]>(() => {
    return [
      {
        id: 'msg_welcome',
        sender: 'hermes',
        text: `¡Hola! Soy **Hermes**, el asesor de compras virtual de **${storeSettings.storeName || 'Team Chihuahua'}**. 🛍️\n\n¿Buscas algún producto en especial, una recomendación por presupuesto o tienes dudas sobre entregas? ¡Dime en qué puedo ayudarte!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setHasUnreadGreeting(false);
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: HermesMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build lightweight product context
      const compactProducts = products.map((p) => ({
        id: p.id,
        sku: p.sku,
        title: p.title,
        price: p.price,
        category: p.category,
        brand: p.brand,
        inStock: p.inStock,
      }));

      const res = await fetch('/api/hermes-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: updatedHistory.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          products: compactProducts,
          storeSettings: {
            storeName: storeSettings.storeName,
            currencySymbol: storeSettings.currencySymbol,
            cartAnnouncement: storeSettings.cartAnnouncement,
            whatsappNumber: storeSettings.whatsappNumber,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const hermesReply = data.reply || '¡Con gusto te ayudo!';
        const recommendedIds: string[] = Array.isArray(data.recommendedProductIds)
          ? data.recommendedProductIds
          : [];

        const hermesMsg: HermesMessage = {
          id: `msg_hermes_${Date.now()}`,
          sender: 'hermes',
          text: hermesReply,
          recommendedProductIds: recommendedIds,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, hermesMsg]);
      } else {
        throw new Error('API offline');
      }
    } catch (err) {
      // Graceful offline fallback using local keyword/budget heuristics
      const fallback = generateOfflineHermesReply(query, products, storeSettings);
      const fallbackMsg: HermesMessage = {
        id: `msg_hermes_offline_${Date.now()}`,
        sender: 'hermes',
        text: fallback.message,
        recommendedProductIds: fallback.recommendedProductIds,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCartFromChat = (product: Product) => {
    onAddToCart(product);
    setAddedItemIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedItemIds((prev) => {
        const copy = new Set(prev);
        copy.delete(product.id);
        return copy;
      });
    }, 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        sender: 'hermes',
        text: `¡Historial reiniciado! Estoy listo para ayudarte a encontrar lo que buscas en **${storeSettings.storeName || 'Team Chihuahua'}**. ¿Qué tienes en mente?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2">
          {hasUnreadGreeting && (
            <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs px-3.5 py-2 rounded-2xl shadow-xl border border-emerald-100 dark:border-slate-700 animate-bounce flex items-center gap-2 max-w-[220px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
              <span>¿Necesitas ayuda para elegir? ¡Pregúntale a <strong>Hermes</strong>!</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setHasUnreadGreeting(false);
                }}
                className="text-slate-400 hover:text-slate-600 ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
              setHasUnreadGreeting(false);
            }}
            className="group relative flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Abrir asistente de compras Hermes"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-emerald-600" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold leading-none">Hermes</p>
              <p className="text-[10px] text-emerald-100 font-medium leading-tight">Asistente de Compras</p>
            </div>
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed right-3 sm:right-6 z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-4 w-72 sm:w-80 h-14'
              : 'bottom-4 sm:bottom-6 w-[calc(100vw-24px)] sm:w-96 max-h-[85vh] h-[560px]'
          } bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-3.5 px-4 flex items-center justify-between flex-shrink-0 border-b border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white">Hermes</h3>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded-full font-medium">
                    Asesor IA
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1">
                  {storeSettings.storeName || 'Team Chihuahua'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {!isMinimized && (
                <button
                  onClick={handleClearHistory}
                  title="Reiniciar conversación"
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expandir' : 'Minimizar'}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-xl transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Cerrar"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body (Hidden if minimized) */}
          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70 dark:bg-slate-950/50">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  const recommendedProducts = (msg.recommendedProductIds || [])
                    .map((id) => products.find((p) => p.id === id))
                    .filter((p): p is Product => Boolean(p));

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1.5`}
                    >
                      <div className="flex items-end gap-2 max-w-[85%]">
                        {!isUser && (
                          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mb-1">
                            H
                          </div>
                        )}

                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isUser
                              ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-sm border border-slate-200/80 dark:border-slate-700/80'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                          <span
                            className={`block text-[9px] mt-1 text-right ${
                              isUser ? 'text-emerald-200' : 'text-slate-400'
                            }`}
                          >
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Render Interactive Product Cards */}
                      {recommendedProducts.length > 0 && (
                        <div className="grid grid-cols-1 gap-2 pl-8 pr-2 w-full max-w-sm mt-1">
                          {recommendedProducts.map((prod) => {
                            const isAdded = addedItemIds.has(prod.id);
                            return (
                              <div
                                key={prod.id}
                                className="bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                              >
                                <img
                                  src={prod.image}
                                  alt={prod.title}
                                  className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-900 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                                      {prod.sku}
                                    </span>
                                    {!prod.inStock && (
                                      <span className="text-[9px] bg-rose-100 text-rose-600 px-1 rounded">
                                        Agotado
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                                    {prod.title}
                                  </h4>
                                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                    {storeSettings.currencySymbol || '$'}
                                    {prod.price.toFixed(2)}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <button
                                    onClick={() => onSelectProduct(prod)}
                                    title="Ver detalle del producto"
                                    className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleAddToCartFromChat(prod)}
                                    disabled={!prod.inStock}
                                    title={prod.inStock ? 'Añadir al carrito' : 'Producto agotado'}
                                    className={`p-1.5 rounded-xl font-medium text-xs flex items-center justify-center transition-all ${
                                      isAdded
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 disabled:opacity-40'
                                    }`}
                                  >
                                    {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs pl-8">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                    <span>Hermes está revisando el catálogo...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestions */}
              <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {INITIAL_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sug)}
                    className="flex-shrink-0 text-[11px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              {/* Input bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Pregúntale a Hermes (ej. regalo < $20)..."
                  disabled={isLoading}
                  className="flex-1 px-3.5 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-md disabled:opacity-40 transition-all flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
