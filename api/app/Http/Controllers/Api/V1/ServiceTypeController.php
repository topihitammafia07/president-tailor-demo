<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceTypeResource;
use App\Models\ServiceType;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ServiceTypeController extends Controller
{
    /**
     * List all defined service types (Jas, Hem Batik, Celana Panjang).
     */
    public function index(): AnonymousResourceCollection
    {
        return ServiceTypeResource::collection(ServiceType::orderBy('id')->get());
    }
}
