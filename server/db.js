const mysql = require("mysql");
const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/imgupload", express.static("imgupload"));

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test",
});

con.connect(function(error) {
    if (error) throw error;
    console.log("Connected to the database");
});

// Storage settings for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "imgupload");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// API to add products
app.post('/api/Products', upload.single('itemImage'), (req, res) => {
    const { itemName, itemCategory, purchaseDate, serialNumber } = req.body;
    const itemImage = req.file ? req.file.filename : null;

    const query = "INSERT INTO products (itemName, itemCategory, purchaseDate, serialNumber, itemImage) VALUES (?,?,?,?,?)";
    con.query(query, [itemName, itemCategory, purchaseDate, serialNumber, itemImage], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error inserting data");
        } else {
            res.send("Data inserted successfully");
        }
    });
});

// API to fetch all products
app.get('/api/getProducts', (req, res) => {
    const query = "SELECT * FROM products";
    con.query(query, (err, result) => {
        if (err) {
            res.status(500).send("Error fetching products");
        } else {
            res.send(result);
        }
    });
});

// API to fetch all categories
app.get('/api/getCategories', (req, res) => {
    const query = "SELECT * FROM itemCategories";
    con.query(query, (err, result) => {
        if (err) {
            res.status(500).send("Error fetching categories");
        } else {
            res.send(result);
        }
    });
});

// API to add a new category with duplicate check
app.post('/api/addCategory', (req, res) => {
    const { categoryName } = req.body;

    // Check if the category already exists
    const checkQuery = "SELECT * FROM itemCategories WHERE categoryName = ?";
    con.query(checkQuery, [categoryName], (err, result) => {
        if (err) {
            return res.status(500).send("Error checking for duplicate category");
        }

        // If category exists, return a message
        if (result.length > 0) {
            return res.status(400).send("Category already exists");
        }

        // If category doesn't exist, insert the new one
        const query = "INSERT INTO itemCategories (categoryName) VALUES (?)";
        con.query(query, [categoryName], (err, result) => {
            if (err) {
                res.status(500).send("Error adding category");
            } else {
                res.send("Category added successfully");
            }
        });
    });
});

// API to delete a product by ID
app.delete('/api/deleteProduct/:id', (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM products WHERE id = ?";
    con.query(query, [id], (err, result) => {
        if (err) {
            console.log("Error deleting product:", err);
            res.status(500).send("Error deleting product");
        } else if (result.affectedRows === 0) {
            res.status(404).send("Product not found");
        } else {
            res.send("Product deleted successfully");
        }
    });
});

// API for login
app.post("/api/login", (req, res) => {
    const { email, pass } = req.body;

    const query = "SELECT * FROM proregister WHERE email = ? AND pass = ?";
    con.query(query, [email, pass], (err, result) => {
        if (err) {
            res.status(500).send("Error checking login");
        } else if (result.length > 0) {
            res.send(result);
        } else {
            res.send({ message: "Wrong Email or Password" });
        }
    });
});

// API to register a user
app.post('/api/Register', (req, res) => {
    const { name, email, phone, pass } = req.body;

    const query = "INSERT INTO proregister (name, email, phone, pass) VALUES (?,?,?,?)";
    con.query(query, [name, email, phone, pass], (err, result) => {
        if (err) {
            res.status(500).send("Error inserting data");
        } else {
            res.send("Data inserted successfully");
        }
    });
});

// API to add maintenance services
app.post('/api/Services', (req, res) => {
    const { serviceType, serviceDate, costOfService, relatedItem } = req.body;

    const query = "INSERT INTO maintenance (serviceType, serviceDate, costOfService, relatedItem) VALUES (?,?,?,?)";
    con.query(query, [serviceType, serviceDate, costOfService, relatedItem], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error inserting maintenance data");
        } else {
            res.send("Maintenance record added successfully");
        }
    });
});

// API to fetch all services
app.get('/api/getServices', (req, res) => {
    const query = "SELECT * FROM maintenance";
    con.query(query, (err, result) => {
        if (err) {
            res.status(500).send("Error fetching maintenance records");
        } else {
            res.send(result);
        }
    });
});

// ==================== Service Types API ====================

// API to fetch all service types
app.get('/api/getServiceTypes', (req, res) => {
    const query = "SELECT * FROM service_types";
    con.query(query, (err, result) => {
        if (err) {
            res.status(500).send("Error fetching service types");
        } else {
            res.send(result);
        }
    });
});

// API to add a new service type
app.post('/api/addServiceType', (req, res) => {
    const { serviceTypeName } = req.body;

    const checkQuery = "SELECT * FROM service_types WHERE name = ?";
    con.query(checkQuery, [serviceTypeName], (err, result) => {
        if (err) {
            return res.status(500).send("Error checking for duplicate service type");
        }

        if (result.length > 0) {
            return res.status(400).send("Service type already exists");
        }

        const query = "INSERT INTO service_types (name) VALUES (?)";
        con.query(query, [serviceTypeName], (err, result) => {
            if (err) {
                res.status(500).send("Error adding service type");
            } else {
                res.send("Service type added successfully");
            }
        });
    });
});

const port = 1337;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});