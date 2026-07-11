import { Task, TaskPriority, TaskStatus, TaskType } from "../types/Task";
import { addDays, subDays, setHours, setMinutes, startOfMonth } from "date-fns";

const generateId = () => Math.random().toString(36).substr(2, 9);

const lawyers = ["John Doe", "Jane Smith", "Michael Ross", "Harvey Specter", "Jessica Pearson"];
const clients = ["Wayne Enterprises", "Stark Industries", "LexCorp", "Oscorp", "Queen Consolidated"];

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateDummyTasks = (): Task[] => {
  const tasks: Task[] = [];
  const baseDate = new Date(); // Use current date as base
  
  const priorities: TaskPriority[] = ["Low", "Medium", "High", "Critical"];
  const statuses: TaskStatus[] = ["Pending", "In Progress", "Completed", "Overdue"];
  const types: TaskType[] = [
    "Court Hearing",
    "Client Meeting",
    "Legal Research",
    "Filing",
    "Review",
    "Internal Task",
  ];

  for (let i = 0; i < 30; i++) {
    const daysOffset = getRandomInt(-15, 15);
    const hour = getRandomInt(8, 17);
    const duration = getRandomInt(1, 3);
    
    const startDate = setMinutes(setHours(addDays(baseDate, daysOffset), hour), 0);
    const endDate = setHours(startDate, hour + duration);

    const taskType = getRandomItem(types);
    let title = "";
    
    switch (taskType) {
      case "Court Hearing": title = "Hearing for Case " + getRandomInt(1000, 9999); break;
      case "Client Meeting": title = "Meeting with " + getRandomItem(clients); break;
      case "Legal Research": title = "Research precedents for " + getRandomItem(clients); break;
      case "Filing": title = "File motions to dismiss"; break;
      case "Review": title = "Review contracts for merger"; break;
      case "Internal Task": title = "Weekly team sync"; break;
    }

    tasks.push({
      id: generateId(),
      title,
      description: "This is a detailed description for the legal task. It requires careful attention.",
      taskType,
      priority: getRandomItem(priorities),
      status: getRandomItem(statuses),
      assignedLawyer: getRandomItem(lawyers),
      client: getRandomItem(clients),
      caseName: "State v. " + getRandomItem(clients),
      caseNumber: "CASE-" + getRandomInt(1000, 9999),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  }

  return tasks;
};

// In-memory store
let tasksStore = generateDummyTasks();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const calendarService = {
  getTasks: async (): Promise<Task[]> => {
    await delay(600); // Simulate network
    return [...tasksStore];
  },
  
  createTask: async (newTask: Omit<Task, "id">): Promise<Task> => {
    await delay(500);
    const task: Task = { ...newTask, id: generateId() };
    tasksStore.push(task);
    return task;
  },
  
  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    await delay(500);
    const index = tasksStore.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Task not found");
    
    tasksStore[index] = { ...tasksStore[index], ...updates };
    return tasksStore[index];
  },
  
  deleteTask: async (id: string): Promise<void> => {
    await delay(500);
    tasksStore = tasksStore.filter((t) => t.id !== id);
  },
};
