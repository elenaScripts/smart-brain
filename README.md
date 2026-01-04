# Smart Brain - Face Detection Application

Smart Brain is a web application that uses artificial intelligence to detect faces in images. Users can register, sign in, and submit image URLs to detect faces, with their detection count tracked and displayed.

## 🎯 What This Project Does

Smart Brain is an interactive face detection application that:

- **Detects Faces in Images**: Users can paste an image URL, and the application uses the Clarifai Face Detection API to identify and highlight faces in the image with bounding boxes
- **User Authentication**: Secure sign-in and registration system with password hashing
- **Entry Tracking**: Tracks and displays how many faces each user has detected
- **Modern UI**: Features an animated particles background and a clean, responsive interface

## 🚀 Features

- **Face Detection**: Upload an image URL and get real-time face detection with visual bounding boxes
- **User Accounts**: Create an account, sign in, and maintain your detection history
- **Entry Counter**: See how many faces you've detected across all your submissions
- **Interactive Background**: Animated particles that respond to mouse interactions
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

### Frontend
- **React** - UI framework
- **Tachyons** - CSS utility framework
- **Particles.js** - Animated background effects
- **React Tilt** - 3D tilt effects for logo

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **Knex.js** - SQL query builder
- **bcrypt** - Password hashing
- **Clarifai API** - Face detection AI service

## 📁 Project Structure

```
my-app/
├── public/
│   ├── index.html              # HTML template
│   ├── favicon.ico             # App icon
│   ├── manifest.json           # Web app manifest
│   └── robots.txt              # SEO robots file
├── src/
│   ├── components/
│   │   ├── FaceRecognition/    # Displays image with face detection boxes
│   │   │   ├── FaceRecognition.js
│   │   │   └── FaceRecognition.css
│   │   ├── ImageLinkForm/       # Input form for image URLs
│   │   │   ├── ImageLinkForm.js
│   │   │   └── ImageLinkForm.css
│   │   ├── Logo/                # Animated brain logo
│   │   │   ├── Logo.js
│   │   │   ├── Logo.css
│   │   │   └── brain.png
│   │   ├── Navigation/          # Navigation bar with sign in/out
│   │   │   └── Navigation.js
│   │   ├── Rank/                # Displays user name and entry count
│   │   │   └── Rank.js
│   │   ├── Register/            # User registration form
│   │   │   └── Register.js
│   │   └── SignIn/              # User sign-in form
│   │       ├── SignIn.js
│   │       └── SignIn.css
│   ├── App.js                   # Main application component
│   ├── App.css                  # Main app styles
│   ├── App.test.js              # App tests
│   ├── index.js                 # Application entry point
│   ├── index.css                # Global styles
│   ├── reportWebVitals.js      # Performance monitoring
│   └── setupTests.js            # Test configuration
├── package.json                 # Dependencies and scripts
├── render.yaml                  # Render deployment configuration
└── README.md                    # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database (local or remote)
- Clarifai API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/elenaScripts/smart-brain.git
   cd smart-brain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   - Create a PostgreSQL database
   - Run the SQL schema to create `users` and `login` tables
   - Update the database connection in `server.js` or set `DATABASE_URL` environment variable

4. **Configure environment variables**
   - Set `DATABASE_URL` for PostgreSQL connection
   - Add your Clarifai API key in `controllers/image.js`

5. **Start the development servers**

   **Option 1: Run both frontend and backend together**
   ```bash
   npm run dev
   ```

   **Option 2: Run separately**
   ```bash
   # Terminal 1 - Backend server
   npm run server

   # Terminal 2 - Frontend
   npm start
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📝 Available Scripts

- `npm start` - Starts the React development server on port 3000
- `npm run server` - Starts the Express backend server on port 3001
- `npm run dev` - Runs both frontend and backend concurrently
- `npm run build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm run start:prod` - Serves the production build

## 🌐 Deployment

The application is deployed on Render:

- **Frontend**: Configured to build and serve the React app
- **Backend**: https://smart-brain-api-8l6r.onrender.com

### Build Configuration

For Render deployment, ensure:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`
- **Environment Variables**: Set `DATABASE_URL` for PostgreSQL connection

## 🔐 API Endpoints

- `POST /signin` - User authentication
- `POST /register` - User registration
- `POST /imageurl` - Face detection API call
- `GET /profile/:id` - Get user profile
- `PUT /image` - Update user entry count

## 🎨 How It Works

1. **User Registration/Sign In**: Users create an account or sign in with existing credentials
2. **Image Submission**: Users paste an image URL into the input field
3. **Face Detection**: The image URL is sent to the backend, which calls the Clarifai API
4. **Visual Feedback**: Detected faces are highlighted with bounding boxes on the image
5. **Entry Tracking**: Each successful detection increments the user's entry count

## 🔒 Security Features

- Password hashing with bcrypt
- Secure API key storage (server-side only)
- CORS configuration for API security
- Input validation and error handling

## 📦 Dependencies

Key dependencies include:
- `react` & `react-dom` - React framework
- `express` - Backend framework
- `knex` & `pg` - Database tools
- `bcrypt` - Password hashing
- `cors` - Cross-origin resource sharing
- `@tsparticles/react` - Particle animations

---

**Note**: This application requires a valid Clarifai API key with sufficient credits to function properly.
