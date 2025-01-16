import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import books from '../../../images/books.png';
import merchandise from '../../../images/merchandise.png';
import schoolSupplies from '../../../images/school-supplies.png';
import uniforms from '../../../images/uniforms.png';

export default function Index() {
  return (
    <AppLayout>
      <Head title="Shop" />

      <div className="mt-4 flex justify-evenly">
        <Link
          href={
            route('categories.products.index', 'school-supplies') +
            '?filter[campus]=Main'
          }
        >
          <div className="h-72 w-72 rounded-md bg-[#bde8fa] shadow">
            <h3 className="px-4 py-6 text-center text-3xl font-bold uppercase text-[#0a73a1]">
              School Supplies
            </h3>

            <div className="flex justify-center">
              <img src={schoolSupplies} alt="" className="h-32 w-auto" />
            </div>
          </div>
        </Link>

        <Link
          href={
            route('categories.products.index', 'uniforms') +
            '?filter[campus]=Main'
          }
        >
          <div className="h-72 w-72 rounded-md bg-[#c3efce] shadow">
            <h3 className="px-4 py-6 text-center text-3xl font-bold uppercase leading-tight text-[#34a853]">
              Uniform
            </h3>

            <div className="flex justify-center">
              <img src={uniforms} alt="" className="h-32 w-auto" />
            </div>
          </div>
        </Link>

        <Link
          href={
            route('categories.products.index', 'books') + '?filter[campus]=Main'
          }
        >
          <div className="h-72 w-72 rounded-md bg-[#e7d8a1] shadow">
            <h3 className="px-4 py-6 text-center text-3xl font-bold uppercase leading-tight text-[#b18531]">
              Books
            </h3>

            <div className="flex justify-center">
              <img src={books} alt="" className="h-32 w-auto" />
            </div>
          </div>
        </Link>

        <Link
          href={
            route('categories.products.index', 'urian-merchandise') +
            '?filter[campus]=Main'
          }
        >
          <div className="h-72 w-72 rounded-md bg-[#f9d5f6] shadow">
            <h3 className="px-4 py-6 text-center text-3xl font-bold uppercase leading-tight text-[#b13197]">
              Urian Merchandise
            </h3>

            <div className="flex justify-center">
              <img src={merchandise} alt="" className="h-32 w-auto" />
            </div>
          </div>
        </Link>
      </div>
    </AppLayout>
  );
}
