import { useEffect, useState, useCallback, useRef } from "react";
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

function ExpandableText({
  text,
  limit = 400,
}: {
  text: string;
  limit?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= limit) {
    return <>{text}</>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          maxHeight: isExpanded ? "500px" : "150px",
          overflowY: isExpanded ? "auto" : "hidden",
          transition: "max-height 0.3s ease",
          paddingRight: "5px",
        }}
      >
        {isExpanded ? text : `${text.substring(0, limit)}...`}
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          alignSelf: "flex-start",
          background: "none",
          border: "none",
          color: "var(--secondary-color)",
          cursor: "pointer",
          fontWeight: "bold",
          padding: "5px 0",
          fontSize: "14px",
          textDecoration: "underline",
        }}
      >
        {isExpanded ? "Ver menos" : "Ler mais"}
      </button>
    </div>
  );
}

export function Feed() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [tweetToDelete, setTweetToDelete] = useState<number | null>(null);
  const { showToast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      if (textareaRef.current) {
        textareaRef.current.style.height = "60px";
      }
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

      {/* ÁREA DE POSTAGEM */}
      <div
        style={{
          marginBottom: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <textarea
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "4px",
            border: "2px solid var(--secondary-color)",
            fontSize: "16px",
            background: "var(--main-color)",
            color: "var(--text-color)",
            resize: "none",
            overflow: "hidden",
            minHeight: "60px",
            boxSizing: "border-box",
          }}
          ref={textareaRef}
          value={content}
          maxLength={65000}
          placeholder="O que está pensando?"
          onChange={(e) => {
            setContent(e.target.value);
            e.target.style.height = "inherit";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              opacity: content.length > 60000 ? 1 : 0.6,
              color: content.length > 60000 ? "var(--alert-color)" : "inherit",
              fontWeight: content.length > 60000 ? "bold" : "normal",
            }}
          >
            {content.length.toLocaleString()} / 65.000
          </span>

          <button
            onClick={handleTweet}
            className="post-button"
            onMouseOver={(e) =>
              (e.currentTarget.style.filter = "brightness(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.98)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Postar
          </button>
        </div>
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
        style={{
          position: "absolute",
          top: "40px",
          right: "40px",
          color: "var(--text-color)",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.2)",
          padding: "8px 16px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          transition: "background 0.2s",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
        }
        onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
      >
        Sair da conta
      </button>
      {/* LISTAGEM DE TWEETS */}
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

              <div
                style={{
                  fontSize: "18px",
                  margin: "0 0 15px 0",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                <ExpandableText text={t.content} limit={400} />
              </div>

              {(isAdmin() || user?.sub === t.userId) && (
                <button
                  onClick={() => setTweetToDelete(t.tweetId)}
                  style={{
                    color: "var(--alert-color)",
                    background: "rgba(255, 0, 0, 0.05)",
                    border: "1px solid transparent",
                    cursor: "pointer",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: "500",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.border =
                      "1px solid var(--alert-color)";
                    e.currentTarget.style.background = "rgba(255, 0, 0, 0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.border = "1px solid transparent";
                    e.currentTarget.style.background = "rgba(255, 0, 0, 0.05)";
                  }}
                >
                  Excluir
                </button>
              )}
            </div>
          ))
        ) : (
          <p style={{ opacity: 0.6 }}>Nenhum tweet disponível no momento.</p>
        )}
      </div>

      {/* MODAL DE EXCLUSÃO */}
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
                  padding: "12px 24px",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  boxShadow: "0 4px 14px rgba(255,0,0,0.2)",
                }}
              >
                Confirmar Exclusão
              </button>

              <button
                onClick={() => setTweetToDelete(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "12px 24px",
                  color: "var(--text-color)",
                  cursor: "pointer",
                  opacity: 0.7,
                }}
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
