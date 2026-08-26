-- == SCHEMA ==
create extension if not exists pg_trgm;
create extension if not exists pgcrypto;


-- ─── 0. Reset ───────────────────────────────────────────────────────────────

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

drop table if exists public.interactions cascade;
drop table if exists public.contacts cascade;
drop table if exists public.templates cascade;
drop table if exists public.entreprises cascade;

drop type if exists public.contact_status cascade;


-- ─── 1. Enum pipeline ───────────────────────────────────────────────────────

create type public.contact_status as enum (
  'À contacter',
  'Contacté',
  'Relance 1',
  'Relance 2',
  'En discussion',
  'Call prévu',
  'Refus',
  'Terminé'
);


-- ─── 2. Tables ──────────────────────────────────────────────────────────────

create table public.entreprises (
  id                uuid        primary key default gen_random_uuid(),
  name              text        not null,
  linkedin_url      text,
  website_url       text,
  wttj_url          text,
  location          text,
  target_offer_url  text,
  notes             text,
  raw_data          jsonb,
  scraped_at        timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  constraint entreprises_name_not_blank
    check (btrim(name) <> ''),
  constraint entreprises_linkedin_url_http_check
    check (linkedin_url is null or linkedin_url ~* '^https?://'),
  constraint entreprises_website_url_http_check
    check (website_url is null or website_url ~* '^https?://'),
  constraint entreprises_wttj_url_http_check
    check (wttj_url is null or wttj_url ~* '^https?://'),
  constraint entreprises_target_offer_url_http_check
    check (target_offer_url is null or target_offer_url ~* '^https?://'),
  constraint entreprises_updated_after_created_check
    check (updated_at >= created_at)
);

create table public.contacts (
  id                    uuid                  primary key default gen_random_uuid(),
  first_name            text                  not null,
  last_name             text                  not null,
  email                 text,
  linkedin_url          text,
  phone                 text,
  whatsapp              text,
  job_title             text,
  headline              text,
  status                public.contact_status not null default 'À contacter',
  entreprise_id         uuid,
  notes                 text,
  last_message_sent_at  date,
  raw_data              jsonb,
  scraped_at            timestamptz,
  created_at            timestamptz           not null default now(),
  updated_at            timestamptz           not null default now(),

  constraint contacts_entreprise_id_fkey
    foreign key (entreprise_id)
    references public.entreprises (id)
    on update cascade
    on delete set null,

  constraint contacts_first_name_not_blank check (btrim(first_name) <> ''),
  constraint contacts_last_name_not_blank  check (btrim(last_name)  <> ''),
  constraint contacts_email_format_check
    check (
      email is null
      or email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    ),
  constraint contacts_linkedin_url_http_check
    check (linkedin_url is null or linkedin_url ~* '^https?://'),
  constraint contacts_updated_after_created_check
    check (updated_at >= created_at)
);

create table public.templates (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  body        text        not null,
  description text,
  channel     text        not null default 'linkedin',
  subject     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint templates_title_not_blank check (btrim(title) <> ''),
  constraint templates_body_not_blank  check (btrim(body)  <> ''),
  constraint templates_channel_not_blank check (btrim(channel) <> ''),
  constraint templates_updated_after_created_check
    check (updated_at >= created_at)
);

create table public.interactions (
  id                 uuid        primary key default gen_random_uuid(),
  contact_id         uuid        not null
                     references public.contacts (id) on delete cascade,
  template_id        uuid
                     references public.templates (id) on delete set null,
  channel            text        not null,
  message_sent       text        not null,
  sent_at            timestamptz not null default now(),
  response_received  boolean     not null default false,

  constraint interactions_channel_not_blank
    check (btrim(channel) <> ''),
  constraint interactions_message_sent_not_blank
    check (btrim(message_sent) <> '')
);


-- ─── 3. Index ───────────────────────────────────────────────────────────────

create unique index entreprises_name_unique_idx
  on public.entreprises (lower(btrim(name)));

create index contacts_last_name_idx     on public.contacts (last_name);
create index contacts_first_name_idx    on public.contacts (first_name);
create index contacts_status_idx        on public.contacts (status);
create index contacts_created_at_idx    on public.contacts (created_at desc);
create index contacts_updated_at_idx    on public.contacts (updated_at desc);
create index contacts_entreprise_id_idx on public.contacts (entreprise_id);
create index contacts_entreprise_status_idx
  on public.contacts (entreprise_id, status);
create index contacts_scraped_at_idx    on public.contacts (scraped_at desc);

create index entreprises_name_idx       on public.entreprises (name);
create index entreprises_created_at_idx on public.entreprises (created_at desc);
create index entreprises_updated_at_idx on public.entreprises (updated_at desc);
create index entreprises_scraped_at_idx on public.entreprises (scraped_at desc);

create index templates_title_idx   on public.templates (title);
create index templates_channel_idx on public.templates (channel);

create index interactions_contact_id_idx  on public.interactions (contact_id);
create index interactions_template_id_idx on public.interactions (template_id);
create index interactions_sent_at_idx     on public.interactions (sent_at desc);

create index contacts_first_name_trgm_idx
  on public.contacts using gin (first_name gin_trgm_ops);
create index contacts_last_name_trgm_idx
  on public.contacts using gin (last_name gin_trgm_ops);
create index contacts_email_trgm_idx
  on public.contacts using gin (email gin_trgm_ops);
create index contacts_job_title_trgm_idx
  on public.contacts using gin (job_title gin_trgm_ops);
create index contacts_headline_trgm_idx
  on public.contacts using gin (headline gin_trgm_ops);
create index entreprises_name_trgm_idx
  on public.entreprises using gin (name gin_trgm_ops);
