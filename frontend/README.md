# BloggyTech Frontend

## Project Overview

BloggyTech is a modern React-based frontend application designed for a blogging platform. It provides an intuitive, responsive, and accessible user interface for users to register, login, view, create, and interact with blog posts and comments. The project leverages Redux Toolkit for state management, React Router v6 for navigation, and Tailwind CSS alongside Headless UI for clean, customizable UI components.

---

## Features

- User Authentication (Registration, Login, Logout)
- Protected Routes restricting access based on login state
- View public and private posts with details
- Create, update, and delete posts with image upload support
- Like, dislike, and clap posts
- Add and view comments on posts
- Responsive design for all device sizes
- Accessibility focused with keyboard navigations and ARIA attributes
- Loading states, error and success feedback components
- Default image fallback for posts and avatars
- Easy theming and customization with Tailwind CSS

---

## Folder Structure

```plaintext
src/
├── assets/          # Images, icons, and static assets
├── components/      # Reusable UI components grouped by feature
│   ├── Alert/       # Loading, success, and error message components
│   ├── AuthRoute/   # Route protection components
│   ├── Comments/    # Comment list and add comment features
│   ├── Homepage/    # Homepage layout and content
│   ├── Navbar/      # Private and public navigation bars
│   ├── Posts/       # Post CRUD and list components
│   └── Users/       # User login, registration, and profile components
├── redux/           # Redux slices and store setup
│   ├── slices/      # Feature-specific Redux slices (users, posts, comments, categories)
│   └── store/       # Redux store configuration
├── utils/           # Utility functions like reading time calculation
├── App.jsx          # Main App component with routing setup
├── main.jsx         # ReactDOM render and Redux provider setup
└── index.css        # Global Tailwind CSS styles
```

---

## Getting Started

### Prerequisites

- Node.js (version 14 or above)
- npm or yarn package manager

### Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/bloggytech-frontend.git
cd bloggytech-frontend
```

Install dependencies:

```bash
npm install
# or
yarn install
```

### Running the Development Server

Start the app in development mode:

```bash
npm start
# or
yarn start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## Usage

- **Register:** Sign up for a new account from the registration page.
- **Login:** Access your account using username and password.
- **Posts:** Browse, create, update, like, and comment on posts.
- **Profile:** View your profile and public profiles of other users.
- **Navigation:** Responsive navbar adapts based on authentication status.
- **Feedback:** Loading and error states inform users for a smooth experience.

---

## Technology Stack

- **React 18** — Frontend library for building UI components
- **Redux Toolkit** — Application state management
- **React Router v6** — Declarative routing with protected routes
- **Axios** — Promise based HTTP client for API communication
- **Tailwind CSS** — Utility-first CSS framework for styling
- **Headless UI** — Accessible UI primitives
- **Heroicons** — SVG icons for React components

---

## Contributing

Contributions welcome! Please follow the workflow:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to your branch (`git push origin feature/my-feature`)
5. Open a Pull Request here

Please ensure:

- Code is well-formatted and linted
- Components remain accessible and responsive
- Tests (if any) pass successfully

---

## Code Style and Guidelines

- Functional React components using hooks
- Redux state slices with `createSlice` and `createAsyncThunk`
- Tailwind CSS classes for styling — no inline styles
- Component names and folders follow feature-based structure
- Clear separation of presentational and container logic

---

## License

This frontend project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

Created and maintained by [Your Name](https://github.com/sunil624).  
For support or inquiries, please open an issue on the repository.

---

## Acknowledgements

- Tailwind CSS and Headless UI for flexible and accessible styling  
- Redux Toolkit for efficient state management  
- Inspiration from modern blogging platforms and UI patterns  
- Community feedback and contributions
