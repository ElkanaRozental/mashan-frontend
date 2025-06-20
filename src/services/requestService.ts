//פניה לשרת 

import { Request } from "@/types";

const API_BASE_URL = 'http://localhost:3000/api'; // Update with your actual API base URL

export const getAllSubmitting = async ():Promise<Request[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/submitting`);
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

export const addRequest = async (request: Omit<Request, 'id' | 'createdRequestDate' | 'isApproved'>): Promise<Request> => {
  try {
    const response = await fetch(`${API_BASE_URL}/submitting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to add request');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding request:', error);
    throw error;
  }
}
export const updateRequest = async (id: string, request: Partial<Request>): Promise<Request> => {
  try {
    const response = await fetch(`${API_BASE_URL}/submitting/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to update request');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating request:', error);
    throw error;
  }
}
export const deleteRequest = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/submitting/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete request');
    }
  } catch (error) {
    console.error('Error deleting request:', error);
    throw error;
  }
}
export const updateRequestStatus = async (id: string, status: Boolean): Promise<Request> => {
    try {
        const response = await fetch(`${API_BASE_URL}/submitting/${id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
        });
    
        if (!response.ok) {
        throw new Error('Failed to update request status');
        }
    
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating request status:', error);
        throw error;
    }
    }

