"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import { useSession } from "@/app/providers/SessionProvider";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();
  const { refresh } = useSession();

  useEffect(() => {
    refresh();
    router.replace("/");
  }, [refresh, router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        color: "#475569",
      }}
    >
      Completando inicio de sesión...
    </div>
  );
}
