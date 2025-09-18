import {
  doc,
  updateDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

/**
 * Updates the status of a task in the database
 * @param {string} taskId - The ID of the task to update
 * @param {string} newStatus - The new status for the task (todo, in-progress, review, completed)
 * @param {string} projectId - The ID of the project containing the task
 * @param {string} userId - The ID of the user making the update (for logging/permissions)
 * @returns {Promise<{success: boolean, message: string, data?: any}>}
 */
export const updateTaskStatus = async (
  taskId,
  newStatus,
  projectId,
  userId = null
) => {
  try {
    // Validate input parameters
    if (!taskId || !newStatus || !projectId) {
      return {
        success: false,
        message:
          "Missing required parameters: taskId, newStatus, and projectId are required",
      };
    }

    // Validate status values
    const validStatuses = [
      "todo",
      "in-progress",
      "review",
      "completed",
      "done",
    ];
    if (!validStatuses.includes(newStatus.toLowerCase())) {
      return {
        success: false,
        message: `Invalid status. Valid statuses are: ${validStatuses.join(
          ", "
        )}`,
      };
    }

    // Get reference to the task document
    const taskRef = doc(db, "tasks", taskId);

    // Check if task exists and get current data
    const taskSnapshot = await getDoc(taskRef);

    if (!taskSnapshot.exists()) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    const currentTask = taskSnapshot.data();

    // Verify the task belongs to the specified project
    if (currentTask.projectId !== projectId) {
      return {
        success: false,
        message: "Task does not belong to the specified project",
      };
    }

    // Prepare update data
    const updateData = {
      status: newStatus.toLowerCase(),
      updatedAt: new Date().toISOString(),
      lastModifiedBy: userId || "system",
    };

    // If task is being marked as completed, add completion timestamp
    if (
      newStatus.toLowerCase() === "completed" ||
      newStatus.toLowerCase() === "done"
    ) {
      updateData.completedAt = new Date().toISOString();
    }

    // If task is being moved from completed back to another status, remove completion timestamp
    if (
      (currentTask.status === "completed" || currentTask.status === "done") &&
      newStatus.toLowerCase() !== "completed" &&
      newStatus.toLowerCase() !== "done"
    ) {
      updateData.completedAt = null;
    }

    // Update the task in the database
    await updateDoc(taskRef, updateData);

    // Log the activity (optional - you can remove this if you don't have an activity log)
    await logTaskActivity(taskId, projectId, userId, "status_changed", {
      oldStatus: currentTask.status,
      newStatus: newStatus.toLowerCase(),
    });

    return {
      success: true,
      message: "Task status updated successfully",
      data: {
        taskId,
        oldStatus: currentTask.status,
        newStatus: newStatus.toLowerCase(),
        updatedAt: updateData.updatedAt,
      },
    };
  } catch (error) {
    console.error("Error updating task status:", error);
    return {
      success: false,
      message: "Failed to update task status",
      error: error.message,
    };
  }
};

/**
 * Updates multiple tasks' status in a batch operation
 * @param {Array} taskUpdates - Array of objects with {taskId, newStatus, projectId}
 * @param {string} userId - The ID of the user making the updates
 * @returns {Promise<{success: boolean, message: string, results: Array}>}
 */
export const updateMultipleTaskStatuses = async (
  taskUpdates,
  userId = null
) => {
  try {
    const results = [];

    for (const update of taskUpdates) {
      const result = await updateTaskStatus(
        update.taskId,
        update.newStatus,
        update.projectId,
        userId
      );
      results.push({
        taskId: update.taskId,
        ...result,
      });
    }

    const successCount = results.filter((r) => r.success).length;
    const totalCount = results.length;

    return {
      success: successCount === totalCount,
      message: `${successCount}/${totalCount} tasks updated successfully`,
      results,
    };
  } catch (error) {
    console.error("Error updating multiple task statuses:", error);
    return {
      success: false,
      message: "Failed to update task statuses",
      error: error.message,
      results: [],
    };
  }
};

/**
 * Gets the current status of a task
 * @param {string} taskId - The ID of the task
 * @returns {Promise<{success: boolean, status?: string, task?: object}>}
 */
export const getTaskStatus = async (taskId) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    const taskSnapshot = await getDoc(taskRef);

    if (!taskSnapshot.exists()) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    const task = taskSnapshot.data();
    return {
      success: true,
      status: task.status,
      task: { id: taskId, ...task },
    };
  } catch (error) {
    console.error("Error getting task status:", error);
    return {
      success: false,
      message: "Failed to get task status",
      error: error.message,
    };
  }
};

/**
 * Gets all tasks for a project with their current status
 * @param {string} projectId - The ID of the project
 * @returns {Promise<{success: boolean, tasks?: Array}>}
 */
export const getProjectTasks = async (projectId) => {
  try {
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("projectId", "==", projectId));
    const querySnapshot = await getDocs(q);

    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    return {
      success: true,
      tasks,
      message: `Found ${tasks.length} tasks for project ${projectId}`,
    };
  } catch (error) {
    console.error("Error getting project tasks:", error);
    return {
      success: false,
      message: "Failed to get project tasks",
      error: error.message,
      tasks: [],
    };
  }
};

/**
 * Logs task activity for audit trail (optional)
 * @param {string} taskId - The task ID
 * @param {string} projectId - The project ID
 * @param {string} userId - The user ID
 * @param {string} action - The action performed
 * @param {object} details - Additional details about the action
 */
const logTaskActivity = async (
  taskId,
  projectId,
  userId,
  action,
  details = {}
) => {
  try {
    // Only log if we have a valid user ID
    if (!userId || userId === "system") return;

    const activityRef = collection(db, "taskActivities");
    await addDoc(activityRef, {
      taskId,
      projectId,
      userId,
      action,
      details,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Don't throw error for logging failures, just log it
    console.warn("Failed to log task activity:", error);
  }
};

// Export default for easy importing
export default updateTaskStatus;
