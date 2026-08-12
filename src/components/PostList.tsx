import type { Post } from "../types/post";
import PostCard from "./PostCard";

interface PostListProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export default function PostList({ posts, onEdit, onDelete, deletingId }: PostListProps) {
  if (posts.length === 0) {
    return <p className="post-grid__empty">No dispatches on file yet. File the first one above.</p>;
  }

  return (
    <div className="post-grid">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={deletingId === post.id}
        />
      ))}
    </div>
  );
}
