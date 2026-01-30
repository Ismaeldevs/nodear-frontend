import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { colorService } from '../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminColors() {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', codigoHex: '#000000' });
  const [colorToDelete, setColorToDelete] = useState(null);

  useEffect(() => {
    loadColors();
  }, []);

  const loadColors = async () => {
    try {
      setLoading(true);
      const response = await colorService.getAll();
      setColors(response.data || []);
    } catch (error) {
      toast.error('Error al cargar colores');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingColor) {
        await colorService.update(editingColor.id, formData);
        toast.success('Color actualizado');
      } else {
        await colorService.create(formData);
        toast.success('Color creado');
      }
      
      setShowModal(false);
      setEditingColor(null);
      setFormData({ nombre: '', codigoHex: '#000000' });
      loadColors();
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al guardar color');
    }
  };

  const handleEdit = (color) => {
    setEditingColor(color);
    setFormData({ nombre: color.nombre, codigoHex: color.codigoHex });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!colorToDelete) return;

    try {
      await colorService.delete(colorToDelete);
      toast.success('Color eliminado');
      loadColors();
    } catch (error) {
      toast.error('Error al eliminar color');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingColor(null);
    setFormData({ nombre: '', codigoHex: '#000000' });
  };

  return (
    <AdminLayout title="Colores" subtitle="Gestión de colores de productos">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 font-bold uppercase hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-5 h-5" /> Nuevo Color
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Cargando colores...</div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-4 text-left font-bold uppercase text-sm">Color</th>
                <th className="px-6 py-4 text-left font-bold uppercase text-sm">Nombre</th>
                <th className="px-6 py-4 text-left font-bold uppercase text-sm">Código Hex</th>
                <th className="px-6 py-4 text-center font-bold uppercase text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {colors.map((color) => (
                <tr key={color.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 border-2 border-gray-300 rounded"
                        style={{ backgroundColor: color.codigoHex }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold">{color.nombre}</td>
                  <td className="px-6 py-4 font-mono text-gray-600">{color.codigoHex}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(color)}
                        className="p-2 hover:bg-gray-200 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <AlertDialog.Root>
                        <AlertDialog.Trigger asChild>
                          <button
                            onClick={() => setColorToDelete(color.id)}
                            className="p-2 hover:bg-red-100 text-red-600 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </AlertDialog.Trigger>
                        <AlertDialog.Portal>
                            <AlertDialog.Overlay className="bg-black/50 fixed inset-0 z-50 backdrop-blur-sm animate-overlayShow" />
                            <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] bg-white p-[25px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] border-2 border-black focus:outline-none z-[100] animate-contentShow">
                                <AlertDialog.Title className="text-xl font-black uppercase mb-4">
                                    ¿Eliminar Color?
                                </AlertDialog.Title>
                                <AlertDialog.Description className="text-gray-600 mb-8 font-light leading-normal">
                                    Se eliminará el color <span className="font-bold text-black">"{color.nombre}"</span>.
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
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6">
            <h2 className="text-2xl font-black uppercase mb-6">
              {editingColor ? 'Editar Color' : 'Nuevo Color'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 focus:border-black outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-2">Código Hex</label>
                <div className="flex gap-4">
                  <input
                    type="color"
                    value={formData.codigoHex}
                    onChange={(e) => setFormData({ ...formData, codigoHex: e.target.value })}
                    className="w-20 h-12 border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.codigoHex}
                    onChange={(e) => setFormData({ ...formData, codigoHex: e.target.value })}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 focus:border-black outline-none font-mono"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    placeholder="#000000"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white px-6 py-3 font-bold uppercase hover:bg-gray-800"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border-2 border-black px-6 py-3 font-bold uppercase hover:bg-gray-100"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
