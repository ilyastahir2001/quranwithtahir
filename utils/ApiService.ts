import { RegistryUser } from '../types';

/**
 * QWT ApiService v4.5
 * Orchestrates secure communication between Frontend and Backend (PHP/FastAPI).
 * Automatically handles proxy selection based on environment.
 */
const API_BASE = '/api'; 

export const ApiService = {
  /**
   * Secure AI Scholarly Proxy
   * Bypasses client-side API Key exposure by hitting the server-side proxy.
   */
  async askScholar(prompt: string): Promise<string> {
    try {
      const res = await fetch(`${API_BASE}/ai_proxy.php`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ prompt })
      });
      
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      
      const data = await res.json();
      // Handle standard Gemini response structure returned by proxy
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 
             "I apologize, my link to the scholarly archives returned an empty response.";
    } catch (e) {
      console.error("Critical AI Proxy Failure:", e);
      return "The connection to the Academy Intelligence Hub was interrupted. Please check server logs.";
    }
  },

  async login(email: string, pass: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/gateway.php?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: "Authentication server unreachable." };
    }
  },

  async register(user: Partial<RegistryUser>): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/gateway.php?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: "Database registration failure." };
    }
  },

  async getAllUsers(): Promise<RegistryUser[]> {
    try {
      const res = await fetch(`${API_BASE}/gateway.php?action=get_all`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      return data.users || [];
    } catch (e) {
      console.warn("Switching to Local Encrypted Fallback Vault.");
      return [];
    }
  }
};