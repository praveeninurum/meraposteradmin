"use client";

import {useCallback, useEffect, useState } from "react";
import axios,{AxiosError} from "axios";
import Image from "next/image";

import {
  useRouter
} from "next/navigation";
import Topbar from "@/components/Topbar";
import Icon from "@/components/Icon";

const typeFilters = [
  "All Content",
  "Quotes",
  "Stickers",
  "Text Snippets",
];

type BadgeInfo = {
  label: string;
  bg: string;
};

type ContentItem = {
  id: number;

  category_id_FK: number;
  category_name: string;

  content_type: string;

  title: string;
  content: string;

  image_url: string;

  author_name: string;
  language: string;

  is_premium: number;
  is_popular: number;
};

export default function ContentPage() {
  const router = useRouter();

  const [typeFilter, setTypeFilter] =
    useState("All Content");

  const [loading, setLoading] =
    useState(false);

  const [contentList, setContentList] =
    useState<ContentItem[]>([]);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT= 4;
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);
  useEffect(() => {
    setPage(1);
  }, [searchQuery, typeFilter]);
  // FETCH CONTENT
  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);

      let content_type = "";

      if (typeFilter === "Quotes") content_type = "quote";
      if (typeFilter === "Stickers") content_type = "sticker";
      if (typeFilter === "Text Snippets") content_type = "snippet";

      const response = await axios.get(
        "http://localhost:3000/api/content",
        {
          params: {
            search: searchQuery,
            content_type,
            page,
            limit:LIMIT,
          },
        }
      );

      setContentList(response.data.data || []);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  },[typeFilter,searchQuery,page]);

  // INITIAL LOAD
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);


  //Delete function
  const handleDelete = async (
    id: number
  ) => {

    const confirmDelete =
      confirm(
        "Are you sure you want to delete this content?"
      );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `http://localhost:3000/api/content/${id}`
      );

      // REMOVE FROM UI
      setContentList((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );

     window.alert("Content deleted");

    } catch (error:unknown) {
      const err= error as AxiosError

      console.log(err.response?.data);

      alert("Delete failed");
    }
  };
  return (
    <>
      <Topbar placeholder="Search content library…" />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">

        {/* HEADER */}
        <div className="flex items-end justify-between gap-4">

          <div>
            <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight font-headline">
              Content Library
            </h2>

            <p className="text-on-surface-variant text-sm mt-1">
              Manage your curated quotes,
              text snippets, and visual stickers.
            </p>
          </div>

          <button
            onClick={() =>
              router.push("/content/create")
            }
            className="px-6 py-3 text-white rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all"
            style={{
              background:
                "linear-gradient(135deg,#a14200,#8d3900)",
              boxShadow:
                "0 8px 24px rgba(161,66,0,0.22)",
            }}
          >
            <Icon
              name="add"
              fill={1}
              size={18}
              className="text-white"
            />

            Add New Content
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex-1 relative">

          {/* SEARCH ICON */}
          <Icon
            name="search"
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />

          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchQuery(searchInput);
              }
            }}
            placeholder="Search quotes, stickers, snippets..."
            className="w-full h-12 pl-12 pr-10 rounded-full bg-surface-container-low border border-outline-variant/20 text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary transition-all"
          />

          {/* CLEAR BUTTON */}
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-error"
            >
              <Icon name="close" size={18} />
            </button>
          )}

        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 items-center">

          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 mr-1">
            Filter by Type:
          </span>

          {typeFilters.map((f) => (

            <button
              key={f}
              onClick={() =>
                setTypeFilter(f)
              }
              className={`px-4 py-1.5 rounded-sm font-semibold text-sm transition-all ${typeFilter === f
                ? "bg-tertiary-container text-on-tertiary-fixed"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                }`}
            >
              {f}
            </button>

          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-20 text-center text-on-surface-variant">
            Loading content...
          </div>
        )}

        {/* CONTENT GRID */}
        {!loading &&  contentList.length > 0 && (
          <div className="grid grid-cols-4 gap-5">

            {contentList.map((c) => {

              const type =
                c.content_type?.toLowerCase();

              const badge: BadgeInfo | null =
                c.is_premium === 1
                  ? {
                    label: "PREMIUM",
                    bg:
                      "bg-tertiary-fixed text-on-tertiary-fixed",
                  }
                  : c.is_popular === 1
                    ? {
                      label: "POPULAR",
                      bg:
                        "bg-tertiary-fixed text-on-tertiary-fixed",
                    }
                    : null;

              return (

                <div
                  key={c.id}
                  className="group bg-surface-container-lowest rounded-DEFAULT overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 transition-all"
                >

                  {/* IMAGE */}
                  {c.image_url && (

                    <div className="h-48 relative overflow-hidden bg-surface-container">

                      <Image
                        fill
                        unoptimized
                        src={c.image_url}
                        alt={c.title}
                        className="object-cover"
                      />

                      {/* TYPE */}
                      <div className="absolute top-3 left-3 px-2 py-0.5 bg-tertiary text-on-tertiary text-[10px] font-bold rounded uppercase">
                        {type}
                      </div>

                      {/* BADGE */}
                      {badge && (
                        <div
                          className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold ${badge.bg}`}
                        >
                          {badge.label}
                        </div>
                      )}

                    </div>
                  )}

                  {/* CONTENT */}
                  <div className="p-6 flex-1 flex flex-col justify-between min-h-[200px] bg-gradient-to-br from-surface-bright to-surface-container-low">

                    <div>

                      {/* TOP */}
                      {!c.image_url && (
                        <div className="flex justify-between items-start mb-3">

                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${type === "quote"
                              ? "bg-secondary-container text-on-secondary-container"
                              : "bg-on-surface-variant text-white"
                              }`}
                          >
                            {type}
                          </span>

                          {badge && (
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.bg}`}
                            >
                              {badge.label}
                            </span>
                          )}

                        </div>
                      )}

                      {/* TITLE */}
                      {c.title && (
                        <h3 className="text-lg font-bold text-on-surface mb-3">
                          {c.title}
                        </h3>
                      )}

                      {/* CONTENT */}
                      {c.content && (
                        <p className="text-on-surface leading-relaxed whitespace-pre-line">
                          {c.content}
                        </p>
                      )}

                    </div>

                    {/* FOOTER */}
                    <div className="mt-5 flex justify-between items-center">

                      <div className="flex flex-col">

                        <span className="text-xs text-on-surface-variant">
                          {c.author_name || "Unknown"}
                        </span>

                        <span className="text-[11px] text-primary font-semibold mt-1">
                          {c.category_name}
                        </span>

                      </div>

                      <span className="text-[10px] bg-surface-container-highest px-2 py-0.5 rounded font-bold text-on-primary-container uppercase">
                        {c.language}
                      </span>

                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="px-5 py-3 bg-white flex justify-end items-center">

                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">

                      <button
                        onClick={() =>
                          router.push(`/content/edit/${c.id}`)
                        }
                        className="p-1.5 text-primary hover:bg-primary-container rounded-full transition-all hover:scale-110"
                      >
                        <Icon name="edit" size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(c.id)
                        }
                        className="p-1.5 text-error hover:bg-error-container/20 rounded-full transition-all hover:scale-110"
                      >
                        <Icon name="delete" size={16} />
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}

            {/* ADD CARD */}
            <button className="group border-2 border-dashed border-outline-variant/30 rounded-DEFAULT min-h-[280px] flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all">

              <div className="w-11 h-11 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform">

                <Icon
                  name="add"
                  size={22}
                />

              </div>

              <span className="font-bold text-on-surface-variant text-sm">
                Add New Item
              </span>

            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          contentList.length === 0 && (
            <div className="py-20 text-center text-on-surface-variant">
              No content found
            </div>
          )}

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-6 pb-8 border-t border-outline-variant/10">

          <p className="text-sm text-on-surface-variant">

            Showing{" "}

            <strong className="text-on-surface">
              {contentList.length}
            </strong>{" "}

            items
          </p>

          <div className="flex gap-2">

            {/* PREV */}
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-40"
            >
              <Icon name="chevron_left" size={20} />
            </button>

            {/* PAGES */}
            {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors
        ${page === n
                    ? "bg-primary text-white"
                    : "hover:bg-surface-container-low text-on-surface-variant"
                  }`}
              >
                {n}
              </button>
            ))}

            {/* NEXT */}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-40"
            >
              <Icon name="chevron_right" size={20} />
            </button>

          </div>
        </div>
      </main>
    </>
  );
}

// "use client";

// import { useState, ReactNode } from "react";
// import Topbar from "@/components/Topbar";
// import Icon from "@/components/Icon";

// const typeFilters = ["All Content", "Quotes", "Stickers", "Text Snippets"];
// const categoryFilters = ["Inspirational", "Success", "Morning", "Devotional", "Relationships"];

// type BadgeInfo = { label: string; bg: string };

// type QuoteCard = {
//   type: "QUOTE" | "SNIPPET";
//   bg?: string;
//   content: ReactNode;
//   foot?: string;
//   tag?: string;
//   badge?: BadgeInfo | null;
//   cat: string;
//   img?: never;
//   name?: never;
// };

// type StickerCard = {
//   type: "STICKER";
//   img: string;
//   name: string;
//   cat: string;
//   bg?: never;
//   content?: never;
//   foot?: never;
//   tag?: never;
//   badge?: never;
// };

// type Card = QuoteCard | StickerCard;

// const cards: Card[] = [
//   {
//     type: "QUOTE",
//     bg: "bg-gradient-to-br from-surface-bright to-surface-container-low",
//     content: <p className="text-xl font-bold text-on-surface leading-tight italic">&ldquo;The only way to do great work is to love what you do.&rdquo;</p>,
//     foot: "Steve Jobs",
//     tag: "ENGLISH",
//     badge: { label: "PREMIUM", bg: "bg-tertiary-fixed text-on-tertiary-fixed" },
//     cat: "Success",
//   },
//   {
//     type: "QUOTE",
//     bg: "bg-gradient-to-br from-secondary-fixed to-surface-container-low",
//     content: <p className="text-2xl font-extrabold text-on-surface leading-snug">मंजिलें उन्हें मिलती हैं, जिनके सपनों में जान होती है।</p>,
//     foot: "Inspirational",
//     tag: "HINDI",
//     badge: null,
//     cat: "Motivation",
//   },
//   {
//     type: "STICKER",
//     img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFAuMDfXJrIy45Uj_bwQNNRLfxyzvLDHQl6FDoAuL_DJghXX9thznfYX2GibiMxuBzMvVLCNy9hpDJYM8MJFYfhz2XmQRMIYAkosmJba-owzvPRQo2eeP33CgmHwTM6t97JMvFX_Rilqd1ptvOqag3UZ6vyT3FwcH3sOHh8tVDusC9YyV2ixsNb-qUPlBm7OV-gF4ncizsJpkwsgiYLxpReMEKKwWtjfkWkx3io_hzAH2wbw6fYA9ro0THLlAUwPb8_BErLNJGPOXk",
//     name: "Geometric Sunburst",
//     cat: "Abstract",
//   },
//   {
//     type: "SNIPPET",
//     content: (
//       <>
//         <p className="text-sm font-medium text-on-surface-variant mb-3">Wishing you a day filled with laughter, love, and endless happiness. Happy Birthday!</p>
//         <div className="p-3 bg-white rounded-md border border-outline-variant/10">
//           <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Preview</p>
//           <p className="text-xs font-bold text-primary">Happy Birthday! 🎂✨</p>
//         </div>
//       </>
//     ),
//     tag: "MULTILINGUAL",
//     cat: "Occasions",
//   },
//   {
//     type: "STICKER",
//     img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoKR_W5HMI8do4n1K-8_ic0X2Dvgl5RsUvJPXNxnDOYS7MzrxdzBypsrPsCAZkFTjV2Wlai_ShqpcBZS9Im5jWwYrQk_f_JgNPOtqeDAbN1kPzVciF-cItJ1kXABcAWdOSarXOBSKleHcWwnjBhYl_kkiQbvdfan5xAp386QFMsA8nSzYHhNtttFvTc1K9wrtXJScoonUajr-dvo37ZCErJ5INVqAPhcGnPEkAf2aoorL4tYya32vWp7O-cD__huC642tNBW41_xOB",
//     name: "Floral Border",
//     cat: "Nature",
//   },
//   {
//     type: "QUOTE",
//     bg: "bg-primary-container",
//     content: <p className="text-3xl font-extrabold text-on-primary-container text-center leading-tight">CHASE<br />DREAMS</p>,
//     cat: "Motivation",
//   },
//   {
//     type: "SNIPPET",
//     content: <p className="text-lg font-bold text-on-surface mb-4 leading-relaxed">शुभ प्रभात! आपका दिन मंगलमय हो।</p>,
//     tag: "HINDI",
//     cat: "Morning",
//     badge: { label: "POPULAR", bg: "bg-tertiary-fixed text-on-tertiary-fixed" },
//   },
// ];

// export default function ContentPage() {
//   const [typeFilter, setTypeFilter] = useState("All Content");

//   return (
//     <>
//       <Topbar placeholder="Search content library…" />
//       <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
//         <div className="flex items-end justify-between gap-4">
//           <div>
//             <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight font-headline">Content Library</h2>
//             <p className="text-on-surface-variant text-sm mt-1">Manage your curated quotes, text snippets, and visual stickers.</p>
//           </div>
//           <button
//             className="px-6 py-3 text-white rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all"
//             style={{ background: "linear-gradient(135deg,#a14200,#8d3900)", boxShadow: "0 8px 24px rgba(161,66,0,0.22)" }}
//           >
//             <Icon name="add" fill={1} size={18} className="text-white" />
//             Add New Content
//           </button>
//         </div>

//         <div className="flex flex-wrap gap-3 items-center">
//           <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 mr-1">Filter by Type:</span>
//           {typeFilters.map((f) => (
//             <button
//               key={f}
//               onClick={() => setTypeFilter(f)}
//               className={`px-4 py-1.5 rounded-sm font-semibold text-sm transition-all ${typeFilter === f ? "bg-tertiary-container text-on-tertiary-fixed" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"}`}
//             >
//               {f}
//             </button>
//           ))}
//         </div>

//         <div className="flex flex-wrap gap-3 items-center">
//           <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 mr-1">Category:</span>
//           {categoryFilters.map((c) => (
//             <button key={c} className="px-4 py-1.5 bg-surface-container-low text-on-surface-variant rounded-sm font-semibold text-sm hover:bg-surface-container-high transition-all border border-outline-variant/15">
//               {c}
//             </button>
//           ))}
//           <button className="text-primary text-sm font-bold ml-1 hover:underline">View All Categories</button>
//         </div>

//         <div className="grid grid-cols-4 gap-5">
//           {cards.map((c, i) => (
//             <div key={i} className="group bg-surface-container-lowest rounded-DEFAULT overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 transition-all">
//               {c.type === "STICKER" ? (
//                 <div className="h-48 relative overflow-hidden bg-surface-container">
//                   {/* eslint-disable-next-line @next/next/no-img-element */}
//                   <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
//                   <div className="absolute top-3 left-3 px-2 py-0.5 bg-tertiary text-on-tertiary text-[10px] font-bold rounded uppercase">
//                     Sticker
//                   </div>
//                 </div>
//               ) : (
//                 <div className={`p-6 flex-1 flex flex-col justify-between min-h-[200px] ${c.bg ?? ""}`}>
//                   <div>
//                     <div className="flex justify-between items-start mb-3">
//                       <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${c.type === "QUOTE" ? "bg-secondary-container text-on-secondary-container" : "bg-on-surface-variant text-white"}`}>
//                         {c.type}
//                       </span>
//                       {c.badge && (
//                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.badge.bg}`}>
//                           {c.badge.label}
//                         </span>
//                       )}
//                     </div>
//                     {c.content}
//                   </div>
//                   {c.foot && (
//                     <div className="mt-3 flex justify-between items-center">
//                       <span className="text-xs text-on-surface-variant">{c.foot}</span>
//                       {c.tag && (
//                         <span className="text-[10px] bg-surface-container-highest px-2 py-0.5 rounded font-bold text-on-primary-container">
//                           {c.tag}
//                         </span>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}
//               <div className="px-5 py-3 bg-white flex justify-between items-center">
//                 <div>
//                   <span className="text-xs font-semibold text-on-surface-variant/80">{c.cat}</span>
//                   {c.type !== "STICKER" && c.tag && c.type !== "QUOTE" && (
//                     <span className="text-[10px] bg-surface-container-highest px-2 py-0.5 rounded font-bold text-on-primary-container ml-2">
//                       {c.tag}
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <button className="p-1.5 text-primary hover:bg-primary-container rounded-full transition-colors">
//                     <Icon name="edit" size={16} />
//                   </button>
//                   <button className="p-1.5 text-error hover:bg-error-container/20 rounded-full transition-colors">
//                     <Icon name="delete" size={16} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}

//           <button className="group border-2 border-dashed border-outline-variant/30 rounded-DEFAULT min-h-[280px] flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all">
//             <div className="w-11 h-11 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
//               <Icon name="add" size={22} />
//             </div>
//             <span className="font-bold text-on-surface-variant text-sm">Add New Item</span>
//           </button>
//         </div>

//         <div className="flex items-center justify-between pt-6 pb-8 border-t border-outline-variant/10">
//           <p className="text-sm text-on-surface-variant">
//             Showing <strong className="text-on-surface">1–24</strong> of <strong className="text-on-surface">1,248</strong> items
//           </p>
//           <div className="flex gap-2">
//             <button className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low transition-colors">
//               <Icon name="chevron_left" size={20} />
//             </button>
//             {[1, 2, 3, "…"].map((n, i) => (
//               <button key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${n === 1 ? "bg-primary text-white" : "hover:bg-surface-container-low text-on-surface-variant"}`}>
//                 {n}
//               </button>
//             ))}
//             <button className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low transition-colors">
//               <Icon name="chevron_right" size={20} />
//             </button>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }
