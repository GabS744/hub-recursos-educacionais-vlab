import { useState, useEffect } from "react";
import api from "./services/api";
import CardFeatures from "./components/CardFeatures"; // Ajuste o caminho de importação se necessário
import "./App.css"

function App() {
  // 1. Criamos o estado para guardar a lista (começa como um array vazio)
  const [recursos, setRecursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. O useEffect faz a chamada assim que a tela carrega
  useEffect(() => {
    const buscarRecursos = async () => {
      try {
        const response = await api.get("/recursos/");
        // O Axios entrega os dados prontinhos dentro de response.data
        setRecursos(response.data); 
      } catch (error) {
        console.error("Erro ao conectar com o backend:", error);
      } finally {
        setIsLoading(false);
      }
    };

    buscarRecursos();
  }, []); // O array vazio [] garante que isso só rode 1 vez ao abrir a tela

  return (
    <div className="bg-[#12192B] min-h-screen w-full p-10 flex flex-col items-center">
      
      <div className="w-full max-w-6xl mb-8 flex justify-between items-center">
        <h1 className="text-white text-3xl font-bold">Hub de Recursos Educacionais</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
          + Novo Recurso
        </button>
      </div>

      {isLoading ? (
        <p className="text-white">Carregando recursos...</p>
      ) : (
        // 3. A Mágica do React: O ".map()"
        // Ele pega a lista do Python e transforma cada item em um Card!
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recursos.length > 0 ? (
            recursos.map((recurso) => {
              // Tratamento para as tags: Se o banco devolver uma string "IA, Curso", transformamos em Array
              const listaDeTags = typeof recurso.tags === 'string' 
                ? recurso.tags.split(',').map(tag => tag.trim()) 
                : recurso.tags;

              return (
                <CardFeatures 
                  key={recurso.id} // O React exige uma key única
                  titulo={recurso.titulo}
                  tipo={recurso.tipo}
                  descricao={recurso.descricao}
                  url={recurso.url}
                  tags={listaDeTags}
                />
              );
            })
          ) : (
            <p className="text-gray-400">Nenhum recurso cadastrado ainda.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;