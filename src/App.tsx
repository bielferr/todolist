import "./App.css";
import { useState } from "react";

export type Status = "pendente" | "andamento" | "concluida" | "atrasada";

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
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [temaEscuro, setTemaEscuro] = useState(false);

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
    setTarefas(
      tarefas.map((t) => (t.id === id ? { ...t, status: novoStatus } : t))
    );
  }

  return (
    <div className={`App ${temaEscuro ? "dark" : "light"}`}>
      <h1>Todo List</h1>

      <button onClick={() => setTemaEscuro(!temaEscuro)} className="toggle-btn">
        {temaEscuro ? "Tema Claro" : "Tema Escuro"}
      </button>

      <div className="input-container">
        <input
          type="text"
          value={novoTitulo}
          onChange={(e) => setNovoTitulo(e.target.value)}
          placeholder="Nova tarefa..."
        />
        <button onClick={adicionarTarefa}>Adicionar</button>
      </div>

      <div className="tarefas-container">
        {tarefas.map((tarefa) => (
          <div className="card" key={tarefa.id}>
            <div className="titulo-container">
              <span
                className="status-badge"
                style={{ backgroundColor: coresStatus[tarefa.status] }}
              ></span>
              <strong>{tarefa.titulo}</strong>
            </div>

            <select
              value={tarefa.status}
              onChange={(e) => atualizarStatus(tarefa.id, e.target.value as Status)}
            >
              <option value="pendente">Pendente</option>
              <option value="andamento">Em andamento</option>
              <option value="concluida">Concluída</option>
              <option value="atrasada">Atrasada</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
