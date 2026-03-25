import { fetchData } from './ApiUtility';
import { API_ENDPOINTS } from './endpoints';

export interface WeatherResponse {
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  city: string;
}

class WeatherService {
  async getCurrentWeather(lat: number, lon: number) {
    return fetchData<WeatherResponse>(
      `${API_ENDPOINTS.WEATHER.CURRENT}?lat=${lat}&lon=${lon}`,
    );
  }
}

export const weatherService = new WeatherService();
