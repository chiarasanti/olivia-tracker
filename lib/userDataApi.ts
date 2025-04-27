import { supabase } from "./supabaseClient";

const USER_ID = "demo-user";
const initialTasks = [
  { id: "clean-litter", name: "clean litter", completed: false },
  { id: "change-water", name: "change water", completed: false },
  { id: "fill-food", name: "fill food", completed: false },
  { id: "brush-fur", name: "brush fur", completed: false },
  { id: "cuddles", name: "cuddles", completed: false },
  { id: "play-time", name: "play time", completed: false },
];

interface UserData {
  user_id: string;
  tasks: Array<{
    id: string;
    name: string;
    completed: boolean;
  }>;
  streak: number;
  last_reset_date: string;
  all_tasks_completed: boolean;
}

export async function fetchUserData(): Promise<UserData> {
  const { data, error } = await supabase
    .from("user_data")
    .select("*")
    .eq("user_id", USER_ID)
    .limit(1)
    .single();

  if (error) {
    // If no data exists, create initial row
    if (error.code === 'PGRST116') {
      const initialData: UserData = {
        user_id: USER_ID,
        tasks: initialTasks,
        streak: 0,
        last_reset_date: new Date().toDateString(),
        all_tasks_completed: false,
      };
      // Insert the initial data
      const { error: insertError } = await supabase
        .from("user_data")
        .insert(initialData);
        
      if (insertError) {
        console.error('Error inserting initial data:', insertError);
        throw insertError;
      }
      return initialData;
    }
    throw error;
  }

  // Ensure we have a complete data structure
  const completeData: UserData = {
    user_id: USER_ID,
    tasks: Array.isArray(data.tasks) ? data.tasks : initialTasks,
    streak: typeof data.streak === 'number' ? data.streak : 0,
    last_reset_date: typeof data.last_reset_date === 'string' ? data.last_reset_date : new Date().toDateString(),
    all_tasks_completed: typeof data.all_tasks_completed === 'boolean' ? data.all_tasks_completed : false,
  };

  return completeData;
}

export async function upsertUserData(userData: Partial<UserData>) {
  // Ensure we have a complete data structure
  const completeData: UserData = {
    user_id: USER_ID,
    tasks: userData.tasks || initialTasks,
    streak: typeof userData.streak === 'number' ? userData.streak : 0,
    last_reset_date: userData.last_reset_date || new Date().toDateString(),
    all_tasks_completed: userData.all_tasks_completed || false,
  };

  // First, try to update existing record
  const { error: updateError } = await supabase
    .from("user_data")
    .update(completeData)
    .eq("user_id", USER_ID);

  // If no record exists, insert a new one
  if (updateError) {
    const { error: insertError } = await supabase
      .from("user_data")
      .insert(completeData);
      
    if (insertError) {
      console.error('Error inserting data:', insertError);
      throw insertError;
    }
  } else if (updateError) {
    console.error('Error updating data:', updateError);
    throw updateError;
  }
}
