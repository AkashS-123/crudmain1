import { useEffect, useState } from "react";
import type { Post } from "../types/post";
import type { NewPost } from "../api/posts";

interface PostFormProps {
  editingPost: Post | null;
  onSubmit: (post: NewPost) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
}

const EMPTY_FORM: NewPost = { title: "", description: "", price: 0, photo: "", rating: 0 };

export default function PostForm({ editingPost, onSubmit, onCancel, submitting }: PostFormProps) {
  const [form, setForm] = useState<NewPost>(EMPTY_FORM);

  useEffect(() => {
    if (editingPost) {
      setForm({
        title: editingPost.title,
        description: editingPost.description,
        price: editingPost.price,
        photo: editingPost.photo,
        rating: editingPost.rating,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editingPost]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    await onSubmit(form);
    if (!editingPost) setForm(EMPTY_FORM);
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <div className="post-form__header">
        <span className="post-form__label">
          {editingPost ? `Filing correction to No. ${String(editingPost.id).padStart(3, "0")}` : "File a new dispatch"}
        </span>
      </div>

      <input
        className="post-form__input"
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      <textarea
        className="post-form__textarea"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={3}
        required
      />

      <input
        className="post-form__input"
        type="url"
        placeholder="Photo URL"
        value={form.photo}
        onChange={(e) => setForm({ ...form, photo: e.target.value })}
        required
      />

      <div className="post-form__row">
        <input
          className="post-form__input"
          type="number"
          placeholder="Price"
          min={0}
          step={0.01}
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          required
        />

        <input
          className="post-form__input"
          type="number"
          placeholder="Rating"
          min={0}
          max={5}
          step={0.1}
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          required
        />
      </div>

      <div className="post-form__actions">
        <button className="post-form__submit" type="submit" disabled={submitting}>
          {submitting ? "Sending..." : editingPost ? "Save correction" : "Wire it in"}
        </button>
        {editingPost && (
          <button className="post-form__cancel" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
