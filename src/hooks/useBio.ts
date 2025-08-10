import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

export interface Bio {
  id: string;
  bio: string;
}

export function useBio() {
  const [bio, setBio] = useState<Bio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBio = async () => {
      try {
        const snapshot = await getDocs(collection(db, "bio"));
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          bio: (doc.data().bio as string) || "",
        }));
        setBio(list);
      } catch (err) {
        console.error("Erro ao carregar bio:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchBio();
  }, []);

  return { bio, loading, error };
}
