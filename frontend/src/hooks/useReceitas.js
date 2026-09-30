import { useEffect, useState } from "react";
import { obterCategorias, obterReceitas } from "../api/receitas";

export function useReceitas() {
  const [receitas, setReceitas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("avaliacao");
  const [ordem, setOrdem] = useState("desc");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    obterCategorias()
      .then((cats) => setCategorias(cats || []))
      .catch(() => {});
  }, []);

  async function carregarReceitas() {
    setCarregando(true);
    setErro("");
    try {
      const dados = await obterReceitas({
        nome: termoBusca,
        categoria: categoriaAtiva,
        ordenarPor,
        ordem,
      });
      setReceitas(dados || []);
    } catch (err) {
      setErro(err.message || "Erro ao carregar receitas.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      carregarReceitas();
    }, 250);
    return () => clearTimeout(timer);
  }, [termoBusca, categoriaAtiva, ordenarPor, ordem]);

  return {
    receitas,
    categorias,
    termoBusca,
    setTermoBusca,
    categoriaAtiva,
    setCategoriaAtiva,
    ordenarPor,
    ordem,
    definirOrdenacao: ({ ordenarPor: o, ordem: d }) => {
      setOrdenarPor(o);
      setOrdem(d);
    },
    carregando,
    erro,
    recarregar: carregarReceitas,
  };
}
