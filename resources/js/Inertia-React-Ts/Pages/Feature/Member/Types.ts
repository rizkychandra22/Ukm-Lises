export type Batch = {
  id: number;
  user_id?: number;
  year: string;
  name_id: string;
  name_en: string;
  status: "Active" | "Deactive";
};

export type Major = {
  id: number;
  faculty_id: string;
  faculty_en: string;
  name_id: string;
  name_en: string;
  degree: string | null;
};

export type BatchMember = {
  id: number;
  batch_id: number;
  image: string | null;
  name: string;
  major_id: string | number;
  type: "Demisioner" | "Pengurus";
  status: "Active" | "Deactive";
  periode: string | null;
  position_id: string | null;
  position_en: string | null;
  instagram: string | null;
  whatsapp: string | null;
  batch?: Batch;
  major?: Major;
};

export type MemberPageProps = {
  members: BatchMember[];
  batches: Batch[];
  majors: Major[];
};
