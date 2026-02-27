import { useEffect, useState, useCallback, useRef } from "react";
import { createTweet, deleteTweet, getFeed } from "../services/tweetService";
import { getUserData, isAdmin } from "../auth/getUserData";
import { AxiosError } from "axios";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useToast } from "../context/ToastContext";
import "./Feed.css";

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
    <div className="expandable-container">
      <div className={`expandable-content ${isExpanded ? "expanded" : "collapsed"}`}>
        {isExpanded ? text : `${text.substring(0, limit)}...`}
      </div>

      <button
        className="expand-button"
        onClick={() => setIsExpanded(!isExpanded)}
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
      <div className="post-area">
        <textarea
          className="post-textarea"
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

        <div className="post-controls">
          <span className={`char-counter ${content.length > 60000 ? "limit-near" : ""}`}>
            {content.length.toLocaleString()} / 65.000
          </span>

          <button onClick={handleTweet} className="post-button">
            Postar
          </button>
        </div>
      </div>

      <button
        className="logout-button"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        Sair da conta
      </button>
      
      {/* LISTAGEM DE TWEETS */}
      <div className="tweets-list">
        {tweets.length > 0 ? (
          tweets.map((t) => (
            <div key={t.tweetId} className="tweet-card">
              <strong className="tweet-author">@{t.fullName}</strong>

              <div className="tweet-content">
                <ExpandableText text={t.content} limit={400} />
              </div>

              {(isAdmin() || user?.sub === t.userId) && (
                <button
                  onClick={() => setTweetToDelete(t.tweetId)}
                  className="delete-tweet-button"
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
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Deseja excluir este tweet?</p>
            <div className="modal-actions">
              <button onClick={confirmDelete} className="btn-confirm">
                Confirmar Exclusão
              </button>
              <button onClick={() => setTweetToDelete(null)} className="btn-cancel">
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
