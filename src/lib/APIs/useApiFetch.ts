"use client";
import useSWR, { KeyedMutator, SWRConfiguration } from "swr";

import { ApiError, HookReply } from "./types";
import { useGeneralErrorToast } from "./useGeneralErrorToast";
import { fetcher, fetcherNoToken } from "../fetcher";
import { AUTH_API_URL } from "../api-url";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function useApiFetch<T, RawT = T>(
  fetchUrl: string,
  isReadyCondition = true,
  token?: string,
  swrConfig?: SWRConfiguration<RawT | T, ApiError>,
  customFetcher?: ([url, token]: [string, string]) => Promise<RawT | T>
): HookReply<RawT | T> {
  const router = useRouter();
  // const { data: session, status, update } = useSession();
  const isReady = isReadyCondition;

  const fetcherToUse = token ? fetcher : fetcherNoToken;

  const {
    data,
    error,
    mutate,
    isLoading: isDataLoading,
    isValidating,
  } = useSWR<RawT | T, ApiError>(
    isReady ? (token ? [fetchUrl, token] : fetchUrl) : null,
    fetcherToUse,
    {
      ...swrConfig,
      onError: (err) => {
        if (err.status === 401 || err.message.toLowerCase().includes("unauthorized") || err.message.toLowerCase().includes("invalid")) {
          toast.error("Unauthorized, redirecting to login...");
          setTimeout(() => {
            router.push("/login");
          }, 1000);

          return;
        } else {
          toast.error(`${err.message}`);
          setTimeout(() => {
            // push to previous page
            router.back();
          }, 1000);
        }


      }
    }
  );

  // async function updateSessionToken(newToken: any) {
  //   await update({
  //     ...session,
  //     user: {
  //       ...session?.user,
  //       access_token: newToken,
  //     },
  //   });
  // }

  // if (error) {
  //   // console.log(error, "ERROOOOOOOR");
  //   fetch(`${AUTH_API_URL}/refresh-token`, {
  //     headers: {
  //       Authorization: `Bearer ${session?.user?.refresh_token}`, // Ensure refresh token exists
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`Failed to refresh token: ${response.statusText}`);
  //       }
  //       return response.json(); // Parse response JSON
  //     })
  //     .then((resData) => {
  //       updateSessionToken(resData.data.access_token);
  //       mutate();
  //       toast.success("Token Refreshed!");
  //       // console.log(session?.user.access_token, "token baru");
  //     })
  //     .catch((error) => {
  //       console.error("Error refreshing token:", error);
  //     });
  // }
  // useGeneralErrorToast(error);

  // // Check if token invalid, force user to login again
  // if (error?.message.toLocaleLowerCase().includes("invalid")) {

  //   router.push("/login");
  // }

  // if (error) {
  //   console.error(error.);
  //   // toast.error(`${error} redirecting to all apps...`);
  //   // setTimeout(() => {
  //   //   router.push("/");
  //   // }, 1000);
  // }

  // Must include the isReady check, otherwise isLoading is false, but there is no data or error
  const isLoading = !isReady || isDataLoading;

  // useGeneralErrorToast(error);

  if (isLoading) {
    return {
      isLoading: true,
      isValidating,
      data: undefined,
      error: undefined,
      mutate: mutate as KeyedMutator<unknown>,
    };
  }

  return {
    data,
    error,
    isLoading: false,
    isValidating,
    mutate,
  };
}
