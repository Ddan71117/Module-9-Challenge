import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// TODO: Define route to serve index.html
router.get('/', (req, res) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  res.sendFile(path.join(__dirname, '../../../client/index.html'));
});

export default router;
