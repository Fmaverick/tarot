import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { getTranslation } from '@/lib/i18n';
import { Loader2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RedeemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RedeemModal({ open, onOpenChange }: RedeemModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { redeemCode } = useAuthStore();
  const { language } = useStore();
  const t = getTranslation(language);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.target as HTMLFormElement);
    const code = formData.get('code') as string;

    try {
      const result = await redeemCode(code);
      setSuccess(t.auth.redeem_success.replace('{points}', result.pointsAdded.toString()));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        onOpenChange(false);
        setSuccess('');
        (e.target as HTMLFormElement).reset();
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t.auth.error_generic);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.auth.redeem_code}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="code">{t.auth.enter_code}</Label>
            <Input id="code" name="code" type="text" required placeholder="ABCD-1234" />
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="w-4 h-4" />
              {success}
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading || !!success}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.auth.redeem}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
