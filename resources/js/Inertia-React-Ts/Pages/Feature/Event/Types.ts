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
  sessions?: EventSession[];
};

export type EventSession = {
  id: number;
  event_id: number;
  name_id: string;
  name_en?: string;
  start_time: string;
  end_time: string;
  ticket_allocation: number;
  remaining_tickets?: number;
  created_at: string;
  updated_at: string;
  event?: EventItem;
  orders_sum_qty?: number;
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
  event_session_id?: number | null;
  qty: number;
  total_price: number;
  notes?: string | null;
  pay_account_id?: number | null;
  payment_proof?: string | null;
  order_method: "online" | "offline";
  status: "pending" | "success" | "cancelled";
  created_at: string;
  event?: EventItem;
  event_session?: EventSession;
  pay_account?: PayAccount;
};

export type BatchMemberSelect = {
  id: number;
  name: string;
};
