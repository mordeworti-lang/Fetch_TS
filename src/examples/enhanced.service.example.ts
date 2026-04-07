import { ApiService } from '@/services';
import { API_ENDPOINTS } from '@/config';
import { Post } from '@/types';

export const runEnhancedServiceExample = async (): Promise<void> => {
  console.log('\n=== Enhanced ApiService with Advanced Features ===\n');

  const postService = new ApiService<Post>(
    API_ENDPOINTS.jsonPlaceholder.posts,
    { useAdvanced: true, timeout: 5000, retries: 2 }
  );

  console.log('--- Fetching all posts ---');
  const allPosts = await postService.getAll();
  console.log(`Status: ${allPosts.status}`);
  console.log(`Found ${allPosts.data?.length ?? 0} posts\n`);

  console.log('--- Creating a post ---');
  const newPost = await postService.create({
    title: 'New Post Title',
    body: 'This is the content of the new post',
    userId: 1
  });
  console.log(`Status: ${newPost.status}`);
  console.log(`Created post ID: ${newPost.data?.id}\n`);

  console.log('--- Updating a post ---');
  const updated = await postService.update(1, { title: 'Updated Title' });
  console.log(`Status: ${updated.status}\n`);

  console.log('--- Deleting a post ---');
  const deleted = await postService.delete(1);
  console.log(`Status: ${deleted.status}\n`);

  console.log('--- Service Metrics ---');
  const metrics = postService.getMetrics();
  console.log(JSON.stringify(metrics, null, 2));
};

