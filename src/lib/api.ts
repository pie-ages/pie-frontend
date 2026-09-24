import { create } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

function resolveApiUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL;
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];
  if (expoHost) {
    return `http://${expoHost}:8080/api`;
  }

  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${host}:8080/api`;
}

const Api = create({
  baseURL: resolveApiUrl(),
});

export default Api;
