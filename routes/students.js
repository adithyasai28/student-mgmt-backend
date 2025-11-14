const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/studentsController');
const auth = require('../middleware/auth');

router.get('/', auth, studentsController.getAll);
router.get('/:id', auth, studentsController.getById);
router.post('/', auth, studentsController.create);
router.patch('/:id', auth, studentsController.update);
router.delete('/:id', auth, studentsController.remove);

module.exports = router;
