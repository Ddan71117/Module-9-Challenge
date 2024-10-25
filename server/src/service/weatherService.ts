import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface WeatherData {
  city: {
    name: string;
  };
  list: Array<{
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
  }>;
}
// TODO: Define a class for the Weather object



// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  //@ts-ignore
  private baseURL: string = process.env.API_BASE_URL || 'https://api.openweathermap.org/data/2.5/';
  private APIKey: string = process.env.API_KEY || '';
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await fetch(`${this.buildGeocodeQuery(query)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location data.');
    }
    const data = await response.json();
    return this.destructureLocationData(data);
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData[0];
    return { latitude: lat, longitude: lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    // const URL = `${this.baseURL}/forecast?q=${city}&appid=${this.APIKey}`;
    const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${this.APIKey}`;
    return URL;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.APIKey}&units=imperial`;
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
  private parseCurrentWeather(response: Record<string, any>) {

    const currentWeather = {
      city: response.name,
      date: new Date(response.dt*1000).toLocaleDateString(),
      icon: response.weather[0]?.icon,
      description: response.weather[0].description,
      tempF: response.main.temp,
      humidity: response.main.humidity,
      windSpeed: response.wind.speed
    };
    if (!response ) { 
      throw new Error('Failed to obtain current weather.');
    }  
    return currentWeather;
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: WeatherData ): Array<{
    city: string;
    date: string;
    icon: string;
    description: string;
    tempF: number;
    humidity: number;
    windSpeed: number;
    }> {
    const forecastData = weatherData.list.filter((_data, i) => i % 8 === 0);
    const forecastArray = forecastData.map((data) => {
      const currentWeather = {
        city: weatherData.city.name,
        date: new Date(data.dt*1000).toLocaleDateString(),
        icon: data.weather[0].icon,
        description: data.weather[0].description,
        tempF: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      };
      console.log(currentWeather);
      return currentWeather;
    });
    return forecastArray;
    
  }

  private buildForecastQuery(coordinates: Coordinates): string {
    return `${this.baseURL}forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.APIKey}&units=imperial`;
  }

  private async fetchForecastData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildForecastQuery(coordinates));
    if (!response.ok) {
      throw new Error('Failed to fetch forecast data.');
    }
    return await response.json();
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastData = await this.fetchForecastData(coordinates);
    const forecast = this.buildForecastArray(forecastData);
    return { currentWeather, forecast };

  }
}

export default new WeatherService();
