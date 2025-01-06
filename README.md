# Webwar - Inventory Management Portal

Webwar is a MERN stack-based portal that allows users to register, log in, and manage their personal inventory and related maintenance tasks. The application provides an intuitive interface for handling items and their upkeep with a user-friendly approach.

## Features

### User Authentication
- Users can **register** and **log in** to their accounts.
- Passwords and email inputs are validated with error messages for incorrect formats or missing data.

### Inventory Management
- Add, view, and delete inventory items with detailed information, such as:
  - **Product Name**
  - **Category** (predefined or user-defined)
  - **Purchase Date** (only present and past dates allowed)
  - **Serial Number**
  - **Product Image**
- View added items in a list format for easy management.

### Maintenance Tracking
- Log maintenance tasks linked to specific inventory items.
- Enter maintenance details, such as:
  - **Service Type** (predefined or user-defined)
  - **Date of Service** (only present and future dates allowed)
  - **Cost of Service**
  - **Link to Item** (dropdown selection from existing inventory)

### Responsive Navigation
- **Home Page**: Displays a personalized greeting and quick access to inventory management.
- **Logout**: Securely ends the session and redirects to the login page.

## Technology Stack

The application is built using the following technologies:

### Frontend
- **React.js**: For building the user interface with reusable components.

### Backend
- **Node.js**: As the runtime environment for backend operations.
- **Express.js**: For creating RESTful APIs.

### Database
- **MySQL**: For storing and managing user and inventory data.

## Screenshots

### Login Page
- Users can log in using their registered email and password.
- Error messages are displayed for invalid credentials or missing fields.

### Home Page
- Displays a personalized welcome message.
- Features buttons for navigating inventory and maintenance sections.

### Inventory Management
- Add items with detailed attributes.
- View all items in a list with options to delete them.

### Maintenance Management
- Add maintenance tasks and link them to existing items.
- View logged maintenance tasks in a detailed list.

Clone the repository:
   ```bash
   git clone https://github.com/your-username/webwar.git
