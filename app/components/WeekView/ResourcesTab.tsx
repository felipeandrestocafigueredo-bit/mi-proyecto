"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import { listFilesByWeek, uploadResource, getPublicUrl, addFileToLessonContent, findLessonByWeek, getFileType, type StoredFile } from "../../services/storageService";
import { useAccessControl } from "@/app/providers/AccessControlProvider";
import { uploadAndPersistFile, addLinkToLesson, removeItemFromLesson } from "@/app/actions/storageActions";
import { normalizeLesson } from "../../models/LessonModel";

const isValidUrl = (value: string) => {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const IconButton = ({ children, onClick, color = "#1D4ED8", title }: { children: React.ReactNode; onClick?: () => void; color?: string; title?: string }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      border: "none",
      background: "transparent",
      cursor: "pointer",
      padding: 8,
      borderRadius: 8,
      color,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </button>
);

const Pencil = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Trash = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const X = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6 6 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 6l12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

import type { Lesson } from "../../models/LessonModel";

interface ResourcesTabProps {
  lesson?: Lesson | null;
  colors: Record<string, string>;
  editMode?: boolean;
  gradeCode?: string;
  monthIndex?: number;
  weekIndex?: number;
  onFileUploaded?: (lesson: Lesson) => void;
}

export default function ResourcesTab({ lesson, colors, editMode: propEditMode, gradeCode, monthIndex, weekIndex, onFileUploaded }: ResourcesTabProps) {
  const { accessMode, editMode, toggleEditMode } = useAccessControl();
  const isTeacherMode = accessMode === "teacher" || propEditMode === true;
  // initialResources es la fuente de verdad desde la DB (via lesson prop).
  const initialResources = Array.isArray(lesson?.resources) ? lesson.resources : [];

  const palette = { main: colors?.main || "#2563EB" };

  // localResources solo guarda items agregados por URL localmente.
  // Los archivos subidos se reflejan en lesson.resources automáticamente.
  const [localResources, setLocalResources] = useState<Array<{ title: string; url: string; desc: string }>>([]);
  const [resources, setResources] = useState(initialResources);
  const [newResource, setNewResource] = useState({ title: "", url: "", desc: "" });
  const [editingIndex, setEditingIndex] = useState(-1);
  const [draftResource, setDraftResource] = useState({ title: "", url: "", desc: "" });
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [storageFiles, setStorageFiles] = useState<StoredFile[]>([]);
  const [uploadingToStorage, setUploadingToStorage] = useState(false);
  const [savingLink, setSavingLink] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const resolvedGradeCode = gradeCode || lesson?.grade_code || lesson?.id?.split("-")[0] || "g67";
  const resolvedMonthIndex = monthIndex ?? lesson?.month_index ?? 0;
  const resolvedWeekIndex = weekIndex ?? lesson?.week_index ?? 1;

  useEffect(() => {
    if (!lesson?.id) return;

    let cancelled = false;
    void listFilesByWeek(resolvedGradeCode, resolvedMonthIndex, resolvedWeekIndex)
      .then((files) => {
        if (!cancelled) setStorageFiles(files.resources);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [lesson, resolvedGradeCode, resolvedMonthIndex, resolvedWeekIndex]);

  async function fetchStorageFiles() {
    if (!lesson?.id) return;
    try {
      const files = await listFilesByWeek(resolvedGradeCode, resolvedMonthIndex, resolvedWeekIndex);
      setStorageFiles(files.resources);
    } catch {
      /* ignore */
    }
  }

  async function handleUploadToStorage(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length || !lesson) return;

    setUploadingToStorage(true);
    setUploadError(null);
    try {
      for (const file of files) {
        console.log('[ResourcesTab] uploading', { fileName: file.name, size: file.size, gradeCode: resolvedGradeCode, monthIndex: resolvedMonthIndex, weekIndex: resolvedWeekIndex });
        // No llamamos findLessonByWeek desde el cliente porque la petición
        // REST a Supabase puede fallar por DNS/red del usuario. El server
        // action resolverá el lesson_id internamente con service_role.
        const result = await uploadAndPersistFile(null, resolvedGradeCode, resolvedMonthIndex, resolvedWeekIndex, "resources", file);
        console.log('[ResourcesTab] uploadAndPersistFile result', { error: result.error, hasData: Boolean(result.data), lessonId: result.lessonId, dataKeys: result.data ? Object.keys(result.data) : [] });
        if (result.error || !result.data) {
          throw new Error(result.error || `No se pudo guardar el recurso "${file.name}".`);
        }
        const normalized = normalizeLesson(result.data);
        console.log('[ResourcesTab] normalized lesson', { lessonId: normalized.id, resourcesLength: normalized.resources?.length ?? 0 });
        onFileUploaded?.(normalized);
      }
      await fetchStorageFiles();
    } catch (error) {
      console.error('[ResourcesTab] upload error', error);
      setUploadError(error instanceof Error ? error.message : "No se pudo guardar el recurso.");
    } finally {
      setUploadingToStorage(false);
      event.target.value = "";
    }
  }

  // Resetear estado local solo cuando cambia el lesson.id (no en cada render
  // del padre). Sin requestAnimationFrame para que el setState no se cancele.
  useEffect(() => {
    setResources(initialResources);
    setNewResource({ title: "", url: "", desc: "" });
    setEditingIndex(-1);
    setDraftResource({ title: "", url: "", desc: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  const handleAddResource = async () => {
    if (!newResource.title.trim() || !isValidUrl(newResource.url.trim())) return;
    if (!lesson?.id) return;
    setSavingLink(true);
    setUploadError(null);
    const payload = {
      title: newResource.title.trim(),
      url: newResource.url.trim(),
      desc: newResource.desc.trim(),
    };
    try {
      const result = await addLinkToLesson(
        lesson.id,
        resolvedGradeCode,
        resolvedMonthIndex,
        resolvedWeekIndex,
        "resources",
        payload
      );
      if (result.error || !result.data) {
        throw new Error(result.error || "No se pudo guardar el enlace.");
      }
      const normalized = normalizeLesson(result.data);
      onFileUploaded?.(normalized);
      setNewResource({ title: "", url: "", desc: "" });
    } catch (error) {
      console.error("[ResourcesTab] addLink error", error);
      setUploadError(error instanceof Error ? error.message : "No se pudo guardar el enlace.");
    } finally {
      setSavingLink(false);
    }
  };

  const handleSaveEdit = async () => {
    if (editingIndex < 0) return;
    if (!draftResource.title.trim() || !isValidUrl(draftResource.url.trim())) return;
    if (!lesson?.id) return;
    const original = resources[editingIndex];
    if (!original) return;
    const remaining = resources.filter((_, i) => i !== editingIndex);
    const updated = { ...original, title: draftResource.title.trim(), url: draftResource.url.trim(), desc: draftResource.desc.trim() };
    setSavingLink(true);
    setUploadError(null);
    try {
      const removeResult = await removeItemFromLesson(lesson.id, "resources", { url: String(original.url ?? ""), title: String(original.title ?? "") });
      if (removeResult.error) throw new Error(removeResult.error);
      const addResult = await addLinkToLesson(
        lesson.id,
        resolvedGradeCode,
        resolvedMonthIndex,
        resolvedWeekIndex,
        "resources",
        { title: updated.title, url: updated.url, desc: updated.desc }
      );
      if (addResult.error || !addResult.data) throw new Error(addResult.error || "No se pudo actualizar el enlace.");
      const normalized = normalizeLesson(addResult.data);
      setResources(remaining.concat([updated]));
      onFileUploaded?.(normalized);
      setEditingIndex(-1);
      setDraftResource({ title: "", url: "", desc: "" });
    } catch (error) {
      console.error("[ResourcesTab] saveEdit error", error);
      setUploadError(error instanceof Error ? error.message : "No se pudo actualizar el enlace.");
    } finally {
      setSavingLink(false);
    }
  };

  const handleDeleteResource = async (indexToDelete: number) => {
    if (editingIndex < 0 && !resources[indexToDelete]) return;
    const target = resources[indexToDelete];
    if (!target || !lesson?.id) return;
    setSavingLink(true);
    setUploadError(null);
    try {
      const result = await removeItemFromLesson(lesson.id, "resources", { url: String(target.url ?? ""), title: String(target.title ?? "") });
      if (result.error) throw new Error(result.error);
      const normalized = result.data ? normalizeLesson(result.data) : null;
      setResources((current) => current.filter((_, i) => i !== indexToDelete));
      if (editingIndex === indexToDelete) { setEditingIndex(-1); setDraftResource({ title: "", url: "", desc: "" }); }
      if (normalized) onFileUploaded?.(normalized);
    } catch (error) {
      console.error("[ResourcesTab] delete error", error);
      setUploadError(error instanceof Error ? error.message : "No se pudo eliminar el enlace.");
    } finally {
      setSavingLink(false);
    }
  };

  const allResources = useMemo(() => {
    const fromContent = resources.map((r) => ({
      title: r.title || "Recurso",
      url: r.url || "",
      desc: r.desc || "",
      path: r.path || "",
      source: "content" as const,
    }));
    const fromLocal = localResources.map((item) => ({
      title: item.title || "Recurso",
      url: item.url || "",
      desc: item.desc || "",
      path: "",
      source: "local" as const,
    }));
    const fromStorage = storageFiles.map((file) => ({
      title: file.name,
      url: file.url,
      desc: "",
      path: file.path,
      source: "storage" as const,
    }));
    const seen = new Set<string>();
    return [...fromContent, ...fromLocal, ...fromStorage].filter((item) => {
      const key = item.path || item.url || `${item.source}:${item.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [resources, localResources, storageFiles]);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#64748B", fontSize: 13 }}>
          {allResources.length} recurso{allResources.length === 1 ? "" : "s"} disponible{allResources.length === 1 ? "" : "s"}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {isTeacherMode && (
            <>
              <input
                id="resource-upload-input"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx,.ppt,.pptx"
                multiple
                onChange={handleUploadToStorage}
                style={{ display: "none" }}
              />
              <button
                onClick={() => document.getElementById("resource-upload-input")?.click()}
                disabled={uploadingToStorage}
                style={{
                  border: "none",
                  borderRadius: 10,
                  padding: "8px 14px",
                  background: uploadingToStorage ? "#94A3B8" : "#10B981",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: uploadingToStorage ? "not-allowed" : "pointer",
                  fontSize: 13,
                }}
              >
                {uploadingToStorage ? "Subiendo..." : "📤 Subir archivo"}
              </button>
              <IconButton title={editMode ? "Ocultar edición" : "Mostrar edición"} onClick={toggleEditMode} color="#1D4ED8">
                {editMode ? <X /> : <Pencil />}
              </IconButton>
            </>
          )}
        </div>
      </div>
      {uploadError && (
        <div role="alert" style={{ color: "#991B1B", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: 10 }}>
          {uploadError}
        </div>
      )}

      {allResources.length === 0 ? (
        <EmptyState text="📚 Esta semana todavía no tiene recursos disponibles." />
      ) : (
        <div style={{ display: "grid", gap: 18 }}>
          {allResources.map((item, index) => {
            const isEditing = editMode && index === editingIndex && item.source === "content";
            const showActions = editMode && hoverIndex === index;
            const lowerUrl = (item.url || "").toLowerCase();
            const isPdf = lowerUrl.endsWith(".pdf") || /\.pdf($|\?)/.test(lowerUrl);
            const isImage = /\.(png|jpe?g|gif|webp)($|\?)/.test(lowerUrl);
            const isOffice = /\.(ppt|pptx|doc|docx)($|\?)/.test(lowerUrl);
            const isPreviewable = Boolean(item.url) && (isPdf || isImage || isOffice);
            const officeViewerUrl = isOffice
              ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(item.url)}`
              : null;
            return (
              <div key={`${item.source}-${item.path || item.url || index}`} onMouseEnter={() => setHoverIndex(index)} onMouseLeave={() => setHoverIndex(-1)}>
                <Card title={item.title} subtitle={item.source === "storage" ? "📁 Archivo en storage" : ""}>
                  <div style={{ display: "grid", gap: 12 }}>
                    <div style={{ color: "#475569", lineHeight: 1.7 }}>{item.desc || ""}</div>

                    {isPreviewable && (
                      <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E2E8F0", minHeight: 360 }}>
                        {isPdf ? (
                          <object
                            type="application/pdf"
                            data={item.url}
                            width="100%"
                            height="500"
                            style={{ minHeight: 400 }}
                          >
                            <div style={{ padding: 20, textAlign: "center", color: "#64748B" }}>
                              No se puede previsualizar el PDF. Usa el botón para abrirlo.
                            </div>
                          </object>
                        ) : isImage ? (
                          <img src={item.url} alt={item.title} style={{ width: "100%", height: "auto", display: "block" }} />
                        ) : isOffice && officeViewerUrl ? (
                          <iframe
                            src={officeViewerUrl}
                            title={item.title}
                            width="100%"
                            height="500"
                            style={{ border: "none", minHeight: 400 }}
                            allow="fullscreen; clipboard-write; encrypted-media; picture-in-picture"
                            allowFullScreen={false}
                          />
                        ) : null}
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        {item.url ? (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", background: palette.main, color: "#fff", padding: "10px 18px", borderRadius: 12, fontWeight: 700 }}>🌐 Abrir recurso</a>
                        ) : (
                          <div style={{ width: "fit-content", borderRadius: 12, padding: "10px 18px", background: "#F8FAFC", color: "#475569", fontWeight: 700 }}>Recurso no disponible</div>
                        )}
                      </div>

                      {item.source === "content" && (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <div style={{ opacity: showActions ? 1 : 0, transform: showActions ? "translateX(0)" : "translateX(6px)", transition: ".18s" }}>
                            <IconButton title="Editar" onClick={() => { setEditingIndex(index); setDraftResource({ title: item.title || "", url: item.url || "", desc: item.desc || "" }); }} color="#1D4ED8"><Pencil /></IconButton>
                          </div>

                          <div style={{ opacity: showActions ? 1 : 0, transform: showActions ? "translateX(0)" : "translateX(6px)", transition: ".18s" }}>
                            <IconButton title="Eliminar" onClick={() => handleDeleteResource(index)} color="#B91C1C"><Trash /></IconButton>
                          </div>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div style={{ display: "grid", gap: 10 }}>
                        <input value={draftResource.title} onChange={(e) => setDraftResource((c) => ({ ...c, title: e.target.value }))} placeholder="Título" style={{ width: "100%", borderRadius: 12, border: "1px solid rgba(36,31,26,.12)", padding: "10px 12px" }} />
                        <input value={draftResource.url} onChange={(e) => setDraftResource((c) => ({ ...c, url: e.target.value }))} placeholder="https://" style={{ width: "100%", borderRadius: 12, border: "1px solid rgba(36,31,26,.12)", padding: "10px 12px" }} />
                        {draftResource.url && !isValidUrl(draftResource.url) && <div style={{ color: "#b91c1c" }}>Ingresa un enlace válido antes de guardar.</div>}
                        <textarea value={draftResource.desc} onChange={(e) => setDraftResource((c) => ({ ...c, desc: e.target.value }))} rows={2} placeholder="Descripción" style={{ width: "100%", borderRadius: 12, border: "1px solid rgba(36,31,26,.12)", padding: "10px 12px" }} />
                        <div style={{ display: "flex", gap: 10 }}>
                          <button onClick={handleSaveEdit} style={{ background: palette.main, color: "#fff", border: "none", padding: "8px 12px", borderRadius: 10, cursor: "pointer" }}>Guardar</button>
                          <button onClick={() => setEditingIndex(-1)} style={{ background: "#F1F5F9", color: "#334155", border: "none", padding: "8px 12px", borderRadius: 10, cursor: "pointer" }}>Cancelar</button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {editMode && (
        <Card title="Agregar recurso por URL" subtitle="Sube un enlace nuevo.">
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gap: 10 }}>
              <label style={{ fontWeight: 700, color: "#334155" }}>Título</label>
              <input value={newResource.title} onChange={(e) => setNewResource((c) => ({ ...c, title: e.target.value }))} placeholder="Ej. Recursos interactivos" style={{ width: "100%", borderRadius: 14, border: "1px solid rgba(36,31,26,.16)", padding: "12px 14px", fontSize: 14 }} />
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <label style={{ fontWeight: 700, color: "#334155" }}>Enlace URL</label>
              <input value={newResource.url} onChange={(e) => setNewResource((c) => ({ ...c, url: e.target.value }))} placeholder="https://" style={{ width: "100%", borderRadius: 14, border: "1px solid rgba(36,31,26,.16)", padding: "12px 14px", fontSize: 14 }} />
              {newResource.url && !isValidUrl(newResource.url) && <div style={{ color: "#b91c1c", fontSize: 13 }}>Ingresa un enlace válido para previsualizar.</div>}
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <label style={{ fontWeight: 700, color: "#334155" }}>Descripción</label>
              <textarea value={newResource.desc} onChange={(e) => setNewResource((c) => ({ ...c, desc: e.target.value }))} placeholder="Breve descripción" rows={2} style={{ width: "100%", borderRadius: 14, border: "1px solid rgba(36,31,26,.16)", padding: "10px 12px", fontSize: 14, resize: "vertical" }} />
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={handleAddResource}
                disabled={savingLink}
                style={{
                  border: "none",
                  borderRadius: 12,
                  padding: "10px 16px",
                  background: savingLink ? "#94A3B8" : palette.main,
                  color: "#fff",
                  fontWeight: 700,
                  cursor: savingLink ? "not-allowed" : "pointer",
                }}
              >
                {savingLink ? "Guardando..." : "+ Agregar enlace"}
              </button>
            </div>

            {newResource.url && isValidUrl(newResource.url) && (
              <div style={{ border: "1px solid rgba(37,99,235,.18)", borderRadius: 16, padding: 14, background: "rgba(59,130,246,.05)" }}>
                <div style={{ fontWeight: 700, marginBottom: 6, color: "#1e3a8a" }}>Vista previa del enlace</div>
                <a href={newResource.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", color: "#1d4ed8", textDecoration: "underline" }}>{newResource.url}</a>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
