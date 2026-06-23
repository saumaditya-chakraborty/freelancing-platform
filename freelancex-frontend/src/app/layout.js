import { Orbitron } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
});

export const metadata = {
  title: "FreelanceX",
  description: "Future of Freelancing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={orbitron.className}>
        <GoogleOAuthProvider
          clientId="1022030442847-k1lpoqmt1mf8imkfenom99teannedlim.apps.googleusercontent.com"
        >
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}