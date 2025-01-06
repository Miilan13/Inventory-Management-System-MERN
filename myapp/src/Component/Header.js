import React from "react";

function Header() {
    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem('mydata'));

    function logout() {
        localStorage.removeItem('mydata');
        window.location = "/";
    }

    return (
        <header className="p-3 bg-dark text-white">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                        <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap">
                            <use xlinkHref="#bootstrap"></use>
                        </svg>
                    </a>
                    <h1 className="fs-4">Webwar</h1>
                    <div className="ms-auto text-end">
                        {
                            userData == null ? (
                                <div className="d-lg-block d-none">
                                    <a href="/Register" className="btn btn-style btn-secondary">Register</a>
                                </div>
                            ) : (
                                <div className="d-lg-block d-none">
                                    <span className="me-5">Welcome, {userData.sname}!</span>
                                    <button type="button" onClick={logout} className="btn btn-style btn-secondary">Log Out</button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
