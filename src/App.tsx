import "./App.css";
import { useState, useEffect } from "react";

type Status = "pendente" | "andamento" | "concluida" | "atrasada";

interface Tarefa {
  id: number;
  titulo: string;
  status: Status;
}

const coresStatus: Record<Status, string> = {
  pendente: "#facc15",
  andamento: "#3b82f6",
  concluida: "#22c55e",
  atrasada: "#ef4444",
};

function App() {
  // Carrega estado inicial do localStorage
  const [tarefas, setTarefas] = useState<Tarefa[]>(() => {
    const salvo = localStorage.getItem("tarefas");
    return salvo ? JSON.parse(salvo) : [];
  });
  
  const [novoTitulo, setNovoTitulo] = useState("");
  const [temaEscuro, setTemaEscuro] = useState(() => {
    return localStorage.getItem("temaEscuro") === "true";
  });

  // Persiste tarefas no localStorage
  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  // Persiste tema no localStorage e aplica no body
  useEffect(() => {
    localStorage.setItem("temaEscuro", String(temaEscuro));
    document.body.className = temaEscuro ? "dark-theme" : "light-theme";
  }, [temaEscuro]);

  function adicionarTarefa() {
    if (novoTitulo.trim() === "") return;
    
    const novaTarefa: Tarefa = {
      id: Date.now(),
      titulo: novoTitulo,
      status: "pendente",
    };
    
    setTarefas([...tarefas, novaTarefa]);
    setNovoTitulo("");
  }

  function atualizarStatus(id: number, novoStatus: Status) {
    setTarefas(tarefas.map(t =>
      t.id === id ? { ...t, status: novoStatus } : t
    ));
  }

  function removerTarefa(id: number) {
    setTarefas(tarefas.filter(t => t.id !== id));
  }

  return (
    <div className={`App ${temaEscuro ? "dark" : "light"}`}>
      <div className="header">
        <h1>Todo List</h1>
        <button 
          onClick={() => setTemaEscuro(!temaEscuro)}
          className="tema-toggle"
          aria-label={`Alternar para tema ${temaEscuro ? "claro" : "escuro"}`}
        >
          {temaEscuro ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="input-container">
        <input
          type="text"
          value={novoTitulo}
          onChange={(e) => setNovoTitulo(e.target.value)}
          placeholder="Nova tarefa..."
          onKeyPress={(e) => e.key === "Enter" && adicionarTarefa()}
        />
        <button onClick={adicionarTarefa}>Adicionar</button>
      </div>

      <div className="tarefas-container">
        {tarefas.length === 0 ? (
          <p>Nenhuma tarefa cadastrada</p>
        ) : (
          tarefas.map((tarefa) => (
            <div className="card" key={tarefa.id}>
              <div className="card-content">
                <div className="titulo-container">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: coresStatus[tarefa.status] }}
                  ></span>
                  <strong>{tarefa.titulo}</strong>
                </div>
                <div className="card-actions">
                  <select
                    value={tarefa.status}
                    onChange={(e) => atualizarStatus(tarefa.id, e.target.value as Status)}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="andamento">Em andamento</option>
                    <option value="concluida">Concluída</option>
                    <option value="atrasada">Atrasada</option>
                  </select>
                  <button 
                    onClick={() => removerTarefa(tarefa.id)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;