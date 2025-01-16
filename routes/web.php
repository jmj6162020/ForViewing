<?php

use App\Http\Controllers\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\CustomerOrderController;
use App\Http\Controllers\Admin\OrderStatusController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\RefundRequestController as AdminRefundRequestController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\CartItemQuantityController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CategoryProductController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\Order\CancelledOrderController;
use App\Http\Controllers\Order\CompletedOrderController;
use App\Http\Controllers\Order\CreatedOrderController;
use App\Http\Controllers\Order\ProcessingOrderController;
use App\Http\Controllers\Order\ReadyToClaimOrderController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderReviewController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RefundedItemsController;
use App\Http\Controllers\RefundRequestController;
use App\Http\Controllers\Report\BestSellingReportController;
use App\Http\Controllers\Report\MonthlySaleReportController;
use App\Http\Controllers\Report\RecentOrderController;
use App\Http\Controllers\RestoreProductController;
use App\Http\Controllers\SalaryDeductionController;
use App\Http\Controllers\SelectedCartItemController;
use App\Http\Controllers\TodaySalesReportController;
use App\Http\Controllers\YearSalesReportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');

Route::redirect('/admin', '/admin/dasboard');

Route::get('/admin/dashboard', DashboardController::class)
    ->middleware(['auth', 'role:main-admin|morelos-admin|super-admin'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::post('/salary-deductions', [SalaryDeductionController::class, 'store'])
        ->name('salary_deductions.store');
    Route::get('/salary-deductions/{order}', [SalaryDeductionController::class, 'show'])
        ->name('salary_deductions.show');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/checkout', [OrderController::class, 'create'])->name('orders.create');
    Route::post('/checkout', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');

    Route::patch('orders/{order}/status', OrderStatusController::class)
        ->name('orders.status.update');

    Route::post('/order-items/{item}/reviews', [OrderReviewController::class, 'store'])
        ->name('order-items.reviews.store');

    Route::post('/order-items/{item}/refund-requests', [RefundRequestController::class, 'store'])
        ->name('order-items.refund-requests.store');

    Route::get('/refund-requests', [RefundedItemsController::class, 'index'])
        ->name('refund-requests.index');
});

Route::middleware(['auth', 'role:main-admin|morelos-admin|super-admin'])->prefix('admin')->group(function () {
    Route::resource('products', AdminProductController::class, ['as' => 'admin'])
        ->except(['update']);
    Route::post('/products/{id}/restore', RestoreProductController::class)->name('products.restore');

    Route::resource('users', UserController::class, ['as' => 'admin']);

    Route::get('/created-orders', CreatedOrderController::class)->name('admin.orders.created');
    Route::get('/processing-orders', ProcessingOrderController::class)->name('admin.orders.processing');
    Route::get('/ready-to-claim-orders', ReadyToClaimOrderController::class)->name('admin.orders.ready-to-claim');
    Route::get('/completed-orders', CompletedOrderController::class)->name('admin.orders.completed');
    Route::get('/cancelled-orders', [CancelledOrderController::class, 'index'])->name('admin.orders.cancelled');

    Route::post('/products/{product}/update', [AdminProductController::class, 'update'])
        ->name('admin.products.update');

    Route::delete('/images/{image}', [ImageController::class, 'destroy'])->name('images.destroy');

    Route::get('/reports/monthly-sales', MonthlySaleReportController::class)->name('reports.monthly-sales');
    Route::get('/reports/today-sales', TodaySalesReportController::class)->name('reports.today-sales');
    Route::get('/reports/year-sales', YearSalesReportController::class)->name('reports.year-sales');
    Route::get('/reports/monthly-best-selling', BestSellingReportController::class)->name('reports.monthly-best-selling');
    Route::get('/reports/recent-orders', RecentOrderController::class)->name('reports.recent-orders');

    Route::get('/refund-requests', [AdminRefundRequestController::class, 'index'])->name('admin.refund-requests.index');
    Route::patch('/refund-requests/{refundRequest}', [AdminRefundRequestController::class, 'update'])->name('admin.refund-requests.update');

    Route::get('/reviews', [ReviewController::class, 'index'])
        ->name('admin.reviews.index');

    Route::get('/customers', [CustomerController::class, 'index'])
        ->name('admin.customers.index');

    Route::Get('/customers/{customer}/orders', [CustomerOrderController::class, 'show'])
        ->name('admin.customers.orders.show');

    Route::get('/contacts', [AdminContactController::class, 'index'])
        ->name('admin.contacts.index');

    Route::patch('/contacts/{message}', [AdminContactController::class, 'update'])
        ->name('admin.contacts.update');
});

Route::get('/shop', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/shop/{slug}', [CategoryProductController::class, 'index'])->name('categories.products.index');

Route::get('/shop/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/shop/products/{product}', [ProductController::class, 'show'])->name('products.show');

Route::resource('cart', CartController::class)->only(['index', 'store']);
Route::patch('/cart-item/{item}', [CartItemController::class, 'update'])->name('cart-items.update');
Route::delete('/cart-item/{item}', [CartItemController::class, 'destroy'])->name('cart-items.destroy');

Route::patch('/cart-items/selected', [SelectedCartItemController::class, 'update'])->name('cart-items.selected.update');
Route::patch('/cart-item/{item}/quantity', CartItemQuantityController::class)->name('cart-items.quantity.update');

Route::get('/contact-us', [ContactController::class, 'index'])->name('contact-us');
Route::post('/contact-us', [ContactController::class, 'store']);

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

require __DIR__.'/auth.php';
