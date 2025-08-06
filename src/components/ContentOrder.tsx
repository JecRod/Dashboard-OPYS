


export default function ContentOrder() {
    return (
        <>
            <div className="page-inner">
  <div className="page-inner">
    <div className="page-header">
      <h3 className="fw-bold mb-3">All Order</h3>
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
          <a href="#">Order</a>
        </li>
        <li className="separator">
          <i className="icon-arrow-right" />
        </li>
        <li className="nav-item">
          <a href="#">All Order</a>
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
                <th scope="col">id</th>
                <th scope="col">name</th>
                <th scope="col">Order</th>
                <th scope="col">Quantity</th>
                <th scope="col">Order type</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Nasi Ayam</td>
                <td>2</td>
                <td>Dinein</td>
                <td>
                  <div className="btn-group dropend">
                    <button type="button" className="btn btn-success btn-round dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Process
                    </button>
                    <ul className="dropdown-menu" role="menu">
                      <li>
                        <a className="dropdown-item" href="#">OnGoing</a>
                        <div className="dropdown-divider" />
                        <a className="dropdown-item" href="#">Cancel</a>
                      </li>
                    </ul>
                  </div>
                </td>
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