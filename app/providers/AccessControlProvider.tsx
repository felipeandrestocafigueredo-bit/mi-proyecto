"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const ACCESS_CODE =
  process.env.NEXT_PUBLIC_ACCESS_CODE || "Celeste 2020";

export type AccessMode = "locked" | "visitor" | "teacher";

interface AccessControlContextValue {
  accessMode: AccessMode;
  editMode: boolean;
  teacherPanelOpen: boolean;
  minimized: boolean;
  setMinimized: (value: boolean) => void;
  accessCode: string;
  enterWithCode: (code: string) => { ok: boolean; message: string };
  enterTeacherMode: () => void;
  confirmTeacherAuth: () => void;
  cancelTeacherAuth: () => void;
  toggleEditMode: () => void;
  setTeacherPanelOpen: (open: boolean) => void;
  exitPlatform: () => void;
  exitTeacherMode: () => void;
}

const AccessControlContext = createContext<AccessControlContextValue>({
  accessMode: "locked",
  editMode: false,
  teacherPanelOpen: false,
  accessCode: ACCESS_CODE,
  enterWithCode: () => ({ ok: false, message: "" }),
  enterTeacherMode: () => {},
  confirmTeacherAuth: () => {},
  cancelTeacherAuth: () => {},
  toggleEditMode: () => {},
  setTeacherPanelOpen: () => {},
  minimized: false,
  setMinimized: () => {},
  exitPlatform: () => {},
  exitTeacherMode: () => {},
});

const STORAGE_KEY = "gamifica-access";

export function AccessControlProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [accessMode, setAccessMode] = useState<AccessMode>("locked");
  const [editMode, setEditMode] = useState(false);
  const [teacherPanelOpen, setTeacherPanelOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [pendingTeacherAuth, setPendingTeacherAuth] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          accessMode?: AccessMode;
          editMode?: boolean;
        };
        if (saved.accessMode) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe localStorage sync
          setAccessMode(saved.accessMode);
        }
        if (saved.editMode !== undefined) setEditMode(saved.editMode);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ accessMode, editMode, teacherPanelOpen, pendingTeacherAuth })
      );
    } catch {
      /* ignore */
    }
  }, [accessMode, editMode, teacherPanelOpen, pendingTeacherAuth]);

  function enterWithCode(code: string): { ok: boolean; message: string } {
    if (code.trim() === ACCESS_CODE) {
      setAccessMode("visitor");
      setEditMode(false);
      setTeacherPanelOpen(false);
      return { ok: true, message: "Acceso concedido." };
    }
    return { ok: false, message: "Código de acceso incorrecto." };
  }

  function enterTeacherMode() {
    setPendingTeacherAuth(true);
    setTeacherPanelOpen(true);
    setMinimized(false);
  }

  function confirmTeacherAuth() {
    setAccessMode("teacher");
    setEditMode(true);
    setPendingTeacherAuth(false);
    setTeacherPanelOpen(true);
    setMinimized(false);
  }

  function cancelTeacherAuth() {
    setPendingTeacherAuth(false);
    setTeacherPanelOpen(false);
    setMinimized(false);
  }

  function toggleEditMode() {
    setEditMode((prev) => !prev);
  }

  function exitTeacherMode() {
    setAccessMode("visitor");
    setEditMode(false);
    setTeacherPanelOpen(false);
    setMinimized(false);
  }

  function exitPlatform() {
    setAccessMode("locked");
    setEditMode(false);
    setTeacherPanelOpen(false);
    setMinimized(false);
  }

  return (
    <AccessControlContext.Provider
      value={{
        accessMode,
        editMode,
        teacherPanelOpen,
        minimized,
        setMinimized,
        accessCode: ACCESS_CODE,
        enterWithCode,
        enterTeacherMode,
        confirmTeacherAuth,
        cancelTeacherAuth,
        toggleEditMode,
        setTeacherPanelOpen,
        exitPlatform,
        exitTeacherMode,
      }}
    >
      {children}
    </AccessControlContext.Provider>
  );
}

export function useAccessControl() {
  return useContext(AccessControlContext);
}

export default AccessControlContext;
