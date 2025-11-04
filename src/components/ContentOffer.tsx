import { useEffect, useState } from "react";
import axios from "axios";
import { API_CONFIG } from "../Api-Config";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  is_available: number;
}

interface Offer {
  id: number;
  title: string;
  subtitle?: string | null;
  description: string;
  discount_label?: string | null;
  image?: string | null;
  features?: string[] | null;
  is_new: boolean;
  expires_at?: string | null;
  items: Item[];
}

export default function ContentOffer() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("login_token");
        if (!token) throw new Error("Authentication token not found");

        const response = await axios.get(`${API_CONFIG.BASE_URL}/offers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ensure features is always an array
        const normalizedOffers = (response.data.offers || []).map((offer: Offer) => ({
          ...offer,
          features: Array.isArray(offer.features) ? offer.features : [],
          items: Array.isArray(offer.items) ? offer.items : [],
        }));

        setOffers(normalizedOffers);
      } catch (err: any) {
        console.error("Failed to load offers:", err);
        setError("Failed to load offers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this offer?");
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      const token = localStorage.getItem("login_token");
      await axios.delete(`${API_CONFIG.BASE_URL}/offers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOffers((prev) => prev.filter((offer) => offer.id !== id));
      toast.success("Offer deleted successfully!");
    } catch (err) {
      console.error("Failed to delete offer:", err);
      toast.error("Failed to delete offer. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page-inner">
      <div className="page-header mb-4 d-flex justify-content-between align-items-center">
        <h3 className="fw-bold">All Offers</h3>
        <Link to="/create-offer">
          <button className="btn btn-primary">+ Add Offer</button>
        </Link>
      </div>

      {loading && <p>Loading offers...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && offers.length === 0 && <p>No offers found.</p>}

      <div className="row">
        {!loading &&
          offers.map((offer) => (
            <div className="col-md-6 col-lg-4 mb-4" key={offer.id}>
              <div className="card h-100">
                {offer.image ? (
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="card-img-top d-flex align-items-center justify-content-center bg-light"
                    style={{ height: "200px" }}
                  >
                    <span>No Image</span>
                  </div>
                )}

                <div className="card-body">
                  <h5 className="card-title">{offer.title}</h5>
                  {offer.subtitle && <h6 className="text-muted">{offer.subtitle}</h6>}
                  <p className="card-text">{offer.description}</p>

                  {offer.discount_label && (
                    <span className="badge bg-danger me-2">{offer.discount_label}</span>
                  )}
                  {offer.is_new && <span className="badge bg-success">NEW</span>}

                  {Array.isArray(offer.features) && offer.features.length > 0 && (
                    <div className="mt-2">
                      {offer.features.map((feature, idx) => (
                        <span key={idx} className="badge bg-info text-dark me-1">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  {Array.isArray(offer.items) && offer.items.length > 0 && (
                    <div className="mt-3">
                      <strong>Items:</strong>
                      <ul style={{ paddingLeft: "20px", margin: 0 }}>
                        {offer.items.map((item) => (
                          <li key={item.id}>
                            🍽️ {item.name} – RM {item.price}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="card-footer d-flex justify-content-between">
                  <Link to={`/edit-offer/${offer.id}`}>
                    <button className="btn btn-warning btn-sm">Edit</button>
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(offer.id)}
                    disabled={deletingId === offer.id}
                  >
                    {deletingId === offer.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
