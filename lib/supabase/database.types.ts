/**
 * Target Supabase schema for CRM persistence.
 * Replace with `supabase gen types` once the project is provisioned.
 */

import type {
  ContactInsert,
  ContactRow,
  ContactUpdate,
  EntrepriseInsert,
  EntrepriseRow,
  EntrepriseUpdate,
  InteractionInsert,
  InteractionRow,
  InteractionUpdate,
  TemplateInsert,
  TemplateRow,
  TemplateUpdate,
} from "@/lib/supabase/database.rows";

export type { Json } from "@/lib/supabase/database.rows";

export type {
  ContactInsert,
  ContactRow,
  ContactUpdate,
  EntrepriseInsert,
  EntrepriseRow,
  EntrepriseUpdate,
  InteractionInsert,
  InteractionRow,
  InteractionUpdate,
  TemplateInsert,
  TemplateRow,
  TemplateUpdate,
} from "@/lib/supabase/database.rows";

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
      interactions: {
        Row: InteractionRow;
        Insert: InteractionInsert;
        Update: InteractionUpdate;
        Relationships: [
          {
            foreignKeyName: "interactions_contact_id_fkey";
            columns: ["contact_id"];
            isOneToOne: false;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "interactions_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "templates";
            referencedColumns: ["id"];
          },
        ];
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
