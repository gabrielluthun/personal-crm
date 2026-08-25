export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type EntrepriseRow = {
  id: string;
  name: string;
  linkedin_url: string | null;
  website_url: string | null;
  wttj_url: string | null;
  location: string | null;
  target_offer_url: string | null;
  notes: string | null;
  raw_data: Json | null;
  scraped_at: string | null;
  created_at: string;
  updated_at: string;
};

export type EntrepriseInsert = {
  id?: string;
  name: string;
  linkedin_url?: string | null;
  website_url?: string | null;
  wttj_url?: string | null;
  location?: string | null;
  target_offer_url?: string | null;
  notes?: string | null;
  raw_data?: Json | null;
  scraped_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type EntrepriseUpdate = Partial<EntrepriseInsert>;

export type ContactStatusEnum =
  | "À contacter"
  | "Contacté"
  | "Relance 1"
  | "Relance 2"
  | "En discussion"
  | "Call prévu"
  | "Refus"
  | "Terminé";

export type ContactRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  linkedin_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  job_title: string | null;
  headline: string | null;
  status: ContactStatusEnum;
  entreprise_id: string | null;
  notes: string | null;
  last_message_sent_at: string | null;
  raw_data: Json | null;
  scraped_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactInsert = {
  id?: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  linkedin_url?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  job_title?: string | null;
  headline?: string | null;
  status?: ContactStatusEnum;
  entreprise_id?: string | null;
  notes?: string | null;
  last_message_sent_at?: string | null;
  raw_data?: Json | null;
  scraped_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ContactUpdate = Partial<ContactInsert>;

export type TemplateRow = {
  id: string;
  title: string;
  body: string;
  description: string | null;
  channel: string;
  subject: string | null;
  created_at: string;
  updated_at: string;
};

export type TemplateInsert = {
  id?: string;
  title: string;
  body: string;
  description?: string | null;
  channel?: string;
  subject?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type TemplateUpdate = Partial<TemplateInsert>;

export type InteractionRow = {
  id: string;
  contact_id: string;
  template_id: string | null;
  channel: string;
  message_sent: string;
  sent_at: string;
  response_received: boolean;
};

export type InteractionInsert = {
  id?: string;
  contact_id: string;
  template_id?: string | null;
  channel: string;
  message_sent: string;
  sent_at?: string;
  response_received?: boolean;
};

export type InteractionUpdate = Partial<InteractionInsert>;
