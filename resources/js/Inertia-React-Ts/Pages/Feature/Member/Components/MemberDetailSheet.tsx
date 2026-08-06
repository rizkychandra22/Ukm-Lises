import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BatchMember } from "../Types";

interface MemberDetailSheetProps {
  isOpen: boolean;
  member: BatchMember | null;
  onClose: () => void;
}

export function MemberDetailSheet({
  isOpen,
  member,
  onClose,
}: MemberDetailSheetProps) {
  if (!member) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <SheetHeader className="mb-4">
          <SheetTitle>Detail Anggota</SheetTitle>
          <SheetDescription>Informasi lengkap anggota UKM Lises.</SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src={
                member.image
                  ? member.image
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`
              }
              alt={member.name}
              className="w-24 h-24 min-w-24 min-h-24 shrink-0 rounded-full object-cover border-4 border-muted shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <div className="col-span-2">
              <h4 className="text-sm font-medium text-muted-foreground">Nama Lengkap</h4>
              <p className="text-base font-medium">{member.name}</p>
            </div>

            <div className="col-span-2">
              <h4 className="text-sm font-medium text-muted-foreground">Program Studi</h4>
              <p className="text-base font-medium">
                {member.major
                  ? `${member.major.degree ? member.major.degree + " - " : ""}${member.major.name_id}`
                  : member.major_id}
              </p>
            </div>

            <div className="col-span-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Angkatan Tahun <b>{member.batch?.year}</b>
              </h4>
              <p className="text-base font-medium">{member.batch?.year} - {member.batch?.name_id}</p>
            </div>

            {member.type === "Pengurus" && (
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground">Jabatan</h4>
                <p className="text-base font-medium">{member.position_id || "-"}</p>
              </div>
            )}

            <div className={member.type === "Pengurus" ? "col-span-1" : "col-span-2"}>
              <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
              <p className="text-base font-medium flex items-center">
                {member.type === "Pengurus" ? "Kepengurusan" : "Demisioner"}
                <span
                  className={`ml-2 text-xs leading-none px-2 py-0.5 rounded-full ${
                    member.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {member.status}
                </span>
              </p>
            </div>

            {member.type === "Pengurus" && (
              <div className="col-span-1 ml-3">
                <h4 className="text-sm font-medium text-muted-foreground">Periode</h4>
                <p className="text-base font-medium">{member.periode || "-"}</p>
              </div>
            )}

            <div className="col-span-2 pt-2 mt-1 border-t border-border/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">WhatsApp</h4>
                  <p className="text-base font-medium font-mono">{member.whatsapp || "-"}</p>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Instagram</h4>
                  <p className="text-base font-medium">{member.instagram || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
