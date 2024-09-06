'use client';
import { useEffect } from 'react';

import toast from "react-hot-toast";

export function useGeneralErrorToast(error?: Error): void {
    useEffect(() => {
        if (error?.message) {
            toast.error(error.message);
        } else {
            // toast.error("Unknown Error")
        }
    }, [error, error?.name]);
}