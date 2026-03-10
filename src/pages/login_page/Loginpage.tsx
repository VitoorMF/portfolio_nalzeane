import { useState, type FormEvent } from "react";
import "./LoginPage.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/config.ts";
import { useNavigate } from "react-router-dom";
import eye from "../../assets/icons/eye.svg";
import eyeSlash from "../../assets/icons/eye-slash.svg";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
      navigate("/admin");
    } catch (error) {
      setErrorMessage("Não foi possível entrar. Verifique e-mail e senha.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-container" onSubmit={handleLogin}>
        <h1 className="login-title">Acesso Admin</h1>
        <p className="login-subtitle">Entre com suas credenciais para editar o site.</p>

        <label className="login-label" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
        />

        <label className="login-label" htmlFor="password">
          Senha
        </label>
        <div className="passwordwrapper">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Sua senha"
            required
          />
          <button
            className="togglebtn"
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            title={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            <img
              className="toggleicon"
              src={showPassword ? eyeSlash : eye}
              alt=""
              aria-hidden="true"
            />
          </button>
        </div>

        {errorMessage && <p className="login-error">{errorMessage}</p>}

        <button className="sendbtn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}

export default LoginPage;
