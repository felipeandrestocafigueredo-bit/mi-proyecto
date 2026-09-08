'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const STORAGE_BUCKET = 'academic-files'

function sanitizeName(name: string): string {
  return name.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '')
}

function getFileType(name: string): string {
  const extension = name.split('.').pop()?.toLowerCase() ?? ''
  const types: Record<string, string> = {
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  }
  return types[extension] ?? 'application/octet-stream'
}

export async function uploadAndPersistFile(
  lessonId: string | null | undefined,
  gradeCode: string,
  monthIndex: number,
  weekIndex: number,
  folder: 'worksheets' | 'slides' | 'resources',
  file: File
): Promise<{ data: Record<string, unknown> | null; error: string | null; lessonId?: string }> {
  console.log('[uploadAndPersistFile] start', {
    lessonId,
    gradeCode,
    monthIndex,
    weekIndex,
    folder,
    fileName: file?.name,
    fileSize: file?.size,
    hasUrl: Boolean(supabaseUrl),
    hasServiceRole: Boolean(supabaseServiceRoleKey),
  });

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('[uploadAndPersistFile] missing env', { hasUrl: Boolean(supabaseUrl), hasServiceRole: Boolean(supabaseServiceRoleKey) });
    return { data: null, error: 'Falta la configuración segura de Supabase.' };
  }

  const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey)

  let resolvedLessonId = (lessonId ?? '').trim();
  if (!resolvedLessonId) {
    const { data: lessonRow, error: lookupError } = await adminClient
      .from('lessons')
      .select('lesson_id')
      .eq('grade_code', gradeCode)
      .eq('month_index', monthIndex)
      .eq('week_index', weekIndex)
      .maybeSingle();
    if (lookupError) {
      console.error('[uploadAndPersistFile] lesson lookup error', { lookupError: lookupError.message });
      return { data: null, error: `No se pudo buscar la lección: ${lookupError.message}` };
    }
    if (!lessonRow?.lesson_id) {
      return { data: null, error: `No existe la lección ${gradeCode} mes ${monthIndex} semana ${weekIndex}.` };
    }
    resolvedLessonId = lessonRow.lesson_id;
    console.log('[uploadAndPersistFile] lesson_id resolved server-side', { resolvedLessonId });
  }

  const fileName = `${Date.now()}-${sanitizeName(file.name)}`
  const path = `${sanitizeName(gradeCode)}/month-${monthIndex}/week-${weekIndex}/${folder}/${fileName}`
  console.log('[uploadAndPersistFile] upload attempt', { path, bucket: STORAGE_BUCKET });
  const fileBuffer = Buffer.from(await file.arrayBuffer())
  const { error: uploadError } = await adminClient.storage
    .from(STORAGE_BUCKET)
    .upload(path, fileBuffer, {
      contentType: file.type || getFileType(file.name),
      cacheControl: '3600',
      upsert: false,
    })
  if (uploadError) {
    console.error('[uploadAndPersistFile] storage upload error', { path, error: uploadError.message });
    return { data: null, error: `Storage: ${uploadError.message}` };
  }
  console.log('[uploadAndPersistFile] storage upload OK', { path });

  const { data: urlData } = adminClient.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  const item = {
    title: file.name,
    url: urlData.publicUrl,
    path,
    type: file.type || getFileType(file.name),
    description: '',
  }
  console.log('[uploadAndPersistFile] atomic update attempt', { lessonId: resolvedLessonId, folder, newItem: item });

  const { data, error } = await adminClient.rpc('append_lesson_content_item' as never, {
    p_lesson_id: resolvedLessonId,
    p_folder: folder,
    p_item: item,
  } as never)

  if (error || !data || (Array.isArray(data) && data.length === 0)) {
    console.error('[uploadAndPersistFile] atomic update error', { lessonId: resolvedLessonId, folder, error: error?.message });
    await adminClient.storage.from(STORAGE_BUCKET).remove([path])
    return { data: null, error: error?.message ?? 'No se pudo guardar la referencia del archivo.' };
  }
  console.log('[uploadAndPersistFile] atomic update OK', { lessonId: resolvedLessonId, folder });
  const returnedRow = Array.isArray(data) ? data[0] : data
  return { data: returnedRow as unknown as Record<string, unknown>, error: null, lessonId: resolvedLessonId }
}

export async function persistFileInLesson(
  lessonId: string,
  folder: 'worksheets' | 'slides' | 'resources',
  file: { name: string; path: string; url: string; type: string }
): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return { data: null, error: 'Falta la configuración segura de Supabase.' }
  }

  const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey)
  const { data: existing, error: readError } = await adminClient
    .from('lessons')
    .select('content')
    .eq('lesson_id', lessonId)
    .single()
  if (readError || !existing) {
    return { data: null, error: readError?.message ?? 'No se encontró la lección.' }
  }

  const content = (existing.content ?? {}) as Record<string, unknown>
  const items = Array.isArray(content[folder]) ? content[folder] as Array<Record<string, unknown>> : []
  const item = {
    title: file.name,
    url: file.url,
    path: file.path,
    type: file.type,
    description: '',
  }
  const { data, error } = await adminClient.rpc('append_lesson_content_item' as never, {
    p_lesson_id: lessonId,
    p_folder: folder,
    p_item: item,
  } as never)
  if (error || !data || (Array.isArray(data) && data.length === 0)) {
    return { data: null, error: error?.message ?? 'No se pudo guardar el archivo.' }
  }
  const returnedRow = Array.isArray(data) ? data[0] : data
  return { data: returnedRow as unknown as Record<string, unknown>, error: null }
}

