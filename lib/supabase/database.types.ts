/**
 * Target Supabase schema for CRM persistence.
 * Replace with `supabase gen types` once the project is provisioned.
 */

export type Database = {
  public: {
    Tables: {
      entreprises: {
        Row: EntrepriseRow;
        Insert: EntrepriseInsert;
        Update: EntrepriseUpdate;
        Relationships: [];
      };
      contacts: {
        Row: ContactRow;
        Insert: ContactInsert;
        Update: ContactUpdate;
        Relationships: [
          {
            foreignKeyName: "contacts_entreprise_id_fkey";
            columns: ["entreprise_id"];
            isOneToOne: false;
            referencedRelation: "entreprises";
            referencedColumns: ["id"];
          },
        ];
      };
      templates: {
        Row: TemplateRow;
        Insert: TemplateInsert;
        Update: TemplateUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      contact_status:
        | "À contacter"
        | "Contacté"
        | "Relance 1"
        | "Relance 2"
        | "En discussion"
        | "Call prévu"
        | "Refus"
        | "Terminé";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type EntrepriseRow = {
  id: string;
  name: string;
  linkedin_url: string | null;
  website_url: string | null;
  wttj_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type EntrepriseInsert = {
  id?: string;
  name: string;
  linkedin_url?: string | null;
  website_url?: string | null;
  wttj_url?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type EntrepriseUpdate = Partial<EntrepriseInsert>;

export type ContactRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  linkedin_url: string | null;
  status: Database["public"]["Enums"]["contact_status"];
  entreprise_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactInsert = {
  id?: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  linkedin_url?: string | null;
  status?: Database["public"]["Enums"]["contact_status"];
  entreprise_id?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ContactUpdate = Partial<ContactInsert>;

export type TemplateRow = {
  id: string;
  title: string;
  body: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type TemplateInsert = {
  id?: string;
  title: string;
  body: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type TemplateUpdate = Partial<TemplateInsert>;
