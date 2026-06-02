"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import Topbar from "@/components/Topbar";
import Icon from "@/components/Icon";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000";

export default function AddBannerPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [previewImage, setPreviewImage] =
    useState<string>("");

  const [uploadingImage, setUploadingImage] =
    useState(false);
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


  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploadingImage(true);

      // local preview
      setPreviewImage(
        URL.createObjectURL(file)
      );

      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      const res =
        await axios.post(
          `${API_URL}/api/banner/upload-image`,
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
        setForm((prev) => ({
          ...prev,
          image_url:
            res.data.image_url,
        }));
      }
    } catch (error) {
      console.error(error);

      alert(
        "Image upload failed"
      );
    } finally {
      setUploadingImage(false);
    }
  };


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement
    >
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

      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        image_url:
          form.image_url,
        bg_gradient_start:
          form.bg_gradient_start,
        bg_gradient_end:
          form.bg_gradient_end,
        action_route:
          form.action_route,
        action_label:
          form.action_label,
        category_id_FK:
          form.category_id_FK
            ? Number(
              form.category_id_FK
            )
            : null,
      };

      const res =
        await axios.post(
          `${API_URL}/api/banner/add-banner`,
          payload
        );

      if (
        res.data?.status
      ) {
        alert(
          "Banner created successfully"
        );

        router.push(
          "/settings"
        );
      }
    } catch (error) {
      console.error(
        error
      );

      alert(
        "Failed to create banner"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Topbar placeholder="Create new banner..." />

      <main className="p-8 max-w-5xl mx-auto w-full pb-32">
        <div className="mb-8">
          <h1 className="text-[28px] font-extrabold text-on-surface font-headline">
            Add Hero Banner
          </h1>

          <p className="text-sm text-on-surface-variant mt-1">
            Create a new
            promotional banner
            for the app.
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
                required
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
                required
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
                required
                className="w-full bg-surface-container-low rounded-DEFAULT p-3 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                Image URL
              </label>

              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://example.com/banner.jpg"
                className="w-full bg-surface-container-low rounded-DEFAULT p-3 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                Or Upload Image
              </label>

              <div className="border-2 border-dashed border-outline-variant/30 rounded-DEFAULT p-6 bg-surface-container-low">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm"
                />

                <p className="text-xs text-on-surface-variant mt-2">
                  Upload image directly to server.
                </p>

                {uploadingImage && (
                  <p className="text-primary text-xs mt-2">
                    Uploading image...
                  </p>
                )}

                {form.image_url && (
                  <p className="text-green-600 text-xs mt-2 break-all">
                    Uploaded:
                    <br />
                    {form.image_url}
                  </p>
                )}
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
                className="w-full h-12 rounded-lg cursor-pointer"
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
                className="w-full h-12 rounded-lg cursor-pointer"
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
                placeholder="/birthday"
                required
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
                placeholder="8"
                className="w-full bg-surface-container-low rounded-DEFAULT p-3 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Preview */}
          {/* Preview */}
          <div className="mt-8">
            <h3 className="font-bold mb-3">
              Live Preview
            </h3>

            <div className="rounded-2xl overflow-hidden bg-surface-container-low shadow-sm">

              {(previewImage || form.image_url) && (
                <div className="h-56 relative">
                  <img
                    src={
                      previewImage ||
                      form.image_url
                    }
                    alt="Banner Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div
                className="p-8 text-white"
                style={{
                  background: `linear-gradient(
          135deg,
          ${form.bg_gradient_start},
          ${form.bg_gradient_end}
        )`,
                }}
              >
                <h2 className="text-2xl font-black">
                  {form.title || "Banner Title"}
                </h2>

                <p className="mt-2 opacity-90">
                  {form.subtitle ||
                    "Banner subtitle"}
                </p>

                <button
                  type="button"
                  className="mt-4 bg-white text-black px-5 py-2 rounded-full text-sm font-bold"
                >
                  {form.action_label ||
                    "Action"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/settings"
                )
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
                ? "Creating..."
                : "Create Banner"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}






// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// import Topbar from "@/components/Topbar";
// import Icon from "@/components/Icon";

// export default function AddBannerPage() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     title: "",
//     subtitle: "",
//     image_url: "",
//     bg_gradient_start: "#FF6B6B",
//     bg_gradient_end: "#FFD93D",
//     action_route: "",
//     action_label: "",
//     category_id_FK: "",
//     is_active: true,
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);

//       await axios.post(
//         "http://localhost:3000/api/banner/add-banner",
//         {
//           ...form,
//           is_active: form.is_active ? 1 : 0,
//           category_id_FK:
//             form.category_id_FK === ""
//               ? null
//               : Number(form.category_id_FK),
//         }
//       );

//       alert("Banner created successfully");

//       router.push("/settings");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to create banner");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Topbar placeholder="Create banner..." />

//       <main className="p-8 max-w-6xl mx-auto w-full pb-32">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center gap-3 mb-2">
//             <button
//               onClick={() => router.back()}
//               className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-primary-container transition-colors flex items-center justify-center"
//             >
//               <Icon name="arrow_back" size={20} />
//             </button>

//             <h1 className="text-[28px] font-extrabold font-headline text-on-surface">
//               Create Banner
//             </h1>
//           </div>

//           <p className="text-sm text-on-surface-variant">
//             Create a new hero banner for the mobile application.
//           </p>
//         </div>

//         <div className="grid grid-cols-12 gap-8">
//           {/* Form */}
//           <div className="col-span-8 bg-surface-container-lowest rounded-DEFAULT p-8">
//             <div className="flex items-center gap-3 mb-8">
//               <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
//                 <Icon
//                   name="campaign"
//                   size={20}
//                   className="text-primary"
//                 />
//               </div>

//               <h2 className="text-xl font-bold font-headline">
//                 Banner Details
//               </h2>
//             </div>

//             <div className="space-y-5">
//               {/* Title */}
//               <div>
//                 <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
//                   Banner Title
//                 </label>

//                 <input
//                   name="title"
//                   value={form.title}
//                   onChange={handleChange}
//                   placeholder="Birthday Posters"
//                   className="w-full p-3 bg-surface-container-low rounded-DEFAULT outline-none focus:ring-2 focus:ring-primary-fixed-dim"
//                 />
//               </div>

//               {/* Subtitle */}
//               <div>
//                 <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
//                   Subtitle
//                 </label>

//                 <textarea
//                   name="subtitle"
//                   value={form.subtitle}
//                   onChange={handleChange}
//                   rows={4}
//                   placeholder="Create beautiful birthday posters instantly"
//                   className="w-full p-3 bg-surface-container-low rounded-DEFAULT outline-none focus:ring-2 focus:ring-primary-fixed-dim resize-none"
//                 />
//               </div>

//               {/* Image URL */}
//               <div>
//                 <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
//                   Image URL
//                 </label>

//                 <input
//                   name="image_url"
//                   value={form.image_url}
//                   onChange={handleChange}
//                   placeholder="https://example.com/banner.jpg"
//                   className="w-full p-3 bg-surface-container-low rounded-DEFAULT outline-none focus:ring-2 focus:ring-primary-fixed-dim"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-5">
//                 <div>
//                   <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
//                     Gradient Start
//                   </label>

//                   <input
//                     type="color"
//                     name="bg_gradient_start"
//                     value={form.bg_gradient_start}
//                     onChange={handleChange}
//                     className="w-full h-12 rounded-lg"
//                   />
//                 </div>

//                 <div>
//                   <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
//                     Gradient End
//                   </label>

//                   <input
//                     type="color"
//                     name="bg_gradient_end"
//                     value={form.bg_gradient_end}
//                     onChange={handleChange}
//                     className="w-full h-12 rounded-lg"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-5">
//                 <div>
//                   <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
//                     Action Route
//                   </label>

//                   <input
//                     name="action_route"
//                     value={form.action_route}
//                     onChange={handleChange}
//                     placeholder="/birthday"
//                     className="w-full p-3 bg-surface-container-low rounded-DEFAULT outline-none focus:ring-2 focus:ring-primary-fixed-dim"
//                   />
//                 </div>

//                 <div>
//                   <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
//                     Action Label
//                   </label>

//                   <input
//                     name="action_label"
//                     value={form.action_label}
//                     onChange={handleChange}
//                     placeholder="Create Now"
//                     className="w-full p-3 bg-surface-container-low rounded-DEFAULT outline-none focus:ring-2 focus:ring-primary-fixed-dim"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
//                   Category ID
//                 </label>

//                 <input
//                   name="category_id_FK"
//                   value={form.category_id_FK}
//                   onChange={handleChange}
//                   placeholder="8"
//                   className="w-full p-3 bg-surface-container-low rounded-DEFAULT outline-none focus:ring-2 focus:ring-primary-fixed-dim"
//                 />
//               </div>

//               <div className="flex items-center gap-3">
//                 <input
//                   type="checkbox"
//                   checked={form.is_active}
//                   onChange={(e) =>
//                     setForm({
//                       ...form,
//                       is_active: e.target.checked,
//                     })
//                   }
//                 />

//                 <span className="text-sm font-medium">
//                   Active Banner
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Preview */}
//           <div className="col-span-4">
//             <div className="bg-surface-container-lowest rounded-DEFAULT p-6 sticky top-24">
//               <h3 className="font-bold mb-4">
//                 Live Preview
//               </h3>

//               <div
//                 className="rounded-DEFAULT p-6 text-white min-h-[220px] flex flex-col justify-end"
//                 style={{
//                   background: `linear-gradient(135deg, ${form.bg_gradient_start}, ${form.bg_gradient_end})`,
//                 }}
//               >
//                 <h4 className="text-xl font-black mb-2">
//                   {form.title || "Banner Title"}
//                 </h4>

//                 <p className="text-sm opacity-90">
//                   {form.subtitle ||
//                     "Banner subtitle preview"}
//                 </p>

//                 <button className="mt-4 bg-white text-black px-4 py-2 rounded-full text-xs font-bold w-fit">
//                   {form.action_label ||
//                     "Action Button"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Action Bar */}
//         <div className="fixed bottom-8 left-[calc(16rem+2rem)] right-8 flex justify-end z-30">
//           <div className="bg-white/90 backdrop-blur-xl border border-primary-fixed/30 p-2 rounded-full shadow-2xl flex items-center gap-2">
//             <button
//               onClick={() => router.back()}
//               className="px-7 py-3 text-on-surface-variant font-bold hover:text-primary transition-colors text-sm"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="px-8 py-3 text-white rounded-full font-bold flex items-center gap-2 text-sm"
//               style={{
//                 background:
//                   "linear-gradient(135deg,#a14200,#8d3900)",
//               }}
//             >
//               <Icon
//                 name="save"
//                 size={16}
//                 className="text-white"
//               />

//               {loading
//                 ? "Creating..."
//                 : "Create Banner"}
//             </button>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }