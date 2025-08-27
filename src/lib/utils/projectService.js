import { db } from "@/lib/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";

/**
 * Fetches all projects or projects matching certain criteria
 * @param {Object} options - Options for filtering projects
 * @param {string} options.userId - Optional user ID to fetch projects for a specific user
 * @param {string} options.workspaceId - Optional workspace ID to fetch projects for a specific workspace
 * @param {number} options.limit - Optional limit for the number of projects to fetch
 * @returns {Promise<Array>} - Array of project objects
 */
export const fetchProjects = async (options = {}) => {
  try {
    const projectsCollection = collection(db, "projects");
    let projectQuery = projectsCollection;

    // Build query based on options
    if (options.userId) {
      projectQuery = query(
        projectsCollection,
        where("members", "array-contains", options.userId)
      );
    }

    if (options.workspaceId) {
      // If we already have a query with userId filter
      if (options.userId) {
        projectQuery = query(
          projectQuery,
          where("workspaceId", "==", options.workspaceId)
        );
      } else {
        projectQuery = query(
          projectsCollection,
          where("workspaceId", "==", options.workspaceId)
        );
      }
    }

    if (options.limit) {
      projectQuery = query(projectQuery, limit(options.limit));
    }

    // If no query has been set, use the collection reference
    if (!projectQuery) {
      projectQuery = projectsCollection;
    }

    const projectsSnapshot = await getDocs(projectQuery);

    if (projectsSnapshot.empty) {
      console.log("No projects found matching criteria");
      return [];
    }

    const projects = [];
    projectsSnapshot.forEach((doc) => {
      projects.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log(`Fetched ${projects.length} projects`);
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

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
