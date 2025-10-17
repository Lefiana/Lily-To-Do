// // src/components/dashboard/DashboardForm.tsx
// import { auth } from "@/lib/auth"; // For fetching user data (Server Component)
// import { ToDoListCard } from "@/components/dashboard/TodoListCard";
// import { MainContentCard } from "@/components/dashboard/MainContentCard";
// import { SettingsCard } from "@/components/dashboard/SettingsCard";

// export default async function DashboardPage() {
//     // 1. Fetch data on the server
//     const session = await auth();
    
//     // Fallback data if session or user data is missing (should be protected by middleware/auth)
//     const userName = session?.user?.name || "User";
    
//     // NOTE: You'd fetch the actual currency amount here using the prisma.currency model
//     const currencyAmount = 1200; // Placeholder value

//     return (
//         // The RootLayoutWrapper already provides min-h-screen and centering, 
//         // so we just define the max-width for the dashboard content itself.
//         <div className="w-full max-w-7xl px-4 py-10 mx-auto">
//             <h1 className="text-5xl font-extrabold text-white mb-8 drop-shadow-lg text-center">
//                 DASHBOARD
//             </h1>

//             {/* 2. Main 3-Column Grid Layout */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[80vh] md:h-[650px]">
                
//                 {/* COLUMN 1: To Do List (25% width) */}
//                 <div className="md:col-span-1">
//                     <ToDoListCard />
//                 </div>

//                 {/* COLUMN 2: Main Content (50% width) */}
//                 <div className="md:col-span-2">
//                     <MainContentCard userName={userName} currencyAmount={currencyAmount} />
//                 </div>
                
//                 {/* COLUMN 3: Settings (25% width) */}
//                 <div className="md:col-span-1">
//                     <SettingsCard />
//                 </div>
//             </div>
//         </div>
//     );
// }

// /* * NOTE: Since this is an async Server Component, you can freely fetch 
// * the currency data and any other user data here and pass it down as props.
// */

// src/components/dashboard/DashboardContent.tsx 
// (Renaming from DashboardForm.tsx to match previous discussion and common practice)

import { ToDoListCard } from "@/components/dashboard/TodoListCard";
import { MainContentCard } from "@/components/dashboard/MainContentCard";
import { InventorySettingsCard } from "@/components/dashboard/InventorySettingsCard";
import { GachaAreaCard } from "@/components/dashboard/GachaAreaCard";
// NOTE: We remove the import of `auth` since we're ignoring user data here.

// Export this as a standard component (not default)
export const DashboardContent = () => {
    
    // 🎯 Ignore user data and use static placeholders
    const userName = "GUEST_USER"; 
    const currencyAmount = 9999; 

    return (
        <div className="w-full max-w-7xl px-4 py-10 mx-auto">
            <h1 className="text-5xl font-extrabold text-white mb-8 drop-shadow-lg text-center">
                DASHBOARD
            </h1>

            {/* 2. Main 3-Column Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[80vh] md:h-[650px]">
                
                {/* COLUMN 1: To Do List (25% width) */}
                <div className="md:col-span-1">
                    <ToDoListCard />
                </div>

                {/* COLUMN 2: Main Content (50% width) */}
                <div className="md:col-span-2">
                    {/* Pass the static data */}
                    <MainContentCard userName={userName} currencyAmount={currencyAmount} />
                </div>
                
                {/* COLUMN 3: Settings (25% width) */}
                <div className="md:col-span-1 flex flex-col space-y-6">
                    
                <div className="flex-1 min-h-[50%]">
                    <InventorySettingsCard />
                </div>
                <div className=" flex-1 min-h-[50%]">
                    <GachaAreaCard />
                </div>
                </div>

            </div>
        </div>
    );
}