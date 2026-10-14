<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsOwner
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->isOwner()) {
            return response()->json([
                'message' => 'Akses ditolak. Fitur laporan bisnis hanya dapat diakses oleh Owner.',
            ], 403);
        }

        return $next($request);
    }
}
