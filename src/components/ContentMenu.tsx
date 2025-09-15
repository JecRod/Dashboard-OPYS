import { useEffect, useState } from 'react';
import axios from 'axios';
// import { toast } from 'react-toastify';
import { API_CONFIG } from '../Api-Config';
import toast from 'react-hot-toast';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image: string;
}

export default function ContentMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.ITEM}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        let menuData = response.data;
        
        if (response.data?.data) {
          menuData = response.data.data;
        } else if (response.data?.items) {
          menuData = response.data.items;
        }

        if (!Array.isArray(menuData)) {
          throw new Error('Invalid data format received from server');
        }

        setMenu(menuData);
      } catch (err: unknown) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error
          ? err.message
          : 'Unknown error occurred';
        
        console.error('Error fetching menu:', err);
        setError(`Failed to load menu: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleDelete = async (id: number, name: string) => {
        try {
                const token = localStorage.getItem('token');
                if (!token) {
                  toast.error('Please login to perform this action');
                  return;
                }

                // Confirmation dialog
                const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
                if (!confirmDelete) return;

                // Show loading toast (optional)
                toast.loading(`Deleting "${name}"...`, {
                  position: 'top-right',
                  // toastId: 'delete-loading' // Give it a specific ID
                });

                await axios.delete(
                  `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.ITEM}/${id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                // Dismiss loading toast and show success
                toast.dismiss('delete-loading'); // Dismiss by ID
                toast.success(`"${name}" was deleted successfully!`, {
                  position: 'top-right',
                  // autoClose: 3000
                });

                // Update UI
                setMenu(prevMenu => prevMenu.filter(item => item.id !== id));
              } catch (err) {
                toast.dismiss('delete-loading'); // Ensure loading toast is dismissed
                console.error('Error deleting menu item:', err);
                
                let errorMessage = 'Failed to delete menu item';
                if (axios.isAxiosError(err)) {
                  errorMessage = err.response?.data?.message || errorMessage;
                }

                toast.error(errorMessage, {
                  position: 'top-right'
                });
              }
            };
        

  return (
    <div className="page-inner">
      <div className="page-header">
        <h3 className="fw-bold mb-3">All Menu</h3>
        <ul className="breadcrumbs mb-3">
          <li className="nav-home">
            <a href="#"><i className="icon-home" /></a>
          </li>
          <li className="separator"><i className="icon-arrow-right" /></li>
          <li className="nav-item"><a href="#">Menu</a></li>
          <li className="separator"><i className="icon-arrow-right" /></li>
          <li className="nav-item"><a href="#">All Menu</a></li>
        </ul>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Menu Items</div>
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
                    <th>Description</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Available</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menu.length > 0 ? (
                    menu.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>RM{item.price.toFixed(2)}</td>
                        <td>
                          <span className={`badge ${
                            item.category === 'food' ? 'bg-success' : 
                            item.category === 'hall' ? 'bg-info' : 'bg-secondary'
                          }`}>
                            {item.category}
                          </span>
                        </td>
                        <td>
                          {item.available ? (
                            <span className="badge bg-success">Yes</span>
                          ) : (
                            <span className="badge bg-danger">No</span>
                          )}
                        </td>
                        <td>
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              width="50" 
                              className="img-thumbnail"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                              }}
                            />
                          )}
                        </td>
                        <td>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(item.id, item.name)}
                            disabled={deletingId === item.id}
                            title="Delete menu item"
                          >
                            {deletingId === item.id ? (
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                              <>
                                <i className="fas fa-trash-alt"></i> Delete
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center">
                        {error ? 'Failed to load menu' : 'No menu items found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};