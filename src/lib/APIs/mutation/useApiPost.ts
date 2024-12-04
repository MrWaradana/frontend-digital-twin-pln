"use client";
import useSWR, { KeyedMutator, SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";
import { fetcherPost } from "@/lib/fetcher";

import { ApiError, HookReply } from "./../types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function useApiPost<T, RawT = T>(
  postUrl: string,
  isReadyCondition = true,
  token?: string,
  swrConfig?: any
) {
  const router = useRouter();
  // const { data: session, status, update } = useSession();
  const isReady = isReadyCondition;

  const fetcher = fetcherPost;

  const { data, error, isMutating, trigger } = useSWRMutation<
    RawT | T,
    ApiError
  >(isReady ? postUrl : null, fetcher, {
    ...swrConfig,
    onError: (err) => {
      if (
        err.status === 401 ||
        err.message.toLowerCase().includes("unauthorized") ||
        err.message.toLowerCase().includes("invalid")
      ) {
        toast.error(
          `${
            err.message.toLowerCase().includes("unauthorized")
              ? "Unauthorized Token"
              : "Invalid Token"
          }, redirecting to login...`
        );
        setTimeout(() => {
          router.replace(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`);
        }, 1000);

        return;
      } else {
        toast.error(`${err.message}`);
        setTimeout(() => {
          // push to previous page
          router.back();
        }, 1000);
      }
    },
  });

  // Must include the isReady check, otherwise isLoading is false, but there is no data or error
  const isLoading = !isReady || isMutating;

  // useGeneralErrorToast(error);

  if (isLoading) {
    return {
      isLoading: true,
      data: undefined,
      error: undefined,
      trigger: trigger as any,
    };
  }

  return {
    data,
    error,
    isLoading: false,
    trigger,
  };
}
