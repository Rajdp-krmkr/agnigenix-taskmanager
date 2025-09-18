/**
 * Example usage of the updateTaskStatus function
 *
 * This file demonstrates how to use the updateTaskStatus function
 * in different scenarios within your application.
 */

import {
  updateTaskStatus,
  updateMultipleTaskStatuses,
  getTaskStatus,
  getProjectTasks,
} from "./updateTaskStatus";

// Example 1: Simple task status update
export const example1_UpdateSingleTask = async () => {
  try {
    const result = await updateTaskStatus(
      "task-123", // taskId
      "completed", // newStatus
      "project-456", // projectId
      "user-789" // userId (optional)
    );

    if (result.success) {
      console.log("✅ Task updated successfully:", result.data);
    } else {
      console.error("❌ Failed to update task:", result.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Example 2: Update multiple tasks at once
export const example2_UpdateMultipleTasks = async () => {
  const taskUpdates = [
    { taskId: "task-1", newStatus: "completed", projectId: "project-456" },
    { taskId: "task-2", newStatus: "in-progress", projectId: "project-456" },
    { taskId: "task-3", newStatus: "review", projectId: "project-456" },
  ];

  try {
    const result = await updateMultipleTaskStatuses(taskUpdates, "user-789");
    console.log("Batch update result:", result);

    // Check individual results
    result.results.forEach((taskResult) => {
      if (taskResult.success) {
        console.log(`✅ Task ${taskResult.taskId} updated successfully`);
      } else {
        console.error(
          `❌ Failed to update task ${taskResult.taskId}: ${taskResult.message}`
        );
      }
    });
  } catch (error) {
    console.error("Error in batch update:", error);
  }
};

// Example 3: Check current task status
export const example3_CheckTaskStatus = async () => {
  try {
    const result = await getTaskStatus("task-123");

    if (result.success) {
      console.log("Current task status:", result.status);
      console.log("Full task data:", result.task);
    } else {
      console.error("Failed to get task status:", result.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Example 4: Get all tasks for a project
export const example4_GetProjectTasks = async () => {
  try {
    const result = await getProjectTasks("project-456");

    if (result.success) {
      console.log(`Found ${result.tasks.length} tasks`);

      // Group tasks by status
      const tasksByStatus = result.tasks.reduce((acc, task) => {
        acc[task.status] = acc[task.status] || [];
        acc[task.status].push(task);
        return acc;
      }, {});

      console.log("Tasks by status:", tasksByStatus);
    } else {
      console.error("Failed to get project tasks:", result.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Example 5: Handle drag and drop in React component
export const example5_DragAndDropHandler = () => {
  const handleTaskDrop = async (taskId, newStatus, projectId, userId) => {
    try {
      // Show loading state
      console.log(`Moving task ${taskId} to ${newStatus}...`);

      const result = await updateTaskStatus(
        taskId,
        newStatus,
        projectId,
        userId
      );

      if (result.success) {
        console.log("✅ Task moved successfully!");
        // Update UI, show success message, etc.
        return true;
      } else {
        console.error("❌ Failed to move task:", result.message);
        // Show error message, revert UI changes, etc.
        return false;
      }
    } catch (error) {
      console.error("Error moving task:", error);
      return false;
    }
  };

  return handleTaskDrop;
};

// Example 6: Error handling and validation
export const example6_WithErrorHandling = async (
  taskId,
  newStatus,
  projectId,
  userId
) => {
  // Validate inputs before making the call
  if (!taskId || !newStatus || !projectId) {
    console.error("Missing required parameters");
    return;
  }

  // Validate status
  const validStatuses = ["todo", "in-progress", "review", "completed"];
  if (!validStatuses.includes(newStatus)) {
    console.error("Invalid status provided");
    return;
  }

  try {
    const result = await updateTaskStatus(taskId, newStatus, projectId, userId);

    switch (result.success) {
      case true:
        console.log("Success!", result.message);
        // Handle success case
        break;
      case false:
        console.error("Failed:", result.message);
        // Handle specific error cases
        if (result.message.includes("Task not found")) {
          // Handle task not found
        } else if (result.message.includes("does not belong")) {
          // Handle permission error
        }
        break;
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    // Handle network errors, etc.
  }
};

// Example 7: Integration with React hooks
export const useTaskStatusUpdater = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateStatus = async (taskId, newStatus, projectId, userId) => {
    setIsUpdating(true);
    setError(null);

    try {
      const result = await updateTaskStatus(
        taskId,
        newStatus,
        projectId,
        userId
      );

      if (!result.success) {
        setError(result.message);
      }

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateStatus, isUpdating, error };
};
