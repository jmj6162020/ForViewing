import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Select from '@/Components/Select';
import TextArea from '@/Components/TextArea';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { toast } from 'sonner';

export default function Contact() {
  const { data, setData, post, errors, processing, reset } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    message: '',
    campus: 'Main',
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    post(route('contact-us'), {
      onSuccess: () => {
        toast("You're message has been received");
        reset();
      },
    });
  }

  return (
    <AppLayout>
      <Head title="Contact Us" />

      <div className="mx-auto max-w-2xl rounded-md bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>

        <form onSubmit={submit}>
          <div className="mb-4 grid grid-cols-1 gap-4">
            <div>
              <InputLabel htmlFor="campus">Campus</InputLabel>
              <Select
                id="campus"
                name="campus"
                value={data.campus}
                onChange={(e) => setData('campus', e.target.value)}
                className="mt-1 block w-full"
              >
                <option value="Main">Main Campus</option>
                <option value="Morelos">Morelos Campus</option>
              </Select>
              <InputError message={errors.campus} className="mt-2" />
            </div>

            <div>
              <InputLabel htmlFor="first_name">First Name</InputLabel>
              <Input
                id="first_name"
                name="first_name"
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
                className="mt-1 block w-full"
                required
              />
              <InputError message={errors.first_name} className="mt-2" />
            </div>

            <div>
              <InputLabel htmlFor="last_name">Last Name</InputLabel>
              <Input
                id="last_name"
                name="last_name"
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
                className="mt-1 block w-full"
                required
              />
              <InputError message={errors.last_name} className="mt-2" />
            </div>

            <div>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                id="email"
                type="email"
                name="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="mt-1 block w-full"
                required
              />
              <InputError message={errors.email} className="mt-2" />
            </div>

            <div>
              <InputLabel htmlFor="contact_number">Contact Number</InputLabel>
              <Input
                id="contact_nubmer"
                name="contact_number"
                value={data.contact_number}
                onChange={(e) => setData('contact_number', e.target.value)}
                className="mt-1 block w-full"
                required
              />
              <InputError message={errors.contact_number} className="mt-2" />
            </div>

            <div>
              <InputLabel htmlFor="message">Message</InputLabel>
              <TextArea
                name="message"
                value={data.message}
                onChange={(e) => setData('message', e.target.value)}
                className="mt-1 block w-full resize-none"
                required
              />
              <InputError message={errors.message} className="mt-2" />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={processing}>
              Submit
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
