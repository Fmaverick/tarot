"use client";

import { useState, useRef, useEffect } from "react";
import { useChat, type Message } from "ai/react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { ArrowUp, Loader2 } from "lucide-react";
import { AgentPlanResponse } from "@/types/agent";
import { DraggableSpreadBoard } from "./DraggableSpreadBoard";
import { Spread, PlacedCard, TarotCard as TarotCardType } from "@/types/tarot";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { CARDS } from "@/lib/cards";

interface MessageData {
  type: 'spread_design';
  spread: Spread;
  placedCards?: Record<string, PlacedCard>;
}

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

export function CustomModeView() {
  const searchParams = useSearchParams();
  const urlSessionId = searchParams.get('sessionId');
  
  const { 
    sessionId, 
    language, 
    deck, 
    initializeDeck, 
    startReading,
    selectedSpread,
    placedCards: storePlacedCards,
    chatHistory,
    loadSession,
    setLoadingHistory
  } = useStore();
  const { } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [currentSpread, setCurrentSpread] = useState<Spread | null>(selectedSpread);
  const [placedCards, setPlacedCards] = useState<Record<string, PlacedCard>>(storePlacedCards);
  const [isPlanning, setIsPlanning] = useState(false);
  
  const { messages, append, input, handleInputChange, setMessages, isLoading, setInput } = useChat({
    api: "/api/agent/chat",
    initialMessages: chatHistory,
    body: {
      sessionId,
      context: {
        spread: currentSpread,
        cards: Object.values(placedCards),
      },
    },
  });

  // We keep track of the conversation state related to the spread
  const [viewState, setViewState] = useState<'initial' | 'planning' | 'drawing' | 'interpreting' | 'chatting'>(
    chatHistory.length > 0 ? 'chatting' : 'initial'
  );

  // Load session from URL if present
  useEffect(() => {
    if (urlSessionId && urlSessionId !== sessionId) {
      setLoadingHistory(true);
      fetch(`/api/sessions/${urlSessionId}`)
        .then(res => res.json())
        .then(async data => {
            if (data.session) {
                const session = data.session;
                let spread: Spread | undefined;
                
                // Parse spread config
                if (session.customSpreadConfig) {
                    try {
                        const config = JSON.parse(session.customSpreadConfig);
                        spread = {
                            id: session.spreadId,
                            ...config
                        };
                    } catch (e) {
                        console.error("Failed to parse custom spread config", e);
                    }
                } else if (session.spreadId) {
                    // Fetch spread definition if custom config is missing
                    try {
                        console.log("[CustomModeView] Fetching standard spread:", session.spreadId);
                        const spreadRes = await fetch(`/api/spreads?lang=${language}`);
                        const spreads = await spreadRes.json();
                        spread = spreads.find((s: Spread) => s.id === session.spreadId);
                        
                        // If not found in standard list, it might be a custom spread ID stored in standard table or mismatched ID
                        // Try to find by direct slug match if ID match failed (sometimes slug vs id confusion)
                        if (!spread) {
                             console.warn("[CustomModeView] Spread not found in standard list by ID, trying loose match or re-fetch");
                             // For now, if it's not in the list, we can't do much unless we have a specific endpoint for single spread
                             // But let's check if the ID in session is actually the 'slug' in spreads table
                             spread = spreads.find((s: Spread) => s.id === session.spreadId); 
                        }

                        console.log("[CustomModeView] Found standard spread:", spread);
                    } catch (e) {
                        console.error("Failed to fetch spread definition", e);
                    }
                }

                // Parse placed cards
                const loadedPlacedCards: Record<string, PlacedCard> = {};
                if (session.cardsDrawn) {
                    session.cardsDrawn.forEach((cd: { cardId: string; positionId: string; isReversed: boolean }) => {
                        const card = CARDS.find(c => c.id === cd.cardId);
                        if (card) {
                            loadedPlacedCards[cd.positionId] = {
                                card,
                                positionId: cd.positionId,
                                isReversed: cd.isReversed
                            };
                        }
                    });
                }

                // Parse history
                let history: Message[] = [];
                if (data.messages) {
                    history = data.messages.map((m: { id: number; role: 'user' | 'assistant'; content: string; data?: string; createdAt: string }) => ({
                        id: m.id.toString(),
                        role: m.role,
                        content: m.content,
                        data: m.data ? JSON.parse(m.data) : undefined,
                        createdAt: new Date(m.createdAt)
                    }));
                }

                console.log("[CustomModeView] Loaded Session:", { spread, loadedPlacedCards, history });

                if (spread) {
                    // Try to attach spread data to the relevant history message
                    // because the API only returns content, not the 'data' field needed for rendering the board.
                    
                    // 1. Try matching by spread name
                    let designMsgIndex = history.findIndex(m => m.role === 'assistant' && m.content.includes(spread!.name));
                    
                    // 2. Fallback: Try matching by template text (multi-language)
                    if (designMsgIndex === -1) {
                         const designTemplates = [
                            "I have designed a new spread for you",
                            "我为你设计了一个新的牌阵",
                            "I have designed a new spread"
                        ];
                        designMsgIndex = history.findIndex(m => 
                            m.role === 'assistant' && 
                            designTemplates.some(t => m.content.includes(t))
                        );
                    }

                    // 3. Fallback: If still not found, but we have a spread, maybe attach to the first assistant message?
                    if (designMsgIndex === -1 && history.length > 0) {
                        const firstAssistant = history.findIndex(m => m.role === 'assistant');
                        if (firstAssistant !== -1) {
                             designMsgIndex = firstAssistant;
                        }
                    }

                    let finalHistory = history;
                    if (designMsgIndex !== -1) {
                        finalHistory = [...history];
                        // Only attach if not already present or if we want to ensure the session's primary spread is attached
                        if (!finalHistory[designMsgIndex].data) {
                            finalHistory[designMsgIndex] = {
                                ...finalHistory[designMsgIndex],
                                data: { type: 'spread_design', spread: spread } as unknown as Message['data']
                            };
                        }
                    }

                    loadSession(spread, loadedPlacedCards, urlSessionId, finalHistory, session.question);
                    
                    // Sync local state
                    setCurrentSpread(spread);
                    setPlacedCards(loadedPlacedCards);
                    setMessages(finalHistory);
                    setViewState('chatting');

                } else {
                    console.warn("[CustomModeView] Spread not found in session data");
                }
            } else {
                console.warn("[CustomModeView] Session data is missing or empty");
            }
        })
        .catch(err => console.error("Failed to load session", err))
        .finally(() => setLoadingHistory(false));
    }
  }, [urlSessionId, sessionId, loadSession, setLoadingHistory, language, setMessages]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, viewState, isPlanning]);

  // Sync with store when it changes (e.g. from history)
  useEffect(() => {
    if (selectedSpread) {
        setCurrentSpread(selectedSpread);
    }
    if (storePlacedCards) {
        setPlacedCards(storePlacedCards);
    }
    if (chatHistory.length > 0) {
        setMessages(chatHistory);
        setViewState('chatting');
    }
  }, [selectedSpread, storePlacedCards, chatHistory, setMessages]);

  // Ensure deck is shuffled on mount and session is initialized if none exists
  useEffect(() => {
    if (!sessionId) {
        initializeDeck();
        startReading();
    } else if (deck.length === 0 && !selectedSpread) {
        initializeDeck();
    }
  }, [sessionId, deck.length, selectedSpread, initializeDeck, startReading]);

  const t_custom = {
    en: {
        consulting: "Consulting the spirits...",
        draw_prompt: "Please draw the cards first...",
        ask_prompt: "Ask your question...",
        design_msg: (name: string, desc: string) => `I have designed a new spread for you: **${name}**. \n\n${desc}\n\nPlease draw cards for the positions below.`,
        drawn_msg: "I have finished drawing the cards. Please interpret the spread."
    },
    zh: {
        consulting: "正在征询灵意...",
        draw_prompt: "请先完成抽牌...",
        ask_prompt: "请描述你的问题...",
        design_msg: (name: string, desc: string) => `我为你设计了一个新的牌阵：**${name}**。\n\n${desc}\n\n请为以下位置抽牌。`,
        drawn_msg: "我已完成抽牌，请解读。"
    }
  }[language] || {
        consulting: "Consulting the spirits...",
        draw_prompt: "Please draw the cards first...",
        ask_prompt: "Ask your question...",
        design_msg: (name: string, desc: string) => `I have designed a new spread for you: **${name}**. \n\n${desc}\n\nPlease draw cards for the positions below.`,
        drawn_msg: "I have finished drawing the cards. Please interpret the spread."
    };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() && viewState !== 'initial') return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to UI immediately
    const newMessages: Message[] = [
      ...messages, 
      { id: generateId(), role: 'user', content: userMessage }
    ];
    setMessages(newMessages);

    // Call Agent Plan
    setIsPlanning(true);
    setViewState('planning');

    try {
      const planRes = await fetch("/api/agent/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messages: newMessages,
          currentSpread,
          mode: 'macro' // Default for MVP
        }),
      });

      if (!planRes.ok) throw new Error("Agent plan failed");

      const plan: AgentPlanResponse = await planRes.json();
      console.log("Agent Plan:", plan);

      if (plan.action === "DESIGN_SPREAD" && plan.spread) {
        // Set the new spread
        const newSpread: Spread = {
          id: generateId(),
          ...plan.spread
        };
        setCurrentSpread(newSpread);
        setPlacedCards({}); // Reset cards for new spread
        setViewState('drawing');
        
        // Add a system message indicating the new spread
        const spreadMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: t_custom.design_msg(newSpread.name, newSpread.description),
          data: { type: 'spread_design', spread: newSpread } as unknown as Message['data']
        };
        setMessages([...newMessages, spreadMessage]);

      } else {
        // Direct Reply
        // Trigger the standard chat API
        setViewState('chatting');
        await append({
            role: 'user',
            content: userMessage
        }, {
             body: {
              context: {
                spread: currentSpread,
                cards: Object.values(placedCards),
              },
            },
        });
      }

    } catch (error) {
      console.error(error);
      // Fallback to direct chat if planning fails
      await append({
          role: 'user',
          content: userMessage
      });
    } finally {
      setIsPlanning(false);
    }
  };

  const handlePlaceCard = (positionId: string, card: TarotCardType, isReversed: boolean) => {
    if (placedCards[positionId]) return;

    const newPlaced: PlacedCard = {
        card,
        positionId,
        isReversed
    };

    const updatedPlaced = { ...placedCards, [positionId]: newPlaced };
    setPlacedCards(updatedPlaced);

    // Update the message in local state immediately to persist the placed card
    const updatedMessages = messages.map(m => {
        const data = m.data as unknown as MessageData;
        if (data?.type === 'spread_design' && data?.spread?.id === currentSpread?.id) {
            return {
                ...m,
                data: {
                    ...data,
                    placedCards: updatedPlaced
                } as unknown as Message['data']
            };
        }
        return m;
    });
    setMessages(updatedMessages);

    // Check if spread is complete
    if (currentSpread && Object.keys(updatedPlaced).length === currentSpread.positions.length) {
        // Spread complete! Trigger interpretation
        setViewState('interpreting');
        
        // We use a timeout to allow the user to see the last card drawn before scrolling/interpreting
        setTimeout(async () => {
             await append({
                role: 'user',
                content: t_custom.drawn_msg
            }, {
                body: {
                    context: {
                        spread: currentSpread,
                        cards: Object.values(updatedPlaced),
                        question: messages.find(m => m.role === 'user')?.content
                    }
                }
            });
            setViewState('chatting');
        }, 1000);
    }
  };

  return (
    <>
    <div className="w-full h-full flex flex-col relative bg-white/50 backdrop-blur-sm rounded-3xl overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 flex flex-col mask-image-gradient">
            {messages.map(m => (
                <div key={m.id} className="flex flex-col w-full gap-4">
                    {/* Don't show the synthetic "I have finished drawing..." message */}
                    {!(m.role === 'user' && m.content === t_custom.drawn_msg) && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col gap-2 w-full items-start"
                        >
                            <div className={cn(
                                "py-2 text-sm leading-relaxed text-left max-w-none w-full",
                                m.role === 'user' 
                                    ? "text-black font-medium font-serif whitespace-pre-wrap" 
                                    : "text-black/80 prose prose-neutral prose-sm prose-p:font-serif prose-headings:font-serif prose-headings:font-normal prose-strong:font-medium prose-a:text-black prose-a:underline prose-li:marker:text-black/40"
                            )}>
                                {m.role === 'user' ? (
                                    m.content
                                ) : (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {m.content}
                                    </ReactMarkdown>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Check for embedded spread */}
                    {(m.data as unknown as MessageData)?.type === 'spread_design' && (m.data as unknown as MessageData)?.spread && (
                        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                            <DraggableSpreadBoard
                                spread={(m.data as unknown as MessageData).spread}
                                placedCards={
                                    // Priority: 1. Persisted cards in message data, 2. Current state if active spread
                                    (m.data as unknown as MessageData).placedCards || 
                                    ((currentSpread?.id === (m.data as unknown as MessageData).spread.id) ? placedCards : {}) 
                                }
                                onPlaceCard={handlePlaceCard}
                                deck={deck}
                                language={language}
                            />
                        </div>
                    )}
                </div>
            ))}
            
            {isPlanning && (
                <div className="flex items-center gap-2 text-black/40 text-xs py-4">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="font-serif italic">{t_custom.consulting}</span>
                </div>
            )}
             {isLoading && !isPlanning && (
                <div className="flex items-center gap-2 py-2">
                     <span className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce" />
                     <span className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                     <span className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="pt-2 pb-4 lg:pt-2 lg:pb-6">
            <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSendMessage} 
                className="relative flex flex-col gap-2"
            >
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder={viewState === 'drawing' ? t_custom.draw_prompt : t_custom.ask_prompt}
                        disabled={viewState === 'drawing' || isPlanning || isLoading}
                        className="w-full h-24 p-4 bg-transparent focus:outline-none resize-none text-sm font-light placeholder:text-black/40"
                    />
                    
                    {/* Custom Bottom Border */}
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/20 to-transparent" />

                    <Button 
                        type="submit"
                        size="icon"
                        disabled={viewState === 'drawing' || isPlanning || isLoading || !input.trim()}
                        className="absolute right-3 bottom-3 h-8 w-8 rounded-lg bg-black text-white hover:bg-black/80 shadow-md transition-all"
                    >
                        <ArrowUp className="w-4 h-4" />
                    </Button>
                </div>
            </motion.form>
        </div>
    </div>
    <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
}
