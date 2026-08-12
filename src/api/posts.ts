import type { Post } from "../types/post";

const BASE_URL = "https://crudmain1.onrender.com";

export type NewPost = Omit<Post, "id">;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

/** READ — fetch all posts from the mock API. */
export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch(`${BASE_URL}/posts`);
  return handleResponse<Post[]>(response);
}

/** CREATE — add a new post. json-server assigns the id. */
export async function createPost(post: NewPost): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  return handleResponse<Post>(response);
}

/** UPDATE — replace an existing post's title/body. */
export async function updatePost(id: string, post: NewPost): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  return handleResponse<Post>(response);
}

/** DELETE — remove a post permanently. */
export async function deletePost(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
}
