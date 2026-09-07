/* =============================================================================
 * supabase/types.ts
 * =============================================================================
 * Tipos TypeScript generados a mano desde el esquema definido en:
 *   supabase/migrations/20260820000000_001_init_schema.sql
 *
 * Equivalente a: supabase gen types typescript --project-id lbrqyadurqixmfjyutxu
 *
 * Fuente: audit-integracion-supabase.md §2.1, §2.2
 * ========================================================================== */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      lessons: {
        Row: {
          id: string;
          lesson_id: string;
          grade_code: string;
          month_index: number;
          week_index: number;
          title: string | null;
          content: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          grade_code?: string;
          month_index: number;
          week_index: number;
          title?: string | null;
          content?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          grade_code?: string;
          month_index?: number;
          week_index?: number;
          title?: string | null;
          content?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          role: "student" | "teacher";
          created_at: string;
        };
        Insert: {
          id: string;
          role?: "student" | "teacher";
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: "student" | "teacher";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
            referencedTable: "auth.users";
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      handle_new_user: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

/* =============================================================================
 * Tipos de aplicación derivados
 * ========================================================================== */

export interface LessonContent {
  topic?: string;
  fecha?: string;
  badge?: string;
  vocab?: Json[];
  games?: string[];
  resources?: Json[];
  presentation?: Json[];
  slides?: Json[];
  worksheets?: Json[];
  progress?: number;
  [key: string]: Json | undefined;
}

export type LessonRow = Database["public"]["Tables"]["lessons"]["Row"];
export type LessonInsert = Database["public"]["Tables"]["lessons"]["Insert"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileRole = ProfileRow["role"];

/* =============================================================================
 * Helpers para cast de respuestas de Supabase
 * ========================================================================== */

export function toLessonRow(data: Record<string, unknown>): LessonRow {
  return {
    id: data.id as string,
    lesson_id: data.lesson_id as string,
    grade_code: data.grade_code as string,
    month_index: data.month_index as number,
    week_index: data.week_index as number,
    title: data.title as string | null,
    content: data.content as Json,
    created_at: data.created_at as string,
  };
}

export function toProfileRow(data: Record<string, unknown>): ProfileRow {
  return {
    id: data.id as string,
    role: data.role as ProfileRole,
    created_at: data.created_at as string,
  };
}
