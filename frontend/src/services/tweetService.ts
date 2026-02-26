import { api } from "./api";

export async function getFeed(page = 0) {
  const response = await api.get(`/feed?page=${page}&pageSize=10`);
  return response.data;
}

export async function createTweet(content: string) {
  await api.post("/tweets", { content });
}

export async function deleteTweet(id: number) {
  await api.delete(`/tweets/${id}`);
}