import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { AuthModal } from './AuthModal';
import { HistoryModal } from './HistoryModal';
import { RedeemModal } from './RedeemModal';
import { User, LogOut, Coins, History, Gift } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { getTranslation } from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const { user, isLoading, fetchUser, logout } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const { language } = useStore();
  const t = getTranslation(language);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoading) {
    return <Button variant="ghost" size="icon" disabled><Loader2 className="h-4 w-4 animate-spin" /></Button>;
  }

  if (!user) {
    return (
      <>
        <Button variant="ghost" size="sm" onClick={() => setShowAuthModal(true)}>
          <User className="h-4 w-4 mr-2" />
          {t.auth.login}
        </Button>
        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </>
    );
  }

  return (
    <>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm font-medium" title={t.auth.credits}>
              <Coins className="h-4 w-4 text-yellow-500" />
              <span>{user.creditBalance}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <span className="text-sm hidden sm:inline-block">{user.email}</span>
                <User className="h-4 w-4 sm:ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t.auth.account}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowHistoryModal(true)} className="cursor-pointer">
                <History className="mr-2 h-4 w-4" />
                <span>{t.auth.history}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowRedeemModal(true)} className="cursor-pointer">
                <Gift className="mr-2 h-4 w-4" />
                <span>{t.auth.redeem_code}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-500 focus:text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t.auth.logout}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <HistoryModal open={showHistoryModal} onOpenChange={setShowHistoryModal} />
        <RedeemModal open={showRedeemModal} onOpenChange={setShowRedeemModal} />
    </>
  );
}
