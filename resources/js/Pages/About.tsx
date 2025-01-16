import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import bookstoreImg from '../../images/bookstore.png';
import bookstore2Img from '../../images/about.jpg';

export default function About() {
  return (
    <AppLayout>
      <Head title="About Us" />

      <h2 className="pt-6 text-center text-3xl font-bold leading-tight text-gray-700">
        About Us
      </h2>

      <div className="mt-12 grid grid-cols-2 items-center gap-x-4">
        <img
          src={bookstoreImg}
          alt=""
          className="h-80 w-auto rounded-md shadow"
        />
        <p className="max-w-prose text-lg leading-loose">
          Welcome to the FSUU Online Bookstore, your one-stop shop for uniforms,
          books, and school supplies! Designed with convenience in mind, our
          platform aims to provide a seamless shopping experience for students,
          employees, and even outsiders.
        </p>

        <p className="max-w-prose text-lg leading-loose">
          The Urian Essentials was created to provide users and staff with
          convenient access to academic resources, addressing the challenges of
          long queues and limited store hours. Users can easily browse, order,
          and pay through cash or salary deduction for employees.
        </p>

        <img
          src={bookstore2Img}
          alt=""
          className="mx-auto h-80 w-auto rounded-md shadow"
        />
      </div>

      <p className="mt-9 pb-6 text-lg leading-loose">
        For those who still prefer in-person transactions, the physical
        bookstore is open from Monday to Friday, 8:00 AM to 5:00 PM.
      </p>
    </AppLayout>
  );
}
