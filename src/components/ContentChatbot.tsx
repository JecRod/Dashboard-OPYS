import { useEffect, useState } from "react";
import { API_CONFIG } from "../Api-Config";
import axios from "axios";
import toast from "react-hot-toast";

interface Keyword {
  id: number;
  keyword: string;
  reply: string;
}

export default function ContentChatbot() {
    const [keywords, setKeywords] = useState<Keyword[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        const fetchKeywords = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("login_token");
            if (!token) throw new Error("Authentication token not found");

            const response = await axios.get(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.CHATBOT}`, // adjust endpoint
            {
                headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                },
            }
            );

            let data = response.data;
            if (response.data?.data) data = response.data.data;

            if (!Array.isArray(data)) throw new Error("Invalid data format");

            setKeywords(data);
        } catch (err: unknown) {
            const message = axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : err instanceof Error
            ? err.message
            : "Unknown error";
            setError(message);
            console.error("Error fetching keywords:", err);
        } finally {
            setLoading(false);
        }
        };

        fetchKeywords();
    }, []);

    const handleDelete = async (id: number, keyword: string) => {
        try {
        const token = localStorage.getItem("login_token");
        if (!token) {
            toast.error("Please login to perform this action");
            return;
        }

        const confirmDelete = window.confirm(`Are you sure you want to delete "${keyword}"?`);
        if (!confirmDelete) return;

        setDeletingId(id);
        toast.loading(`Deleting "${keyword}"...`);

        await axios.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.CHATBOT}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        toast.dismiss();
        toast.success(`"${keyword}" deleted successfully!`);
        setKeywords(prev => prev.filter(k => k.id !== id));
        } catch (err) {
        toast.dismiss();
        let message = "Failed to delete keyword";
        if (axios.isAxiosError(err)) message = err.response?.data?.message || message;
        toast.error(message);
        console.error(err);
        } finally {
        setDeletingId(null);
        }
    };

    if (loading) return <p>Loading keywords...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    
    return (
        <>
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
                    <th>Keyword</th>
                    <th>Reply</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                    {keywords.length === 0 ? (
                    <tr>
                        <td colSpan={4} style={{ textAlign: "center" }}>No keywords found</td>
                    </tr>
                    ) : (
                    keywords.map(k => (
                        <tr key={k.id}>
                        <td>{k.id}</td>
                        <td>{k.keyword}</td>
                        <td>{k.reply}</td>
                        <td>
                            <button className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(k.id, k.keyword)}
                            disabled={deletingId === k.id}
                            >
                            {deletingId === k.id ? "Deleting..." : "Delete"}
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
        </>
    );
}
