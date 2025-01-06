import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // Use useNavigate for routing

function Maintenance() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [newServiceType, setNewServiceType] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate

    // Define your service types here
    const serviceTypes = ["Repair", "Cleaning", "Maintenance"]; // Example service types

    useEffect(() => {
        // Fetch products
        Axios.get('http://localhost:1337/api/getProducts')
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });

        // Fetch services
        Axios.get('http://localhost:1337/api/getServices')
            .then((response) => {
                setServices(response.data);
            })
            .catch((error) => {
                console.error("Error fetching services:", error);
            });
    }, []);

    const submitServiceData = (data) => {
        Axios.post('http://localhost:1337/api/Services', data)
            .then((response) => {
                alert("Service record added successfully");
                setServices([...services, data]);
            })
            .catch((error) => {
                console.error("There was an error adding the service record!", error);
            });
    };

    const addServiceType = () => {
        if (newServiceType.trim()) {
            Axios.post('http://localhost:1337/api/addCategory', { categoryName: newServiceType })
                .then((response) => {
                    alert("Service type added successfully");
                    setNewServiceType("");
                })
                .catch((error) => {
                    alert("Error adding service type: " + error.response.data);
                });
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4>Maintenance Management</h4>
                    <button className="btn btn-primary" onClick={() => navigate("/Home")}>
                        Home
                    </button>
                </div>
                <div className="card-body">
                    <div className="mb-4">
                        <h5>Add New Service Type</h5>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                value={newServiceType}
                                onChange={(e) => setNewServiceType(e.target.value)}
                                placeholder="Enter new service type"
                            />
                            <button className="btn btn-success" onClick={addServiceType}>
                                Add
                            </button>
                        </div>
                    </div>

                    <form id="serviceForm" onSubmit={handleSubmit(submitServiceData)}>
                        <div className="row align-items-end">
                            <div className="col-md-3 mb-3">
                                <label htmlFor="serviceType">Service Type</label>
                                <select
                                    id="serviceType"
                                    name="serviceType"
                                    className="form-control"
                                    {...register('serviceType', { required: "Service Type is mandatory" })}
                                >
                                    <option value="">Select Service Type</option>
                                    {/* Populate service types */}
                                    {serviceTypes.map((type, index) => (
                                        <option key={index} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                {errors.serviceType && <span style={{ color: "red" }}>{errors.serviceType.message}</span>}
                            </div>

                            <div className="col-md-3 mb-3">
                                <label htmlFor="serviceDate">Date of Service</label>
                                <input
                                    type="date"
                                    id="serviceDate"
                                    name="serviceDate"
                                    className="form-control"
                                    {...register('serviceDate', { required: "Date of Service is mandatory", max: new Date().toISOString().split("T")[0] })}
                                />
                                {errors.serviceDate && <span style={{ color: "red" }}>{errors.serviceDate.message}</span>}
                            </div>

                            <div className="col-md-3 mb-3">
                                <label htmlFor="costOfService">Cost of Service</label>
                                <input
                                    type="number"
                                    id="costOfService"
                                    name="costOfService"
                                    className="form-control"
                                    placeholder="Enter Cost of Service"
                                    {...register('costOfService', { required: "Cost of Service is mandatory" })}
                                />
                                {errors.costOfService && <span style={{ color: "red" }}>{errors.costOfService.message}</span>}
                            </div>

                            <div className="col-md-3 mb-3">
                                <label htmlFor="relatedItem">Link to Item</label>
                                <select
                                    id="relatedItem"
                                    name="relatedItem"
                                    className="form-control"
                                    {...register('relatedItem', { required: "You must link this service to an item" })}
                                >
                                    <option value="">Select Item</option>
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.itemName} (Serial: {product.serialNumber})
                                        </option>
                                    ))}
                                </select>
                                {errors.relatedItem && <span style={{ color: "red" }}>{errors.relatedItem.message}</span>}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-3 offset-md-9">
                                <button type="submit" className="btn btn-info text-white w-100 mt-3">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="mt-4">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>SR.NO.</th>
                                    <th>Service Type</th>
                                    <th>Date of Service</th>
                                    <th>Cost</th>
                                    <th>Linked Item</th>
                                </tr>
                            </thead>
                            <tbody id="serviceTableBody">
                                {services.map((service, index) => (
                                    <tr key={service.id}>
                                        <td>{index + 1}</td>
                                        <td>{service.serviceType}</td>
                                        <td>{service.serviceDate}</td>
                                        <td>₹{service.costOfService}</td>
                                        <td>{service.relatedItem}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Maintenance;
