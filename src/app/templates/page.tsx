"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Image from "next/image";

import Topbar from "@/components/Topbar";
import Icon from "@/components/Icon";
import Toggle from "@/components/Toggle";

type Category = {
  id: number;
  name: string;
  icon_url: string;
  is_trending: number;
  is_premium: number | null;
  is_free: number | null;
  is_active: number | null;
};

export default function TemplatesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeFilter, setActiveFilter] =
    useState("All Templates");

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const ITEMS_PER_PAGE = 6;

  const [visibleCount, setVisibleCount] =
    useState(ITEMS_PER_PAGE);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, activeFilter]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/categories"
      );

      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  // FILTERS
  const filters = useMemo(() => {
    return [
      "All Templates",
      ...categories.map((c) => c.name),
    ];
  }, [categories]);

  // FILTERED DATA
  const filteredCategories = categories.filter((c) => {
    const matchesFilter =
      activeFilter === "All Templates"
        ? true
        : c.name === activeFilter;

    const matchesSearch = c.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const displayedCategories =
    filteredCategories.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <>
      <Topbar placeholder="Search templates…"     />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">

        {/* HEADER */}
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">

          {/* TITLE */}
          <div>
            <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight font-headline">
              Template Library
            </h2>

            <p className="text-on-surface-variant text-sm mt-1">
              Manage and curate your premium visual collection
            </p>
          </div>

          {/* SEARCH */}
<div className="w-full xl:w-[380px] flex-shrink-0">
  <div className="relative">

    {/* SEARCH ICON */}
    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
      <Icon
        name="search"
        size={18}
        className="text-on-surface-variant"
      />
    </div>

    {/* INPUT */}
    <input
      type="text"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      placeholder="Search templates..."
      autoComplete="off"
      spellCheck={false}
      style={{
        position: "relative",
        zIndex: 9999,
        pointerEvents: "auto",
      }}
      className="
        w-full
        h-12
        pl-12
        pr-10
        rounded-full
        border
        border-outline-variant/20
        bg-surface
        text-on-surface
        outline-none
        focus:border-primary
        focus:ring-2
        focus:ring-primary/20
      "
    />

    {/* CLEAR BUTTON */}
    {searchInput && (
      <button
        type="button"
        onClick={() => setSearchInput("")}
        className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          z-20
          text-on-surface-variant
          hover:text-error
        "
      >
        <Icon name="close" size={18} />
      </button>
    )}
  </div>
</div>
          {/* FILTERS */}
          <div className="flex flex-wrap gap-2">

            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-sm text-xs font-bold flex items-center gap-1 transition-all ${activeFilter === f
                  ? "bg-tertiary-container text-on-tertiary-container"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                  }`}
              >
                {f === "All Templates" && (
                  <Icon
                    name="all_inclusive"
                    size={14}
                  />
                )}

                {f}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* EMPTY */}
            {filteredCategories.length === 0 && (
              <div className="py-24 text-center text-on-surface-variant">
                No categories found
              </div>
            )}

            {/* CONTENT */}
            {filteredCategories.length > 0 && (

              <div className="relative z-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* FEATURED CARD */}
                <div className="xl:col-span-2 xl:row-span-2 group relative overflow-hidden bg-surface-container-lowest rounded-DEFAULT border border-outline-variant/10 shadow-sm hover:shadow-xl transition-all duration-500">

                  <div className="h-[420px] relative overflow-hidden">

                    <Image
                      fill
                      unoptimized
                      src={filteredCategories[0].icon_url}
                      alt={filteredCategories[0].name}
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* TRENDING */}
                    {filteredCategories[0].is_trending === 1 && (
                      <div className="absolute top-5 right-5">
                        <span className="bg-primary text-on-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">

                          <Icon
                            name="star"
                            fill={1}
                            size={12}
                            className="text-on-primary"
                          />

                          Trending
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 w-full p-8 text-white">

                      <div className="flex justify-between items-end">

                        <div>
                          <span className="text-tertiary-fixed font-bold text-xs uppercase tracking-wider mb-1 block">
                            Featured Category
                          </span>

                          <h3 className="text-2xl font-extrabold leading-tight font-headline">
                            {filteredCategories[0].name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20">

                          <span className="text-xs font-bold uppercase">
                            Active
                          </span>

                          <Toggle
                            on={filteredCategories[0].is_active === 1}
                            onChange={() => { }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CATEGORY CARDS */}
                {displayedCategories.map((c) => (

                  <div
                    key={c.id}
                    className="group bg-surface-container-low rounded-DEFAULT p-4 flex flex-col hover:bg-surface-container-highest transition-all border border-transparent hover:border-primary-fixed/30"
                  >

                    {/* IMAGE */}
                    <div className="aspect-[4/5] rounded-DEFAULT overflow-hidden mb-4 relative">

                      <Image
                        fill
                        unoptimized
                        src={c.icon_url}
                        alt={c.name}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* BADGE */}
                      <div className="absolute top-3 left-3">

                        {c.is_premium === 1 ? (
                          <span className="bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded-sm">
                            Premium
                          </span>
                        ) : (
                          <span className="bg-surface-container-lowest/80 backdrop-blur-sm text-on-surface-variant text-[10px] font-bold px-2 py-1 rounded-sm">
                            Free
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="flex justify-between items-start mb-2">

                      <div>
                        <h4 className="font-bold text-on-surface text-sm">
                          {c.name}
                        </h4>
                      </div>

                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <Icon
                          name="more_vert"
                          size={18}
                        />
                      </button>
                    </div>

                    {/* TOGGLE */}
                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-outline-variant/10">

                      <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                        Active Status
                      </span>

                      <Toggle
                        on={c.is_active === 1}
                        onChange={() => { }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FOOTER */}
            <div className="py-10 flex flex-col items-center border-t border-outline-variant/10">

              <p className="text-on-surface-variant text-sm mb-5">
                Showing {displayedCategories.length} of{" "}
                {filteredCategories.length} categories
              </p>

              {visibleCount <
                filteredCategories.length && (
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-secondary-container text-on-secondary-container rounded-DEFAULT font-bold hover:scale-105 transition-all"
                  >
                    Load More Templates
                  </button>
                )}
            </div>
          </>
        )}
      </main>
    </>
  );
}


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import axios from "axios";

// import Topbar from "@/components/Topbar";
// import Icon from "@/components/Icon";
// import Toggle from "@/components/Toggle";

// type Category = {
//   id: number;
//   name: string;
//   icon_url: string;
//   is_trending: number;
//   is_premium: number | null;
//   is_free: number | null;
//   is_active: number | null;
// };

// export default function TemplatesPage() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [activeFilter, setActiveFilter] = useState("All Templates");
//   const [searchInput, setSearchInput] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const ITEMS_PER_PAGE = 6;

//   const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);






//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setSearchQuery(searchInput);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchInput]);

//   useEffect(() => {
//     setVisibleCount(ITEMS_PER_PAGE);
//   }, [searchQuery, activeFilter]);

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3000/api/categories"
//       );

//       setCategories(res.data.data || []);
//     } catch (error) {
//       console.error("Failed to fetch categories", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // FILTERS
//   const filters = useMemo(() => {
//     return ["All Templates", ...categories.map((c) => c.name)];
//   }, [categories]);

//   // FILTERED DATA
//   const filteredCategories = categories.filter((c) => {

//     // FILTER
//     const matchesFilter =
//       activeFilter === "All Templates"
//         ? true
//         : c.name === activeFilter;

//     // SEARCH
//     const matchesSearch =
//       c.name
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase());

//     return matchesFilter && matchesSearch;
//   });
//   const displayedCategories = filteredCategories.slice(1, visibleCount + 1);
//   const handleLoadMore = () => {
//     setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
//   };

//   return (
//     <>
//       <Topbar placeholder="Search templates…" />

//       <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
//         {/* HEADER */}
//         <div className="flex items-end justify-between gap-4 flex-wrap">
//           <div>
//             <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight font-headline">
//               Template Library
//             </h2>

//             <p className="text-on-surface-variant text-sm mt-1">
//               Manage and curate your premium visual collection
//             </p>
//           </div>


//           {/* SEARCH */}
//   {/* SEARCH */}
// <div className="relative w-full max-w-md z-50">

//   <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
//     <Icon
//       name="search"
//       size={18}
//       className="text-on-surface-variant"
//     />
//   </div>

//   <input
//     type="text"
//     value={searchInput}
//     onChange={(e) => setSearchInput(e.target.value)}
//     placeholder="Search templates..."
//     className="w-full h-12 pl-12 pr-10 rounded-full bg-surface-container-low border border-outline-variant/20 text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary"
//   />

//   {searchInput && (
//     <button
//       type="button"
//       onClick={() => setSearchInput("")}
//       className="absolute inset-y-0 right-0 flex items-center pr-4 z-50"
//     >
//       <Icon name="close" size={18} />
//     </button>
//   )}

// </div>



//           {/* FILTERS */}
//           <div className="flex flex-wrap gap-2">
//             {filters.map((f) => (
//               <button
//                 key={f}
//                 onClick={() => setActiveFilter(f)}
//                 className={`px-4 py-2 rounded-sm text-xs font-bold flex items-center gap-1 transition-all ${activeFilter === f
//                   ? "bg-tertiary-container text-on-tertiary-container"
//                   : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
//                   }`}
//               >
//                 {f === "All Templates" && (
//                   <Icon name="all_inclusive" size={14} />
//                 )}

//                 {f}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* LOADING */}
//         {loading ? (
//           <div className="flex justify-center py-24">
//             <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
//           </div>
//         ) : (
//           <>
//             {/* FEATURED */}
//             {/* FEATURED */}
//             {filteredCategories.length > 0 && (
//               <div className="grid grid-cols-3 gap-6">

//                 <div className="col-span-2 row-span-2 group relative overflow-hidden bg-surface-container-lowest rounded-DEFAULT border border-outline-variant/10 shadow-sm hover:shadow-xl transition-all duration-500">

//                   <div className="h-[420px] relative overflow-hidden">

//                     <img
//                       src={filteredCategories[0].icon_url}
//                       alt={filteredCategories[0].name}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                     />

//                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

//                     {/* TRENDING */}
//                     {filteredCategories[0].is_trending === 1 && (
//                       <div className="absolute top-5 right-5">
//                         <span className="bg-primary text-on-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
//                           <Icon
//                             name="star"
//                             fill={1}
//                             size={12}
//                             className="text-on-primary"
//                           />
//                           Trending
//                         </span>
//                       </div>
//                     )}

//                     <div className="absolute bottom-0 left-0 w-full p-8 text-white">

//                       <div className="flex justify-between items-end">

//                         <div>
//                           <span className="text-tertiary-fixed font-bold text-xs uppercase tracking-wider mb-1 block">
//                             Featured Category
//                           </span>

//                           <h3 className="text-2xl font-extrabold leading-tight font-headline">
//                             {filteredCategories[0].name}
//                           </h3>
//                         </div>

//                         <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20">

//                           <span className="text-xs font-bold uppercase">
//                             Active
//                           </span>

//                           <Toggle
//                             on={filteredCategories[0].is_active === 1}
//                             onChange={() => { }}
//                           />

//                         </div>

//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* CATEGORY CARDS */}
//                 {displayedCategories.map((c) => (
//                   <div
//                     key={c.id}
//                     className="group bg-surface-container-low rounded-DEFAULT p-4 flex flex-col hover:bg-surface-container-highest transition-all border border-transparent hover:border-primary-fixed/30"
//                   >
//                     {/* IMAGE */}
//                     <div className="aspect-[4/5] rounded-DEFAULT overflow-hidden mb-4 relative">
//                       <img
//                         src={c.icon_url}
//                         alt={c.name}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       />

//                       {/* BADGE */}
//                       <div className="absolute top-3 left-3">
//                         {c.is_premium === 1 ? (
//                           <span className="bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded-sm">
//                             Premium
//                           </span>
//                         ) : (
//                           <span className="bg-surface-container-lowest/80 backdrop-blur-sm text-on-surface-variant text-[10px] font-bold px-2 py-1 rounded-sm">
//                             Free
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* CONTENT */}
//                     <div className="flex justify-between items-start mb-2">
//                       <div>
//                         <h4 className="font-bold text-on-surface text-sm">
//                           {c.name}
//                         </h4>

//                         {/* <p className="text-xs text-on-surface-variant">
//                           Category ID : {c.id}
//                         </p> */}
//                       </div>

//                       <button className="text-on-surface-variant hover:text-primary transition-colors">
//                         <Icon name="more_vert" size={18} />
//                       </button>
//                     </div>

//                     {/* TOGGLE */}
//                     <div className="mt-auto pt-3 flex items-center justify-between border-t border-outline-variant/10">
//                       <span className="text-[10px] font-bold text-on-surface-variant uppercase">
//                         Active Status
//                       </span>

//                       <Toggle
//                         on={c.is_active === 1}
//                         onChange={() => { }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* EMPTY */}
//             {filteredCategories.length === 0 && (
//               <div className="py-24 text-center text-on-surface-variant">
//                 No categories found
//               </div>
//             )}

//             {/* FOOTER */}
//             <div className="py-10 flex flex-col items-center border-t border-outline-variant/10">
//               <p className="text-on-surface-variant text-sm mb-5">
//                 Showing {displayedCategories.length + (filteredCategories.length > 0 ? 1 : 0)} of{" "}
//                 {filteredCategories.length} categories
//               </p>

//               {visibleCount + 1 < filteredCategories.length && (
//                 <button
//                   onClick={handleLoadMore}
//                   className="px-8 py-3 bg-secondary-container text-on-secondary-container rounded-DEFAULT font-bold hover:scale-105 transition-all"
//                 >
//                   Load More Templates
//                 </button>
//               )}
//             </div>
//           </>
//         )}
//       </main>
//     </>
//   );
// }



// "use client";



// import { useState } from "react";
// import Topbar from "@/components/Topbar";
// import Icon from "@/components/Icon";
// import Toggle from "@/components/Toggle";

// const filters = ["All Templates", "Inspirational", "Business", "Social Media", "Festivals"];

// const cards = [
//   { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1zNGvV6-kAxtBQdO8ODat7696DDNLikuZXs0383w1UYj894O_0e96LW18HZI-z7PjmgwjX_zBN1_O2z-Ioj03yy-k9DIICkiAWFUutUyp5zvrwx3_AeGq3vO-yR_IkF22w8CXAzpsDbdC1MJmUHMfIO1o3vPPHkdUJ2yN8-7KvVW-258XLupeEo0lRRKgHL8bVfpI2OO3PSC-eyNWrXXtZGIoecBRQHlj_blOYi90tAASUzdyWhNkst0CzGAI7kvGhDoirtWLjpwW", title: "Morning Hustle V2",  cat: "Inspirational", premium: false, on: false },
//   { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxRXLDn1VZvK9_H4LNp55ZPDQEua5VhOGaddkvNbJ5y2qgNo5KWCH9DMCdGaWPHVme7NKcr5106yG7oaCE8Eh2Ws9Qxt9phOTckRH5ZPhzPpXF1YLz-OGsrqB6UkweBB6LrEoOxR3YGRXCjTEgOULpIS6U2EzlQ6igLGg68UZ_-d90d_y7m89wQy4bPwprWqZMqkyKa1LQov-nu8N_DU_NeOBRPQvbZBqPjipJDCuo6IoKRIq3sH3wySSZ3uiXhAuwIxflEHrC2hqj", title: "Digital Summit 2024", cat: "Business",      premium: true,  on: true },
//   { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6ubhIdzS5yX4_BvSrC07J7OhcpzcG7LnlJil8IMOhuuOcdKU3w1RDXlOixuD7ShmBlP5HvcgG39Ue5LK_j_JfFIHxaEb_rBHTlH1xoA_XyzUn3PFN1sXZ0pD5eFHMGGtEu6VbctX6GZFDHfd9SSBqm3hl5c6-k92_xGlMi74FGWJX_urNEqVtOMrulkHg3EzNeRG1THfenQBFpqDvisWR7-xqPwbCKeD_R3zvfPqCmRYujQwn3BipModESN66lKRB0ODLL4_f7n4D", title: "Venture Series C",   cat: "Business",  premium: false, on: false },
//   { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcBe3qwPFLpRuyqJKEYDuSU6tj7X45OXtIEpX0OP5v1xYIAbYzgR7-iBfs2ifuBaOprnZ36Rwb1vmpc6vCEIvDas5SSOOZ6gIcKf-RH8aReR6lk9RLhm9OpBhlRXh9r4rUt20BFQUi3dejbxPZQapcVIVb4svxSLPsOIe-MWzfEtkZgs03-CJ2y70iajKn1pmdLhYWXBePrAIORHUtxr9iMfmEEBAfUhubq3vdGaCdETd0Jt2u6_1jU1Tr5FDtOGrSOklKXxnrC7l0", title: "Metropolis Art Ex",  cat: "Creative",  premium: true,  on: true },
// ];

// export default function TemplatesPage() {
//   const [activeFilter, setActiveFilter] = useState("All Templates");
//   const [premiums, setPremiums] = useState(cards.map((c) => c.on));

//   return (
//     <>
//       <Topbar placeholder="Search templates…" />
//       <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
//         <div className="flex items-end justify-between gap-4">
//           <div>
//             <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight font-headline">
//               Template Library
//             </h2>
//             <p className="text-on-surface-variant text-sm mt-1">Manage and curate your premium visual collection</p>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {filters.map((f) => (
//               <button
//                 key={f}
//                 onClick={() => setActiveFilter(f)}
//                 className={`px-4 py-2 rounded-sm text-xs font-bold flex items-center gap-1 transition-all ${
//                   activeFilter === f
//                     ? "bg-tertiary-container text-on-tertiary-container"
//                     : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
//                 }`}
//               >
//                 {f === "All Templates" && <Icon name="all_inclusive" size={14} />}
//                 {f}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="grid grid-cols-3 gap-6">
//           {/* Featured */}
//           <div className="col-span-2 row-span-2 group relative overflow-hidden bg-surface-container-lowest rounded-DEFAULT border border-outline-variant/10 shadow-sm hover:shadow-xl transition-all duration-500">
//             <div className="h-[420px] relative overflow-hidden">
//               <img
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTag12Gla_FqbYvNbjecrk1fFyIuBIcKxxhVbHzM69aRk8LxMo9fcdh4vk7fWesJkfyxHdHdIN6ostq-Cz-l2iUiGTuFfyX7rpW4VpX9TL3N8j5UqFYAFrPsCakLA-dpSbQpmKVBifWce-0AiGwZE-Rl9jTpszkGuVGerxbMy3VgOm5mMMtb8PzBPupDsCOP5jbYk3MnSt2QCAwjVRojNOq1wL4fXFzUsvE7ruD3oMeD0v0RtVLcg8-k75VBtDGQLv9Ew1aUvcP00Q"
//                 alt="Featured template"
//                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
//               <div className="absolute top-5 right-5">
//                 <span className="bg-primary text-on-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
//                   <Icon name="star" fill={1} size={12} className="text-on-primary" />
//                   Premium
//                 </span>
//               </div>
//               <div className="absolute bottom-0 left-0 w-full p-8 text-white">
//                 <div className="flex justify-between items-end">
//                   <div>
//                     <span className="text-tertiary-fixed font-bold text-xs uppercase tracking-wider mb-1 block">
//                       Luxury Collection
//                     </span>
//                     <h3 className="text-2xl font-extrabold leading-tight font-headline">
//                       Minimalist Executive Poster
//                     </h3>
//                   </div>
//                   <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20">
//                     <span className="text-xs font-bold uppercase">Status</span>
//                     <Toggle on={true} onChange={() => {}} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Small cards */}
//           {cards.map((c, i) => (
//             <div key={i} className="group bg-surface-container-low rounded-DEFAULT p-4 flex flex-col hover:bg-surface-container-highest transition-all border border-transparent hover:border-primary-fixed/30">
//               <div className="aspect-[4/5] rounded-DEFAULT overflow-hidden mb-4 relative">
//                 <img
//                   src={c.img}
//                   alt={c.title}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                 />
//                 <div className="absolute top-3 left-3">
//                   {c.premium ? (
//                     <span className="bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded-sm">Premium</span>
//                   ) : (
//                     <span className="bg-surface-container-lowest/80 backdrop-blur-sm text-on-surface-variant text-[10px] font-bold px-2 py-1 rounded-sm">Free</span>
//                   )}
//                 </div>
//               </div>
//               <div className="flex justify-between items-start mb-2">
//                 <div>
//                   <h4 className="font-bold text-on-surface text-sm">{c.title}</h4>
//                   <p className="text-xs text-on-surface-variant">{c.cat}</p>
//                 </div>
//                 <button className="text-on-surface-variant hover:text-primary transition-colors">
//                   <Icon name="more_vert" size={18} />
//                 </button>
//               </div>
//               <div className="mt-auto pt-3 flex items-center justify-between border-t border-outline-variant/10">
//                 <span className="text-[10px] font-bold text-on-surface-variant uppercase">Premium Toggle</span>
//                 <Toggle
//                   on={premiums[i]}
//                   onChange={(v) => setPremiums((prev) => prev.map((p, j) => (j === i ? v : p)))}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="py-10 flex flex-col items-center border-t border-outline-variant/10">
//           <p className="text-on-surface-variant text-sm mb-5">Showing 12 of 148 templates</p>
//           <button className="px-8 py-3 bg-secondary-container text-on-secondary-container rounded-DEFAULT font-bold hover:scale-105 transition-all">
//             Load More Templates
//           </button>
//         </div>
//       </main>
//     </>
//   );
// }
