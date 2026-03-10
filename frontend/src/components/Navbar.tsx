import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userService } from "../services/userService";

export function Navbar() {
  const user = userService.getUserData();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="sticky top-4 z-[100] flex items-center justify-between border mx-auto w-[95%] max-w-7xl border-slate-700 px-8 py-4 rounded-full text-white text-sm bg-black/60 backdrop-blur-xl shadow-2xl">
      
      <div className="flex items-center gap-10">
        <div className="hidden md:flex items-center gap-8">
          <Link to="/feed" className="relative overflow-hidden h-6 group">
            <span className="block group-hover:-translate-y-full transition-transform duration-300">Feed</span>
            <span className="block absolute top-full left-0 group-hover:translate-y-[-100%] transition-transform duration-300 text-blue-400">Feed</span>
          </Link>
        </div>
      </div>

      {/* Lado Direito: Perfil + Logout */}
      <div className="flex items-center gap-6">
        {/* Avatar clicável para editar perfil */}
        <button 
          onClick={() => navigate("/profile/edit")}
          className="flex items-center gap-3 hover:bg-white/5 p-1 pr-4 rounded-full transition group"
        >
          <img 
            src={userService.getAvatarUrl(user?.picture)} 
            alt="Profile" 
            className="w-9 h-9 rounded-full object-cover border border-slate-600 group-hover:border-blue-400 transition"
          />
          <span className="hidden sm:block font-medium text-slate-200 group-hover:text-white">
            {user?.fullName?.split(' ')[0] || "Usuário"}
          </span>
        </button>
        
        <button 
          onClick={handleLogout}
          className="hidden md:block bg-white text-black px-6 py-2.5 rounded-full text-xs font-bold hover:bg-slate-200 hover:scale-105 transition active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          Sair
        </button>

        {/* Botão Mobile */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="absolute top-[calc(100%+10px)] left-0 right-0 bg-black/95 border border-slate-800 p-6 rounded-[2rem] md:hidden flex flex-col gap-4 animate-in slide-in-from-top-2 duration-300">
          <Link to="/profile/edit" onClick={() => setIsMenuOpen(false)} className="p-3 hover:bg-white/5 rounded-xl">Editar Perfil</Link>
          <Link to="/feed" onClick={() => setIsMenuOpen(false)} className="p-3 hover:bg-white/5 rounded-xl">Feed</Link>
          <button onClick={handleLogout} className="mt-4 bg-white text-black w-full py-3 rounded-full font-bold text-center">Sair</button>
        </div>
      )}
    </nav>
  );
}