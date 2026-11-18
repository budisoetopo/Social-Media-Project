export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  avatar?: string;
};

const DB_KEY = 'foody_users_db';

// Helper to get all users from localStorage
export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(DB_KEY);
  return users ? JSON.parse(users) : [];
};

// Helper to save users to localStorage
export const saveUsers = (users: User[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(users));
};

// <-- ADDED: verifyUser to match the import in useLogin.ts
export const verifyUser = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  return user || null;
};

// Kept for backward compatibility if used anywhere else
export const login = (email: string, password: string): User | null => {
  return verifyUser(email, password);
};

// Simulate Register
export const register = (
  newUser: User
): { success: boolean; message?: string } => {
  const users = getUsers();
  if (users.find((u) => u.email === newUser.email)) {
    return { success: false, message: 'Email already exists' };
  }
  users.push(newUser);
  saveUsers(users);
  return { success: true };
};

// Simulate Updating Profile in the Database
export const updateUserDatabase = (
  oldEmail: string,
  updatedData: Partial<User> & { password?: string }
): { success: boolean; message?: string; user?: User } => {
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.email === oldEmail);

  if (userIndex === -1) return { success: false, message: 'User not found' };

  // If changing email, check if the new email is already taken by someone else
  if (updatedData.email && updatedData.email !== oldEmail) {
    const emailExists = users.some((u) => u.email === updatedData.email);
    if (emailExists) {
      return {
        success: false,
        message: 'Email is already in use by another account',
      };
    }
  }

  const dataToMerge = { ...updatedData };
  if (!dataToMerge.password) {
    delete dataToMerge.password;
  }

  // Merge old user data with new data
  const updatedUser = { ...users[userIndex], ...dataToMerge };
  users[userIndex] = updatedUser;
  saveUsers(users);

  return { success: true, user: updatedUser };
};
