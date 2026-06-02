"use client";

import { useCallback, useEffect, useState } from "react";
import axios,{AxiosError} from "axios";
import { useParams, useRouter } from "next/navigation";

import Topbar from "@/components/Topbar";
import Icon from "@/components/Icon";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    country_code: "+91",
    is_premium: 2,
    status: 1,
  });

  // =========================
  // FETCH USER
  // =========================
  

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:3000/api/user/users/${id}`
      );

      const user = res.data.data;

      setForm({
        full_name: user.full_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        country_code: user.country_code || "+91",
        is_premium: Number(user.is_premium) || 2,
        status: Number(user.status) || 1,
      });
    } catch (error:unknown) {
      console.log("Fetch user error:", error);
      alert("Failed to load user");
    } finally {
      setLoading(false);
    }
  },[id]);
  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id,fetchUser]);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // UPDATE USER
  // =========================
  const handleUpdate = async () => {
    try {
      setSaving(true);

      await axios.put(
        `http://localhost:3000/api/user/users/${id}`,
        {
          full_name: form.full_name,
          email: form.email,
          phone_number: form.phone_number,
          country_code: form.country_code,
          is_premium: Number(form.is_premium),
          status: Number(form.status),
        }
      );

      alert("User updated successfully");

      router.push("/users");
    } catch (error: unknown) {
      const err= error as AxiosError;
      console.log("Update error:", err.response?.data);


      alert(
           "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Topbar placeholder="Edit User..." />

      <main className="p-4 md:p-6 xl:p-8 max-w-4xl mx-auto w-full">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight font-headline">
              Edit User
            </h2>

            <p className="text-sm text-on-surface-variant mt-1">
              Update user information and account status.
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="px-5 py-2 rounded-full bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container transition-all"
          >
            Back
          </button>
        </div>

        {/* CARD */}
        <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-DEFAULT p-6 md:p-8">

          {loading ? (
            <div className="py-20 text-center text-on-surface-variant">
              Loading user...
            </div>
          ) : (
            <div className="space-y-6">

              {/* FULL NAME */}
              <div>
                <label className="text-sm font-semibold text-on-surface mb-2 block">
                  Full Name
                </label>

                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/20 outline-none focus:border-primary"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm font-semibold text-on-surface mb-2 block">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/20 outline-none focus:border-primary"
                />
              </div>

              {/* PHONE */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div>
                  <label className="text-sm font-semibold text-on-surface mb-2 block">
                    Country Code
                  </label>

                  <input
                    type="text"
                    name="country_code"
                    value={form.country_code}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/20 outline-none focus:border-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-on-surface mb-2 block">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/20 outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* PLAN + STATUS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* PLAN */}
                <div>
                  <label className="text-sm font-semibold text-on-surface mb-2 block">
                    Plan
                  </label>

                  <select
                    name="is_premium"
                    value={form.is_premium}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/20 outline-none focus:border-primary"
                  >
                    <option value={1}>Premium</option>
                    <option value={2}>Free</option>
                  </select>
                </div>

                {/* STATUS */}
                <div>
                  <label className="text-sm font-semibold text-on-surface mb-2 block">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/20 outline-none focus:border-primary"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Pending</option>
                    <option value={2}>Inactive</option>
                  </select>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex items-center gap-3 pt-4">

                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="h-12 px-8 rounded-full bg-primary text-on-primary font-bold flex items-center gap-2 hover:bg-primary-dim transition-all disabled:opacity-50"
                >
                  <Icon name="save" size={18} />

                  {saving ? "Updating..." : "Update User"}
                </button>

                <button
                  onClick={() => router.push("/users")}
                  className="h-12 px-6 rounded-full bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useRouter } from "next/navigation";

// import Topbar from "@/components/Topbar";
// import Icon from "@/components/Icon";

// type User = {
//   user_id_PK: number;
//   full_name: string;
//   email: string;
//   phone_number: string;
//   country_code: string;
//   bio: string;
//   profile_image: string | null;
//   is_premium: number | null;
//   status: number | null;
// };

// export default function EditUserPage() {
//   const router = useRouter();
//   const params = useParams();

//   const id = params.id;

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [form, setForm] = useState({
//     full_name: "",
//     email: "",
//     phone_number: "",
//     country_code: "+91",
//     bio: "",
//     is_premium: 2,
//     status: 1,
//   });

//   // =========================
//   // FETCH USER
//   // =========================
//   useEffect(() => {
//     if (id) {
//       fetchUser();
//     }
//   }, [id]);

//   const fetchUser = async () => {
//     try {
//       setLoading(true);

//       // YOUR API
//       const res = await axios.get(
//         `http://localhost:3000/api/user/profile/${id}`
//       );

//       const user =
//         res.data?.data?.personal ||
//         res.data?.data;

//       setForm({
//         full_name: user.full_name || "",
//         email: user.email || "",
//         phone_number: user.phone_number || "",
//         country_code: user.country_code || "+91",
//         bio: user.bio || "",
//         is_premium: Number(user.is_premium) || 2,
//         status:
//           user.status !== null &&
//           user.status !== undefined
//             ? Number(user.status)
//             : 1,
//       });
//     } catch (error) {
//       console.log("Fetch user error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // HANDLE CHANGE
//   // =========================
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // =========================
//   // UPDATE USER
//   // =========================
//   const handleSubmit = async (
//     e: React.FormEvent
//   ) => {
//     e.preventDefault();

//     try {
//       setSaving(true);

//       // ====================================
//       // UPDATE PROFILE API
//       // ====================================
//       await axios.post(
//         `http://localhost:3000/api/user/profile/personal/${id}`,
//         {
//           full_name: form.full_name,
//           phone_number: form.phone_number,
//           bio: form.bio,
//         }
//       );

//       // ====================================
//       // OPTIONAL:
//       // IF YOU CREATE ADMIN UPDATE API
//       // ====================================
//       // await axios.put(
//       //   `http://localhost:3000/api/user/users/${id}`,
//       //   {
//       //     email: form.email,
//       //     is_premium: form.is_premium,
//       //     status: form.status,
//       //   }
//       // );

//       alert("User updated successfully");

//       router.push("/user");
//     } catch (error) {
//       console.log("Update error:", error);
//       alert("Failed to update user");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <>
//       <Topbar placeholder="Edit user..." />

//       <main className="p-4 md:p-6 xl:p-8 max-w-5xl mx-auto w-full space-y-8">

//         {/* HEADER */}
//         <div className="flex items-center justify-between gap-4">
//           <div>
//             <h1 className="text-[30px] font-extrabold tracking-tight text-on-surface font-headline">
//               Edit User
//             </h1>

//             <p className="text-sm text-on-surface-variant mt-1">
//               Update user profile details and account settings.
//             </p>
//           </div>

//           <button
//             onClick={() => router.push("/user")}
//             className="px-5 py-3 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface text-sm font-bold transition-all flex items-center gap-2"
//           >
//             <Icon name="arrow_back" size={18} />
//             Back
//           </button>
//         </div>

//         {/* LOADING */}
//         {loading ? (
//           <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl p-10 text-center text-on-surface-variant">
//             Loading user...
//           </div>
//         ) : (

//           <form
//             onSubmit={handleSubmit}
//             className="space-y-6"
//           >

//             {/* CARD */}
//             <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden">

//               {/* CARD HEADER */}
//               <div className="px-7 py-5 border-b border-outline-variant/10">
//                 <h2 className="text-lg font-bold text-on-surface">
//                   User Information
//                 </h2>
//               </div>

//               {/* FORM */}
//               <div className="p-7 space-y-6">

//                 {/* FULL NAME + EMAIL */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//                   <div>
//                     <label className="block text-sm font-semibold text-on-surface mb-2">
//                       Full Name
//                     </label>

//                     <input
//                       type="text"
//                       name="full_name"
//                       value={form.full_name}
//                       onChange={handleChange}
//                       placeholder="Enter full name"
//                       className="w-full h-12 rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 text-sm outline-none focus:border-primary transition-all"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-on-surface mb-2">
//                       Email Address
//                     </label>

//                     <input
//                       type="email"
//                       name="email"
//                       value={form.email}
//                       onChange={handleChange}
//                       placeholder="Enter email"
//                       className="w-full h-12 rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 text-sm outline-none focus:border-primary transition-all"
//                     />
//                   </div>
//                 </div>

//                 {/* PHONE + COUNTRY */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//                   <div>
//                     <label className="block text-sm font-semibold text-on-surface mb-2">
//                       Phone Number
//                     </label>

//                     <input
//                       type="text"
//                       name="phone_number"
//                       value={form.phone_number}
//                       onChange={handleChange}
//                       placeholder="Enter phone number"
//                       className="w-full h-12 rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 text-sm outline-none focus:border-primary transition-all"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-on-surface mb-2">
//                       Country Code
//                     </label>

//                     <input
//                       type="text"
//                       name="country_code"
//                       value={form.country_code}
//                       onChange={handleChange}
//                       placeholder="+91"
//                       className="w-full h-12 rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 text-sm outline-none focus:border-primary transition-all"
//                     />
//                   </div>
//                 </div>

//                 {/* BIO */}
//                 <div>
//                   <label className="block text-sm font-semibold text-on-surface mb-2">
//                     Bio
//                   </label>

//                   <textarea
//                     rows={5}
//                     name="bio"
//                     value={form.bio}
//                     onChange={handleChange}
//                     placeholder="Write user bio..."
//                     className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 py-4 text-sm outline-none focus:border-primary transition-all resize-none"
//                   />
//                 </div>

//                 {/* PLAN + STATUS */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//                   {/* PREMIUM */}
//                   <div>
//                     <label className="block text-sm font-semibold text-on-surface mb-2">
//                       Subscription Plan
//                     </label>

//                     <select
//                       name="is_premium"
//                       value={form.is_premium}
//                       onChange={handleChange}
//                       className="w-full h-12 rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 text-sm outline-none focus:border-primary transition-all"
//                     >
//                       <option value={1}>
//                         Premium
//                       </option>

//                       <option value={2}>
//                         Free
//                       </option>
//                     </select>
//                   </div>

//                   {/* STATUS */}
//                   <div>
//                     <label className="block text-sm font-semibold text-on-surface mb-2">
//                       Account Status
//                     </label>

//                     <select
//                       name="status"
//                       value={form.status}
//                       onChange={handleChange}
//                       className="w-full h-12 rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 text-sm outline-none focus:border-primary transition-all"
//                     >
//                       <option value={1}>
//                         Active
//                       </option>

//                       <option value={0}>
//                         Pending
//                       </option>

//                       <option value={2}>
//                         Inactive
//                       </option>
//                     </select>
//                   </div>
//                 </div>

//               </div>
//             </div>

//             {/* ACTIONS */}
//             <div className="flex items-center justify-end gap-3">

//               <button
//                 type="button"
//                 onClick={() => router.push("/user")}
//                 className="h-12 px-6 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface font-bold transition-all"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="h-12 px-7 rounded-full bg-primary hover:bg-primary-dim text-on-primary font-bold transition-all flex items-center gap-2 shadow-primary disabled:opacity-60"
//               >
//                 <Icon
//                   name="save"
//                   size={18}
//                   className="text-on-primary"
//                 />

//                 {saving
//                   ? "Updating..."
//                   : "Update User"}
//               </button>
//             </div>

//           </form>
//         )}
//       </main>
//     </>
//   );
// }




// // "use client";

// // import {
// //     useEffect,
// //     useState
// // } from "react";

// // import axios from "axios";

// // import {
// //     useParams,
// //     useRouter
// // } from "next/navigation";

// // import Topbar from "@/components/Topbar";
// // import Icon from "@/components/Icon";

// // export default function EditUserPage() {

// //     const params = useParams();
// //     const router = useRouter();

// //     const id = params.id;

// //     const [loading, setLoading] =
// //         useState(true);

// //     const [saving, setSaving] =
// //         useState(false);

// //     const [form, setForm] =
// //         useState({
// //             full_name: "",
// //             email: "",
// //             phone_number: "",
// //             country_code: "+91",
// //             is_premium: 2,
// //             status: 1
// //         });

// //     // ================= FETCH USER
// //     useEffect(() => {

// //         fetchUser();

// //     }, []);

// //     const fetchUser = async () => {

// //         try {

// //             const res =
// //                 await axios.get(
// //                     `http://localhost:3000/api/user/users/${id}`
// //                 );

// //             setForm(res.data.data);

// //         } catch (error) {

// //             console.log(error);

// //         } finally {

// //             setLoading(false);
// //         }
// //     };

// //     // ================= UPDATE
// //     const handleUpdate =
// //         async () => {

// //             try {

// //                 setSaving(true);

// //                 await axios.put(
// //                     `http://localhost:3000/api/user/users/${id}`,
// //                     form
// //                 );

// //                 alert(
// //                     "User updated successfully"
// //                 );

// //                 router.push("/users");

// //             } catch (error) {

// //                 console.log(error);

// //             } finally {

// //                 setSaving(false);
// //             }
// //         };

// //     if (loading) {
// //         return (
// //             <div className="p-10">
// //                 Loading...
// //             </div>
// //         );
// //     }

// //     return (
// //         <>
// //             <Topbar placeholder="Search..." />

// //             <main className="p-8 max-w-4xl mx-auto">

// //                 <div className="flex items-center justify-between mb-8">

// //                     <div>
// //                         <h1 className="text-3xl font-black">
// //                             Edit User
// //                         </h1>

// //                         <p className="text-on-surface-variant text-sm mt-1">
// //                             Update user information
// //                         </p>
// //                     </div>

// //                     <button
// //                         onClick={() =>
// //                             router.push("/users")
// //                         }
// //                         className="px-5 py-3 rounded-full bg-surface-container-low"
// //                     >
// //                         Back
// //                     </button>
// //                 </div>

// //                 <div className="bg-surface-container-lowest rounded-DEFAULT border border-outline-variant/10 p-8 space-y-6">

// //                     {/* FULL NAME */}
// //                     <div>
// //                         <label className="text-sm font-semibold mb-2 block">
// //                             Full Name
// //                         </label>

// //                         <input
// //                             type="text"
// //                             value={form.full_name}
// //                             onChange={(e) =>
// //                                 setForm({
// //                                     ...form,
// //                                     full_name:
// //                                         e.target.value
// //                                 })
// //                             }
// //                             className="w-full h-12 px-4 rounded-xl bg-surface-container-low outline-none"
// //                         />
// //                     </div>

// //                     {/* EMAIL */}
// //                     <div>
// //                         <label className="text-sm font-semibold mb-2 block">
// //                             Email
// //                         </label>

// //                         <input
// //                             type="email"
// //                             value={form.email}
// //                             onChange={(e) =>
// //                                 setForm({
// //                                     ...form,
// //                                     email:
// //                                         e.target.value
// //                                 })
// //                             }
// //                             className="w-full h-12 px-4 rounded-xl bg-surface-container-low outline-none"
// //                         />
// //                     </div>

// //                     {/* PHONE */}
// //                     <div>
// //                         <label className="text-sm font-semibold mb-2 block">
// //                             Phone
// //                         </label>

// //                         <input
// //                             type="text"
// //                             value={form.phone_number}
// //                             onChange={(e) =>
// //                                 setForm({
// //                                     ...form,
// //                                     phone_number:
// //                                         e.target.value
// //                                 })
// //                             }
// //                             className="w-full h-12 px-4 rounded-xl bg-surface-container-low outline-none"
// //                         />
// //                     </div>

// //                     {/* PLAN */}
// //                     <div>
// //                         <label className="text-sm font-semibold mb-2 block">
// //                             Plan
// //                         </label>

// //                         <select
// //                             value={form.is_premium}
// //                             onChange={(e) =>
// //                                 setForm({
// //                                     ...form,
// //                                     is_premium:
// //                                         Number(
// //                                             e.target.value
// //                                         )
// //                                 })
// //                             }
// //                             className="w-full h-12 px-4 rounded-xl bg-surface-container-low outline-none"
// //                         >
// //                             <option value={1}>
// //                                 Premium
// //                             </option>

// //                             <option value={2}>
// //                                 Free
// //                             </option>
// //                         </select>
// //                     </div>

// //                     {/* STATUS */}
// //                     <div>
// //                         <label className="text-sm font-semibold mb-2 block">
// //                             Status
// //                         </label>

// //                         <select
// //                             value={form.status}
// //                             onChange={(e) =>
// //                                 setForm({
// //                                     ...form,
// //                                     status:
// //                                         Number(
// //                                             e.target.value
// //                                         )
// //                                 })
// //                             }
// //                             className="w-full h-12 px-4 rounded-xl bg-surface-container-low outline-none"
// //                         >
// //                             <option value={1}>
// //                                 Active
// //                             </option>

// //                             <option value={0}>
// //                                 Pending
// //                             </option>

// //                             <option value={2}>
// //                                 Inactive
// //                             </option>
// //                         </select>
// //                     </div>

// //                     {/* SAVE */}
// //                     <button
// //                         onClick={handleUpdate}
// //                         disabled={saving}
// //                         className="h-12 px-8 rounded-full bg-primary text-on-primary font-bold"
// //                     >
// //                         {saving
// //                             ? "Updating..."
// //                             : "Update User"}
// //                     </button>
// //                 </div>
// //             </main>
// //         </>
// //     );
// // }