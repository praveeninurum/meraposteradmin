"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Topbar from "@/components/Topbar";
import Icon from "@/components/Icon";

export default function CreateCategoryPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [preview, setPreview] =
    useState<string | null>(null);

  const [icon, setIcon] =
    useState<File | null>(null);

  const [formData, setFormData] =
    useState({
      category_name: "",
      category_slug: "",
      lang_type: "english",
      is_trending: 0,
    });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name ===
        "is_trending"
          ? Number(value)
          : value,
    }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (file) {
      setIcon(file);

      setPreview(
        URL.createObjectURL(
          file
        )
      );
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data =
        new FormData();

      data.append(
        "category_name",
        formData.category_name
      );

      data.append(
        "category_slug",
        formData.category_slug
      );

      data.append(
        "lang_type",
        formData.lang_type
      );

      data.append(
        "is_trending",
        String(
          formData.is_trending
        )
      );

      if (icon) {
        data.append(
          "icon_url",
          icon
        );
      }

      const response =
        await axios.post(
          "http://localhost:3000/api/categories",
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      console.log(
        "CREATE RESPONSE =>",
        response.data
      );

      if (
        response.data?.status ===
        "success"
      ) {
        alert(
          "Category created successfully"
        );

        router.push(
          "/categories"
        );
      }
    } catch (error: unknown) {

  const err = error as AxiosError<{
    message?: string;
  }>;

  console.error(
    "CREATE ERROR =>",
    err.response?.data || err
  );

  alert(
    err.response?.data?.message ||
    "Failed to create category"
  );

} finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Topbar placeholder="Create category..." />

      <main className="p-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight font-headline">
              Create{" "}
              <em className="text-primary not-italic italic">
                Category
              </em>
            </h2>

            <p className="text-on-surface-variant text-sm mt-1 max-w-md">
              Add a new category
              dynamically using
              API.
            </p>
          </div>

          <Link href="/categories">
            <button className="px-6 py-3 rounded-full border border-outline-variant hover:bg-surface-container transition-all flex items-center gap-2">
              <Icon
                name="arrow_back"
                size={18}
              />
              Back
            </button>
          </Link>
        </div>

        {/* Form */}
        <div className="bg-surface-container-lowest rounded-DEFAULT border border-outline-variant/10 overflow-hidden">
          <div className="p-8">
            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-6"
            >
              {/* Category Name */}
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">
                  Category Name
                </label>

                <input
                  type="text"
                  name="category_name"
                  value={
                    formData.category_name
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="Enter category name"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>


              {/* Language + Trending */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">
                    Language Type
                  </label>

                  <select
                    name="lang_type"
                    value={
                      formData.lang_type
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:outline-none"
                  >
                    <option value="english">
                      English
                    </option>

                    <option value="hindi">
                      Hindi
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">
                    Trending
                  </label>

                  <select
                    name="is_trending"
                    value={
                      formData.is_trending
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:outline-none"
                  >
                    <option value={0}>
                      Normal
                    </option>

                    <option value={1}>
                      Trending
                    </option>
                  </select>
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-bold text-on-surface mb-3">
                  Category
                  Thumbnail
                </label>

                <label className="border-2 border-dashed border-outline-variant rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container-low transition-all">
                  <Icon
                    name="cloud_upload"
                    size={40}
                    className="text-primary"
                  />

                  <p className="font-medium mt-3">
                    Click to upload
                    image
                  </p>

                  <p className="text-xs text-on-surface-variant mt-1">
                    PNG, JPG,
                    JPEG
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={
                      handleImageChange
                    }
                  />
                </label>

                {preview && (
                  <div className="mt-5">
                    <Image
                      unoptimized
                      src={preview}
                      alt="preview"
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-xl object-cover border border-outline"
                    />
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4">
                <Link href="/categories">
                  <button
                    type="button"
                    className="px-6 py-3 rounded-full border border-outline-variant"
                  >
                    Cancel
                  </button>
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold flex items-center gap-2 shadow-primary hover:bg-primary-dim transition-all disabled:opacity-50"
                >
                  <Icon
                    name="add_circle"
                    fill={1}
                    size={18}
                    className="text-on-primary"
                  />

                  {loading
                    ? "Creating..."
                    : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}