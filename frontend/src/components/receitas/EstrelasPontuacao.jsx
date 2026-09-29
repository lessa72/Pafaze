export default function EstrelasPontuacao({ media = 0, total = 0 }) {
  const notaFormatada = Number(media || 0).toFixed(1);
  const notaArredondada = Math.round(media || 0);

  return (
    <div className="estrelas-pontuacao" title={`${notaFormatada} de 5 estrelas`}>
      <span className="estrelas-icones" aria-label={`Nota ${notaFormatada} de 5`}>
        {[1, 2, 3, 4, 5].map((estrela) => (
          <span
            key={estrela}
            className={`estrela-icone ${estrela <= notaArredondada ? "preenchida" : "vazia"}`}
          >
            ★
          </span>
        ))}
      </span>

      {total > 0 ? (
        <span className="estrelas-texto">
          <strong>{notaFormatada}</strong> ({total} {total === 1 ? "avaliação" : "avaliações"})
        </span>
      ) : (
        <span className="estrelas-sem-avaliacao">Sem avaliações</span>
      )}
    </div>
  );
}
