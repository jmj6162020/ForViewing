import AdminLayout from '@/Layouts/AdminLayout';
import { Category, Product } from '@/types';
import { Head } from '@inertiajs/react';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import ProductDetailsForm from './Partials/ProductDetailsForm';
import ProductVariantForm from './Partials/ProductVariantForm';
import { productFormAtom } from './Partials/store';

export default function EditProduct({
  product,
  categories,
}: {
  product: Product;
  categories: Category[];
}) {
  const [, setAtomData] = useAtom(productFormAtom);

  useEffect(() => {
    setAtomData({
      category_id: product?.category_id || '',
      name: product?.name || '',
      sku: product?.sku || '',
      details: product?.details || '',
      images: [],
      variants: product?.variants || [],
    });
  }, [
    product?.category_id,
    product?.details,
    product?.name,
    product?.sku,
    product?.variants,
    setAtomData,
  ]);

  return (
    <AdminLayout>
      <Head title="Edit Product" />

      <div className="space-y-8">
        <ProductDetailsForm product={product} categories={categories} />
        <ProductVariantForm />
      </div>
    </AdminLayout>
  );
}
