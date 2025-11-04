import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_CONFIG } from "../Api-Config";

export default function ContentCreate() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState("Burger");
  const [available, setAvailable] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Generate live image preview
  useEffect(() => {
    if (!image) {
      setPreviewImage(null);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setPreviewImage(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !price || !image) {
      toast.error("Please fill in all fields and upload an image");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("login_token");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("is_available", available ? "1" : "0");
      formData.append("image", image);

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.ITEM}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Menu item created successfully!");
      console.log("Created Item:", response.data);

      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setCategory("Burger");
      setAvailable(true);
      setImage(null);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error("Backend Error:", err.response?.data);
        const errors = err.response?.data?.error || {};
        const firstError = Object.values(errors)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : "Failed to create menu");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-inner">
  <div className="page-header">
    <h3 className="fw-bold mb-3">Create New Menu Item</h3>
  </div>

  <div className="row">
    {/* Form */}
    <div className="col-md-6">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Menu Details</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Price (RM)</label>
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Burger</option>
                <option>Drinks</option>
                <option>Rice</option>
                <option>Dessert</option>
                <option>Beverage</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Available</label>
              <select
                className="form-select"
                value={available ? "available" : "not available"}
                onChange={(e) => setAvailable(e.target.value === "available")}
              >
                <option value="available">Available</option>
                <option value="not available">Not Available</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Upload Picture</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => e.target.files && setImage(e.target.files[0])}
                required
              />
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-success me-2" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setName("");
                  setDescription("");
                  setPrice("");
                  setCategory("Burger");
                  setAvailable(true);
                  setImage(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    {/* Live Preview */}
    <div className="col-md-6">
      <div className="card shadow-sm text-center">
        <div className="card-header">
          <h5 className="mb-2">Live Preview</h5>
        </div>
        {previewImage ? (
          <img
            src={previewImage}
            alt="Preview"
            className="card-img-top"
            style={{ maxHeight: 300, objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 300,
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#888",
            }}
          >
            Image Preview
          </div>
        )}
        <div className="card-body">
          <h5 className="mt-2">{name || "Menu Name"}</h5>
          <p>{description || "Description of the menu item"}</p>
          <p>
            <strong>RM {price || "0.00"}</strong> – {category}
          </p>
          <span className={`badge ${available ? "bg-success" : "bg-secondary"}`}>
            {available ? "Available" : "Not Available"}
          </span>
        </div>
      </div>
    </div>
  </div>
</div>

    
              

  );
}
