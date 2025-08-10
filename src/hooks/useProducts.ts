// useProducts.ts
import { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  type DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";

export type Product = {
  id: string;
  image: string;
  name: string;
  link: string;
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // real-time subscription (você pode trocar pra fetch único se preferir)
  useEffect(() => {
    const q = query(collection(db, "products"));
    const unsubscribe = onSnapshot(
      q,
      (snap: QuerySnapshot<DocumentData>) => {
        const list: Product[] = snap.docs.map((d) => {
          const data = d.data() as Partial<Omit<Product, "id">>;
          return {
            id: d.id,
            image: String(data.image || ""),
            name: String(data.name || ""),
            link: String(data.link || ""),
          };
        });
        setProducts(list);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "products"));
      const list: Product[] = snap.docs.map((d) => {
        const data = d.data() as Partial<Omit<Product, "id">>;
        return {
          id: d.id,
          image: String(data.image || ""),
          name: String(data.name || ""),
          link: String(data.link || ""),
        };
      });
      setProducts(list);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    prodLoading: loading,
    prodError: error,
    reload,
  };
}
