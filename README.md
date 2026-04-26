# E-commerce (Quinto Store)

## General Information
**Project Name**: Quinto Store - E-commerce  
**Author**: Daniela Quinto Rios


---

## Demo Credentials
To facilitate the project review, you can use the following test user:
- **Email**: `testuser@quinto.com`
- **Password**: `TestUser2026!`

---

## About this project
E-commerce web application built using **React**, applying key concepts such as componentization, global state management, API consumption, and SPA navigation.

## Implemented Requirements
### Core Functionalities
- **Registration and Session**: Implemented with Firebase Auth and Firestore persistence.
- **Product Gallery**: Real-time consumption from FakeStoreAPI.
- **Pagination**: Page-based navigation system in the catalog (8 products per view).
- **Real-Time Search**: Instant filtering by name from the Header.
- **Shopping Cart**: Full management of products, quantities, and persistence with Zustand.
- **Checkout**: Purchase preview and management of multiple shipping addresses.
- **Simulated Purchase**: Order registration in the Firestore `orders` collection (Cash on Delivery).

### Architecture (Atomic Design)
The project follows a modular structure based on Atomic Design for maximum scalability:
- **src/components/atoms**: Base components (Buttons, Inputs, Titles).
- **src/components/molecules**: Combinations of atoms (ProductCard, SearchBar).
- **src/components/organisms**: Complex components (Header, Forms).
- **src/components/templates**: Page structures (Main Layout).
- **src/pages**: Assembled application views.

#---

## Data Model (Firestore)
The application uses a NoSQL structure in Cloud Firestore with the following main collections:

### `users` Collection
- `name`: Full name of the user.
- `email`: Registration email.
- `cellphone`: Contact number.
- `addresses`: Array of strings containing multiple shipping addresses.
- `createdAt`: Registration timestamp.

### `orders` Collection
- `userId`: Reference to the user who placed the order.
- `customerName`: Cached name of the customer.
- `shippingAddress`: Selected address for this specific order.
- `items`: Array of products (id, name, price, quantity).
- `total`: Final order price.
- `paymentMethod`: "Cash on Delivery".
- `status`: Order state (e.g., "Confirmed").
- `createdAt`: Purchase timestamp.

---

## Technologies and Tools
- **React.js** (Vite)
- **Zustand**: Global state management (User, Cart, Products).
- **React Router Dom**: SPA Navigation.
- **Tailwind CSS v4**: Premium and responsive design.
- **Axios**: HTTP requests.
- **Firebase**: Authentication and Database (NoSQL).
- **API Colombia**: Integration for geographic address validation.

---

## Installation and Use
1. **Clone the repository**
   ```bash
   git clone https://github.com/daniquinto/Mystore.git
   cd reto_fullstack
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run in development**
   ```bash
   npm run dev
   ```

---

## Troubleshooting

### 1. Error: auth/network-request-failed
Occurs when the browser blocks the connection to Firebase.
- **Solution**: Disable ad blockers (AdBlock), VPNs, or tracking protections (common in browsers like Opera).

### 2. Error: Missing or insufficient permissions
Occurs if Firestore rules are not configured to allow writing.
- **Solution**: Ensure that `users` and `orders` rules allow access to authenticated users.

---

## Quality Criteria
- **Structure**: Clean and modular organization.
- **State**: Efficient use of Zustand to avoid "prop drilling".
- **UI/UX**: Premium aesthetics with a personalized Teal color palette.
- **Responsive**: Total adaptability to any device.

---
*Project developed for the Fullstack Challenge*
