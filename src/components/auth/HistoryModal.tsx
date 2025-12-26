import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Calendar, LayoutGrid, MessageSquare } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { getTranslation } from '@/lib/i18n';
import { PlacedCard } from '@/types/tarot';
import { CARDS } from '@/lib/cards';
import { SPREADS } from '@/lib/spreads';

interface Session {
  id: string;
  question: string;
  createdAt: string;
  spreadId: string;
  cardsDrawn: {
    cardId: string;
    positionId: string;
    isReversed: boolean;
  }[];
}

interface HistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HistoryModal({ open, onOpenChange }: HistoryModalProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { language, loadSession, setLoadingHistory } = useStore();
  const t = getTranslation(language);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      fetch('/api/sessions')
        .then(res => res.json())
        .then(data => {
          if (data.sessions) setSessions(data.sessions);
        })
        .finally(() => setIsLoading(false));
    }
  }, [open]);

  const handleSessionClick = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    // 1. Immediate UI update with available data
    const placedCards: Record<string, PlacedCard> = {};
    if (session.cardsDrawn) {
        session.cardsDrawn.forEach((cd) => {
            const card = CARDS.find(c => c.id === cd.cardId);
            if (card) {
                placedCards[cd.positionId] = {
                    card,
                    positionId: cd.positionId,
                    isReversed: cd.isReversed
                };
            }
        });
    }

    // Load with empty history first to show the board immediately
    loadSession(session.spreadId, placedCards, sessionId, [], session.question);
    onOpenChange(false);
    setLoadingHistory(true);

    // 2. Fetch full details (messages) in background
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      const data = await res.json();
      
      if (data.session && data.messages) {
        // Convert messages to Chat Message format
        const history = data.messages.map((m: { id: number; role: 'user' | 'assistant'; content: string; createdAt: string }) => ({
            id: m.id.toString(),
            role: m.role,
            content: m.content,
            createdAt: new Date(m.createdAt)
        }));

        // Update session with loaded history
        loadSession(session.spreadId, placedCards, sessionId, history, session.question);
      }
    } catch (error) {
      console.error("Failed to load session details", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSpreadName = (id: string) => {
    return SPREADS.find(s => s.id === id)?.name || id;
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{t.auth.history_title}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh] pr-4">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-center text-muted-foreground p-4">{t.auth.no_history}</p>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className="group border rounded-lg p-4 hover:bg-black/5 transition-all cursor-pointer relative overflow-hidden"
                    onClick={() => handleSessionClick(session.id)}
                  >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-black/5 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10 space-y-3">
                      {/* Header: Question + Time */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg font-serif line-clamp-1">
                             {session.question.length > 10 
                               ? session.question.substring(0, 10) + "..." 
                               : session.question}
                          </h3>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatTime(session.createdAt)}
                        </div>
                      </div>

                      {/* Details: Spread + Cards */}
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                           <LayoutGrid className="w-3 h-3" />
                           <span>{getSpreadName(session.spreadId)}</span>
                        </div>
                        {session.cardsDrawn && session.cardsDrawn.length > 0 && (
                          <div className="col-span-2 flex flex-wrap gap-1 mt-1">
                            {session.cardsDrawn.map((cd, idx) => {
                                const card = CARDS.find(c => c.id === cd.cardId);
                                if (!card) return null;
                                return (
                                    <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-black/5 text-black/70">
                                        {card.name} {cd.isReversed ? '(R)' : ''}
                                    </span>
                                );
                            })}
                          </div>
                        )}
                      </div>
                      
                      {/* Full Question Tooltip/Preview */}
                      <div className="flex items-start gap-2 text-xs text-muted-foreground/70 bg-black/[0.02] p-2 rounded">
                        <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" />
                        <p className="line-clamp-2">{session.question}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
