import AdminLayout from '@/Layouts/AdminLayout';
import { Category } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import ProductDetailsForm from './Partials/ProductDetailsForm';
import ProductVariantForm from './Partials/ProductVariantForm';
import { useProductForm } from './Partials/store';

export default function NewProduct({ categories }: { categories: Category[] }) {
  const { reset } = useProductForm();

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminLayout>
      <Head title="New Product" />

      <div className="space-y-8">
        <ProductDetailsForm categories={categories} />
        <ProductVariantForm />
      </div>
    </AdminLayout>
  );
}
