"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lesson, PresentationItem } from "../../models/LessonModel";
import { getPodiumEntries } from "../../games/engine/playerProfile";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import { summarizeLessonProgress } from "../../utils/lessonProgress";
import { uploadSlide, getPublicUrl, addFileToLessonContent, removeFileFromLessonContent, deleteFile, findLessonByWeek, listFilesByWeek, getFileType, type StoredFile } from "../../services/storageService";
import { useAccessControl } from "@/app/providers/AccessControlProvider";
import { uploadAndPersistFile } from "@/app/actions/storageActions";

/* ==========================================================
   PRESENTATION TAB - Gamified Edition
   Pantalla principal de bienvenida de cada semana.
   Estilo gamificado para estudiantes.
 ========================================================== */

interface PresentationTabColors {
  dark?: string;
  mid?: string;
  main?: string;
  light?: string;
  text?: string;
}

interface PresentationTabProps {
  lesson?: Lesson | null;
  colors: PresentationTabColors;
  view?: string;
  onOpenSlides?: () => void;
  editMode?: boolean;
  gradeCode?: string;
  monthIndex?: number;
  weekIndex?: number;
  onFileUploaded?: (lesson: Lesson) => void;
}

export default function PresentationTab({
  lesson,
  colors,
  view = "presentation",
  onOpenSlides,
  editMode: propEditMode,
  gradeCode,
  monthIndex,
  weekIndex,
  onFileUploaded,
}: PresentationTabProps) {
  const { accessMode, editMode, toggleEditMode } = useAccessControl();
  const isTeacherMode = accessMode === "teacher" || propEditMode === true;

  const [uploadedSlides, setUploadedSlides] = useState<Array<{ file: File; name: string; type: string; preview: string | null }>>([]);
  const [slideUrl, setSlideUrl] = useState("");
  const [externalSlides, setExternalSlides] = useState<Array<string | PresentationItem>>(() => {
    const fromPresentation = Array.isArray(lesson?.presentation)
      ? lesson.presentation.filter(Boolean)
      : [];
    const fromSlides = Array.isArray(lesson?.slides)
      ? (lesson.slides as PresentationItem[]).filter(Boolean)
      : [];
    return [...fromPresentation, ...fromSlides];
  });
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);
  const [storageFiles, setStorageFiles] = useState<StoredFile[]>([]);
  const [uploadingToStorage, setUploadingToStorage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [editingStorageFile, setEditingStorageFile] = useState<StoredFile | null>(null);

  const resolvedGradeCode = gradeCode || lesson?.grade_code || lesson?.id?.split("-")[0] || "g67";
  const resolvedMonthIndex = monthIndex ?? lesson?.month_index ?? 0;
  const resolvedWeekIndex = weekIndex ?? lesson?.week_index ?? 1;

  useEffect(() => {
    if (!lesson?.id) return;

    let cancelled = false;
    void listFilesByWeek(resolvedGradeCode, resolvedMonthIndex, resolvedWeekIndex)
      .then((files) => {
        if (!cancelled) setStorageFiles(files.slides);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [lesson, resolvedGradeCode, resolvedMonthIndex, resolvedWeekIndex]);

  useEffect(() => {
    uploadedSlides.forEach((slide) => {
      if (slide.preview) {
        URL.revokeObjectURL(slide.preview);
      }
    });

    setUploadedSlides([]);
    setSlideUrl("");
    const fromPresentation = Array.isArray(lesson?.presentation)
      ? lesson.presentation.filter(Boolean)
      : [];
    const fromSlides = Array.isArray(lesson?.slides)
      ? (lesson.slides as PresentationItem[]).filter(Boolean)
      : [];
    setExternalSlides([...fromPresentation, ...fromSlides]);
    setSelectedSlideId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  async function fetchStorageFiles() {
    if (!lesson?.id) return;
    try {
      const files = await listFilesByWeek(resolvedGradeCode, resolvedMonthIndex, resolvedWeekIndex);
      setStorageFiles(files.slides);
    } catch {
      /* ignore */
    }
  }

  const supportedUploadTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  const embeddableTypes = [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const isEmbeddable = (type: string | null, url: string): boolean => {
    if (!url) return false;
    if (type && embeddableTypes.includes(type)) return true;

    const lowerUrl = url.toLowerCase();
    const ext = lowerUrl.split(".").pop() || "";
    if (["pdf", "ppt", "pptx", "doc", "docx"].includes(ext)) return true;
    if (/docs\.google\.com|drive\.google\.com|slideshare|officeapps\.live\.com|view\.google\.com/.test(lowerUrl)) {
      return true;
    }
    return false;
  };

  const resolveViewerUrl = (url: string): string | null => {
    if (!url) return null;

    const lowerUrl = url.toLowerCase();

    if (/\.pdf($|\?)/i.test(url)) {
      return url;
    }

    if (/\.png($|\?|\.)|\.jpg($|\?|\.)|\.jpeg($|\?|\.)|\.gif($|\?|\.)|\.webp($|\?|\.)/i.test(url)) {
      return url;
    }

    if (/docs\.google\.com\/presentation\//i.test(lowerUrl) || /docs\.google\.com\/document\//i.test(lowerUrl)) {
      return url.includes("/embed") ? url : `${url}${url.includes("?") ? "&" : "?"}embedded=true`;
    }

    if (/drive\.google\.com\/file\/d\//i.test(lowerUrl)) {
      const match = url.match(/\/file\/d\/([^/]+)/i);
      if (match?.[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }

    if (/\.pptx?($|\?)/i.test(url) || /\.docx?($|\?)/i.test(url)) {
      return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
    }

    if (/docs\.google\.com|drive\.google\.com|slideshare|officeapps\.live\.com/i.test(lowerUrl)) {
      return url;
    }

    return null;
  };

  const slideList = useMemo(() => {
    const external = externalSlides.flatMap((slide, index) => {
      const url = typeof slide === "string" ? slide.trim() : String(slide?.url ?? "").trim();
      if (!url) return [];

      const previewable = /\.(pdf|png|jpe?g|gif|ppt|pptx|doc|docx)$/i.test(url);

      return [{
        id: `external-${index}`,
        title:
          typeof slide === "string"
            ? slide
            : slide.title || slide.url || "External presentation",
        url,
        preview: previewable ? url : null,
        type: previewable
          ? (url.toLowerCase().endsWith(".pdf") ? "application/pdf" : /\.(ppt|pptx)$/i.test(url) ? "application/vnd.openxmlformats-officedocument.presentationml.presentation" : /\.(doc|docx)$/i.test(url) ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "image")
          : null,
        source: "external" as const,
      }];
    });

    const uploads = uploadedSlides.map((slide, index) => ({
      id: `upload-${index}`,
      title: slide.name,
      url: slide.preview,
      type: slide.type,
      preview: slide.preview,
      download: true as const,
      source: "upload" as const,
    }));

    const storage = storageFiles.map((file, index) => {
      const embeddable = embeddableTypes.includes(file.type) || isEmbeddable(file.type, file.url);
      const previewable =
        file.type === "application/pdf" ||
        file.type.startsWith("image/") ||
        embeddable;
      return {
        id: `storage-${index}`,
        title: file.name,
        url: file.url,
        type: file.type,
        preview: previewable ? file.url : null,
        source: "storage" as const,
      };
    });

    return [...external, ...uploads, ...storage] as Array<{ id: string; title: string; url: string; preview: string | null; type: string | null; source: "external" | "upload" | "storage"; download?: boolean }>;
  }, [externalSlides, uploadedSlides, storageFiles]);

  const currentSlide =
    slideList.find((slide) => slide.id === selectedSlideId) || slideList[0] || null;
  const currentSlideUrl = currentSlide?.preview || currentSlide?.url || "";
  const currentSlideViewerUrl = resolveViewerUrl(currentSlideUrl);
  const canPreviewCurrent =
    Boolean(currentSlide) &&
    (supportedUploadTypes.includes(currentSlide.type || "") ||
      currentSlide.type === "image" ||
      isEmbeddable(currentSlide.type, currentSlideUrl) ||
      Boolean(currentSlideViewerUrl));

  const podiumEntries = useMemo(() => getPodiumEntries(), []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (!slideList.length) {
        setSelectedSlideId(null);
        return;
      }

      const preferred = slideList.find((slide) => {
        const url = slide.url || slide.preview || "";
        return Boolean(url) && (slide.type !== null || /\.(pdf|png|jpe?g|gif|ppt|pptx|doc|docx)/i.test(url));
      }) || slideList[0];

      if (!selectedSlideId || !slideList.some((slide) => slide.id === selectedSlideId)) {
        setSelectedSlideId(preferred.id);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [slideList, selectedSlideId]);

  useEffect(() => {
    return () => {
      uploadedSlides.forEach((slide) => {
        if (slide.preview) {
          URL.revokeObjectURL(slide.preview);
        }
      });
    };
  }, [uploadedSlides]);

  /* ======================================================
     Validación
  ====================================================== */

  if (!lesson) {
    return (
      <EmptyState
        text="No information available for this week."
      />
    );
  }

  /* ======================================================
     Paleta gamificada - colores oscuros con texto blanco
  ====================================================== */

  const palette = {
    dark: colors?.dark || "#0F172A",
    mid: colors?.mid || "#1E3A8A",
    main: colors?.main || "#2563EB",
    light: colors?.light || "#EFF6FF",
    text: colors?.text || "#FFFFFF",
    accent: "#FFD166",
    success: "#22C55E",
    cardDark: "#1E293B",
  };

  /* ======================================================
     Información dinámica
  ====================================================== */

  const lessonProgress = summarizeLessonProgress(lesson);
  const progress = lesson.progress ?? lessonProgress.progress;

  const presentation = lesson.presentation?.[0];
  const objective =
    presentation?.objective ||
    `Master "${lesson.topic || lesson.tema || "English"}" through interactive vocabulary, games, and activities.`;
  const rewards = presentation?.rewards ?? [
    { emoji: "⭐", title: "+100 XP" },
    { emoji: "🏆", title: "Weekly Badge" },
    { emoji: "🎯", title: "New Achievement" },
  ];
  const tips = presentation?.tips ?? [
    "Practice the vocabulary out loud",
    "Complete every game to earn bonus XP",
    "Review this week's challenge daily",
  ];

  function handlePresentationUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    const nextSlides = files.map((file) => ({
      file,
      name: file.name,
      type: file.type,
      preview: supportedUploadTypes.includes(file.type)
        ? URL.createObjectURL(file)
        : null,
    }));

    setUploadedSlides((current) => {
      current.forEach((slide) => {
        if (slide.preview) {
          URL.revokeObjectURL(slide.preview);
        }
      });
      return [...current, ...nextSlides];
    });
  }

  function handleSlideUrlAdd() {
    const value = slideUrl.trim();

    if (!value) {
      return;
    }

    setExternalSlides((current) => [...current, value]);
    setSlideUrl("");
  }

  async function handleUploadToStorage(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length || !lesson) return;

    setUploadingToStorage(true);
    setUploadError("");
    try {
      for (const file of files) {
        // No llamamos findLessonByWeek desde el cliente (puede fallar por DNS).
        // El server action resuelve el lesson_id internamente.
        const result = await uploadAndPersistFile(null, resolvedGradeCode, resolvedMonthIndex, resolvedWeekIndex, "slides", file);
        if (result.error || !result.data) {
          throw new Error(result.error || `No se pudo guardar el archivo "${file.name}".`);
        }
        const { normalizeLesson } = await import("../../models/LessonModel");
        onFileUploaded?.(normalizeLesson(result.data));
      }
      await fetchStorageFiles();
    } catch (err) {
      setUploadError(`Error inesperado: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setUploadingToStorage(false);
      event.target.value = "";
    }
  }

  async function handleReplaceSlide(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const oldFile = editingStorageFile;
    event.target.value = "";
    if (!file || !oldFile || !lesson) return;

    setUploadingToStorage(true);
    setUploadError("");
    try {
      const uploaded = await uploadSlide({
        file,
        gradeCode: resolvedGradeCode,
        monthIndex: resolvedMonthIndex,
        weekIndex: resolvedWeekIndex,
      });

      if (uploaded.error || !uploaded.path) {
        setUploadError(`Error reemplazando ${oldFile.name}: ${uploaded.error ?? "No se pudo subir el archivo."}`);
        return;
      }

      const lessonData = await findLessonByWeek(resolvedGradeCode, resolvedMonthIndex, resolvedWeekIndex);
      if (!lessonData?.lesson_id) {
        setUploadError("No se encontró la lección para reemplazar el slide.");
        await deleteFile(uploaded.path);
        return;
      }

      const newFile: StoredFile = {
        name: file.name,
        path: uploaded.path,
        url: uploaded.url || await getPublicUrl(uploaded.path) || "",
        type: file.type || getFileType(file.name),
      };
      const added = await addFileToLessonContent(lessonData.lesson_id, "slides", newFile);
      if (!added) {
        setUploadError("No se pudo actualizar la lección con el nuevo slide.");
        await deleteFile(uploaded.path);
        return;
      }

      const removed = await removeFileFromLessonContent(lessonData.lesson_id, "slides", oldFile.path);
      if (!removed || !(await deleteFile(oldFile.path))) {
        setUploadError("El slide nuevo se guardó, pero no se pudo retirar el anterior.");
        return;
      }

      setEditingStorageFile(null);
      await fetchStorageFiles();
    } catch (error) {
      setUploadError(`Error reemplazando el slide: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setUploadingToStorage(false);
    }
  }

  async function handleDeleteSlide(file: StoredFile) {
    if (!window.confirm(`¿Eliminar "${file.name.replace(/^\d+-/, "")}"? Esta acción no se puede deshacer.`)) return;

    try {
      const lessonData = await findLessonByWeek(resolvedGradeCode, resolvedMonthIndex, resolvedWeekIndex);
      if (lessonData?.lesson_id && !(await removeFileFromLessonContent(lessonData.lesson_id, "slides", file.path))) {
        setUploadError("No se pudo actualizar la lección.");
        return;
      }
      if (!(await deleteFile(file.path))) {
        setUploadError("No se pudo eliminar el archivo del almacenamiento.");
        return;
      }
      setSelectedSlideId(null);
      await fetchStorageFiles();
    } catch (error) {
      setUploadError(`Error eliminando el slide: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  function renderSlidePreview() {
    if (!currentSlide) {
      return (
        <div
          style={{
            minHeight: 520,
            borderRadius: 20,
            border: "2px dashed rgba(255,255,255,.2)",
            display: "grid",
            placeItems: "center",
            padding: 24,
            color: "rgba(255,255,255,.8)",
            textAlign: "center",
            background: "rgba(0,0,0,.2)",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
            📁 No presentation loaded
          </div>
          <div>
            Use the button to upload a PDF or image,
            or paste a slides URL to project it here.
          </div>
        </div>
      );
    }

    if (canPreviewCurrent) {
      const previewUrl = currentSlide.preview || currentSlide.url;
      const viewerUrl = resolveViewerUrl(previewUrl || "");
      const isPdf = (currentSlide.type === "application/pdf") || /\.pdf($|\?)/i.test(previewUrl || "");
      const isImage = Boolean(currentSlide.type && currentSlide.type.startsWith("image/")) || /\.(png|jpe?g|gif|webp)($|\?)/i.test(previewUrl || "");
      const isOfficeFile = /\.(ppt|pptx|doc|docx)($|\?)/i.test(previewUrl || "") || [
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(currentSlide.type || "");

      if (isPdf) {
        return (
          <div
            style={{
              minHeight: 720,
              borderRadius: 24,
              overflow: "hidden",
              border: "2px solid rgba(255,255,255,.15)",
              background: palette.cardDark,
              boxShadow: "inset 0 2px 4px rgba(0,0,0,.3)",
            }}
          >
            <object
              type="application/pdf"
              data={previewUrl}
              width="100%"
              height="720"
              style={{ minHeight: 720 }}
            >
              <div
                style={{
                  padding: 22,
                  color: "rgba(255,255,255,.8)",
                }}
              >
                No se pudo previsualizar este PDF.
              </div>
            </object>
          </div>
        );
      }

      if (viewerUrl && (isOfficeFile || /docs\.google\.com|drive\.google\.com|slideshare|officeapps\.live\.com/i.test(previewUrl || "") || isEmbeddable(currentSlide.type, previewUrl || ""))) {
        return (
          <div
            style={{
              minHeight: 720,
              borderRadius: 24,
              overflow: "hidden",
              border: "2px solid rgba(255,255,255,.15)",
              background: palette.cardDark,
              boxShadow: "inset 0 2px 4px rgba(0,0,0,.3)",
            }}
          >
            <iframe
              src={viewerUrl}
              title={currentSlide.title}
              width="100%"
              height="720"
              style={{ border: "none" }}
              allow="fullscreen; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen={false}
            />
            {isOfficeFile && previewUrl && (
              <div style={{ padding: "12px 16px", background: "rgba(0,0,0,.4)", borderTop: "1px solid rgba(255,255,255,.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <span style={{ color: "rgba(255,255,255,.7)", fontSize: 13 }}>
                  📊 Presentación cargada — si no se ve, usa el botón para abrirla en una pestaña nueva.
                </span>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "8px 14px",
                    borderRadius: 10,
                    background: palette.accent,
                    color: palette.cardDark,
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  📥 Abrir archivo
                </a>
              </div>
            )}
          </div>
        );
      }

      if (isImage) {
        return (
          <div
            style={{
              minHeight: 720,
              borderRadius: 24,
              overflow: "hidden",
              border: "2px solid rgba(255,255,255,.15)",
              background: palette.cardDark,
              boxShadow: "inset 0 2px 4px rgba(0,0,0,.3)",
            }}
          >
            <img
              src={previewUrl || currentSlide.url}
              alt={currentSlide.title}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        );
      }

      return (
        <div
          style={{
            minHeight: 520,
            borderRadius: 20,
            border: "2px dashed rgba(255,255,255,.2)",
            display: "grid",
            placeItems: "center",
            padding: 24,
            color: "rgba(255,255,255,.8)",
            textAlign: "center",
            background: "rgba(0,0,0,.2)",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
            📄 Presentation available for download
          </div>
          <div>{currentSlide.title}</div>
          <div style={{ marginTop: 12 }}>
            This resource cannot be displayed within the application.
          </div>
          {currentSlide.url && (
            <a
              href={currentSlide.url}
              download
              style={{
                marginTop: 14,
                display: "inline-flex",
                padding: "10px 16px",
                borderRadius: 14,
                background: palette.accent,
                color: palette.cardDark,
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Download file
            </a>
          )}
        </div>
      );
    }

    return (
      <div
        style={{
          minHeight: 520,
          borderRadius: 20,
          border: "2px dashed rgba(255,255,255,.2)",
          display: "grid",
          placeItems: "center",
          padding: 24,
          color: "rgba(255,255,255,.8)",
          textAlign: "center",
          background: "rgba(0,0,0,.2)",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
          📄 Presentation available for download
        </div>
        <div>{currentSlide.title}</div>
        <div style={{ marginTop: 12 }}>
          This resource cannot be displayed within the application.
        </div>
        {currentSlide.download && currentSlide.url && (
          <a
            href={currentSlide.url}
            download
            style={{
              marginTop: 14,
              display: "inline-flex",
              padding: "10px 16px",
              borderRadius: 14,
              background: palette.accent,
              color: palette.cardDark,
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Download file
          </a>
        )}
      </div>
    );
  }

  function renderSlidesCard(title = "📽️ Slides") {
    return (
      <Card title={title}>
        <div
          style={{
            display: "grid",
            gap: 24,
          }}
        >
          {renderSlidePreview()}

          {slideList.length > 0 && (
            <div
              style={{
                display: "grid",
                gap: 10,
              }}
            >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gap: 6,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 16,
                          color: "#E2E8F0",
                          fontWeight: 700,
                        }}
                      >
                        Available slides ({slideList.length})
                      </div>

                      <div style={{ color: "rgba(255,255,255,.6)", fontSize: 14 }}>
                        Selecciona uno para usarlo como vista principal.
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {isTeacherMode && (
                      <button
                        type="button"
                        title={editMode ? "Ocultar edición" : "Mostrar edición"}
                        onClick={toggleEditMode}
                        style={{ border: "1px solid #CBD5E1", borderRadius: 10, padding: "8px 12px", background: editMode ? "#DBEAFE" : "#fff", color: "#1D4ED8", cursor: "pointer", fontWeight: 700 }}
                      >
                        {editMode ? "✕ Ocultar edición" : "✏️ Editar slides"}
                      </button>
                    )}
                    {currentSlide?.url && (() => {
                      const isPpt = currentSlide.type === "application/vnd.ms-powerpoint" ||
                        currentSlide.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
                        (currentSlide.url || "").toLowerCase().match(/\.(ppt|pptx)$/);
                      const isDoc = currentSlide.type === "application/msword" ||
                        currentSlide.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                        (currentSlide.url || "").toLowerCase().match(/\.(doc|docx)$/);
                      const getViewerUrl = () => {
                        if (!currentSlide.url) return "";
                        const encoded = encodeURIComponent(currentSlide.url);
                        if (isPpt || isDoc) {
                          return `https://view.officeapps.live.com/op/embed.aspx?src=${encoded}`;
                        }
                        if (currentSlide.type === "application/pdf") {
                          return `https://docs.google.com/gview?url=${encoded}&embedded=true`;
                        }
                        return currentSlide.url;
                      };
                      return (
                        <button
                          type="button"
                          onClick={() => {
                            window.open(getViewerUrl(), "_blank", "noreferrer");
                          }}
                          style={{
                            border: "none",
                            borderRadius: 14,
                            padding: "14px 22px",
                            background: palette.accent,
                            color: palette.cardDark,
                            cursor: "pointer",
                            fontWeight: 700,
                            fontSize: 14,
                            transition: "transform .3s ease, box-shadow .3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          📽️ View slide
                        </button>
                      );
                    })()}
                    </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {slideList.map((slide) => (
                  <div
                    key={slide.id}
                    style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                  >
                  <button
                    type="button"
                    onClick={() => setSelectedSlideId(slide.id || "")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      padding: "12px 16px",
                      borderRadius: 999,
                      border:
                        selectedSlideId === slide.id
                          ? `2px solid ${palette.accent}`
                          : "1px solid rgba(255,255,255,.15)",
                      background:
                        selectedSlideId === slide.id
                          ? palette.mid
                          : "rgba(255,255,255,.08)",
                      color: selectedSlideId === slide.id ? "#fff" : "rgba(255,255,255,.9)",
                      textAlign: "left",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 14,
                      transition: "all .3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedSlideId !== slide.id) {
                        e.currentTarget.style.background = "rgba(255,255,255,.12)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedSlideId !== slide.id) {
                        e.currentTarget.style.background = "rgba(255,255,255,.08)";
                      }
                    }}
                  >
                    <span>{slide.title}</span>

                    <span style={{ opacity: 0.7, fontSize: 14 }}>
                      {slide.download ? "🔽" : "↗"}
                    </span>
                  </button>
                  {editMode && slide.source === "storage" && (() => {
                    const storageFile = storageFiles[Number(slide.id.replace("storage-", ""))];
                    if (!storageFile) return null;
                    return (
                      <span style={{ display: "inline-flex", gap: 2, background: "#fff", borderRadius: 999 }}>
                        <button type="button" title="Reemplazar slide" onClick={() => { setEditingStorageFile(storageFile); document.getElementById("slide-replace-input")?.click(); }} style={{ border: "none", background: "transparent", color: "#1D4ED8", cursor: "pointer", padding: 6 }}>✏️</button>
                        <button type="button" title="Eliminar slide" onClick={() => void handleDeleteSlide(storageFile)} style={{ border: "none", background: "transparent", color: "#B91C1C", cursor: "pointer", padding: 6 }}>🗑️</button>
                      </span>
                    );
                  })()}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </Card>
    );
  }

  if (view === "slides") {
    return (
      <div
        style={{
          display: "grid",
          gap: 22,
          position: "relative",
        }}
      >
        {renderSlidesCard("📽️ Slides")}

        {/* Hidden file input for bottom upload button */}
        {isTeacherMode && (
          <input
            id="slide-replace-input"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.gif,.ppt,.pptx"
            onChange={handleReplaceSlide}
            style={{ display: "none" }}
          />
        )}
        {isTeacherMode && (
          <input
            id="slides-upload-bottom"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.gif,.ppt,.pptx"
            multiple
            onChange={handleUploadToStorage}
            style={{ display: "none" }}
          />
        )}

        {/* Bottom-right upload button */}
        {isTeacherMode && (
        <div
          style={{
            position: "fixed",
            right: 24,
            bottom: 24,
            zIndex: 9999,
          }}
        >
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("slides-upload-bottom");
              if (el) el.click();
            }}
            disabled={uploadingToStorage}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "16px 22px",
              background: uploadingToStorage ? "#94A3B8" : palette.accent,
              color: palette.cardDark,
              cursor: uploadingToStorage ? "not-allowed" : "pointer",
              fontWeight: 800,
              fontSize: 15,
              boxShadow: "0 8px 24px rgba(0,0,0,.3)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              transition: "transform .3s ease, box-shadow .3s ease",
            }}
            onMouseEnter={(e) => {
              if (!uploadingToStorage) {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.03)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.3)";
            }}
          >
            <span role="img" aria-label="upload">📤</span>
            <span>{uploadingToStorage ? "Subiendo..." : "Upload slides"}</span>
          </button>
         </div>
        )}

        {uploadError && (
          <div style={{
            position: "fixed",
            bottom: 80,
            right: 24,
            zIndex: 9998,
            color: "#fff",
            fontSize: 13,
            background: "rgba(220,38,38,.9)",
            borderRadius: 8,
            padding: "10px 14px",
            maxWidth: 320,
            boxShadow: "0 4px 14px rgba(0,0,0,.3)",
          }}>
            {uploadError}
          </div>
        )}
      </div>
    );
  }

  return (

    <div
      style={{
        display: "grid",
        gap: 22,
      }}
    >

      {/* ==============================================
         Mision semanal - Gamificada
      ============================================== */}

      <MissionCard
        lesson={lesson}
        palette={palette}
        progress={progress}
      />

      {/* ==============================================
         Estadisticas gamificadas
      ============================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 14,
        }}
      >

        <GameInfoBox
          emoji="📚"
          title="Words"
          value={lesson.vocab?.length || 0}
          palette={palette}
        />

        <GameInfoBox
          emoji="🎮"
          title="Games"
          value={lessonProgress.totalGames}
          palette={palette}
        />

        <GameInfoBox
          emoji="⭐"
          title="XP"
          value={lessonProgress.totalXP}
          palette={palette}
        />

        <GameInfoBox
          emoji="🏆"
          title="Score"
          value={lessonProgress.maxScore}
          palette={palette}
        />

      </div>

      {podiumEntries.length > 0 && (
        <Card title="🏆 Podio del curso" titleColor="#0F172A" style={{ background: "linear-gradient(145deg, #FFFDF7, #EFF6FF)", border: "3px solid rgba(59,130,246,.12)", boxShadow: "0 18px 40px rgba(30,41,59,.08)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14 }}>
            {podiumEntries.map((entry, index) => (
              <div key={`${entry.name}-${entry.gameId}-${index}`} style={{ position: "relative", padding: 18, borderRadius: 22, background: index === 0 ? "linear-gradient(135deg,#FDE68A,#F59E0B)" : index === 1 ? "linear-gradient(135deg,#E2E8F0,#94A3B8)" : "linear-gradient(135deg,#FECACA,#FB923C)", color: "#0F172A", boxShadow: "0 16px 32px rgba(15,23,42,.12)", border: "1px solid rgba(15,23,42,.06)" }}>
                <div style={{ position: "absolute", top: 12, right: 12, fontSize: 12, fontWeight: 900, background: "rgba(255,255,255,.45)", borderRadius: 999, padding: "4px 8px" }}>{index === 0 ? "1º" : index === 1 ? "2º" : "3º"}</div>
                <div style={{ fontSize: 42, marginTop: 14 }}>{entry.avatar}</div>
                <div style={{ fontWeight: 900, marginTop: 10, fontSize: 18 }}>{entry.name}</div>
                <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>{entry.title}</div>
                <div style={{ fontWeight: 900, marginTop: 12, fontSize: 24 }}>{entry.score} pts</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{entry.percentage}% precisión</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ==============================================
         Resultados de juegos
      ============================================== */}

      {lessonProgress.gameSummaries.length > 0 && (
        <Card title="🏅 Game Results" titleColor="#0F172A" style={{ background: "linear-gradient(145deg, #FFFFFF, #F1F5F9)", border: "3px solid #E2E8F0" }}>
          <div
            style={{
              display: "grid",
              gap: 12,
            }}
          >
            {lessonProgress.gameSummaries.map((game) => (
              <div
                key={game.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 14,
                  alignItems: "center",
                  padding: "14px 16px",
                  borderRadius: 16,
                  background: "#F8FAFC",
                  border: "2px solid rgba(0,0,0,.08)",
                  transition: "all .3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FFFFFF";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#F8FAFC";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "#0F172A" }}>{game.title}</div>
                  <div style={{ color: "#64748B", fontSize: 13 }}>
                    {game.category} • {game.completed ? "Completed" : "Pending"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: "#2563EB" }}>{game.score} pts</div>
                  <div style={{ color: "#64748B", fontSize: 13 }}>
                    {game.xp} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {objective && (
        <Card title="🎯 Objective" titleColor="#FFFFFF" style={{ background: "linear-gradient(145deg, #4F46E5, #7C3AED 55%, #DB2777)", border: "3px solid #A78BFA", boxShadow: "0 10px 26px rgba(124,58,237,.25)" }}>
          <p
            style={{
              margin: 0,
              lineHeight: 1.8,
              color: "#FFFFFF",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {objective}
          </p>
        </Card>
      )}

      {/* ==============================================
         Recompensas gamificadas
      ============================================== */}

      {rewards && rewards.length > 0 && (
        <Card title="🏆 Rewards" titleColor="#FFFFFF" style={{ background: "linear-gradient(145deg, #F97316, #EC4899 55%, #8B5CF6)", border: "3px solid #FDBA74", boxShadow: "0 10px 26px rgba(236,72,153,.22)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 14,
            }}
          >
            {rewards.map((reward, index) => (
              <GameRewardCard
                key={index}
                emoji={reward.emoji}
                title={reward.title}
                palette={palette}
              />
            ))}
          </div>
        </Card>
      )}

      {/* ==============================================
         Consejos gamificados
      ============================================== */}

      {tips && tips.length > 0 && (
        <Card title="💡 Pro Tips" titleColor="#FFFFFF" style={{ background: "linear-gradient(145deg, #0891B2, #0D9488 55%, #16A34A)", border: "3px solid #67E8F9", boxShadow: "0 10px 26px rgba(13,148,136,.22)" }}>
          <ul
            style={{
              margin: 0,
              paddingLeft: 20,
              lineHeight: 2,
            }}
          >
            {
              tips.map((tip, index) => (
                <li key={index} style={{ color: "#FFFFFF", fontWeight: 600 }}>
                  {tip}
                </li>
              ))
            }
          </ul>
        </Card>
      )}

      {/* ==============================================
          Subida de diapositivas - Vista presentation
          ============================================== */}


    </div>

  );

}/* ==========================================================
   MISSION CARD - Gamificada
 ========================================================== */

function MissionCard({
  lesson,
  palette,
  progress,
}: {
  lesson: Lesson;
  palette: Record<string, string>;
  progress: number;
}) {

  return (
    <Card
      style={{
        background: `linear-gradient(135deg,
          ${palette.dark},
          ${palette.mid},
          ${palette.dark})`,
        backgroundSize: "200% 200%",
        animation: "gradientShift 8s ease infinite",
        color: "#fff",
        border: "1px solid rgba(255,255,255,.1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      {/* Decorative background elements */}
      <div style={{
        position: "absolute",
        top: -20,
        right: -20,
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: "rgba(255,255,255,.05)",
        animation: "float 6s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        bottom: -30,
        left: -30,
        width: 100,
        height: 100,
        borderRadius: "50%",
        background: "rgba(255,255,255,.03)",
        animation: "float 8s ease-in-out infinite reverse",
      }} />

      <div
        style={{
          display: "grid",
          gap: 20,
          position: "relative",
          zIndex: 1,
        }}
      >

        <div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,.15)",
              fontSize: 12,
              letterSpacing: 1.5,
              opacity: .95,
              textTransform: "uppercase",
              fontWeight: 700,
              backdropFilter: "blur(4px)",
              justifySelf: "center",
            }}
          >
            🎮 WEEKLY MISSION
          </div>

          <h2
            style={{
              margin: "10px 0",
              fontFamily: "Fredoka, sans-serif",
              fontSize: 36,
              color: palette.text || "#fff",
              lineHeight: 1.1,
            }}
          >
            {lesson.topic}
          </h2>

          <div
            style={{
              opacity: .9,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            📅 {lesson.fecha}
          </div>
        </div>

        {/* Barra de progreso gamificada */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                opacity: .95,
              }}
            >
              Weekly Progress
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                background: "rgba(255,255,255,.2)",
                padding: "2px 10px",
                borderRadius: 999,
              }}
            >
              {progress}%
            </div>
          </div>

          <div
            style={{
              height: 18,
              borderRadius: 999,
              overflow: "hidden",
              background: "rgba(255,255,255,.2)",
              position: "relative",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${palette.success}, #4ADE80)`,
                borderRadius: 999,
                transition: "width 1.2s cubic-bezier(.4,0,.2,1)",
                position: "relative",
                boxShadow: "0 0 12px rgba(34,197,94,.5)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s linear infinite",
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 13,
              opacity: .9,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>🎯</span> Complete all activities to unlock games & earn XP
          </div>
        </div>

        {/* Indicador de nivel */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 16px",
            borderRadius: 16,
            background: "rgba(255,255,255,.1)",
            border: "1px solid rgba(255,255,255,.15)",
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              background: "linear-gradient(135deg, #FFD166, #FFA500)",
              display: "grid",
              placeItems: "center",
              fontSize: 22,
              boxShadow: "0 4px 12px rgba(255,209,102,.4)",
              animation: "bounce 2s ease-in-out infinite",
            }}
          >
            ⭐
          </div>
          <div>
            <div style={{ fontSize: 11, opacity: .8, textTransform: "uppercase", letterSpacing: 1 }}>Level</div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>3</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 11, opacity: .8, textTransform: "uppercase", letterSpacing: 1 }}>Rank</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>🥇 Gold</div>
          </div>
        </div>

      </div>

    </Card>

  );

}

/* ==========================================================
   GAME INFO BOX - Mario Bros Style
 ========================================================== */

const GAME_COLORS: Record<string, { bg: string; text: string; shadow: string; border: string }> = {
  Words: { bg: "#FF4757", text: "#FFFFFF", shadow: "rgba(255,71,87,.55)", border: "#FFFFFF" },
  Games: { bg: "#1E90FF", text: "#FFFFFF", shadow: "rgba(30,144,255,.55)", border: "#FFFFFF" },
  XP: { bg: "#FFA502", text: "#1A202C", shadow: "rgba(255,165,2,.55)", border: "#FFFFFF" },
  Score: { bg: "#2ED573", text: "#1A202C", shadow: "rgba(46,213,115,.55)", border: "#FFFFFF" },
};

function GameInfoBox({
  emoji,
  title,
  value,
  palette,
}: {
  emoji: string;
  title: string;
  value: number | string;
  palette: Record<string, string>;
}) {
  const theme = GAME_COLORS[title] || { bg: palette.cardDark, text: "#FFFFFF", shadow: "rgba(0,0,0,.3)", border: "#FFFFFF" };

  return (
    <div
      style={{
        borderRadius: 20,
        background: theme.bg,
        color: theme.text,
        border: `4px solid ${theme.border}`,
        boxShadow: `8px 8px 0px ${theme.shadow}, inset 0 3px 0px rgba(255,255,255,.3)`,
        textAlign: "center",
        padding: "22px 14px",
        transition: "transform .4s cubic-bezier(.4,0,.2,1), box-shadow .4s ease",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px) rotate(-2deg)";
        e.currentTarget.style.boxShadow = `12px 16px 0px ${theme.shadow}, inset 0 3px 0px rgba(255,255,255,.4)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) rotate(0deg)";
        e.currentTarget.style.boxShadow = `8px 8px 0px ${theme.shadow}, inset 0 3px 0px rgba(255,255,255,.3)`;
      }}
    >
      <div
        style={{
          fontSize: 48,
          animation: "bounce 2.5s ease-in-out infinite",
          display: "inline-block",
          filter: "drop-shadow(3px 5px 0px rgba(0,0,0,.25))",
        }}
      >
        {emoji}
      </div>

      <div
        style={{
          marginTop: 12,
          fontWeight: 800,
          fontSize: 14,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          textShadow: "2px 2px 0px rgba(0,0,0,.25)",
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 38,
          fontWeight: 900,
          fontFamily: "Fredoka, sans-serif",
          textShadow: "4px 4px 0px rgba(0,0,0,.3)",
        }}
      >
        {value}
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 32,
          height: 32,
          background: "rgba(255,255,255,.25)",
          borderBottomLeftRadius: 16,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 6,
          left: 8,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "rgba(255,255,255,.2)",
        }}
      />
    </div>
  );
}

/* ==========================================================
   GAME REWARD CARD - Gamificada
 ========================================================== */

function GameRewardCard({
  emoji,
  title,
  palette,
}: {
  emoji: string;
  title: string;
  palette: Record<string, string>;
}) {

  return (
    <div
      style={{
        border: "2px solid rgba(255,255,255,.2)",
        borderRadius: 16,
        padding: 20,
        textAlign: "center",
        background: "linear-gradient(145deg, rgba(255,255,255,.12), rgba(255,255,255,.05))",
        transition: "all .4s ease",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
        e.currentTarget.style.background = "linear-gradient(145deg, rgba(255,255,255,.18), rgba(255,255,255,.08))";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.background = "linear-gradient(145deg, rgba(255,255,255,.12), rgba(255,255,255,.05))";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "-100%",
          width: "100%",
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent)",
          transition: "left .6s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.left = "100%";
        }}
      />

      <div
        style={{
          fontSize: 40,
          display: "inline-block",
          animation: "pulse 2.5s ease-in-out infinite",
          position: "relative",
        }}
      >
        {emoji}
      </div>

      <div
        style={{
          marginTop: 12,
          fontWeight: 700,
          color: "#fff",
          fontSize: 14,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 6,
          fontSize: 11,
          color: "rgba(255,255,255,.6)",
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        UNLOCKED
      </div>
    </div>
  );

}
