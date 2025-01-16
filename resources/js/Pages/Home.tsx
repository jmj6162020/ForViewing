import ProductCard from '@/Components/ProductCard';
import { Button } from '@/Components/ui/button';
import AppLayout from '@/Layouts/AppLayout';
import { Product } from '@/types';
import { Head, Link } from '@inertiajs/react';
import homeImg from '../../images/home.jpg';

export default function Home({
  mainBestSellingProducts,
  morelosBestSellingProducts,
}: {
  mainBestSellingProducts: Product[];
  morelosBestSellingProducts: Product[];
}) {
  return (
    <AppLayout>
      <Head title="Home" />

      <div className="pb-4 pt-2">
        <div className="relative mx-auto flex max-w-4xl items-center justify-center rounded-md py-4">
          <div className="z-10 flex h-[169px] w-[709px] flex-col items-center justify-center bg-neutral-900/50">
            <h2 className="text-3xl font-semibold uppercase leading-tight text-white">
              Urian Essentials
            </h2>
            <p className="mt-1 text-center text-sm text-white">
              Why Wait in Line? Get Your School Gear Online - Fast, Easy,and
              Convenient
            </p>
            <Button className="mt-4" asChild>
              <Link href={route('categories.index')}>Shop Now</Link>
            </Button>
          </div>
          <img src={homeImg} alt="" className="absolute" />
        </div>

        <h2 className="mt-8 text-xl font-semibold leading-tight text-gray-800">
          Main Campus Best Selling Products
        </h2>
        <div className="mt-2 grid grid-cols-5 gap-4">
          {mainBestSellingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {mainBestSellingProducts.length === 0 && (
            <div className="col-span-5 mt-6 text-center font-medium text-gray-600">
              No Products available in this category.
            </div>
          )}
        </div>

        <h2 className="mt-8 text-xl font-semibold leading-tight text-gray-800">
          Morelos Campus Best Selling Products
        </h2>
        <div className="mt-2 grid grid-cols-5 gap-4">
          {morelosBestSellingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {morelosBestSellingProducts.length === 0 && (
            <div className="col-span-5 mt-6 text-center font-medium text-gray-600">
              No Products available in this category.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
