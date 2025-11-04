import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_CONFIG } from "../Api-Config";

interface Hall {
  id: number;
  name: string;
  description: string;
  capacity?: number;
  size?: string;
  facilities?: string[] | string;
  price_per_day: number;
  is_available: boolean;
  image?: string;
}

export default function ContentHall() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchHalls = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("login_token");
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.HALL}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHalls(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to fetch halls");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHalls();
  }, []);

  // ✅ Delete hall function
  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Are you sure you want to delete this hall?");
    if (!confirm) return;

    try {
      setDeletingId(id);
      const token = localStorage.getItem("login_token");
      await axios.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.HALL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove hall from state
      setHalls((prev) => prev.filter((hall) => hall.id !== id));
      toast.success("Hall deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete hall");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container">
      <div className="page-inner">
        <div className="page-header">
          <h3 className="fw-bold mb-3">List of Halls</h3>
          <ul className="breadcrumbs mb-3">
            <li className="nav-home"><a href="#"><i className="icon-home" /></a></li>
            <li className="separator"><i className="icon-arrow-right" /></li>
            <li className="nav-item"><a href="#">Halls</a></li>
          </ul>
        </div>

        <div className="row">
          {loading ? (
            <p>Loading...</p>
          ) : halls.length === 0 ? (
            <p>No halls found.</p>
          ) : (
            halls.map((hall) => {
              const facilities =
                Array.isArray(hall.facilities)
                  ? hall.facilities
                  : typeof hall.facilities === "string"
                  ? JSON.parse(hall.facilities || "[]")
                  : [];

              return (
                <div className="col-md-6 col-lg-4 mb-4" key={hall.id}>
                  <div className="card">
                    {hall.image && (
                      <img
                        src={hall.image}
                        alt={hall.name}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{hall.name}</h5>
                      <p className="card-text">{hall.description}</p>
                      {hall.capacity && <p>Capacity: {hall.capacity}</p>}
                      {hall.size && <p>Size: {hall.size}</p>}
                      {facilities.length > 0 && <p>Facilities: {facilities.join(", ")}</p>}
                      <p>Price per Day: RM {hall.price_per_day}</p>
                      <p>
                        Availability:{" "}
                        {hall.is_available ? (
                          <span className="text-success">Available</span>
                        ) : (
                          <span className="text-danger">Not Available</span>
                        )}
                      </p>
                    </div>
                    <div className="card-footer d-flex justify-content-between">
                      <a href={`#edit/${hall.id}`} className="btn btn-sm btn-primary">
                        Edit
                      </a>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(hall.id)}
                        disabled={deletingId === hall.id}
                      >
                        {deletingId === hall.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
