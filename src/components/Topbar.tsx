"use client";

import Icon from "./Icon";

interface TopbarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function Topbar({
  placeholder = "Search…",
  value = "",
  onChange,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 h-[58px] bg-white/75 backdrop-blur-md border-b border-outline-variant/15 shadow-sm">
      
      {/* SEARCH */}
      <div className="flex-1 max-w-md relative">
        <Icon
          name="search"
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
        />

        <input
          type="text"
          value={value}
          onChange={(e) =>
            onChange?.(e.target.value)
          }
          className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-full text-sm border-none focus:ring-2 focus:ring-primary-container outline-none transition-all"
          placeholder={placeholder}
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors relative">
          <Icon
            name="notifications"
            size={20}
            className="text-on-surface-variant"
          />

          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
        </button>

        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
          <Icon
            name="help_outline"
            size={20}
            className="text-on-surface-variant"
          />
        </button>

        <div className="h-6 w-px bg-outline-variant/20 mx-1" />

        <span className="text-xs font-bold text-on-surface hidden sm:block">
          Admin Console
        </span>

        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-xs font-bold text-on-primary-container">
          AU
        </div>
      </div>
    </header>
  );
}


// "use client";

// import Icon from "./Icon";

// interface TopbarProps {
//   placeholder?: string;
// }

// export default function Topbar({ placeholder = "Search…" }: TopbarProps) {
//   return (
//     <header className="sticky top-0 z-40 flex items-center justify-between px-6 h-[58px] bg-white/75 backdrop-blur-md border-b border-outline-variant/15 shadow-sm">
//       <div className="flex-1 max-w-md relative">
//         <Icon
//           name="search"
//           size={18}
//           className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
//         />
//         <input
//           className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-full text-sm border-none focus:ring-2 focus:ring-primary-container outline-none transition-all"
//           placeholder={placeholder}
//         />
//       </div>
//       <div className="flex items-center gap-3">
//         <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors relative">
//           <Icon name="notifications" size={20} className="text-on-surface-variant" />
//           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
//         </button>
//         <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
//           <Icon name="help_outline" size={20} className="text-on-surface-variant" />
//         </button>
//         <div className="h-6 w-px bg-outline-variant/20 mx-1" />
//         <span className="text-xs font-bold text-on-surface hidden sm:block">Admin Console</span>
//         <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-xs font-bold text-on-primary-container">
//           AU
//         </div>
//       </div>
//     </header>
//   );
// }
