import express from 'express';
import list from './list';
import create from './create';
import updateExpiry from './update-expiry';

const router = express.Router();

router.get('/', list);
router.post('/', create);
router.patch('/:id/expiry', updateExpiry);

export default router;


