import { AdvancedHttpClient } from '@/core';
import { MiddlewareContext, User } from '@/types';
import { API_ENDPOINTS } from '@/config';

export const runAdvancedExamples = async (): Promise<void> => {
  console.log('\n=== Advanced HttpClient Examples ===\n');

  const client = new AdvancedHttpClient({
    timeout: 5000,
    retries: 2,
    retryDelay: 500
  });

  client.use(async (context: MiddlewareContext, next) => {
    console.log(`[Middleware] Request to ${context.url}`);
    await next();
    console.log(`[Middleware] Request completed in ${Date.now() - context.startTime}ms`);
  });

  console.log('--- Fetching with timeout and retry ---');
  const users = await client.get<User[]>(API_ENDPOINTS.jsonPlaceholder.users);
  console.log(`Status: ${users.status}`);
  console.log(`Found ${users.data?.length ?? 0} users\n`);

  console.log('--- Creating a new user ---');
  const newUser = await client.post<User>(API_ENDPOINTS.jsonPlaceholder.users, {
    body: {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com'
    }
  });
  console.log(`Status: ${newUser.status}`);
  console.log(`Created user ID: ${newUser.data?.id}\n`);

  console.log('--- Updating a user ---');
  const updated = await client.put<User>(`${API_ENDPOINTS.jsonPlaceholder.users}/1`, {
    body: { name: 'Updated Name' }
  });
  console.log(`Status: ${updated.status}\n`);

  console.log('--- Deleting a user ---');
  const deleted = await client.delete(`${API_ENDPOINTS.jsonPlaceholder.users}/1`);
  console.log(`Status: ${deleted.status}\n`);

  console.log('--- Metrics ---');
  const metrics = client.getMetrics();
  console.log(`Total requests: ${metrics.requestCount}`);
  console.log(`Errors: ${metrics.errorCount}`);
  console.log(`Avg latency: ${metrics.averageLatency.toFixed(2)}ms\n`);

  console.log('--- Circuit Breaker State ---');
  const cbState = client.getCircuitBreakerState();
  console.log(`State: ${cbState.state}`);
  console.log(`Failures: ${cbState.failures}\n`);
};

