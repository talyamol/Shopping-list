# Shopping List - Full Shopping List System

## Project Description
An advanced shopping list system built with React, TypeScript, Material-UI, Node.js, and MongoDB.

## Project Structure

shopping-list/
├── client/ # React Frontend
│ ├── src/
│ │ ├── components/
│ │ ├── store/
│ │ ├── types/
│ │ ├── services/
│ │ └── ...
│ ├── package.json
│ └── ...
├── server/ # Node.js Backend
│ ├── src/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── controllers/
│ │ └── ...
│ ├── package.json
│ └── ...
└── README.md

## Installation and Running Instructions

### Prerequisites
- Node.js (version 18 or higher)  
- MongoDB (local or Atlas)  
- Git  

### Step 1: Clone the Project
git clone <repository-url>
cd shopping-list

### Step 2: Setup the Server
cd server
npm install

Create a .env file in the server directory:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shopping-list
#### Or for MongoDB Atlas:
 MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopping-list

Run the server:
npm run dev

### Step 3: Setup the Client
cd ../client
npm install
npm start
### Step 4: Open the Application
Server will run at: http://localhost:5000

Client will run at: http://localhost:3000

## Main Features
### Client Side
✅ React with TypeScript

✅ Material-UI with Responsive Design

✅ Redux Toolkit for state management

✅ Adding products with categories

✅ Total item count

✅ Saving orders to the server

### Server Side
✅ Node.js with TypeScript

✅ MongoDB with Mongoose (ORM)

✅ 5 predefined categories

✅ API for saving orders

### API Endpoints
Categories
GET /api/categories - Get all categories

Orders
POST /api/orders - Save a new order

GET /api/orders - Get all orders

## Data Models
### Category
{
  _id: string;
  name: string;
  createdAt: Date;
}
### Order
{
  _id: string;
  items: ShoppingItem[];
  totalItems: number;
  createdAt: Date;
}
### ShoppingItem
{
  name: string;
  category: string;
  quantity: number;
}

## Additional Features Implemented
Search and Filter: Ability to search products by name
Delete Items: Option to remove items from the list
Update Quantities: Change quantity with a click
Order History: View previous orders
Animations: Smooth transitions and Material-UI animations
Error Handling: User-friendly error messages
Loading States: Loading indicators

## Development Instructions
### Adding New Features
Update types in client/src/types/
Add actions in the Redux store
Update relevant components
Add API endpoints on the server

## Technical Notes
The app is mobile and desktop friendly
Uses modern React techniques (Hooks, Context)
Server configured with CORS for local development
Data saved in MongoDB with full validations
