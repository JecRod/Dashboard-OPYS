import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { API_CONFIG } from "../Api-Config";

export default function ContentEditHall() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hall, setHall] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchHall = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("login_token");
        const res = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.HALL}/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        let data = res.data.data || res.data;

        // ✅ Facilities come stored as JSON string, so parse safely
        if (typeof data.facilities === "string") {
          try {
            data.facilities = JSON.parse(data.facilities);
          } catch {
            data.facilities = [];
          }
        }

        // ✅ Always ensure facilities is an array
        if (!Array.isArray(data.facilities)) data.facilities = [];

        setHall(data);
        setPreviewImage(data.image || "");
      } catch {
        toast.error("Failed to load hall");
      } finally {
        setLoading(false);
      }
    };

    fetchHall();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setHall((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));
    setHall((prev: any) => ({ ...prev, image: file }));
  };

  const handleSave = async (e: any) => {
  e.preventDefault();
  try {
    setSaving(true);
    const token = localStorage.getItem("login_token");

    const formData = new FormData();
    formData.append("name", hall.name);
    formData.append("description", hall.description || "");
    formData.append("capacity", String(hall.capacity || ""));
    formData.append("size", hall.size || "");

    // ✅ ALWAYS send facilities, even if empty
    formData.append("facilities", JSON.stringify(hall.facilities || []));

    formData.append("price_per_day", String(hall.price_per_day));
    formData.append("is_available", hall.is_available ? "1" : "0");

    // ✅ Add image only if uploaded
    if (hall.image instanceof File) {
      formData.append("image", hall.image);
    }

    await axios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.HALL}/${id}?_method=PUT`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Hall updated successfully!");
    navigate("/halls");
  } catch (err) {
    toast.error("Failed to update hall");
  } finally {
    setSaving(false);
  }
};


  if (loading || !hall) return <p>Loading...</p>;

  return (
    <div className="page-inner">
      <div className="page-header d-flex justify-content-between align-items-center">
        <h3 className="fw-bold mb-3">Edit Hall</h3>
        <button onClick={() => navigate("/halls")} className="btn btn-secondary btn-sm">
          ← Back to Halls
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSave}>

            <div className="mb-3">
              <label className="form-label">Hall Name</label>
              <input type="text" className="form-control" name="name" value={hall.name} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" value={hall.description || ""} onChange={handleChange} rows={3} />
            </div>

            <div className="mb-3">
              <label className="form-label">Capacity</label>
              <input type="number" className="form-control" name="capacity" value={hall.capacity || ""} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Size</label>
              <input type="text" className="form-control" name="size" value={hall.size || ""} onChange={handleChange} />
            </div>

            {/* ✅ Facilities Selection */}
            <div className="mb-3">
              <label className="form-label">Facilities</label>
              <div className="d-flex flex-wrap gap-2">
                {["Projector", "WiFi", "AC", "Sound System"].map((f) => (
                  <label key={f} className="form-check-label me-2 d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input me-1"
                      checked={hall.facilities.includes(f)}
                      onChange={() =>
                        setHall((prev: any) => ({
                          ...prev,
                          facilities: prev.facilities.includes(f)
                            ? prev.facilities.filter((item: string) => item !== f)
                            : [...prev.facilities, f],
                        }))
                      }
                    />
                    {f}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Price Per Day (RM)</label>
              <input type="number" step="0.01" className="form-control" name="price_per_day" value={hall.price_per_day || ""} onChange={handleChange} required />
            </div>

            <div className="form-check mb-3">
              <input type="checkbox" className="form-check-input" id="is_available" checked={hall.is_available} onChange={() => setHall({ ...hall, is_available: !hall.is_available })} />
              <label htmlFor="is_available" className="form-check-label">Available</label>
            </div>

            <div className="mb-3">
              <label className="form-label">Image</label>
              <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
              {previewImage && (
                <img src={previewImage} alt="Preview" className="mt-2 rounded" width="120" height="120" style={{ objectFit: "cover" }} />
              )}
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Update Hall"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
