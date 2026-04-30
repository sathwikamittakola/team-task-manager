import { useState, useEffect } from 'react';
import { taskService } from '../services/task.service';
import { CheckCircle2, Clock, AlertCircle, ListTodo, Loader2 } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const tasks = await taskService.getAll();
        const now = new Date();
        
        const calculatedStats = tasks.reduce((acc, task) => {
          acc.total++;
          if (task.status === 'Completed') acc.completed++;
          else if (task.status === 'Pending' || task.status === 'In Progress') acc.pending++;
          
          if (task.deadline && new Date(task.deadline) < now && task.status !== 'Completed') {
            acc.overdue++;
          }
          return acc;
        }, { total: 0, completed: 0, pending: 0, overdue: 0 });
        
        setStats(calculatedStats);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-xl mt-4">
        {error}
      </div>
    );
  }

  const statCards = [
    { title: 'Total Tasks', value: stats.total, icon: ListTodo, color: 'bg-blue-500' },
    { title: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'bg-emerald-500' },
    { title: 'Pending', value: stats.pending, icon: Clock, color: 'bg-amber-500' },
    { title: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Here's a summary of your tasks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`p-4 rounded-xl text-white ${stat.color}`}>
                <Icon size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
