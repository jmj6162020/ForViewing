import { Button } from '@/Components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/Components/ui/dialog';
import AdminLayout from '@/Layouts/AdminLayout';
import { cn } from '@/lib/utils';
import { Message } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ messages }: { messages: Message[] }) {
  const [isOpen, setOpen] = useState(false);

  return (
    <AdminLayout>
      <Head title="Contacts" />

      <div className="overflow-x-auto rounded-md border border-gray-300 bg-white">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="text-left font-bold">
              <th className="px-4 py-3 text-sm text-gray-700">First Name</th>
              <th className="px-4 py-3 text-sm text-gray-700">Last Name</th>
              <th className="px-4 py-3 text-sm text-gray-700">Email</th>
              <th className="px-4 py-3 text-sm text-gray-700">
                Contact Number
              </th>
              <th className="px-4 py-3 text-sm text-gray-700">Message</th>
            </tr>
          </thead>

          <tbody>
            {messages.map((message) => {
              return (
                <tr
                  key={message.id}
                  className={cn(
                    'border-t border-gray-300',
                    message.read && 'bg-cobalt-50',
                  )}
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {message.first_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {message.last_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {message.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {message.contact_number}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <Dialog open={isOpen} onOpenChange={setOpen}>
                      <DialogTrigger className="max-w-[20ch] truncate text-cobalt-800">
                        {message.message}
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {message.first_name} {message.last_name}
                          </DialogTitle>
                          <DialogDescription>
                            {message.message}
                          </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                          <DialogClose
                            asChild
                            onClick={() => {
                              router.patch(
                                route('admin.contacts.update', message.id),
                                { read: true },
                                { onSuccess: () => setOpen(false) },
                              );
                            }}
                          >
                            <Button>Close</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              );
            })}

            {messages.length === 0 && (
              <tr className="border-t border-gray-300">
                <td
                  colSpan={6}
                  className="px-4 py-4 text-center text-sm font-medium text-gray-700"
                >
                  No messages available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
