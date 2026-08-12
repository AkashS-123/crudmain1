import type { Post } from "../types/post";

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const PALETTE = [
  { bg: "#e8c1a0", fg: "#7a4a2a" },
  { bg: "#c9d8c5", fg: "#3f5a3a" },
  { bg: "#cddbe8", fg: "#2f4a63" },
  { bg: "#e6c7d6", fg: "#6b3550" },
  { bg: "#e3dcae", fg: "#6b6127" },
  { bg: "#d3c7e6", fg: "#4f3a70" },
];

// Deterministic hash so the same post always gets the same color + initials,
// but different posts get visibly different placeholders.
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function buildPlaceholder(post: Post): string {
  const { bg, fg } = PALETTE[hashString(post.id + post.title) % PALETTE.length];
  const initials = getInitials(post.title);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'>
    <rect width='600' height='400' fill='${bg}'/>
    <text x='50%' y='50%' font-family='sans-serif' font-size='120' font-weight='600' fill='${fg}' text-anchor='middle' dominant-baseline='middle'>${initials}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export default function PostCard({ post, onEdit, onDelete, isDeleting }: PostCardProps) {
  const refCode = post.id.slice(0, 6).toUpperCase();
  const price = post.price ?? 0;
  const rating = post.rating ?? 0;
  const fullStars = Math.round(rating);
  const placeholder = buildPlaceholder(post);

  return (
    <article className="post-card">
      <div className="post-card__stamp">Ref. {refCode}</div>

      <img
        className="post-card__photo"
        src={post.photo || placeholder}
        alt={post.title}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = placeholder;
        }}
      />

      <h2 className="post-card__title">{post.title}</h2>
      <p className="post-card__body">{post.description}</p>

      <div className="post-card__meta">
        <span className="post-card__price">${price.toFixed(2)}</span>
        <span className="post-card__rating" aria-label={`Rating: ${rating} out of 5`}>
          {"★".repeat(fullStars)}
          {"☆".repeat(5 - fullStars)}
          <span className="post-card__rating-value"> {rating.toFixed(1)}</span>
        </span>
      </div>

      <div className="post-card__row">
        <div className="post-card__actions">
          <button type="button" className="post-card__action" onClick={() => onEdit(post)}>
            Edit
          </button>
          <button
            type="button"
            className="post-card__action post-card__action--danger"
            onClick={() => onDelete(post.id)}
            disabled={isDeleting}
          >
            {isDeleting ? "Removing..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}
