import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { getTranslation } from '@/lib/i18n';

interface Session {
  id: string;
  question: string;
  createdAt: string;
  spreadId: string;
}

interface HistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HistoryModal({ open, onOpenChange }: HistoryModalProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useStore();
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
                  <div key={session.id} className="border rounded-lg p-4 hover:bg-black/5 transition-colors cursor-pointer">
                    <p className="font-medium truncate">{session.question}</p>
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>{session.spreadId}</span>
                      <span>{new Date(session.createdAt).toLocaleDateString()}</span>
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
