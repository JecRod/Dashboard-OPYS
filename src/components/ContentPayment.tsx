import { useEffect, useState } from "react";
import { API_CONFIG } from "../Api-Config";
import axios from "axios";

interface Payment {
  id: number;
  name: string;
  email: string;
  total_price: number;
  trasaction_id: string;
  date: string;
  payment_method: string;
  status: string;
}

export default function ContentPayment() {
    const [payment, setPayment] = useState<Payment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setloading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                setloading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await axios.get(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT.PAYMENT}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
        
            let paymentData = response.data;
        
            if (response.data?.data) {
                paymentData = response.data.data;
            } else if (response.data?.payments) {
                paymentData = response.data.payments;
            }
        
            if (!Array.isArray(paymentData)) {
                throw new Error('Invalid data format received from server');
            }
        
            setPayment(paymentData);
            } catch (err: unknown) {
                const errorMessage = axios.isAxiosError(err)
                ? err.response?.data?.message || err.message
                : err instanceof Error
                ? err.message
                : 'Unknown error occurred';
                
                console.error('Error fetching menu:', err);
                setError(`Failed to load menu: ${errorMessage}`);
            } finally {
                setloading(false);
            }
            
        }
        fetchPayment();
    })
    return (
        <>
            <div className="page-inner">
                <div className="page-inner">
                    <div className="page-header">
                    <h3 className="fw-bold mb-3">All Payment</h3>
                    <ul className="breadcrumbs mb-3">
                        <li className="nav-home">
                        <a href="#">
                            <i className="icon-home" />
                        </a>
                        </li>
                        <li className="separator">
                        <i className="icon-arrow-right" />
                        </li>
                        <li className="nav-item">
                        <a href="#">Payment</a>
                        </li>
                        <li className="separator">
                        <i className="icon-arrow-right" />
                        </li>
                        <li className="nav-item">
                        <a href="#">All Payment</a>
                        </li>
                    </ul>
                    </div>
                    <div className="card">
                    <div className="card-header">
                        <div className="card-title">Payment List</div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                        <table className="table table-head-bg-success">
                            <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Name</th>
                                <th scope="col">No Fon</th>
                                <th scope="col">email</th>
                                <th scope="col">Price</th>
                                <th scope="col">Transaction id</th>
                                <th scope="col">Receipt</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Nasi Ayam</td>
                                <td>2</td>
                                <td />
                                <td>Process</td>
                                <td>a</td>
                                <td><button className="badge badge-black">Receipt</button></td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                                <td>@mdo</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td colSpan={2}>Larry the Bird</td>
                                <td>@twitter</td>
                                <td>@mdo</td>
                                <td>@mdo</td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                    </div>
                </div>
            </div>

        </>
    );
}