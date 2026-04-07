import { ApiService } from '@/services';
import { API_ENDPOINTS } from '@/config';
import { User, Post } from '@/types';

export const runJsonPlaceholderExamples = async (): Promise<void> => {
  const userService = new ApiService<User>(API_ENDPOINTS.jsonPlaceholder.users);
  const postService = new ApiService<Post>(API_ENDPOINTS.jsonPlaceholder.posts);

  console.log('\n=== JSONPlaceholder Examples ===\n');

  console.log('--- Fetching all users ---');
  const users = await userService.getAll();
  console.log(`Status: ${users.status}`);
  console.log(`Found ${users.data?.length ?? 0} users`);
  console.log(`First user: ${users.data?.[0]?.name ?? 'N/A'}\n`);

  console.log('--- Fetching user with ID 1 ---');
  const user = await userService.getOne(1);
  console.log(`Status: ${user.status}`);
  console.log(`User: ${JSON.stringify(user.data, null, 2)}\n`);

  console.log('--- Fetching user with invalid ID (99999) ---');
  const invalidUser = await userService.getOne(99999);
  console.log(`Status: ${invalidUser.status}`);
  console.log(`Error: ${invalidUser.error ?? 'None'}`);
  console.log(`Data: ${invalidUser.data ?? 'null'}\n`);

  console.log('--- Fetching all posts ---');
  const posts = await postService.getAll();
  console.log(`Status: ${posts.status}`);
  console.log(`Found ${posts.data?.length ?? 0} posts`);
  console.log(`First post title: ${posts.data?.[0]?.title ?? 'N/A'}\n`);
};

