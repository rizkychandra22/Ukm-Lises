import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AccountDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function AccountDeleteDialog({
  isOpen,
  onOpenChange,
  onConfirm,
}: AccountDeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[90%] max-w-[360px] rounded-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-lg font-semibold">
            Hapus Rekening
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-[14px] mt-2 mb-4 text-foreground/80">
            Yakin ingin menghapus rekening pembayaran ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-row items-center justify-center gap-3">
          <AlertDialogCancel className="w-24 border h-8 text-[13px] !mt-0">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="w-24 h-8 text-[13px] bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Hapus
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
