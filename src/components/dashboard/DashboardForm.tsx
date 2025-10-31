// dashboard/DashboardForm.tsx
import { ToDoListCard } from "@/components/dashboard/TodoListCard";
import { MainContentCard } from "@/components/dashboard/MainContentCard";
import { InventorySettingsCard } from "@/components/dashboard/InventorySettingsCard";
import { GachaAreaCard } from "@/components/dashboard/GachaAreaCard";

export const DashboardContent = () => {
  return (
    <div className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-10 mx-auto">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-8 drop-shadow-lg text-center">
        DASHBOARD
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 auto-rows-min">
        {/* Left column */}
        <div className="lg:col-span-2">
          <ToDoListCard />
        </div>

        {/* Center column */}
        <div className="lg:col-span-2">
          <MainContentCard />
        </div>

        {/* Right column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <InventorySettingsCard />
          <GachaAreaCard />
        </div>
      </div>
    </div>
  );
};
