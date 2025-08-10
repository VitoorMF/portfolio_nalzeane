// src/hooks/useTelephone.ts
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

export interface Telephone {
  number: string;
  id: string;
}

export function useTelephone() {
  const [telephone, setTelephone] = useState<Telephone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTelephone = async () => {
      try {
        const snapshot = await getDocs(collection(db, "telephone"));
        const list = snapshot.docs.map((doc) => {
          const data = doc.data();
          // Garante que `number` seja uma string (fallback '0')
          const numStr = typeof data.number === "number" ? String(data.number) : (typeof data.number === "string" ? data.number : "");
          return {
            id: doc.id,
            number: numStr,
          };
        });
        setTelephone(list);
      } catch (err) {
        console.error("Erro ao carregar telefone:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchTelephone();
  }, []);

  return { telephone, loading, error };
}
