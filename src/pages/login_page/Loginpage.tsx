import { useState } from "react";
import "./LoginPage.css";
import { signInWithEmailAndPassword } from "firebase/auth";
// Make sure the path below points to your actual firebase config file that exports 'auth'
import { auth } from "../../../firebase/config.ts";
import { useNavigate } from "react-router-dom";
import eye from "../../assets/icons/eye.svg";
import eyeSlash from "../../assets/icons/eye-slash.svg";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/admin");
    } catch (error) {
      alert(`${(error as Error).message}`);
    }
  };

  return (
    <div className="login-container">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <div className="passwordwrapper">
        <input
          type={showPassword ? "text" : "password"}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
        />
        <button
          className="togglebtn"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          <img
            className="toggleicon"
            src={showPassword ? eyeSlash : eye}
            alt="Toggle password visibility"
          />
        </button>
      </div>
      <button className="sendbtn" onClick={handleLogin}>
        Entrar
      </button>
    </div>
  );
}

export default LoginPage;
