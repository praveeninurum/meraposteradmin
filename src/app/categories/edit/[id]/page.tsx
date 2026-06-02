"use client";

import { useCallback,useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import Topbar from "@/components/Topbar";
import Icon from "@/components/Icon";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();

  // SAFE PARAM ID
  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  // =========================
  // STATES
  // =========================
  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] = useState({
    category_name: "",
    lang_type: "",
    is_trending: 0,
  });

  // OLD / NEW IMAGE PREVIEW
  const [preview, setPreview] =
    useState("");

  // IMAGE FILE
  const [iconFile, setIconFile] =
    useState<File | null>(null);

  // =========================
  // FETCH CATEGORY
  // =========================
  const fetchCategory = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:3000/api/categories/${id}`
      );

      console.log(
        "GET CATEGORY RESPONSE =>",
        response.data
      );

      const data =
        response?.data?.data;

      if (!data) return;

      // AUTO FILL EXISTING VALUES
      setForm({
        category_name:
          data.category_name || "",

        lang_type:
          data.lang_type || "",

        is_trending:
          Number(
            data.is_trending
          ) || 0,
      });

      // EXISTING IMAGE
      setPreview(
        data.icon_url || ""
      );

    } catch (error:unknown) {
      console.error(
        "Fetch Category Error =>",
        error
      );
    } finally {
      setLoading(false);
    }
  },[id]);

  // =========================
  // PAGE LOAD
  // =========================
  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id,fetchCategory]);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "is_trending"
          ? Number(value)
          : value,
    }));
  };

  // =========================
  // IMAGE CHANGE
  // =========================
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (file) {
      setIconFile(file);

      // LIVE PREVIEW
      setPreview(
        URL.createObjectURL(file)
      );
    }
  };

  // =========================
  // UPDATE CATEGORY
  // =========================
  const handleUpdate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData =
        new FormData();

      formData.append(
        "category_name",
        form.category_name
      );

      formData.append(
        "lang_type",
        form.lang_type
      );

      formData.append(
        "is_trending",
        String(
          form.is_trending
        )
      );

      // IMAGE
      if (iconFile) {
        formData.append(
          "icon_url",
          iconFile
        );
      }

      const response =
        await axios.put(
          `http://localhost:3000/api/categories/${id}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      console.log(
        "UPDATE RESPONSE =>",
        response.data
      );

      if (
        response.data?.status ===
        "success"
      ) {
        alert(
          "Category updated successfully"
        );

        router.push(
          "/categories"
        );
      }

    } catch (error:unknown) {
      console.error(
        "Update Error =>",
        error
      );

      alert(
        "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Topbar placeholder="Edit category..." />

      <main className="p-8 max-w-5xl mx-auto w-full space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight font-headline">
              Edit{" "}
              <em className="text-primary not-italic italic">
                Category
              </em>
            </h2>

            <p className="text-on-surface-variant text-sm mt-1">
              Update category details
              dynamically.
            </p>
          </div>

          <button
            onClick={() =>
              router.push(
                "/categories"
              )
            }
            className="px-5 py-2 rounded-full border border-outline-variant/20 hover:bg-surface-container transition-all flex items-center gap-2"
          >
            <Icon
              name="arrow_back"
              size={18}
            />

            Back
          </button>
        </div>

        {/* FORM CARD */}
        <div className="bg-surface-container-lowest rounded-DEFAULT border border-outline-variant/10 overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-on-surface-variant">
              Loading category details...
            </div>
          ) : (
            <form
              onSubmit={
                handleUpdate
              }
              className="p-8 space-y-8"
            >
              {/* IMAGE */}
              <div className="flex items-center gap-6">
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/10 relative">
                  <Image
                    fill
                    unoptimized
                    src={preview || "https://placehold.co/200x200"}
                    alt="preview"
                    className="object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-bold text-on-surface">
                      Category Image
                    </h4>

                    <p className="text-sm text-on-surface-variant">
                      Upload new category
                      thumbnail
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-semibold cursor-pointer hover:opacity-90 transition-all">
                    <Icon
                      name="upload"
                      size={18}
                      className="text-on-primary"
                    />

                    Change Image

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleImageChange
                      }
                      hidden
                    />
                  </label>
                </div>
              </div>

              {/* FORM GRID */}
              <div className="grid grid-cols-2 gap-6">
                {/* NAME */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Category Name
                  </label>

                  <input
                    type="text"
                    name="category_name"
                    value={
                      form.category_name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter category name"
                    className="w-full h-12 px-4 rounded-xl bg-surface-container border border-outline-variant/10 outline-none focus:border-primary"
                  />
                </div>

                {/* LANGUAGE */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Language
                  </label>

                  <select
                    name="lang_type"
                    value={
                      form.lang_type
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full h-12 px-4 rounded-xl bg-surface-container border border-outline-variant/10 outline-none focus:border-primary"
                  >
                    <option value="">
                      Select Language
                    </option>

                    <option value="en">
                      English
                    </option>

                    <option value="hi">
                      Hindi
                    </option>

                    <option value="gu">
                      Gujarati
                    </option>
                  </select>
                </div>

                {/* TRENDING */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Trending Status
                  </label>

                  <select
                    name="is_trending"
                    value={
                      form.is_trending
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full h-12 px-4 rounded-xl bg-surface-container border border-outline-variant/10 outline-none focus:border-primary"
                  >
                    <option value={1}>
                      Trending
                    </option>

                    <option value={0}>
                      Normal
                    </option>
                  </select>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-4 pt-6 border-t border-outline-variant/10">
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/categories"
                    )
                  }
                  className="px-6 py-3 rounded-full border border-outline-variant/20 hover:bg-surface-container transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-3 bg-primary text-on-primary rounded-full font-bold flex items-center gap-2 shadow-primary hover:bg-primary-dim transition-all disabled:opacity-50"
                >
                  <Icon
                    name="save"
                    fill={1}
                    size={18}
                    className="text-on-primary"
                  />

                  {saving
                    ? "Updating..."
                    : "Update Category"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}