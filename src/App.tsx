import { useEffect, useState } from "react";
import { createPost, deletePost, fetchPosts, updatePost } from "./api/posts";
import type { NewPost } from "./api/posts";
import type { Post } from "./types/post";
import Header from "./components/Header";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import StatusMessage from "./components/StatusMessage";
import "./App.css";

type LoadState = "loading" | "success" | "error";

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  // ---------- READ ----------
  const loadPosts = async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const data = await fetchPosts();
      // json-server assigns random ids rather than incrementing ones, so we
      // can't sort by id to get newest-first. The underlying file is written
      // in creation order, so reversing it puts the newest dispatch on top.
      setPosts([...data].reverse());
      setStatus("success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong while fetching posts.";
      setErrorMessage(message);
      setStatus("error");
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // ---------- CREATE / UPDATE ----------
  const handleSubmit = async (form: NewPost) => {
    setSubmitting(true);
    setActionError("");

    try {
      if (editingPost) {
        const updated = await updatePost(editingPost.id, form);
        setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setEditingPost(null);
      } else {
        const created = await createPost(form);
        setPosts((prev) => [created, ...prev]);
      }
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Could not save that dispatch. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- DELETE ----------
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setActionError("");

    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (editingPost?.id === id) setEditingPost(null);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Could not delete that dispatch. Try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page">
      <Header />

      <main className="content">
        {status === "loading" && (
          <StatusMessage variant="loading" message="Wiring the dispatch through..." />
        )}

        {status === "error" && (
          <StatusMessage
            variant="error"
            message={`Transmission failed: ${errorMessage}. Is the mock API running? (npm run server)`}
            onRetry={loadPosts}
          />
        )}

        {status === "success" && (
          <>
            <PostForm
              editingPost={editingPost}
              onSubmit={handleSubmit}
              onCancel={() => setEditingPost(null)}
              submitting={submitting}
            />

            {actionError && (
              <p className="action-error">{actionError}</p>
            )}

            <PostList
              posts={posts}
              onEdit={setEditingPost}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          </>
        )}
      </main>

      <footer className="page__footer">
        Data relayed live from <code>json-server</code> at{" "}
        <code>localhost:3001</code>
      </footer>
    </div>
  );
}

export default App;
