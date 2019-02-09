import Pages from '../pages';
import GetStarted from './get-started';

// Create a router
let router = v.Router();
router
  .get('/', () => Pages.Home)
  .use('/get-started', GetStarted)
  .get('/api', () => Pages.Api)
  .get('/examples', () => Pages.Examples);

export default router;
