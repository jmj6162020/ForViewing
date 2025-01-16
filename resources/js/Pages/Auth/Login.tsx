import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PasswordInput from '@/Components/PasswordInput';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import logo from '../../../images/logo.png';

export default function Login() {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
  });

  function submit(e: FormEvent) {
    e.preventDefault();

    post(route('login'), {
      onFinish: () => reset('password'),
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-evenly bg-gradient-to-r from-cobalt-200 to-cobalt-900">
      <Head title="Log in" />

      <div className="flex shrink-0 flex-col items-center">
        <img src={logo} alt="" className="h-80 w-80" />

        <h2 className="mt-4 text-center text-4xl font-bold uppercase text-cobalt-800">
          Urian Essentials
        </h2>

        <p className="mt-1 text-center text-lg font-medium text-gray-900">
          Get Your School Gear Online <br /> Fast, Easy, and Convenient!
        </p>
      </div>

      <div className="w-full bg-white p-8 shadow-lg sm:max-w-lg sm:rounded-lg">
        <h2 className="text-center text-xl font-bold uppercase leading-tight text-cobalt-800">
          Login
        </h2>

        <form onSubmit={submit}>
          <div>
            <InputLabel htmlFor="email" value="Email" />
            <TextInput
              id="email"
              type="email"
              name="email"
              value={data.email}
              className="mt-1 block w-full"
              autoComplete="username"
              isFocused={true}
              onChange={(e) => setData('email', e.target.value)}
            />

            <InputError message={errors.email} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="password" value="Password" />
            <PasswordInput
              id="password"
              name="password"
              value={data.password}
              className="mt-1 block w-full"
              autoComplete="current-password"
              onChange={(e) => setData('password', e.target.value)}
            />

            <InputError message={errors.password} className="mt-2" />
          </div>

          <div className="mt-4">
            <Button className="w-full text-base" disabled={processing}>
              Log in
            </Button>
          </div>

          <div className="mt-8 flex justify-center">
            <p className="text-center text-sm font-medium text-gray-900">
              Don't have an account?{' '}
              <Link
                href={route('register')}
                className="text-sm font-medium text-cobalt-800 transition duration-150 ease-in-out hover:underline hover:underline-offset-4"
              >
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
