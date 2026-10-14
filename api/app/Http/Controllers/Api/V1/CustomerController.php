<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CustomerController extends Controller
{
    /**
     * List customers with optional search.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Customer::query()->withCount('orders');

        if ($search = $request->input('q')) {
            $search = substr(trim($search), 0, 100);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $perPage = min(max((int) $request->input('per_page', 20), 5), 100);
        $customers = $query->latest('id')->paginate($perPage);

        return CustomerResource::collection($customers);
    }

    /**
     * Create a new customer.
     */
    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $customer = Customer::create($request->validated());

        return (new CustomerResource($customer))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Get customer details along with orders history.
     */
    public function show(Customer $customer): CustomerResource
    {
        $customer->loadCount('orders');
        $customer->load(['orders' => function ($q) {
            $q->latest('id')->with('items.serviceType');
        }]);

        return new CustomerResource($customer);
    }

    /**
     * Update customer details.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer): CustomerResource
    {
        $customer->update($request->validated());

        return new CustomerResource($customer);
    }
}
