"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Cat } from "./components/cat";
import { Heart } from "./components/heart";
import { PixelConfetti } from "./components/pixel-confetti";
import { CongratulationsScreen } from "./components/congratulations-screen";
import { fetchUserData, upsertUserData } from "@/lib/userDataApi";

// Define the task type
interface Task {
  id: string;
  name: string;
  completed: boolean;
}

// Initial tasks
const initialTasks: Task[] = [
  { id: "clean-litter", name: "clean litter", completed: false },
  { id: "change-water", name: "change water", completed: false },
  { id: "fill-food", name: "fill food", completed: false },
  { id: "brush-fur", name: "brush fur", completed: false },
  { id: "cuddles", name: "cuddles", completed: false },
  { id: "play-time", name: "play time", completed: false },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [streak, setStreak] = useState(0);
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString());
  const [pulseHeart, setPulseHeart] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);
  const [lastCompletedTask, setLastCompletedTask] = useState<string | null>(null);
  const [catShake, setCatShake] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUserData();
        if (data) {
          setTasks(data.tasks || initialTasks);
          setStreak(data.streak || 0);
          setLastResetDate(data.last_reset_date || new Date().toDateString());
          setAllTasksCompleted(data.all_tasks_completed || false);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Save to Supabase whenever data changes
  useEffect(() => {
    if (!loading) {
      const saveData = async () => {
        try {
          await upsertUserData({
            tasks,
            streak,
            last_reset_date: lastResetDate,
            all_tasks_completed: allTasksCompleted,
          });
        } catch (error) {
          console.error('Error saving data:', error);
        }
      };
      saveData();
    }
  }, [tasks, streak, lastResetDate, allTasksCompleted, loading]);

  // Calculate remaining tasks
  const remainingTasks = tasks.filter((task) => !task.completed).length;
  const totalTasks = tasks.length;

  // Check for all tasks completed
  useEffect(() => {
    const allCompleted = tasks.every((task) => task.completed);

    // Only update if the state is changing from incomplete to complete
    if (allCompleted && !allTasksCompleted) {
      const today = new Date().toDateString();
      
      // Only increment streak if this is the first completion today
      if (today !== lastResetDate) {
        setStreak((prevStreak) => prevStreak + 1);
        setLastResetDate(today);
      }
      
      setAllTasksCompleted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [tasks, allTasksCompleted, lastResetDate]);

  // Check if we need to reset tasks (new day after 3AM)
  useEffect(() => {
    const checkForReset = () => {
      const now = new Date();
      const currentDate = now.toDateString();
      const currentHour = now.getHours();

      // If it's a new day and past 3AM, reset tasks and check streak
      if (currentDate !== lastResetDate && currentHour >= 3) {
        // If tasks weren't completed yesterday, reset streak
        if (!allTasksCompleted) {
          setStreak(0);
        }
        
        // Reset all tasks and completion state
        setTasks(initialTasks);
        setAllTasksCompleted(false);
        setLastResetDate(currentDate);
      }
    };

    checkForReset();

    // Check for reset every minute
    const interval = setInterval(checkForReset, 60000);
    return () => clearInterval(interval);
  }, [tasks, lastResetDate, allTasksCompleted]);

  // Effect to handle heart pulse animation
  useEffect(() => {
    if (lastCompletedTask) {
      setPulseHeart(true);
      setTimeout(() => setPulseHeart(false), 1000);

      // Play meow sound
      const audio = new Audio("/sounds/meow.mp3");
      audio.play().catch((error) => console.log("Error playing sound:", error));
    }
  }, [lastCompletedTask]);

  // Toggle task completion
  const toggleTask = (id: string) => {
    console.log('Toggling task:', id);
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      console.log('New tasks state:', newTasks);
      return newTasks;
    });
  };

  // Handle cat click for shake and angry meow
  const handleCatClick = () => {
    setCatShake(true);
    const audio = new Audio("/sounds/angry-meow.mp3");
    audio
      .play()
      .catch((error) => console.log("Error playing angry meow sound:", error));
    setTimeout(() => setCatShake(false), 500);
  };

  // If all tasks are completed, show the congratulations screen
  if (allTasksCompleted) {
    return (
      <main className="flex overflow-hiddenflex-col items-center justify-center bg-[#FED6DF] text-[#7358D5]">
        <div className="w-full max-w-md border-8 border-[#C4B4FF] p-6 relative h-screen flex justify-center items-center">
          {/* Grid background */}
          <div className="absolute inset-0 grid grid-cols-5 grid-rows-6">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border border-white opacity-50"></div>
            ))}
          </div>

          {/* Congratulations screen */}
          <div className="relative z-10">
            <CongratulationsScreen streak={streak} />
          </div>
        </div>
      </main>
    );
  }

  // Show loading spinner/message while loading
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-2xl font-pixel text-[#7358D5]">Loading...</div>;
  }

  // Otherwise show the normal task list
  return (
    <main className="flex overflow-hiddenflex-col items-center justify-center bg-[#FED6DF] text-[#7358D5]">
      <div className="w-full max-w-md border-8 border-[#C4B4FF] p-6 relative h-screen">
        {/* Grid background */}

        {/* Content */}
        <div className="relative z-10">
          {/* Cat and heart animation */}
          <div className="flex justify-center flex-col items-center mb-2 relative !bg-[#EFBFC7] border-[#7358D5] border-l border-t border-r-4 border-b-4 p-5">
            <div className="animate-float z-30">
              <Heart pulse={pulseHeart} />
              <Cat
                className={catShake ? "animate-shake" : ""}
                onClick={handleCatClick}
              />
            </div>
            <div className="w-4 h-4 bg-primary absolute top-0 left-0 z-30" />
            <div className="w-4 h-4 bg-primary absolute bottom-0 left-0 z-30" />
            <div className="w-4 h-4 bg-primary absolute bottom-0 right-0 z-30" />
            <div className="w-4 h-4 bg-primary absolute top-0 right-0 z-30" />
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="border border-white opacity-50"></div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between mb-7">
            <p className="text-base font-pixel">{streak} days streak</p>
            <p className="text-base font-pixel">
              {remainingTasks}/{totalTasks} remaining
            </p>
          </div>

          {/* Task list */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="border-b border-white pb-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="border-[#7358D5] border-l border-t border-r-4 border-b-4 data-[state=checked]:bg-[#FCBDC8] h-7 w-7"
                  />
                  <label
                    htmlFor={task.id}
                    className={`text-2xl font-pixel ${
                      task.completed ? "line-through" : ""
                    }`}
                  >
                    {task.name}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showConfetti && <PixelConfetti />}
    </main>
  );
}
