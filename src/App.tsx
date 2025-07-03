import "./App.css";
import { useEffect, useState } from "react";

type Status = "pendente" | "andamento" | "concluida" | "atrasada";

interface Tarefa {
  id: number;
  titulo: string;
  status: Status;
}

function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [temaEscuro, setTemaEscuro] = useState(false);

  // Carregar tarefas
  useEffect(() => {
    const dados = localStorage.getItem("tarefas");
    if (dados) setTarefas(JSON.parse(dados));

    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo === "escuro") setTemaEscuro(true);
  }, []);

  // Salvar tarefas
  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  // Salvar tema
  useEffect(() => {
    localStorage.setItem("tema", temaEscuro ? "escuro" : "claro");
  }, [temaEscuro]);

  function addTarefa() {
    if (!novoTitulo.trim()) return;

    const nova: Tarefa = {
      id: tarefas.length + 1,
      titulo: novoTitulo.trim(),
      status: "pendente",
    };
    setTarefas([...tarefas, nova]);
    setNovoTitulo("");
  }

  function toggleStatus(id: number) {
    setTarefas((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "pendente" ? "concluida" : "pendente",
            }
          : t
      )
    );
  }

  function removerTarefa(id: number) {
    setTarefas((prev) => prev.filter((t) => t.id !== id));
  }

  function resetarTarefas() {
    setTarefas([]);
    localStorage.removeItem("tarefas");
  }

  function resumoTarefas() {
    return tarefas.reduce(
      (resumo, tarefa) => {
        resumo[tarefa.status]++;
        return resumo;
      },
      {
        pendente: 0,
        andamento: 0,
        concluida: 0,
        atrasada: 0,
      }
    );
  }

  const resumo = resumoTarefas();

  return (
    <div className={temaEscuro ? "container dark" : "container"}>
      <h1>To-Do List</h1>

      <button
        onClick={() => setTemaEscuro(!temaEscuro)}
        className="toggle-tema"
      >
        {temaEscuro ? "🌞 Modo Claro" : "🌙 Modo Escuro"}
      </button>

      <div className="task-input">
        <input
          type="text"
          placeholder="Nova tarefa"
          value={novoTitulo}
          onChange={(e) => setNovoTitulo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTarefa()}
        />
        <button onClick={addTarefa}>Adicionar</button>
      </div>

      {tarefas.map((tarefa) => (
        <div key={tarefa.id} className="task-item">
          <div className="task-title" onClick={() => toggleStatus(tarefa.id)}>
            <div
              className={`circle ${
                tarefa.status === "concluida" ? "completed" : ""
              }`}
            />
            <span className={tarefa.status === "concluida" ? "concluida" : ""}>
              {tarefa.titulo}
            </span>
          </div>
          <button className="lixeira" onClick={() => removerTarefa(tarefa.id)}>
            🗑️
          </button>
        </div>
      ))}

      <div className="resumo">
        <h3>📊 Resumo</h3>
        <p>Pendentes: {resumo.pendente}</p>
        <p>Concluídas: {resumo.concluida}</p>
        <p>Em andamento: {resumo.andamento}</p>
        <p>Atrasadas: {resumo.atrasada}</p>
      </div>

      <button className="resetar" onClick={resetarTarefas}>
        Resetar Tarefas
      </button>
    </div>
  );
}

export default App;
