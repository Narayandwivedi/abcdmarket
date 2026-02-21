import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const getAbsoluteImageUrl = (backendUrl, imageUrl) => {
  if (!imageUrl) return '';
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${backendUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

const getCategoryIdFromSubCategory = (subCategory) => {
  if (!subCategory?.category) return '';
  if (typeof subCategory.category === 'string') return subCategory.category;
  return subCategory.category?._id || '';
};

const SubCategoryManagement = () => {
  const { BACKEND_URL } = useContext(AppContext);

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [updatingSubCategoryId, setUpdatingSubCategoryId] = useState(null);
  const [deletingSubCategoryId, setDeletingSubCategoryId] = useState(null);
  const [replacingImageSubCategoryId, setReplacingImageSubCategoryId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newSubCategory, setNewSubCategory] = useState({
    category: '',
    name: '',
    redirectUrl: '',
    priority: 1,
    isActive: true
  });
  const [newSubCategoryImage, setNewSubCategoryImage] = useState(null);
  const [newSubCategoryPreview, setNewSubCategoryPreview] = useState('');
  const [replaceImageFiles, setReplaceImageFiles] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSubCategories(selectedCategoryId);
  }, [selectedCategoryId]);

  useEffect(() => {
    return () => {
      if (newSubCategoryPreview) {
        URL.revokeObjectURL(newSubCategoryPreview);
      }
    };
  }, [newSubCategoryPreview]);

  const buildSubCategoryAdminUrl = (categoryId = '') => {
    if (!categoryId) {
      return `${BACKEND_URL}/api/sub-categories/admin`;
    }

    const params = new URLSearchParams({ categoryId });
    return `${BACKEND_URL}/api/sub-categories/admin?${params.toString()}`;
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/shop-categories/admin`);
      const categoryList = Array.isArray(response.data?.data) ? response.data.data : [];
      setCategories(categoryList);
      setSelectedCategoryId((prev) => {
        if (!prev) return '';
        return categoryList.some((category) => category._id === prev) ? prev : '';
      });
    } catch (error) {
      alert(`Error fetching categories: ${error.response?.data?.message || error.message}`);
    }
  };

  const fetchSubCategories = async (categoryId = '') => {
    try {
      setLoading(true);
      const response = await axios.get(buildSubCategoryAdminUrl(categoryId));
      const subCategoryList = Array.isArray(response.data?.data) ? response.data.data : [];
      setSubCategories(subCategoryList);
    } catch (error) {
      alert(`Error fetching sub categories: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const uploadImageFile = async (file) => {
    if (!file) {
      throw new Error('Please select an icon image');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`${BACKEND_URL}/api/upload/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const imageUrl = response.data?.data?.url;
    if (!imageUrl) {
      throw new Error('Image upload failed');
    }

    return imageUrl;
  };

  const resetCreateForm = () => {
    if (newSubCategoryPreview) {
      URL.revokeObjectURL(newSubCategoryPreview);
    }

    const defaultCategoryId = selectedCategoryId || categories[0]?._id || '';
    setNewSubCategoryImage(null);
    setNewSubCategoryPreview('');
    setNewSubCategory({
      category: defaultCategoryId,
      name: '',
      redirectUrl: '',
      priority: subCategories.length + 1,
      isActive: true
    });
  };

  const openAddModal = () => {
    resetCreateForm();
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    resetCreateForm();
  };

  const handleCreateSubCategory = async (event) => {
    event.preventDefault();

    if (!newSubCategory.category) {
      alert('Please select parent category');
      return;
    }

    if (!newSubCategory.name.trim()) {
      alert('Please enter sub category name');
      return;
    }

    if (!newSubCategoryImage) {
      alert('Please select sub category icon image');
      return;
    }

    setCreating(true);
    try {
      const imageUrl = await uploadImageFile(newSubCategoryImage);

      await axios.post(`${BACKEND_URL}/api/sub-categories`, {
        category: newSubCategory.category,
        name: newSubCategory.name.trim(),
        imageUrl,
        redirectUrl: newSubCategory.redirectUrl.trim(),
        priority: Number(newSubCategory.priority) || subCategories.length + 1,
        isActive: Boolean(newSubCategory.isActive)
      });

      await fetchSubCategories(selectedCategoryId);
      resetCreateForm();
      setShowAddModal(false);
      alert('Sub category created successfully');
    } catch (error) {
      alert(`Error creating sub category: ${error.response?.data?.message || error.message}`);
    } finally {
      setCreating(false);
    }
  };

  const handleSubCategoryFieldChange = (subCategoryId, field, value) => {
    setSubCategories((prevSubCategories) =>
      prevSubCategories.map((subCategory) =>
        subCategory._id === subCategoryId
          ? {
              ...subCategory,
              [field]: value
            }
          : subCategory
      )
    );
  };

  const handleSaveSubCategory = async (subCategory) => {
    const categoryId = getCategoryIdFromSubCategory(subCategory);
    if (!categoryId) {
      alert('Please select a valid parent category');
      return;
    }

    setUpdatingSubCategoryId(subCategory._id);
    try {
      await axios.put(`${BACKEND_URL}/api/sub-categories/${subCategory._id}`, {
        category: categoryId,
        name: subCategory.name || '',
        redirectUrl: subCategory.redirectUrl || '',
        priority: Number(subCategory.priority) || 1,
        isActive: Boolean(subCategory.isActive)
      });

      await fetchSubCategories(selectedCategoryId);
      alert('Sub category updated');
    } catch (error) {
      alert(`Error updating sub category: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdatingSubCategoryId(null);
    }
  };

  const handleDeleteSubCategory = async (subCategoryId) => {
    const confirmed = window.confirm('Are you sure you want to delete this sub category?');
    if (!confirmed) return;

    setDeletingSubCategoryId(subCategoryId);
    try {
      await axios.delete(`${BACKEND_URL}/api/sub-categories/${subCategoryId}`);
      await fetchSubCategories(selectedCategoryId);
      alert('Sub category deleted');
    } catch (error) {
      alert(`Error deleting sub category: ${error.response?.data?.message || error.message}`);
    } finally {
      setDeletingSubCategoryId(null);
    }
  };

  const handleReorder = async (index, direction) => {
    if (!selectedCategoryId) {
      alert('Select a category filter first to reorder sub categories');
      return;
    }

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= subCategories.length) {
      return;
    }

    const reorderedSubCategories = [...subCategories];
    [reorderedSubCategories[index], reorderedSubCategories[targetIndex]] = [reorderedSubCategories[targetIndex], reorderedSubCategories[index]];

    setReordering(true);
    try {
      await axios.patch(`${BACKEND_URL}/api/sub-categories/reorder`, {
        orderedIds: reorderedSubCategories.map((subCategory) => subCategory._id),
        categoryId: selectedCategoryId
      });

      await fetchSubCategories(selectedCategoryId);
    } catch (error) {
      alert(`Error reordering sub categories: ${error.response?.data?.message || error.message}`);
    } finally {
      setReordering(false);
    }
  };

  const handleNewImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (newSubCategoryPreview) {
      URL.revokeObjectURL(newSubCategoryPreview);
    }

    setNewSubCategoryImage(file);
    setNewSubCategoryPreview(URL.createObjectURL(file));
  };

  const handleReplaceImageSelect = (subCategoryId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setReplaceImageFiles((prev) => ({
      ...prev,
      [subCategoryId]: file
    }));
  };

  const handleReplaceImage = async (subCategory) => {
    const file = replaceImageFiles[subCategory._id];
    if (!file) {
      alert('Please select a new icon image first');
      return;
    }

    const categoryId = getCategoryIdFromSubCategory(subCategory);
    if (!categoryId) {
      alert('Please select a valid parent category');
      return;
    }

    setReplacingImageSubCategoryId(subCategory._id);
    try {
      const imageUrl = await uploadImageFile(file);

      await axios.put(`${BACKEND_URL}/api/sub-categories/${subCategory._id}`, {
        category: categoryId,
        name: subCategory.name || '',
        redirectUrl: subCategory.redirectUrl || '',
        priority: Number(subCategory.priority) || 1,
        isActive: Boolean(subCategory.isActive),
        imageUrl
      });

      await fetchSubCategories(selectedCategoryId);
      setReplaceImageFiles((prev) => {
        const next = { ...prev };
        delete next[subCategory._id];
        return next;
      });
      alert('Sub category icon updated');
    } catch (error) {
      alert(`Error updating sub category icon: ${error.response?.data?.message || error.message}`);
    } finally {
      setReplacingImageSubCategoryId(null);
    }
  };

  const getCategoryName = (subCategory) => {
    if (subCategory?.category && typeof subCategory.category === 'object') {
      return subCategory.category.name || 'Unknown Category';
    }

    const categoryId = getCategoryIdFromSubCategory(subCategory);
    const category = categories.find((item) => item._id === categoryId);
    return category?.name || 'Unknown Category';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading sub categories...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Sub Category Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage sub categories under each category, upload icons, and control display order.
          </p>
        </div>
        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-2">
          <select
            value={selectedCategoryId}
            onChange={(event) => setSelectedCategoryId(event.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white min-w-[220px]"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={openAddModal}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Sub Category
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Manage Sub Categories</h2>
          <span className="text-sm text-gray-500">{subCategories.length} sub category(s)</span>
        </div>

        {!selectedCategoryId && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mb-4">
            Select a category filter to enable reordering. Reordering is applied within the selected category only.
          </p>
        )}

        {subCategories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No sub categories found. Click "+ Add Sub Category" to create one.
          </div>
        ) : (
          <div className="space-y-4">
            {subCategories.map((subCategory, index) => (
              <div key={subCategory._id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-start">
                  <div className="lg:col-span-1 space-y-2">
                    <img
                      src={getAbsoluteImageUrl(BACKEND_URL, subCategory.imageUrl)}
                      alt={subCategory.name || `Sub Category ${index + 1}`}
                      className="w-full h-32 object-contain bg-gray-50 border border-gray-200 rounded-md"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleReplaceImageSelect(subCategory._id, event)}
                      className="w-full text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleReplaceImage(subCategory)}
                      disabled={replacingImageSubCategoryId === subCategory._id}
                      className="w-full px-3 py-2 bg-gray-200 text-gray-800 text-xs rounded-md hover:bg-gray-300 disabled:opacity-50"
                    >
                      {replacingImageSubCategoryId === subCategory._id ? 'Updating...' : 'Update Icon'}
                    </button>
                  </div>

                  <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Parent Category</label>
                      <select
                        value={getCategoryIdFromSubCategory(subCategory)}
                        onChange={(event) => handleSubCategoryFieldChange(subCategory._id, 'category', event.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Sub Category Name</label>
                      <input
                        type="text"
                        value={subCategory.name || ''}
                        onChange={(event) => handleSubCategoryFieldChange(subCategory._id, 'name', event.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Priority</label>
                      <input
                        type="number"
                        min="0"
                        value={subCategory.priority}
                        onChange={(event) => handleSubCategoryFieldChange(subCategory._id, 'priority', event.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Category Name</label>
                      <input
                        type="text"
                        value={getCategoryName(subCategory)}
                        readOnly
                        className="w-full p-2 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-600"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Redirect Link</label>
                      <input
                        type="text"
                        value={subCategory.redirectUrl || ''}
                        onChange={(event) => handleSubCategoryFieldChange(subCategory._id, 'redirectUrl', event.target.value)}
                        placeholder="/search?q=mango or https://example.com"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={Boolean(subCategory.isActive)}
                          onChange={(event) => handleSubCategoryFieldChange(subCategory._id, 'isActive', event.target.checked)}
                        />
                        Active (show on frontend)
                      </label>
                    </div>
                  </div>

                  <div className="lg:col-span-1 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveSubCategory(subCategory)}
                      disabled={updatingSubCategoryId === subCategory._id}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {updatingSubCategoryId === subCategory._id ? 'Saving...' : 'Save'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReorder(index, -1)}
                      disabled={!selectedCategoryId || reordering || index === 0}
                      className="px-3 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 disabled:opacity-50"
                    >
                      Move Up
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReorder(index, 1)}
                      disabled={!selectedCategoryId || reordering || index === subCategories.length - 1}
                      className="px-3 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 disabled:opacity-50"
                    >
                      Move Down
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSubCategory(subCategory._id)}
                      disabled={deletingSubCategoryId === subCategory._id}
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {deletingSubCategoryId === subCategory._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={closeAddModal}
        >
          <div
            className="bg-white rounded-xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Add New Sub Category</h2>
              <button
                type="button"
                onClick={closeAddModal}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500"
              >
                x
              </button>
            </div>

            {categories.length === 0 ? (
              <div className="p-6">
                <p className="text-sm text-gray-700 mb-4">
                  Please create at least one category first before adding sub categories.
                </p>
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateSubCategory} className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parent Category *</label>
                    <select
                      value={newSubCategory.category}
                      onChange={(event) => setNewSubCategory((prev) => ({ ...prev, category: event.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category Icon Image *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleNewImageSelect}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category Name *</label>
                    <input
                      type="text"
                      value={newSubCategory.name}
                      onChange={(event) => setNewSubCategory((prev) => ({ ...prev, name: event.target.value }))}
                      placeholder="Mango"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Redirect Link</label>
                    <input
                      type="text"
                      value={newSubCategory.redirectUrl}
                      onChange={(event) => setNewSubCategory((prev) => ({ ...prev, redirectUrl: event.target.value }))}
                      placeholder="/search?q=mango or https://example.com"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <input
                        type="number"
                        min="0"
                        value={newSubCategory.priority}
                        onChange={(event) => setNewSubCategory((prev) => ({ ...prev, priority: event.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Lower number shows first.</p>
                    </div>

                    <div className="flex items-end">
                      <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={newSubCategory.isActive}
                          onChange={(event) => setNewSubCategory((prev) => ({ ...prev, isActive: event.target.checked }))}
                          className="h-4 w-4"
                        />
                        Active
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={closeAddModal}
                      className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {creating ? 'Uploading...' : 'Upload Sub Category'}
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-44 flex items-center justify-center">
                  {newSubCategoryPreview ? (
                    <img
                      src={newSubCategoryPreview}
                      alt="New sub category preview"
                      className="max-h-56 w-full object-contain rounded-md"
                    />
                  ) : (
                    <p className="text-sm text-gray-500">Image preview will appear here</p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategoryManagement;
