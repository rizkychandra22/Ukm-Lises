import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { BatchMember, Batch, Major } from "../Types";

interface MemberFormModalProps {
  isOpen: boolean;
  editingMember: BatchMember | null;
  batches: Batch[];
  majors: Major[];
  faculties: string[];
  availableMajors: Major[];
  selectedFaculty: string;
  activeMemberTab: string;
  userBatch?: Batch;
  hasRole: (roles: string | string[]) => boolean;
  memberData: {
    batch_id: string;
    image: File | null;
    name: string;
    major_id: string;
    type: "Demisioner" | "Pengurus";
    status: "Active" | "Deactive";
    periode: string;
    position_id: string;
    whatsapp: string;
    instagram: string;
  };
  memberErrors: Record<string, string>;
  processingMember: boolean;
  setMemberData: React.Dispatch<React.SetStateAction<any>>;
  onFacultyChange: (faculty: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function MemberFormModal({
  isOpen,
  editingMember,
  batches,
  faculties,
  availableMajors,
  selectedFaculty,
  activeMemberTab,
  userBatch,
  hasRole,
  memberData,
  memberErrors,
  processingMember,
  setMemberData,
  onFacultyChange,
  onSubmit,
  onCancel,
}: MemberFormModalProps) {
  const selectedBatch = batches.find((b) => b.id.toString() === memberData.batch_id);
  const isDeactiveBatch = selectedBatch?.status === "Deactive";
  const isDemisionerForm = memberData.type === "Demisioner" || isDeactiveBatch;

  let orgStatusValue = "";
  if (memberData.status === "Active") {
    orgStatusValue = "Kepengurusan";
  } else if (memberData.position_id === "Anggota Biasa") {
    orgStatusValue = "Anggota Biasa";
  } else if (memberData.position_id === "Anggota Baru") {
    orgStatusValue = "Anggota Baru";
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="w-[90%] max-w-[500px] rounded-md">
        <DialogHeader>
          <DialogTitle>{editingMember ? "Edit Anggota" : "Tambah Anggota Baru"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={onSubmit}
          className="space-y-4 pt-4 max-h-[75vh] overflow-y-auto no-scrollbar px-1"
        >
          {/* Nama Anggota */}
          <div>
            <label className="block text-sm font-medium mb-1">Nama Anggota</label>
            <Input
              className="h-8 text-[13px]"
              placeholder="Nama Lengkap"
              value={memberData.name}
              onChange={(e) => setMemberData((prev: any) => ({ ...prev, name: e.target.value }))}
              required
            />
            {memberErrors.name && (
              <span className="text-xs text-destructive">{memberErrors.name}</span>
            )}
          </div>

          {/* Fakultas & Program Studi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fakultas</label>
              <Select
                value={selectedFaculty || undefined}
                onValueChange={(val) => {
                  onFacultyChange(val);
                  setMemberData((prev: any) => ({ ...prev, major_id: "" }));
                }}
              >
                <SelectTrigger className="h-8 text-[13px]">
                  <SelectValue placeholder="Pilih Fakultas" />
                </SelectTrigger>
                <SelectContent>
                  {faculties.map((faculty) => (
                    <SelectItem key={faculty} value={faculty}>
                      {faculty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Program Studi</label>
              <Select
                value={memberData.major_id || undefined}
                onValueChange={(val) => setMemberData((prev: any) => ({ ...prev, major_id: val }))}
                disabled={!selectedFaculty}
              >
                <SelectTrigger className="h-8 text-[13px]">
                  <SelectValue placeholder="Pilih Program Studi" />
                </SelectTrigger>
                <SelectContent>
                  {availableMajors.map((m) => (
                    <SelectItem key={m.id} value={m.id.toString()}>
                      {m.degree ? `${m.degree} - ` : ""}
                      {m.name_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {memberErrors.major_id && (
                <span className="text-xs text-destructive">{memberErrors.major_id}</span>
              )}
            </div>
          </div>

          {/* Tipe Anggota */}
          {!(hasRole("User") && userBatch?.status === "Deactive") && (
            <div>
              <label className="block text-sm font-medium mb-1">Tipe Anggota</label>
              <Select
                value={memberData.type || undefined}
                disabled={hasRole("User")}
                onValueChange={(val: any) => {
                  const newType = val as "Pengurus" | "Demisioner";
                  setMemberData((data: any) => {
                    const newBatches = batches.filter((b) =>
                      newType === "Demisioner" ? b.status === "Deactive" : b.status === "Active",
                    );
                    const isBatchValid = newBatches.some((b) => b.id.toString() === data.batch_id);

                    return {
                      ...data,
                      type: newType,
                      status: newType === "Demisioner" ? "Deactive" : "",
                      position_id: newType === "Demisioner" ? "" : data.position_id,
                      batch_id: isBatchValid ? data.batch_id : "",
                    };
                  });
                }}
              >
                <SelectTrigger className="h-8 text-[13px]">
                  <SelectValue placeholder="Pilih Tipe Anggota" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pengurus">Kepengurusan</SelectItem>
                  <SelectItem value="Demisioner">Demisioner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Angkatan */}
          <div>
            <label className="block text-sm font-medium mb-1">Angkatan</label>
            <Select
              value={memberData.batch_id || undefined}
              onValueChange={(val) => setMemberData((prev: any) => ({ ...prev, batch_id: val }))}
              disabled={activeMemberTab === "MyBatch"}
            >
              <SelectTrigger className="h-8 text-[13px]">
                <SelectValue placeholder="Pilih Angkatan" />
              </SelectTrigger>
              <SelectContent>
                {batches
                  .filter((b) =>
                    memberData.type === "Demisioner"
                      ? b.status === "Deactive"
                      : b.status === "Active",
                  )
                  .map((b) => (
                    <SelectItem key={b.id} value={b.id.toString()}>
                      {b.year} - {b.name_id}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {memberErrors.batch_id && (
              <span className="text-xs text-destructive">{memberErrors.batch_id}</span>
            )}
          </div>

          {/* Status & Jabatan & Periode */}
          {isDemisionerForm ? (
            isDeactiveBatch && (
              <div className="p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground">
                Angkatan ini berstatus Deactive, tipe anggota dikunci sebagai{" "}
                <b>Demisioner / Alumni</b>.
              </div>
            )
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status Organisasi</label>
                  <Select
                    value={orgStatusValue || undefined}
                    onValueChange={(val) => {
                      if (val === "Kepengurusan") {
                        setMemberData((data: any) => ({
                          ...data,
                          status: "Active",
                          position_id:
                            data.position_id === "Anggota Biasa" ||
                            data.position_id === "Anggota Baru"
                              ? ""
                              : data.position_id,
                        }));
                      } else if (val === "Anggota Biasa") {
                        setMemberData((data: any) => ({
                          ...data,
                          status: "Deactive",
                          position_id: "Anggota Biasa",
                        }));
                      } else if (val === "Anggota Baru") {
                        setMemberData((data: any) => ({
                          ...data,
                          status: "Deactive",
                          position_id: "Anggota Baru",
                        }));
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 text-[13px]">
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kepengurusan">Kepengurusan</SelectItem>
                      <SelectItem value="Anggota Biasa">Anggota Biasa</SelectItem>
                      <SelectItem value="Anggota Baru">Anggota Baru</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Periode Kepengurusan</label>
                  <Input
                    className="h-8 text-[13px]"
                    placeholder="Contoh: 2025 - 2026"
                    value={memberData.periode || ""}
                    onChange={(e) =>
                      setMemberData((prev: any) => ({ ...prev, periode: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
            </>
          )}

          {memberData.status === "Active" && (
            <div>
              <label className="block text-sm font-medium mb-1">Jabatan</label>
              <Input
                className="h-8 text-[13px]"
                placeholder="Contoh: Ketua Umum"
                value={memberData.position_id || ""}
                onChange={(e) =>
                  setMemberData((prev: any) => ({ ...prev, position_id: e.target.value }))
                }
                required
              />
            </div>
          )}

          {/* Kontak Sosmed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">No WhatsApp (Opsional)</label>
              <Input
                className="h-8 text-[13px]"
                placeholder="Cth: 08123456789"
                value={memberData.whatsapp || ""}
                onChange={(e) =>
                  setMemberData((prev: any) => ({ ...prev, whatsapp: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Username IG (Opsional)</label>
              <Input
                className="h-8 text-[13px]"
                placeholder="Cth: lisesasmarandana"
                value={memberData.instagram || ""}
                onChange={(e) =>
                  setMemberData((prev: any) => ({ ...prev, instagram: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Foto Profile */}
          <div>
            <label className="block text-sm font-medium mb-1">Foto Profile (Opsional)</label>
            <Input
              type="file"
              accept="image/*"
              className="bg-background text-sm file:text-foreground file:bg-muted file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-2"
              onChange={(e) =>
                setMemberData((prev: any) => ({
                  ...prev,
                  image: e.target.files ? e.target.files[0] : null,
                }))
              }
            />
            {memberErrors.image && (
              <span className="text-xs text-destructive">{memberErrors.image}</span>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2 mb-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-3.5 rounded-lg text-[13px] font-medium"
              onClick={onCancel}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 px-3.5 rounded-lg text-[13px] font-medium"
              disabled={processingMember}
            >
              {processingMember ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5" /> {editingMember ? "Simpan Perubahan" : "Simpan"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
