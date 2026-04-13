import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (email === "admin@barber.com" && password === "123456") {
        localStorage.setItem("token", "mock-token-123");
        navigate("/dashboard");
      } else {
        setError("Credenciais inválidas. Tente novamente.");
      }
      setLoading(false);
    }, 800);
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">

      {/* Lado esquerdo — branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-zinc-900 border-r border-zinc-800 p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-zinc-950" fill="currentColor" viewBox="0 0 24 24">
              <path d="M 18.292969 2.292969 L 14 6.585938 L 14 4 C 14 3.449219 13.550781 3 13 3 L 11 3 C 10.449219 3 10 3.449219 10 4 L 10 6.585938 L 5.707031 2.292969 C 5.316406 1.902344 4.683594 1.902344 4.292969 2.292969 C 3.902344 2.683594 3.902344 3.316406 4.292969 3.707031 L 8.585938 8 L 4.292969 12.292969 C 3.902344 12.683594 3.902344 13.316406 4.292969 13.707031 C 4.683594 14.097656 5.316406 14.097656 5.707031 13.707031 L 11 8.414063 L 11 20 C 11 20.550781 11.449219 21 12 21 C 12.550781 21 13 20.550781 13 20 L 13 8.414063 L 18.292969 13.707031 C 18.683594 14.097656 19.316406 14.097656 19.707031 13.707031 C 20.097656 13.316406 20.097656 12.683594 19.707031 12.292969 L 15.414063 8 L 19.707031 3.707031 C 20.097656 3.316406 20.097656 2.683594 19.707031 2.292969 C 19.316406 1.902344 18.683594 1.902344 18.292969 2.292969 Z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-white">BarberOS</span>
        </div>

        <div>
          <blockquote className="text-xl font-medium leading-relaxed text-zinc-300">
            "A melhor maneira de prever o futuro é criá-lo. Organize sua barbearia com inteligência."
          </blockquote>
          <p className="mt-4 text-sm text-zinc-600">— Gestão moderna para barbearias e salões</p>
        </div>

        <p className="text-xs text-zinc-700">© 2025 BarberOS. Todos os direitos reservados.</p>
      </div>

      {/* Lado direito — formulário */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6">
        <div className="w-full max-w-sm">

          {/* Logo mobile */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-zinc-950" fill="currentColor" viewBox="0 0 24 24">
                <path d="M 18.292969 2.292969 L 14 6.585938 L 14 4 C 14 3.449219 13.550781 3 13 3 L 11 3 C 10.449219 3 10 3.449219 10 4 L 10 6.585938 L 5.707031 2.292969 C 5.316406 1.902344 4.683594 1.902344 4.292969 2.292969 C 3.902344 2.683594 3.902344 3.316406 4.292969 3.707031 L 8.585938 8 L 4.292969 12.292969 C 3.902344 12.683594 3.902344 13.316406 4.292969 13.707031 C 4.683594 14.097656 5.316406 14.097656 5.707031 13.707031 L 11 8.414063 L 11 20 C 11 20.550781 11.449219 21 12 21 C 12.550781 21 13 20.550781 13 20 L 13 8.414063 L 18.292969 13.707031 C 18.683594 14.097656 19.316406 14.097656 19.707031 13.707031 C 20.097656 13.316406 20.097656 12.683594 19.707031 12.292969 L 15.414063 8 L 19.707031 3.707031 C 20.097656 3.316406 20.097656 2.683594 19.707031 2.292969 C 19.316406 1.902344 18.683594 1.902344 18.292969 2.292969 Z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-white">BarberOS</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white">Bem-vindo de volta</h1>
            <p className="mt-1 text-sm text-zinc-500">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-1.5">
              <label className="block text-sm text-zinc-400" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm text-zinc-400" htmlFor="password">Senha</label>
                <button type="button" className="text-xs text-amber-500 hover:text-amber-400 transition">
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-4 pr-10 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 accent-amber-500 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-zinc-500 cursor-pointer">
                Lembrar de mim
              </label>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-semibold rounded-lg text-sm transition"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Entrando...
                </span>
              ) : "Entrar"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-zinc-950 px-3 text-zinc-600 uppercase tracking-wider">ou continue com</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2.5 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Entrar com Google
          </button>

          <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
            <p className="text-zinc-600 text-xs text-center">
              Teste: <span className="text-zinc-400">admin@barber.com</span> / <span className="text-zinc-400">123456</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}