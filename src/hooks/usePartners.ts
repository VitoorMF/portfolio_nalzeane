// src/hooks/usePartners.ts
import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  type DocumentData,
  type QuerySnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";

export interface Partner {
  id: string;
  name: string;
  src: string;
}

export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, "partners"), orderBy("name"));

    const unsub = onSnapshot(
      q,
      (snap: QuerySnapshot<DocumentData>) => {
        const list: Partner[] = snap.docs.map((d) => {
          const data = d.data() as Partial<Omit<Partner, "id">>;
          return {
            id: d.id,
            name: String(data.name ?? ""),
            src: String(data.src ?? ""),
          };
        });
        setPartners(list);
        setLoading(false);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsub(); // evita listeners duplicados no StrictMode
  }, []);

  // (Opcional) Reload manual
  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "partners"));
      const list: Partner[] = snap.docs.map((d) => {
        const data = d.data() as Partial<Omit<Partner, "id">>;
        return {
          id: d.id,
          name: String(data.name ?? ""),
          src: String(data.src ?? ""),
        };
      });
      setPartners(list);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { partners, loading, error, reload };
}
