"use client";

import useSWR from "swr";

interface UserResponse {
  user: { name: string };
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || `Error ${res.status}`);
  }
  return res.json();
};

export const useUser = () => {
  const { data, error, isLoading } = useSWR<UserResponse>("/api/v1/user", fetcher);

  return {
    userName: data?.user?.name || "",
    userLoading: isLoading,
    userError: error,
  };
};
