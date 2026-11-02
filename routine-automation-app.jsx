import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  Circle, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Archive, 
  ChevronRight,
  LayoutList
} from 'lucide-react';

const RoutineAutomationApp = () => {
  // Estado para as tarefas e persistência no LocalStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('work_routine_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState('Média');
  const [filter, setFilter] = useState('Todas');

  useEffect(() => {
    localStorage.setItem('work_routine_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask = {
      id: Date.now(),
      text: inputValue,
      priority: priority,
      completed: false,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('pt-BR')
    };

    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const archiveAll = () => {
    if (window.confirm('Deseja arquivar todas as tarefas de hoje? Isso limpará sua lista.')) {
      setTasks([]);
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'Alta': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Média': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Baixa': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Pendentes') return !t.completed;
    if (filter === 'Concluídas') return t.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <LayoutList className="text-indigo-500" size={32} />
              WorkFlow <span className="text-indigo-500">OS</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
              <Calendar size={14} /> {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <button 
            onClick={archiveAll}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Arquivar tudo"
          >
            <Archive size={20} />
          </button>
        </header>

        {/* Input Section */}
        <form onSubmit={addTask} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl mb-8">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="O que precisa ser feito agora?"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 pl-11 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
              />
              <Plus className="absolute left-4 top-3.5 text-slate-500" size={20} />
            </div>
            
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-2">
                {['Baixa', 'Média', 'Alta'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      priority === p 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
              >
                Adicionar <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </form>

        {/* Filters */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          {['Todas', 'Pendentes', 'Concluídas'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f 
                ? 'bg-slate-200 text-slate-900' 
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
              <div className="bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-500">
                <CheckCircle size={24} />
              </div>
              <p className="text-slate-500 text-sm">Nenhuma tarefa encontrada para este filtro.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div 
                key={task.id}
                className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  task.completed 
                  ? 'bg-slate-900/40 border-slate-800 opacity-60' 
                  : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`transition-colors ${task.completed ? 'text-indigo-500' : 'text-slate-600 hover:text-slate-400'}`}
                  >
                    {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                  </button>
                  
                  <div className="flex flex-col overflow-hidden">
                    <span className={`text-sm font-medium truncate transition-all ${
                      task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                    }`}>
                      {task.text}
                    </span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md border font-bold uppercase ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock size={10} /> {task.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        {tasks.length > 0 && (
          <div className="mt-8 flex items-center justify-between text-xs text-slate-500 px-2">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{tasks.filter(t => !t.completed).length} pendentes</span>
            </div>
            <div>
              <span>{Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}% concluído</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineAutomationApp;