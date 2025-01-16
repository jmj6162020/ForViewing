import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PasswordInput from '@/Components/PasswordInput';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import logo from '../../../images/logo.png';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    role: '',
    name: '',
    last_name: '',
    address: '',
    phone_number: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  function submit(e: FormEvent) {
    e.preventDefault();

    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-evenly bg-gradient-to-r from-cobalt-200 to-cobalt-900">
      <Head title="Register" />

      <div className="flex shrink-0 flex-col items-center">
        <img src={logo} alt="" className="h-80 w-80" />

        <h2 className="mt-4 text-center text-4xl font-bold uppercase text-cobalt-800">
          Urian Essentials
        </h2>

        <p className="mt-1 text-center text-lg font-medium text-gray-900">
          Get Your School Gear Online <br /> Fast, Easy, and Convenient!
        </p>
      </div>

      <div className="w-full bg-white px-8 py-4 shadow-lg sm:max-w-lg sm:rounded-lg">
        <h2 className="text-center text-xl font-bold uppercase leading-tight text-cobalt-800">
          Register
        </h2>

        <form onSubmit={submit}>
        <div>
          <InputLabel htmlFor="role" value="Role" />
          <select
              id="role"
              name="role"
              value={data.role}
              className="mt-1 block w-full"
              onChange={(e) => setData('role', e.target.value)}
          >
              <option value="">Select a role</option>
              <option value="student">Student</option>
              <option value="outsider">Outsider</option>
              <option value="employee">Employee</option>
          </select>
          <InputError message={errors.role} className="mt-2" />
      </div >
          {/* First Name */}
          <div className="mt-4">
            <InputLabel htmlFor="name" value="First Name" />
            <TextInput
              id="name"
              name="name"
              value={data.name}
              className="mt-1 block w-full"
              autoComplete="given-name"
              onChange={(e) => setData('name', e.target.value)}
            />
            <InputError message={errors.name} className="mt-2" />
          </div>

          {/* Last Name */}
          <div className="mt-4">
            <InputLabel htmlFor="last_name" value="Last Name" />
            <TextInput
              id="last_name"
              name="last_name"
              value={data.last_name}
              className="mt-1 block w-full"
              autoComplete="family-name"
              onChange={(e) => setData('last_name', e.target.value)}
            />
            <InputError message={errors.last_name} className="mt-2" />
          </div>

          {/* Address */}
          <div className="mt-4">
            <InputLabel htmlFor="address" value="Address" />
            <TextInput
              id="address"
              name="address"
              placeholder="Street, Barangay, City, State, Postal Code"
              value={data.address}
              className="mt-1 block w-full"
              autoComplete="street-address"
              onChange={(e) => setData('address', e.target.value)}
            />
            <InputError message={errors.address} className="mt-2" />
          </div>

          {/* Phone Number */}
          <div className="mt-4">
            <InputLabel htmlFor="phone_number" value="Phone Number" />
            <TextInput
              id="phone_number"
              name="phone_number"
              type="tel"
              value={data.phone_number}
              className="mt-1 block w-full"
              autoComplete="tel"
              onChange={(e) => setData('phone_number', e.target.value)}
            />
            <InputError message={errors.phone_number} className="mt-2" />
          </div>

          {/* Email */}
          <div className="mt-4">
            <InputLabel htmlFor="email" value="Email" />
            <TextInput
              id="email"
              type="email"
              name="email"
              value={data.email}
              className="mt-1 block w-full"
              autoComplete="username"
              onChange={(e) => setData('email', e.target.value)}
            />
            <InputError message={errors.email} className="mt-2" />
          </div>

          {/* Password */}
          <div className="mt-4">
            <InputLabel htmlFor="password" value="Password" />
            <PasswordInput
              id="password"
              type="password"
              name="password"
              value={data.password}
              className="mt-1 block w-full"
              autoComplete="current-password"
              onChange={(e) => setData('password', e.target.value)}
            />
            <InputError message={errors.password} className="mt-2" />
          </div>

          {/* Confirm Password */}
          <div className="mt-4">
            <InputLabel
              htmlFor="password_confirmation"
              value="Confirm Password"
            />
            <PasswordInput
              id="password_confirmation"
              name="password_confirmation"
              value={data.password_confirmation}
              className="mt-1 block w-full"
              autoComplete="current-password"
              onChange={(e) => setData('password_confirmation', e.target.value)}
            />
            <InputError
              message={errors.password_confirmation}
              className="mt-2"
            />
          </div>

          {/* Register Button */}
          <div className="mt-4">
            <Button className="w-full text-base" disabled={processing}>
              Register
            </Button>
          </div>

          {/* Login Link */}
          <div className="mt-8 flex justify-center">
            <p className="text-center text-sm font-medium text-gray-900">
              Already have an account?{' '}
              <Link
                href={route('login')}
                className="text-sm font-medium text-cobalt-800 transition duration-150 ease-in-out hover:underline hover:underline-offset-4"
              >
                Login here
              </Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}
