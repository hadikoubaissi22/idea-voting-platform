import { Router } from 'express';
import {
  getIdeas,
  createIdea,
  upvoteIdea,
  downvoteIdea
} from '../controllers/ideas.controller.js';
import { basicAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', getIdeas);
router.post('/', basicAuth,createIdea);
router.post('/:id/upvote',basicAuth, upvoteIdea);
router.post('/:id/downvote', basicAuth, downvoteIdea);

export default router;
