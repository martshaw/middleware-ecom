import { NextRequest, NextResponse } from 'next/server';
import { middleware } from './middleware';
import * as normalizeModule from './utils/normalizeProducts';
import * as rewriteModule from './utils/rewriteHandlers';

jest.mock('./utils/normalizeProducts');
jest.mock('./utils/rewriteHandlers');

describe('middleware', () => {
  let request: NextRequest;
  let nextResponseNextSpy: jest.SpyInstance;
  let nextResponseJsonSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  // Use the environment variable for the API URL, fallback to localhost if not set
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  beforeEach(() => {
    jest.clearAllMocks();
    (normalizeModule.normalizeProducts as jest.Mock).mockImplementation((data) => data);
    (rewriteModule.handleRewrite as jest.Mock).mockReturnValue(null);
    nextResponseNextSpy = jest.spyOn(NextResponse, 'next').mockImplementation(() => ({
      headers: { set: jest.fn() },
    } as unknown as NextResponse));
    nextResponseJsonSpy = jest.spyOn(NextResponse, 'json').mockImplementation((data) => ({
      headers: { set: jest.fn() },
      data,
    } as unknown as NextResponse));
    // Suppress console.error for cleaner test output
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after each test
    consoleErrorSpy.mockRestore();
  });

  function mockRequest(url: string, headers: Record<string, string> = {}) {
    return {
      nextUrl: new URL(url, 'http://localhost'),
      url,
      headers: {
        get: (key: string) => headers[key] || undefined,
      },
    } as unknown as NextRequest;
  }

  /**
   * Test: Normalizes product API responses and returns JSON
   * Incoming: A request to /api/products, fetch returns { products: [{ name: 'Test' }] }
   * Test: Ensures normalizeProducts is called, and the normalized result is returned as JSON with the processed header set.
   * Outgoing: { products: [{ name: 'Normalized' }] }, header 'x-middleware-processed' is set
   */
  it('should normalize product API responses and return JSON', async () => {
    const mockJson = jest.fn().mockResolvedValue({ products: [{ name: 'Test' }] });
    global.fetch = jest.fn().mockResolvedValue({ json: mockJson }) as unknown as jest.MockedFunction<typeof fetch>;
    (normalizeModule.normalizeProducts as jest.Mock).mockImplementation(() => ({ products: [{ name: 'Normalized' }] }));

    request = mockRequest(`${API_URL}/api/products`);
    const res = await middleware(request);
    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/api/products`, { headers: { 'x-middleware-processed': '1' } });
    expect(normalizeModule.normalizeProducts).toHaveBeenCalledWith({ products: [{ name: 'Test' }] });
    expect(nextResponseJsonSpy).toHaveBeenCalledWith({ products: [{ name: 'Normalized' }] });
    expect(res.headers.set).toHaveBeenCalledWith('x-middleware-processed', '1');
  });

  /**
   * Test: Handles array response shape
   * Incoming: A request to /api/shopify, fetch returns an array [{ name: 'Test' }]
   * Test: Ensures normalizeProducts is called with the array, and the normalized array is returned as JSON with the processed header set.
   * Outgoing: [{ name: 'Normalized' }], header 'x-middleware-processed' is set
   */
  it('should handle array response shape', async () => {
    const mockJson = jest.fn().mockResolvedValue([{ name: 'Test' }]);
    global.fetch = jest.fn().mockResolvedValue({ json: mockJson }) as unknown as jest.MockedFunction<typeof fetch>;
    (normalizeModule.normalizeProducts as jest.Mock).mockImplementation(() => [{ name: 'Normalized' }]);

    request = mockRequest(`${API_URL}/api/shopify`);
    const res = await middleware(request);
    expect(normalizeModule.normalizeProducts).toHaveBeenCalledWith([{ name: 'Test' }]);
    expect(nextResponseJsonSpy).toHaveBeenCalledWith([{ name: 'Normalized' }]);
    expect(res.headers.set).toHaveBeenCalledWith('x-middleware-processed', '1');
  });

  /**
   * Test: Skips normalization if response is not JSON
   * Incoming: A request to /api/salesforce, fetch returns a response whose .json() rejects (not JSON)
   * Test: Ensures normalizeProducts is NOT called, and NextResponse.next() is called instead.
   * Outgoing: No normalization, passes through to next middleware/handler
   */
  it('should skip normalization if response is not JSON', async () => {
    const mockJson = jest.fn().mockRejectedValue(new Error('Not JSON'));
    global.fetch = jest.fn().mockResolvedValue({ json: mockJson }) as unknown as jest.MockedFunction<typeof fetch>;
    request = mockRequest('http://localhost/api/salesforce');
    await middleware(request);
    expect(nextResponseNextSpy).toHaveBeenCalled();
    expect(normalizeModule.normalizeProducts).not.toHaveBeenCalled();
  });

  /**
   * Test: Rewrites /salesforce to /products?source=salesforce
   * Incoming: A request to /salesforce
   * Test: Ensures handleRewrite is called and the rewritten URL is correct.
   * Outgoing: URL is /products?source=salesforce
   */
  it('should rewrite /salesforce to /products?source=salesforce', async () => {
    (rewriteModule.handleRewrite as jest.Mock).mockImplementation(() => ({ headers: { set: jest.fn() }, url: '/products?source=salesforce' }));
    request = mockRequest('http://localhost/salesforce');
    const res = await middleware(request);
    expect(rewriteModule.handleRewrite).toHaveBeenCalledWith(request);
    expect(res.url).toBe('/products?source=salesforce');
  });

  /**
   * Test: Rewrites /shopify to /products?source=shopify
   * Incoming: A request to /shopify
   * Test: Ensures handleRewrite is called and the rewritten URL is correct.
   * Outgoing: URL is /products?source=shopify
   */
  it('should rewrite /shopify to /products?source=shopify', async () => {
    (rewriteModule.handleRewrite as jest.Mock).mockImplementation(() => ({ headers: { set: jest.fn() }, url: '/products?source=shopify' }));
    request = mockRequest('http://localhost/shopify');
    const res = await middleware(request);
    expect(rewriteModule.handleRewrite).toHaveBeenCalledWith(request);
    expect(res.url).toBe('/products?source=shopify');
  });

  /**
   * Test: Passes through for unmatched routes
   * Incoming: A request to /other (not matched by middleware)
   * Test: Ensures NextResponse.next() is called and no processed header is set.
   * Outgoing: Passes through, no normalization or rewrite
   */
  it('should pass through for unmatched routes', async () => {
    request = mockRequest('http://localhost/other');
    const res = await middleware(request);
    expect(nextResponseNextSpy).toHaveBeenCalled();
    expect(res.headers.set).not.toHaveBeenCalledWith('x-middleware-processed', '1');
  });

  /**
   * Test: Skips already processed requests
   * Incoming: A request to /api/products with x-middleware-processed header set
   * Test: Ensures NextResponse.next() is called and normalizeProducts is NOT called.
   * Outgoing: Passes through, no normalization
   */
  it('should skip already processed requests', async () => {
    request = mockRequest('http://localhost/api/products', { 'x-middleware-processed': '1' });
    await middleware(request);
    expect(nextResponseNextSpy).toHaveBeenCalled();
    expect(normalizeModule.normalizeProducts).not.toHaveBeenCalled();
  });
});
