import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type ApiPost = {
  id: number;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
  author: {
    id: number;
    username: string;
    name: string;
    avatarUrl: string | null;
  };
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
};

export type MappedPost = {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timeAgo: string;
  shares?: number;
};

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString();
}

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const response = await axios.get(
          'https://be-social-media-api-production.up.railway.app/api/posts'
        );
        const posts: ApiPost[] =
          response.data?.data?.posts || response.data?.posts || [];

        const mappedPosts: MappedPost[] = posts.map((post) => {
          let avatarUrl = post.author?.avatarUrl;

          if (avatarUrl && avatarUrl.startsWith('//')) {
            avatarUrl = `https:${avatarUrl}`;
          }

          return {
            id: String(post.id),
            user: {
              name: post.author?.name || 'Unknown User',
              username: post.author?.username || 'unknown',
              avatar:
                avatarUrl ||
                `https://ui-avatars.com/api/?name=${post.author?.name || 'U'}&background=333&color=fff`,
            },
            image: post.imageUrl,
            caption: post.caption || '',
            likes: post.likeCount || 0,
            comments: post.commentCount || 0,
            timeAgo: timeAgo(post.createdAt),
          };
        });

        return mappedPosts;
      } catch (error: any) {
        console.error('Error fetching posts. Status:', error?.response?.status);
        console.error('Error details:', error?.response?.data || error.message);
        throw error;
      }
    },
  });
}
