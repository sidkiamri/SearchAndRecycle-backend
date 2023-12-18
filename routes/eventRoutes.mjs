import express from "express";
import { addParticipant, createEvent, deleteEvent, getEvent, getEvents, removeParticipant, searchByDistance, searchByTitle, updateEvent } from "../controller/eventController.mjs";

const router = express.Router();
// Create a new event
router.post('/', createEvent);

// Get all events
router.get('/', getEvents);

// Get a single event by ID
router.get('/:id', getEvent);

// Update an event
router.put('/:id', updateEvent);

// Delete an event
router.delete('/:id', deleteEvent);

// Search events by title
router.get('/search',searchByTitle);

// Get events within a certain distance from a location
router.get('/search/distance', searchByDistance);

// Add a participant to an event
router.post('/:id/participants', addParticipant);

// Remove a participant from an event
router.delete('/:id/participants', removeParticipant);

export default router;
