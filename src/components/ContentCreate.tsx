import { useState } from "react";
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !price || !image) {
      toast.error("Please fill in all fields and upload an image");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
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

      formData.forEach((value, key) => {
        console.log(key + ": " + value);
      });

      console.log(name);
      console.log(description);
      console.log(price);
      console.log(category);
      console.log(available);
      console.log(image);
      


      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.ITEM}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // No need to set Content-Type manually
          },
        }
      );

      toast.success("Menu item created successfully!");
      console.log("Created Item:", response.data);

      // Reset form after success
      setName("");
      setDescription("");
      setPrice("");
      setCategory("Burger");
      setAvailable(true);
      setImage(null);
        } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Backend Error:", err.response?.data);
        toast.error(err.response?.data?.message || "Failed to create menu");
      } else {
        toast.error("Something went wrong");
      }


      console.error("Error creating menu:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-inner">
        <div className="page-header">
          <h3 className="fw-bold mb-3">Create Menu</h3>
          <ul className="breadcrumbs mb-3">
            <li className="nav-home">
              <a href="#"><i className="icon-home" /></a>
            </li>
            <li className="separator"><i className="icon-arrow-right" /></li>
            <li className="nav-item"><a href="#">Menu</a></li>
            <li className="separator"><i className="icon-arrow-right" /></li>
            <li className="nav-item"><a href="#">Create Menu</a></li>
          </ul>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Create Menu</div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 col-lg-4">
                      <div className="form-group form-inline">
                        <label className="col-md-3 col-form-label">Name</label>
                        <div className="col-md-9 p-0">
                          <input
                            type="text"
                            className="form-control input-full"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-group form-inline">
                        <label className="col-md-3 col-form-label">Description</label>
                        <div className="col-md-9 p-0">
                          <input
                            type="text"
                            className="form-control input-full"
                            placeholder="Enter Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Upload Picture</label>
                        <input
                          type="file"
                          className="form-control-file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setImage(e.target.files[0]);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="form-group">
                        <label>Price</label>
                        <div className="input-group mb-3">
                          <span className="input-group-text">RM</span>
                          <input
                            type="number"
                            className="form-control"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                          <span className="input-group-text">.00</span>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        <select
                          className="form-select form-control"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option>Burger</option>
                          <option>Drinks</option>
                          <option>Hall</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Available</label>
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
      </div>
    </div>
  );
}
