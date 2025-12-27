import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PricingCards } from "./PricingCards";
import { useStore } from "@/store/useStore";
import { getTranslation } from "@/lib/i18n";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const { language } = useStore();
  const t = getTranslation(language);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-[#fcfcfc] overflow-y-auto max-h-[90vh]">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-3xl font-serif text-center font-light">{t.pricing.title}</DialogTitle>
          <p className="text-center text-black/50 font-light mt-2">{t.pricing.subtitle}</p>
        </DialogHeader>
        <PricingCards isModal />
      </DialogContent>
    </Dialog>
  );
}
