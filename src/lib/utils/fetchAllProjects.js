export const fetchAllProjects = async (user) => {
  try {
    const projectCollectionRef = collection(db, "projects");
    const q = query(
      projectCollectionRef,
      where("members", "array-contains", user.uid)
    );
    const res = await getDocs(q);
    console.log("Fetched projects:", res);
    return res.docs();
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error(error);
  }
};
