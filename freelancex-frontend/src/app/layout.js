import { Orbitron } from "next/font/google";
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
        {children}
      </body>
    </html>
  );
}