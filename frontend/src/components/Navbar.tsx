import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userService } from "../services/userService";

export function Navbar() {
  const user = userService.getUserData();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navLinks = [
    { name: 'Feed', path: '/feed' },
    { name: 'Explorar', path: '/feed' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 flex items-center justify-between px-6 md:px-16 mx-auto 
      ${isScrolled 
        ? "py-3 bg-black/70 backdrop-blur-lg border-b border-white/10 shadow-2xl" 
        : "py-6 bg-transparent"}`}>
      <div className="flex items-center gap-10">
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <Link 
            key={i} 
            to={link.path}
            className="relative overflow-hidden h-6 group">
              <span className="block group-hover:-translate-y-full transition-transform duration-300">{link.name}</span>
              <span className="block absolute top-full left-0 group-hover:translate-y-[-100%] transition-transform duration-300 text-blue-400">{link.name}</span>
            </Link>
          ))}
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
      <div className={`fixed inset-0 h-screen bg-black transition-all duration-500 flex flex-col items-center justify-center gap-8 z-[-1] md:hidden
        ${isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
        
        {navLinks.map((link, i) => (
          <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)} className="text-2xl font-light text-white hover:text-blue-400">
            {link.name}
          </Link>
        ))}
        <Link to="/profile/edit" onClick={() => setIsMenuOpen(false)} className="text-2xl font-light text-white">Editar Perfil</Link>
        <button onClick={handleLogout} className="mt-8 bg-white text-black px-12 py-4 rounded-full font-bold">Sair</button>
      </div>
    </nav>
  );
}