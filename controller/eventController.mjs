import Event from "../models/Event.mjs";

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, address, longitude, latitude, owner,img } = req.body;
    const location = { type: 'Point', coordinates: [longitude, latitude] };
    const event = new Event({ title, description, date, address, location, owner ,img});
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all events
export const getEvents = async (req, res) => {
    try {
      const events = await Event.find()  .populate({
        path: 'owner',
        select: 'name'
    })
    .populate({
        path: 'participants',
        select: 'name'
    })
    .exec();

      res.json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  
// Get a single event by ID
export const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate('owner', '-password').populate('participants', '-password');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, address, longitude, latitude } = req.body;
    const location = { type: 'Point', coordinates: [longitude, latitude] };
    const event = await Event.findByIdAndUpdate(
      id,
      { title, description, date, address, location, updatedAt: Date.now() },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Search events by title
export async function searchByTitle(req, res) {
    try {
      const { title } = req.params;
      
      // Check that title is a string or integer
      if (typeof title !== 'string' && typeof title !== 'number') {
        throw new Error('Title must be a string or number');
      }
      
      // Convert title to string if it's a number
      const searchTitle = typeof title === 'number' ? title.toString() : title;
      
      const events = await Event.find({ title: { $regex: searchTitle, $options: 'i' } });
      
      res.status(200).json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
  

// Get events within a certain distance from a location
export const searchByDistance = async (req, res) => {
    try {
    const { longitude, latitude, maxDistance = 10000 } = req.query;
    const location = { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] };
    const events = await Event.find({
    location: {
    $near: {
    $geometry: location,
    $maxDistance: parseFloat(maxDistance)
    }
    }
    }).populate('owner', '-password');
    res.json(events);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
    }
    };
    
    // Add a participant to an event
    export const addParticipant = async (req, res) => {
    try {
    const { id } = req.params;
    const { participantId } = req.body;
    const event = await Event.findById(id);
    if (!event) {
    return res.status(404).json({ message: 'Event not found' });
    }
    if (event.participants.includes(participantId)) {
    return res.status(400).json({ message: 'Participant already added' });
    }
    event.participants.push(participantId);
    await event.save();
    res.json(event);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
    }
    };
    
    // Remove a participant from an event
    export const removeParticipant = async (req, res) => {
    try {
    const { id } = req.params;
    const { participantId } = req.body;
    const event = await Event.findById(id);
    if (!event) {
    return res.status(404).json({ message: 'Event not found' });
    }
    if (!event.participants.includes(participantId)) {
    return res.status(400).json({ message: 'Participant not found' });
    }
    event.participants = event.participants.filter(p => p.toString() !== participantId);
    await event.save();
    res.json(event);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
    }
    };
    
