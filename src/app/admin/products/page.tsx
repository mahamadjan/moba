"use client";

import { useState, useEffect } from "react";
import { Plus, Image as ImageIcon, Search, Tag, Edit, Trash2, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/Button";

// Initial mock categories since we might not have them in DB yet
const DEFAULT_CATEGORIES = [
  { id: "phones", name: "Телефоны" },
  { id: "accessories", name: "Аксессуары" },
  { id: "tablets", name: "Планшеты" },
  { id: "laptops", name: "Ноутбуки" },
  { id: "watches", name: "Часы" },
  { id: "cameras", name: "Камера" },
  { id: "other", name: "Прочее" },
];

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [category, setCategory] = useState("phones");
  const [isHit, setIsHit] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [isDiscount, setIsDiscount] = useState(false);
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) setProducts(data);
    } catch (e) {
      console.log("Database not ready yet");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
    e.target.value = '';
  };

  const removeNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (product: any) => {
    setEditingProductId(product.id);
    setName(product.name || "");
    setDescription(product.description || "");
    setPrice(product.price ? product.price.toString() : "");
    setOldPrice(product.old_price ? product.old_price.toString() : "");
    setCategory(product.category || "phones");
    setIsHit(product.is_hit || false);
    setIsNew(product.is_new || false);
    setIsDiscount(product.is_discount || false);
    
    if (product.image_url) {
      setExistingImages(product.image_url.split(','));
    } else {
      setExistingImages([]);
    }
    
    setImageFiles([]);
    setImagePreviews([]);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || (imageFiles.length === 0 && existingImages.length === 0)) {
      alert("Пожалуйста, заполните название, цену и добавьте хотя бы одно фото");
      return;
    }

    setIsLoading(true);

    try {
      const uploadedUrls: string[] = [];

      // 1. Upload new images if provided
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `product-images/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);
            
          uploadedUrls.push(publicUrl);
        }
      }

      // Combine existing images that weren't deleted with newly uploaded images
      const finalImageUrls = [...existingImages, ...uploadedUrls].join(',');

      // 2. Prepare Data
      const productData = {
        name,
        description: description || null,
        price: parseFloat(price),
        old_price: oldPrice ? parseFloat(oldPrice) : null,
        image_url: finalImageUrls,
        is_hit: isHit,
        is_new: isNew,
        is_discount: isDiscount || !!oldPrice,
        category
      };

      // 3. Save or Update Product
      if (editingProductId) {
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProductId);
          
        if (updateError) throw updateError;
        alert("Товар успешно обновлен!");
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert([productData]);
          
        if (insertError) throw insertError;
        alert("Товар успешно добавлен!");
      }

      setIsFormOpen(false);
      resetForm();
      fetchProducts();
      
    } catch (error: any) {
      console.error(error);
      alert("Ошибка: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этот товар? Действие необратимо.")) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchProducts();
    } catch (error: any) {
      alert("Ошибка при удалении: " + error.message);
    }
  };

  const resetForm = () => {
    setEditingProductId(null);
    setName("");
    setDescription("");
    setPrice("");
    setOldPrice("");
    setCategory("phones");
    setIsHit(false);
    setIsNew(true);
    setIsDiscount(false);
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Управление товарами</h1>
        {!isFormOpen && (
          <Button onClick={() => setIsFormOpen(true)} className="gap-2 font-semibold">
            <Plus className="w-5 h-5" />
            Добавить товар
          </Button>
        )}
      </div>

      {isFormOpen ? (
        <div className="bg-card border border-card-border rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-foreground">
              {editingProductId ? "Редактирование товара" : "Добавление нового товара"}
            </h2>
            <button onClick={closeForm} className="text-foreground/50 hover:text-foreground">Отмена</button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column - Image Upload */}
            <div className="flex flex-col gap-4">
              <label className="text-sm font-medium text-foreground/70 flex justify-between">
                <span>Фотографии товара *</span>
                <span className="text-xs text-foreground/40">Первое фото — главное</span>
              </label>
              
              <div className="grid grid-cols-3 gap-2 mb-3">
                {/* Existing Images */}
                {existingImages.map((img, idx) => (
                  <div key={`existing-${idx}`} className="relative w-full pt-[100%] border border-card-border rounded-xl overflow-hidden group">
                    <img src={img} alt={`Existing ${idx}`} className="absolute inset-0 w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-10"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {/* New Previews */}
                {imagePreviews.map((img, idx) => (
                  <div key={`new-${idx}`} className="relative w-full pt-[100%] border border-primary/50 bg-primary/5 rounded-xl overflow-hidden group">
                    <img src={img} alt={`New ${idx}`} className="absolute inset-0 w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-10"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Upload Button (Standard OS Native for maximum compatibility) */}
              <input 
                key={`file-input-${imageFiles.length}-${existingImages.length}`}
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleImageChange}
                className="block w-full text-sm text-foreground/70 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80 transition-all cursor-pointer" 
              />
            </div>

            {/* Right Column - Details */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground/70">Модель / Название *</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например: iPhone 15 Pro Max 256GB"
                  className="bg-input border border-card-border rounded-xl px-4 py-3 text-foreground focus:border-primary/50 outline-none transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground/70">Описание и Характеристики</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опишите товар, добавьте характеристики (память, процессор, камера). Можно использовать переносы строк."
                  className="bg-input border border-card-border rounded-xl px-4 py-3 text-foreground focus:border-primary/50 outline-none transition-colors min-h-[120px] custom-scrollbar"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground/70">Цена (сом) *</label>
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="120000"
                    className="bg-input border border-card-border rounded-xl px-4 py-3 text-foreground focus:border-primary/50 outline-none transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground/70">Старая цена (для скидки)</label>
                  <input 
                    type="number" 
                    value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value)}
                    placeholder="135000"
                    className="bg-input border border-card-border rounded-xl px-4 py-3 text-foreground focus:border-primary/50 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground/70">Категория</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-input border border-card-border rounded-xl px-4 py-3 text-foreground focus:border-primary/50 outline-none transition-colors appearance-none"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-4 mt-2">
                <label className="flex items-center gap-2 text-sm text-foreground/70 cursor-pointer">
                  <input type="checkbox" checked={isHit} onChange={(e) => setIsHit(e.target.checked)} className="rounded border-card-border bg-input text-primary focus:ring-primary/50" />
                  Хит продаж
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground/70 cursor-pointer">
                  <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="rounded border-card-border bg-input text-primary focus:ring-primary/50" />
                  Новинка
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground/70 cursor-pointer">
                  <input type="checkbox" checked={isDiscount} onChange={(e) => setIsDiscount(e.target.checked)} className="rounded border-card-border bg-input text-primary focus:ring-primary/50" />
                  Акция (Скидка)
                </label>
              </div>

              <Button type="submit" disabled={isLoading} className="mt-auto w-full py-4 text-base font-bold text-primary-foreground">
                {isLoading ? "Сохранение..." : (editingProductId ? "Сохранить изменения" : "Добавить товар на сайт")}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-card border border-card-border rounded-3xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-card-border flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
              <input 
                type="text" 
                placeholder="Поиск по названию..." 
                className="w-full bg-input border border-card-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:border-primary/50 outline-none transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-card-border text-xs py-1.5 h-auto text-foreground">Все</Button>
              <Button variant="ghost" className="text-foreground/50 text-xs py-1.5 h-auto hover:text-foreground">Телефоны</Button>
              <Button variant="ghost" className="text-foreground/50 text-xs py-1.5 h-auto hover:text-foreground">Аксессуары</Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-card-border text-xs uppercase tracking-wider text-foreground/40 bg-foreground/[0.02]">
                  <th className="p-4 font-medium">Товар</th>
                  <th className="p-4 font-medium">Категория</th>
                  <th className="p-4 font-medium">Цена</th>
                  <th className="p-4 font-medium">Статус</th>
                  <th className="p-4 font-medium text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? products.map((product) => {
                  const firstImg = product.image_url ? product.image_url.split(',')[0] : '';
                  
                  return (
                  <tr key={product.id} className="border-b border-card-border hover:bg-foreground/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-foreground/5 flex-shrink-0 overflow-hidden">
                          <img src={firstImg} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-foreground/40">{product.id.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-foreground/5 text-xs text-foreground/60">
                        <Tag className="w-3 h-3" />
                        Товар
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{product.price.toLocaleString()} с</span>
                        {product.old_price && <span className="text-xs text-foreground/40 line-through">{product.old_price.toLocaleString()} с</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1.5">
                        {product.is_hit && <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase">Хит</span>}
                        {product.is_new && <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-bold uppercase">New</span>}
                        {product.is_discount && <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold uppercase">%</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button onClick={() => handleEdit(product)} className="p-1.5 text-foreground/50 hover:text-foreground hover:bg-foreground/10 rounded-md transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-1.5 text-red-500/50 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-foreground/40">
                      У вас пока нет добавленных товаров. Нажмите "Добавить товар".
                      <br/>
                      <span className="text-xs text-red-400 mt-2 block">(Или вы еще не выполнили SQL-запрос для базы данных)</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
