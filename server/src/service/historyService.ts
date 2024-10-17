import fs from 'fs/promises';
import path from 'path';

// TODO: Define a City class with name and id properties
class City {
  constructor(public name: string, public id: string) {}
}
// TODO: Complete the HistoryService class
class HistoryService {
 private filePath = path.join(__dirname, 'searchHistory.json');
// TODO: Define a read method that reads from the searchHistory.json file
 private async read(): Promise<City[]> {
  try {
    const data = await fs.readfile(this.filePath, 'utf-8');
    const cities = JSON.parse(data);
    return cities.map((city: { name:string, id: string}) => new City(city.name, city.id));
  } catch (error) {
    console.error('There was an error with reading the file', error);
    return[];
  }
 }
// TODO: Define a write method that writes the updated cities array to the searchHistory.json file
 private async write(cities: City[]): Promise<void> {
  try {
    const data = JSON.stringify(cities, null, 2);
    await fs.writeFile(this.filePath, data);
  } catch (error) {
    console.error('There was an error with writing the file', error);
  }
 }
// TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
 async getCities(): Promise<City[]> {
  return await this.read();
 }
// TODO Define an addCity method that adds a city to the searchHistory.json file
 async addCity(city: string): Promise<void> {
  const cities = await this.getCities();
  const newCity = new City(city, this.generateId());
  cities.push(newCity);
  await this.write(cities);
 }
// * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
 async removeCity(id: string): Promise<void> {
  const cities = await this.getCities();
  const updatedCities = cities.filter(city => city.id !==id);
  await this.write(updatedCities);
 }
}

export default new HistoryService();