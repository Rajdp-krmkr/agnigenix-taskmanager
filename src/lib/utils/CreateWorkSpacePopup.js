export function validateWorkspaceTitle(workspaceTitle, setWorkspaceMessage) {
  if (workspaceTitle.length < 2 || workspaceTitle.length > 15) {
    setWorkspaceMessage({
      type: "error",
      message: "Workspace title must be between 2 and 15 characters.",
    });
    return false;
  }
  if (workspaceTitle.startsWith("_")) {
    setWorkspaceMessage({
      type: "error",
      message: "Workspace title cannot start with an (_).",
    });
    return false;
  }
  if (workspaceTitle.startsWith("-")) {
    setWorkspaceMessage({
      type: "error",
      message: "Workspace title cannot start with an (-).",
    });
    return false;
  }
  const workspaceTitleRegex = /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/;

  if (!workspaceTitleRegex.test(workspaceTitle)) {
    setWorkspaceMessage({
      type: "error",
      message:
        "Workspace title can only contain letters, numbers, underscores (_), and hyphens (-).",
    });
    return false;
  }

  setWorkspaceMessage({
    type: "success",
    message: "Workspace title is valid.",
  });
  return true;
}
