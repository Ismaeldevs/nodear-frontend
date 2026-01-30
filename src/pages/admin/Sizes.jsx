import { useState, useEffect } from 'react';
import { Ruler, Plus, Trash2, Edit2, X } from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { sizeService } from '../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminSizes() {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nombre: '' }); // Talles usually just have name
  const [sizeToDelete, setSizeToDelete] = useState(null);

  useEffect(() => {
    loadSizes();
  }, []);

  const loadSizes = async () => {
    try {
      setLoading(true);
      const response = await sizeService.getAll();
      setSizes(response.data || response || []);
    } catch (error) {
      toast.error('Error al cargar talles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          if (editingId) {
              await sizeService.update(editingId, formData);
              toast.success('Talle actualizado');
          } else {
              await sizeService.create(formData);
              toast.success('Talle creado');
          }
          setEditingId(null);
          setFormData({ nombre: '' });
          loadSizes();
      } catch (error) {
          toast.error('Error al guardar talle');
      }
  };

  const startEdit = (size) => {
      setEditingId(size.id);
      setFormData({ nombre: size.nombre });
  };

  const handleDelete = async () => {
      if(!sizeToDelete) return;
      try {
          await sizeService.delete(sizeToDelete);
          toast.success('Talle eliminado');
          loadSizes();
      } catch (error) {
          toast.error('Error al eliminar');
      } finally {
        setSizeToDelete(null);
      }
  }

  return (
    <AdminLayout title="Talles" subtitle="Dimensiones y medidas">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Form */}
            <div className="md:col-span-1 h-fit bg-white p-6 border-2 border-black sticky top-28">
                <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                   <Ruler className="w-5 h-5" /> {editingId ? 'Editar Talle' : 'Nuevo Talle'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Identificador</label>
                        <input 
                            type="text"
                            value={formData.nombre}
                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 p-3 font-bold uppercase focus:border-black focus:outline-none text-center text-xl"
                            placeholder="S, M, L, XL..."
                            required
                        />
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                        <button type="submit" className="flex-1 bg-black text-white p-3 font-black uppercase tracking-wider hover:bg-accent hover:text-black transition-colors">
                            {editingId ? 'Guardar' : 'Agregar'}
                        </button>
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={() => {
                                    setEditingId(null);
                                    setFormData({ nombre: '' });
                                }}
                                className="bg-gray-200 text-gray-600 p-3 hover:bg-red-500 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="md:col-span-2">
                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {sizes.map((size) => (
                        <div 
                            key={size.id} 
                            className={`
                                relative p-6 border bg-white flex flex-col items-center justify-center gap-4 group transition-all duration-300
                                ${editingId === size.id ? 'border-accent shadow-md scale-105 z-10' : 'border-gray-200 hover:border-black'}
                            `}
                        >
                            <span className="text-3xl font-black uppercase tracking-tighter">{size.nombre}</span>
                            
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded-bl-lg">
                                <button onClick={() => startEdit(size)} className="p-1 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                                <AlertDialog.Root>
                                    <AlertDialog.Trigger asChild>
                                        <button onClick={() => setSizeToDelete(size.id)} className="p-1 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </AlertDialog.Trigger>
                                    <AlertDialog.Portal>
                                        <AlertDialog.Overlay className="bg-black/50 fixed inset-0 z-50 backdrop-blur-sm animate-overlayShow" />
                                        <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] bg-white p-[25px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] border-2 border-black focus:outline-none z-[100] animate-contentShow">
                                            <AlertDialog.Title className="text-xl font-black uppercase mb-4">
                                                ¿Eliminar Talle?
                                            </AlertDialog.Title>
                                            <AlertDialog.Description className="text-gray-600 mb-8 font-light leading-normal">
                                                Se eliminará el talle <span className="font-bold text-black">"{size.nombre}"</span>.
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
                        </div>
                    ))}
                 </div>
                 
                 {sizes.length === 0 && !loading && (
                    <div className="text-center py-12 text-gray-400 font-bold uppercase text-sm border-2 border-dashed border-gray-200">
                        No hay talles configurados.
                    </div>
                 )}
            </div>
        </div>

    </AdminLayout>
  );
}
