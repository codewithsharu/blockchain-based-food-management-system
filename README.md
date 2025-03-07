# Food Management System

A web application that connects restaurants with charities to reduce food waste and help those in need. The system allows restaurant managers to post available food items and charity organizations to place orders for these items.

## Features

- User roles: Admin, Restaurant Manager, and Charity Manager
- Account approval system
- Food inventory management
- Order placement and tracking
- Real-time quantity updates
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd food-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
PORT=3000
```

4. Create an admin user in MongoDB:
```javascript
db.users.insertOne({
    email: "admin@example.com",
    password: "$2a$10$your_hashed_password", // Use bcrypt to hash the password
    role: "admin",
    approved: true,
    name: "Admin User"
})
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000`

## Usage

### Admin
- Login with admin credentials
- View and approve/reject user registrations
- Monitor system activity

### Restaurant Manager
1. Register as a restaurant manager
2. Wait for admin approval
3. Post available food items
4. Manage inventory
5. Accept/reject orders from charities

### Charity Manager
1. Register as a charity organization
2. Wait for admin approval
3. View available food items
4. Place orders
5. Track order status

## Technologies Used

- Node.js
- Express.js
- MongoDB
- EJS (Embedded JavaScript)
- Bootstrap 5
- Passport.js
- bcryptjs

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.