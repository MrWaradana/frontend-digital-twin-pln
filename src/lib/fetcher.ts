export async function fetcher<T = any>([url, token]: [
  string,
  string
]): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    headers,
    credentials: "include",
  });

  const body = await res.json();

  if (res.ok) {
    return body.data;
  }
  if (body.error) {
    throw new Error(body.error);
  }
  if (res.status > 399 && body.message) {
    throw new Error(body.message);
  }
  throw new Error("Unknown error when fetching");
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
