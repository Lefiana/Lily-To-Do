import { auth } from "@/lib/auth";
export async function getUserIdFromSession() {
  const session = await auth();

    if (!session?.user?.id) {
        return null;
    }

    return session.user.id as string;
}
