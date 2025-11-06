import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { API_CONFIG } from "../Api-Config";

export default function ContentEditOffer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountLabel, setDiscountLabel] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const token = localStorage.getItem("login_token");
        if (!token) throw new Error("Login required");

        const res = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.OFFER}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.data;

        setTitle(data.title || "");
        setSubtitle(data.subtitle || "");
        setDescription(data.description || "");
        setDiscountLabel(data.discount_label || "");
        setIsNew(Boolean(data.is_new));
        setExpiresAt(data.expires_at ? data.expires_at.slice(0, 16) : "");

        // ✅ Ensure features is always an array
        let parsedFeatures: string[] = [];
        if (Array.isArray(data.features)) {
          parsedFeatures = data.features;
        } else if (typeof data.features === "string") {
          try {
            parsedFeatures = JSON.parse(data.features);
          } catch {
            parsedFeatures = [];
          }
        }
        setFeatures(parsedFeatures);

        setPreviewImage(data.image || null);
      } catch {
        toast.error("Failed to load offer");
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  const toggleFeature = (feature: string): void => {
    setFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selected = e.target.files[0];
      setImage(selected);
      setPreviewImage(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      const token = localStorage.getItem("login_token");
      if (!token) throw new Error("Login required");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("description", description);
      formData.append("discount_label", discountLabel);
      formData.append("is_new", isNew ? "1" : "0");

      if (expiresAt) formData.append("expires_at", expiresAt);

      features.forEach((f) => formData.append("features[]", f));

      if (image) formData.append("image", image);

      const res = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.OFFER}/${id}?_method=PUT`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data?.message || "Offer updated successfully!");
      navigate("/offers");

    } catch {
      toast.error("Failed to update offer");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p>Loading offer...</p>
      </div>
    );

  return (
    <div className="page-inner">
      <div className="page-header d-flex justify-content-between align-items-center">
        <h3 className="fw-bold mb-3">Edit Offer</h3>
        <button onClick={() => navigate("/offers")} className="btn btn-secondary btn-sm">
          ← Back to Offers
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Title *</label>
              <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Subtitle</label>
              <input type="text" className="form-control" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="mb-3">
              <label className="form-label">Discount Label</label>
              <input type="text" className="form-control" value={discountLabel} onChange={(e) => setDiscountLabel(e.target.value)} />
            </div>

            <div className="mb-3">
              <label className="form-label">Expires At</label>
              <input type="datetime-local" className="form-control" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
            </div>

            <div className="form-check mb-3">
              <input type="checkbox" className="form-check-input" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
              <label className="form-check-label">Mark as New</label>
            </div>

            <div className="mb-3">
              <label className="form-label">Features</label><br />
              {["Popular", "Limited Time", "Trending", "Customer Favorite"].map((feature) => (
                <label className="me-3" key={feature}>
                  <input
                    type="checkbox"
                    checked={features.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                  />{" "}
                  {feature}
                </label>
              ))}
            </div>

            <div className="mb-3">
              <label className="form-label">Image</label>
              <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
              {previewImage && <img src={previewImage} className="mt-2 rounded" width="120" />}
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Update Offer"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
