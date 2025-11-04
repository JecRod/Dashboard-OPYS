import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { API_CONFIG } from "../Api-Config";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

export default function ContentEditMenuItem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // ✅ Fetch menu item on mount
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem("login_token");
        if (!token) throw new Error("Please login first");

        const res = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.ITEM_SHOW}/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data?.data || res.data;
        setItem(data);
        setPreviewImage(
          data.image
            ? `${API_CONFIG.BASE_URL}/${data.image}`.replace(
                /([^:]\/)\/+/g,
                "$1"
              )
            : null
        );
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load menu item");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  // ✅ Handle input field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!item) return;
    const { name, type, value, checked } = e.target as HTMLInputElement;
    setItem({
      ...item,
      [name]:
        type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    });
  };

  // ✅ Handle image file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewImage(URL.createObjectURL(selected));
    }
  };

  // ✅ Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("login_token");
      if (!token) throw new Error("Please login first");

      const formData = new FormData();
      formData.append("name", item.name);
      formData.append("description", item.description);
      formData.append("price", item.price.toString());
      formData.append("category", item.category);
      formData.append("available", item.available ? "1" : "0");

      if (file) formData.append("image", file);

      // ✅ Direct PUT request (no _method=PUT)
      const res = await axios.put(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.UPDATE_ITEM}/${item.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data?.message || "Item updated successfully!");
      navigate("/menu");
    } catch (err: any) {
      console.error("Save error:", err);

      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        toast.error(firstError[0] || "Validation failed");
      } else {
        toast.error("Failed to update menu item");
      }
    } finally {
      setSaving(false);
    }
  };

  // ✅ Loading / error states
  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Loading item...</p>
      </div>
    );

  if (!item)
    return (
      <div className="alert alert-danger text-center">
        Menu item not found.
      </div>
    );

  // ✅ Form layout
  return (
    <div className="page-inner">
      <div className="page-header d-flex justify-content-between align-items-center">
        <h3 className="fw-bold mb-3">Edit Menu Item</h3>
        <button
          onClick={() => navigate("/menu")}
          className="btn btn-secondary btn-sm"
        >
          ← Back to Menu
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={item.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={item.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {/* Price */}
            <div className="mb-3">
              <label className="form-label">Price (RM)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                name="price"
                value={item.price}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category */}
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                name="category"
                value={item.category}
                onChange={handleChange}
              >
                <option value="food">Food</option>
                <option value="drink">Drink</option>
                <option value="hall">Hall</option>
              </select>
            </div>

            {/* Availability */}
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="available"
                name="available"
                checked={item.available}
                onChange={handleChange}
              />
              <label htmlFor="available" className="form-check-label">
                Available
              </label>
            </div>

            {/* Image */}
            <div className="mb-3">
              <label className="form-label">Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-2 rounded"
                  width="120"
                  height="120"
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Update Item"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
