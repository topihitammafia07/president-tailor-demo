<?php

namespace App\Http\Middleware;

use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful as SanctumStatefulMiddleware;

class EnsureFrontendRequestsAreStateful extends SanctumStatefulMiddleware
{
    /**
     * Configure secure cookie sessions.
     *
     * @return void
     */
    protected function configureSecureCookieSessions()
    {
        $sameSite = env('SESSION_SAME_SITE', env('APP_ENV') === 'production' ? 'none' : 'lax');
        $secure = (bool) env('SESSION_SECURE_COOKIE', env('APP_ENV') === 'production');
        $partitioned = (bool) env('SESSION_PARTITIONED_COOKIE', env('APP_ENV') === 'production');

        config([
            'session.http_only' => true,
            'session.same_site' => $sameSite,
            'session.secure' => $secure,
            'session.partitioned' => $partitioned,
        ]);
    }
}
