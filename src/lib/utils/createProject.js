export const createProjectInFirestore = async (projectData) => {
  try {
    const projectRef = doc(collection(db, "projects"));
    await setDoc(projectRef, {
      ...projectData,
      id: projectRef.id,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    return projectRef.id;
  } catch (error) {
    throw error;
  }
};
