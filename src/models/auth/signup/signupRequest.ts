export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  role: "FREE_USER" | "SUBSCRIBED_USER" | "ADMIN"; // Using a union type for predefined roles
  universityMajor: string;
  universityName: string;
  rolesTargeting: string[]; // Array of strings
  relevantWorkExperience: number; // Number of years of relevant experience
}