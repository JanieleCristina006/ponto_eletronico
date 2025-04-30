export async function buscarFeriadosNacionais(ano) {
    try {
      const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`);
      if (!response.ok) throw new Error("Erro ao buscar feriados");
  
      const feriados = await response.json();
  
      // Retorna um array só com as datas (ex: ['2025-01-01', '2025-04-21', ...])
      return feriados.map((feriado) => feriado.date);
    } catch (error) {
      console.error("Erro ao buscar feriados:", error);
      return [];
    }
  }
  