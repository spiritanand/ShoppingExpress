# Shopping Express

Shopping Express, which is a web application built using Express.js, EJS, and MongoDB. The project aims to create an
e-commerce platform where users can browse and purchase products.

## Installation

To run the Shopping Express project locally, please ensure you have the following prerequisites:

- Node.js installed (version 16 or higher)

Follow these steps to set up and run the project:

1. Clone the repository:

   ```shell
   git clone https://github.com/your-username/shopping-express.git
    ```

2. Install the dependencies:

   ```shell
   cd shopping-express
   npm install
   ```

3. Set up the MongoDB connection string:

    - Create a `.env` file in the root directory of the project
    - Add the following line to the `.env` file:

      ```shell
      MONGODB_URI=<your-mongodb-connection-string>
      SECRET_KEY=<your-secret-key>
      ```

4. Start the application:

   ```shell
   npm start
   ```

# Routes

Shopping Express utilizes various routes to handle different functionalities. Below is an overview of the
available routes and their purposes:

## Public Routes

- `GET /`: Displays the home page and lists the available products.
- `GET /products/:productID`: Displays the detailed information of a specific product.

## Shop Routes

#### restricted to logged-in users

- `GET /cart`: Displays the user's shopping cart.
- `POST /cart`: Adds a product to the shopping cart.
- `POST /cart/add`: Adds a product to the shopping cart.
- `POST /cart/decrease`: Decreases the quantity of a product in the shopping cart.
- `POST /cart/remove`: Removes a product from the shopping cart.
- `POST /checkout`: Processes the user's order and completes the purchase.
- `GET /orders`: Displays the user's order history.
- `POST /cancel-order`: Cancels an existing order.

## Admin Routes

#### restricted to admin users

- `GET /products`: Displays the list of all products.
- `GET /add-product`: Displays the form to add a new product.
- `POST /add-product`: Adds a new product to the database.
- `GET /edit-product/:productID`: Displays the form to edit a specific product.
- `POST /edit-product`: Updates the details of a product.
- `POST /delete-product`: Deletes a product from the database.

## Authentication Routes

- `GET /signup`: Displays the signup form for new user registration.
- `POST /signup`: Processes the user's registration and creates a new account.
- `GET /login`: Displays the login form for existing users.
- `POST /login`: Authenticates the user's login credentials and logs them in.
- `POST /logout`: Logs out the currently logged-in user.
- `GET /reset-password`: Displays the form to reset the user's password (restricted to logged-in users).
- `POST /reset-password`: Processes the user's password reset request (restricted to logged-in users).
