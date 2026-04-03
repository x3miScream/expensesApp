import * as SecureStore from 'expo-secure-store';

/**
 * AUTH SERVICE
 * Handles secure storage of JWT tokens on mobile devices.
 * Equivalent to your browser cookie implementation.
 */

const TOKEN_KEY = 'user_jwt_token';
const USERNAME_KEY = 'user_name';

export const AuthService = {
  /**
   * Save the JWT token to secure storage
   * @param {string} token 
   */
  async saveTokenAsync(token) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving the auth token", error);
    }
  },

  /**
   * Save the JWT token to secure storage
   * @param {string} userName 
   */
  async saveUserNameAsync(userName) {
    try {
      await SecureStore.setItemAsync(USERNAME_KEY, userName);
    } catch (error) {
      console.error("Error saving the auth user", error);
    }
  },

  /**
   * Retrieve the JWT token for API headers
   * @returns {Promise<string|null>}
   */
  async getTokenAsync() {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("Error retrieving the auth token", error);
      return null;
    }
  },

  /**
   * Retrieve the JWT token for API headers
   * @returns {Promise<string|null>}
   */
  async getUserNameAsync() {
    try {
      return await SecureStore.getItemAsync(USERNAME_KEY);
    } catch (error) {
      console.error("Error retrieving the auth user", error);
      return null;
    }
  },

  /**
   * Remove the token (Logout)
   */
  async logout() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USERNAME_KEY);
    } catch (error) {
      console.error("Error deleting the auth token", error);
    }
  },

  /**
   * Helper to check if user is authenticated
   */
  async isAuthenticated() {
    const token = await this.getTokenAsync();
    return token !== null;
  }
};

/**
 * EXAMPLE USAGE WITH AXIOS INTERCEPTOR:
 * * axios.interceptors.request.use(async (config) => {
 * const token = await AuthService.getToken();
 * if (token) {
 * config.headers.Authorization = `Bearer ${token}`;
 * }
 * return config;
 * });
 */