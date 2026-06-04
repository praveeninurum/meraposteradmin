
"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Topbar from "@/components/Topbar";
import Icon from "@/components/Icon";
import Toggle from "@/components/Toggle";
import Link from "next/link";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://139.59.1.109:3000";

type Category = {
  id: string;
  name: string;
  icon_url: string;
  is_trending: number;
  lang_type: string;
  active?: boolean;
};

export default function CategoriesPage() {
  const[search,setSearch]=useState("");
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const fetchCategories = useCallback(async () => {
  try {
    setLoading(true);

    const response = await axios.get(
      `${API_URL}/api/categories`
    );

    console.log("API RESPONSE is coming =>", response);

    if (response.data?.status === "success") {
      const formattedData = response.data.data.map(
        (item: Category) => ({
          ...item,
          active: true,
        })
      );


      setRows(formattedData);
     
  
    }
  } catch (error: unknown) {
    console.error("Category Fetch Error =>", error);
  } finally {
    setLoading(false);
  }
}, []);
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const toggle = (i: number, val: boolean) => {
    setRows(
      rows.map((r, idx) =>
        idx === i ? { ...r, active: val } : r
      )
    );
  };
  const handleDelete = async (id: number) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this category?"
  );

  if (!confirmDelete) return;

  try {

    const response = await axios.delete(
      `${API_URL}/api/categories/${id}`
    );

    console.log(
      "DELETE RESPONSE =>",
      response.data
    );

    if (
      response.data?.status === "success"
    ) {

      alert("Category deleted successfully");

      // REMOVE CATEGORY FROM UI
     setRows((prev) =>
  prev.filter(
    (item) => item.id !== String(id)
  )
);
    }

  } catch (error:unknown) {

    console.error(
      "DELETE ERROR =>",
      error
    );

    alert("Delete failed");
  }
};
const filteredRows = rows.filter((item) =>
  item.name
    .toLowerCase()
    .includes(search.toLowerCase()) ||

  item.lang_type
    .toLowerCase()
    .includes(search.toLowerCase()) ||

  item.id
    .toString()
    .includes(search)
);

  return (
    <>
      <Topbar
  placeholder="Search categories…"
  value={search}
  onChange={setSearch}
/>

      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight font-headline">
              Category{" "}
              <em className="text-primary not-italic italic">
                Management
              </em>
            </h2>

            <p className="text-on-surface-variant text-sm mt-1 max-w-md">
              Organize and manage all categories dynamically from API.
            </p>
          </div>

         <Link href="/categories/create">
            <button className="px-7 py-3 bg-primary text-on-primary rounded-full font-bold flex items-center gap-2 shadow-primary hover:bg-primary-dim transition-all">
              <Icon
                name="add_circle"
                fill={1}
                size={18}
                className="text-on-primary"
              />
              Create New Category
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-6 bg-surface-container-low rounded-DEFAULT relative overflow-hidden">
            <p className="text-sm font-medium text-on-surface-variant">
              Total Categories
            </p>

            <h3 className="text-3xl font-bold mt-1 font-headline text-on-surface">
              {/* {filteredRows.length} */}
               {rows.length}
              
            </h3>

            <Icon
              name="category"
              size={56}
              className="absolute -right-3 -bottom-2 rotate-12 opacity-10 text-primary"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-DEFAULT overflow-hidden border border-outline-variant/10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-high/40">
                {[
                  "Thumbnail",
                  "Category Name",
                  "Language",
                  "Trending",
                  "Visibility",
                  "Actions",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant ${
                      i === 5 ? "text-right" : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    Loading categories...
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    No categories found
                  </td>
                </tr>
              ) : (
                filteredRows.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`hover:bg-surface-container-low/40 transition-colors border-t border-outline-variant/5 ${
                      !r.active ? "opacity-70" : ""
                    }`}
                  >
                    {/* Thumbnail */}
                  
                    <td className="px-6 py-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container relative">
                        <Image
                          fill
                          unoptimized
                          src={r.icon_url}
                          alt={r.name}
                          className="object-cover"
                        />
                      </div>
                    </td>

                    {/* Category Name */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-on-surface">
                        {r.name}
                      </p>
    
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Category ID : {r.id}
                      </p>
                    </td>

                    {/* Language */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-sm font-medium rounded-full capitalize">
                        {r.lang_type}
                      </span>
                    </td>

                    {/* Trending */}
                    <td className="px-6 py-4">
                      {r.is_trending === 1 ? (
                        <span className="text-green-600 font-semibold">
                          Trending
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          Normal
                        </span>
                      )}
                    </td>

                    {/* Visibility */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Toggle
                          on={r.active || false}
                          onChange={(v) => toggle(i, v)}
                        />

                        <span
                          className={`text-xs font-bold ${
                            r.active
                              ? "text-tertiary"
                              : "text-on-surface-variant"
                          }`}
                        >
                          {r.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                       <button onClick={() =>router.push(`/categories/edit/${r.id}`) }className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-full transition-all">
                          <Icon name="edit" size={18} /></button>

                       <button
  onClick={() =>
    handleDelete(Number(r.id))
  }
  className="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-full transition-all"
>
  <Icon
    name="delete"
    size={18}
  />
</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="px-6 py-4 bg-surface-container-low/20 flex items-center justify-between border-t border-outline-variant/5">
            <p className="text-xs text-on-surface-variant">
              Showing {filteredRows.length} categories
            </p>
          </div>
        </div>
      </main>
    </>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import Topbar from "@/components/Topbar";
// import Icon from "@/components/Icon";
// import Toggle from "@/components/Toggle";
// import axios from "axios";

// type Category = {
//   thumb: string;
//   name: string;
//   desc: string;
//   count: number;
//   active: boolean;
// };

// const initial: Category[] = [
//   { thumb: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtKKf56NRfBQFrRLV9LP5ag-ZJUT_HASOKA6qq_6N2oZhyWA0M_RUtFClrdrV7kwaormWqEUpQz9A9dq1jWLIBW7MO_kxRbmG4FJNtvdMARjFbPShX1pgP94vPhnJkA8h4Ab0v9a6spLXxLlsreSGY1q8RdqmQWQtyKO6_A_Fdt5u7adzPgstrW11A0qwnlu2pqXubC35Cao3F1CHtBROLilBoa5B19NOeGCyTAp3R-93zT6m7gEPqTtQCBwEdtqSYdcDR9Zr0lWxG", name: "Good Morning",   desc: "Daily inspiration and greetings",     count: 342, active: true },
//   { thumb: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA5FhQIrq_UXqZPacNCWNIVhLegdMxRjfcCExN8fHcIXVXtbaAtnQppn0en0guj2hcFSd8X2b02u6FtmK0GFPyd2UCZok2a2lHN9ncCbUcKCWQURynscMILhHHhw8fvazKEXzSMUNt2XuRaGhrPuMXhqp5zsIExGfR18BsFPrdJqwWYUJZ126N-iiR3e0QPlvRBDSC-DMAc8066Tsy2JuWAiHm_HWEjyF_SufUxR_YjHMUMYzpFPZtEuuEQ-IdrV5LvXRt9BIOnmNj", name: "Motivational",   desc: "Success and personal growth quotes",   count: 215, active: true },
//   { thumb: "https://lh3.googleusercontent.com/aida-public/AB6AXuDImPBGyt7lz-T5OGl7_vn5DBT62ayi6x1-F6fQ9iLMn47Cc6RjKwh4e_0sRF4GPN3wZ27Q29yZEqRAlg1k7v_Tyl5-gafjjI1fHXkd4HEgGH2KEc3MZ6gZwfyi7fOoqg-WmZgZ7Ws-vuH2J-UU95igdpXQbxxNdRIy4jDgQfmu9qO5A7pYMSITSvVd3kNV4YVjfKXOE_FfsQYv-9_Meh_mqMLvSKv1lrXtY0m97cR8WIdoTATl2FKnRzoxGkT7dX1onBIaATySfj3U", name: "Festivals",      desc: "Cultural and religious celebrations", count: 512, active: true },
//   { thumb: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsdaNativVuXBpCX6a6QsNB1PhqAfGC4Lqgz_qslGKk_KuGsQgJOHZq2YigRf1ZyvQ718_5M3ALD6snkysmowH76achyEIpMfqj6l46YNrpnpjeTSPK7uNGq6m-Ut8BMK0AIhoEDBrGyjyAGwzNJ6CZvstr7NOPA6SZ3VwmAVLFkQ4OteQ0ZDDPg4ttsjxvfQRPjq0QHrFieYf_T30DJ-gQfaoR8bczlKVO-BXmskDXRG36UaZw4ckZ1s4YgVFBeKX2Ujg6hWPywjT", name: "Anniversaries",  desc: "Legacy and remembrance (Under review)", count: 88, active: false },
// ];

// export default function CategoriesPage() {
//   const [rows, setRows] = useState(initial);
//   const [category,setCategory] = useState([]);
//   const api ="http://localhost:3000/api/categories";
//   console.log(api);
  
//  const getcategoryData=async()=>{
//   const res= await axios.get(api); 
//   // setCategory(res);
//   console.log(res);
  

//  }
//    useEffect(()=>{
//     getcategoryData();  
//    },[])  
//   const toggle = (i: number, val: boolean) =>
//     setRows(rows.map((r, idx) => (idx === i ? { ...r, active: val } : r)));

//   return (
//     <>
//       <Topbar placeholder="Search categories…" />
//       <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
//         {/* Header */}
//         <div className="flex items-end justify-between gap-4">
//           <div>
//             <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight font-headline">
//               Category{" "}
//               <em className="text-primary not-italic italic">Management</em>
//             </h2>
//             <p className="text-on-surface-variant text-sm mt-1 max-w-md">
//               Organize and curate visual narratives by managing template groups for your community of creators.
//             </p>
//           </div>
//           <button className="px-7 py-3 bg-primary text-on-primary rounded-full font-bold flex items-center gap-2 shadow-primary hover:bg-primary-dim transition-all">
//             <Icon name="add_circle" fill={1} size={18} className="text-on-primary" />
//             Create New Category
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-4 gap-4">
//           {[
//             { label: "Total Categories",  val: "24",        icon: "category",            bg: "bg-surface-container-low",  dark: false },
//             { label: "Active Templates",  val: "1,482",     icon: "auto_awesome_motion", bg: "bg-surface-container-low",  dark: false },
//             { label: "Trending Category", val: "Festivals", icon: "trending_up",         bg: "bg-surface-container-low",  dark: false },
//             { label: "Category Health",   val: "98%",       icon: "verified",            bg: "bg-tertiary-container",     dark: true  },
//           ].map((s, i) => (
//             <div key={i} className={`p-6 ${s.bg} rounded-DEFAULT relative overflow-hidden`}>
//               <p className={`text-sm font-medium ${s.dark ? "text-on-tertiary-container/80" : "text-on-surface-variant"}`}>
//                 {s.label}
//               </p>
//               <h3 className={`text-3xl font-bold mt-1 font-headline ${s.dark ? "text-on-tertiary-container" : "text-on-surface"}`}>
//                 {s.val}
//               </h3>
//               <Icon
//                 name={s.icon}
//                 size={56}
//                 className={`absolute -right-3 -bottom-2 rotate-12 opacity-10 ${s.dark ? "text-on-tertiary-container" : "text-primary"}`}
//               />
//             </div>
//           ))}
//         </div>

//         {/* Table */}
//         <div className="bg-surface-container-lowest rounded-DEFAULT overflow-hidden border border-outline-variant/10">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-surface-container-high/40">
//                 {["Thumbnail", "Category Name", "Templates", "Visibility", "Actions"].map((h, i) => (
//                   <th
//                     key={h}
//                     className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant ${i === 2 ? "text-center" : ""} ${i === 4 ? "text-right" : ""}`}
//                   >
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((r, i) => (
//                 <tr
//                   key={i}
//                   className={`hover:bg-surface-container-low/40 transition-colors border-t border-outline-variant/5 ${!r.active ? "opacity-70" : ""}`}
//                 >
//                   <td className="px-6 py-4">
//                     <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container relative">
//                       <Image fill unoptimized src={r.thumb} alt={r.name} className="object-cover" />
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <p className="font-bold text-on-surface">{r.name}</p>
//                     <p className="text-xs text-on-surface-variant mt-0.5">{r.desc}</p>
//                   </td>
//                   <td className="px-6 py-4 text-center">
//                     <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-sm font-medium rounded-full">
//                       {r.count} Items
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2">
//                       <Toggle on={r.active} onChange={(v) => toggle(i, v)} />
//                       <span className={`text-xs font-bold ${r.active ? "text-tertiary" : "text-on-surface-variant"}`}>
//                         {r.active ? "Active" : "Inactive"}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex justify-end gap-2">
//                       <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-full transition-all">
//                         <Icon name="edit" size={18} />
//                       </button>
//                       <button className="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-full transition-all">
//                         <Icon name="delete" size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div className="px-6 py-4 bg-surface-container-low/20 flex items-center justify-between border-t border-outline-variant/5">
//             <p className="text-xs text-on-surface-variant">Showing 1–4 of 24 categories</p>
//             <div className="flex gap-2">
//               <button className="w-9 h-9 rounded-full border border-outline-variant/20 flex items-center justify-center text-on-surface-variant opacity-40" disabled>
//                 <Icon name="chevron_left" size={20} />
//               </button>
//               {[1, 2, 3].map((n) => (
//                 <button
//                   key={n}
//                   className={`w-9 h-9 rounded-full text-sm font-bold transition-colors ${n === 1 ? "bg-primary text-white" : "hover:bg-surface-container-high text-on-surface-variant"}`}
//                 >
//                   {n}
//                 </button>
//               ))}
//               <button className="w-9 h-9 rounded-full border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
//                 <Icon name="chevron_right" size={20} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Insight Card */}
//         <div className="grid grid-cols-12 gap-6 bg-primary-container/10 p-8 rounded-xl">
//           <div className="col-span-8">
//             <h4 className="text-xl font-bold text-primary mb-2 font-headline">Did you know?</h4>
//             <p className="text-on-surface-variant leading-relaxed">
//               Categories with custom high-resolution thumbnails have an{" "}
//               <strong className="text-primary">85% higher conversion rate</strong> for premium templates.
//               Ensure your categories are visually distinct to help users navigate their creative flow.
//             </p>
//             <div className="mt-6 flex gap-4">
//               <button className="px-6 py-2 bg-surface-container-lowest text-primary rounded-full font-bold text-sm shadow-sm hover:shadow-md transition-all">
//                 View Analytics
//               </button>
//               <button className="px-6 py-2 border border-primary/20 text-primary rounded-full font-bold text-sm hover:bg-primary/5 transition-all">
//                 Optimization Tips
//               </button>
//             </div>
//           </div>
//           <div className="col-span-4 flex justify-center items-center">
//             <div className="w-36 h-36 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 relative">
//               <Icon name="lightbulb" fill={1} size={56} className="text-white" />
//               <div className="absolute -top-3 -right-3 w-10 h-10 bg-tertiary-container rounded-lg flex items-center justify-center rotate-12 shadow-lg">
//                 <Icon name="auto_awesome" size={18} className="text-on-tertiary-container" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }
