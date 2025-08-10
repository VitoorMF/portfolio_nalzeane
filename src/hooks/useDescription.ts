// src/hooks/useDescription.ts
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

export interface Description {
  id: string;
  title: string;
}

export function useDescription() {
  const [description, setDescription] = useState<Description[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const snapshot = await getDocs(collection(db, "description"));
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: (doc.data().title as string) || "",
        }));
        setDescription(list);
      } catch (err) {
        console.error("Erro ao carregar description:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchDescription();
  }, []);

  return { description, loading, error };
}
