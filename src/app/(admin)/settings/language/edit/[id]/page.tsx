"use client";

import { useEffect, useCallback,useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

import Topbar from "@/components/Topbar";
import Icon from "@/components/Icon";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://139.59.1.109:3000";

export default function EditLanguagePage() {
  const router = useRouter();
  const params = useParams();

  const languageId = params.id;

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [form, setForm] = useState({
    name: "",
    native_name: "",
    iso_code: "",
  });



const fetchLanguage = useCallback(async () => {
  try {
    const res = await axios.get(
      `${API_URL}/api/language/get-language/${languageId}`
    );

    const language = res.data?.data;

    setForm({
      name: language?.name || "",
      native_name:
        language?.native_name || "",
      iso_code:
        language?.iso_code || "",
    });
  } catch (error: unknown) {
    console.error(error);

    alert(
      "Failed to load language"
    );
  } finally {
    setPageLoading(false);
  }
}, [languageId]);

useEffect(() => {
  fetchLanguage();
}, [fetchLanguage]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.put(
        `${API_URL}/api/language/update-language/${languageId}`,
        {
          name: form.name,
          native_name:
            form.native_name,
          iso_code:
            form.iso_code,
        }
      );

      if (res.data?.status) {
        alert(
          "Language updated successfully"
        );

        router.push(
          "/settings"
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update language"
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <>
        <Topbar placeholder="Loading..." />

        <main className="p-8 max-w-5xl mx-auto">
          <div className="bg-surface-container-lowest rounded-DEFAULT p-10 text-center">
            Loading language...
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Topbar placeholder="Edit language..." />

      <main className="p-8 max-w-5xl mx-auto w-full pb-32">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() =>
                router.back()
              }
              className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-primary-container transition-colors flex items-center justify-center"
            >
              <Icon
                name="arrow_back"
                size={20}
              />
            </button>

            <div>
              <h1 className="text-[28px] font-extrabold text-on-surface font-headline">
                Edit Language
              </h1>

              <p className="text-sm text-on-surface-variant mt-1">
                Update language
                information used
                throughout the app.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="bg-surface-container-lowest rounded-DEFAULT p-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-secondary-container text-on-secondary-container rounded-lg flex items-center justify-center">
              <Icon
                name="language"
                size={20}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold font-headline">
                Language Details
              </h2>

              <p className="text-sm text-on-surface-variant">
                Edit language
                metadata and ISO
                code.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                Language Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={
                  handleChange
                }
                required
                className="w-full bg-surface-container-low rounded-DEFAULT p-3 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                ISO Code
              </label>

              <input
                name="iso_code"
                value={
                  form.iso_code
                }
                onChange={
                  handleChange
                }
                required
                className="w-full bg-surface-container-low rounded-DEFAULT p-3 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                Native Name
              </label>

              <input
                name="native_name"
                value={
                  form.native_name
                }
                onChange={
                  handleChange
                }
                required
                className="w-full bg-surface-container-low rounded-DEFAULT p-3 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Preview Card */}
          <div className="mt-8">
            <h3 className="font-bold mb-3">
              Preview
            </h3>

            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-black text-sm uppercase">
                  {form.iso_code ||
                    "ISO"}
                </div>

                <div>
                  <h4 className="font-bold text-lg text-on-surface">
                    {form.name ||
                      "Language Name"}
                  </h4>

                  <p className="text-on-surface-variant">
                    {form.native_name ||
                      "Native Name"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Action Bar */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() =>
                router.back()
              }
              className="px-6 py-3 rounded-full font-bold border border-outline-variant"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 text-white rounded-full font-bold flex items-center gap-2"
              style={{
                background:
                  "linear-gradient(135deg,#a14200,#8d3900)",
              }}
            >
              <Icon
                name="save"
                size={18}
                className="text-white"
              />

              {loading
                ? "Updating..."
                : "Update Language"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}