export async function addLinkToLesson(
  lessonId: string | null | undefined,
  gradeCode: string,
  monthIndex: number,
  weekIndex: number,
  folder: 'worksheets' | 'slides' | 'resources',
  item: { title?: string; url: string; desc?: string; description?: string }
): Promise<{ data: Record<string, unknown> | null; error: string | null; lessonId?: string }> {
  console.log('[addLinkToLesson] start', { lessonId, gradeCode, monthIndex, weekIndex, folder, item });
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return { data: null, error: 'Falta la configuración segura de Supabase.' };
  }

  const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey)

  let resolvedLessonId = (lessonId ?? '').trim();
  if (!resolvedLessonId) {
    const { data: lessonRow, error: lookupError } = await adminClient
      .from('lessons')
      .select('lesson_id')
      .eq('grade_code', gradeCode)
      .eq('month_index', monthIndex)
      .eq('week_index', weekIndex)
      .maybeSingle();
    if (lookupError) {
      return { data: null, error: `No se pudo buscar la lección: ${lookupError.message}` };
    }
    if (!lessonRow?.lesson_id) {
      return { data: null, error: `No existe la lección ${gradeCode} mes ${monthIndex} semana ${weekIndex}.` };
    }
    resolvedLessonId = lessonRow.lesson_id;
  }

  const payload = {
    title: item.title ?? '',
    url: item.url,
    desc: item.desc ?? item.description ?? '',
    description: item.description ?? item.desc ?? '',
    path: '',
    type: 'link',
  };

  const { data, error } = await adminClient.rpc('append_lesson_content_item' as never, {
    p_lesson_id: resolvedLessonId,
    p_folder: folder,
    p_item: payload,
  } as never)

  if (error || !data || (Array.isArray(data) && data.length === 0)) {
    console.error('[addLinkToLesson] rpc error', { error: error?.message });
    return { data: null, error: error?.message ?? 'No se pudo guardar el enlace.' };
  }
  const returnedRow = Array.isArray(data) ? data[0] : data
  return { data: returnedRow as unknown as Record<string, unknown>, error: null, lessonId: resolvedLessonId }
}

export async function removeItemFromLesson(
  lessonId: string,
  folder: 'worksheets' | 'slides' | 'resources',
  predicate: { url?: string; path?: string; title?: string }
): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return { data: null, error: 'Falta la configuración segura de Supabase.' };
  }

  const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey)
  const { data: existing, error: readError } = await adminClient
    .from('lessons')
    .select('content')
    .eq('lesson_id', lessonId)
    .single()
  if (readError || !existing) {
    return { data: null, error: readError?.message ?? 'No se encontró la lección.' };
  }
  const content = (existing.content ?? {}) as Record<string, unknown>
  const list = Array.isArray(content[folder]) ? content[folder] as Array<Record<string, unknown>> : []
  const filtered = list.filter((it) => {
    if (predicate.url && String(it.url ?? '') === predicate.url) return false;
    if (predicate.path && String(it.path ?? '') === predicate.path) return false;
    if (predicate.title && String(it.title ?? '') === predicate.title) return false;
    return true;
  });
  const { data, error } = await adminClient
    .from('lessons')
    .update({ content: { ...content, [folder]: filtered } })
    .eq('lesson_id', lessonId)
    .select()
    .single()
  if (error || !data) {
    return { data: null, error: error?.message ?? 'No se pudo eliminar el elemento.' };
  }
  return { data: data as unknown as Record<string, unknown>, error: null }
}

export async function ensureStorageBucketExists(): Promise<boolean> {
  console.log('ensureStorageBucketExists:start', {
    hasUrl: Boolean(supabaseUrl),
    hasServiceRole: Boolean(supabaseServiceRoleKey),
  })

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing Supabase service role key')
    return false
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  console.log('ensureStorageBucketExists:listBuckets', {
    count: Array.isArray(buckets) ? buckets.length : null,
    error: listError ? { message: listError.message, name: listError.name } : null,
  })

  if (listError) {
    console.error('Error listing buckets:', listError)
    return false
  }

  const exists = buckets?.some((b) => b.name === 'academic-files')
  console.log('ensureStorageBucketExists:exists', exists)

  if (exists) {
    return true
  }

  const { error } = await supabase.storage.createBucket('academic-files', {
    public: true,
  })

  console.log('ensureStorageBucketExists:createBucket', {
    error: error ? { message: error.message, name: error.name } : null,
  })

  if (error) {
    const message = String(error.message ?? '').toLowerCase()
    const alreadyExists = message.includes('already exists') || message.includes('bucket')
    if (alreadyExists) {
      return true
    }
    console.error('Error creating bucket:', error)
    return false
  }

  return true
}
