export type EventItem = {
  id: number;
  title_id: string;
  title_en?: string;
  image?: string | null;
  summary_id?: string | null;
  summary_en?: string | null;
  type: "Exclusive" | "Non-Exclusive";
  date: string;
  location_id: string;
  location_en?: string;
  price?: number | null;
  ticket?: number | null;
  sold_tickets?: number;
  remaining_tickets?: number | null;
  status: "draft" | "published" | "cancelled" | "completed";
};

export type PayAccount = {
  id: number;
  batch_member_id: number;
  type: "bank" | "e-wallet";
  name_account: string;
  no_account: string;
  batch_member?: BatchMemberSelect;
};

export type PayOrder = {
  id: number;
  order_code: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  event_id: number;
  qty: number;
  total_price: number;
  notes?: string | null;
  pay_account_id?: number | null;
  payment_proof?: string | null;
  order_method: "online" | "offline";
  status: "pending" | "success" | "cancelled";
  event?: EventItem;
  pay_account?: PayAccount;
};

export type BatchMemberSelect = {
  id: number;
  name: string;
};
