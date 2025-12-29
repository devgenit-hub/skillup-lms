import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * BFF (Backend-for-Frontend) Proxy
 *
 * This route handler proxies all requests to the backend API with the
 * Authorization header attached. This solves cross-domain cookie issues
 * by keeping auth tokens in httpOnly cookies on the frontend domain.
 *
 * Enterprise pattern used by:
 * - Vercel (for their dashboard)
 * - Stripe
 * - Most modern SaaS applications
 */
async function handler(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  // Build the target URL
  const apiPath = `/api/${path.join('/')}`;
  const url = new URL(apiPath, API_BASE_URL);

  // Preserve query parameters
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  // Forward the request with Authorization header
  const headers: HeadersInit = {
    'Content-Type': request.headers.get('Content-Type') || 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const body =
      request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined;

    const response = await fetch(url.toString(), {
      method: request.method,
      headers,
      body,
    });

    // Handle 204 No Content responses (empty body)
    if (response.status === 204) {
      return new NextResponse(null, {
        status: 204,
        statusText: 'No Content',
      });
    }

    const data = await response.text();

    return new NextResponse(data || null, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to proxy request' }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
