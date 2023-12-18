import express from "express";

import {
  createCan,
  deleteCanById,
  getAllCans,
  getCanById,
  updateCanById,
  getCansByWasteType,
} from '../controller/can.controller.mjs';

const router = express.Router();

// GET all cans
router.get('/', getAllCans);

// GET a single can by id
router.get('/:id', getCanById);

// CREATE a new can
router.post('/', createCan);

// UPDATE an existing can
router.patch('/:id', updateCanById);

// DELETE a can
router.delete('/:id', deleteCanById);
router.get('/:wasteType', getCansByWasteType);

export default router;

