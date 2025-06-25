import { API_BASE_URL, API_ENDPOINTS, ApiResponse } from '../../lib/api-config';

export type LoginCredentials = {
  waiter_id?: string;
  email?: string;
  password: string;
};

export type LoginResponse = {
  refresh: string;
  access: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_photo: string;
  user_type: string;
};

export async function login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
  try {
    console.log('Attempting login with:', credentials.email);
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    console.log('Login response:', data);

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || 'Login failed',
      };
    }

    // Store tokens in localStorage
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('access_token', data.access);
    
    // Store user data in localStorage
    localStorage.setItem('user_data', JSON.stringify({
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      profile_photo: data.profile_photo,
      user_type: data.user_type,
      email: credentials.email
    }));

    console.log('Stored tokens and user data in localStorage');
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Network error occurred',
    };
  }
}