create index entreprises_location_trgm_idx
  on public.entreprises using gin (location gin_trgm_ops);
create index templates_title_trgm_idx
  on public.templates using gin (title gin_trgm_ops);
create index templates_description_trgm_idx
  on public.templates using gin (description gin_trgm_ops);
create index templates_body_trgm_idx
  on public.templates using gin (body gin_trgm_ops);

create index contacts_raw_data_gin_idx
  on public.contacts using gin (raw_data);
create index entreprises_raw_data_gin_idx
  on public.entreprises using gin (raw_data);


-- ─── 4. RLS — single-user, rôle anon ────────────────────────────────────────

alter table public.entreprises  enable row level security;
alter table public.contacts     enable row level security;
alter table public.templates    enable row level security;
alter table public.interactions enable row level security;

create policy entreprises_anon_all on public.entreprises
  for all to anon using (true) with check (true);
create policy contacts_anon_all on public.contacts
  for all to anon using (true) with check (true);
create policy templates_anon_all on public.templates
  for all to anon using (true) with check (true);
create policy interactions_anon_all on public.interactions
  for all to anon using (true) with check (true);


-- ─── 5. Privilèges ──────────────────────────────────────────────────────────

grant usage on schema public to anon;
grant select, insert, update, delete
  on public.entreprises, public.contacts, public.templates, public.interactions
  to anon;


-- ─── 6. Seed templates (mocks applicatifs) ──────────────────────────────────

insert into public.templates (id, title, body, description, channel, subject, created_at, updated_at)
values
  (
    'c0000000-0000-4000-8000-000000000001',
    'Icebreaker LinkedIn — offre vue',
    $body$Bonjour {{nom_contact}},

J'ai vu le poste {{poste}} chez {{nom_entreprise}} ({{ville}}) et votre parcours m'a interpellé.

Seriez-vous ouvert·e à un échange de 15 minutes cette semaine ?

Cordialement$body$,
    'Premier message après une offre WTTJ.',
    'linkedin',
    null,
    '2026-01-10T10:00:00.000Z',
    '2026-01-10T10:00:00.000Z'
  ),
  (
    'c0000000-0000-4000-8000-000000000002',
    'Icebreaker — intérêt produit',
    $body$Bonjour {{nom_contact}},

Je suis impressionné par ce que construit {{nom_entreprise}}. J'aimerais échanger sur vos enjeux produit / tech.

Seriez-vous disponible pour un café virtuel ?

Merci,$body$,
    'Approche sans offre précise.',
    'linkedin',
    null,
    '2026-01-12T11:00:00.000Z',
    '2026-01-12T11:00:00.000Z'
  ),
  (
    'c0000000-0000-4000-8000-000000000003',
    'Relance douce',
    $body$Bonjour {{nom_contact}},

Je me permets de revenir vers vous concernant {{nom_entreprise}}.

Toujours intéressé·e par un échange court autour de {{poste}}.

Bonne journée,$body$,
    'Relance 1 après silence.',
    'linkedin',
    null,
    '2026-01-15T09:00:00.000Z',
    '2026-01-15T09:00:00.000Z'
  ),
  (
    'c0000000-0000-4000-8000-000000000004',
    'Relance avec valeur',
    $body$Bonjour {{nom_contact}},

En préparant mon approche sur {{nom_entreprise}}, j'ai noté quelques pistes liées à {{poste}}.

Si utile, je peux vous les partager en 10 minutes.

À bientôt,$body$,
    'Relance 2 avec un angle concret.',
    'linkedin',
    null,
    '2026-01-18T14:00:00.000Z',
    '2026-01-18T14:00:00.000Z'
  ),
  (
    'c0000000-0000-4000-8000-000000000005',
    'Demande d''intro',
    $body$Bonjour {{nom_contact}},

Je cible {{nom_entreprise}} pour un rôle {{poste}} à {{ville}}.

Connaissez-vous quelqu'un de l'équipe que je pourrais contacter ?

Merci beaucoup,$body$,
    'Demande de mise en relation.',
    'linkedin',
    null,
    '2026-01-20T16:00:00.000Z',
    '2026-01-20T16:00:00.000Z'
  ),
  (
    'c0000000-0000-4000-8000-000000000006',
    'Confirmation call',
    $body$Bonjour {{nom_contact}},

Confirmant notre échange au sujet de {{poste}} chez {{nom_entreprise}}.

J'ai hâte d'en discuter.

À tout bientôt,$body$,
    'Message avant un call prévu.',
    'linkedin',
    null,
    '2026-01-22T08:30:00.000Z',
    '2026-01-22T08:30:00.000Z'
  )
on conflict (id) do nothing;


-- ─── 7. Catalogue ───────────────────────────────────────────────────────────

comment on type public.contact_status is
  'Pipeline de prospection — source TS : lib/domain/contact-status.ts';
comment on table public.entreprises is
  'Cibles commerciales ; id UUID ; raw_data = payload Bright Data';
comment on table public.contacts is
  'Personnes ; raw_data / scraped_at pour scrape profil';
comment on table public.templates is
  'Modèles de message ; channel = linkedin|email|… ; subject pour e-mail';
comment on table public.interactions is
  'Historique d''envois de prospection';
comment on column public.entreprises.raw_data is
  'Payload JSON brut Bright Data / IA';
comment on column public.contacts.raw_data is
  'Payload JSON brut Bright Data / IA';
comment on column public.contacts.phone is
  'Téléphone libre (saisie manuelle)';
comment on column public.contacts.whatsapp is
  'WhatsApp (ex. +33…), saisie manuelle';
comment on column public.contacts.last_message_sent_at is
  'Date du dernier message envoyé (suivi CRM manuel)';
