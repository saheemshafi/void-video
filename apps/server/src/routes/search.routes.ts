import { Router } from 'express';
import { suggestSearchTerms } from '../controllers/search.controller';

const searchRouter = Router();

searchRouter.route('/autocomplete-suggestions').get(suggestSearchTerms);

export default searchRouter;
