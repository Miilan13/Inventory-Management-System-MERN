import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function Home() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [file, setFile] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // State for categories
    const [newCategory, setNewCategory] = useState(""); // State for new category input

    // Fetch products and categories on component mount
    useEffect(() => {
        Axios.get('http://localhost:1337/api/getProducts')
            .then((response) => setProducts(response.data))
            .catch((error) => console.error("Error fetching products:", error));

        Axios.get('http://localhost:1337/api/getCategories')
            .then((response) => setCategories(response.data))
            .catch((error) => console.error("Error fetching categories:", error));
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    // Add new product
    const Adddata = (data) => {
        let formData = new FormData();
        formData.append('itemName', data.itemName);
        formData.append('itemCategory', data.itemCategory);
        formData.append('purchaseDate', data.purchaseDate);
        formData.append('serialNumber', data.serialNumber);
        formData.append('itemImage', file);

        Axios.post('http://localhost:1337/api/Products', formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }).then((response) => {
            alert("Data inserted successfully");
            setProducts([...products, data]);
        }).catch((error) => {
            console.error("There was an error uploading the form data!", error);
        });
    };

    // Delete product by ID
    const deleteProduct = (id) => {
        Axios.delete(`http://localhost:1337/api/deleteProduct/${id}`)
            .then((response) => {
                alert("Product deleted successfully");
                setProducts(products.filter(product => product.id !== id));
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
            });
    };

    // Add a new category with duplicate validation
    const addCategory = () => {
        if (newCategory) {
            Axios.post('http://localhost:1337/api/addCategory', { categoryName: newCategory })
                .then(() => {
                    alert("Category added successfully");
                    setCategories([...categories, { categoryName: newCategory }]);
                    setNewCategory(""); // Clear input field after adding
                })
                .catch((error) => {
                    if (error.response && error.response.status === 400) {
                        alert("Category already exists");
                    } else {
                        console.error("Error adding category:", error);
                    }
                });
        }
    };


    return (
        <>
            <div className="container mt-4">
                <div className="card">
                    <div className="card-header">
                        <h4>
                            Product Inventory System
                            <Link to="/Maintenance" className="btn btn-warning float-end">
                                Maintenance
                            </Link>
                        </h4>
                    </div>
                    <div className="card-body">
                        <form id="productForm" onSubmit={handleSubmit(Adddata)}>
                            <div className="row align-items-end">
                                <div className="col-md-2 mb-3">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        {...register("itemName", { required: true })}
                                    />
                                    {errors.itemName && (
                                        <small className="text-danger">Product Name is required</small>
                                    )}
                                </div>

                                <div className="col-md-2 mb-3">
                                    <label>Category</label>
                                    <select className="form-control" {...register("itemCategory", { required: true })}>
                                        <option value="">Select Category</option>
                                        {categories.map((category, index) => (
                                            <option key={index} value={category.categoryName}>
                                                {category.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.itemCategory && (
                                        <small className="text-danger">Product Category is required</small>
                                    )}
                                </div>

                                <div className="col-md-2 mb-3">
                                    <label>Purchase Date</label>
                                    <input
                                        type="date"
                                        id="purchaseDate"
                                        name="purchaseDate"
                                        className="form-control"
                                        max={new Date().toISOString().split("T")[0]} // Set max to today's date
                                        {...register('purchaseDate', { required: "Purchase Date is Mandatory" })}
                                    />
                                    {errors.purchaseDate && (
                                        <small className="text-danger">Purchase Date is required</small>
                                    )}
                                </div>

                                <div className="col-md-2 mb-3">
                                    <label htmlFor="serialNumber">Serial Number</label>
                                    <input
                                        type="text"
                                        name="serialNumber"
                                        id="serialNumber"
                                        className="form-control"
                                        placeholder="Enter Serial Number"
                                        maxLength={8} // Set maxLength to 8
                                        {...register('serialNumber', {
                                            required: "Serial Number is Mandatory",
                                            validate: {
                                                length: value => value.length === 8 || "Serial Number must be exactly 8 digits",
                                                digits: value => /^\d{8}$/.test(value) || "Serial Number must be 8 digits only",
                                            }
                                        })}
                                    />
                                    {errors.serialNumber && (
                                        <span className="error" style={{ color: "red" }}>
                                            {errors.serialNumber.message}
                                        </span>
                                    )}
                                </div>

                                <div className="col-md-2 mb-3">
                                    <label>Upload Image</label>
                                    <input type="file" className="form-control" onChange={handleFileChange} />
                                </div>

                                <div className="col-md-2 mb-3">
                                    <button type="submit" className="btn btn-primary">Save</button>
                                </div>
                            </div>
                        </form>

                        <div className="mt-3">
                            <h5>Add a New Category</h5>
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={newCategory}
                                    className="form-control"
                                    placeholder="Enter new category"
                                    onChange={(e) => setNewCategory(e.target.value)}
                                />
                                <button className="btn btn-success" onClick={addCategory}>Add Category</button>
                            </div>
                        </div>

                        <h5 className="mt-4">Product List</h5>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Product Name</th>
                                    <th>Category</th>
                                    <th>Purchase Date</th>
                                    <th>Serial Number</th>
                                    <th>Image</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.itemName}</td>
                                        <td>{product.itemCategory}</td>
                                        <td>{product.purchaseDate}</td>
                                        <td>{product.serialNumber}</td>
                                        <td>
                                            {product.itemImage && (
                                                <img
                                                    src={`http://localhost:1337/imgupload/${product.itemImage}`}
                                                    alt={product.itemName}
                                                    width="50"
                                                />
                                            )}
                                        </td>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => deleteProduct(product.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
