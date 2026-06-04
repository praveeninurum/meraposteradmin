"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Icon from "@/components/Icon";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://139.59.1.109:3000";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${API_URL}/api/admin/login`,
        {
          email,
          password,
        }
      );
if (res.data.status) {
  // 🔐 Store token in COOKIE (required for middleware)
  document.cookie = `adminToken=${res.data.token}; path=/; max-age=86400; SameSite=Lax`;

  localStorage.setItem("adminToken", res.data.token);
  localStorage.setItem("admin", JSON.stringify(res.data.admin));

router.push("/");
}
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Login failed"
        );
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">

      <div className="w-full max-w-md">

        {/* Logo */}

        <div className="text-center mb-8">

          <div className="w-20 h-20 mx-auto rounded-full bg-primary-container flex items-center justify-center mb-4">

            <Icon
              name="admin_panel_settings"
              fill={1}
              size={36}
              className="text-on-primary-container"
            />

          </div>

          <h1 className="text-3xl font-extrabold text-on-surface font-headline">
            Admin Login
          </h1>

          <p className="text-on-surface-variant mt-2 text-sm">
            Sign in to access the admin dashboard
          </p>

        </div>

        {/* Card */}

        <div className="bg-surface-container-low rounded-DEFAULT p-8 border border-outline-variant/10 shadow-sm">

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Email */}

            <div>

              <label className="block text-sm font-semibold text-on-surface mb-2">
                Email Address
              </label>

              <div className="relative">

                <Icon
                  name="mail"
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                />

                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full pl-11 pr-4 py-3 rounded-DEFAULT bg-surface border border-outline-variant/20 text-on-surface outline-none focus:border-primary transition-all"
                  required
                />

              </div>

            </div>

            {/* Password */}

            <div>

              <label className="block text-sm font-semibold text-on-surface mb-2">
                Password
              </label>

              <div className="relative">

                <Icon
                  name="lock"
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                />

                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="w-full pl-11 pr-4 py-3 rounded-DEFAULT bg-surface border border-outline-variant/20 text-on-surface outline-none focus:border-primary transition-all"
                  required
                />

              </div>

            </div>

            {/* Error */}

            {error && (

              <div className="bg-error-container text-on-error-container px-4 py-3 rounded-DEFAULT text-sm font-medium">

                {error}

              </div>

            )}

            {/* Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-DEFAULT bg-primary text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >

              {loading ? (
                <>
                  <Icon
                    name="progress_activity"
                    size={18}
                  />
                  Signing In...
                </>
              ) : (
                <>
                  <Icon
                    name="login"
                    size={18}
                  />
                  Login
                </>
              )}

            </button>

          </form>

        </div>

        <p className="text-center text-xs text-on-surface-variant mt-6">
          Mera Poster Admin Panel
        </p>

      </div>

    </div>
  );
}