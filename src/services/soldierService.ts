//פניה לשרת 

import { Soldier } from "@/types";

const API_BASE_URL = 'http://localhost:3000/api'; // Update with your actual API base URL

export const getallSoldiers = async ():Promise<Soldier[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/soldier`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching soldiers:', error);
    throw error;
  }
}
export const updateSoldier = async (id: string, soldier: Partial<Soldier>): Promise<Soldier> => {
    try {
        const response = await fetch(`${API_BASE_URL}/soldier/${soldier.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(soldier),
        });
    
        if (!response.ok) {
        throw new Error('Failed to update soldier');
        }
    
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating soldier:', error);
        throw error;
    }
    }

