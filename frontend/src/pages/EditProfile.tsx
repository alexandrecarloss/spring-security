import { useState, useEffect } from "react";
import { userService, updateProfileRequest } from "../services/userService";
import { useToast } from "../context/ToastContext";
import { User, Envelope, Camera, ArrowLeft } from "@boxicons/react";
import { useNavigate } from "react-router-dom";
import "./Login/Login.css";

type CSSVars = React.CSSProperties & {
  "--i"?: number;
  "--j"?: number;
};

export function EditProfile() {
  const user = userService.getUserData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user?.picture ? userService.getAvatarUrl(user.picture) : "/default-avatar.png"
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      e.target.value = "";
    }
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  const handleUpdate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user) return;
      await updateProfileRequest(user.sub, fullName, selectedFile || undefined);
      showToast("Perfil atualizado! Faça login novamente.", "success");
      setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, 2000);
    } catch {
      showToast("Erro ao atualizar perfil", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper active edit-profile-page">
      <span className="bg-animated"></span>
      <span className="bg-animated2"></span>

      <div className="form-box register edit-mode">
        <div
          className="flex-header animation"
          style={{ "--i": 17, "--j": 0 } as CSSVars}
        >
          <button onClick={() => navigate("/feed")} className="back-btn-custom">
            <ArrowLeft size="base" />
          </button>
          <h2>Edit Profile</h2>
        </div>

        <form onSubmit={handleUpdate}>
          <div
            className="avatar-upload-container animation"
            style={{ "--i": 17.5, "--j": 0.5 } as CSSVars}
          >
            <label htmlFor="avatar-input" className="avatar-label">
              <img
                src={previewUrl || "/default-avatar.png"}
                className="avatar-preview-round"
                alt="Preview"
              />
              <div className="avatar-overlay">
                <Camera />
              </div>
            </label>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          <div
            className="input-box animation"
            style={{ "--i": 18, "--j": 1 } as CSSVars}
          >
            <input
              type="text"
              required
              placeholder=" "
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <label>Full Name</label>
            <User />
          </div>

          <div
            className="input-box animation"
            style={{ "--i": 19, "--j": 2, opacity: 0.6 } as CSSVars}
          >
            <input
              type="email"
              disabled
              value={user?.email || ""}
              placeholder=" "
            />
            <label>Email (Fixed)</label>
            <Envelope />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn animation ${loading ? "loading" : ""}`}
            style={{ "--i": 20, "--j": 3 } as CSSVars}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Texto lateral (Opcional - Herda o estilo do Login) */}
      <div className="info-text register">
        <h2 className="animation" style={{ "--i": 17, "--j": 0 } as CSSVars}>
          Settings
        </h2>
        <p className="animation" style={{ "--i": 18, "--j": 1 } as CSSVars}>
          Keep your profile up to date to better connect with others.
        </p>
      </div>
    </div>
  );
}
