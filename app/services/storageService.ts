import { createClient } from "@/app/lib/supabase/client";
import type { Lesson } from "@/app/models/LessonModel";
import { persistFileInLesson } from "@/app/actions/storageActions";

const STORAGE_BUCKET = "academic-files";

export type StorageFolder = "worksheets" | "slides" | "resources";

function sanitizeName(name: string): string {
  return name.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
}

function getStoragePath(
  gradeCode: string,
  monthIndex: number,
  weekIndex: number,
  folder: StorageFolder,
  fileName: string
): string {
  const safeGrade = sanitizeName(gradeCode);
  const safeFile = sanitizeName(fileName);
  return `${safeGrade}/month-${monthIndex}/week-${weekIndex}/${folder}/${safeFile}`;
}

function getStoragePrefix(
  gradeCode: string,
  monthIndex: number,
  weekIndex: number,
  folder: StorageFolder
): string {
  return `${sanitizeName(gradeCode)}/month-${monthIndex}/week-${weekIndex}/${folder}/`;
}

export async function uploadFile({
  file,
  gradeCode,
  monthIndex,
  weekIndex,
  folder,
}: {
  file: File;
  gradeCode: string;
  monthIndex: number;
  weekIndex: number;
  folder: StorageFolder;
}): Promise<{ path: string; error: string | null }> {
  const supabase = createClient();

  const safeOriginalName = sanitizeName(file.name);
  const fileName = `${Date.now()}-${safeOriginalName}`;
  const path = getStoragePath(gradeCode, monthIndex, weekIndex, folder, fileName);

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    return { path: "", error: error.message };
  }

  return { path, error: null };
}

export async function getPublicUrl(path: string): Promise<string | null> {
  const supabase = createClient();
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);

  return data.publicUrl ?? null;
}

export async function getSignedUrl(path: string, expiresIn = 3600): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(path, expiresIn);

  if (error) {
    console.error("Error creating signed URL:", error);
    return null;
  }

  return data.signedUrl ?? null;
}

export async function deleteFile(path: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);

  if (error) {
    console.error("Error deleting file:", error);
    return false;
  }

  return true;
}

export async function listFiles(
  gradeCode: string,
  monthIndex: number,
  weekIndex: number,
  folder: StorageFolder
): Promise<string[]> {
  const supabase = createClient();
  const prefix = getStoragePrefix(gradeCode, monthIndex, weekIndex, folder);

  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).list(prefix, {
    limit: 100,
    offset: 0,
  });

  if (error) {
    console.error("Error listing files:", error);
    return [];
  }

  return (data ?? []).map((item: { name: string }) => `${prefix}${item.name}`);
}

export async function ensureBucketExists(): Promise<boolean> {
  const { ensureStorageBucketExists } = await import('@/app/actions/storageActions');
  return ensureStorageBucketExists();
}

export async function uploadWorksheet({
  file,
  gradeCode,
  monthIndex,
  weekIndex,
}: {
  file: File;
  gradeCode: string;
  monthIndex: number;
  weekIndex: number;
}): Promise<{ path: string; url: string | null; error: string | null }> {
  const { path, error } = await uploadFile({
    file,
    gradeCode,
    monthIndex,
    weekIndex,
    folder: "worksheets",
  });

  if (error || !path) {
    return { path: "", url: null, error: error ?? "upload failed" };
  }

  const url = await getPublicUrl(path);

  return { path, url, error: null };
}

export async function uploadSlide({
  file,
  gradeCode,
  monthIndex,
  weekIndex,
}: {
  file: File;
  gradeCode: string;
  monthIndex: number;
  weekIndex: number;
}): Promise<{ path: string; url: string | null; error: string | null }> {
  const { path, error } = await uploadFile({
    file,
    gradeCode,
    monthIndex,
    weekIndex,
    folder: "slides",
  });

  if (error || !path) {
    return { path: "", url: null, error: error ?? "upload failed" };
  }

  const url = await getPublicUrl(path);

  return { path, url, error: null };
}

export async function uploadResource({
  file,
  gradeCode,
  monthIndex,
  weekIndex,
}: {
  file: File;
  gradeCode: string;
  monthIndex: number;
  weekIndex: number;
}): Promise<{ path: string; url: string | null; error: string | null }> {
  const { path, error } = await uploadFile({
    file,
    gradeCode,
    monthIndex,
    weekIndex,
    folder: "resources",
  });

  if (error || !path) {
    return { path: "", url: null, error: error ?? "upload failed" };
  }

  const url = await getPublicUrl(path);

  return { path, url, error: null };
}

export async function removeWorksheet(path: string): Promise<boolean> {
  return deleteFile(path);
}

export async function removeSlide(path: string): Promise<boolean> {
  return deleteFile(path);
}

export async function removeResource(path: string): Promise<boolean> {
  return deleteFile(path);
}

export async function updateLessonWorksheets(
  lessonId: string,
  worksheets: Lesson["worksheets"]
): Promise<Lesson | null> {
  const supabase = createClient();

  const { data: existingData, error: fetchError } = await supabase
    .from("lessons")
    .select("content")
    .eq("lesson_id", lessonId)
    .single();

  if (fetchError || !existingData) {
    console.error("Error fetching lesson for worksheet update:", fetchError);
    return null;
  }

  const content = (existingData.content ?? {}) as Record<string, unknown>;

  const { data, error } = await supabase
    .from("lessons")
    .update({
      content: {
        ...content,
        worksheets,
      },
    })
    .eq("lesson_id", lessonId)
    .select()
    .single();

  if (error || !data) {
    console.error("Error updating lesson worksheets:", error);
    return null;
  }

  const { normalizeLesson } = await import("@/app/models/LessonModel");
  return normalizeLesson(data);
}

