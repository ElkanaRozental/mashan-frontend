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
export type SubmittingTypes = "OneDayWithoutAccommodation" | "AccommodationForSeveralDays" | "AccommodationAndExchangeSoldiers" | "BaseLeaving";



export interface BaseRequest {
  id: string;
  createdRequestDate: Date; // תאריך יצירת הבקשה
  submitter: string; // שם המשתמש שמילא את הבקשה
  isApproved: Boolean; // סטטוס הבקשה
  submittingType : SubmittingTypes;
}

export interface OneDayWithoutAccommodationSubmitting extends BaseRequest {
  incomingSoldier: Soldier; // החייל שמגיע לבסיס
  arrivelDate: Date; // תאריך הגעה לבסיס
  base: string; // שם הבסיס
  isAlreadyWasInBase: boolean; // האם היה בבסיס בעבר
}


export interface AccommodationForSeveralDaysSubmitting extends BaseRequest {
  incomingSoldier: Soldier; // החייל שמגיע לבסיס
  arrivelDate: Date;
  departureDate: Date; // תאריך עזיבה
  base: string;
  isAlreadyWasInBase: boolean;
}



export interface AccommodationAndExchangeSoldiersSubmitting  extends BaseRequest {
  leavingSoldier: Soldier; // החייל שעוזב
  incomingSoldier: Soldier; // החייל שמגיע לבסיס
  arrivelDate: Date;
  departureDate: Date;
  leavingSoldierExitDate: Date;
  base: string;
}

export interface BaseLeavingSubmitting  extends BaseRequest {
  leavingSoldier: Soldier; // החייל שעוזב
  exitDate: Date; // תאריך עזיבה
  base: string;
}
export type NewRequestDTO =
  | Omit<OneDayWithoutAccommodationSubmitting, 'id' | 'createdRequestDate' | 'submitter' | 'isApproved'>
  | Omit<AccommodationForSeveralDaysSubmitting, 'id' |  'createdRequestDate' | 'submitter' | 'isApproved'>
  | Omit<AccommodationAndExchangeSoldiersSubmitting , 'id' |  'createdRequestDate' | 'submitter' | 'isApproved'>
  | Omit<BaseLeavingSubmitting , 'id' |  'createdRequestDate' | 'submitter' | 'isApproved'>;

export type Request = OneDayWithoutAccommodationSubmitting | AccommodationForSeveralDaysSubmitting | AccommodationAndExchangeSoldiersSubmitting  | BaseLeavingSubmitting ;

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
  submitting: Request[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
}
