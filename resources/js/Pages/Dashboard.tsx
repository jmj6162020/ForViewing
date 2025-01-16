import BestSellingProductsTable, {
  BestSellingProduct,
} from '@/Components/BestSellingProductsTable';
import RecentOrdersTable from '@/Components/RecentOrdersTable';
import SalesGraph, { SalesData } from '@/Components/SalesGraph';
import AdminLayout from '@/Layouts/AdminLayout';
import { Order } from '@/types';
import { Head } from '@inertiajs/react';

export default function Dashboard({
  currentMonthSales,
  todaySales,
  yearSales,
  currentMonthBestSelling,
  recentOrders,
}: {
  currentMonthSales: SalesData;
  todaySales: SalesData;
  yearSales: SalesData;
  currentMonthBestSelling: BestSellingProduct[];
  recentOrders: Order[];
}) {
  return (
    <AdminLayout>
      <Head title="Dashboard" />

      <div className="mb-4">
        <SalesGraph
          salesData={todaySales}
          title={'Today'}
          exportLink={route('reports.today-sales')}
          labels={todaySales.labels}
          xScaleText="Time of the Day"
        />
      </div>

      <div className="mb-4">
        <SalesGraph
          salesData={currentMonthSales}
          title={'the Month'}
          exportLink={route('reports.monthly-sales')}
          labels={Array.from({ length: 31 }, (_, i) => `${i + 1}`)}
          xScaleText="Day of the Month"
        />
      </div>

      <div className="mb-4">
        <SalesGraph
          salesData={yearSales}
          title={'the Year'}
          exportLink={route('reports.year-sales')}
          labels={yearSales.labels}
          xScaleText="Month of the Year"
        />
      </div>

      <div className="mt-4 flex items-start justify-start gap-4">
        <BestSellingProductsTable
          bestSellingProducts={currentMonthBestSelling}
        />

        <RecentOrdersTable recentOrders={recentOrders} />
      </div>
    </AdminLayout>
  );
}
