// dashboard/DashboardForm.tsx
import { ToDoListCard } from "@/components/dashboard/TodoListCard";
import { MainContentCard } from "@/components/dashboard/MainContentCard";
import { InventorySettingsCard } from "@/components/dashboard/InventorySettingsCard";
import { GachaAreaCard } from "@/components/dashboard/GachaAreaCard";

export const DashboardContent = () => {
    
    const userName = "GUEST_USER"; 
    const currencyAmount = 9999; 

return (
        <div className="w-full max-w-screen-xl px-4 py-10 mx-auto"> 
            <h1 className="text-5xl font-extrabold text-white mb-8 drop-shadow-lg text-center">
                DASHBOARD
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 min-h-[700px] h-full"> 
                
                <div className="md:col-span-2"> 
                    <ToDoListCard />
                </div>

                <div className="md:col-span-2"> 
                    <MainContentCard/>
                </div>
                
                <div className="md:col-span-1 flex flex-col gap-6 h-full">
                    
                    <div >
                        <InventorySettingsCard />
                    </div>
                    <div >
                        <GachaAreaCard />
                    </div>
                </div>

            </div>
        </div>
    );
}