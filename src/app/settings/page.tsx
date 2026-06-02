"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

import Topbar from "@/components/Topbar";
import Icon from "@/components/Icon";
type Language = {
  id: number;
  name: string;
  native_name: string;
  iso_code: string;
};

type Banner = {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  bg_gradient_start: string;
  bg_gradient_end: string;
  action_route: string;
  action_label: string;
  is_active: number;
  category_id_FK: number | null;
};
type Settings = {
  application_name: string;
  brand_tagline: string;
  primary_logo: string;
};



export default function SettingsPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [languages, setLanguages] = useState<Language[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [logoPreview, setLogoPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [discarding, setDiscarding] = useState(false);

const [settings, setSettings] = useState<Settings>({
  application_name: "",
  brand_tagline: "",
  primary_logo: "",
});


const [originalSettings, setOriginalSettings] =
  useState<Settings>({
    application_name: "",
    brand_tagline: "",
    primary_logo: "",
  });

const hasChanges = useMemo(() => {
  return (
    settings.application_name !==
      originalSettings.application_name ||
    settings.brand_tagline !==
      originalSettings.brand_tagline ||
    settings.primary_logo !==
      originalSettings.primary_logo
  );
}, [settings, originalSettings]);


console.log({
  hasChanges,
  saving,
  discarding,
  saveDisabled: !hasChanges || saving,
  discardDisabled: !hasChanges || discarding,
});

const fetchSettings = async () => {
  try {
    const res = await axios.get(
      "http://localhost:3000/api/settings"
    );

    const data = {
      application_name:
        res.data.data?.application_name || "",
      brand_tagline:
        res.data.data?.brand_tagline || "",
      primary_logo:
        res.data.data?.primary_logo || "",
    };

    setSettings(data);
    setOriginalSettings(data);
  } catch (error) {
    console.error(error);
  }
};




  const fetchLanguages = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/language/get-languages"
      );

      setLanguages(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/banner/get-banners"
      );

      setBanners(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLanguages();
    fetchBanners();
    fetchSettings();
  }, []);

  const handleDeleteLanguage = async (id: number) => {
    try {
      if (!confirm("Delete this language?")) return;

      await axios.delete(
        `http://localhost:3000/api/language/delete-language/${id}`
      );

      fetchLanguages();
    } catch (error) {
      console.error(error);
    }
  };

  //Delete Handler
  const handleDeleteBanner = async (id: number) => {
    try {
      if (!confirm("Delete this banner?")) return;

      await axios.delete(
        `http://localhost:3000/api/banner/delete-banner/${id}`
      );

      fetchBanners();
    } catch (error) {
      console.error(error);
    }
  };
 //filter
  const filteredLanguages = useMemo(() => {
    return languages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(search.toLowerCase()) ||
        lang.native_name.toLowerCase().includes(search.toLowerCase()) ||
        lang.iso_code.toLowerCase().includes(search.toLowerCase())
    );
  }, [languages, search]);

  const filteredBanners = useMemo(() => {
    return banners.filter(
      (banner) =>
        banner.title.toLowerCase().includes(search.toLowerCase()) ||
        banner.subtitle.toLowerCase().includes(search.toLowerCase())
    );
  }, [banners, search]);


const handleSaveSettings = async () => {
  try {
    setSaving(true);

    await axios.put(
      "http://localhost:3000/api/settings/update",
      settings
    );
setOriginalSettings(settings);
    alert("Settings updated successfully");
  } catch (error) {
    console.error(error);
  } finally {
    setSaving(false);
  }
};


const handleLogoChange = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // Show preview instantly
  const previewUrl = URL.createObjectURL(file);
  setLogoPreview(previewUrl);

  // Optional: upload immediately
  try {
    const formData = new FormData();
    formData.append("logo", file);

    const res = await axios.post(
      "http://localhost:3000/api/settings/upload-logo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setSettings((prev) => ({
      ...prev,
      primary_logo: res.data.url,
    }));
  } catch (error) {
    console.error(error);
  }
};


const handleDiscardChanges = async () => {
  try {
    const confirmed = confirm(
      "Discard all unsaved changes?"
    );

    if (!confirmed) return;

    setDiscarding(true);

   setSettings(originalSettings);
setLogoPreview("");
    alert("Changes discarded");
  } catch (error) {
    console.error(error);
    alert("Failed to reload settings");
  } finally {
    setDiscarding(false);
  }

};


console.log("settings", settings);
console.log("originalSettings", originalSettings);
console.log("hasChanges", hasChanges);



  return (
    <>
      <Topbar
        placeholder="Search settings..."
        value={search}
        onChange={setSearch}
      />
      <main className="p-8 max-w-7xl mx-auto w-full space-y-10 pb-32">
        <div>
          <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight font-headline">Global Settings</h2>
          <p className="text-on-surface-variant text-sm mt-1">Configure core application branding, localization, and promotional content.</p>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Branding */}
          <div className="col-span-7 bg-surface-container-lowest rounded-DEFAULT p-8 relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl" />
            <div className="flex items-center gap-3 mb-7 relative z-10">
              <div className="w-10 h-10 bg-primary-container text-on-primary-container rounded-lg flex items-center justify-center">
                <Icon name="palette" size={20} />
              </div>
              <h3 className="text-xl font-bold font-headline">App Branding</h3>
            </div>
            <div className="space-y-5 relative z-10">
               {/* Application Name */}
  <div>
    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1 mb-2 block">
      Application Name
    </label>

    <input
       value={settings.application_name}
  onChange={(e) =>
    setSettings({
      ...settings,
      application_name: e.target.value,
    })
  }
      
      className="w-full bg-surface-container-low border-none rounded-DEFAULT p-3 text-on-surface font-medium focus:ring-2 focus:ring-primary-fixed-dim transition-all text-sm outline-none"
    />
  </div>

  {/* Brand Tagline */}
  <div>
    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1 mb-2 block">
      Brand Tagline
    </label>

    <input
       value={settings.brand_tagline}
  onChange={(e) =>
    setSettings({
      ...settings,
      brand_tagline: e.target.value,
    })
  }
      className="w-full bg-surface-container-low border-none rounded-DEFAULT p-3 text-on-surface font-medium focus:ring-2 focus:ring-primary-fixed-dim transition-all text-sm outline-none"
    />
  </div>
              <div>
                <input
  type="file"
  accept="image/*"
  id="logoUpload"
  className="hidden"
  onChange={handleLogoChange}
