import apiClient from '../api-client';

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------
export type MemberType = 'Pengurus' | 'Demisioner';
export type MemberStatus = 'Active' | 'Deactive';

export interface Major {
  id: number;
  facultyId: string;
  facultyEn?: string;
  nameId: string;
  nameEn?: string;
  degree?: string;
}

export interface Batch {
  id: number;
  nameId: string;
  nameEn?: string;
  year: number;
  status?: 'Active' | 'Deactive';
}

export interface Member {
  id: number;
  batchId: number;
  majorId: number;
  name: string;
  image?: string;
  type: MemberType;
  status: MemberStatus;
  periode?: string;
  positionId?: string;
  positionEn?: string;
  batch?: Batch;
  major?: Major;
}

export interface QueryMemberParams {
  type?: MemberType | 'all';
  status?: MemberStatus | 'all';
  search?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

type RawRecord = Record<string, unknown>;

// ---------------------------------------------------------------------------
// NORMALIZERS & DEFENSIVE HELPERS
// ---------------------------------------------------------------------------
function toStringOrUndefined(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function normalizeMajor(raw: unknown): Major | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const item = raw as RawRecord;

  return {
    id: toNumber(item.id),
    facultyId: toStringOrUndefined(item.faculty_id) ?? toStringOrUndefined(item.facultyId) ?? '-',
    facultyEn: toStringOrUndefined(item.faculty_en) ?? toStringOrUndefined(item.facultyEn),
    nameId: toStringOrUndefined(item.name_id) ?? toStringOrUndefined(item.nameId) ?? '-',
    nameEn: toStringOrUndefined(item.name_en) ?? toStringOrUndefined(item.nameEn),
    degree: toStringOrUndefined(item.degree),
  };
}

function normalizeBatch(raw: unknown): Batch | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const item = raw as RawRecord;

  return {
    id: toNumber(item.id),
    nameId: toStringOrUndefined(item.name_id) ?? toStringOrUndefined(item.nameId) ?? '-',
    nameEn: toStringOrUndefined(item.name_en) ?? toStringOrUndefined(item.nameEn),
    year: toNumber(item.year),
    status: item.status === 'Deactive' ? 'Deactive' : 'Active',
  };
}

export function normalizeMember(raw: unknown): Member {
  const item = (raw ?? {}) as RawRecord;

  return {
    id: toNumber(item.id),
    batchId: toNumber(item.batch_id ?? item.batchId),
    majorId: toNumber(item.major_id ?? item.majorId),
    name: toStringOrUndefined(item.name) ?? 'Tanpa Nama',
    image: toStringOrUndefined(item.image) ?? toStringOrUndefined(item.image_url),
    type: item.type === 'Demisioner' ? 'Demisioner' : 'Pengurus',
    status: item.status === 'Deactive' ? 'Deactive' : 'Active',
    periode: toStringOrUndefined(item.periode),
    positionId: toStringOrUndefined(item.position_id) ?? toStringOrUndefined(item.positionId),
    positionEn: toStringOrUndefined(item.position_en) ?? toStringOrUndefined(item.positionEn),
    batch: normalizeBatch(item.batch),
    major: normalizeMajor(item.major),
  };
}

// ---------------------------------------------------------------------------
// API METHODS
// ---------------------------------------------------------------------------
export async function getMembers(params?: QueryMemberParams): Promise<Member[]> {
  const queryParams: Record<string, string> = {};

  if (params?.type && params.type !== 'all') {
    queryParams.type = params.type;
  }
  if (params?.status && params.status !== 'all') {
    queryParams.status = params.status;
  }

  const response = await apiClient.get<ApiResponse<unknown[]>>('/members', { params: queryParams });
  const rawData = response.data?.data;

  return Array.isArray(rawData) ? rawData.map(normalizeMember) : [];
}

/**
 * Helper khusus memisahkan Pengurus (Administration) dan Demisioner secara paralel
 */
export async function getCategorizedMembers(): Promise<{ administration: Member[]; demisioner: Member[] }> {
  const allMembers = await getMembers({ status: 'Active' });

  return {
    administration: allMembers.filter((m) => m.type === 'Pengurus'),
    demisioner: allMembers.filter((m) => m.type === 'Demisioner'),
  };
}