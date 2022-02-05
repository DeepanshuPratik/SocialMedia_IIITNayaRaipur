import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import { useAuth } from '../hooks/useAuth';
import SingleProfileResponse from '../types/response/SingleProfileResponse';

interface LoginResponse {
  idToken: string;
  profile: SingleProfileResponse;
}

export const onSuccess = async (
  response: GoogleLoginResponse | GoogleLoginResponseOffline,
) => {
  try {
    localStorage.setItem('token', (response as GoogleLoginResponse).tokenId);
    window.open('/', '_self');
  } catch (error) {}
};
export const onFailure = (error: any) => {
  console.log(error);
};
export const googleLogin = async (tokenId: string): Promise<LoginResponse> => {
  const response = await fetch('/api/auth/signin', {
    headers: { Authorization: `Bearer ${tokenId}` },
  });
  const data = await response.json();
  return data;
};
