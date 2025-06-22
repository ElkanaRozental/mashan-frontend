import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Soldier, Request, AppState, User, NewRequestDTO } from '../types';
import { getallSoldiers, updateSoldier } from '../services/soldierService';
import { getAllSubmitting, addRequest, updateRequest, updateRequestStatus } from '../services/requestService';



// Mock users for authentication
const MOCK_USERS: User[] = [
  { username: 'user1', password: '1234' },
  { username: 'user2', password: '1234' }
];


interface AppStore extends AppState {
  // Auth actions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  // Soldier actions
  loadSoldiers: () => Promise<void>;

  addSoldier: (soldier: Omit<Soldier, 'id'>) => void;
  updateSoldier: (id: string, soldier: Partial<Soldier>) => Promise<void>;
  deleteSoldier: (id: string) => void;
  getSoldierById: (id: string) => Soldier | undefined;
  searchSoldiers: (query: string) => Soldier[];
  
  // Request actions
  loadSubmitting: () => Promise<void>;
  addRequest: (request:NewRequestDTO) => Promise<void>;
  updateRequestStatus: (id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED') => Promise<void>;
  getRequestsByFilter: (filter: { status?: boolean; mador?: number; soldierName?: string }) => Request[];

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
      soldiers: [],
      submitting: [],
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
      // Load initial data
      loadSoldiers: async () => {
        set({ isLoading: true });
        try {
          const data  = await getallSoldiers();
          set({ soldiers: data });
        } catch {
          set({ error: 'שגיאה בטעינת חיילים מהשרת' });
        } finally {
          set({ isLoading: false });
        }
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

      updateSoldier: async (id, updates) => {
        try {
          const data  = await updateSoldier(id, updates);
          set(state => ({
            soldiers: state.soldiers.map(s => (s.id === id ? data : s))
          }));
        } catch {
          set({ error: 'שגיאה בעדכון חייל' });
        }
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
          soldier.name.toLowerCase().includes(lowerQuery) ||
          soldier.privateNumber.includes(query) ||
          soldier.personalId.includes(query)
        );
      },

      // Request actions
      loadSubmitting: async () => {
        set({ isLoading: true });
        try {
          const data  = await getAllSubmitting();
          set({ submitting: data });
        } catch {
          set({ error: 'שגיאה בטעינת בקשות מהשרת' });
        } finally {
          set({ isLoading: false });
        }
      },

      addRequest: async (request) => {
        const { currentUser } = get();
        const newRequest: Request = {
          ...request,
          submitter: currentUser || 'unknown',
        } as Request;
        try {
          const Request = await addRequest(newRequest); 
          set(state => ({
            submitting: [...state.submitting, Request]
          }));
        }catch (error) {
          set({ error: 'שגיאה בהוספת בקשה' });
        }},

      updateRequestStatus:async (id, status) => {
        try{
          const  submitting: Request  = await updateRequestStatus(id,  status );
          set(state => ({
              submitting: state.submitting.map(request =>
                request.id === id ? { 
                  ...submitting, 
                  status: status
                } : request
              )
            }));
          } catch (error) {
          set({ error: 'שגיאה בעדכון סטטוס הבקשה' });
        }
      },

      getRequestsByFilter: (filter: { status?: boolean; mador?: number; soldierName?: string }) => {
        const { submitting: requests } = get();
        return requests.filter((request) => {
          if (filter.status !== undefined) {
            const isApproved = request.status === 'APPROVED';
            if (isApproved !== filter.status) return false;
          }
      
          // בדיקה אם מדובר בבקשה עם חייל נכנס או חייל יוצא
          const soldier =
            'incomingSoldier' in request ? request.incomingSoldier :
            'leavingSoldier' in request ? request.leavingSoldier : null;
      
          if (filter.mador && soldier && soldier.department !== filter.mador) return false;
      
          if (
            filter.soldierName &&
            soldier &&
            !soldier.name.toLowerCase().includes(filter.soldierName.toLowerCase())
          )
            return false;
      
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
        requests: state.submitting,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
