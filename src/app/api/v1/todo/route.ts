// src/app/api/v1/todo/route.ts
import { NextRequest, NextResponse } from "next/server"; 
import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/session";

/**
 * POST /api/v1/todo
 * Create a new todo task for the authenticated user.
 */
export async function POST(req: NextRequest) {
  const userId = await getUserIdFromSession();

  if (!userId) {
    // Return 401 even though middleware should catch it, for safety.
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      description,
      category = "dailyquest",
      dailyQuest = false,
      repeatDaily = false,
    } = body;
    // NOTE: We removed 'userId' from destructuring, as we use the secure one above.

    if (!title) {
      return NextResponse.json(
        { error: "Missing required field: title" },
        { status: 400 }
      );
    }

    // Set a 24h deadline if dailyQuest or repeatDaily is true
    const deadline =
      dailyQuest || repeatDaily
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        : null;

    const newTodo = await prisma.todo.create({
      data: {
        userId, 
        title,
        description,
        category,
        dailyQuest,
        repeatDaily,
        deadline,
      },
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    // Catch JSON parsing errors or Prisma database errors
    console.error("Error creating todo:", error);
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
  }
}

// ------------------------------------------------------------------------------------------------

/**
 * GET /api/v1/todo
 * Fetch all todos for the authenticated user.
 */
export async function GET(req: NextRequest) {
  const userId = await getUserIdFromSession();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // You can safely remove the searchParams logic for userId, 
    // as you ONLY want to fetch todos for the currently logged-in user.
    const todos = await prisma.todo.findMany({
      where: { userId }, 
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}