/>
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1 mb-2 block">Primary Logo</label>
                <div className="flex items-center gap-5 p-5 bg-surface-container-low rounded-DEFAULT border-2 border-dashed border-outline-variant/30">
                <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shadow-md shrink-0 relative">
  {logoPreview || settings.primary_logo ? (
  <Image
    src={logoPreview || settings.primary_logo}
    alt="Logo Preview"
    fill
    className="object-contain p-2"
  />
) : (
  <div className="w-full h-full flex items-center justify-center">
    <Icon
      name="frame_person"
      size={36}
      className="text-primary"
    />
  </div>
)}
</div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface mb-1">Upload new brand asset</p>
                    <p className="text-xs text-on-surface-variant mb-3">PNG, SVG or WEBP. Max 2MB.</p>
                  <button
  type="button"
  onClick={() =>
    document.getElementById("logoUpload")?.click()
  }
  className="px-4 py-2 bg-white text-primary border border-primary-fixed rounded-full text-xs font-bold hover:bg-primary-fixed transition-colors"
>
  Replace Image
</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="col-span-5 bg-surface-container-low rounded-DEFAULT p-8">
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary-container text-on-secondary-container rounded-lg flex items-center justify-center">
                  <Icon name="language" size={20} />
                </div>
                <h3 className="text-xl font-bold font-headline">Languages</h3>
              </div>
              <button
                onClick={() => router.push("/settings/language/add")}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed hover:rotate-90 transition-all duration-300"

              ><Icon name="add" size={16} /></button>
              {/* <button onClick={() => router.push("/settings/language/add")}  className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed hover:rotate-90 transition-all duration-300">
                
              </button> */}
            </div>
            <div className="space-y-3">
              {filteredLanguages.map((lang) => (
                <div
                  key={lang.id}
                  className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-DEFAULT group hover:translate-x-1 transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-[10px] font-bold text-on-secondary-fixed">
                      {lang.iso_code.toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        {lang.name}
                      </p>

                      <p className="text-[10px] text-on-surface-variant">
                        {lang.native_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() =>
                        router.push(
                          `/settings/language/edit/${lang.id}`
                        )
                      }
                      className="p-1 text-on-surface-variant hover:text-primary"
                    >
                      <Icon name="edit" size={16} />
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteLanguage(lang.id)
                      }
                      className="p-1 text-error hover:text-error"
                    >
                      <Icon name="delete" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Banner Campaigns */}
          <div className="col-span-12 bg-surface-container-high rounded-xl p-8">
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary text-on-primary rounded-lg flex items-center justify-center">
                  <Icon name="campaign" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-headline">Active Banner Campaigns</h3>
                  <p className="text-xs text-on-primary-fixed-variant">Promotions currently visible in the user app</p>
                </div>
              </div>
              <button onClick={() =>
                router.push("/settings/banner/add")
              } className="px-6 py-3 bg-on-surface text-surface rounded-full font-bold text-sm hover:bg-primary transition-colors flex items-center gap-2">
                <Icon name="upload" size={16} />
                Upload New Banner
              </button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {filteredBanners.map((banner) => (
                <div
                  key={banner.id}
                  className="bg-surface-container-lowest rounded-DEFAULT overflow-hidden group border border-outline-variant/10"
                >
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      fill
                      src={
                        banner.image_url?.includes("example.com")
                          ? "/placeholder-banner.jpg"
                          : banner.image_url
                      }
                      alt={banner.title}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${banner.is_active
                          ? "bg-tertiary-container text-on-tertiary-container"
                          : "bg-error-container text-on-error-container"
                        }`}
                    >
                      {banner.is_active
                        ? "Active"
                        : "Inactive"}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-on-surface">
                        {banner.title}
                      </h4>

                      <span className="text-xs text-on-surface-variant">
                        #{banner.id}
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant line-clamp-2">
                      {banner.subtitle}
                    </p>

                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() =>
                          router.push(
                            `/settings/banner/edit/${banner.id}`
                          )
                        }
                        className="flex-1 py-2 bg-secondary-container text-on-secondary-container rounded-md text-[10px] font-bold uppercase hover:bg-secondary-fixed transition-colors"
                      >
                        Edit Settings
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteBanner(banner.id)
                        }
                        className="p-2 rounded-md hover:bg-error-container/20 text-error transition-colors"
                      >
                        <Icon
                          name="delete"
                          size={18}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button className="h-full min-h-[14rem] border-2 border-dashed border-outline-variant/30 rounded-DEFAULT flex flex-col items-center justify-center gap-3 text-on-surface-variant hover:bg-white/50 hover:border-primary-fixed-dim transition-all group">
                <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon name="add_photo_alternate" size={28} />
                </div>
                <span className="font-bold text-sm">Add New Promotion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sticky save bar */}
        <div className="fixed bottom-8 left-[calc(16rem+2rem)] right-8 flex justify-end z-30 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-xl border border-primary-fixed/30 p-2 rounded-full shadow-2xl flex items-center gap-2 pointer-events-auto">
            <button
  onClick={handleDiscardChanges}
  disabled={!hasChanges || discarding}
  className={`px-7 py-3 font-bold transition-all text-sm flex items-center gap-2 ${
    !hasChanges || discarding
      ? "opacity-50 cursor-not-allowed"
      : "text-on-surface-variant hover:text-primary"
  }`}
>
  {discarding && (
    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  )}

  {discarding
    ? "Discarding..."
    : "Discard Changes"}
</button>
        <button
  onClick={handleSaveSettings}
  disabled={!hasChanges || saving}
 className={`px-8 py-3 text-white rounded-full font-bold flex items-center gap-2 text-sm ${
  !hasChanges || saving
    ? "opacity-50 cursor-not-allowed"
    : ""
}`}
  style={{
    background:
      "linear-gradient(135deg,#a14200,#8d3900)",
  }}
>
  {saving && (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  )}

  {saving ? "Saving..." : "Save Global Settings"}
</button>
          </div>
        </div>
      </main>
    </>
  );
}


/*================/*================================================*/

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import axios from "axios";

// import Topbar from "@/components/Topbar";
// import Icon from "@/components/Icon";
// type Language = {
//   id: number;
//   name: string;
//   native_name: string;
//   iso_code: string;
// };

// type Banner = {
//   id: number;
//   title: string;
//   subtitle: string;
//   image_url: string;
//   bg_gradient_start: string;
//   bg_gradient_end: string;
//   action_route: string;
//   action_label: string;
//   is_active: number;
//   category_id_FK: number | null;
// };
// type Settings = {
//   application_name: string;
//   brand_tagline: string;
//   primary_logo: string;
// };



// export default function SettingsPage() {
//   const router = useRouter();

//   const [search, setSearch] = useState("");

//   const [languages, setLanguages] = useState<Language[]>([]);
//   const [banners, setBanners] = useState<Banner[]>([]);

// const [settings, setSettings] = useState<Settings>({
//   application_name: "",
//   brand_tagline: "",
//   primary_logo: "",
// });

// const fetchSettings = async () => {
//   try {
//     const res = await axios.get("http://localhost:3000/api/settings");

//     setSettings(res.data.data || {});
//   } catch (error) {
//     console.error(error);
//   }
// };
//   const fetchLanguages = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3000/api/language/get-languages"
//       );

//       setLanguages(res.data.data || []);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const fetchBanners = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3000/api/banner/get-banners"
//       );

//       setBanners(res.data.data || []);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchLanguages();
//     fetchBanners();
//     fetchSettings();
//   }, []);

//   const handleDeleteLanguage = async (id: number) => {
//     try {
//       if (!confirm("Delete this language?")) return;

//       await axios.delete(
//         `http://localhost:3000/api/language/delete-language/${id}`
//       );

//       fetchLanguages();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   //Delete Handler
//   const handleDeleteBanner = async (id: number) => {
//     try {
//       if (!confirm("Delete this banner?")) return;

//       await axios.delete(
//         `http://localhost:3000/api/banner/delete-banner/${id}`
//       );

//       fetchBanners();
//     } catch (error) {
//       console.error(error);
//     }
//   };
//  //filter
//   const filteredLanguages = useMemo(() => {
//     return languages.filter(
//       (lang) =>
//         lang.name.toLowerCase().includes(search.toLowerCase()) ||
//         lang.native_name.toLowerCase().includes(search.toLowerCase()) ||
//         lang.iso_code.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [languages, search]);

//   const filteredBanners = useMemo(() => {
//     return banners.filter(
//       (banner) =>
//         banner.title.toLowerCase().includes(search.toLowerCase()) ||
//         banner.subtitle.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [banners, search]);



//   //upload logo handler
// const handleLogoChange = async (
//   e: React.ChangeEvent<HTMLInputElement>
// ) => {
//   try {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     const formData = new FormData();
//     formData.append("logo", file);

//     const res = await axios.post(
//       "http://localhost:3000/api/settings/upload-logo",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     setSettings((prev) => ({
//       ...prev,
//       primary_logo: res.data.url,
//     }));
//   } catch (error) {
//     console.error(error);
//   }
// };



 
// const handleSaveSettings = async () => {
//   try {
//     await axios.put(
//       "http://localhost:3000/api/settings/update",
//       settings
//     );

//     alert("Settings updated successfully");
//   } catch (error) {
//     console.error(error);
//   }
// };


//   return (
//     <>
//       <Topbar
//         placeholder="Search settings..."
//         value={search}
//         onChange={setSearch}
//       />
//       <main className="p-8 max-w-7xl mx-auto w-full space-y-10 pb-32">
//         <div>
//           <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight font-headline">Global Settings</h2>
//           <p className="text-on-surface-variant text-sm mt-1">Configure core application branding, localization, and promotional content.</p>
//         </div>

//         <div className="grid grid-cols-12 gap-8">
//           {/* Branding */}
//           <div className="col-span-7 bg-surface-container-lowest rounded-DEFAULT p-8 relative overflow-hidden">
//             <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl" />
//             <div className="flex items-center gap-3 mb-7 relative z-10">
//               <div className="w-10 h-10 bg-primary-container text-on-primary-container rounded-lg flex items-center justify-center">
//                 <Icon name="palette" size={20} />
//               </div>
//               <h3 className="text-xl font-bold font-headline">App Branding</h3>
//             </div>
//             <div className="space-y-5 relative z-10">
//                {/* Application Name */}
//   <div>
//     <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1 mb-2 block">
//       Application Name
//     </label>

//     <input
//        value={settings.application_name}
//   onChange={(e) =>
//     setSettings({
//       ...settings,
//       application_name: e.target.value,
//     })
//   }
      
//       className="w-full bg-surface-container-low border-none rounded-DEFAULT p-3 text-on-surface font-medium focus:ring-2 focus:ring-primary-fixed-dim transition-all text-sm outline-none"
//     />
//   </div>

//   {/* Brand Tagline */}
//   <div>
//     <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1 mb-2 block">
//       Brand Tagline
//     </label>

//     <input
//        value={settings.brand_tagline}
//   onChange={(e) =>
//     setSettings({
//       ...settings,
//       brand_tagline: e.target.value,
//     })
//   }
//       className="w-full bg-surface-container-low border-none rounded-DEFAULT p-3 text-on-surface font-medium focus:ring-2 focus:ring-primary-fixed-dim transition-all text-sm outline-none"
//     />
//   </div>
//               <div>
//                 <input
//   type="file"
//   accept="image/*"
//   id="logoUpload"
//   className="hidden"
//   onChange={handleLogoChange}
// />
//                 <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1 mb-2 block">Primary Logo</label>
//                 <div className="flex items-center gap-5 p-5 bg-surface-container-low rounded-DEFAULT border-2 border-dashed border-outline-variant/30">
//                 <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shadow-md shrink-0 relative">
//   {settings.primary_logo ? (
//     <Image
//       src={settings.primary_logo}
//       alt="Logo"
//       fill
//       className="object-contain p-2"
//     />
//   ) : (
//     <div className="w-full h-full flex items-center justify-center">
//       <Icon
//         name="frame_person"
//         size={36}
//         className="text-primary"
//       />
//     </div>
//   )}
// </div>
//                   <div>
//                     <p className="text-sm font-semibold text-on-surface mb-1">Upload new brand asset</p>
//                     <p className="text-xs text-on-surface-variant mb-3">PNG, SVG or WEBP. Max 2MB.</p>
//                   <button
//   type="button"
//   onClick={() =>
//     document.getElementById("logoUpload")?.click()
//   }
//   className="px-4 py-2 bg-white text-primary border border-primary-fixed rounded-full text-xs font-bold hover:bg-primary-fixed transition-colors"
// >
//   Replace Image
// </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Languages */}
//           <div className="col-span-5 bg-surface-container-low rounded-DEFAULT p-8">
//             <div className="flex items-center justify-between mb-7">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-secondary-container text-on-secondary-container rounded-lg flex items-center justify-center">
//                   <Icon name="language" size={20} />
//                 </div>
//                 <h3 className="text-xl font-bold font-headline">Languages</h3>
//               </div>
//               <button
//                 onClick={() => router.push("/settings/language/add")}
//                 className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed hover:rotate-90 transition-all duration-300"

//               ><Icon name="add" size={16} /></button>
//               {/* <button onClick={() => router.push("/settings/language/add")}  className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed hover:rotate-90 transition-all duration-300">
                
//               </button> */}
//             </div>
//             <div className="space-y-3">
//               {filteredLanguages.map((lang) => (
//                 <div
//                   key={lang.id}
//                   className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-DEFAULT group hover:translate-x-1 transition-transform"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-[10px] font-bold text-on-secondary-fixed">
//                       {lang.iso_code.toUpperCase()}
//                     </div>

//                     <div>
//                       <p className="text-sm font-bold text-on-surface">
//                         {lang.name}
//                       </p>

//                       <p className="text-[10px] text-on-surface-variant">
//                         {lang.native_name}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <button
//                       onClick={() =>
//                         router.push(
//                           `/settings/language/edit/${lang.id}`
//                         )
//                       }
//                       className="p-1 text-on-surface-variant hover:text-primary"
//                     >
//                       <Icon name="edit" size={16} />
//                     </button>

//                     <button
//                       onClick={() =>
//                         handleDeleteLanguage(lang.id)
//                       }
//                       className="p-1 text-error hover:text-error"
//                     >
//                       <Icon name="delete" size={16} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Banner Campaigns */}
//           <div className="col-span-12 bg-surface-container-high rounded-xl p-8">
//             <div className="flex items-center justify-between mb-7">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-primary text-on-primary rounded-lg flex items-center justify-center">
//                   <Icon name="campaign" size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold font-headline">Active Banner Campaigns</h3>
//                   <p className="text-xs text-on-primary-fixed-variant">Promotions currently visible in the user app</p>
//                 </div>
//               </div>
//               <button onClick={() =>
//                 router.push("/settings/banner/add")
//               } className="px-6 py-3 bg-on-surface text-surface rounded-full font-bold text-sm hover:bg-primary transition-colors flex items-center gap-2">
//                 <Icon name="upload" size={16} />
//                 Upload New Banner
//               </button>
//             </div>
//             <div className="grid grid-cols-3 gap-6">
//               {filteredBanners.map((banner) => (
//                 <div
//                   key={banner.id}
//                   className="bg-surface-container-lowest rounded-DEFAULT overflow-hidden group border border-outline-variant/10"
//                 >
//                   <div className="relative h-36 overflow-hidden">
//                     <Image
//                       fill
//                       src={
//                         banner.image_url?.includes("example.com")
//                           ? "/placeholder-banner.jpg"
//                           : banner.image_url
//                       }
//                       alt={banner.title}
//                       className="object-cover group-hover:scale-105 transition-transform duration-500"
//                     />

//                     <div
//                       className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${banner.is_active
//                           ? "bg-tertiary-container text-on-tertiary-container"
//                           : "bg-error-container text-on-error-container"
//                         }`}
//                     >
//                       {banner.is_active
//                         ? "Active"
//                         : "Inactive"}
//                     </div>
//                   </div>

//                   <div className="p-4 flex flex-col gap-2">
//                     <div className="flex justify-between items-start">
//                       <h4 className="font-bold text-on-surface">
//                         {banner.title}
//                       </h4>

//                       <span className="text-xs text-on-surface-variant">
//                         #{banner.id}
//                       </span>
//                     </div>

//                     <p className="text-xs text-on-surface-variant line-clamp-2">
//                       {banner.subtitle}
//                     </p>

//                     <div className="flex gap-2 mt-1">
//                       <button
//                         onClick={() =>
//                           router.push(
//                             `/settings/banner/edit/${banner.id}`
//                           )
//                         }
//                         className="flex-1 py-2 bg-secondary-container text-on-secondary-container rounded-md text-[10px] font-bold uppercase hover:bg-secondary-fixed transition-colors"
//                       >
//                         Edit Settings
//                       </button>

//                       <button
//                         onClick={() =>
//                           handleDeleteBanner(banner.id)
//                         }
//                         className="p-2 rounded-md hover:bg-error-container/20 text-error transition-colors"
//                       >
//                         <Icon
//                           name="delete"
//                           size={18}
//                         />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               <button className="h-full min-h-[14rem] border-2 border-dashed border-outline-variant/30 rounded-DEFAULT flex flex-col items-center justify-center gap-3 text-on-surface-variant hover:bg-white/50 hover:border-primary-fixed-dim transition-all group">
//                 <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center group-hover:scale-110 transition-transform">
//                   <Icon name="add_photo_alternate" size={28} />
//                 </div>
//                 <span className="font-bold text-sm">Add New Promotion</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Sticky save bar */}
//         <div className="fixed bottom-8 left-[calc(16rem+2rem)] right-8 flex justify-end z-30 pointer-events-none">
//           <div className="bg-white/90 backdrop-blur-xl border border-primary-fixed/30 p-2 rounded-full shadow-2xl flex items-center gap-2 pointer-events-auto">
//             <button className="px-7 py-3 text-on-surface-variant font-bold hover:text-primary transition-colors text-sm">
//               Discard Changes
//             </button>
//             <button
//   onClick={handleSaveSettings}
//   className="px-8 py-3 text-white rounded-full font-bold flex items-center gap-2 text-sm"
//   style={{
//     background:
//       "linear-gradient(135deg,#a14200,#8d3900)",
//   }}
// >
//               <Icon name="save" size={16} className="text-white" />
//               Save Global Settings
//             </button>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }




/*================/*================================================*/

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import axios from "axios";

// import Topbar from "@/components/Topbar";
// import Icon from "@/components/Icon";
// type Language = {
//   id: number;
//   name: string;
//   native_name: string;
//   iso_code: string;
// };

// type Banner = {
//   id: number;
//   title: string;
//   subtitle: string;
//   image_url: string;
//   bg_gradient_start: string;
//   bg_gradient_end: string;
//   action_route: string;
//   action_label: string;
//   is_active: number;
//   category_id_FK: number | null;
// };

// export default function SettingsPage() {
//   const router = useRouter();

//   const [search, setSearch] = useState("");

//   const [languages, setLanguages] = useState<Language[]>([]);
//   const [banners, setBanners] = useState<Banner[]>([]);

//   const fetchLanguages = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3000/api/language/get-languages"
//       );

//       setLanguages(res.data.data || []);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const fetchBanners = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3000/api/banner/get-banners"
//       );

//       setBanners(res.data.data || []);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchLanguages();
//     fetchBanners();
//   }, []);

//   const handleDeleteLanguage = async (id: number) => {
//     try {
//       if (!confirm("Delete this language?")) return;

//       await axios.delete(
//         `http://localhost:3000/api/language/delete-language/${id}`
//       );

//       fetchLanguages();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   //Delete Handler
//   const handleDeleteBanner = async (id: number) => {
//     try {
//       if (!confirm("Delete this banner?")) return;

//       await axios.delete(
//         `http://localhost:3000/api/banner/delete-banner/${id}`
//       );

//       fetchBanners();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   //filter
//   const filteredLanguages = useMemo(() => {
//     return languages.filter(
//       (lang) =>
//         lang.name.toLowerCase().includes(search.toLowerCase()) ||
//         lang.native_name.toLowerCase().includes(search.toLowerCase()) ||
//         lang.iso_code.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [languages, search]);

//   const filteredBanners = useMemo(() => {
//     return banners.filter(
//       (banner) =>
//         banner.title.toLowerCase().includes(search.toLowerCase()) ||
//         banner.subtitle.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [banners, search]);



//   return (
//     <>
//       <Topbar
//         placeholder="Search settings..."
//         value={search}
//         onChange={setSearch}
//       />
//       <main className="p-8 max-w-7xl mx-auto w-full space-y-10 pb-32">
//         <div>
//           <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight font-headline">Global Settings</h2>
//           <p className="text-on-surface-variant text-sm mt-1">Configure core application branding, localization, and promotional content.</p>
//         </div>

//         <div className="grid grid-cols-12 gap-8">
//           {/* Branding */}
//           <div className="col-span-7 bg-surface-container-lowest rounded-DEFAULT p-8 relative overflow-hidden">
//             <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl" />
//             <div className="flex items-center gap-3 mb-7 relative z-10">
//               <div className="w-10 h-10 bg-primary-container text-on-primary-container rounded-lg flex items-center justify-center">
//                 <Icon name="palette" size={20} />
//               </div>
//               <h3 className="text-xl font-bold font-headline">App Branding</h3>
//             </div>
//             <div className="space-y-5 relative z-10">
//               <div className="grid grid-cols-2 gap-5">
//                 {[{ label: "Application Name", val: "Mera Poster" }, { label: "Brand Tagline", val: "Your Daily Visual Voice" }].map((f) => (
//                   <div key={f.label}>
//                     <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1 mb-2 block">{f.label}</label>
//                     <input
//                       defaultValue={f.val}
//                       className="w-full bg-surface-container-low border-none rounded-DEFAULT p-3 text-on-surface font-medium focus:ring-2 focus:ring-primary-fixed-dim transition-all text-sm outline-none"
//                     />
//                   </div>
//                 ))}
//               </div>
//               <div>
//                 <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1 mb-2 block">Primary Logo</label>
//                 <div className="flex items-center gap-5 p-5 bg-surface-container-low rounded-DEFAULT border-2 border-dashed border-outline-variant/30">
//                   <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-md shrink-0">
//                     <Icon name="frame_person" size={36} className="text-primary" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-on-surface mb-1">Upload new brand asset</p>
//                     <p className="text-xs text-on-surface-variant mb-3">PNG, SVG or WEBP. Max 2MB.</p>
//                     <button className="px-4 py-2 bg-white text-primary border border-primary-fixed rounded-full text-xs font-bold hover:bg-primary-fixed transition-colors">
//                       Replace Image
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Languages */}
//           <div className="col-span-5 bg-surface-container-low rounded-DEFAULT p-8">
//             <div className="flex items-center justify-between mb-7">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-secondary-container text-on-secondary-container rounded-lg flex items-center justify-center">
//                   <Icon name="language" size={20} />
//                 </div>
//                 <h3 className="text-xl font-bold font-headline">Languages</h3>
//               </div>
//               <button
//                 onClick={() => router.push("/settings/language/add")}
//                 className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed hover:rotate-90 transition-all duration-300"

//               ><Icon name="add" size={16} /></button>
//               {/* <button onClick={() => router.push("/settings/language/add")}  className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed hover:rotate-90 transition-all duration-300">
                
//               </button> */}
//             </div>
//             <div className="space-y-3">
//               {filteredLanguages.map((lang) => (
//                 <div
//                   key={lang.id}
//                   className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-DEFAULT group hover:translate-x-1 transition-transform"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-[10px] font-bold text-on-secondary-fixed">
//                       {lang.iso_code.toUpperCase()}
//                     </div>

//                     <div>
//                       <p className="text-sm font-bold text-on-surface">
//                         {lang.name}
//                       </p>

//                       <p className="text-[10px] text-on-surface-variant">
//                         {lang.native_name}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <button
//                       onClick={() =>
//                         router.push(
//                           `/settings/language/edit/${lang.id}`
//                         )
//                       }
//                       className="p-1 text-on-surface-variant hover:text-primary"
//                     >
//                       <Icon name="edit" size={16} />
//                     </button>

//                     <button
//                       onClick={() =>
//                         handleDeleteLanguage(lang.id)
//                       }
//                       className="p-1 text-error hover:text-error"
//                     >
//                       <Icon name="delete" size={16} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Banner Campaigns */}
//           <div className="col-span-12 bg-surface-container-high rounded-xl p-8">
//             <div className="flex items-center justify-between mb-7">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-primary text-on-primary rounded-lg flex items-center justify-center">
//                   <Icon name="campaign" size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold font-headline">Active Banner Campaigns</h3>
//                   <p className="text-xs text-on-primary-fixed-variant">Promotions currently visible in the user app</p>
//                 </div>
//               </div>
//               <button onClick={() =>
//                 router.push("/settings/banner/add")
//               } className="px-6 py-3 bg-on-surface text-surface rounded-full font-bold text-sm hover:bg-primary transition-colors flex items-center gap-2">
//                 <Icon name="upload" size={16} />
//                 Upload New Banner
//               </button>
//             </div>
//             <div className="grid grid-cols-3 gap-6">
//               {filteredBanners.map((banner) => (
//                 <div
//                   key={banner.id}
//                   className="bg-surface-container-lowest rounded-DEFAULT overflow-hidden group border border-outline-variant/10"
//                 >
//                   <div className="relative h-36 overflow-hidden">
//                     <Image
//                       fill
//                       src={
//                         banner.image_url?.includes("example.com")
//                           ? "/placeholder-banner.jpg"
//                           : banner.image_url
//                       }
//                       alt={banner.title}
//                       className="object-cover group-hover:scale-105 transition-transform duration-500"
//                     />

//                     <div
//                       className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${banner.is_active
//                           ? "bg-tertiary-container text-on-tertiary-container"
//                           : "bg-error-container text-on-error-container"
//                         }`}
//                     >
//                       {banner.is_active
//                         ? "Active"
//                         : "Inactive"}
//                     </div>
//                   </div>

//                   <div className="p-4 flex flex-col gap-2">
//                     <div className="flex justify-between items-start">
//                       <h4 className="font-bold text-on-surface">
//                         {banner.title}
//                       </h4>

//                       <span className="text-xs text-on-surface-variant">
//                         #{banner.id}
//                       </span>
//                     </div>

//                     <p className="text-xs text-on-surface-variant line-clamp-2">
//                       {banner.subtitle}
//                     </p>

//                     <div className="flex gap-2 mt-1">
//                       <button
//                         onClick={() =>
//                           router.push(
//                             `/settings/banner/edit/${banner.id}`
//                           )
//                         }
//                         className="flex-1 py-2 bg-secondary-container text-on-secondary-container rounded-md text-[10px] font-bold uppercase hover:bg-secondary-fixed transition-colors"
//                       >
//                         Edit Settings
//                       </button>

//                       <button
//                         onClick={() =>
//                           handleDeleteBanner(banner.id)
//                         }
//                         className="p-2 rounded-md hover:bg-error-container/20 text-error transition-colors"
//                       >
//                         <Icon
//                           name="delete"
//                           size={18}
//                         />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               <button className="h-full min-h-[14rem] border-2 border-dashed border-outline-variant/30 rounded-DEFAULT flex flex-col items-center justify-center gap-3 text-on-surface-variant hover:bg-white/50 hover:border-primary-fixed-dim transition-all group">
//                 <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center group-hover:scale-110 transition-transform">
//                   <Icon name="add_photo_alternate" size={28} />
//                 </div>
//                 <span className="font-bold text-sm">Add New Promotion</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Sticky save bar */}
//         <div className="fixed bottom-8 left-[calc(16rem+2rem)] right-8 flex justify-end z-30 pointer-events-none">
//           <div className="bg-white/90 backdrop-blur-xl border border-primary-fixed/30 p-2 rounded-full shadow-2xl flex items-center gap-2 pointer-events-auto">
//             <button className="px-7 py-3 text-on-surface-variant font-bold hover:text-primary transition-colors text-sm">
//               Discard Changes
//             </button>
//             <button
//               className="px-8 py-3 text-white rounded-full font-bold flex items-center gap-2 text-sm"
//               style={{ background: "linear-gradient(135deg,#a14200,#8d3900)" }}
//             >
//               <Icon name="save" size={16} className="text-white" />
//               Save Global Settings
//             </button>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }

/*=================================================================*/

// import Image from "next/image";
// import Topbar from "@/components/Topbar";
// import Icon from "@/components/Icon";

// export default function SettingsPage() {
//   return (
//     <>
//       <Topbar placeholder="Search settings…" />
//       <main className="p-8 max-w-7xl mx-auto w-full space-y-10 pb-32">
//         <div>
//           <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight font-headline">Global Settings</h2>
//           <p className="text-on-surface-variant text-sm mt-1">Configure core application branding, localization, and promotional content.</p>
//         </div>

//         <div className="grid grid-cols-12 gap-8">
//           {/* Branding */}
//           <div className="col-span-7 bg-surface-container-lowest rounded-DEFAULT p-8 relative overflow-hidden">
//             <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl" />
//             <div className="flex items-center gap-3 mb-7 relative z-10">
//               <div className="w-10 h-10 bg-primary-container text-on-primary-container rounded-lg flex items-center justify-center">
//                 <Icon name="palette" size={20} />
//               </div>
//               <h3 className="text-xl font-bold font-headline">App Branding</h3>
//             </div>
//             <div className="space-y-5 relative z-10">
//               <div className="grid grid-cols-2 gap-5">
//                 {[{ label: "Application Name", val: "Mera Poster" }, { label: "Brand Tagline", val: "Your Daily Visual Voice" }].map((f) => (
//                   <div key={f.label}>
//                     <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1 mb-2 block">{f.label}</label>
//                     <input
//                       defaultValue={f.val}
//                       className="w-full bg-surface-container-low border-none rounded-DEFAULT p-3 text-on-surface font-medium focus:ring-2 focus:ring-primary-fixed-dim transition-all text-sm outline-none"
//                     />
//                   </div>
//                 ))}
//               </div>
//               <div>
//                 <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1 mb-2 block">Primary Logo</label>
//                 <div className="flex items-center gap-5 p-5 bg-surface-container-low rounded-DEFAULT border-2 border-dashed border-outline-variant/30">
//                   <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-md shrink-0">
//                     <Icon name="frame_person" size={36} className="text-primary" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-on-surface mb-1">Upload new brand asset</p>
//                     <p className="text-xs text-on-surface-variant mb-3">PNG, SVG or WEBP. Max 2MB.</p>
//                     <button className="px-4 py-2 bg-white text-primary border border-primary-fixed rounded-full text-xs font-bold hover:bg-primary-fixed transition-colors">
//                       Replace Image
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Languages */}
//           <div className="col-span-5 bg-surface-container-low rounded-DEFAULT p-8">
//             <div className="flex items-center justify-between mb-7">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-secondary-container text-on-secondary-container rounded-lg flex items-center justify-center">
//                   <Icon name="language" size={20} />
//                 </div>
//                 <h3 className="text-xl font-bold font-headline">Languages</h3>
//               </div>
//               <button className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed hover:rotate-90 transition-all duration-300">
//                 <Icon name="add" size={16} />
//               </button>
//             </div>
//             <div className="space-y-3">
//               {[
//                 { code: "HI", lang: "Hindi",   sub: "Default Locale", bg: "bg-tertiary-container", tc: "text-on-tertiary-container" },
//                 { code: "MR", lang: "Marathi",  sub: "Active",         bg: "bg-secondary-fixed",    tc: "text-on-secondary-fixed" },
//                 { code: "EN", lang: "English",  sub: "Secondary",      bg: "bg-surface-variant",    tc: "text-on-surface-variant" },
//               ].map((l) => (
//                 <div key={l.code} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-DEFAULT group hover:translate-x-1 transition-transform">
//                   <div className="flex items-center gap-3">
//                     <div className={`w-8 h-8 rounded-full ${l.bg} flex items-center justify-center text-[10px] font-bold ${l.tc}`}>
//                       {l.code}
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold text-on-surface">{l.lang}</p>
//                       <p className="text-[10px] text-on-surface-variant">{l.sub}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <button className="p-1 text-on-surface-variant hover:text-primary">
//                       <Icon name="edit" size={16} />
//                     </button>
//                     <Icon name="check_circle" fill={1} size={18} className="text-tertiary" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Banner Campaigns */}
//           <div className="col-span-12 bg-surface-container-high rounded-xl p-8">
//             <div className="flex items-center justify-between mb-7">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-primary text-on-primary rounded-lg flex items-center justify-center">
//                   <Icon name="campaign" size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold font-headline">Active Banner Campaigns</h3>
//                   <p className="text-xs text-on-primary-fixed-variant">Promotions currently visible in the user app</p>
//                 </div>
//               </div>
//               <button className="px-6 py-3 bg-on-surface text-surface rounded-full font-bold text-sm hover:bg-primary transition-colors flex items-center gap-2">
//                 <Icon name="upload" size={16} />
//                 Upload New Banner
//               </button>
//             </div>
//             <div className="grid grid-cols-3 gap-6">
//               {[
//                 {
//                   img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDb1j10PRjtg8oGrkcLZs5Zrq50eDIMCcO-KQGteCZnAO3EafYHE3XHRV0xd2TQmpVvqGBP84cUMo0kgWj8fpvGdMB97Z_SXGPanQscFMt_K5USJ9UJbmLLcJn7924Py7JAzUDCkmG-eGW1z_HYA46A9AtXqNxYS8fIUV2EvFAngZvi-Lh9sMTDgYwF9DyYdnndeItEJtPXbQVdgvtYZkHEH1_iaJEhzXt4lgMNwQb5xdUq7IkF7E7zlAo7bhdbR86cCypu5qeOG7wG",
//                   badge: "Active", bc: "bg-tertiary-container text-on-tertiary-container",
//                   title: "Diwali Mega Sale", date: "Nov 1 – Nov 15",
//                   desc: "Promotional banner for the upcoming Diwali festive season with 30% discount on templates.",
//                 },
//                 {
//                   img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNvLqkPwP1LYQnxDYSL2B2jDyKEY3iyQvhrpRNNN757xoa_8to5aUFwW1DUuq5gEXQDszadpxwhk6jb6MedPb7esvEBpxahJEWmYWnBCk6VbB3ewoLZyLmMv08KhVszf7zHD1nRX44kfjATYoZntiiIRewRXyH0No18grPKkCZo_QltIVKsxr-CGEApAl2-P7ekY_fBH3upH6tatRfAA8eQ_-8cKv8re7MAxRJbuTH4dUJGcuE3RJWPlNdt3uo_NMyWB1GtSN9T_F",
//                   badge: "Persistent", bc: "bg-secondary-container text-on-secondary-container",
//                   title: "Upgrade to PRO", date: "All Time",
//                   desc: "Global upsell banner for subscription plans, highlighting exclusive features and fonts.",
//                 },
//               ].map((b, i) => (
//                 <div key={i} className="bg-surface-container-lowest rounded-DEFAULT overflow-hidden group border border-outline-variant/10">
//                   <div className="relative h-36 overflow-hidden">
//                     <Image fill src={b.img} alt={b.title} className="object-cover group-hover:scale-105 transition-transform duration-500" />
//                     <div className={`absolute top-3 left-3 ${b.bc} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
//                       {b.badge}
//                     </div>
//                   </div>
//                   <div className="p-4 flex flex-col gap-2">
//                     <div className="flex justify-between items-start">
//                       <h4 className="font-bold text-on-surface">{b.title}</h4>
//                       <span className="text-xs text-on-surface-variant">{b.date}</span>
//                     </div>
//                     <p className="text-xs text-on-surface-variant line-clamp-2">{b.desc}</p>
//                     <div className="flex gap-2 mt-1">
//                       <button className="flex-1 py-2 bg-secondary-container text-on-secondary-container rounded-md text-[10px] font-bold uppercase hover:bg-secondary-fixed transition-colors">
//                         Edit Settings
//                       </button>
//                       <button className="p-2 rounded-md hover:bg-error-container/20 text-error transition-colors">
//                         <Icon name="delete" size={18} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <button className="h-full min-h-[14rem] border-2 border-dashed border-outline-variant/30 rounded-DEFAULT flex flex-col items-center justify-center gap-3 text-on-surface-variant hover:bg-white/50 hover:border-primary-fixed-dim transition-all group">
//                 <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center group-hover:scale-110 transition-transform">
//                   <Icon name="add_photo_alternate" size={28} />
//                 </div>
//                 <span className="font-bold text-sm">Add New Promotion</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Sticky save bar */}
//         <div className="fixed bottom-8 left-[calc(16rem+2rem)] right-8 flex justify-end z-30 pointer-events-none">
//           <div className="bg-white/90 backdrop-blur-xl border border-primary-fixed/30 p-2 rounded-full shadow-2xl flex items-center gap-2 pointer-events-auto">
//             <button className="px-7 py-3 text-on-surface-variant font-bold hover:text-primary transition-colors text-sm">
//               Discard Changes
//             </button>
//             <button
//               className="px-8 py-3 text-white rounded-full font-bold flex items-center gap-2 text-sm"
//               style={{ background: "linear-gradient(135deg,#a14200,#8d3900)" }}
//             >
//               <Icon name="save" size={16} className="text-white" />
//               Save Global Settings
//             </button>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }
