"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import { listFilesByWeek, type StoredFile } from "../../services/storageService";
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

interface WorksheetTabProps {
  lesson?: Lesson | null;
  colors: Record<string, string>;
  editMode?: boolean;
  gradeCode?: string;
  monthIndex?: number;
  weekIndex?: number;
  onFileUploaded?: (lesson: Lesson) => void;
}

export default function WorksheetTab({ lesson, colors, editMode: propEditMode, gradeCode, monthIndex, weekIndex, onFileUploaded }: WorksheetTabProps) {
  const { accessMode, editMode, toggleEditMode } = useAccessControl();
  const isTeacherMode = accessMode === "teacher" || propEditMode === true;
  const initialWorksheets = useMemo(() => {
    const fromWorksheets = Array.isArray(lesson?.worksheets) ? lesson.worksheets : [];
    if (fromWorksheets.length > 0) return fromWorksheets;
    const fromWorksheet = lesson?.worksheet;
    if (Array.isArray(fromWorksheet)) return fromWorksheet;
    if (fromWorksheet && typeof fromWorksheet === "object") return [fromWorksheet];
    return [];
  }, [lesson]);

  const palette = { main: colors?.main || "#2563EB" };

  const [worksheets, setWorksheets] = useState(initialWorksheets);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newWorksheet, setNewWorksheet] = useState({ url: "", description: "" });
  const [draftWorksheet, setDraftWorksheet] = useState({ url: "", description: "" });
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
        if (!cancelled) setStorageFiles(files.worksheets);
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
      setStorageFiles(files.worksheets);
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
        console.log('[WorksheetTab] uploading', { fileName: file.name, size: file.size, gradeCode: resolvedGradeCode, monthIndex: resolvedMonthIndex, weekIndex: resolvedWeekIndex });
        // No llamamos findLessonByWeek desde el cliente (puede fallar por DNS).
        // El server action resuelve el lesson_id internamente.
        const result = await uploadAndPersistFile(null, resolvedGradeCode, resolvedMonthIndex, resolvedWeekIndex, "worksheets", file);
        console.log('[WorksheetTab] uploadAndPersistFile result', result);
        if (result.error || !result.data) {
          throw new Error(result.error || `No se pudo guardar el worksheet "${file.name}".`);
        }
        onFileUploaded?.(normalizeLesson(result.data));
      }
      await fetchStorageFiles();
    } catch (error) {
      console.error('[WorksheetTab] upload error', error);
      setUploadError(error instanceof Error ? error.message : "No se pudo guardar el worksheet.");
    } finally {
      setUploadingToStorage(false);
      event.target.value = "";
    }
  }

  // Resetear estado local solo cuando cambia el lesson.id (no en cada render).
  useEffect(() => {
    setWorksheets(initialWorksheets);
    setEditingIndex(-1);
    setNewWorksheet({ url: "", description: "" });
    setDraftWorksheet({ url: "", description: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  const handleAddWorksheet = async () => {
    if (!isValidUrl(newWorksheet.url.trim())) return;
    if (!lesson?.id) return;
    setSavingLink(true);
    setUploadError(null);
    try {
      const result = await addLinkToLesson(
        lesson.id,
        resolvedGradeCode,
        resolvedMonthIndex,
        resolvedWeekIndex,
        "worksheets",
        { url: newWorksheet.url.trim(), description: newWorksheet.description.trim() }
      );
      if (result.error || !result.data) throw new Error(result.error || "No se pudo guardar el worksheet.");
      const normalized = normalizeLesson(result.data);
      onFileUploaded?.(normalized);
      setNewWorksheet({ url: "", description: "" });
    } catch (error) {
      console.error("[WorksheetTab] addLink error", error);
      setUploadError(error instanceof Error ? error.message : "No se pudo guardar el worksheet.");
    } finally {
      setSavingLink(false);
    }
  };

  const handleSaveEdit = async () => {
    if (editingIndex < 0) return;
    if (!isValidUrl(draftWorksheet.url.trim())) return;
    if (!lesson?.id) return;
    const original = worksheets[editingIndex];
    if (!original) return;
    const remaining = worksheets.filter((_, i) => i !== editingIndex);
    const updated = { ...original, url: draftWorksheet.url.trim(), description: draftWorksheet.description.trim() };
    setSavingLink(true);
    setUploadError(null);
    try {
      const removeResult = await removeItemFromLesson(lesson.id, "worksheets", { url: String(original.url ?? "") });
      if (removeResult.error) throw new Error(removeResult.error);
      const addResult = await addLinkToLesson(
        lesson.id,
        resolvedGradeCode,
        resolvedMonthIndex,
        resolvedWeekIndex,
        "worksheets",
        { url: updated.url, description: updated.description }
      );
      if (addResult.error || !addResult.data) throw new Error(addResult.error || "No se pudo actualizar el worksheet.");
      const normalized = normalizeLesson(addResult.data);
      setWorksheets(remaining.concat([updated]));
      onFileUploaded?.(normalized);
      setEditingIndex(-1);
      setDraftWorksheet({ url: "", description: "" });
    } catch (error) {
      console.error("[WorksheetTab] saveEdit error", error);
      setUploadError(error instanceof Error ? error.message : "No se pudo actualizar el worksheet.");
    } finally {
      setSavingLink(false);
    }
  };

  const handleDeleteWorksheet = async (indexToDelete: number) => {
    const target = worksheets[indexToDelete];
    if (!target || !lesson?.id) return;
    setSavingLink(true);
    setUploadError(null);
    try {
      const result = await removeItemFromLesson(lesson.id, "worksheets", { url: String(target.url ?? "") });
      if (result.error) throw new Error(result.error);
      const normalized = result.data ? normalizeLesson(result.data) : null;
      setWorksheets((current) => current.filter((_, i) => i !== indexToDelete));
      if (editingIndex === indexToDelete) { setEditingIndex(-1); setDraftWorksheet({ url: "", description: "" }); }
      if (normalized) onFileUploaded?.(normalized);
    } catch (error) {
      console.error("[WorksheetTab] delete error", error);
      setUploadError(error instanceof Error ? error.message : "No se pudo eliminar el worksheet.");
    } finally {
      setSavingLink(false);
    }
  };

  const allWorksheets = useMemo(() => {
    const fromContent = worksheets.map((ws) => ({
      title: ws.title || "Worksheet",
      url: ws.url || "",
      description: ws.description || "",
      path: ws.path || "",
      source: "content" as const,
    }));
    const fromStorage = storageFiles.map((file) => ({
      title: file.name,
      url: file.url,
      description: "",
      path: file.path,
      source: "storage" as const,
    }));
    const seen = new Set<string>();
    return [...fromContent, ...fromStorage].filter((item) => {
      const key = item.path || item.url || `${item.source}:${item.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [worksheets, storageFiles]);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#64748B", fontSize: 13 }}>
          {allWorksheets.length} worksheet{allWorksheets.length === 1 ? "" : "s"} disponible{allWorksheets.length === 1 ? "" : "s"}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {isTeacherMode && (
            <>
              <input
                id="worksheet-upload-input"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx"
                multiple
                onChange={handleUploadToStorage}
                style={{ display: "none" }}
              />
              <button
                onClick={() => document.getElementById("worksheet-upload-input")?.click()}
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

      {allWorksheets.length === 0 ? (
        <EmptyState text="📄 Esta semana todavía no tiene una guía de trabajo disponible." />
      ) : (
        <div style={{ display: "grid", gap: 18 }}>
          {allWorksheets.map((ws, index) => {
            const isEditing = editMode && index === editingIndex && ws.source === "content";
            const showActions = editMode && hoverIndex === index;
            const lowerUrl = (ws.url || "").toLowerCase();
            const isPdf = lowerUrl.endsWith(".pdf") || /\.pdf($|\?)/.test(lowerUrl);
            const isImage = /\.(png|jpe?g|gif|webp)($|\?)/.test(lowerUrl);
            const isOffice = /\.(ppt|pptx|doc|docx)($|\?)/.test(lowerUrl);
            const isPreviewable = Boolean(ws.url) && (isPdf || isImage || isOffice);
            const officeViewerUrl = isOffice
              ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(ws.url)}`
              : null;
            return (
              <div key={`${ws.source}-${ws.path || ws.url || index}`} onMouseEnter={() => setHoverIndex(index)} onMouseLeave={() => setHoverIndex(-1)}>
                <Card title={ws.title} subtitle={ws.source === "storage" ? "📁 Archivo en storage" : ""}>
                  <div style={{ display: "grid", gap: 12 }}>
                    {ws.description && <div style={{ color: "#555", lineHeight: 1.6 }}>{ws.description}</div>}

                    {isPreviewable && (
                      <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E2E8F0", minHeight: 360 }}>
                        {isPdf ? (
                          <object
                            type="application/pdf"
                            data={ws.url}
                            width="100%"
                            height="500"
                            style={{ minHeight: 400 }}
                          >
                            <div style={{ padding: 20, textAlign: "center", color: "#64748B" }}>
                              No se puede previsualizar el PDF. Usa el botón para abrirlo.
                            </div>
                          </object>
                        ) : isImage ? (
                          <img src={ws.url} alt={ws.title} style={{ width: "100%", height: "auto", display: "block" }} />
                        ) : isOffice && officeViewerUrl ? (
                          <iframe
                            src={officeViewerUrl}
                            title={ws.title}
                            width="100%"
                            height="500"
                            style={{ border: "none", minHeight: 400 }}
                            allow="fullscreen; clipboard-write; encrypted-media; picture-in-picture"
                            allowFullScreen={false}
                          />
                        ) : null}
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        {ws.url ? (
                          <a href={ws.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", background: palette.main, color: "#fff", padding: "8px 14px", borderRadius: 10, fontWeight: 700 }}>📥 Abrir Worksheet</a>
                        ) : (
                          <div style={{ background: "#CBD5E1", color: "#fff", padding: "8px 14px", borderRadius: 10 }}>Worksheet no disponible</div>
                        )}
                      </div>

                      {ws.source === "content" && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ opacity: showActions ? 1 : 0, transform: showActions ? "translateX(0)" : "translateX(6px)", transition: ".18s" }}>
                            <IconButton title="Editar" onClick={() => { setEditingIndex(index); setDraftWorksheet({ url: ws.url || "", description: ws.description || "" }); }} color="#1D4ED8"><Pencil /></IconButton>
                          </div>

                          <div style={{ opacity: showActions ? 1 : 0, transform: showActions ? "translateX(0)" : "translateX(6px)", transition: ".18s" }}>
                            <IconButton title="Eliminar" onClick={() => handleDeleteWorksheet(index)} color="#B91C1C"><Trash /></IconButton>
                          </div>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div style={{ display: "grid", gap: 8 }}>
                        <input value={draftWorksheet.url} onChange={(e) => setDraftWorksheet((c) => ({ ...c, url: e.target.value }))} placeholder="https://" style={{ width: "100%", borderRadius: 12, border: "1px solid rgba(36,31,26,.12)", padding: "10px 12px" }} />
                        {draftWorksheet.url && !isValidUrl(draftWorksheet.url) && <div style={{ color: "#b91c1c" }}>Ingresa un enlace válido antes de guardar.</div>}
                        <textarea value={draftWorksheet.description} onChange={(e) => setDraftWorksheet((c) => ({ ...c, description: e.target.value }))} rows={2} placeholder="Descripción" style={{ width: "100%", borderRadius: 12, border: "1px solid rgba(36,31,26,.12)", padding: "10px 12px" }} />
                        <div style={{ display: "flex", gap: 8 }}>
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
        <Card title="Agregar worksheet por URL" subtitle="Sube un enlace de guía de trabajo.">
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontWeight: 700, color: "#334155" }}>Enlace URL</label>
              <input value={newWorksheet.url} onChange={(e) => setNewWorksheet((c) => ({ ...c, url: e.target.value }))} placeholder="https://" style={{ width: "100%", borderRadius: 12, border: "1px solid rgba(36,31,26,.16)", padding: "10px 12px" }} />
              {newWorksheet.url && !isValidUrl(newWorksheet.url) && <div style={{ color: "#b91c1c" }}>Ingresa un enlace válido.</div>}
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontWeight: 700, color: "#334155" }}>Descripción</label>
              <textarea value={newWorksheet.description} onChange={(e) => setNewWorksheet((c) => ({ ...c, description: e.target.value }))} rows={2} placeholder="Breve descripción" style={{ width: "100%", borderRadius: 12, border: "1px solid rgba(36,31,26,.16)", padding: "10px 12px" }} />
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button
                onClick={handleAddWorksheet}
                disabled={savingLink}
                style={{
                  background: savingLink ? "#94A3B8" : palette.main,
                  color: "#fff",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: 10,
                  cursor: savingLink ? "not-allowed" : "pointer",
                }}
              >
                {savingLink ? "Guardando..." : "+ Agregar enlace"}
              </button>
            </div>

            {newWorksheet.url && isValidUrl(newWorksheet.url) && (
              <div style={{ border: "1px solid rgba(37,99,235,.18)", borderRadius: 16, padding: 14, background: "rgba(59,130,246,.05)" }}>
                <div style={{ fontWeight: 700, marginBottom: 6, color: "#1e3a8a" }}>Vista previa del enlace</div>
                <a href={newWorksheet.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", color: "#1d4ed8", textDecoration: "underline" }}>{newWorksheet.url}</a>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
