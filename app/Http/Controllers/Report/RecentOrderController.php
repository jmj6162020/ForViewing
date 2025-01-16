<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Carbon;
use League\Csv\Writer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class RecentOrderController extends Controller
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
        $orders = Order::select('created_at', 'tracking_number', 'total_amount')
            ->where('campus', request()->user()->campus)
            ->orderBy('created_at', 'asc')
            ->get();

        if (request()->user()->hasRole('super-admin')) {
            $orders = Order::select('created_at', 'tracking_number', 'total_amount')
                ->orderBy('created_at', 'asc')
                ->get();
        }

        $csv = Writer::createFromString('');

        $csv->insertOne(['Date', 'Order ID', 'Total Amount']);

        foreach ($orders as $order) {
            $csv->insertOne([
                Carbon::parse($order->created_at)->toDateTimeString(),
                $order->tracking_number,
                number_format($order->total_amount, 2),
            ]);
        }

        return response((string) $csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"Recent_Orders.csv\"",
        ]);
    }

    private function pdf() 
    {
        $orders = Order::select('created_at', 'tracking_number', 'total_amount')
            ->where('campus', request()->user()->campus)
            ->orderBy('created_at', 'asc')
            ->get();

        if (request()->user()->hasRole('super-admin')) {
            $orders = Order::select('created_at', 'tracking_number', 'total_amount')
                ->orderBy('created_at', 'asc')
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
                    <p>Recent Orders</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Order ID</th>
                            <th>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>';

        // Loop through orders to create table rows
        foreach ($orders as $order) {
            $html .= '
                <tr>
                    <td>' . Carbon::parse($order->created_at)->toDateTimeString() . '</td>
                    <td>' . $order->tracking_number . '</td>
                    <td>' . number_format($order->total_amount, 2) . '</td>
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
        return $pdf->download("Recent_Orders.pdf");
    }
}
