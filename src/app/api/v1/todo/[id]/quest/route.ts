// import {NextResponse, NextRequest} from "next/server";
// import {prisma} from "@/lib/prisma";
// import { getUserIdFromSession } from "@/lib/session";

// //Post add/remove quest
// export async function POST (req: NextRequest, context: { params: { id: string } }) {
//     const userId = await getUserIdFromSession();
//     if (!userId) {
//         // Return 401 even though middleware should catch it, for safety.
//         return NextResponse.json({error: "Unauthorized"}, {status: 401});
//     }

//     const todoId = context.params.id;
//     try{
//         const body = await req.json();
//         const { action } = body;