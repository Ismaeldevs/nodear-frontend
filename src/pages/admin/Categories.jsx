import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { categoryService } from '../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.data || response || []);
    } catch (error) {
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          if (editingId) {
              await categoryService.update(editingId, formData);
              toast.success('Categoría actualizada');
          } else {
              await categoryService.create(formData);
              toast.success('Categoría creada');
          }
          setEditingId(null);
          setIsCreating(false);
          setFormData({ nombre: '', descripcion: '' });
          loadCategories();
      } catch (error) {
          toast.error('Error al guardar categoría');
      }
  };

  const startEdit = (category) => {
      setEditingId(category.id);
      setIsCreating(false);
      setFormData({ nombre: category.nombre, descripcion: category.descripcion || '' });
  };

  const handleDelete = async () => {
      if(!categoryToDelete) return;
      try {
          await categoryService.delete(categoryToDelete);
          toast.success('Categoría eliminada');
          loadCategories();
      } catch (error) {
          toast.error('Error al eliminar');
      } finally {
        setCategoryToDelete(null);
      }
  }

  return (
    <AdminLayout title="Categorías" subtitle="Clasificación de productos">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form Section */}
            <div className="lg:col-span-1">
                <div className={`bg-white p-6 border-2 ${isCreating || editingId ? 'border-accent' : 'border-black'} shadow-sm sticky top-28 transition-colors duration-300`}>
                    <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                        {editingId ? <><Edit2 className="w-5 h-5" /> Editar Categoría</> : <><Plus className="w-5 h-5" /> Nueva Categoría</>}
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Nombre</label>
                            <input 
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 p-3 font-bold uppercase focus:border-black focus:outline-none"
                                placeholder="EJ: REMERAS"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Descripción</label>
                            <textarea 
                                value={formData.descripcion}
                                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:border-black focus:outline-none resize-none h-24"
                                placeholder="Descripción opcional..."
                            />
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                            <button type="submit" className="flex-1 bg-black text-white p-3 font-black uppercase tracking-wider hover:bg-accent hover:text-black transition-colors">
                                {editingId ? 'Actualizar' : 'Crear'}
                            </button>
                            {(editingId || formData.nombre) && (
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setEditingId(null);
                                        setFormData({ nombre: '', descripcion: '' });
                                        setIsCreating(false);
                                    }}
                                    className="bg-gray-200 text-gray-600 p-3 hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2">
                 <div className="bg-white border border-gray-200">
                    <table className="w-full">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-xs">Nombre</th>
                                <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-xs hidden sm:table-cell">Descripción</th>
                                <th className="px-6 py-4 text-right font-black uppercase tracking-wider text-xs">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map((cat) => (
                                <tr key={cat.id} className={`group hover:bg-gray-50 transition-colors ${editingId === cat.id ? 'bg-accent/10' : ''}`}>
                                    <td className="px-6 py-4">
                                        <span className="font-black uppercase tracking-tight">{cat.nombre}</span>
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell">
                                        <p className="text-xs text-gray-500 truncate max-w-xs">{cat.descripcion || '-'}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => startEdit(cat)}
                                                className="p-2 hover:bg-black hover:text-white transition-colors border border-transparent hover:border-black rounded-sm"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <AlertDialog.Root>
                                                <AlertDialog.Trigger asChild>
                                                    <button 
                                                        onClick={() => setCategoryToDelete(cat.id)}
                                                        className="p-2 text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded-sm"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </AlertDialog.Trigger>
                                                <AlertDialog.Portal>
                                                    <AlertDialog.Overlay className="bg-black/50 fixed inset-0 z-50 backdrop-blur-sm animate-overlayShow" />
                                                    <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] bg-white p-[25px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] border-2 border-black focus:outline-none z-[100] animate-contentShow">
                                                        <AlertDialog.Title className="text-xl font-black uppercase mb-4">
                                                            ¿Estás absolutamente seguro?
                                                        </AlertDialog.Title>
                                                        <AlertDialog.Description className="text-gray-600 mb-8 font-light leading-normal">
                                                            Esta acción no se puede deshacer. Esto eliminará permanentemente la categoría <span className="font-bold text-black">"{cat.nombre}"</span>.
                                                        </AlertDialog.Description>
                                                        <div className="flex justify-end gap-[25px]">
                                                            <AlertDialog.Cancel asChild>
                                                                <button className="text-gray-500 hover:text-black font-bold uppercase text-sm tracking-wider">
                                                                    Cancelar
                                                                </button>
                                                            </AlertDialog.Cancel>
                                                            <AlertDialog.Action asChild>
                                                                <button 
                                                                    onClick={handleDelete}
                                                                    className="bg-red-500 text-white hover:bg-red-600 px-6 py-3 font-bold uppercase text-sm tracking-wider border border-transparent hover:border-black transition-all"
                                                                >
                                                                    Sí, eliminar
                                                                </button>
                                                            </AlertDialog.Action>
                                                        </div>
                                                    </AlertDialog.Content>
                                                </AlertDialog.Portal>
                                            </AlertDialog.Root>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="3" className="text-center py-12 text-gray-400 font-bold uppercase text-sm">
                                        No hay categorías creadas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>

    </AdminLayout>
  );
}
