import {Router} from 'express';

const router = Router();

router.get('/contacts');
router.get('/contacts/:id');
router.post('/contacts');
router.put('/contacts/:id');
router.delete('/contacts/:id');