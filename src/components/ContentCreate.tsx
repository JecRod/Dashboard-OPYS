


export default function ContentCreate() {
    return (
        <>
            <div className="container">
  <div className="page-inner">
    <div className="page-header">
      <h3 className="fw-bold mb-3">Create Menu</h3>
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
          <a href="#">Menu</a>
        </li>
        <li className="separator">
          <i className="icon-arrow-right" />
        </li>
        <li className="nav-item">
          <a href="#">Create Menu</a>
        </li>
      </ul>
    </div>
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Create Menu</div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 col-lg-4">
                <div className="form-group form-inline">
                  <label htmlFor="inlineinput" className="col-md-3 col-form-label">Name</label>
                  <div className="col-md-9 p-0">
                    <input type="text" className="form-control input-full" id="inlineinput" placeholder="Enter Name" />
                  </div>
                </div>
                <div className="form-group form-inline">
                  <label htmlFor="inlineinput" className="col-md-3 col-form-label">Description</label>
                  <div className="col-md-9 p-0">
                    <input type="text" className="form-control input-full" id="inlineinput" placeholder="Enter Description" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleFormControlFile1">Upload Picture</label>
                  <input type="file" className="form-control-file" id="exampleFormControlFile1" />
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="form-group">
                  <label htmlFor="inlineinput" className="col-md-3 col-form-label">price</label>
                  <div className="input-group mb-3">
                    <span className="input-group-text">RM</span>
                    <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)" />
                    <span className="input-group-text">.00</span>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="defaultSelect">Category</label>
                  <select className="form-select form-control" id="defaultSelect">
                    <option>Burger</option>
                    <option>Drinks</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="defaultSelect">Available</label>
                  <select className="form-select form-control" id="defaultSelect">
                    <option>available</option>
                    <option>not available</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button className="btn btn-success">Submit</button>
            <button className="btn btn-danger">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

        </>
    );
}