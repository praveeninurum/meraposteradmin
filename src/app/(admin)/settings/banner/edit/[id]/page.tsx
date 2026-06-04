"use client";

import { useEffect,useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

import Topbar from "@/components/Topbar";
import Icon from "@/components/Icon";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://139.59.1.109:3000";

export default function EditBannerPage() {
  const router = useRouter();
  const params = useParams();

  const bannerId = params.id as string;

  const [loading, setLoading] =
    useState(false);

  const [fetching, setFetching] =
    useState(true);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewImage, setPreviewImage] =
    useState("");

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    bg_gradient_start: "#FF6B6B",
    bg_gradient_end: "#FFD93D",
    action_route: "",
    action_label: "",
    category_id_FK: "",
  });

 

const loadBanner = useCallback(async () => {
  try {
    const res = await axios.get(
      `${API_URL}/api/banner/get-banner/${bannerId}`
    );

    const banner = res.data.data;

    setForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      image_url: banner.image_url || "",
      bg_gradient_start:
        banner.bg_gradient_start || "#FF6B6B",
      bg_gradient_end:
        banner.bg_gradient_end || "#FFD93D",
      action_route:
        banner.action_route || "",
      action_label:
        banner.action_label || "",
      category_id_FK:
        banner.category_id_FK?.toString() || "",
    });

    setPreviewImage(
      banner.image_url || ""
    );
  } catch (error: unknown) {
    console.error(error);

    alert("Failed to load banner");
  } finally {
    setFetching(false);
  }
}, [bannerId]);


 useEffect(() => {
    loadBanner();
  }, [loadBanner]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    const url =
      URL.createObjectURL(file);

    setPreviewImage(url);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "title",
        form.title
      );

      formData.append(
        "subtitle",
        form.subtitle
      );

      formData.append(
        "bg_gradient_start",
        form.bg_gradient_start
      );

      formData.append(
        "bg_gradient_end",
        form.bg_gradient_end
      );

      formData.append(
        "action_route",
        form.action_route
      );

      formData.append(
        "action_label",
        form.action_label
      );

      formData.append(
        "category_id_FK",
        form.category_id_FK
      );

      formData.append(
        "image_url",
        form.image_url
      );

      if (selectedFile) {
        formData.append(
          "image",
          selectedFile
        );
      }

      const res =
        await axios.put(
          `${API_URL}/api/banner/update-banner/${bannerId}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      if (
        res.data?.status
      ) {
        alert(
          "Banner updated successfully"
        );

        router.push(
          "/settings"
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update banner"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <>
        <Topbar placeholder="Loading..." />

        <div className="p-8">
          Loading banner...
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar placeholder="Edit banner..." />

      <main className="p-8 max-w-5xl mx-auto w-full pb-32">
        <div className="mb-8">
          <h1 className="text-[28px] font-extrabold text-on-surface font-headline">
            Edit Hero Banner
          </h1>

          <p className="text-sm text-on-surface-variant mt-1">
            Update banner details,
            image and CTA settings.
          </p>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="bg-surface-container-lowest rounded-DEFAULT p-8 shadow-sm"
        >
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                Banner Title
              </label>

              <input
                name="title"
                value={form.title}
                onChange={
                  handleChange
                }
                className="w-full bg-surface-container-low rounded-DEFAULT p-3 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                Action Label
              </label>

              <input
                name="action_label"
                value={
                  form.action_label
                }
                onChange={
                  handleChange
                }
                className="w-full bg-surface-container-low rounded-DEFAULT p-3 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                Subtitle
              </label>

              <input
                name="subtitle"
                value={
                  form.subtitle
                }
                onChange={
                  handleChange
                }
                className="w-full bg-surface-container-low rounded-DEFAULT p-3 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                Image URL
              </label>

              <input
                name="image_url"
                value={
                  form.image_url
                }
                onChange={
                  handleChange
                }
                className="w-full bg-surface-container-low rounded-DEFAULT p-3 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                Replace Image
              </label>

              <div className="border-2 border-dashed border-outline-variant/30 rounded-DEFAULT p-6 bg-surface-container-low">
                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageUpload
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                Gradient Start
              </label>

              <input
                type="color"
                name="bg_gradient_start"
                value={
                  form.bg_gradient_start
                }
                onChange={
                  handleChange
                }
                className="w-full h-12"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                Gradient End
              </label>

              <input
                type="color"
                name="bg_gradient_end"
                value={
                  form.bg_gradient_end
                }
                onChange={
                  handleChange
                }
                className="w-full h-12"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                Action Route
              </label>

              <input
                name="action_route"
                value={
                  form.action_route
                }
                onChange={
                  handleChange
                }
                className="w-full bg-surface-container-low rounded-DEFAULT p-3 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                Category ID
              </label>

              <input
                type="number"
                name="category_id_FK"
                value={
                  form.category_id_FK
                }
                onChange={
                  handleChange
                }
                className="w-full bg-surface-container-low rounded-DEFAULT p-3 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-bold mb-3">
              Live Preview
            </h3>

            <div className="rounded-2xl overflow-hidden bg-surface-container-low shadow-sm">
             {previewImage && (
  <div className="relative h-56 w-full">
    <Image
      src={previewImage}
      alt="Preview"
      fill
      className="object-cover"
    />
  </div>
)}
              <div
                className="p-8 text-white"
                style={{
                  background: `linear-gradient(135deg, ${form.bg_gradient_start}, ${form.bg_gradient_end})`,
                }}
              >
                <h2 className="text-2xl font-black">
                  {form.title}
                </h2>

                <p className="mt-2 opacity-90">
                  {form.subtitle}
                </p>

                <button
                  type="button"
                  className="mt-4 bg-white text-black px-5 py-2 rounded-full text-sm font-bold"
                >
                  {form.action_label}
                </button>
              </div>
            </div>
          </div>

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
                : "Update Banner"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}