import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export default function Home() {
  const [apiStatus, setApiStatus] = useState("verificando...");

  useEffect(() => {
    apiFetch("/health")
      .then(() => setApiStatus("online"))
      .catch(() => setApiStatus("offline"));
  }, []);

  return (
    <main className="home">
      <p className="eyebrow">Pafazê</p>
      <h1>Encontre o que fazer com o que você tem em casa.</h1>
      <p>Base inicial do sistema. As histórias de usuário serão implementadas por feature.</p>
      <span className="status">API: {apiStatus}</span>
    </main>
  );
}
