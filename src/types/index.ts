// Add these types to your existing types.ts file

export interface NewsPost {
  id: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  title: string;
  content: string;
  tags: string[];
  media: {
    type: 'image' | 'video';
    url: string;
  }[];
  likes: string[];
  saves: string[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}