export type Post = {
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
};

export const mockPosts: Post[] = [
  {
    id: '1',
    user: {
      name: 'Alex Johnson',
      username: 'alexj',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
    image:
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop', // Group of kids
    caption:
      'The kids can’t stop smiling! 😁 Had a great time at the group meeting with community volunteers.',
    likes: 143,
    comments: 12,
    timeAgo: '2h',
  },
  {
    id: '2',
    user: {
      name: 'Sarah Smith',
      username: 'sarahs',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    },
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop', // Landscape
    caption:
      'A beautiful day to explore the mountains. Nature is the best healer. 🌿🏔️',
    likes: 892,
    comments: 45,
    timeAgo: '5h',
  },
  {
    id: '3',
    user: {
      name: 'David Chen',
      username: 'davidc',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    },
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop', // Interior
    caption: 'New minimal setup for the home office. What do you guys think?',
    likes: 320,
    comments: 28,
    timeAgo: '8h',
  },
  {
    id: '4',
    user: {
      name: 'Emma Wilson',
      username: 'emmaw',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704g',
    },
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop', // Concert
    caption: 'Best concert ever! The energy was absolutely incredible. 🎸🔥',
    likes: 1205,
    comments: 89,
    timeAgo: '12h',
  },
];
