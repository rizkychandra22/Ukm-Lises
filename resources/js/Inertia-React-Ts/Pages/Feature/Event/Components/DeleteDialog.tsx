import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteDialog({
  isOpen,
  onOpenChange,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[90%] max-w-[360px] rounded-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-lg font-semibold">
            Hapus Event
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-[14px] mt-2 mb-4 text-foreground/80">
            Yakin ingin menghapus event ini? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-row justify-center gap-3">
          <AlertDialogCancel className="w-24 border h-8 text-[13px]">Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="w-24 h-8 text-[13px] bg-destructive text-destructive-foreground"
          >
            Hapus
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { DeleteDialog as EventDeleteDialog };
