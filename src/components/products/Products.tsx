// Products.tsx
import ProductDialog, { type ProductValues } from "../dialogs/ProductDialog";
import "./Products.css";
import React from "react";
import { doc, setDoc, deleteDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useProducts } from "../../hooks/useProducts";
import AddProductDialog from "../dialogs/addProductDialog";

export type Product = {
  id: string;
  image: string;
  name: string;
  link: string;
};

export type ProductsProps = {
  isAdmin?: boolean;
};

export default function Products({ isAdmin = false }: ProductsProps) {
  const { products, prodLoading, prodError } = useProducts();

  const [productDialogOpen, setProductDialogOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  const [newProductId, setNewProductId] = React.useState<string | null>(null);
  const [addProductDialogOpen, setAddProductDialogOpen] = React.useState(false);

  const trackRef = React.useRef<HTMLDivElement | null>(null);

  const handleProductClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdmin) {
      setSelectedProduct(product);
      setProductDialogOpen(true);
      return;
    }
    if (product.link) {
      window.open(product.link, "_blank", "noopener,noreferrer");
    }
  };

  const handleProductSubmit = async (data: ProductValues) => {
    const prodRef = doc(db, "products", data.id);
    try {
      await setDoc(
        prodRef,
        { image: data.image, link: data.link, name: data.name },
        { merge: true }
      );
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
    } finally {
      setProductDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleProductDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
    } finally {
      setProductDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleAddProduct = () => {
    const generated = doc(collection(db, "products")).id;
    setNewProductId(generated);
    setAddProductDialogOpen(true);
  };

  const handleCreateProduct = async (data: ProductValues) => {
    try {
      await setDoc(doc(db, "products", data.id), {
        image: data.image,
        link: data.link,
        name: data.name,
      });
    } catch (err) {
      console.error("Erro ao criar produto:", err);
    } finally {
      setAddProductDialogOpen(false);
      setNewProductId(null);
    }
  };

  const scrollByAmount = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.8);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="products">
      <h3 className="section_title">Produtos</h3>

      {prodLoading && <p>Carregando produtos…</p>}
      {prodError && <p>Erro ao carregar produtos: {prodError.message}</p>}

      {!prodLoading && !prodError && (
        <div className="carousel_wrap">
          <button
            type="button"
            className="carousel_btn carousel_btn--prev"
            aria-label="Anterior"
            onClick={() => scrollByAmount(-1)}
          >
            ❮
          </button>

          <div
            className="carousel_track product_track"
            ref={trackRef}
            tabIndex={0}
            aria-label="Carrossel de produtos"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") scrollByAmount(1);
              if (e.key === "ArrowLeft") scrollByAmount(-1);
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="product_slide"
                role="button"
                tabIndex={0}
                aria-label={product.name}
                onClick={(e) => handleProductClick(product, e)}
                onKeyDown={(e) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  if (e.key === "Enter" || e.key === " ") handleProductClick(product, e as any);
                }}
              >
                <div className="product_tile">
                  <img src={product.image} alt={product.name} className="product_img" />
                  <div className="product_overlay">
                    <span className="product_name">{product.name}</span>
                  </div>
                </div>
              </div>
            ))}

            {isAdmin && (
              <button
                type="button"
                className="product_slide add_slide"
                onClick={handleAddProduct}
                aria-label="Adicionar produto"
                title="Adicionar produto"
              >
                <div className="add_tile">
                  <span className="add_plus">＋</span>
                  <span>Adicionar</span>
                </div>
              </button>
            )}

            {!products.length && !isAdmin && (
              <p className="no_products">Nenhum produto cadastrado.</p>
            )}
          </div>

          <button
            type="button"
            className="carousel_btn carousel_btn--next"
            aria-label="Próximo"
            onClick={() => scrollByAmount(1)}
          >
            ❯
          </button>

          <div className="carousel_edge carousel_edge--left" aria-hidden="true" />
          <div className="carousel_edge carousel_edge--right" aria-hidden="true" />
        </div>
      )}

      <AddProductDialog
        open={addProductDialogOpen}
        onClose={() => {
          setAddProductDialogOpen(false);
          setNewProductId(null);
        }}
        socialId={newProductId ?? ""}
        onCreate={handleCreateProduct}
      />

      <ProductDialog
        open={productDialogOpen}
        onClose={() => {
          setProductDialogOpen(false);
          setSelectedProduct(null);
        }}
        socialId={selectedProduct?.id}
        socialImage={selectedProduct?.image}
        socialLink={selectedProduct?.link}
        socialName={selectedProduct?.name}
        onSubmit={handleProductSubmit}
        onDelete={handleProductDelete}
      />
    </section>
  );
}
