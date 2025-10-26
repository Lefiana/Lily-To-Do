import { DashboardContent } from "@/components/dashboard/DashboardForm"; // Import the component

// Remove `async` keyword since we are not awaiting `auth()` or anything else.
export default function DashboardPage() {
    
    // Simply render the content component.
    // The component name here needs to match the imported component's name.
    return (
        <DashboardContent />
    );
}