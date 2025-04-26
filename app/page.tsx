"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocalStorage } from "./hooks/use-local-storage";
import { Cat } from "./components/cat";
import { Heart } from "./components/heart";
import { PixelConfetti } from "./components/pixel-confetti";
import { CongratulationsScreen } from "./components/congratulations-screen";

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
  // State for tasks, streak, and last reset date
  const [tasks, setTasks] = useLocalStorage<Task[]>(
    "olivia-tasks",
    initialTasks
  );
  const [streak, setStreak] = useLocalStorage<number>("olivia-streak", 0);
  const [lastResetDate, setLastResetDate] = useLocalStorage<string>(
    "olivia-last-reset",
    new Date().toDateString()
  );
  const [pulseHeart, setPulseHeart] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [allTasksCompleted, setAllTasksCompleted] = useLocalStorage<boolean>(
    "olivia-all-completed",
    false
  );

  // Calculate remaining tasks
  const remainingTasks = tasks.filter((task) => !task.completed).length;
  const totalTasks = tasks.length;

  // Check if we need to reset tasks (new day after 3AM)
  useEffect(() => {
    const checkForReset = () => {
      const now = new Date();
      const currentDate = now.toDateString();
      const currentHour = now.getHours();

      // If it's a new day and past 3AM, reset tasks
      if (currentDate !== lastResetDate && currentHour >= 3) {
        // Check if all tasks were completed before reset
        const allCompleted = tasks.every((task) => task.completed);

        // Update streak based on completion
        if (allCompleted) {
          setStreak(streak + 1);
        } else {
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
  }, [
    tasks,
    streak,
    lastResetDate,
    setTasks,
    setStreak,
    setLastResetDate,
    setAllTasksCompleted,
  ]);

  // Check for all tasks completed
  useEffect(() => {
    const allCompleted = tasks.every((task) => task.completed);

    // Only update if the state is changing from incomplete to complete
    if (allCompleted && !allTasksCompleted) {
      setAllTasksCompleted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [tasks, allTasksCompleted, setAllTasksCompleted]);

  // Toggle task completion
  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    // Trigger heart pulse animation and meow sound when a task is completed
    const task = tasks.find((t) => t.id === id);
    if (!task?.completed) {
      setPulseHeart(true);
      setTimeout(() => setPulseHeart(false), 1000);
      
      // Play meow sound
      const audio = new Audio('/sounds/meow.mp3');
      audio.play().catch(error => console.log('Error playing sound:', error));
    }
  };

  // If all tasks are completed, show the congratulations screen
  if (allTasksCompleted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#FED6DF] text-[#7358D5]">
        <div className="w-full max-w-md border-8 border-[#C4B4FF] p-6 relative h-screen max-h-[1450px] flex justify-center items-center">
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

  // Otherwise show the normal task list
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FED6DF] text-[#7358D5]">
      <div className="w-full max-w-md border-8 border-[#C4B4FF] p-6 relative h-screen max-h-[1450px]">
        {/* Grid background */}

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <h1 className="text-5xl font-pixel text-center mb-8">
            Olivia Tracker &lt;3
          </h1>

          {/* Cat and heart animation */}
          <div className="flex justify-center flex-col items-center mb-4 relative !bg-[#EFBFC7] border-[#7358D5] border-l border-t border-r-4 border-b-4 p-8">
            <div className="animate-float z-30">
              <Heart pulse={pulseHeart} />
              <Cat />
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
          <div className="flex justify-between mb-12">
            <p className="text-base font-pixel">{streak} days streak</p>
            <p className="text-base font-pixel">
              {remainingTasks}/{totalTasks} remaining
            </p>
          </div>

          {/* Task list */}
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border-b border-white pb-4">
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
