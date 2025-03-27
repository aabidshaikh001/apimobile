import express from "express";
import {
    createBooking,
    getBooking,
    getPropertyBookings,
    updateBookingStatus,
    deleteBooking, getAllBookings
} from "../controllers/booking.controller.js";
import { body, param } from "express-validator";

const router = express.Router();

// Create a new booking
router.post("/", 
    [
        body('propertyId').notEmpty().withMessage('Property ID is required'),
        body('propertyName').notEmpty().withMessage('Property name is required'),
        body('clientName').notEmpty().withMessage('Client name is required'),
        body('phoneNumber').notEmpty().withMessage('Phone number is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('requirement').notEmpty().withMessage('Requirement is required'),
        body('date').isDate().withMessage('Valid date is required'),
        body('timeSlot').notEmpty().withMessage('Time slot is required')
    ],
    createBooking
);

// Get a specific booking
router.get("/:bookingId", 
    param('bookingId').matches(/^BK-\d+$/).withMessage('Invalid booking ID format'),
    getBooking
);

// Get all bookings for a property
router.get("/property/:propertyId", 
    param('propertyId').notEmpty().withMessage('Property ID is required'),
    getPropertyBookings
);

// Update booking status
router.patch("/:bookingId/status", 
    [
        param('bookingId').matches(/^BK-\d+$/).withMessage('Invalid booking ID format'),
        body('status').isIn(['Pending', 'Confirmed', 'Cancelled', 'Completed'])
            .withMessage('Invalid status value')
    ],
    updateBookingStatus
);

// Delete a booking
router.delete("/:bookingId", 
    param('bookingId').matches(/^BK-\d+$/).withMessage('Invalid booking ID format'),
    deleteBooking
);

// Get all bookings for a property
router.get("/all", getAllBookings);

export default router;