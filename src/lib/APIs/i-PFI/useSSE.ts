import { useState, useEffect } from "react";
import { PFI_API_URL } from "../../api-url";

const useSSE = (prefix: string) => {
  const url = `${PFI_API_URL}/${prefix}`;
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setData((prev) => {
          // Batasi jumlah data yang disimpan (misalnya, 1000)
          const updatedData = [...prev, parsedData];
          return updatedData.slice(-1000);
        });
      } catch (err) {
        setError("Error parsing data");
      }
    };

    eventSource.onerror = () => {
      setError("Error connecting to SSE");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  return { data, error };
};

export default useSSE;
