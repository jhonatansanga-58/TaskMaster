import { supabase } from "./supabase";
export const fetchTasks = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("task")
      .select("*")
      .eq("user_id", userId)
      .order("time", { ascending: true });

    if (error) {
      console.error("Error fetching tasks:", error);
      return [];
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

export type Tasks = Awaited<ReturnType<typeof fetchTasks>>;
export type Task = NonNullable<Tasks>[number];
