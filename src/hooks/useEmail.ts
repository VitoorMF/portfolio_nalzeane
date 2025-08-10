// src/hooks/useDescription.ts
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

export interface Email {
  id: string;
  address: string;
}

export function useEmail() {
  const [email, setEMail] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const snapshot = await getDocs(collection(db, "email"));
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          address: (doc.data().address as string) || "",
        }));
        setEMail(list);
      } catch (err) {
        console.error("Erro ao carregar email:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchDescription();
  }, []);

  return { email, loading, error };
}
