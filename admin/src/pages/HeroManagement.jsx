import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const getAbsoluteImageUrl = (backendUrl, imageUrl) => {
  if (!imageUrl) return '';
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${backendUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

const HeroManagement = () => {
  const { BACKEND_URL } = useContext(AppContext);

  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [updatingHeroId, setUpdatingHeroId] = useState(null);
  const [deletingHeroId, setDeletingHeroId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newHero, setNewHero] = useState({
    title: '',
    linkUrl: '',
    priority: 1,
    isActive: true
  });

  const [newHeroImage, setNewHeroImage] = useState(null);
  const [newHeroPreview, setNewHeroPreview] = useState('');

  useEffect(() => {
    fetchHeroes();
  }, []);

  useEffect(() => {
    return () => {
      if (newHeroPreview) {
        URL.revokeObjectURL(newHeroPreview);
      }
    };
  }, [newHeroPreview]);

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/heroes/admin`);
      const heroList = Array.isArray(response.data?.data) ? response.data.data : [];
      setHeroes(heroList);
    } catch (error) {
      alert(`Error fetching heroes: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const uploadNewHeroImage = async () => {
    if (!newHeroImage) {
      throw new Error('Please select a hero image');
    }

    const formData = new FormData();
    formData.append('image', newHeroImage);

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
    if (newHeroPreview) {
      URL.revokeObjectURL(newHeroPreview);
    }

    setNewHeroImage(null);
    setNewHeroPreview('');
    setNewHero({
      title: '',
      linkUrl: '',
      priority: heroes.length + 1,
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

  const handleCreateHero = async (event) => {
    event.preventDefault();

    if (!newHeroImage) {
      alert('Please select a hero image');
      return;
    }

    setCreating(true);
    try {
      const imageUrl = await uploadNewHeroImage();

      await axios.post(`${BACKEND_URL}/api/heroes`, {
        imageUrl,
        title: newHero.title,
        linkUrl: newHero.linkUrl,
        priority: Number(newHero.priority) || heroes.length + 1,
        isActive: Boolean(newHero.isActive)
      });

      await fetchHeroes();
      resetCreateForm();
      setShowAddModal(false);
      alert('Hero banner created successfully');
    } catch (error) {
      alert(`Error creating hero: ${error.response?.data?.message || error.message}`);
    } finally {
      setCreating(false);
    }
  };

  const handleHeroFieldChange = (heroId, field, value) => {
    setHeroes((prevHeroes) =>
      prevHeroes.map((hero) =>
        hero._id === heroId
          ? {
              ...hero,
              [field]: value
            }
          : hero
      )
    );
  };

  const handleSaveHero = async (hero) => {
    setUpdatingHeroId(hero._id);
    try {
      await axios.put(`${BACKEND_URL}/api/heroes/${hero._id}`, {
        title: hero.title || '',
        linkUrl: hero.linkUrl || '',
        priority: Number(hero.priority) || 1,
        isActive: Boolean(hero.isActive)
      });

      await fetchHeroes();
      alert('Hero banner updated');
    } catch (error) {
      alert(`Error updating hero: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdatingHeroId(null);
    }
  };

  const handleDeleteHero = async (heroId) => {
    const confirmed = window.confirm('Are you sure you want to delete this hero banner?');
    if (!confirmed) return;

    setDeletingHeroId(heroId);
    try {
      await axios.delete(`${BACKEND_URL}/api/heroes/${heroId}`);
      await fetchHeroes();
      alert('Hero banner deleted');
    } catch (error) {
      alert(`Error deleting hero: ${error.response?.data?.message || error.message}`);
    } finally {
      setDeletingHeroId(null);
    }
  };

  const handleReorder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= heroes.length) {
      return;
    }

    const reorderedHeroes = [...heroes];
    [reorderedHeroes[index], reorderedHeroes[targetIndex]] = [reorderedHeroes[targetIndex], reorderedHeroes[index]];

    setReordering(true);
    try {
      await axios.patch(`${BACKEND_URL}/api/heroes/reorder`, {
        orderedIds: reorderedHeroes.map((hero) => hero._id)
      });

      await fetchHeroes();
    } catch (error) {
      alert(`Error reordering heroes: ${error.response?.data?.message || error.message}`);
    } finally {
      setReordering(false);
    }
  };

  const handleNewImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (newHeroPreview) {
      URL.revokeObjectURL(newHeroPreview);
    }

    setNewHeroImage(file);
    setNewHeroPreview(URL.createObjectURL(file));
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading hero banners...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Hero Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Upload hero images, add clickable links, and control display priority.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Hero
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Manage Hero Banners</h2>
          <span className="text-sm text-gray-500">{heroes.length} banner(s)</span>
        </div>

        {heroes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hero banners found. Click "+ Add Hero" to create one.</div>
        ) : (
          <div className="space-y-4">
            {heroes.map((hero, index) => (
              <div key={hero._id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
                  <div className="lg:col-span-1">
                    <img
                      src={getAbsoluteImageUrl(BACKEND_URL, hero.imageUrl)}
                      alt={hero.title || `Hero ${index + 1}`}
                      className="w-full h-32 object-contain bg-gray-50 border border-gray-200 rounded-md"
                    />
                  </div>

                  <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={hero.title || ''}
                        onChange={(e) => handleHeroFieldChange(hero._id, 'title', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Priority</label>
                      <input
                        type="number"
                        min="0"
                        value={hero.priority}
                        onChange={(e) => handleHeroFieldChange(hero._id, 'priority', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Clickable Link</label>
                      <input
                        type="text"
                        value={hero.linkUrl || ''}
                        onChange={(e) => handleHeroFieldChange(hero._id, 'linkUrl', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={Boolean(hero.isActive)}
                          onChange={(e) => handleHeroFieldChange(hero._id, 'isActive', e.target.checked)}
                        />
                        Active (show on frontend)
                      </label>
                    </div>
                  </div>

                  <div className="lg:col-span-1 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveHero(hero)}
                      disabled={updatingHeroId === hero._id}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {updatingHeroId === hero._id ? 'Saving...' : 'Save'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReorder(index, -1)}
                      disabled={reordering || index === 0}
                      className="px-3 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 disabled:opacity-50"
                    >
                      Move Up
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReorder(index, 1)}
                      disabled={reordering || index === heroes.length - 1}
                      className="px-3 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 disabled:opacity-50"
                    >
                      Move Down
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteHero(hero._id)}
                      disabled={deletingHeroId === hero._id}
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {deletingHeroId === hero._id ? 'Deleting...' : 'Delete'}
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
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Add New Hero Banner</h2>
              <button
                type="button"
                onClick={closeAddModal}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateHero} className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNewImageSelect}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title (optional)</label>
                  <input
                    type="text"
                    value={newHero.title}
                    onChange={(e) => setNewHero((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Hero title"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Clickable Link</label>
                  <input
                    type="text"
                    value={newHero.linkUrl}
                    onChange={(e) => setNewHero((prev) => ({ ...prev, linkUrl: e.target.value }))}
                    placeholder="https://example.com or /pc-parts"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <input
                      type="number"
                      min="0"
                      value={newHero.priority}
                      onChange={(e) => setNewHero((prev) => ({ ...prev, priority: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lower number shows first.</p>
                  </div>

                  <div className="flex items-end">
                    <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={newHero.isActive}
                        onChange={(e) => setNewHero((prev) => ({ ...prev, isActive: e.target.checked }))}
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
                    {creating ? 'Uploading...' : 'Upload Hero Banner'}
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-44 flex items-center justify-center">
                {newHeroPreview ? (
                  <img
                    src={newHeroPreview}
                    alt="New hero preview"
                    className="max-h-56 w-full object-contain rounded-md"
                  />
                ) : (
                  <p className="text-sm text-gray-500">Image preview will appear here</p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroManagement;
