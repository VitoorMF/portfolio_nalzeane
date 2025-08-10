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
  isAdmin?: boolean; // editar
};

export default function Products({ isAdmin }: ProductsProps) {
  const { products, prodLoading, prodError } = useProducts();

  const [productDialogOpen, setProductDialogOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  );

  const [newProductId, setNewProductId] = React.useState<string | null>(null);
  const [addProductDialogOpen, setAddProductDialogOpen] = React.useState(false);

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
        {
          image: data.image,
          link: data.link,
          name: data.name,
        },
        { merge: true } // cria se não existir, atualiza os campos sem sobrescrever tudo
      );
      console.log("Produto atualizado:", data);
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
      console.log("Produto excluído:", id);
      // opcional: refetch
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
      console.log("Produto criado:", data);
      // se não usa real-time subscription, pode chamar reload() do hook
    } catch (err) {
      console.error("Erro ao criar produto:", err);
    }
  };

  return (
    <section className="products">
      <h3 className="section_title">Produtos</h3>
      {prodLoading && <p>Carregando produtos…</p>}
      {prodError && <p>Erro ao carregar produtos: {prodError.message}</p>}
      {!prodLoading && !prodError && (
        <div className="product_carrousel">
          {products.map((product) => (
            <div
              key={product.id}
              className="product"
              role="button"
              tabIndex={0}
              aria-label={product.name}
              onClick={(e) => handleProductClick(product, e)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="product_image"
              />
              <p className="product_description">{product.name}</p>
            </div>
          ))}

          {!products.length && (
            <p className="no_products">Nenhum produto cadastrado.</p>
          )}
        </div>
      )}

      {isAdmin && (
        <div className="add_field">
          <div className="add" onClick={handleAddProduct}>
            Adicionar
          </div>
          <AddProductDialog
            open={addProductDialogOpen}
            onClose={() => {
              setAddProductDialogOpen(false);
              setNewProductId(null);
            }}
            socialId={newProductId!}
            onCreate={handleCreateProduct}
          />
        </div>
      )}

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
