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
import { PayAccount, BatchMemberSelect } from "../Types";

interface AccountFormModalProps {
  isOpen: boolean;
  editingAccount: PayAccount | null;
  members: BatchMemberSelect[];
  accountData: {
    batch_member_id: string;
    type: "bank" | "e-wallet";
    name_account: string;
    no_account: string;
  };
  accountErrors: Record<string, string>;
  processingAccount: boolean;
  setAccountData: (key: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function AccountFormModal({
  isOpen,
  editingAccount,
  members,
  accountData,
  accountErrors,
  processingAccount,
  setAccountData,
  onSubmit,
  onCancel,
}: AccountFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="w-[90%] max-w-[420px] rounded-md">
        <DialogHeader>
          <DialogTitle>
            {editingAccount ? "Edit Rekening Bank" : "Tambah Rekening Pembayaran"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Pemilik</label>
            <Select
              value={accountData.batch_member_id}
              onValueChange={(val) => setAccountData("batch_member_id", val)}
            >
              <SelectTrigger className="h-8 text-[13px]">
                <SelectValue placeholder="Pilih Anggota / Bendahara" />
              </SelectTrigger>
              <SelectContent>
                {members.map((mb) => (
                  <SelectItem key={mb.id} value={mb.id.toString()}>
                    {mb.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {accountErrors.batch_member_id && (
              <span className="text-xs text-destructive">{accountErrors.batch_member_id}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipe Rekening</label>
            <Select
              value={accountData.type}
              onValueChange={(val: any) => setAccountData("type", val)}
            >
              <SelectTrigger className="h-8 text-[13px]">
                <SelectValue placeholder="Pilih Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="e-wallet">E-Wallet (Dana/Ovo/Gopay)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nama Bank / E-Wallet</label>
            <Input
              className="h-8 text-[13px]"
              placeholder="Cth: Bank BCA / DANA"
              value={accountData.name_account}
              onChange={(e) => setAccountData("name_account", e.target.value)}
              required
            />
            {accountErrors.name_account && (
              <span className="text-xs text-destructive">{accountErrors.name_account}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nomor Rekening / No. HP</label>
            <Input
              className="h-8 text-[13px] font-mono"
              placeholder="Cth: 1234567890"
              value={accountData.no_account}
              onChange={(e) => setAccountData("no_account", e.target.value)}
              required
            />
            {accountErrors.no_account && (
              <span className="text-xs text-destructive">{accountErrors.no_account}</span>
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
              disabled={processingAccount}
            >
              {processingAccount ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5" />{" "}
                  {editingAccount ? "Simpan Perubahan" : "Simpan"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
