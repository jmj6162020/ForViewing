export default function OrderStatus({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        status === 'completed'
          ? 'bg-green-100 text-green-700'
          : status === 'processing'
            ? 'bg-yellow-100 text-yellow-700'
            : status === 'ready-for-payment'
              ? 'bg-orange-100 text-orange-700'
              : 'bg-red-100 text-red-700'
      }`}
    >
      {status}
    </span>
  );
}
