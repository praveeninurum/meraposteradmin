"use client";

import {useCallback, useEffect, useState } from "react";

import axios,{AxiosError} from "axios";
import Image from "next/image";

import {
  useParams,
  useRouter,
} from "next/navigation";

import Topbar from "@/components/Topbar";
// import Icon from "@/components/Icon";

type Category = {
  id: number;
  name: string;
};

export default function EditContentPage() {

  const router = useRouter();

  const params = useParams();

  const id = params.id;

  const [loading, setLoading] =
    useState(false);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [preview, setPreview] =
    useState("");

  const [image, setImage] =
    useState<File | null>(null);

  const [formData, setFormData] =
    useState({
      category_id_FK: "",

      content_type: "quote",

      title: "",

      content: "",

      author_name: "",

      language: "",

      is_premium: 0,

      is_popular: 0,
    });

  // FETCH CONTENT
  const fetchContentById = useCallback(async () => {

    try {

      setLoading(true);

      const response =
        await axios.get(
          `http://localhost:3000/api/content/${id}`
        );

      const data = response.data.data;

      setFormData({
        category_id_FK:
          data.category_id_FK || "",

        content_type:
          data.content_type || "quote",

        title:
          data.title || "",

        content:
          data.content || "",

        author_name:
          data.author_name || "",

        language:
          data.language || "",

        is_premium:
          data.is_premium || 0,

        is_popular:
          data.is_popular || 0,
      });

      setPreview(data.image_url || "");

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  },[id]);

  // FETCH CATEGORIES
  const fetchCategories = async () => {

    try {

      const response =
        await axios.get(
          "http://localhost:3000/api/categories"
        );

      setCategories(
        response.data.data || []
      );

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    if (id) {

      fetchContentById();

      fetchCategories();
    }

  }, [id,fetchContentById]);

  // INPUT CHANGE
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // IMAGE CHANGE
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      e.target.files?.[0];

    if (file) {

      setImage(file);

      setPreview(
        URL.createObjectURL(file)
      );
    }
  };

  // SUBMIT
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      const data =
        new FormData();

      data.append(
        "category_id_FK",
        formData.category_id_FK
      );

      data.append(
        "content_type",
        formData.content_type
      );

      data.append(
        "title",
        formData.title
      );

      data.append(
        "content",
        formData.content
      );

      data.append(
        "author_name",
        formData.author_name
      );

      data.append(
        "language",
        formData.language
      );

      data.append(
        "is_premium",
        String(formData.is_premium)
      );

      data.append(
        "is_popular",
        String(formData.is_popular)
      );

      if (image) {

        data.append(
          "image",
          image
        );
      }

      await axios.put(
        `http://localhost:3000/api/content/${id}`,
        data
      );

      alert(
        "Content updated successfully"
      );

      router.push("/content");

    } catch (error:unknown) {
      const err=error as AxiosError

      console.log(err.response?.data || err);

      alert("Update failed");

    } finally {

      setLoading(false);
    }
  };

  return (
    <>
      <Topbar placeholder="Edit content..." />

      <main className="p-8 max-w-5xl mx-auto w-full space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-[28px] font-extrabold text-on-surface tracking-tight">
              Edit Content
            </h1>

            <p className="text-sm text-on-surface-variant mt-1">
              Update your content details,
              image, language, and category.
            </p>
          </div>

          <button
            onClick={() =>
              router.push("/content")
            }
            className="h-11 px-5 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface font-semibold transition-all"
          >
            Back
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-surface-container-lowest rounded-DEFAULT p-8 shadow-sm border border-outline-variant/10 space-y-6"
        >

          {/* IMAGE */}
          <div className="space-y-3">

            <label className="text-sm font-bold text-on-surface">
              Content Image
            </label>

            <div className="w-full h-64 rounded-DEFAULT overflow-hidden bg-surface-container border border-outline-variant/10 relative">

              {preview ? (

                <Image
                  fill
                  unoptimized
                  src={preview}
                  alt="preview"
                  className="object-cover"
                />

              ) : (

                <div className="w-full h-full flex items-center justify-center text-on-surface-variant">

                  No Image Selected

                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/20"
            />
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 gap-5">

            {/* CATEGORY */}
            <div className="space-y-2">

              <label className="text-sm font-bold text-on-surface">
                Category
              </label>

              <select
                name="category_id_FK"
                value={formData.category_id_FK}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none"
              >

                <option value="">
                  Select Category
                </option>

                {categories.map((cat) => (

                  <option
                    key={cat.id}
                    value={cat.id}
                  >
                    {cat.name}
                  </option>

                ))}
              </select>
            </div>

            {/* TYPE */}
            <div className="space-y-2">

              <label className="text-sm font-bold text-on-surface">
                Content Type
              </label>

              <select
                name="content_type"
                value={formData.content_type}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none"
              >

                <option value="quote">
                  Quote
                </option>

                <option value="sticker">
                  Sticker
                </option>

                <option value="snippet">
                  Snippet
                </option>

              </select>
            </div>

            {/* TITLE */}
            <div className="space-y-2">

              <label className="text-sm font-bold text-on-surface">
                Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter title"
                className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none"
              />
            </div>

            {/* AUTHOR */}
            <div className="space-y-2">

              <label className="text-sm font-bold text-on-surface">
                Author
              </label>

              <input
                type="text"
                name="author_name"
                value={formData.author_name}
                onChange={handleChange}
                placeholder="Enter author name"
                className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none"
              />
            </div>

            {/* LANGUAGE */}
            <div className="space-y-2">

              <label className="text-sm font-bold text-on-surface">
                Language
              </label>

              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                placeholder="english / hindi"
                className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none"
              />
            </div>

            {/* PREMIUM */}
            <div className="flex items-center gap-3 pt-8">

              <input
                type="checkbox"
                checked={
                  formData.is_premium === 1
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_premium:
                      e.target.checked
                        ? 1
                        : 0,
                  }))
                }
              />

              <span className="text-sm font-medium text-on-surface">
                Premium Content
              </span>
            </div>

            {/* POPULAR */}
            <div className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={
                  formData.is_popular === 1
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_popular:
                      e.target.checked
                        ? 1
                        : 0,
                  }))
                }
              />

              <span className="text-sm font-medium text-on-surface">
                Popular Content
              </span>
            </div>
          </div>

          {/* CONTENT */}
          <div className="space-y-2">

            <label className="text-sm font-bold text-on-surface">
              Content
            </label>

            <textarea
              rows={6}
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter content..."
              className="w-full p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none resize-none"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="h-12 px-8 rounded-full text-white font-bold hover:scale-[1.02] transition-all"
            style={{
              background:
                "linear-gradient(135deg,#a14200,#8d3900)",
              boxShadow:
                "0 8px 24px rgba(161,66,0,0.22)",
            }}
          >

            {loading
              ? "Updating..."
              : "Update Content"}

          </button>
        </form>
      </main>
    </>
  );
}