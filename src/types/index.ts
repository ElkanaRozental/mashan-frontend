// Types for the military management system
export interface Soldier {
  id: string;
  name: string; // שם מלא של החייל
  privateNumber: string; // מספר אישי (מ.א.)
  personalId: string; // ת.ז.
  phoneNumber: string; // מספר טלפון נייד
  gender: 'MALE' | 'FEMALE'; // מגדר
  rank: string; // דרגת החייל

  center: number; // מרכז
  branch: number; // ענף
  department: number; // מדור
  team?: number; // צוות (אם קיים)
  clarance: number; // סיווג בטחוני
  
  allergies: string; // האם יש אלרגיה 
  jobKind: 'SADIR' | 'SAHATZ' | 'MILUIM' | 'YOETZ' | 'KEVA'; // סוג שירות,// SADIR - שירות סדיר, SAHATZ - שירות חוץ, MILUIM - מילואים, YOETZ - יועץ, KEVA - קבע
  jobTitle: string; // תפקיד
  
  isOrderingCommander: boolean; // האם הוא מפקד מזמין
  isRequiredYarkonirApporval: boolean; // האם נדרש אישור ירקוניר
  isExistsMishmarAman: boolean; // האם קיים משמר אמ"ן
  
  
  //ייתכן שזה לא בשימוש
  role: string; // תפקיד החייל
}
export type SubmittingTypes = "OneDayWithoutAccommodation" | "AccommodationForSeveralDays" | "AccommodationAndExchangeSoldiers" | "BaseLeaving";

export type StatusTypes = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface BaseRequest {
  id: string;
  createdRequestDate: string; // תאריך יצירת הבקשה toISOString
  submitter: string; // שם המשתמש שמילא את הבקשה
  status: StatusTypes; // סטטוס הבקשה
  submittingType : SubmittingTypes;
}

export interface OneDayWithoutAccommodationSubmitting extends BaseRequest {
  incomingSoldier: Soldier; // החייל שמגיע לבסיס
  arrivelDate: string; // תאריך הגעה לבסיס
  base: string; // שם הבסיס
  isAlreadyWasInBase: boolean; // האם היה בבסיס בעבר
}


export interface AccommodationForSeveralDaysSubmitting extends BaseRequest {
  incomingSoldier: Soldier; // החייל שמגיע לבסיס
  arrivelDate: string; // תאריך הגעה לבסיס toISOString
  departureDate: string; // תאריך עזיבה לבסיס toISOString
  base: string;
  isAlreadyWasInBase: boolean;
}



export interface AccommodationAndExchangeSoldiersSubmitting  extends BaseRequest {
  leavingSoldier: Soldier; // החייל שעוזב
  incomingSoldier: Soldier; // החייל שמגיע לבסיס
  arrivelDate: string; // תאריך הגעה לבסיס toISOString
  departureDate: string; // תאריך עזיבה לבסיס toISOString
  leavingSoldierExitDate: string; // תאריך עזיבת החייל שעוזב toISOString
  base: string;
}

export interface BaseLeavingSubmitting  extends BaseRequest {
  leavingSoldier: Soldier; // החייל שעוזב
  exitDate: string; // תאריך עזיבה toISOString
  base: string;
}
export type NewRequestDTO =
  | Omit<OneDayWithoutAccommodationSubmitting, 'id' | 'createdRequestDate' | 'submitter' | 'status'>
  | Omit<AccommodationForSeveralDaysSubmitting, 'id' |  'createdRequestDate' | 'submitter' | 'status'>
  | Omit<AccommodationAndExchangeSoldiersSubmitting , 'id' |  'createdRequestDate' | 'submitter' | 'status'>
  | Omit<BaseLeavingSubmitting , 'id' |  'createdRequestDate' | 'submitter' | 'status'>;

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
