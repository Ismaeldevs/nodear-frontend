import { useState, useEffect } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { cuponService } from '../../services/api';
import { formatCurrency } from '../../utils/format';
import toast from 'react-hot-toast';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Tag,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Cupones() {
  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCupon, setEditingCupon] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('todos'); // 'todos', 'activos', 'inactivos'
  const [cuponToDelete, setCuponToDelete] = useState(null);

  const [formData, setFormData] = useState({
    codigo: '',
    descripcion: '',
    tipo: 'PORCENTAJE',
    valor: '',
    montoMinimo: '',
    usosMaximos: '',
    fechaInicio: '',
    fechaExpiracion: '',
    activo: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    cargarCupones();
  }, []);

  const cargarCupones = async () => {
    try {
      setLoading(true);
      const filters = {};
      
      if (filtroActivo === 'activos') filters.activo = 'true';
      if (filtroActivo === 'inactivos') filters.activo = 'false';
      if (busqueda) filters.busqueda = busqueda;

      const response = await cuponService.getAll(filters);
      setCupones(response.data.cupones);
    } catch (error) {
      toast.error('Error al cargar cupones');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      cargarCupones();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [busqueda, filtroActivo]);

  const handleOpenModal = (cupon = null) => {
    if (cupon) {
      setEditingCupon(cupon);
      setFormData({
        codigo: cupon.codigo,
        descripcion: cupon.descripcion || '',
        tipo: cupon.tipo,
        valor: cupon.valor.toString(),
        montoMinimo: cupon.montoMinimo ? cupon.montoMinimo.toString() : '',
        usosMaximos: cupon.usosMaximos ? cupon.usosMaximos.toString() : '',
        fechaInicio: cupon.fechaInicio ? new Date(cupon.fechaInicio).toISOString().split('T')[0] : '',
        fechaExpiracion: cupon.fechaExpiracion ? new Date(cupon.fechaExpiracion).toISOString().split('T')[0] : '',
        activo: cupon.activo,
      });
    } else {
      setEditingCupon(null);
      setFormData({
        codigo: '',
        descripcion: '',
        tipo: 'PORCENTAJE',
        valor: '',
        montoMinimo: '',
        usosMaximos: '',
        fechaInicio: '',
        fechaExpiracion: '',
        activo: true,
      });
    }
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCupon(null);
    setFormData({
      codigo: '',
      descripcion: '',
      tipo: 'PORCENTAJE',
      valor: '',
      montoMinimo: '',
      usosMaximos: '',
      fechaInicio: '',
      fechaExpiracion: '',
      activo: true,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'El código es requerido';
    } else if (formData.codigo.length < 3) {
      newErrors.codigo = 'El código debe tener al menos 3 caracteres';
    }

    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      newErrors.valor = 'El valor debe ser mayor a 0';
    }

    if (formData.tipo === 'PORCENTAJE' && parseFloat(formData.valor) > 100) {
      newErrors.valor = 'El porcentaje no puede ser mayor a 100';
    }

    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es requerida';
    }

    if (!formData.fechaExpiracion) {
      newErrors.fechaExpiracion = 'La fecha de expiración es requerida';
    }

    if (formData.fechaInicio && formData.fechaExpiracion) {
      const inicio = new Date(formData.fechaInicio);
      const expiracion = new Date(formData.fechaExpiracion);
      if (expiracion <= inicio) {
        newErrors.fechaExpiracion = 'La fecha de expiración debe ser posterior a la de inicio';
      }
    }

    if (formData.montoMinimo && parseFloat(formData.montoMinimo) <= 0) {
      newErrors.montoMinimo = 'El monto mínimo debe ser mayor a 0';
    }

    if (formData.usosMaximos && parseInt(formData.usosMaximos) <= 0) {
      newErrors.usosMaximos = 'Los usos máximos deben ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        codigo: formData.codigo.toUpperCase(),
        valor: parseFloat(formData.valor),
        montoMinimo: formData.montoMinimo ? parseFloat(formData.montoMinimo) : null,
        usosMaximos: formData.usosMaximos ? parseInt(formData.usosMaximos) : null,
      };

      if (editingCupon) {
        await cuponService.update(editingCupon.id, dataToSend);
        toast.success('Cupón actualizado exitosamente');
      } else {
        await cuponService.create(dataToSend);
        toast.success('Cupón creado exitosamente');
      }

      handleCloseModal();
      cargarCupones();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al guardar el cupón';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!cuponToDelete) return;

    try {
      await cuponService.delete(cuponToDelete);
      toast.success('Cupón eliminado exitosamente');
      cargarCupones();
    } catch (error) {
      toast.error('Error al eliminar el cupón');
      console.error(error);
    }
  };

  const getEstadoBadge = (cupon) => {
    const ahora = new Date();
    const inicio = new Date(cupon.fechaInicio);
    const expiracion = new Date(cupon.fechaExpiracion);

    if (!cupon.activo) {
      return <span className="px-3 py-1 bg-red-500 text-white text-xs font-black uppercase tracking-wider">Inactivo</span>;
    }

    if (ahora < inicio) {
      return <span className="px-3 py-1 bg-yellow-400 text-black text-xs font-black uppercase tracking-wider">Próximamente</span>;
    }

    if (ahora > expiracion) {
      return <span className="px-3 py-1 bg-gray-400 text-white text-xs font-black uppercase tracking-wider">Expirado</span>;
    }

    if (cupon.usosMaximos && cupon.usosActuales >= cupon.usosMaximos) {
      return <span className="px-3 py-1 bg-orange-500 text-white text-xs font-black uppercase tracking-wider">Agotado</span>;
    }

    return <span className="px-3 py-1 bg-accent text-black text-xs font-black uppercase tracking-wider">Activo</span>;
  };

  return (
    <AdminLayout 
      title="Cupones" 
      subtitle="Gestión de descuentos"
      actions={
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-black text-white px-5 py-3 font-bold uppercase tracking-wider hover:bg-accent hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none"
        >
          <Plus className="w-5 h-5" /> <span className="hidden md:inline">Nuevo Cupón</span>
        </button>
      }
    >
      {/* Toolbar */}
      <div className="bg-white p-4 border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="w-full md:w-96 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
          <input
            type="text"
            placeholder="BUSCAR CUPÓN..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 font-bold uppercase tracking-wide text-sm transition-all outline-none"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select
            value={filtroActivo}
            onChange={(e) => setFiltroActivo(e.target.value)}
            className="px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 font-bold uppercase text-xs tracking-wider transition-all outline-none"
          >
            <option value="todos">TODOS</option>
            <option value="activos">ACTIVOS</option>
            <option value="inactivos">INACTIVOS</option>
          </select>
          <button 
            onClick={cargarCupones} 
            className="bg-gray-100 hover:bg-black hover:text-white text-black px-6 py-3 font-bold uppercase text-xs tracking-widest transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>

      {/* Tabla de cupones */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white border border-gray-200">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Cargando cupones...</p>
          </div>
        </div>
      ) : cupones.length === 0 ? (
        <div className="bg-white border border-gray-200 p-16 text-center">
          <Tag className="w-20 h-20 mx-auto text-gray-300 mb-6 stroke-[1.5]" />
          <h3 className="text-2xl font-black uppercase mb-3 tracking-tight">Sin Cupones</h3>
          <p className="text-gray-500 mb-8 uppercase text-xs tracking-widest">Crea tu primer cupón de descuento</p>
          <button 
            onClick={() => handleOpenModal()} 
            className="bg-black text-white px-8 py-4 font-bold uppercase hover:bg-accent hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Crear Primer Cupón
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-4 text-left font-black uppercase text-xs tracking-wider">Código</th>
                <th className="px-6 py-4 text-left font-black uppercase text-xs tracking-wider">Descripción</th>
                <th className="px-6 py-4 text-left font-black uppercase text-xs tracking-wider">Descuento</th>
                <th className="px-6 py-4 text-left font-black uppercase text-xs tracking-wider">Usos</th>
                <th className="px-6 py-4 text-left font-black uppercase text-xs tracking-wider">Validez</th>
                <th className="px-6 py-4 text-center font-black uppercase text-xs tracking-wider">Estado</th>
                <th className="px-6 py-4 text-center font-black uppercase text-xs tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cupones.map((cupon) => (
                <tr key={cupon.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-accent" />
                      <span className="font-mono font-black text-sm tracking-wider">{cupon.codigo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-700 truncate">{cupon.descripcion || '-'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-black text-accent text-base">
                      {cupon.tipo === 'PORCENTAJE' ? `${cupon.valor}%` : formatCurrency(cupon.valor)}
                    </div>
                    {cupon.montoMinimo && (
                      <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                        Mín: {formatCurrency(cupon.montoMinimo)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold">
                      <span className="text-accent">{cupon.usosActuales || 0}</span>
                      <span className="text-gray-400"> / </span>
                      <span>{cupon.usosMaximos || '∞'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs uppercase tracking-wide">
                      <div className="font-bold text-gray-900">{new Date(cupon.fechaInicio).toLocaleDateString('es-AR')}</div>
                      <div className="text-gray-500">
                        {new Date(cupon.fechaExpiracion).toLocaleDateString('es-AR')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">{getEstadoBadge(cupon)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(cupon)}
                        className="p-2 hover:bg-gray-100 rounded transition-colors group"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4 text-gray-600 group-hover:text-black" />
                      </button>
                      <AlertDialog.Root>
                        <AlertDialog.Trigger asChild>
                          <button
                            onClick={() => setCuponToDelete(cupon.id)}
                            className="p-2 hover:bg-red-50 rounded transition-colors group"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                          </button>
                        </AlertDialog.Trigger>
                        <AlertDialog.Portal>
                            <AlertDialog.Overlay className="bg-black/50 fixed inset-0 z-50 backdrop-blur-sm animate-overlayShow" />
                            <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] bg-white p-[25px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] border-2 border-black focus:outline-none z-[100] animate-contentShow">
                                <AlertDialog.Title className="text-xl font-black uppercase mb-4">
                                    ¿Eliminar Cupón?
                                </AlertDialog.Title>
                                <AlertDialog.Description className="text-gray-600 mb-8 font-light leading-normal">
                                    Se eliminará el cupón <span className="font-bold text-black">"{cupon.codigo}"</span>.
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

      {/* Modal de crear/editar cupón */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {/* Header */}
            <div className="bg-black text-white px-8 py-6 flex justify-between items-center border-b-4 border-accent">
              <h3 className="font-black text-2xl uppercase tracking-tight">
                {editingCupon ? 'Editar Cupón' : 'Nuevo Cupón'}
              </h3>
              <button 
                onClick={handleCloseModal} 
                className="hover:bg-white/10 p-2 rounded transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Código */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">
                  Código del Cupón *
                </label>
                <input
                  type="text"
                  placeholder="EJ: VERANO2026"
                  value={formData.codigo}
                  onChange={(e) =>
                    setFormData({ ...formData, codigo: e.target.value.toUpperCase() })
                  }
                  className={`w-full px-4 py-3 bg-gray-50 border-2 font-bold uppercase tracking-wider focus:border-black focus:bg-white outline-none transition-all ${
                    errors.codigo ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.codigo && <p className="text-red-500 text-xs mt-2 font-bold uppercase tracking-wide">{errors.codigo}</p>}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">
                  Descripción (Opcional)
                </label>
                <textarea
                  placeholder="Descripción del cupón..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-black focus:bg-white outline-none transition-all resize-none"
                  rows={2}
                />
              </div>

              {/* Tipo y Valor */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">
                    Tipo de Descuento *
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 font-bold uppercase text-sm focus:border-black focus:bg-white outline-none transition-all"
                  >
                    <option value="PORCENTAJE">Porcentaje (%)</option>
                    <option value="MONTO_FIJO">Monto Fijo ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">
                    Valor * {formData.tipo === 'PORCENTAJE' ? '(%)' : '($)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={formData.tipo === 'PORCENTAJE' ? '10' : '1000'}
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-50 border-2 font-bold focus:border-black focus:bg-white outline-none transition-all ${
                      errors.valor ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.valor && <p className="text-red-500 text-xs mt-2 font-bold uppercase tracking-wide">{errors.valor}</p>}
                </div>
              </div>

              {/* Monto mínimo y Usos máximos */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">
                    Monto Mínimo ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Opcional"
                    value={formData.montoMinimo}
                    onChange={(e) => setFormData({ ...formData, montoMinimo: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-50 border-2 font-bold focus:border-black focus:bg-white outline-none transition-all ${
                      errors.montoMinimo ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.montoMinimo && (
                    <p className="text-red-500 text-xs mt-2 font-bold uppercase tracking-wide">{errors.montoMinimo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">
                    Usos Máximos
                  </label>
                  <input
                    type="number"
                    placeholder="Opcional (ilimitado)"
                    value={formData.usosMaximos}
                    onChange={(e) => setFormData({ ...formData, usosMaximos: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-50 border-2 font-bold focus:border-black focus:bg-white outline-none transition-all ${
                      errors.usosMaximos ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.usosMaximos && (
                    <p className="text-red-500 text-xs mt-2 font-bold uppercase tracking-wide">{errors.usosMaximos}</p>
                  )}
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-50 border-2 font-bold focus:border-black focus:bg-white outline-none transition-all ${
                      errors.fechaInicio ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.fechaInicio && (
                    <p className="text-red-500 text-xs mt-2 font-bold uppercase tracking-wide">{errors.fechaInicio}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">
                    Fecha de Expiración *
                  </label>
                  <input
                    type="date"
                    value={formData.fechaExpiracion}
                    onChange={(e) => setFormData({ ...formData, fechaExpiracion: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-50 border-2 font-bold focus:border-black focus:bg-white outline-none transition-all ${
                      errors.fechaExpiracion ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.fechaExpiracion && (
                    <p className="text-red-500 text-xs mt-2 font-bold uppercase tracking-wide">{errors.fechaExpiracion}</p>
                  )}
                </div>
              </div>

              {/* Estado */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 border-2 border-gray-200">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="w-5 h-5 accent-black"
                />
                <label htmlFor="activo" className="text-sm font-bold uppercase tracking-wide cursor-pointer">
                  Cupón Activo
                </label>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4 border-t-2 border-gray-200">
                <button 
                  type="button" 
                  onClick={handleCloseModal} 
                  className="flex-1 px-6 py-4 bg-gray-200 text-black font-bold uppercase hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-6 py-4 bg-black text-white font-bold uppercase hover:bg-accent hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-none"
                >
                  {editingCupon ? 'Actualizar' : 'Crear'} Cupón
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
