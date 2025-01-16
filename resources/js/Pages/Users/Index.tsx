import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PasswordInput from '@/Components/PasswordInput';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/Components/ui/dialog';
import AdminLayout from '@/Layouts/AdminLayout';
import { User } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { DialogClose } from '@radix-ui/react-dialog';
import { FormEventHandler, useId, useState } from 'react';
import { toast } from 'sonner';

export default function Index({ users }: { users: User[] }) {
  const userRole = (role: string) => {
    if (role === 'super-admin') return 'Super Admin';
    if (role === 'main-admin') return 'Main Campus Admin';
    if (role === 'morelos-admin') return 'Morelos Campus Admin';
  };

  return (
    <AdminLayout>
      <Head title="User Management" />

      <h2 className="text-2xl font-semibold leading-tight text-gray-800">
        User Management
      </h2>

      <div className="mt-4 flex items-end justify-between">
        <form className="flex flex-1 items-center">
          <TextInput
            name="query"
            placeholder="Search by Name or Email"
            className="w-full max-w-[264px] flex-1 text-sm"
          />

          <Link
            href={route('admin.users.index')}
            className="ms-2 text-sm text-gray-700 hover:underline hover:underline-offset-4"
          >
            Reset
          </Link>
        </form>

        <CreateUserDialog />
      </div>

      <div className="mt-3 overflow-x-auto rounded-md bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="text-left font-bold">
                <th className="px-4 py-2 text-sm text-gray-700">Name</th>
                <th className="px-4 py-2 text-sm text-gray-700">Email</th>
                <th className="px-4 py-2 text-sm text-gray-700">Role</th>
                <th className="px-4 py-2 text-right text-sm text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr key={user.id} className="border-t border-gray-300">
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {user.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {user.email}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {userRole(user.role)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <EditUserDialog user={user} />

                      <Dialog>
                        <DialogTrigger
                          className={
                            'ms-2 text-sm text-red-600 transition duration-150 ease-in-out hover:underline hover:underline-offset-4 ' +
                            (user.id === 3 && 'opacity-50')
                          }
                          disabled={user.id === 3}
                        >
                          Delete
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete User</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this? This action
                              cannot be undone
                            </DialogDescription>
                          </DialogHeader>

                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Close</Button>
                            </DialogClose>

                            <Button
                              onClick={() =>
                                router.post(
                                  route('admin.users.destroy', user.id),
                                  {
                                    _method: 'DELETE',
                                  },
                                  {
                                    onSuccess: () =>
                                      toast.success(
                                        'User deleted successfully.',
                                      ),
                                  },
                                )
                              }
                              variant="destructive"
                            >
                              Delete User
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr className="border-t border-gray-300">
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-center text-sm font-medium text-gray-700"
                  >
                    No users available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

function CreateUserDialog() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'super-admin',
  });

  const [isOpen, setOpen] = useState(false);

  const formId = useId();

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('admin.users.store'), {
      onFinish: () => reset(),
      onSuccess: () => {
        setOpen(false);
        toast.success('User created successfully');
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New User</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New User</DialogTitle>
          <DialogDescription>Enter user details below</DialogDescription>
        </DialogHeader>

        <form id={formId} onSubmit={submit}>
          <span className="block text-sm font-medium text-gray-700">Role</span>
          <div>
            <div className="mt-1 flex items-center gap-x-6">
              <label
                htmlFor="super-admin"
                className="text-sm font-medium text-gray-700"
              >
                <input
                  onChange={(e) => {
                    if (e.target.checked) {
                      setData('role', e.target.value);
                    }
                  }}
                  checked={data.role === 'super-admin'}
                  type="radio"
                  id="super-admin"
                  name="role"
                  value="super-admin"
                  className="me-2 rounded-full text-sm text-cobalt-800"
                  required
                />
                Super Admin
              </label>

              <label
                htmlFor="main-admin"
                className="text-sm font-medium text-gray-700"
              >
                <input
                  onChange={(e) => {
                    if (e.target.checked) {
                      setData('role', e.target.value);
                    }
                  }}
                  checked={data.role === 'main-admin'}
                  type="radio"
                  id="main-admin"
                  name="role"
                  value="main-admin"
                  className="me-2 rounded-full text-sm text-cobalt-800"
                />
                Main Campus Admin
              </label>

              <label
                htmlFor="morelos-admin"
                className="text-sm font-medium text-gray-700"
              >
                <input
                  onChange={(e) => {
                    if (e.target.checked) {
                      setData('role', e.target.value);
                    }
                  }}
                  checked={data.role === 'morelos-admin'}
                  type="radio"
                  id="morelos-admin"
                  name="role"
                  value="morelos-admin"
                  className="me-2 rounded-full text-sm text-cobalt-800"
                />
                Morelos Admin
              </label>
            </div>
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="name" value="Name" />
            <TextInput
              id="name"
              name="name"
              value={data.name}
              className="mt-1 block w-full"
              autoComplete="name"
              onChange={(e) => setData('name', e.target.value)}
            />

            <InputError message={errors.email} className="mt-2" />
          </div>

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
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>

          <Button form={formId} type="submit" disabled={processing}>
            Create User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditUserDialog({ user }: { user: User }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    _method: 'PATCH',
    name: user.name,
    email: user.email,
    password: '',
    password_confirmation: '',
    role: user.role,
  });

  const [isOpen, setOpen] = useState(false);

  const formId = useId();

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('admin.users.update', user.id), {
      onFinish: () => reset(),
      onSuccess: () => {
        setOpen(false);
        toast.success('User updated successfully');
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger
        className={
          'text-sm text-[#ff7b00] transition duration-150 ease-in-out hover:underline hover:underline-offset-4 ' +
          (user.id === 3 && 'opacity-50')
        }
        disabled={user.id === 3}
      >
        Edit
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Enter user details below</DialogDescription>
        </DialogHeader>

        <form id={formId} onSubmit={submit}>
          <span className="block text-sm font-medium text-gray-700">Role</span>
          <div>
            <div className="mt-1 flex items-center gap-x-6">
              <label
                htmlFor="super-admin"
                className="text-sm font-medium text-gray-700"
              >
                <input
                  onChange={(e) => {
                    if (e.target.checked) {
                      setData('role', e.target.value);
                    }
                  }}
                  checked={data.role === 'super-admin'}
                  type="radio"
                  id="super-admin"
                  name="role"
                  value="super-admin"
                  className="me-2 rounded-full text-sm text-cobalt-800"
                  required
                />
                Super Admin
              </label>

              <label
                htmlFor="main-admin"
                className="text-sm font-medium text-gray-700"
              >
                <input
                  onChange={(e) => {
                    if (e.target.checked) {
                      setData('role', e.target.value);
                    }
                  }}
                  checked={data.role === 'main-admin'}
                  type="radio"
                  id="main-admin"
                  name="role"
                  value="main-admin"
                  className="me-2 rounded-full text-sm text-cobalt-800"
                />
                Main Campus Admin
              </label>

              <label
                htmlFor="morelos-admin"
                className="text-sm font-medium text-gray-700"
              >
                <input
                  onChange={(e) => {
                    if (e.target.checked) {
                      setData('role', e.target.value);
                    }
                  }}
                  checked={data.role === 'morelos-admin'}
                  type="radio"
                  id="morelos-admin"
                  name="role"
                  value="morelos-admin"
                  className="me-2 rounded-full text-sm text-cobalt-800"
                />
                Morelos Admin
              </label>
            </div>
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="name" value="Name" />
            <TextInput
              id="name"
              name="name"
              value={data.name}
              className="mt-1 block w-full"
              autoComplete="name"
              onChange={(e) => setData('name', e.target.value)}
            />

            <InputError message={errors.email} className="mt-2" />
          </div>

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
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>

          <Button form={formId} type="submit" disabled={processing}>
            Update User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
