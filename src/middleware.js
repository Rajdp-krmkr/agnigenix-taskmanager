import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

console.log("Middleware is running"); // Log when middleware is triggered

export async function middleware(req) {
  console.log("Middleware is running"); // Log when middleware is triggered

  const { pathname } = req.nextUrl; // Get the full pathname
  console.log("Requested pathname:", pathname); // Log the requested pathname

  const urlSegments = pathname.split("/"); // Split the pathname by "/"
  const username = urlSegments[urlSegments.length - 1]; // Get the last segment as username
  console.log("Extracted username:", username); // Log the extracted username

  // Check if the username exists in the database
  if (
    username &&
    username !== "sign-up" &&
    username !== "log-in" &&
    username !== "forgot-password" &&
    username !== "favicon.ico" &&
    username !== "manifest.json"
  ) {
    const docRef = doc(db, "users", username); // Assuming 'users' is your collection and username matches UID
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log(
        `User ${username} not found in Firestore, redirecting to sign-up.`
      ); // Log if user is not found
      return NextResponse.redirect(new URL("/sign-up", req.url)); // Redirect to sign-up page
    } else {
      console.log(`User ${username} found in Firestore, allowing access.`); // Log if user is found
    }
  }
  
  
  return NextResponse.next(); // Proceed to the requested route if validation is successful
}

// Configure the matcher for your routes
export const config = {
  matcher: ["/:path*"], // Apply middleware to all paths
};
