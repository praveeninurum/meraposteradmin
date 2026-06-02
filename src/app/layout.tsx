import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Be_Vietnam_Pro,
} from "next/font/google";

import "./globals.css";
import Sidebar from "@/components/Sidebar";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-headline",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mera Poster – Admin Console",
  description: "Admin console for the Mera Poster platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${beVietnam.variable}`}
    >
      <head>
  <link
    rel="preconnect"
    href="https://fonts.googleapis.com"
  />

  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossOrigin="anonymous"
  />

  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
  />
</head>
      <body
        className="antialiased bg-background"
        style={{
          fontFamily:
            "var(--font-body), 'Be Vietnam Pro', sans-serif",
        }}
      >
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="ml-64 flex-1 flex flex-col min-h-screen">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}




/*=====================================*/

// import type { Metadata } from "next";
// import {
//   Plus_Jakarta_Sans,
//   Be_Vietnam_Pro,
// } from "next/font/google";

// import "./globals.css";
// import Sidebar from "@/components/Sidebar";

// const plusJakarta = Plus_Jakarta_Sans({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800"],
//   variable: "--font-headline",
//   display: "swap",
// });

// const beVietnam = Be_Vietnam_Pro({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600"],
//   variable: "--font-body",
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: "Mera Poster – Admin Console",
//   description:
//     "Admin console for the Mera Poster platform",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html
//       lang="en"
//       className={`${plusJakarta.variable} ${beVietnam.variable}`}
//     >
//       <head>
//         <link
//           rel="preconnect"
//           href="https://fonts.googleapis.com"
//         />

//         <link
//           rel="preconnect"
//           href="https://fonts.gstatic.com"
//           crossOrigin="anonymous"
//         />

//        <link
//   rel="stylesheet"
//   href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
// />
//       </head>

//       <body
//         className="antialiased bg-background"
//         style={{
//           fontFamily:
//             "var(--font-body), 'Be Vietnam Pro', sans-serif",
//         }}
//       >
//         <div className="flex min-h-screen">
//           <Sidebar />

//           <div className="ml-64 flex-1 flex flex-col min-h-screen">
//             {children}
//           </div>
//         </div>
//       </body>
//     </html>
//   );
// }


// // import type { Metadata } from "next";
// // import { Plus_Jakarta_Sans, Be_Vietnam_Pro } from "next/font/google";

// // import "./globals.css";
// // import Sidebar from "@/components/Sidebar";

// // const plusJakarta = Plus_Jakarta_Sans({
// //   subsets: ["latin"],
// //   weight: ["400", "500", "600", "700", "800"],
// //   variable: "--font-headline",
// //   display: "swap",
// // });

// // const beVietnam = Be_Vietnam_Pro({
// //   subsets: ["latin"],
// //   weight: ["300", "400", "500", "600"],
// //   variable: "--font-body",
// //   display: "swap",
// // });

// // export const metadata: Metadata = {
// //   title: "Mera Poster – Admin Console",
// //   description: "Admin console for the Mera Poster platform",
// // };

// // export default function RootLayout({ children }: { children: React.ReactNode }) {
// //   return (
// //     <html lang="en" className={`${plusJakarta.variable} ${beVietnam.variable}`}>
// //       <head>
// //         {/* Material Symbols variable font – not available via next/font */}
// //         <link
// //           rel="preconnect"
// //           href="https://fonts.googleapis.com"
// //         />
      
// //       </head>
// //       <body className="antialiased bg-background" style={{ fontFamily: "var(--font-body), 'Be Vietnam Pro', sans-serif" }}>
// //         <div className="flex min-h-screen">
// //           <Sidebar />
// //           <div className="ml-64 flex-1 flex flex-col min-h-screen">
// //             {children}
// //           </div>
// //         </div>
// //       </body>
// //     </html>
// //   );
// // }
