import { useState, useEffect } from 'react';
import { taskService } from '../services/task.service';
import { projectService } from '../services/project.service';
import { useAuth } from '../context/AuthContext';
import { Plus, Calendar, User, CheckCircle2, Circle, Clock, Loader2, AlertTriangle } from 'lucide-react';

export const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');

  // Modal State
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', projectId: '', assignee: '', deadline: '', status: 'Pending' });

  useEffect(() => {
    fetchData();
  }, [selectedProjectId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedTasks, fetchedProjects] = await Promise.all([
        taskService.getAll(selectedProjectId || null),
        projectService.getAll()
      ]);
      setTasks(fetchedTasks);
      setProjects(fetchedProjects);
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { assignee, ...taskData } = newTask;
      const created = await taskService.create({
        ...taskData,
        assignedTo: user?.id, // Assign to current user by default
        projectId: newTask.projectId, 
        deadline: newTask.deadline ? new Date(newTask.deadline).toISOString() : undefined
      });
      // Add to local state if it matches current filter
      if (!selectedProjectId || selectedProjectId === (created.projectId._id || created.projectId)) {
        setTasks([...tasks, created]);
      }
      setModalOpen(false);
      setNewTask({ title: '', projectId: '', assignee: '', deadline: '', status: 'Pending' });
    } catch (err) {
       setError('Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      const updated = await taskService.update(id, { status: newStatus });
      setTasks(tasks.map(t => (t._id || t.id) === id ? updated : t));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const isOverdue = (deadline, status) => {
    return status !== 'Completed' && new Date(deadline) < new Date();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="text-emerald-500" size={20} />;
      case 'In Progress': return <Clock className="text-amber-500" size={20} />;
      default: return <Circle className="text-gray-400" size={20} />;
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500 mt-1">Track and manage your team's work.</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-48 bg-white"
          >
            <option value="">All Projects</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm font-medium w-full sm:w-auto whitespace-nowrap"
          >
            <Plus size={20} />
            New Task
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {tasks.map(task => {
            const overdue = isOverdue(task.deadline, task.status);
            return (
              <li key={task._id} className={`p-4 hover:bg-gray-50 transition-colors ${overdue ? 'bg-red-50/30' : ''}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <button 
                      onClick={() => updateTaskStatus(task._id, task.status === 'Completed' ? 'Pending' : 'Completed')}
                      className="mt-1 focus:outline-none"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <div>
                      <h3 className={`font-medium text-gray-900 ${task.status === 'Completed' ? 'line-through text-gray-400' : ''}`}>
                        {task.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {task.assignedTo?.name || 'Unassigned'}
                        </span>
                        <span className={`flex items-center gap-1 ${overdue ? 'text-red-600 font-medium' : ''}`}>
                          <Calendar size={14} />
                          {new Date(task.deadline).toLocaleDateString()}
                          {overdue && <AlertTriangle size={14} className="ml-1" />}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">
                           Project: {task.projectId?.name || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                    className="text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </li>
            );
          })}
          {tasks.length === 0 && !error && (
            <li className="p-8 text-center text-gray-500">
              No tasks found.
            </li>
          )}
        </ul>
      </div>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <select
                  value={newTask.projectId}
                  onChange={(e) => setNewTask({...newTask, projectId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="" disabled>Select Project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                <input
                  type="text"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
