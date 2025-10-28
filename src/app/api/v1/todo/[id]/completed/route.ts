import {NextResponse, NextRequest} from "next/server";
import {prisma} from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/session";
import { REWARD_CONFIG } from "@/lib/constants";
 

//PATCH to mark completed by ID /api/v1/todo/id/completed
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {


    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const todoId = params.id;

    try {
        const body = await req.json();
        const { completed, isTimerCompletion = false } = body;

        if (typeof completed !== 'boolean') {
            return NextResponse.json({ error: "Missing or invalid required field: completed (must be boolean)" }, { status: 400 });
        }
        
        // --- 1. Fetch Todo to check current status and type ---
        const todo = await prisma.todo.findFirst({
            where: { id: todoId, userId }
        });

        if (!todo || todo.completed) {
            // Use 404 if not found, or 400 if already completed
            return NextResponse.json({ error: todo ? "Todo is already completed" : "Todo not found or unauthorized" }, 
                { status: todo ? 400 : 404 });
        }
        
        // Determine the reward based on the todo type and timer flag
        let rewardAmount;
        if (isTimerCompletion) {
        rewardAmount = REWARD_CONFIG.TIMER_REWARD; // 🎯 Use timer reward
        } else {
        rewardAmount = todo.dailyQuest ? REWARD_CONFIG.DAILY_QUEST_REWARD : REWARD_CONFIG.DEFAULT_REWARD;
        }
        
        // --- 2. Use Prisma Transaction for Atomicity ---
        const [updatedTodo, updatedCurrency] = await prisma.$transaction([
            // a) Mark Todo as completed
            prisma.todo.update({
                where: { id: todoId, userId },
                data: { completed: completed, progress: 100 }, // Ensure progress is 100
            }),
            
            // b) Award Currency (using upsert ensures the row exists and updates atomically)
            prisma.currency.upsert({
                where: { userId: userId },
                update: {
                    amount: { increment: rewardAmount }, // 💰 Atomic increment
                },
                create: {
                    userId: userId,
                    amount: rewardAmount, // Initial amount if user has no currency record
                },
            }),
        ]);

        return NextResponse.json({ 
            message: "Todo completed and currency awarded successfully",
            todo: updatedTodo,
            currency: updatedCurrency.amount
        }, { status: 200 });

    } catch (error: unknown) {
        console.error("Error updating todo completed status or awarding currency:", error);
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return NextResponse.json({ error: "Todo not found or unauthorized" }, { status: 404 });
        }
        return NextResponse.json({ error: "Error Updating todo completed status" }, { status: 500 });
    }
}
