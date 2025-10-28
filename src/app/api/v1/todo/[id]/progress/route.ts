import {NextResponse, NextRequest} from "next/server";
import {prisma} from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/session";
//patch to update progress by ID /api/v1/todo/id/progress
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        // Return 401 even though middleware should catch it, for safety.
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const todoId = (await context.params).id;
    try{
        const body = await req.json();
        const {progress} = body;
        if (typeof progress !== 'number' || progress < 0 || progress > 100) {
            return NextResponse.json(
                {error: "Missing or invalid required field: progress"},
                {status: 400}
            );
        }
        const updatedTodo = await prisma.todo.update({
            where: {id: todoId, userId}, // Ensure the todo belongs to the user
            data: { progress },
        });

        return NextResponse.json(updatedTodo,{status: 200});
    } catch (error: unknown) {
        console.error("Error updating todo progress:", error);
        
        // Handle the case where the record was not found (P2025)
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return NextResponse.json({ error: "Todo not found or unauthorized" }, { status: 404 });
        }
        
        return NextResponse.json({ error: "Error Updating todo progress" }, { status: 500 });
    }
}