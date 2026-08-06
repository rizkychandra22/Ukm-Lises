import { useState, useMemo } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { route } from "../Lib/Route";
import DashboardLayout from "../Layouts/AppLayout";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BatchMember, Batch, MemberPageProps } from "./Feature/Member/Types";
import { MemberTable } from "./Feature/Member/Components/MemberTable";
import { MemberFormModal } from "./Feature/Member/Components/MemberFormModal";
import { MemberDetailSheet } from "./Feature/Member/Components/MemberDetailSheet";
import { MemberDeleteDialog } from "./Feature/Member/Components/MemberDeleteDialog";
import { BatchTable } from "./Feature/Member/Components/BatchTable";
import { BatchFormModal } from "./Feature/Member/Components/BatchFormModal";
import { BatchDeleteDialog } from "./Feature/Member/Components/BatchDeleteDialog";

export default function IndexMember({ members = [], batches = [], majors = [] }: MemberPageProps) {
  const { auth } = usePage<any>().props;
  const user = auth.user;

  const hasRole = (roleNames: string | string[]) => {
    if (!user?.roles) return false;
    if (Array.isArray(roleNames)) {
      return roleNames.some((role: string) => user.roles?.includes(role));
    }
    return user.roles.includes(roleNames);
  };

  const userBatch = useMemo(() => batches.find((b) => b.user_id === user?.id), [batches, user]);

  // --- States ---
  const [viewingMember, setViewingMember] = useState<BatchMember | null>(null);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<string>("");

  const [activeTab, setActiveTab] = useState("anggota");
  const [activeMemberTab, setActiveMemberTab] = useState(
    hasRole("User") ? "MyBatch" : "Administration",
  );
  const [memberStatusFilter, setMemberStatusFilter] = useState("all");
  const [demisionerBatchFilter, setDemisionerBatchFilter] = useState("all");

  // --- Modal & Delete States Anggota ---
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<BatchMember | null>(null);
  const [isDeleteMemberDialogOpen, setIsDeleteMemberDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);

  // --- Derived Faculties & Majors ---
  const faculties = useMemo(() => {
    const unique = new Map<string, string>();
    majors.forEach((m) => {
      if (!unique.has(m.faculty_id)) {
        unique.set(m.faculty_id, m.faculty_id);
      }
    });
    return Array.from(unique.values());
  }, [majors]);

  const availableMajors = useMemo(() => {
    return majors.filter((m) => m.faculty_id === selectedFaculty);
  }, [majors, selectedFaculty]);

  // --- Form Anggota ---
  const {
    data: memberData,
    setData: setMemberData,
    post: postMember,
    delete: deleteMemberReq,
    reset: resetMember,
    processing: processingMember,
    errors: memberErrors,
  } = useForm({
    batch_id: "",
    image: null as File | null,
    name: "",
    major_id: "",
    type: "Pengurus" as "Demisioner" | "Pengurus",
    status: "Active" as "Active" | "Deactive",
    periode: "",
    position_id: "",
    whatsapp: "",
    instagram: "",
    _method: "post",
  });

  const handleAddMember = () => {
    setEditingMember(null);
    resetMember();
    setSelectedFaculty("");
    const defaultBatchId = userBatch ? userBatch.id.toString() : "";
    const targetBatch = batches.find((b) => b.id.toString() === defaultBatchId);
    const isDeactiveBatch = targetBatch?.status === "Deactive";

    const initialBatchId =
      activeMemberTab === "Demisioner" && !isDeactiveBatch ? "" : defaultBatchId;

    setMemberData((data) => ({
      ...data,
      batch_id: initialBatchId,
      type: isDeactiveBatch || activeMemberTab === "Demisioner" ? "Demisioner" : "Pengurus",
      status: isDeactiveBatch || activeMemberTab === "Demisioner" ? "Deactive" : ("" as any),
      periode: "",
      position_id: "",
      whatsapp: "",
      instagram: "",
      _method: "post",
    }));
    setIsMemberModalOpen(true);
  };

  const handleEditMember = (member: BatchMember) => {
    setEditingMember(member);
    const foundMajor = majors.find((m) => m.id === Number(member.major_id));
    setSelectedFaculty(foundMajor ? foundMajor.faculty_id : "");

    setMemberData({
      batch_id: member.batch_id.toString(),
      image: null,
      name: member.name,
      major_id: member.major_id.toString(),
      type: member.type,
      status: member.status,
      periode: member.periode || "",
      position_id: member.position_id || "",
      whatsapp: member.whatsapp || "",
      instagram: member.instagram || "",
      _method: "put",
    });
    setIsMemberModalOpen(true);
  };

  const handleCancelEditMember = () => {
    setEditingMember(null);
    resetMember();
    setIsMemberModalOpen(false);
  };

  const handleSubmitMember = (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingMember
      ? route("list-member.members.update", editingMember.id)
      : route("list-member.members.store");

    postMember(endpoint, {
      onSuccess: () => {
        handleCancelEditMember();
        toast.success(`Berhasil ${editingMember ? "memperbarui" : "menambahkan"} data anggota.`);
      },
    });
  };

  const handleDeleteMember = (id: number) => {
    setMemberToDelete(id);
    setIsDeleteMemberDialogOpen(true);
  };

  const confirmDeleteMember = () => {
    if (memberToDelete) {
      deleteMemberReq(route("list-member.members.destroy", memberToDelete), {
        onSuccess: () => {
          setIsDeleteMemberDialogOpen(false);
          setMemberToDelete(null);
          toast.success("Berhasil menghapus data anggota.");
        },
      });
    }
  };

  // --- Modal & Delete States Angkatan (Batch) ---
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [isDeleteBatchDialogOpen, setIsDeleteBatchDialogOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<number | null>(null);

  const {
    data: batchData,
    setData: setBatchData,
    post: postBatch,
    put: putBatch,
    delete: deleteBatchReq,
    reset: resetBatch,
    processing: processingBatch,
  } = useForm({
    year: "",
    name_id: "",
    status: "Active" as "Active" | "Deactive",
    username: "",
    password: "",
  });

  const handleAddBatch = () => {
    setEditingBatch(null);
    resetBatch();
    setIsBatchModalOpen(true);
  };

  const handleEditBatch = (batch: Batch) => {
    setEditingBatch(batch);
    setBatchData({
      year: batch.year,
      name_id: batch.name_id,
      status: batch.status || "Active",
      username: "",
      password: "",
    });
    setIsBatchModalOpen(true);
  };

  const handleCancelEditBatch = () => {
    setEditingBatch(null);
    resetBatch();
    setIsBatchModalOpen(false);
  };

  const handleSubmitBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBatch) {
      putBatch(route("list-member.batches.update", editingBatch.id), {
        onSuccess: () => {
          handleCancelEditBatch();
          toast.success("Berhasil memperbarui data angkatan.");
        },
      });
    } else {
      postBatch(route("list-member.batches.store"), {
        onSuccess: () => {
          handleCancelEditBatch();
          toast.success("Berhasil menambahkan data angkatan.");
        },
      });
    }
  };

  const handleDeleteBatch = (id: number) => {
    setBatchToDelete(id);
    setIsDeleteBatchDialogOpen(true);
  };

  const confirmDeleteBatch = () => {
    if (batchToDelete) {
      deleteBatchReq(route("list-member.batches.destroy", batchToDelete), {
        onSuccess: () => {
          setIsDeleteBatchDialogOpen(false);
          setBatchToDelete(null);
          toast.success("Berhasil menghapus data angkatan.");
        },
      });
    }
  };

  return (
    <DashboardLayout>
      <Head title="Kelola Anggota & Angkatan" />

      <div className="flex flex-col gap-4 max-w-7xl mx-auto pb-12 relative">
        {/* Header Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground font-display tracking-tight">
            Manajemen Keanggotaan
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola data anggota dan data angkatan
          </p>
        </div>

        {/* Tabs Row (Shadcn Underline Style) */}
        <div className="w-full border-b border-border">
          <div className="flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center">
            {!hasRole(["User"]) ? (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="flex h-auto p-0 bg-transparent gap-4 justify-start rounded-none border-none">
                  <TabsTrigger
                    value="anggota"
                    className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
                  >
                    Anggota
                  </TabsTrigger>
                  <TabsTrigger
                    value="angkatan"
                    className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
                  >
                    Angkatan
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            ) : (
              userBatch && (
                <Tabs
                  value={activeMemberTab}
                  onValueChange={setActiveMemberTab}
                  className="w-full sm:w-auto relative"
                >
                  <TabsList className="grid grid-cols-3 w-full sm:flex sm:w-auto h-auto p-0 bg-transparent sm:gap-6 justify-start rounded-none border-none">
                    <TabsTrigger
                      value="MyBatch"
                      className="w-full sm:w-auto text-center sm:text-left rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
                    >
                      Angkatan {userBatch.year}
                    </TabsTrigger>
                    <TabsTrigger
                      value="Demisioner"
                      className="w-full sm:w-auto text-center sm:text-left rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
                    >
                      Demisioner
                    </TabsTrigger>
                    <TabsTrigger
                      value="Administration"
                      className="w-full sm:w-auto text-center sm:text-left rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
                    >
                      Kepengurusan
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )
            )}
          </div>
        </div>

        {/* Tab Contents */}
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="anggota" className="mt-0">
            <MemberTable
              members={members}
              batches={batches}
              activeMemberTab={activeMemberTab}
              memberStatusFilter={memberStatusFilter}
              demisionerBatchFilter={demisionerBatchFilter}
              userBatch={userBatch}
              hasRole={hasRole}
              onActiveMemberTabChange={setActiveMemberTab}
              onMemberStatusFilterChange={setMemberStatusFilter}
              onDemisionerBatchFilterChange={setDemisionerBatchFilter}
              onView={(member) => {
                setViewingMember(member);
                setIsViewSheetOpen(true);
              }}
              onEdit={handleEditMember}
              onDelete={handleDeleteMember}
              onAdd={handleAddMember}
            />
          </TabsContent>

          <TabsContent value="angkatan" className="mt-0">
            <BatchTable
              batches={batches}
              onEdit={handleEditBatch}
              onDelete={handleDeleteBatch}
              onAdd={handleAddBatch}
              hasRole={hasRole}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* --- Modals & Sheets --- */}
      <MemberFormModal
        isOpen={isMemberModalOpen}
        editingMember={editingMember}
        batches={batches}
        majors={majors}
        faculties={faculties}
        availableMajors={availableMajors}
        selectedFaculty={selectedFaculty}
        activeMemberTab={activeMemberTab}
        userBatch={userBatch}
        hasRole={hasRole}
        memberData={memberData}
        memberErrors={memberErrors}
        processingMember={processingMember}
        setMemberData={setMemberData}
        onFacultyChange={setSelectedFaculty}
        onSubmit={handleSubmitMember}
        onCancel={handleCancelEditMember}
      />

      <MemberDetailSheet
        isOpen={isViewSheetOpen}
        member={viewingMember}
        onClose={() => {
          setIsViewSheetOpen(false);
          setViewingMember(null);
        }}
      />

      <MemberDeleteDialog
        isOpen={isDeleteMemberDialogOpen}
        onOpenChange={setIsDeleteMemberDialogOpen}
        onConfirm={confirmDeleteMember}
      />

      <BatchFormModal
        isOpen={isBatchModalOpen}
        editingBatch={editingBatch}
        batchData={batchData}
        processingBatch={processingBatch}
        setBatchData={(key, val) => setBatchData(key as any, val)}
        onSubmit={handleSubmitBatch}
        onCancel={handleCancelEditBatch}
      />

      <BatchDeleteDialog
        isOpen={isBatchModalOpen ? false : isDeleteBatchDialogOpen}
        onOpenChange={setIsDeleteBatchDialogOpen}
        onConfirm={confirmDeleteBatch}
      />
    </DashboardLayout>
  );
}
