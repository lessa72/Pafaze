import { Link } from "react-router-dom";
import EstrelasPontuacao from "./EstrelasPontuacao";

export default function ReceitaCard({ receita }) {
  if (!receita) return null;

  const trechoModoPreparo =
    receita.modo_preparo && receita.modo_preparo.length > 110
      ? `${receita.modo_preparo.slice(0, 110)}...`
      : receita.modo_preparo;

  return (
    <article className="receita-card-item">
      <div className="receita-card-header">
        <span className="receita-categoria-badge">{receita.categoria}</span>
        <EstrelasPontuacao
          media={receita.media_avaliacao}
          total={receita.total_avaliacoes}
        />
      </div>

      <h3 className="receita-card-titulo">
        <Link to={`/receitas/${receita.id}`} className="receita-card-link">
          {receita.nome}
        </Link>
      </h3>

      {trechoModoPreparo && (
        <p className="receita-card-descricao">{trechoModoPreparo}</p>
      )}

      <div className="receita-card-footer">
        <Link to={`/receitas/${receita.id}`} className="receita-card-botao">
          Ver receita completa &rarr;
        </Link>
      </div>
    </article>
  );
}
