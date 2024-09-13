"use client";

import { useState, useEffect } from "react";

export const useFetchVariable = async (url: any) => {
  // const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  // const [message, setMessage] = useState("");
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(true); // To show loading state
  const [error, setError] = useState(null); // To handle any errors

  useEffect(() => {
    if (!url) return; // If no URL is provided, exit early

    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch(url); // Fetch data from the API
        if (!response.ok) {
          setStatus(false);
          // setMessage(response.message);
          throw new Error(`Error: ${response.status}`); // Handle non-200 responses
        }
        const json = await response.json(); // Parse JSON
        setData(json); // Set data from the API
      } catch (err: any) {
        setError(err.message); // Catch and store any errors
      } finally {
        setLoading(false); // Stop loading after data is fetched or error occurs
      }
    };

    fetchData(); // Invoke the async function to fetch the data
  }, [url]); // Re-run the effect when the URL changes

  return { data, loading, error };
};
