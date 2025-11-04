import { useEffect, useState } from "react";
import axios from "axios";
import { API_CONFIG } from "../Api-Config";
import toast from "react-hot-toast";

interface Feedback {
  id: number;
  name: string;
  item_name: string;
  rating: number;
  comment: string;
}

export default function ContentFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("login_token");
        if (!token) throw new Error("Authentication token not found");

        const response = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.FEEDBACKS}`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        let feedbackData = response.data;
        if (response.data?.data) feedbackData = response.data.data;

        if (!Array.isArray(feedbackData)) {
          throw new Error("Invalid data format received from server");
        }

        setFeedbacks(feedbackData);
      } catch (err: unknown) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error
          ? err.message
          : "Unknown error occurred";

        console.error("Error fetching feedback:", err);
        setError(`Failed to load feedback: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    try {
      const token = localStorage.getItem("login_token");
      if (!token) {
        toast.error("Please login to perform this action");
        return;
      }

      const confirmDelete = window.confirm(`Are you sure you want to delete feedback from "${name}"?`);
      if (!confirmDelete) return;

      setDeletingId(id);
      toast.loading(`Deleting feedback from "${name}"...`);

      await axios.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.FEEDBACKS}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.dismiss();
      toast.success(`Feedback from "${name}" deleted successfully!`);
      setFeedbacks(prev => prev.filter(fb => fb.id !== id));
    } catch (err) {
      toast.dismiss();
      console.error("Error deleting feedback:", err);

      let errorMessage = "Failed to delete feedback";
      if (axios.isAxiosError(err)) errorMessage = err.response?.data?.message || errorMessage;

      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p>Loading feedbacks...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="page-inner">
      <div className="page-header">
        <h3 className="fw-bold mb-3">All Feedback</h3>
        <ul className="breadcrumbs mb-3">
          <li className="nav-home">
            <a href="#"><i className="icon-home" /></a>
          </li>
          <li className="separator"><i className="icon-arrow-right" /></li>
          <li className="nav-item"><a href="#">Feedback</a></li>
          <li className="separator"><i className="icon-arrow-right" /></li>
          <li className="nav-item"><a href="#">All Feedback</a></li>
        </ul>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">All Feedback</div>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading menu...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-head-bg-success">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Item</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center" }}>No feedback found</td>
                    </tr>
                  ) : (
                    feedbacks.map(fb => (
                      <tr key={fb.id}>
                        <td>{fb.id}</td>
                        <td>{fb.name}</td>
                        <td>{fb.item_name}</td>
                        <td>{fb.rating}</td>
                        <td>{fb.comment}</td>
                        <td>
                          <button className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(fb.id, fb.name)}
                            disabled={deletingId === fb.id}
                          >
                            {deletingId === fb.id ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
