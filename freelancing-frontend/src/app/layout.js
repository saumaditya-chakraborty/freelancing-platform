import Navbar from "../components/navbar";
import { AuthProvider } from "../context/AuthContext";

import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="container">{children}</main>
        </AuthProvider>
    
      </body>
    </html>
  );
}
