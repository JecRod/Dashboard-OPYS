

export default function ContentPayment() {
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
                        <div className="card-title">Table Head States</div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                        <table className="table table-head-bg-success">
                            <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">No Fon</th>
                                <th scope="col">email</th>
                                <th scope="col">Order</th>
                                <th scope="col">Price</th>
                                <th scope="col">Transaction id</th>
                                <th scope="col">Date</th>
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