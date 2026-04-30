import { useState, useEffect } from 'react';
import { projectService } from '../services/project.service';
import { useAuth } from '../context/AuthContext';
import { FolderPlus, Users, Loader2 } from 'lucide-react';

export const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const isAdmin = user?.role === 'Admin';
  
  // Modal state
  const [isModalOpen, setModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectMembers, setNewProjectMembers] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await projectService.create({ 
        name: newProjectName, 
        members: [] // Backend expects an array of User IDs
      });
      setProjects([...projects, created]);
      setModalOpen(false);
      setNewProjectName('');
      setNewProjectMembers(1);
    } catch (err) {
      setError('Failed to create project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">Manage your team projects.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm font-medium"
          >
            <FolderPlus size={20} />
            New Project
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
            <div className="flex items-center gap-2 text-gray-500 mb-4">
              <Users size={16} />
              <span className="text-sm">{project.members?.length || 0} members</span>
            </div>
            <div className="text-xs text-gray-400">
              Created on {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
        {projects.length === 0 && !error && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
            No projects found. Create one to get started!
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Members (incl. you)</label>
                <input
                  type="number"
                  min="1"
                  value={newProjectMembers}
                  onChange={(e) => setNewProjectMembers(e.target.value)}
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
