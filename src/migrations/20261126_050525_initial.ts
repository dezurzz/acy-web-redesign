import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_courses_formats" AS ENUM('in-person', 'live-online', 'self-paced');
  CREATE TYPE "public"."enum_courses_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__courses_v_version_formats" AS ENUM('in-person', 'live-online', 'self-paced');
  CREATE TYPE "public"."enum__courses_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_sessions_startdate_tz" AS ENUM('Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura');
  CREATE TYPE "public"."enum_sessions_enddate_tz" AS ENUM('Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura');
  CREATE TYPE "public"."enum_sessions_registrationdeadline_tz" AS ENUM('Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura');
  CREATE TYPE "public"."enum_sessions_format" AS ENUM('in-person', 'live-online', 'self-paced');
  CREATE TYPE "public"."enum_sessions_fee_policy" AS ENUM('fixed', 'contact');
  CREATE TYPE "public"."enum_sessions_currency" AS ENUM('IDR');
  CREATE TYPE "public"."enum_sessions_registration_status" AS ENUM('not-open', 'open', 'full', 'closed', 'postponed', 'cancelled', 'completed');
  CREATE TYPE "public"."enum_sessions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__sessions_v_version_startdate_tz" AS ENUM('Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura');
  CREATE TYPE "public"."enum__sessions_v_version_enddate_tz" AS ENUM('Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura');
  CREATE TYPE "public"."enum__sessions_v_version_registrationdeadline_tz" AS ENUM('Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura');
  CREATE TYPE "public"."enum__sessions_v_version_format" AS ENUM('in-person', 'live-online', 'self-paced');
  CREATE TYPE "public"."enum__sessions_v_version_fee_policy" AS ENUM('fixed', 'contact');
  CREATE TYPE "public"."enum__sessions_v_version_currency" AS ENUM('IDR');
  CREATE TYPE "public"."enum__sessions_v_version_registration_status" AS ENUM('not-open', 'open', 'full', 'closed', 'postponed', 'cancelled', 'completed');
  CREATE TYPE "public"."enum__sessions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_course_photos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__course_photos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_enquiries_type" AS ENUM('corporate');
  CREATE TYPE "public"."enum_enquiries_status" AS ENUM('baru', 'dihubungi', 'penawaran', 'selesai', 'batal');
  CREATE TYPE "public"."enum_enquiries_notification_status" AS ENUM('menunggu', 'terkirim', 'gagal');
  CREATE TYPE "public"."enum_enquiries_participants" AS ENUM('1-10', '11-25', '26-50', '50+');
  CREATE TYPE "public"."enum_enquiries_delivery_format" AS ENUM('lokasi-perusahaan', 'fasilitas-bki', 'live-online');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'publisher', 'editor', 'enquiry');
  CREATE TABLE "courses_audience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "courses_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "courses_formats" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_courses_formats",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "courses_syllabus" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"topics" varchar
  );
  
  CREATE TABLE "courses_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "courses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"acronym" varchar,
  	"category_id" integer,
  	"legacy_odoo_id" varchar,
  	"summary" varchar,
  	"duration" varchar,
  	"prerequisites" varchar,
  	"delivery_method" varchar,
  	"certificate_wording" varchar,
  	"image_id" integer,
  	"brochure_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_courses_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "courses_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "courses_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"courses_id" integer
  );
  
  CREATE TABLE "_courses_v_version_audience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_courses_v_version_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_courses_v_version_formats" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__courses_v_version_formats",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_courses_v_version_syllabus" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"topics" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_courses_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_courses_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_acronym" varchar,
  	"version_category_id" integer,
  	"version_legacy_odoo_id" varchar,
  	"version_summary" varchar,
  	"version_duration" varchar,
  	"version_prerequisites" varchar,
  	"version_delivery_method" varchar,
  	"version_certificate_wording" varchar,
  	"version_image_id" integer,
  	"version_brochure_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__courses_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_courses_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_courses_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"courses_id" integer
  );
  
  CREATE TABLE "sessions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"course_id" integer,
  	"code" varchar,
  	"batch_label" varchar,
  	"start_date" timestamp(3) with time zone,
  	"startdate_tz" "enum_sessions_startdate_tz" DEFAULT 'Asia/Jakarta',
  	"end_date" timestamp(3) with time zone,
  	"enddate_tz" "enum_sessions_enddate_tz" DEFAULT 'Asia/Jakarta',
  	"registration_deadline" timestamp(3) with time zone,
  	"registrationdeadline_tz" "enum_sessions_registrationdeadline_tz" DEFAULT 'Asia/Jakarta',
  	"format" "enum_sessions_format",
  	"venue" varchar,
  	"fee_policy" "enum_sessions_fee_policy" DEFAULT 'contact',
  	"fee" numeric,
  	"currency" "enum_sessions_currency" DEFAULT 'IDR',
  	"tax_wording" varchar,
  	"registration_status" "enum_sessions_registration_status" DEFAULT 'not-open',
  	"waitlist_enabled" boolean DEFAULT false,
  	"capacity" numeric,
  	"postponement_message" varchar,
  	"replacement_session_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_sessions_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_sessions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_course_id" integer,
  	"version_code" varchar,
  	"version_batch_label" varchar,
  	"version_start_date" timestamp(3) with time zone,
  	"version_startdate_tz" "enum__sessions_v_version_startdate_tz" DEFAULT 'Asia/Jakarta',
  	"version_end_date" timestamp(3) with time zone,
  	"version_enddate_tz" "enum__sessions_v_version_enddate_tz" DEFAULT 'Asia/Jakarta',
  	"version_registration_deadline" timestamp(3) with time zone,
  	"version_registrationdeadline_tz" "enum__sessions_v_version_registrationdeadline_tz" DEFAULT 'Asia/Jakarta',
  	"version_format" "enum__sessions_v_version_format",
  	"version_venue" varchar,
  	"version_fee_policy" "enum__sessions_v_version_fee_policy" DEFAULT 'contact',
  	"version_fee" numeric,
  	"version_currency" "enum__sessions_v_version_currency" DEFAULT 'IDR',
  	"version_tax_wording" varchar,
  	"version_registration_status" "enum__sessions_v_version_registration_status" DEFAULT 'not-open',
  	"version_waitlist_enabled" boolean DEFAULT false,
  	"version_capacity" numeric,
  	"version_postponement_message" varchar,
  	"version_replacement_session_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__sessions_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "course_photos_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "course_photos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"course_id" integer,
  	"title" varchar,
  	"featured" boolean DEFAULT false,
  	"home_order" numeric,
  	"photo_permission" boolean DEFAULT false,
  	"permission_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_course_photos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_course_photos_v_version_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_course_photos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_course_id" integer,
  	"version_title" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_home_order" numeric,
  	"version_photo_permission" boolean DEFAULT false,
  	"version_permission_note" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__course_photos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"short_description" varchar,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_categories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "categories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"courses_id" integer
  );
  
  CREATE TABLE "_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_short_description" varchar,
  	"version_display_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_categories_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"courses_id" integer
  );
  
  CREATE TABLE "enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar NOT NULL,
  	"type" "enum_enquiries_type" DEFAULT 'corporate' NOT NULL,
  	"status" "enum_enquiries_status" DEFAULT 'baru' NOT NULL,
  	"assigned_to_id" integer,
  	"internal_notes" varchar,
  	"notification_status" "enum_enquiries_notification_status" DEFAULT 'menunggu' NOT NULL,
  	"contact_name" varchar NOT NULL,
  	"company" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"topic" varchar NOT NULL,
  	"participants" "enum_enquiries_participants" NOT NULL,
  	"delivery_format" "enum_enquiries_delivery_format" NOT NULL,
  	"timing" varchar NOT NULL,
  	"needs" varchar,
  	"consent_at" timestamp(3) with time zone NOT NULL,
  	"policy_version" varchar NOT NULL,
  	"idempotency_key" varchar NOT NULL,
  	"source_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"courses_id" integer,
  	"sessions_id" integer,
  	"course_photos_id" integer,
  	"categories_id" integer,
  	"enquiries_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contacts_confirmed" boolean DEFAULT false,
  	"whatsapp_number" varchar DEFAULT '6280000000000' NOT NULL,
  	"phone" varchar DEFAULT '(021) 0000-0000' NOT NULL,
  	"email" varchar DEFAULT 'academy@contoh.id' NOT NULL,
  	"service_hours" varchar DEFAULT 'Senin–Jumat, 08.00–16.00 WIB' NOT NULL,
  	"address" varchar DEFAULT 'Alamat kantor menunggu konfirmasi
