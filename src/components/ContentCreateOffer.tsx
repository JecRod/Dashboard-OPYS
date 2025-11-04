import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_CONFIG } from "../Api-Config";

interface Item {
  id: number;
  name: string;
  price: number;
}

export default function ContentCreateOffer() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [isNew, setIsNew] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    discount_label: "",
    expires_at: "",
  });

  // Fetch all items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("login_token");
        const res = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.ITEM}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data.data || res.data.items || []);
      } catch (err) {
        toast.error("Failed to load items");
      }
    };
    fetchItems();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0])); // live preview
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("login_token");
      const payload = new FormData();

      // Required
      payload.append("title", formData.title);

      // Optional fields
      if (formData.subtitle) payload.append("subtitle", formData.subtitle);
      if (formData.description) payload.append("description", formData.description);
      if (formData.discount_label) payload.append("discount_label", formData.discount_label);
      if (formData.expires_at) payload.append("expires_at", formData.expires_at);
      payload.append("is_new", isNew ? "1" : "0");

      // Append items
      selectedItems.forEach((id) => payload.append("items[]", String(id)));

      // Append features
      features.forEach((f) => payload.append("features[]", f));

      // Append image
      if (imageFile) payload.append("image", imageFile);

      const res = await axios.post(`${API_CONFIG.BASE_URL}/offers`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message || "Offer created successfully ✅");

      // Reset form
      setFormData({ title: "", subtitle: "", description: "", discount_label: "", expires_at: "" });
      setSelectedItems([]);
      setFeatures([]);
      setIsNew(false);
      setImageFile(null);
      setImagePreview(null);

    } catch (err: any) {
      console.error(err.response?.data);
      if (err.response?.status === 422 && err.response.data.errors) {
        // Show validation errors
        Object.values(err.response.data.errors).forEach((msg: any) => toast.error(msg));
      } else {
        toast.error(err.response?.data?.message || "Failed to create offer ❌");
      }
    }
  };

  return (
    <div className="page-inner">
      <div className="page-header">
        <h3 className="fw-bold mb-3">Create New Offer</h3>
      </div>

      <div className="row">
        {/* Form */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Offer Details</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Subtitle */}
                <div className="mb-3">
                  <label className="form-label">Subtitle</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                {/* Discount & New */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Discount Label</label>
                    <input
                      type="text"
                      className="form-control"
                      name="discount_label"
                      value={formData.discount_label}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={isNew}
                      onChange={() => setIsNew(!isNew)}
                      id="isNew"
                    />
                    <label htmlFor="isNew" className="form-check-label">Is New</label>
                  </div>
                </div>

                {/* Expires & Image */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Expires At</label>
                    <input
                      type="date"
                      className="form-control"
                      name="expires_at"
                      value={formData.expires_at}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="mb-3">
                  <label className="form-label">Select Items</label>
                  <div className="row">
                    {items.length > 0 ? items.map(item => (
                      <div className="col-md-6" key={item.id}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`item-${item.id}`}
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleItemChange(item.id)}
                          />
                          <label className="form-check-label" htmlFor={`item-${item.id}`}>
                            {item.name} (RM {item.price})
                          </label>
                        </div>
                      </div>
                    )) : <p>No items available</p>}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-3">
                  <label className="form-label">Features (comma-separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={features.join(", ")}
                    onChange={(e) =>
                      setFeatures(e.target.value.split(",").map(f => f.trim()))
                    }
                  />
                </div>

                <button type="submit" className="btn btn-success w-100">Create Offer</button>
              </form>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="col-md-6">
          <h5 className="mb-2">Live Preview</h5>
          <div className="card h-100">
            {imagePreview ? (
              <img src={imagePreview} alt="Offer Preview" className="card-img-top" style={{ height: "200px", objectFit: "cover" }} />
            ) : (
              <div className="card-img-top d-flex align-items-center justify-content-center bg-light" style={{ height: "200px" }}>
                <span>No Image</span>
              </div>
            )}
            <div className="card-body">
              <h5 className="card-title">{formData.title || "Title"}</h5>
              {formData.subtitle && <h6 className="text-muted">{formData.subtitle}</h6>}
              <p className="card-text">{formData.description || "Description..."}</p>

              {formData.discount_label && <span className="badge bg-danger me-2">{formData.discount_label}</span>}
              {isNew && <span className="badge bg-success">NEW</span>}

              {features.length > 0 && (
                <div className="mt-2">
                  {features.map((f, idx) => (
                    <span key={idx} className="badge bg-info text-dark me-1">{f}</span>
                  ))}
                </div>
              )}

              {selectedItems.length > 0 && (
                <div className="mt-3">
                  <strong>Items:</strong>
                  <ul style={{ paddingLeft: "20px", margin: 0 }}>
                    {items.filter(item => selectedItems.includes(item.id)).map(item => (
                      <li key={item.id}>🍽️ {item.name} – RM {item.price}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
