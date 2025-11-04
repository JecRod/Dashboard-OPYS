import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_CONFIG } from "../Api-Config";

export default function CreateHall() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState<string>("");
  const [size, setSize] = useState("");
  const [facilities, setFacilities] = useState<string[]>([]);
  const [pricePerDay, setPricePerDay] = useState<string>("");
  const [available, setAvailable] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleFacility = (facility: string) => {
    setFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !pricePerDay) {
      toast.error("Please fill in all required fields (name and price)");
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
      formData.append("capacity", capacity);
      formData.append("size", size);
      facilities.forEach((f) => formData.append("facilities[]", f));
      formData.append("price_per_day", pricePerDay);
      formData.append("is_available", available ? "1" : "0");
      if (image) formData.append("image", image);

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.HALL}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message || "Hall created successfully!");


      setName("");
      setDescription("");
      setCapacity("");
      setSize("");
      setFacilities([]);
      setPricePerDay("");
      setAvailable(true);
      setImage(null);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to create hall");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-inner">
        <div className="page-header">
          <h3 className="fw-bold mb-3">Create New Hall</h3>
          <ul className="breadcrumbs mb-3">
            <li className="nav-home"><a href="#"><i className="icon-home" /></a></li>
            <li className="separator"><i className="icon-arrow-right" /></li>
            <li className="nav-item"><a href="#">Halls</a></li>
            <li className="separator"><i className="icon-arrow-right" /></li>
            <li className="nav-item"><a href="#">Create Hall</a></li>
          </ul>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Create Hall</div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="card-body">
                  <div className="row">

                    <div className="col-md-6 col-lg-4">
                      {/* Name */}
                      <div className="form-group form-inline">
                        <label className="col-md-3 col-form-label">Name *</label>
                        <div className="col-md-9 p-0">
                          <input
                            type="text"
                            className="form-control input-full"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter Name"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div className="form-group form-inline">
                        <label className="col-md-3 col-form-label">Description</label>
                        <div className="col-md-9 p-0">
                          <textarea
                            className="form-control input-full"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter Description"
                          />
                        </div>
                      </div>

                      {/* Image */}
                      <div className="form-group">
                        <label>Upload Picture</label>
                        <input
                          type="file"
                          className="form-control-file"
                          accept="image/*"
                          onChange={(e) => e.target.files && setImage(e.target.files[0])}
                        />
                        {image && <small className="text-muted">{image.name}</small>}
                      </div>
                    </div>

                    <div className="col-md-6 col-lg-4">
                      {/* Capacity */}
                      <div className="form-group">
                        <label>Capacity</label>
                        <input
                          type="number"
                          className="form-control"
                          value={capacity}
                          onChange={(e) => setCapacity(e.target.value)}
                          placeholder="Enter Capacity"
                        />
                      </div>

                      {/* Size */}
                      <div className="form-group">
                        <label>Size</label>
                        <input
                          type="text"
                          className="form-control"
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                          placeholder="Enter Size"
                        />
                      </div>

                      {/* Price */}
                      <div className="form-group">
                        <label>Price per Day (RM) *</label>
                        <input
                          type="number"
                          className="form-control"
                          value={pricePerDay}
                          onChange={(e) => setPricePerDay(e.target.value)}
                          placeholder="Enter Price"
                          min={0}
                          max={1000000} // example: set a reasonable max
                        />
                      </div>

                      {/* Availability */}
                      <div className="form-group">
                        <label>Availability</label>
                        <select
                          className="form-select form-control"
                          value={available ? "available" : "not available"}
                          onChange={(e) => setAvailable(e.target.value === "available")}
                        >
                          <option value="available">Available</option>
                          <option value="not available">Not Available</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6 col-lg-4">
                      {/* Facilities */}
                      <div className="form-group">
                        <label>Facilities</label>
                        <div className="d-flex flex-wrap gap-2">
                          {["Projector", "WiFi", "AC", "Sound System"].map((f) => (
                            <label key={f} className="form-check-label me-2">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={facilities.includes(f)}
                                onChange={() => toggleFacility(f)}
                              />
                              {f}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="card-action">
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setName(""); setDescription(""); setCapacity("");
                      setSize(""); setFacilities([]); setPricePerDay("");
                      setAvailable(true); setImage(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
