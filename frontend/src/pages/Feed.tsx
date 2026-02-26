import { useEffect, useState, useCallback } from "react";
import { createTweet, deleteTweet, getFeed } from "../services/tweetService";
import { getUserData, isAdmin } from "../auth/getUserData";
import { AxiosError } from "axios";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useToast } from "../context/ToastContext";

type Tweet = {
  tweetId: number;
  content: string;
  fullName: string;
  userId: string;
};

export function Feed() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [tweetToDelete, setTweetToDelete] = useState<number | null>(null);
  const { showToast } = useToast();

  const user = getUserData();

  const loadFeed = useCallback(async () => {
    try {
      const data = await getFeed();
      setTweets(data.feedItens || []);
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      showToast("Erro ao carregar feed", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws-tweets");
    const stompClient = Stomp.over(socket);

    stompClient.debug = () => {};
    stompClient.connect(
      {},
      () => {
        stompClient.subscribe("/topic/feed", (message: Stomp.Message) => {
          if (message.body === "update") {
            console.log("Atualização recebida via WebSocket!");
            loadFeed();
          }
        });
      },
      (error: string | Stomp.Frame) => {
        console.error("Erro na conexão WebSocket:", error);
      },
    );

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
          console.log("WebSocket desconectado");
        });
      }
    };
  }, [loadFeed]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handleTweet = async () => {
    if (!content.trim()) return;
    if (content.length > 65000) {
      showToast("Texto muito longo! Máximo de 65000 caracteres.", "error");
      return;
    }
    try {
      await createTweet(content);
      setContent("");
      showToast("Tweet publicado com sucesso");
      await loadFeed();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMessage =
        error.response?.data?.message || "Erro ao publicar tweet";
      showToast(errorMessage, "error");
    }
  };

  const confirmDelete = async () => {
    if (!tweetToDelete) return;
    try {
      await deleteTweet(tweetToDelete);
      showToast("Tweet excluído com sucesso");
      await loadFeed();
    } catch {
      showToast("Erro ao excluir tweet", "error");
    } finally {
      setTweetToDelete(null);
    }
  };

  if (loading) {
    return (
      <div style={{ color: "var(--text-color)", padding: 20 }}>
        Carregando tweets...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "40px",
        color: "var(--text-color)",
        minHeight: "100vh",
        width: "100vw",
        background: "var(--main-color)",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ color: "var(--secondary-color)" }}>Seu Feed</h1>

      <div style={{ margin: "20px 0", display: "flex", gap: "10px" }}>
        <textarea
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "4px",
            border: "2px solid var(--secondary-color)",
            fontSize: "16px",
            background: "var(--main-color)",
            color: "var(--text-color)",
          }}
          value={content}
          maxLength={65000}
          onChange={(e) => setContent(e.target.value)}
          placeholder="O que está pensando?"
        ></textarea>
        <button
          onClick={handleTweet}
          style={{
            padding: "10px 20px",
            background: "var(--secondary-color)",
            color: "var(--main-color)",
            fontWeight: "bold",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Postar
        </button>
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
        style={{
          color: "var(--alert-color)",
          background: "none",
          border: `1px solid var(--alert-color)`,
          padding: "5px 10px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Sair
      </button>

      <div style={{ marginTop: "20px" }}>
        {tweets.length > 0 ? (
          tweets.map((t) => (
            <div
              key={t.tweetId}
              style={{
                background: "var(--main-color)",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "15px",
                border: `1px solid var(--secondary-color)`,
              }}
            >
              <strong
                style={{
                  color: "var(--secondary-color)",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                @{t.fullName}
              </strong>

              <p
                style={{
                  fontSize: "18px",
                  margin: "0 0 15px 0",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowWrap: "break-word"
                //   overflowWrap: "anywhere",
                }}
              >
                {t.content}
              </p>

              {(isAdmin() || user?.sub === t.userId) && (
                <button
                  onClick={() => setTweetToDelete(t.tweetId)}
                  style={{
                    color: "var(--alert-color)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: "14px",
                    textDecoration: "underline",
                  }}
                >
                  Excluir Tweet
                </button>
              )}
            </div>
          ))
        ) : (
          <p style={{ opacity: 0.6 }}>Nenhum tweet disponível no momento.</p>
        )}
      </div>

      {tweetToDelete && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "var(--main-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "var(--main-color)",
              padding: "30px",
              borderRadius: "8px",
              textAlign: "center",
              border: `2px solid var(--secondary-color)`,
            }}
          >
            <p>Deseja excluir este tweet?</p>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 20,
                justifyContent: "center",
              }}
            >
              <button
                onClick={confirmDelete}
                style={{
                  background: "var(--alert-color)",
                  border: "none",
                  padding: "10px 15px",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                Sim, excluir
              </button>
              <button
                onClick={() => setTweetToDelete(null)}
                style={{
                  background: "gray",
                  border: "none",
                  padding: "10px 15px",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
