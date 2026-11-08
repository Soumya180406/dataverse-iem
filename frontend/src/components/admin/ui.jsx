import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const Confirm = ({ title, text, onConfirm, children, testid, action = "Confirm" }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
    <AlertDialogContent className="border-slate-700 bg-[#0b1020]">
      <AlertDialogTitle>{title}</AlertDialogTitle>
      <AlertDialogDescription>{text}</AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogCancel data-testid={`${testid}-cancel`}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-500" data-testid={`${testid}-confirm`}>{action}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export const Card = ({ title, children, right, testid }) => (
  <div className="glass rounded-2xl p-5" data-testid={testid}>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
      {right}
    </div>
    {children}
  </div>
);

export const btn = "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40";
export const btnDanger = `${btn} border-red-500/50 text-red-300 hover:bg-red-500/10`;
export const btnPlain = `${btn} border-slate-600 text-slate-200 hover:bg-white/5`;
