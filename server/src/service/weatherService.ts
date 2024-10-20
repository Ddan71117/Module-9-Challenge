import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}
// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  conditions: string;

  constructor(temperature: number, conditions: string) {
    this.temperature = temperature;
    this.conditions = conditions;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string = process.env.API_BASE_URL || 'https://api.openweathermap.org/data/2.5/';
  private APIKey: string = process.env.API_KEY || '';
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await fetch(`${this.buildGeocodeQuery(query)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location data.');
    }
    const data = await response.json();
    return this.destructureLocationData(data[0]);
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      latitude: locationData.lat,
      longitude: locationData.lon,
    };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}geo/1.0/direct?q=${city}&limit=1&appid=${this.APIKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.APIKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    return await this.fetchLocationData(city);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    if (!response.ok) {
      throw new Error('Failed to fetch weather data.'); 
    }
    return await response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    return new Weather(response.main.temp, response.weather[0].description)
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.map(data => new Weather(data.main.temp, data.weather[0].description))
  }

  private buildForecastQuery(coordinates: Coordinates): string {
    return `${this.baseURL}forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.APIKey}`;
  }

  private async fetchForecastData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildForecastQuery(coordinates));
    if (!response.ok) {
      throw new Error('Failed to fetch forecast data.');
    }
    return await response.json();
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<{ currentWeather: Weather; forecast: Weather[] }> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastData = await this.fetchForecastData(coordinates);
    const forecast = this.buildForecastArray(forecastData.list);
    return { currentWeather, forecast};
  }
}

export default new WeatherService();
