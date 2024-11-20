// types.ts
export interface ApiError extends Error {
  status: number;
  message: string;
}

// fetcher.ts
export async function fetcher<T = any>([url, token]: [string, string]): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      headers,
      credentials: "include",
    });

    const body = await res.json();

    if (res.ok) {
      return body.data;
    }

    // Create custom error with status code
    const error = new Error(
      body.error || body.message || "An error occurred"
    ) as ApiError;
    error.status = res.status;

    // Handle specific error cases
    switch (res.status) {
      case 401:
        error.message = "Unauthorized - Please login again";
        break;
      case 403:
        error.message = "Forbidden - You don't have permission";
        break;
      case 404:
        error.message = "Resource not found";
        break;
      case 429:
        error.message = "Too many requests - Please try again later";
        break;
      case 500:
        error.message = "Server error - Please try again later";
        break;
    }

    throw error;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Failed to fetch data");
  }
}


export async function fetcherNoToken<T = any>(url: string): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const res = await fetch(url, {
    headers,
    // credentials: "include",
  });

  const body = await res.json();

  if (res.ok) {
    // return body.data;
    return body;
  }
  if (body.error) {
    throw new Error(body.error);
  }
  if (res.status > 399 && body.message) {
    throw new Error(body.message);
  }
  throw new Error("Unknown error when fetching");
}
