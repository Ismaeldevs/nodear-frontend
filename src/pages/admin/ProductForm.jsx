import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService, categoryService, sizeService, colorService } from '../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoriaId: '',
    activo: true,
    imagenes: [],
    variantes: []
  });

  const [newVariant, setNewVariant] = useState({
    talleId: '',
    colorId: '',
    stock: 0,
    precio: 0
  });

  useEffect(() => {
    loadInitialData();
    if (isEditing) {
      loadProduct();
    }
  }, [id]);

  const loadInitialData = async () => {
    try {
      const [categoriesRes, sizesRes, colorsRes] = await Promise.all([
        categoryService.getAll(),
        sizeService.getAll(),
        colorService.getAll()
      ]);
      setCategories(categoriesRes.data || []);
      setSizes(sizesRes.data || []);
      setColors(colorsRes.data || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar datos iniciales');
    }
  };

  const loadProduct = async () => {
    try {
      setLoadingData(true);
      const response = await productService.getById(id);
      const product = response.data;
      
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion || '',
        categoriaId: product.categoriaId,
        activo: product.activo,
        imagenes: product.imagenes || [],
        variantes: product.variantes || []
      });
    } catch (error) {
      console.error('Error cargando producto:', error);
      toast.error('Error al cargar el producto');
      navigate('/admin/products');
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setNewVariant(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addVariant = () => {
    if (!newVariant.talleId || !newVariant.colorId) {
      toast.error('Selecciona talle y color');
      return;
    }
    
    const talleNombre = sizes.find(s => s.id === newVariant.talleId)?.nombre;
    const colorNombre = colors.find(c => c.id === newVariant.colorId)?.nombre;
    
    setFormData(prev => ({
      ...prev,
      variantes: [...prev.variantes, {
        ...newVariant,
        talleNombre,
        colorNombre,
        precio: parseFloat(newVariant.precio) || 0,
        stock: parseInt(newVariant.stock) || 0
      }]
    }));

    setNewVariant({ talleId: '', colorId: '', stock: 0, precio: 0 });
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variantes: prev.variantes.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const uploadPromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    const base64Images = await Promise.all(uploadPromises);
    setFormData(prev => ({
      ...prev,
      imagenes: [...prev.imagenes, ...base64Images]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.categoriaId) {
      toast.error('Nombre y categoría son obligatorios');
      return;
    }

    if (formData.variantes.length === 0) {
      toast.error('Agrega al menos una variante');
      return;
    }

    try {
      setLoading(true);
      
      const dataToSend = {
        ...formData,
        variantes: formData.variantes.map(v => ({
          talleId: v.talleId,
          colorId: v.colorId,
          stock: parseInt(v.stock) || 0,
          precio: parseFloat(v.precio) || 0
        }))
      };

      if (isEditing) {
        await productService.update(id, dataToSend);
        toast.success('Producto actualizado');
      } else {
        await productService.create(dataToSend);
        toast.success('Producto creado');
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Error guardando producto:', error);
      toast.error(error.response?.data?.mensaje || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <AdminLayout 
        title={isEditing ? 'Editar Item' : 'Nuevo Item'} 
        subtitle="Gestión de inventario"
        actions={
             <button
              onClick={() => navigate('/admin/products')}
              className="text-gray-500 hover:text-black font-bold uppercase text-xs tracking-wider border border-gray-300 px-4 py-2 hover:border-black transition-colors"
            >
              Volver al listado
            </button>
        }
    >
      <div className="max-w-4xl">
        <div className="bg-white border border-gray-200 p-6 md:p-8 shadow-sm">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información básica */}
            <div className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tight border-b border-gray-100 pb-2">Información Básica</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <select
                  name="categoriaId"
                  value={formData.categoriaId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Producto activo</label>
              </div>
            </div>

            {/* Imágenes */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Imágenes</h2>
              
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="block w-full text-sm"
              />

              {formData.imagenes.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {formData.imagenes.map((img, index) => (
                    <div key={index} className="relative">
                      <img src={img.url || img} alt="" className="w-full h-24 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Variantes */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Variantes</h2>
              
              <div className="grid grid-cols-4 gap-4">
                <select
                  name="talleId"
                  value={newVariant.talleId}
                  onChange={handleVariantChange}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="">Talle</option>
                  {sizes.map(size => (
                    <option key={size.id} value={size.id}>{size.nombre}</option>
                  ))}
                </select>

                <select
                  name="colorId"
                  value={newVariant.colorId}
                  onChange={handleVariantChange}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="">Color</option>
                  {colors.map(color => (
                    <option key={color.id} value={color.id}>{color.nombre}</option>
                  ))}
                </select>

                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={newVariant.stock}
                  onChange={handleVariantChange}
                  className="px-3 py-2 border rounded-lg"
                  min="0"
                />

                <input
                  type="number"
                  name="precio"
                  placeholder="Precio"
                  value={newVariant.precio}
                  onChange={handleVariantChange}
                  className="px-3 py-2 border rounded-lg"
                  step="0.01"
                  min="0"
                />
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Agregar Variante
              </button>

              {formData.variantes.length > 0 && (
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-2 text-left">Talle</th>
                      <th className="border p-2 text-left">Color</th>
                      <th className="border p-2 text-right">Stock</th>
                      <th className="border p-2 text-right">Precio</th>
                      <th className="border p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.variantes.map((variant, index) => (
                      <tr key={index}>
                        <td className="border p-2">{variant.talleNombre || sizes.find(s => s.id === variant.talleId)?.nombre}</td>
                        <td className="border p-2">{variant.colorNombre || colors.find(c => c.id === variant.colorId)?.nombre}</td>
                        <td className="border p-2 text-right">{variant.stock}</td>
                        <td className="border p-2 text-right">${variant.precio}</td>
                        <td className="border p-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-accent hover:text-black transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-none"
              >
                {loading ? 'Procesando...' : 'Guardar Cambios'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="px-8 py-3 bg-white border border-gray-300 text-black font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
