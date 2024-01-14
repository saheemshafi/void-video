import { validateRequest } from '../utils';
import asyncHandler from '../utils/async-handler';
import { suggestSearchTermsValidation } from '../validations/search.validation';

const suggestSearchTerms = asyncHandler(async (req, res) => {
  const {
    query: { searchTerm },
  } = validateRequest(req, suggestSearchTermsValidation);
});

export { suggestSearchTerms };
