<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use League\Csv\Writer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class BestSellingReportController extends Controller
{
    public function __invoke(Request $request)
    {
        if ($request->format == 'csv') {
            return $this->csv();
        } elseif ($request->format == 'pdf') {
            return $this->pdf();
        } else {
            abort(404);
        }
    }

    public function csv()
    {
        $currentYear = Carbon::now()->format('Y');
        $currentMonth = Carbon::now()->format('m');

        $startOfMonth = "$currentYear-$currentMonth-01 00:00:00";
        $endOfMonth = Carbon::parse($startOfMonth)->endOfMonth()->toDateTimeString();

        $bestSellingProducts = OrderItem::select(
            'variants.id as variant_id',
            'products.name as product_name',
            'variants.name as variant_name',
            DB::raw('SUM(order_items.quantity) as quantity_sold'),
            DB::raw('variants.price as price'),
            DB::raw('SUM(order_items.quantity * variants.price) as total_sales')
        )
            ->join('variants', 'order_items.variant_id', '=', 'variants.id')
            ->join('products', 'variants.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed')
            ->where('orders.campus', request()->user()->campus)
            ->whereBetween('orders.created_at', [$startOfMonth, $endOfMonth])
            ->groupBy('variants.id')
            ->orderByDesc('total_sales')
            ->take(10)
            ->get();

        if (request()->user()->hasRole('super-admin')) {
            $bestSellingProducts = OrderItem::select(
                'variants.id as variant_id',
                'products.name as product_name',
                'variants.name as variant_name',
                DB::raw('SUM(order_items.quantity) as quantity_sold'),
                DB::raw('variants.price as price'),
                DB::raw('SUM(order_items.quantity * variants.price) as total_sales')
            )
                ->join('variants', 'order_items.variant_id', '=', 'variants.id')
                ->join('products', 'variants.product_id', '=', 'products.id')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->where('orders.status', 'completed')
                ->whereBetween('orders.created_at', [$startOfMonth, $endOfMonth])
                ->groupBy('variants.id')
                ->orderByDesc('total_sales')
                ->take(10)
                ->get();
        }

        $csv = Writer::createFromString('');
        $csv->insertOne(['Product', 'Variant', 'Quantity Sold', 'Price', 'Total Sales']); // Add CSV header

        foreach ($bestSellingProducts as $item) {
            $csv->insertOne([
                $item->product_name,
                $item->variant_name,
                $item->quantity_sold,
                number_format($item->price, 2),
                number_format($item->total_sales, 2),
            ]);
        }

        return response((string) $csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"BestSellingProducts_{$currentMonth}_{$currentYear}.csv\"",
        ]);
    }

    private function pdf() 
    {
        $currentYear = Carbon::now()->format('Y');
        $currentMonth = Carbon::now()->format('m');

        $startOfMonth = "$currentYear-$currentMonth-01 00:00:00";
        $endOfMonth = Carbon::parse($startOfMonth)->endOfMonth()->toDateTimeString();

        $bestSellingProducts = OrderItem::select(
            'variants.id as variant_id',
            'products.name as product_name',
            'variants.name as variant_name',
            DB::raw('SUM(order_items.quantity) as quantity_sold'),
            DB::raw('variants.price as price'),
            DB::raw('SUM(order_items.quantity * variants.price) as total_sales')
        )
            ->join('variants', 'order_items.variant_id', '=', 'variants.id')
            ->join('products', 'variants.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed')
            ->where('orders.campus', request()->user()->campus)
            ->whereBetween('orders.created_at', [$startOfMonth, $endOfMonth])
            ->groupBy('variants.id')
            ->orderByDesc('total_sales')
            ->take(10)
            ->get();

        if (request()->user()->hasRole('super-admin')) {
            $bestSellingProducts = OrderItem::select(
                'variants.id as variant_id',
                'products.name as product_name',
                'variants.name as variant_name',
                DB::raw('SUM(order_items.quantity) as quantity_sold'),
                DB::raw('variants.price as price'),
                DB::raw('SUM(order_items.quantity * variants.price) as total_sales')
            )
                ->join('variants', 'order_items.variant_id', '=', 'variants.id')
                ->join('products', 'variants.product_id', '=', 'products.id')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->where('orders.status', 'completed')
                ->whereBetween('orders.created_at', [$startOfMonth, $endOfMonth])
                ->groupBy('variants.id')
                ->orderByDesc('total_sales')
                ->take(10)
                ->get();
        }

        // Start PDF content as HTML
        $html = '
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .header { text-align: center; margin-bottom: 30px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Urian Essentials</h1>
                    <h3>(Main Campus)</h1>
                    <p>Best Selling Products</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Variant</th>
                            <th>Quantity Sold</th>
                            <th>Price</th>
                            <th>Total Sales</th>
                        </tr>
                    </thead>
                    <tbody>';

        // Loop through orders to create table rows
        foreach ($bestSellingProducts as $item) {
            $html .= '
                <tr>
                    <td>' . $item->product_name . '</td>
                    <td>' . $item->variant_name . '</td>
                    <td>' . $item->quantity_sold . '</td>
                    <td>' . number_format($item->price, 2) . '</td>
                    <td>' . number_format($item->total_sales, 2) . '</td>
                </tr>';
        }

        $html .= '
                    </tbody>
                </table>
            </body>
            </html>';

        // Generate the PDF from HTML
        $pdf = Pdf::loadHTML($html);

        // Return the PDF as a download
        return $pdf->download("BestSellingProducts_{$currentMonth}_{$currentYear}.pdf");
    }
}
