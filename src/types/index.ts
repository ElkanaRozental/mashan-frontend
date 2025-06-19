
// Types for the military management system
export interface Soldier {
  id: string;
  fullName: string; // שם מלא של החייל
  militaryId: string; // מספר אישי (מ.א.)
  tz: string; // ת.ז.
  phone: string; // מספר טלפון נייד
  gender: "ז" | "נ"; // מגדר
  rank: string; // דרגת החייל
  serviceType: "סדיר" | "מילואים" | "יועץ"; // סוג שירות
  center: string; // מרכז
  anaf: string; // ענף
  mador: string; // מדור
  team?: string; // צוות (אם קיים)
  role: string; // תפקיד החייל
  requiresYarkonirApproval: boolean; // האם נדרש אישור ירקוניר
  hasMAMGuard: boolean; // האם קיים משמר אמ"ן
  securityClearance: string; // סיווג בטחוני
  allergies: string; // האם יש אלרגיה
}

export type RequestStatus = "ממתינה" | "אושרה" | "נדחתה";

export interface BaseRequest {
  id: string;
  createdAt: Date; // תאריך יצירת הבקשה
  createdBy: string; // שם המשתמש שמילא את הבקשה
  status: RequestStatus; // סטטוס הבקשה
}

export interface DayOnlyRequest extends BaseRequest {
  type: "dayOnly";
  soldier: Soldier;
  arrivalDate: Date; // תאריך הגעה לבסיס
  baseName: string; // שם הבסיס
  requiresBaseApproval: boolean; // האם נדרש אישור
  hasBeenAtBaseBefore: boolean; // האם היה בבסיס בעבר
}

export interface StayRequest extends BaseRequest {
  type: "stay";
  soldier: Soldier;
  arrivalDate: Date;
  leaveDate: Date; // תאריך עזיבה
  baseName: string;
  requiresBaseApproval: boolean;
  hasBeenAtBaseBefore: boolean;
}

export interface ReplacementRequest extends BaseRequest {
  type: "replacement";
  incomingSoldier: Soldier; // החייל שנכנס
  outgoingSoldier: Soldier; // החייל שעוזב
  incomingArrivalDate: Date;
  incomingLeaveDate: Date;
  outgoingLeaveDate: Date;
  baseName: string;
}

export interface LeaveRequest extends BaseRequest {
  type: "leave";
  soldier: Soldier;
  baseName: string;
}

export type Request = DayOnlyRequest | StayRequest | ReplacementRequest | LeaveRequest;

export interface User {
  username: string;
  password: string;
}

export interface AppState {
  // Auth
  currentUser: string | null;
  isAuthenticated: boolean;
  
  // Data
  soldiers: Soldier[];
  requests: Request[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
}