Jakarta' NOT NULL,
  	"portal_url" varchar,
  	"certificate_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "courses_audience" ADD CONSTRAINT "courses_audience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_outcomes" ADD CONSTRAINT "courses_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_formats" ADD CONSTRAINT "courses_formats_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_syllabus" ADD CONSTRAINT "courses_syllabus_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_faqs" ADD CONSTRAINT "courses_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_brochure_id_media_id_fk" FOREIGN KEY ("brochure_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_texts" ADD CONSTRAINT "courses_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_audience" ADD CONSTRAINT "_courses_v_version_audience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_outcomes" ADD CONSTRAINT "_courses_v_version_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_formats" ADD CONSTRAINT "_courses_v_version_formats_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_syllabus" ADD CONSTRAINT "_courses_v_version_syllabus_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_faqs" ADD CONSTRAINT "_courses_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_parent_id_courses_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_brochure_id_media_id_fk" FOREIGN KEY ("version_brochure_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v_texts" ADD CONSTRAINT "_courses_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sessions" ADD CONSTRAINT "sessions_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sessions" ADD CONSTRAINT "sessions_replacement_session_id_sessions_id_fk" FOREIGN KEY ("replacement_session_id") REFERENCES "public"."sessions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sessions_v" ADD CONSTRAINT "_sessions_v_parent_id_sessions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sessions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sessions_v" ADD CONSTRAINT "_sessions_v_version_course_id_courses_id_fk" FOREIGN KEY ("version_course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sessions_v" ADD CONSTRAINT "_sessions_v_version_replacement_session_id_sessions_id_fk" FOREIGN KEY ("version_replacement_session_id") REFERENCES "public"."sessions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "course_photos_photos" ADD CONSTRAINT "course_photos_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "course_photos_photos" ADD CONSTRAINT "course_photos_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."course_photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "course_photos" ADD CONSTRAINT "course_photos_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_course_photos_v_version_photos" ADD CONSTRAINT "_course_photos_v_version_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_course_photos_v_version_photos" ADD CONSTRAINT "_course_photos_v_version_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_course_photos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_course_photos_v" ADD CONSTRAINT "_course_photos_v_parent_id_course_photos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."course_photos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_course_photos_v" ADD CONSTRAINT "_course_photos_v_version_course_id_courses_id_fk" FOREIGN KEY ("version_course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_categories_v" ADD CONSTRAINT "_categories_v_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_categories_v_rels" ADD CONSTRAINT "_categories_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_categories_v_rels" ADD CONSTRAINT "_categories_v_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sessions_fk" FOREIGN KEY ("sessions_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_course_photos_fk" FOREIGN KEY ("course_photos_id") REFERENCES "public"."course_photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "courses_audience_order_idx" ON "courses_audience" USING btree ("_order");
  CREATE INDEX "courses_audience_parent_id_idx" ON "courses_audience" USING btree ("_parent_id");
  CREATE INDEX "courses_outcomes_order_idx" ON "courses_outcomes" USING btree ("_order");
  CREATE INDEX "courses_outcomes_parent_id_idx" ON "courses_outcomes" USING btree ("_parent_id");
  CREATE INDEX "courses_formats_order_idx" ON "courses_formats" USING btree ("order");
  CREATE INDEX "courses_formats_parent_idx" ON "courses_formats" USING btree ("parent_id");
  CREATE INDEX "courses_syllabus_order_idx" ON "courses_syllabus" USING btree ("_order");
  CREATE INDEX "courses_syllabus_parent_id_idx" ON "courses_syllabus" USING btree ("_parent_id");
  CREATE INDEX "courses_faqs_order_idx" ON "courses_faqs" USING btree ("_order");
  CREATE INDEX "courses_faqs_parent_id_idx" ON "courses_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "courses_slug_idx" ON "courses" USING btree ("slug");
  CREATE INDEX "courses_category_idx" ON "courses" USING btree ("category_id");
  CREATE INDEX "courses_image_idx" ON "courses" USING btree ("image_id");
  CREATE INDEX "courses_brochure_idx" ON "courses" USING btree ("brochure_id");
  CREATE INDEX "courses_updated_at_idx" ON "courses" USING btree ("updated_at");
  CREATE INDEX "courses_created_at_idx" ON "courses" USING btree ("created_at");
  CREATE INDEX "courses__status_idx" ON "courses" USING btree ("_status");
  CREATE INDEX "courses_texts_order_parent" ON "courses_texts" USING btree ("order","parent_id");
  CREATE INDEX "courses_rels_order_idx" ON "courses_rels" USING btree ("order");
  CREATE INDEX "courses_rels_parent_idx" ON "courses_rels" USING btree ("parent_id");
  CREATE INDEX "courses_rels_path_idx" ON "courses_rels" USING btree ("path");
  CREATE INDEX "courses_rels_courses_id_idx" ON "courses_rels" USING btree ("courses_id");
  CREATE INDEX "_courses_v_version_audience_order_idx" ON "_courses_v_version_audience" USING btree ("_order");
  CREATE INDEX "_courses_v_version_audience_parent_id_idx" ON "_courses_v_version_audience" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_version_outcomes_order_idx" ON "_courses_v_version_outcomes" USING btree ("_order");
  CREATE INDEX "_courses_v_version_outcomes_parent_id_idx" ON "_courses_v_version_outcomes" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_version_formats_order_idx" ON "_courses_v_version_formats" USING btree ("order");
  CREATE INDEX "_courses_v_version_formats_parent_idx" ON "_courses_v_version_formats" USING btree ("parent_id");
  CREATE INDEX "_courses_v_version_syllabus_order_idx" ON "_courses_v_version_syllabus" USING btree ("_order");
  CREATE INDEX "_courses_v_version_syllabus_parent_id_idx" ON "_courses_v_version_syllabus" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_version_faqs_order_idx" ON "_courses_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_courses_v_version_faqs_parent_id_idx" ON "_courses_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_parent_idx" ON "_courses_v" USING btree ("parent_id");
  CREATE INDEX "_courses_v_version_version_slug_idx" ON "_courses_v" USING btree ("version_slug");
  CREATE INDEX "_courses_v_version_version_category_idx" ON "_courses_v" USING btree ("version_category_id");
  CREATE INDEX "_courses_v_version_version_image_idx" ON "_courses_v" USING btree ("version_image_id");
  CREATE INDEX "_courses_v_version_version_brochure_idx" ON "_courses_v" USING btree ("version_brochure_id");
  CREATE INDEX "_courses_v_version_version_updated_at_idx" ON "_courses_v" USING btree ("version_updated_at");
  CREATE INDEX "_courses_v_version_version_created_at_idx" ON "_courses_v" USING btree ("version_created_at");
  CREATE INDEX "_courses_v_version_version__status_idx" ON "_courses_v" USING btree ("version__status");
  CREATE INDEX "_courses_v_created_at_idx" ON "_courses_v" USING btree ("created_at");
  CREATE INDEX "_courses_v_updated_at_idx" ON "_courses_v" USING btree ("updated_at");
  CREATE INDEX "_courses_v_latest_idx" ON "_courses_v" USING btree ("latest");
  CREATE INDEX "_courses_v_texts_order_parent" ON "_courses_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_courses_v_rels_order_idx" ON "_courses_v_rels" USING btree ("order");
  CREATE INDEX "_courses_v_rels_parent_idx" ON "_courses_v_rels" USING btree ("parent_id");
  CREATE INDEX "_courses_v_rels_path_idx" ON "_courses_v_rels" USING btree ("path");
  CREATE INDEX "_courses_v_rels_courses_id_idx" ON "_courses_v_rels" USING btree ("courses_id");
  CREATE INDEX "sessions_course_idx" ON "sessions" USING btree ("course_id");
  CREATE UNIQUE INDEX "sessions_code_idx" ON "sessions" USING btree ("code");
  CREATE INDEX "sessions_start_date_idx" ON "sessions" USING btree ("start_date");
  CREATE INDEX "sessions_registration_status_idx" ON "sessions" USING btree ("registration_status");
  CREATE INDEX "sessions_replacement_session_idx" ON "sessions" USING btree ("replacement_session_id");
  CREATE INDEX "sessions_updated_at_idx" ON "sessions" USING btree ("updated_at");
  CREATE INDEX "sessions_created_at_idx" ON "sessions" USING btree ("created_at");
  CREATE INDEX "sessions__status_idx" ON "sessions" USING btree ("_status");
  CREATE INDEX "_sessions_v_parent_idx" ON "_sessions_v" USING btree ("parent_id");
  CREATE INDEX "_sessions_v_version_version_course_idx" ON "_sessions_v" USING btree ("version_course_id");
  CREATE INDEX "_sessions_v_version_version_code_idx" ON "_sessions_v" USING btree ("version_code");
  CREATE INDEX "_sessions_v_version_version_start_date_idx" ON "_sessions_v" USING btree ("version_start_date");
  CREATE INDEX "_sessions_v_version_version_registration_status_idx" ON "_sessions_v" USING btree ("version_registration_status");
  CREATE INDEX "_sessions_v_version_version_replacement_session_idx" ON "_sessions_v" USING btree ("version_replacement_session_id");
  CREATE INDEX "_sessions_v_version_version_updated_at_idx" ON "_sessions_v" USING btree ("version_updated_at");
  CREATE INDEX "_sessions_v_version_version_created_at_idx" ON "_sessions_v" USING btree ("version_created_at");
  CREATE INDEX "_sessions_v_version_version__status_idx" ON "_sessions_v" USING btree ("version__status");
  CREATE INDEX "_sessions_v_created_at_idx" ON "_sessions_v" USING btree ("created_at");
  CREATE INDEX "_sessions_v_updated_at_idx" ON "_sessions_v" USING btree ("updated_at");
  CREATE INDEX "_sessions_v_latest_idx" ON "_sessions_v" USING btree ("latest");
  CREATE INDEX "course_photos_photos_order_idx" ON "course_photos_photos" USING btree ("_order");
  CREATE INDEX "course_photos_photos_parent_id_idx" ON "course_photos_photos" USING btree ("_parent_id");
  CREATE INDEX "course_photos_photos_image_idx" ON "course_photos_photos" USING btree ("image_id");
  CREATE UNIQUE INDEX "course_photos_course_idx" ON "course_photos" USING btree ("course_id");
  CREATE INDEX "course_photos_featured_idx" ON "course_photos" USING btree ("featured");
  CREATE INDEX "course_photos_updated_at_idx" ON "course_photos" USING btree ("updated_at");
  CREATE INDEX "course_photos_created_at_idx" ON "course_photos" USING btree ("created_at");
  CREATE INDEX "course_photos__status_idx" ON "course_photos" USING btree ("_status");
  CREATE INDEX "_course_photos_v_version_photos_order_idx" ON "_course_photos_v_version_photos" USING btree ("_order");
  CREATE INDEX "_course_photos_v_version_photos_parent_id_idx" ON "_course_photos_v_version_photos" USING btree ("_parent_id");
  CREATE INDEX "_course_photos_v_version_photos_image_idx" ON "_course_photos_v_version_photos" USING btree ("image_id");
  CREATE INDEX "_course_photos_v_parent_idx" ON "_course_photos_v" USING btree ("parent_id");
  CREATE INDEX "_course_photos_v_version_version_course_idx" ON "_course_photos_v" USING btree ("version_course_id");
  CREATE INDEX "_course_photos_v_version_version_featured_idx" ON "_course_photos_v" USING btree ("version_featured");
  CREATE INDEX "_course_photos_v_version_version_updated_at_idx" ON "_course_photos_v" USING btree ("version_updated_at");
  CREATE INDEX "_course_photos_v_version_version_created_at_idx" ON "_course_photos_v" USING btree ("version_created_at");
  CREATE INDEX "_course_photos_v_version_version__status_idx" ON "_course_photos_v" USING btree ("version__status");
  CREATE INDEX "_course_photos_v_created_at_idx" ON "_course_photos_v" USING btree ("created_at");
  CREATE INDEX "_course_photos_v_updated_at_idx" ON "_course_photos_v" USING btree ("updated_at");
  CREATE INDEX "_course_photos_v_latest_idx" ON "_course_photos_v" USING btree ("latest");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "categories__status_idx" ON "categories" USING btree ("_status");
  CREATE INDEX "categories_rels_order_idx" ON "categories_rels" USING btree ("order");
  CREATE INDEX "categories_rels_parent_idx" ON "categories_rels" USING btree ("parent_id");
  CREATE INDEX "categories_rels_path_idx" ON "categories_rels" USING btree ("path");
  CREATE INDEX "categories_rels_courses_id_idx" ON "categories_rels" USING btree ("courses_id");
  CREATE INDEX "_categories_v_parent_idx" ON "_categories_v" USING btree ("parent_id");
  CREATE INDEX "_categories_v_version_version_slug_idx" ON "_categories_v" USING btree ("version_slug");
  CREATE INDEX "_categories_v_version_version_updated_at_idx" ON "_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_categories_v_version_version_created_at_idx" ON "_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_categories_v_version_version__status_idx" ON "_categories_v" USING btree ("version__status");
  CREATE INDEX "_categories_v_created_at_idx" ON "_categories_v" USING btree ("created_at");
  CREATE INDEX "_categories_v_updated_at_idx" ON "_categories_v" USING btree ("updated_at");
  CREATE INDEX "_categories_v_latest_idx" ON "_categories_v" USING btree ("latest");
  CREATE INDEX "_categories_v_rels_order_idx" ON "_categories_v_rels" USING btree ("order");
  CREATE INDEX "_categories_v_rels_parent_idx" ON "_categories_v_rels" USING btree ("parent_id");
  CREATE INDEX "_categories_v_rels_path_idx" ON "_categories_v_rels" USING btree ("path");
  CREATE INDEX "_categories_v_rels_courses_id_idx" ON "_categories_v_rels" USING btree ("courses_id");
  CREATE UNIQUE INDEX "enquiries_reference_idx" ON "enquiries" USING btree ("reference");
  CREATE INDEX "enquiries_status_idx" ON "enquiries" USING btree ("status");
  CREATE INDEX "enquiries_assigned_to_idx" ON "enquiries" USING btree ("assigned_to_id");
  CREATE UNIQUE INDEX "enquiries_idempotency_key_idx" ON "enquiries" USING btree ("idempotency_key");
  CREATE INDEX "enquiries_source_hash_idx" ON "enquiries" USING btree ("source_hash");
  CREATE INDEX "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_courses_id_idx" ON "payload_locked_documents_rels" USING btree ("courses_id");
  CREATE INDEX "payload_locked_documents_rels_sessions_id_idx" ON "payload_locked_documents_rels" USING btree ("sessions_id");
  CREATE INDEX "payload_locked_documents_rels_course_photos_id_idx" ON "payload_locked_documents_rels" USING btree ("course_photos_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "courses_audience" CASCADE;
  DROP TABLE "courses_outcomes" CASCADE;
  DROP TABLE "courses_formats" CASCADE;
  DROP TABLE "courses_syllabus" CASCADE;
  DROP TABLE "courses_faqs" CASCADE;
  DROP TABLE "courses" CASCADE;
  DROP TABLE "courses_texts" CASCADE;
  DROP TABLE "courses_rels" CASCADE;
  DROP TABLE "_courses_v_version_audience" CASCADE;
  DROP TABLE "_courses_v_version_outcomes" CASCADE;
  DROP TABLE "_courses_v_version_formats" CASCADE;
  DROP TABLE "_courses_v_version_syllabus" CASCADE;
  DROP TABLE "_courses_v_version_faqs" CASCADE;
  DROP TABLE "_courses_v" CASCADE;
  DROP TABLE "_courses_v_texts" CASCADE;
  DROP TABLE "_courses_v_rels" CASCADE;
  DROP TABLE "sessions" CASCADE;
  DROP TABLE "_sessions_v" CASCADE;
  DROP TABLE "course_photos_photos" CASCADE;
  DROP TABLE "course_photos" CASCADE;
  DROP TABLE "_course_photos_v_version_photos" CASCADE;
  DROP TABLE "_course_photos_v" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_rels" CASCADE;
  DROP TABLE "_categories_v" CASCADE;
  DROP TABLE "_categories_v_rels" CASCADE;
  DROP TABLE "enquiries" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_courses_formats";
  DROP TYPE "public"."enum_courses_status";
  DROP TYPE "public"."enum__courses_v_version_formats";
  DROP TYPE "public"."enum__courses_v_version_status";
  DROP TYPE "public"."enum_sessions_startdate_tz";
  DROP TYPE "public"."enum_sessions_enddate_tz";
  DROP TYPE "public"."enum_sessions_registrationdeadline_tz";
  DROP TYPE "public"."enum_sessions_format";
  DROP TYPE "public"."enum_sessions_fee_policy";
  DROP TYPE "public"."enum_sessions_currency";
  DROP TYPE "public"."enum_sessions_registration_status";
  DROP TYPE "public"."enum_sessions_status";
  DROP TYPE "public"."enum__sessions_v_version_startdate_tz";
  DROP TYPE "public"."enum__sessions_v_version_enddate_tz";
  DROP TYPE "public"."enum__sessions_v_version_registrationdeadline_tz";
  DROP TYPE "public"."enum__sessions_v_version_format";
  DROP TYPE "public"."enum__sessions_v_version_fee_policy";
  DROP TYPE "public"."enum__sessions_v_version_currency";
  DROP TYPE "public"."enum__sessions_v_version_registration_status";
  DROP TYPE "public"."enum__sessions_v_version_status";
  DROP TYPE "public"."enum_course_photos_status";
  DROP TYPE "public"."enum__course_photos_v_version_status";
  DROP TYPE "public"."enum_categories_status";
  DROP TYPE "public"."enum__categories_v_version_status";
  DROP TYPE "public"."enum_enquiries_type";
  DROP TYPE "public"."enum_enquiries_status";
  DROP TYPE "public"."enum_enquiries_notification_status";
  DROP TYPE "public"."enum_enquiries_participants";
  DROP TYPE "public"."enum_enquiries_delivery_format";
  DROP TYPE "public"."enum_users_roles";`)
}
