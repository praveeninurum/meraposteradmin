"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Topbar from "@/components/Topbar";
import Icon from "@/components/Icon";

import { useRouter } from "next/navigation";
interface Plan {
  plan_id_PK: number;
  plan_name: string;
  amount: number;
  duration_months: number;
  plan_type: number;
  is_active: number;
}

interface Stats {
  active_users: number;
  premium_users: number;
  free_users: number;
  total_revenue: number;
}

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);

  const [search, setSearch] = useState("");

  const [stats, setStats] = useState<Stats>({
    active_users: 0,
    premium_users: 0,
    free_users: 0,
    total_revenue: 0,
  });

  

    const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);

      const [plansRes, statsRes] = await Promise.all([
        fetch("http://localhost:3000/api/plans"),
        fetch("http://localhost:3000/api/stats"),
      ]);

      const plansData = await plansRes.json();
      const statsData = await statsRes.json();

      if (plansData.status) {
        setPlans(plansData.data);
      }

      if (statsData.status) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.log("FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };


const searchText = search.toLowerCase().trim();

const statsMatch =
  String(stats.active_users).includes(searchText) ||
  String(stats.premium_users).includes(searchText) ||
  String(stats.free_users).includes(searchText) ||
  String(stats.total_revenue).includes(searchText);

const filteredPlans = plans.filter((plan) => {
  return (
    plan.plan_name
      ?.toLowerCase()
      .includes(searchText) ||

    String(plan.amount)
      .includes(searchText) ||

    String(plan.duration_months)
      .includes(searchText) ||

    (plan.plan_type === 1
      ? "premium"
      : "free")
      .includes(searchText) ||

    (plan.is_active === 1
      ? "active"
      : "inactive")
      .includes(searchText)
  );
});




const filteredFreePlan =
  filteredPlans.find(
    (p) => p.plan_type === 2
  );

const filteredPremiumPlans =
  filteredPlans.filter(
    (p) => p.plan_type === 1
  );



  if (loading) {
    return (
      <>
        <Topbar
  placeholder="Search plans…"
  value={search}
  onChange={setSearch}
/>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-primary text-lg font-bold">
            Loading subscriptions...
          </p>
        </div>
      </>
    );
  }

  return (
    <>
     <Topbar
  placeholder="Search plans…"
  value={search}
  onChange={setSearch}
/>

      <main className="p-8 max-w-7xl mx-auto w-full space-y-8 pb-16">
        {/* HEADER */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-primary font-bold text-xs tracking-widest uppercase mb-1">
              Monetization
            </p>

            <h2 className="text-[34px] font-extrabold text-on-surface tracking-tight font-headline">
              Subscription Plans
            </h2>

            <p className="text-on-surface-variant mt-1 max-w-lg">
              Manage your business tiers, pricing
              strategy, and feature availability.
            </p>
          </div>

          <button

           onClick={() => router.push("/subscriptions/create-plan")}
            className="px-7 py-3 text-white rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all"
            style={{
              background:
                "linear-gradient(135deg,#a14200,#8d3900)",
              boxShadow:
                "0 8px 24px rgba(161,66,0,0.22)",
            }}
          >
            <Icon
              name="add_circle"
              fill={1}
              size={18}
              className="text-white"
            />
            Create New Plan
          </button>
        </div>

        {/* REVENUE INSIGHTS TOP */}
        <div className="bg-surface-container rounded-3xl p-8 border border-orange-100 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h3 className="text-2xl font-bold font-headline">
                Revenue Insights
              </h3>

              <p className="text-on-surface-variant text-sm mt-1">
                Live analytics from subscriptions
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
              <div className="bg-surface-container-lowest rounded-2xl p-5 min-w-[180px] border border-orange-100">
                <p className="text-xs text-on-surface-variant">
                  Active Users
                </p>

                <h4 className="text-3xl font-black font-headline mt-1">
                  {stats.active_users}
                </h4>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-5 min-w-[180px] border border-orange-100">
                <p className="text-xs text-on-surface-variant">
                  Premium Users
                </p>

                <h4 className="text-3xl font-black text-primary font-headline mt-1">
                  {stats.premium_users}
                </h4>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-5 min-w-[180px] border border-orange-100">
                <p className="text-xs text-on-surface-variant">
                  Total Revenue
                </p>

                <h4 className="text-3xl font-black text-primary font-headline mt-1">
                  ₹{stats.total_revenue}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* FREE PLAN */}
        {filteredFreePlan && (
          <div className="bg-surface-container-lowest rounded-[30px] p-8 relative overflow-hidden border border-orange-100">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-primary/5 rounded-full blur-3xl" />

            <div className="relative z-10 flex justify-between items-center flex-wrap gap-8">
              <div>
                <span className="px-4 py-1 rounded-full text-xs font-bold uppercase bg-surface-container-high text-on-surface-variant">
                  Free Plan
                </span>

                <h2 className="text-4xl font-black mt-4 font-headline">
                  {filteredFreePlan.plan_name}
                </h2>

                <p className="text-on-surface-variant mt-3 max-w-md">
                  Perfect for getting started with
                  essential features.
                </p>
              </div>

              <div className="text-right">
                <h2 className="text-5xl font-black font-headline">
                  ₹{filteredFreePlan.amount}
                </h2>

                <p className="text-on-surface-variant">
                  {filteredFreePlan.duration_months} Month
                </p>

                <button className="mt-5 px-6 py-3 bg-surface-container-high rounded-xl font-bold text-primary hover:scale-105 transition-all flex items-center gap-2">
                  <Icon name="edit" size={18} />
                  Edit Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PREMIUM PLANS HORIZONTAL */}
        <div>
          <h2 className="text-2xl font-black mb-5 font-headline">
            Premium Plans
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPremiumPlans.map((plan) => (
              <div
                key={plan.plan_id_PK}
                className="bg-white rounded-[30px] overflow-hidden shadow-xl shadow-primary/10 flex border border-orange-100"
              >
                <div className="w-[42%] relative min-h-[320px]">
                  <Image
                    fill
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4MOCjEYCp6WrGjgh2UYzq8Gu-w4NvahTh5KZle_iVWbVkyxI2spxD_Fdcy97TJn5ampv9FjIOgkn88S2UHiAoWyZS76Q9DbOHc0cmBry_QiAYpb4f8bKEncIHi_7_wiFFvs9yV7jJR3aGHe3ADo-f5jVJc232VhnUDDMxGsfMGScdVb3EIP3mSNpOdrdVxVH_8QPQJAjPmkNam5S7-zXMzt-kLEfr_JzDTDFVpVeqX8RuIy8R0qgaJC1sxzwhfyU2d-kgHitctutq"
                    alt="Premium"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="backdrop-blur-md bg-white/20 p-4 rounded-2xl border border-white/30 text-white">
                      <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                        Premium
                      </p>

                      <p className="text-xl font-bold font-headline">
                        {plan.duration_months === 12
                          ? "Yearly Plan"
                          : "Monthly Plan"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-8 bg-surface-container-low flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h2 className="text-3xl font-black font-headline">
                        {plan.plan_name}
                      </h2>

                      <div className="text-right">
                        <h3 className="text-4xl font-black text-primary font-headline">
                          ₹{plan.amount}
                        </h3>

                        <p className="text-sm text-on-surface-variant">
                          /{plan.duration_months} month
                        </p>
                      </div>
                    </div>

                    <ul className="mt-7 space-y-4">
                      {[
                        "Unlimited Templates",
                        "HD Export",
                        "No Watermark",
                        "Cloud Storage",
                      ].map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-3"
                        >
                          <div className="w-7 h-7 rounded-full bg-tertiary-container flex items-center justify-center">
                            <Icon
                              name="verified"
                              fill={1}
                              size={15}
                            />
                          </div>

                          <span className="font-medium">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button  onClick={() =>
  router.push(`/subscriptions/edit-plan/${plan.plan_id_PK}`)
}   className="mt-8 w-full py-4 bg-primary text-white rounded-2xl font-bold flex justify-center items-center gap-2 hover:brightness-110 transition-all">
                    <Icon
                      name="auto_fix_high"
                      size={18}
                    />
                    Edit Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

          {filteredPlans.length === 0 &&
  !statsMatch &&
  searchText && (
    <div className="bg-white rounded-3xl p-12 text-center border border-orange-100">
      <Icon
        name="search_off"
        size={48}
        className="text-primary mx-auto mb-4"
      />

      <h3 className="text-xl font-bold">
        No results found
      </h3>

      <p className="text-on-surface-variant mt-2">
        Try searching by plan name,
        amount, duration,
        active status,
        plan type,
        or revenue statistics.
      </p>
    </div>
)}
      </main>
    </>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Topbar from "@/components/Topbar";
// import Icon from "@/components/Icon";

// interface Plan {
//   plan_id_PK: number;
//   plan_name: string;
//   amount: number;
//   duration_months: number;
//   plan_type: number;
//   is_active: number;
// }

// interface Stats {
//   active_users: number;
//   premium_users: number;
//   total_revenue: number;
// }

// export default function SubscriptionsPage() {
//   const [plans, setPlans] = useState<Plan[]>([]);
//   const [stats, setStats] = useState<Stats>({
//     active_users: 0,
//     premium_users: 0,
//     total_revenue: 0,
//   });

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchSubscriptionData();
//   }, []);

//   const fetchSubscriptionData = async () => {
//     try {
//       setLoading(true);

//       const [planRes, statsRes] = await Promise.all([
//         fetch("http://localhost:3000/api/subscriptions/plans"),
//         fetch("http://localhost:3000/api/subscriptions/stats"),
//       ]);

//       const planData = await planRes.json();
//       const statsData = await statsRes.json();

//       if (planData.status) {
//         setPlans(planData.data);
//       }

//       if (statsData.status) {
//         setStats(statsData.data);
//       }
//     } catch (error) {
//       console.log("SUBSCRIPTION FETCH ERROR", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const freePlan = plans.find((p) => p.plan_type === 2);
//   const premiumPlan = plans.find((p) => p.plan_type === 1);

//   if (loading) {
//     return (
//       <>
//         <Topbar placeholder="Search plans…" />
//         <div className="p-10 text-center text-primary font-bold">
//           Loading subscriptions...
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Topbar placeholder="Search plans…" />

//       <main className="p-8 max-w-7xl mx-auto w-full space-y-10 pb-16">
//         {/* Header */}
//         <div className="flex items-end justify-between gap-4">
//           <div>
//             <p className="text-primary font-bold text-xs tracking-widest uppercase mb-1">
//               Monetization
//             </p>

//             <h2 className="text-[34px] font-extrabold text-on-surface tracking-tight font-headline">
//               Subscription Plans
//             </h2>

//             <p className="text-on-surface-variant mt-1 max-w-lg">
//               Manage your business tiers, pricing strategy, and feature
//               availability for all user segments.
//             </p>
//           </div>

//           <button
//             className="px-7 py-3 text-white rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all"
//             style={{
//               background:
//                 "linear-gradient(135deg,#a14200,#8d3900)",
//               boxShadow:
//                 "0 8px 24px rgba(161,66,0,0.22)",
//             }}
//           >
//             <Icon
//               name="add_circle"
//               fill={1}
//               size={18}
//               className="text-white"
//             />
//             Create New Plan
//           </button>
//         </div>

//         <div className="grid grid-cols-12 gap-8">

//           {/* FREE PLAN */}
//           {freePlan && (
//             <div className="col-span-5 bg-surface-container-lowest rounded-xl p-8 relative overflow-hidden">
//               <div className="absolute -right-12 -top-12 w-48 h-48 bg-tertiary-fixed/10 rounded-full blur-3xl" />

//               <div className="relative z-10">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded-full uppercase tracking-widest mb-4 inline-block">
//                       Entry Level
//                     </span>

//                     <h2 className="text-4xl font-bold font-headline">
//                       {freePlan.plan_name}
//                     </h2>
//                   </div>

//                   <div className="text-right">
//                     <span className="text-4xl font-black font-headline">
//                       ₹{freePlan.amount}
//                     </span>

//                     <span className="text-sm block text-on-surface-variant">
//                       /{freePlan.duration_months} month
//                     </span>
//                   </div>
//                 </div>

//                 <p className="mt-5 text-on-surface-variant leading-relaxed">
//                   Ideal for hobbyists and individual creators just starting
//                   their design journey.
//                 </p>

//                 <ul className="mt-7 space-y-4">
//                   {[
//                     "10 Standard Templates",
//                     "Standard Res Export",
//                   ].map((f) => (
//                     <li
//                       key={f}
//                       className="flex items-center gap-3"
//                     >
//                       <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
//                         <Icon
//                           name="check"
//                           size={14}
//                           className="text-primary"
//                         />
//                       </div>
//                       <span className="text-sm font-medium">
//                         {f}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>

//                 <button className="mt-10 w-full py-4 bg-surface-container-low text-primary font-bold rounded-xl hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
//                   <Icon name="edit" size={18} />
//                   Edit Plan
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* PREMIUM PLAN */}
//           {premiumPlan && (
//             <div className="col-span-7 bg-white rounded-xl overflow-hidden shadow-2xl shadow-primary/10 flex">
//               <div className="w-1/2 relative min-h-[320px]">
//                 <Image
//                   fill
//                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4MOCjEYCp6WrGjgh2UYzq8Gu-w4NvahTh5KZle_iVWbVkyxI2spxD_Fdcy97TJn5ampv9FjIOgkn88S2UHiAoWyZS76Q9DbOHc0cmBry_QiAYpb4f8bKEncIHi_7_wiFFvs9yV7jJR3aGHe3ADo-f5jVJc232VhnUDDMxGsfMGScdVb3EIP3mSNpOdrdVxVH_8QPQJAjPmkNam5S7-zXMzt-kLEfr_JzDTDFVpVeqX8RuIy8R0qgaJC1sxzwhfyU2d-kgHitctutq"
//                   alt="Premium"
//                   className="object-cover"
//                 />

//                 <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />

//                 <div className="absolute bottom-7 left-7 right-7">
//                   <div className="backdrop-blur-md bg-white/20 p-4 rounded-lg border border-white/30 text-white">
//                     <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">
//                       Best Seller
//                     </p>

//                     <p className="text-xl font-bold font-headline">
//                       Premium Tier
//                     </p>

//                     <p className="text-sm opacity-90">
//                       Most preferred by agencies
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="w-1/2 p-8 flex flex-col bg-surface-container-low">
//                 <div className="flex justify-between items-start">
//                   <h2 className="text-4xl font-bold font-headline">
//                     {premiumPlan.plan_name}
//                   </h2>

//                   <div className="text-right">
//                     <span className="text-4xl font-black text-primary font-headline">
//                       ₹{premiumPlan.amount}
//                     </span>

//                     <span className="text-sm block text-on-surface-variant">
//                       /{premiumPlan.duration_months} month
//                     </span>
//                   </div>
//                 </div>

//                 <ul className="mt-8 space-y-4 flex-1">
//                   {[
//                     "Unlimited Templates",
//                     "HD Export & Vectors",
//                     "No Watermark",
//                     "100GB Cloud Storage",
//                   ].map((feature) => (
//                     <li
//                       key={feature}
//                       className="flex items-center gap-3"
//                     >
//                       <div className="w-6 h-6 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
//                         <Icon
//                           name="verified"
//                           fill={1}
//                           size={14}
//                           className="text-on-tertiary-container"
//                         />
//                       </div>

//                       <span className="text-sm font-bold">
//                         {feature}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>

//                 <button className="mt-10 w-full py-4 bg-primary text-on-primary font-bold rounded-xl shadow-primary hover:bg-primary-dim transition-all flex items-center justify-center gap-2">
//                   <Icon
//                     name="auto_fix_high"
//                     size={18}
//                     className="text-on-primary"
//                   />
//                   Edit Premium
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* REVENUE INSIGHTS */}
//           <div className="col-span-8 bg-surface-container rounded-xl p-8 flex items-center gap-8">
//             <div className="flex-1">
//               <h3 className="text-xl font-bold font-headline">
//                 Revenue Insights
//               </h3>

//               <p className="text-on-surface-variant text-sm mt-1">
//                 Subscription analytics from database.
//               </p>

//               <div className="mt-5 flex gap-4">
//                 <div className="bg-surface-container-lowest p-4 rounded-xl flex-1 border border-orange-100/50">
//                   <span className="text-xs text-on-surface-variant block mb-1">
//                     Active Users
//                   </span>

//                   <span className="text-2xl font-black font-headline">
//                     {stats.active_users}
//                   </span>
//                 </div>

//                 <div className="bg-surface-container-lowest p-4 rounded-xl flex-1 border border-orange-100/50">
//                   <span className="text-xs text-on-surface-variant block mb-1">
//                     Premium Users
//                   </span>

//                   <span className="text-2xl font-black text-primary font-headline">
//                     {stats.premium_users}
//                   </span>
//                 </div>

//                 <div className="bg-surface-container-lowest p-4 rounded-xl flex-1 border border-orange-100/50">
//                   <span className="text-xs text-on-surface-variant block mb-1">
//                     Total Revenue
//                   </span>

//                   <span className="text-2xl font-black text-primary font-headline">
//                     ₹{stats.total_revenue}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* NEW TIER */}
//           <div className="col-span-4 bg-secondary-container text-on-secondary-container rounded-xl p-8 relative overflow-hidden flex flex-col justify-between">
//             <div className="absolute top-0 right-0 p-4 opacity-20">
//               <Icon name="rocket_launch" size={64} />
//             </div>

//             <div>
//               <h3 className="text-xl font-bold font-headline">
//                 New Tier?
//               </h3>

//               <p className="text-sm mt-2 opacity-80">
//                 Test a ‘Pro Plus’ or ‘Team’ plan to
//                 increase your average revenue per user.
//               </p>
//             </div>

//             <button className="mt-8 flex items-center justify-center gap-2 py-3 px-6 bg-secondary text-on-secondary rounded-lg font-bold hover:brightness-110 transition-all">
//               Start Drafting
//             </button>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }



//************************************************* //

// import Image from "next/image";
// import Topbar from "@/components/Topbar";
// import Icon from "@/components/Icon";

// export default function SubscriptionsPage() {
//   return (
//     <>
//       <Topbar placeholder="Search plans…" />
//       <main className="p-8 max-w-7xl mx-auto w-full space-y-10 pb-16">
//         <div className="flex items-end justify-between gap-4">
//           <div>
//             <p className="text-primary font-bold text-xs tracking-widest uppercase mb-1">Monetization</p>
//             <h2 className="text-[34px] font-extrabold text-on-surface tracking-tight font-headline">Subscription Plans</h2>
//             <p className="text-on-surface-variant mt-1 max-w-lg">
//               Manage your business tiers, pricing strategy, and feature availability for all user segments.
//             </p>
//           </div>
//           <button
//             className="px-7 py-3 text-white rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all"
//             style={{ background: "linear-gradient(135deg,#a14200,#8d3900)", boxShadow: "0 8px 24px rgba(161,66,0,0.22)" }}
//           >
//             <Icon name="add_circle" fill={1} size={18} className="text-white" />
//             Create New Plan
//           </button>
//         </div>

//         <div className="grid grid-cols-12 gap-8">
//           {/* Free Tier */}
//           <div className="col-span-5 bg-surface-container-lowest rounded-xl p-8 relative overflow-hidden">
//             <div className="absolute -right-12 -top-12 w-48 h-48 bg-tertiary-fixed/10 rounded-full blur-3xl" />
//             <div className="relative z-10">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded-full uppercase tracking-widest mb-4 inline-block">
//                     Entry Level
//                   </span>
//                   <h2 className="text-4xl font-bold font-headline">Free</h2>
//                 </div>
//                 <div className="text-right">
//                   <span className="text-4xl font-black font-headline">$0</span>
//                   <span className="text-sm block text-on-surface-variant">/month</span>
//                 </div>
//               </div>
//               <p className="mt-5 text-on-surface-variant leading-relaxed">
//                 Ideal for hobbyists and individual creators just starting their design journey.
//               </p>
//               <ul className="mt-7 space-y-4">
//                 {["10 Standard Templates", "Standard Res Export"].map((f) => (
//                   <li key={f} className="flex items-center gap-3">
//                     <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
//                       <Icon name="check" size={14} className="text-primary" />
//                     </div>
//                     <span className="text-sm font-medium">{f}</span>
//                   </li>
//                 ))}
//                 {["No Watermark", "HD Vector Export"].map((f) => (
//                   <li key={f} className="flex items-center gap-3 text-on-surface-variant/40">
//                     <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
//                       <Icon name="close" size={14} />
//                     </div>
//                     <span className="text-sm">{f}</span>
//                   </li>
//                 ))}
//               </ul>
//               <button className="mt-10 w-full py-4 bg-surface-container-low text-primary font-bold rounded-xl hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
//                 <Icon name="edit" size={18} />
//                 Edit Plan
//               </button>
//             </div>
//           </div>

//           {/* Premium Tier */}
//           <div className="col-span-7 bg-white rounded-xl overflow-hidden shadow-2xl shadow-primary/10 flex">
//             <div className="w-1/2 relative min-h-[320px]">
//               <Image
//                 fill
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4MOCjEYCp6WrGjgh2UYzq8Gu-w4NvahTh5KZle_iVWbVkyxI2spxD_Fdcy97TJn5ampv9FjIOgkn88S2UHiAoWyZS76Q9DbOHc0cmBry_QiAYpb4f8bKEncIHi_7_wiFFvs9yV7jJR3aGHe3ADo-f5jVJc232VhnUDDMxGsfMGScdVb3EIP3mSNpOdrdVxVH_8QPQJAjPmkNam5S7-zXMzt-kLEfr_JzDTDFVpVeqX8RuIy8R0qgaJC1sxzwhfyU2d-kgHitctutq"
//                 alt="Premium"
//                 className="object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
//               <div className="absolute bottom-7 left-7 right-7">
//                 <div className="backdrop-blur-md bg-white/20 p-4 rounded-lg border border-white/30 text-white">
//                   <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Best Seller</p>
//                   <p className="text-xl font-bold font-headline">Premium Tier</p>
//                   <p className="text-sm opacity-90">Most preferred by agencies</p>
//                 </div>
//               </div>
//             </div>
//             <div className="w-1/2 p-8 flex flex-col bg-surface-container-low">
//               <div className="flex justify-between items-start">
//                 <h2 className="text-4xl font-bold font-headline">Premium</h2>
//                 <div className="text-right">
//                   <span className="text-4xl font-black text-primary font-headline">$29</span>
//                   <span className="text-sm block text-on-surface-variant">/month</span>
//                 </div>
//               </div>
//               <ul className="mt-8 space-y-4 flex-1">
//                 {[
//                   { icon: "verified",           label: "Unlimited Templates" },
//                   { icon: "high_quality",       label: "HD Export & Vectors" },
//                   { icon: "branding_watermark", label: "No Watermark" },
//                   { icon: "cloud_done",         label: "100GB Cloud Storage" },
//                 ].map((f) => (
//                   <li key={f.label} className="flex items-center gap-3">
//                     <div className="w-6 h-6 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
//                       <Icon name={f.icon} fill={1} size={14} className="text-on-tertiary-container" />
//                     </div>
//                     <span className="text-sm font-bold">{f.label}</span>
//                   </li>
//                 ))}
//               </ul>
//               <button className="mt-10 w-full py-4 bg-primary text-on-primary font-bold rounded-xl shadow-primary hover:bg-primary-dim transition-all flex items-center justify-center gap-2">
//                 <Icon name="auto_fix_high" size={18} className="text-on-primary" />
//                 Edit Premium
//               </button>
//             </div>
//           </div>

//           {/* Revenue Insights */}
//           <div className="col-span-8 bg-surface-container rounded-xl p-8 flex items-center gap-8">
//             <div className="flex-1">
//               <h3 className="text-xl font-bold font-headline">Revenue Insights</h3>
//               <p className="text-on-surface-variant text-sm mt-1">Premium conversion increased by 12% this month.</p>
//               <div className="mt-5 flex gap-4">
//                 {[{ label: "Active Users", val: "12,482" }, { label: "Total MRR", val: "$45.2k", color: true }].map((s) => (
//                   <div key={s.label} className="bg-surface-container-lowest p-4 rounded-xl flex-1 border border-orange-100/50">
//                     <span className="text-xs text-on-surface-variant block mb-1">{s.label}</span>
//                     <span className={`text-2xl font-black font-headline ${s.color ? "text-primary" : ""}`}>{s.val}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="w-56 h-28 bg-surface-container-highest rounded-xl flex items-center justify-center border-2 border-dashed border-primary/20">
//               <div className="text-center">
//                 <Icon name="bar_chart" size={32} className="text-primary" />
//                 <p className="text-xs font-bold text-primary mt-1">View Full Report</p>
//               </div>
//             </div>
//           </div>

//           {/* New Tier CTA */}
//           <div className="col-span-4 bg-secondary-container text-on-secondary-container rounded-xl p-8 relative overflow-hidden flex flex-col justify-between">
//             <div className="absolute top-0 right-0 p-4 opacity-20">
//               <Icon name="rocket_launch" size={64} />
//             </div>
//             <div>
//               <h3 className="text-xl font-bold font-headline">New Tier?</h3>
//               <p className="text-sm mt-2 opacity-80">
//                 Test a &lsquo;Pro Plus&rsquo; or &lsquo;Team&rsquo; plan to increase your average revenue per user.
//               </p>
//             </div>
//             <button className="mt-8 flex items-center justify-center gap-2 py-3 px-6 bg-secondary text-on-secondary rounded-lg font-bold hover:brightness-110 transition-all">
//               Start Drafting
//             </button>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }
