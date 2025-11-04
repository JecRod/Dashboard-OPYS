


import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_CONFIG } from "../Api-Config";

export default function ContentCreateChatbot() {
  const [keyword, setKeyword] = useState<string>("");
  const [reply, setReply] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyword.trim() || !reply.trim()) {
      toast.error("Please fill in both fields");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("login_token");
      if (!token) throw new Error("Authentication token not found");

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.CHATBOT_CREATE}`, // your endpoint
        { keyword, reply },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message || "Auto-reply created successfully!");
      setKeyword("");
      setReply("");
    } catch (err: unknown) {
      console.error("Error creating auto-reply:", err);
      let message = "Failed to create auto-reply";
      if (axios.isAxiosError(err)) message = err.response?.data?.message || message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container">
      <div className="page-inner">
        <div className="page-header">
          <h3 className="fw-bold mb-3">Create Chatbot</h3>
          <ul className="breadcrumbs mb-3">
            <li className="nav-home">
              <a href="#"><i className="icon-home" /></a>
            </li>
            <li className="separator"><i className="icon-arrow-right" /></li>
            <li className="nav-item"><a href="#">Chatbot</a></li>
            <li className="separator"><i className="icon-arrow-right" /></li>
            <li className="nav-item"><a href="#">Create Chatbot</a></li>
          </ul>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Create Chatbot</div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="card-body">
                    <div className="row">
                    <div className="col-md-6 col-lg-4">
                        <div className="form-group form-inline">
                        <label className="col-md-3 col-form-label">Keyword</label>
                        <div className="col-md-9 p-0">
                            <input
                            type="text"
                            className="form-control input-full"
                            placeholder="Enter Keyword"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            disabled={loading}
                            />
                        </div>
                        </div>

                        <div className="form-group form-inline">
                        <label className="col-md-3 col-form-label">Reply</label>
                        <div className="col-md-9 p-0">
                            <input
                            type="text"
                            className="form-control input-full"
                            placeholder="Enter Reply"
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            disabled={loading}
                            />
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
                        setKeyword("");
                        setReply("");
                    }}
                    disabled={loading}
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
