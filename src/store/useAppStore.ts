
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Soldier, Request, AppState, User } from '../types';

// Mock users for authentication
const MOCK_USERS: User[] = [
  { username: 'user1', password: '1234' },
  { username: 'user2', password: '1234' }
];

// Mock soldiers data
const MOCK_SOLDIERS: Soldier[] = [
  {
    id: '1',
    fullName: 'ישראל ישראלי',
    militaryId: '1234567',
    tz: '123456789',
    phone: '0501234567',
    gender: 'ז',
    rank: 'רס"ר',
    serviceType: 'סדיר',
    center: 'מרכז 1',
    anaf: 'ענף מודיעין',
    mador: 'מדור מחקר',
    team: 'צוות א',
    role: 'אנליסט',
    requiresYarkonirApproval: true,
    hasMAMGuard: false,
    securityClearance: 'סודי',
    allergies: 'אין'
  },
  {
    id: '2',
    fullName: 'שרה כהן',
    militaryId: '7654321',
    tz: '987654321',
    phone: '0507654321',
    gender: 'נ',
    rank: 'סמ"ר',
    serviceType: 'סדיר',
    center: 'מרכז 2',
    anaf: 'ענף תקשוב',
    mador: 'מדור פיתוח',
    role: 'מפתחת',
    requiresYarkonirApproval: false,
    hasMAMGuard: true,
    securityClearance: 'חסוי',
    allergies: 'אין'
  }
];

interface AppStore extends AppState {
  // Auth actions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  // Soldier actions
  addSoldier: (soldier: Omit<Soldier, 'id'>) => void;
  updateSoldier: (id: string, soldier: Partial<Soldier>) => void;
  deleteSoldier: (id: string) => void;
  getSoldierById: (id: string) => Soldier | undefined;
  searchSoldiers: (query: string) => Soldier[];
  
  // Request actions
  addRequest: (request: Omit<Request, 'id' | 'createdAt' | 'createdBy'>) => void;
  updateRequestStatus: (id: string, status: Request['status']) => void;
  getRequestsByFilter: (filter: { status?: Request['status']; mador?: string; soldierName?: string }) => Request[];
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      soldiers: MOCK_SOLDIERS,
      requests: [],
      isLoading: false,
      error: null,

      // Auth actions
      login: (username: string, password: string) => {
        const user = MOCK_USERS.find(u => u.username === username && u.password === password);
        if (user) {
          set({ currentUser: username, isAuthenticated: true, error: null });
          return true;
        }
        set({ error: 'שם משתמש או סיסמה שגויים' });
        return false;
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },

      // Soldier actions
      addSoldier: (soldier) => {
        const newSoldier: Soldier = {
          ...soldier,
          id: Date.now().toString()
        };
        set(state => ({
          soldiers: [...state.soldiers, newSoldier]
        }));
      },

      updateSoldier: (id, updates) => {
        set(state => ({
          soldiers: state.soldiers.map(soldier =>
            soldier.id === id ? { ...soldier, ...updates } : soldier
          )
        }));
      },

      deleteSoldier: (id) => {
        set(state => ({
          soldiers: state.soldiers.filter(soldier => soldier.id !== id)
        }));
      },

      getSoldierById: (id) => {
        return get().soldiers.find(soldier => soldier.id === id);
      },

      searchSoldiers: (query) => {
        const { soldiers } = get();
        if (!query.trim()) return soldiers;
        
        const lowerQuery = query.toLowerCase();
        return soldiers.filter(soldier =>
          soldier.fullName.toLowerCase().includes(lowerQuery) ||
          soldier.militaryId.includes(query) ||
          soldier.tz.includes(query)
        );
      },

      // Request actions
      addRequest: (request) => {
        const { currentUser } = get();
        const newRequest: Request = {
          ...request,
          id: Date.now().toString(),
          createdAt: new Date(),
          createdBy: currentUser || 'unknown',
          status: 'ממתינה'
        } as Request;
        
        set(state => ({
          requests: [...state.requests, newRequest]
        }));
      },

      updateRequestStatus: (id, status) => {
        set(state => ({
          requests: state.requests.map(request =>
            request.id === id ? { ...request, status } : request
          )
        }));
      },

      getRequestsByFilter: (filter) => {
        const { requests } = get();
        return requests.filter(request => {
          if (filter.status && request.status !== filter.status) return false;
          if (filter.mador && 'soldier' in request && request.soldier.mador !== filter.mador) return false;
          if (filter.soldierName && 'soldier' in request && 
              !request.soldier.fullName.toLowerCase().includes(filter.soldierName.toLowerCase())) return false;
          return true;
        });
      },

      // UI actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error })
    }),
    {
      name: 'military-app-store',
      partialize: (state) => ({
        soldiers: state.soldiers,
        requests: state.requests,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
