import { useEffect, useState } from "react";

export function useGalleries() {
  const [galleries, setGalleries] = useState<
    { id: string; coverImage: string; name: string; location?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGalleries() {
      try {
        setLoading(true);
        const res = await fetch("/api/gallery");
        if (!res.ok) throw new Error("Failed to fetch galleries");

        const data = await res.json();
        console.log("Fetched Galleries:", data); // 🔍 Debugging log

        setGalleries(data); // ✅ Ensure data is set properly
      } catch (err) {
        setError((err as Error).message);
        console.error("Error fetching galleries:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGalleries();
  }, []);

  return { galleries, loading, error };
}
