import { Router, type Request, type Response } from 'express';

const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  try {
    const { cityName } = req.body;
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    console.log(weatherData);
  // TODO: save city to search history
    await HistoryService.addCity(cityName);

    return res.json(weatherData);
  } catch (error) {
    console.error("Error retrieving weather data:", error);
    return res.status(500).json({ error: 'There was an error retrieving weather data.'});
  }
});
// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  try {
    const history = await HistoryService.getCities();
    return res.json(history);
  } catch (error) {
    return res.status(500).json({ error: 'There was an error in retrieving search history'});
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await HistoryService.removeCity(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'There was an error deleting city from history'});
  }
});

export default router;
