// // app/dashboard/page.tsx
// // This is an Async Server Component, which is the standard for Next.js 14 pages.

// import { auth } from "@/lib/auth"; // Your auth helper to fetch session data
// import { DashboardPage } from "@/components/dashboard/DashboardForm";
// // ^ Assuming you created this component based on the previous response

// export default async function DashboardPage() {
//     // 1. Fetch the user session data on the server.
//     // The `auth` function is synchronous on the server and uses cookies directly.
//     const session = await auth();

//     // 2. Check for authentication. If the user is not signed in, they should ideally be redirected
//     // by middleware or this page itself. For now, we'll use fallback data.
//     if (!session?.user) {
//         // NOTE: In a production app, you would use a redirect here:
//         // import { redirect } from 'next/navigation';
//         // redirect('/login');
//     }

//     // 3. Prepare the data to pass to the UI components.
//     // We safely use optional chaining and provide fallbacks.
//     const userName = session?.user?.name || "Player";
    
//     // In a real application, you would fetch currency from Prisma using the user ID:
//     // const userCurrencyData = await prisma.currency.findUnique({ where: { userId: session.user.id } });
//     const currencyAmount = 1200; // Placeholder until actual fetch is implemented

//     // 4. Render the Client/Server UI content.
//     // DashboardContent is imported and rendered here.
//     return (
//         <DashboardPage 
//             // userName={userName} 
//             // currencyAmount={currencyAmount} 
//         />
//     );
// }

// // Ensure you also have the corresponding component:
// /*
// // src/components/dashboard/DashboardContent.tsx
// // (This is the file that contains the grid and calls ToDoListCard, MainContentCard, SettingsCard)
// import { ToDoListCard } from "./ToDoListCard";
// // etc...
// export const DashboardContent: React.FC<DashboardContentProps> = ({ userName, currencyAmount }) => { ... };
// */

// app/dashboard/page.tsx

// NOTE: We can remove the `auth` import and all async logic
// since we are ignoring user data for now.
import { DashboardContent } from "@/components/dashboard/DashboardForm"; // Import the component

// Remove `async` keyword since we are not awaiting `auth()` or anything else.
export default function DashboardPage() {
    
    // Simply render the content component.
    // The component name here needs to match the imported component's name.
    return (
        <DashboardContent />
    );
}