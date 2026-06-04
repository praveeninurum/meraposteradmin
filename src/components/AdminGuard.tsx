"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }

    setLoading(false);
  }, [router]);

  // 🔒 LOADING STATE (prevents UI flash)
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <p className="text-on-surface-variant text-sm">
          Checking authentication...
        </p>
      </div>
    );
  }

  // 🔒 NOT AUTHORIZED
  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}