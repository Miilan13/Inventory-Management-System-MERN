import React, { useState } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const handleLogin = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Validate inputs before sending request
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Exit if there are validation errors
        }

        // Proceed with login request
        Axios.post('http://localhost:1337/api/login', {
            email: email,
            pass: password,
        })
            .then((response) => {
                if (response.data.message) {
                    Swal.fire({
                        title: "Incorrect",
                        text: response.data.message,
                        icon: "error",
                        confirmButtonText: "Okay",
                    });
                } else {
                    // Store user data in localStorage
                    let user = { sname: response.data[0].name, uemail: email };
                    localStorage.setItem('mydata', JSON.stringify(user));

                    Swal.fire({
                        title: "Correct",
                        text: "Welcome",
                        icon: "success",
                        confirmButtonText: "Okay",
                    }).then(() => {
                        window.location = "/Home"; // Redirect to home after login
                    });
                }
            })
            .catch((error) => {
                console.error("Login error:", error);
                Swal.fire({
                    title: "Error",
                    text: "An error occurred while logging in.",
                    icon: "error",
                    confirmButtonText: "Okay",
                });
            });
    };

    const validate = () => {
        let errors = {};
        if (!email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Email address is invalid";
        }
        if (!password) {
            errors.password = "Password is required";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
        return errors;
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ width: "400px" }}>
                <h3 className="card-title text-center">Login</h3>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email address</label>
                        <input
                            type="email"
                            id="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors({ ...errors, email: "" }); // Clear error message on change
                            }}
                        />
                        {errors.email && (
                            <div className="invalid-feedback">{errors.email}</div>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            id="pass"
                            type="password"
                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors({ ...errors, password: "" }); // Clear error message on change
                            }}
                        />
                        {errors.password && (
                            <div className="invalid-feedback">{errors.password}</div>
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mt-3">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
