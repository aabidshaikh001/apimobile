import Bookings from "../models/bookingmodal.js";
import { validationResult } from "express-validator";

export const createBooking = async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            errors: errors.array() 
        });
    }

    try {
        const bookingData = req.body;
        
        // Basic validation
        const requiredFields = [
            'propertyId', 'propertyName', 'clientName', 
            'phoneNumber', 'email', 'date', 'timeSlot'
        ];
        
        const missingFields = requiredFields.filter(field => !bookingData[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields',
                missingFields 
            });
        }

        const result = await Bookings.createBooking(bookingData);
        
        res.status(201).json({
            success: true,
            bookingId: result.bookingId,
            message: 'Booking created successfully'
        });
    } catch (error) {
        console.error("Booking creation error:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating booking',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getBooking = async (req, res) => {
    try {
        const booking = await Bookings.getBookingById(req.params.bookingId);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error("Get booking error:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching booking',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getPropertyBookings = async (req, res) => {
    try {
        const bookings = await Bookings.getBookingsByPropertyId(req.params.propertyId);
        
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error("Get property bookings error:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching property bookings',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['Pending', 'Confirmed', 'Cancelled', 'Completed'].includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid status value' 
            });
        }

        const success = await Bookings.updateBookingStatus(req.params.bookingId, status);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found or update failed'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Booking status updated successfully'
        });
    } catch (error) {
        console.error("Update booking status error:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating booking status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const success = await Bookings.deleteBooking(req.params.bookingId);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found or delete failed'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        console.error("Delete booking error:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting booking',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};