export async function updateLessonSlides(
  lessonId: string,
  slides: Lesson["slides"]
): Promise<Lesson | null> {
  const supabase = createClient();

  const { data: existingData, error: fetchError } = await supabase
    .from("lessons")
    .select("content")
    .eq("lesson_id", lessonId)
    .single();

  if (fetchError || !existingData) {
    console.error("Error fetching lesson for slide update:", fetchError);
    return null;
  }

  const content = (existingData.content ?? {}) as Record<string, unknown>;

  const updatePayload: Record<string, unknown> = {};
  if (slides && slides.length > 0) {
    updatePayload.content = {
      ...content,
      slides,
    };
  }

  const { data, error } = await supabase
    .from("lessons")
    .update(updatePayload)
    .eq("lesson_id", lessonId)
    .select()
    .single();

  if (error || !data) {
    console.error("Error updating lesson slides:", error);
    return null;
  }

  const { normalizeLesson } = await import("@/app/models/LessonModel");
  return normalizeLesson(data);
}

export async function updateLessonResources(
  lessonId: string,
  resources: Lesson["resources"]
): Promise<Lesson | null> {
  const supabase = createClient();

  const { data: existingData, error: fetchError } = await supabase
    .from("lessons")
    .select("content")
    .eq("lesson_id", lessonId)
    .single();

  if (fetchError || !existingData) {
    console.error("Error fetching lesson for resource update:", fetchError);
    return null;
  }

  const content = (existingData.content ?? {}) as Record<string, unknown>;

  const { data, error } = await supabase
    .from("lessons")
    .update({
      content: {
        ...content,
        resources,
      },
    })
    .eq("lesson_id", lessonId)
    .select()
    .single();

  if (error || !data) {
    console.error("Error updating lesson resources:", error);
    return null;
  }

  const { normalizeLesson } = await import("@/app/models/LessonModel");
  return normalizeLesson(data);
}

export interface StoredFile {
  name: string;
  path: string;
  url: string;
  type: string;
  size?: number;
}

export async function listFilesByWeek(
  gradeCode: string,
  monthIndex: number,
  weekIndex: number
): Promise<Record<StorageFolder, StoredFile[]>> {
  const supabase = createClient();
  const folders: StorageFolder[] = ["worksheets", "slides", "resources"];
  const result: Record<StorageFolder, StoredFile[]> = {
    worksheets: [],
    slides: [],
    resources: [],
  };

  for (const folder of folders) {
    const prefix = getStoragePrefix(gradeCode, monthIndex, weekIndex, folder);

    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).list(prefix, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      console.error(`Error listing files in ${folder}:`, error);
      continue;
    }

    const files: StoredFile[] = (data ?? [])
      .filter((item: { name?: string; metadata?: { size?: number } }) => item.name && item.name !== ".empty")
      .map((item: { name: string; metadata?: { size?: number } }) => {
        const filePath = `${prefix}${item.name}`;
        const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
        const fileType = getFileType(item.name);
        return {
          name: item.name,
          path: filePath,
          url: urlData.publicUrl,
          type: fileType,
          size: item.metadata?.size,
        };
      });

    result[folder] = files;
  }

  return result;
}

export function getFileType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const typeMap: Record<string, string> = {
    pdf: "application/pdf",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  };
  return typeMap[ext] || "application/octet-stream";
}

export async function addFileToLessonContent(
  lessonId: string,
  folder: StorageFolder,
  file: StoredFile
): Promise<Lesson | null> {
  const { data, error } = await persistFileInLesson(lessonId, folder, file);
  if (error || !data) {
    console.error("Error updating lesson content:", error);
    return null;
  }

  const { normalizeLesson } = await import("@/app/models/LessonModel");
  return normalizeLesson(data);
}

export async function removeFileFromLessonContent(
  lessonId: string,
  folder: StorageFolder,
  filePath: string
): Promise<Lesson | null> {
  const supabase = createClient();

  const { data: existingData, error: fetchError } = await supabase
    .from("lessons")
    .select("content")
    .eq("lesson_id", lessonId)
    .single();

  if (fetchError || !existingData) {
    console.error("Error fetching lesson:", fetchError);
    return null;
  }

  const content = (existingData.content ?? {}) as Record<string, unknown>;
  const folderKey = folder === "worksheets" ? "worksheets" : folder === "slides" ? "slides" : "resources";

  const existingItems = Array.isArray(content[folderKey]) ? content[folderKey] as Array<Record<string, unknown>> : [];

  const filteredItems = existingItems.filter((item) => item.path !== filePath && item.url !== filePath);

  const { data, error } = await supabase
    .from("lessons")
    .update({
      content: {
        ...content,
        [folderKey]: filteredItems,
      },
    })
    .eq("lesson_id", lessonId)
    .select()
    .single();

  if (error || !data) {
    console.error("Error updating lesson content:", error);
    return null;
  }

  const { normalizeLesson } = await import("@/app/models/LessonModel");
  return normalizeLesson(data);
}

export async function findLessonByWeek(
  gradeCode: string,
  monthIndex: number,
  weekIndex: number
): Promise<{ lesson_id: string; grade_code?: string; month_index?: number; week_index?: number } | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lessons")
    .select("lesson_id, grade_code, month_index, week_index")
    .eq("grade_code", gradeCode)
    .eq("month_index", monthIndex)
    .eq("week_index", weekIndex)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}
