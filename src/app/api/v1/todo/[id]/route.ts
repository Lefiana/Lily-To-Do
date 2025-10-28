import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/session";

// Define a type for the update data based on your Prisma Todo model
// Adjust fields as needed to match your schema (e.g., add/remove based on actual Todo fields)
interface TodoUpdateData {
  title?: string;
  description?: string;
  category?: string;
  dailyQuest?: boolean;
  repeatDaily?: boolean;
}

// PUT by ID /api/v1/todo/id
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const userId = await getUserIdFromSession();

    if (!userId) {
        // Return 401 even though middleware should catch it, for safety.
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todoId = (await context.params).id;
    try {
        const body = await req.json();
        const { title, description, category, dailyQuest, repeatDaily } = body;

        if (!title) {
            return NextResponse.json(
                { error: "Missing required fields: id or title" },
                { status: 400 }
            );
        }

        const updatedTodo = await prisma.todo.update({
            where: { id: todoId, userId }, // Ensure the todo belongs to the user
            data: { userId, title, description, category, dailyQuest, repeatDaily },
        });
        return NextResponse.json(updatedTodo, { status: 200 });

    } catch (error: unknown) {  // Changed from 'any' to 'unknown'
        console.error("Error updating todo:", error);
        // Type guard: Check if error is an object with a 'code' property (e.g., Prisma errors)
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return NextResponse.json({ error: "Todo not found or unauthorized" }, { status: 404 });
        }
        return NextResponse.json(
            { error: "Error Updating todo" },
            { status: 500 }
        );
    }
}

// PATCH by ID /api/v1/todo/id
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const userId = await getUserIdFromSession();

    if (!userId) {
        // Return 401 even though middleware should catch it, for safety.
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todoId = (await context.params).id;

    try {
        const body = await req.json();
        const { title, description, category, dailyQuest, repeatDaily } = body;

        // Prepare the update data, only include fields that are provided
        const updateData: TodoUpdateData = {};  // Changed from 'any' to proper type
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (category) updateData.category = category;
        if (dailyQuest !== undefined) updateData.dailyQuest = dailyQuest;  // Fixed incomplete condition
        if (repeatDaily !== undefined) updateData.repeatDaily = repeatDaily;
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: "No fields provided for update" },
                { status: 400 }
            );
        }
        const updatedTodo = await prisma.todo.update({
            where: { id: todoId, userId }, // Ensure the todo belongs to the user
            data: updateData,
        });

        return NextResponse.json(updatedTodo, { status: 200 });

    } catch (error: unknown) {  // Added type for consistency (was missing in original)
        console.error("Error patching todo:", error);
        return NextResponse.json(
            { error: "Error Patching todo" },
            { status: 500 }
        );
    }
}

// GET by Id /api/v1/todo/id
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        // Return 401 even though middleware should catch it, for safety.
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todoId = (await context.params).id;

    try {
        const todos = await prisma.todo.findFirst({
            where: { id: todoId, userId }, // Ensure the todo belongs to the user
            select: {
                id: true,
                title: true,
                description: true,
                category: true,
                dailyQuest: true,
                repeatDaily: true,
                deadline: true,
                createdAt: true,
            },
        });

        if (!todos) {
            return NextResponse.json(
                { error: "Todo not found or unauthorized" },
                { status: 404 }
            );
        }

        return NextResponse.json(todos, { status: 200 });
    } catch (error: unknown) {  // Added type for consistency (was missing in original)
        console.error("Error fetching todo:", error);
        return NextResponse.json(
            { error: "Error Fetching todo" },
            { status: 500 }
        );
    }
}

// DELETE by ID /api/v1/todo/id
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    const userId = await getUserIdFromSession();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todoId = params.id;

    try {
        // Delete the todo
        await prisma.todo.delete({
            where: { id: todoId, userId }, // Ensure the todo belongs to the user
        });
        return NextResponse.json({ message: "Todo deleted successfully" }, { status: 200 });
    } catch (error: unknown) {  // Changed from 'any' to 'unknown'
        console.error("Error deleting todo:", error);
        // Type guard: Check if error is an object with a 'code' property (e.g., Prisma errors)
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return NextResponse.json({ error: "Todo not found or unauthorized" }, { status: 404 });
        }
        return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
    }
}
