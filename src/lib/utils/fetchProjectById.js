import { db } from "@/lib/firebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";

/**
 * Fetches a specific project by its ID from Firestore
 * @param {string} projectId - The ID of the project to fetch
 * @returns {Promise<object|null>} - The project data or null if not found
 */
const fetchProjectById = async (projectId) => {
  try {
    if (!projectId) {
      console.error("Project ID is required");
      return null;
    }

    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      console.log(`No project found with ID: ${projectId}`);
      return null;
    }

    // Get the project data and add the ID
    const projectData = {
      id: projectSnap.id,
      ...projectSnap.data(),
    };

    console.log("Project fetched successfully:", projectData);

    // Transform any data if needed before returning
    // For example, convert timestamps to Date objects, etc.

    return projectData;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return null;
  }
};

export default fetchProjectById;
