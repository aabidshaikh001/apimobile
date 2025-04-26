const Bookings = require("../models/bookingmodal");
const { validationResult } = require("express-validator");
const twilio = require("twilio");

// Initialize Twilio client
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

exports.createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }

  try {
    const {
      clientName,
      phoneNumber: rawPhoneNumber,
      email,
      date,
      timeSlot,
      propertyName,
      priceRange,
      requirement = ''
    } = req.body;

    if (!clientName || !rawPhoneNumber || !email || !date || !timeSlot || !propertyName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        requiredFields: ['clientName', 'phoneNumber', 'email', 'date', 'timeSlot', 'propertyName']
      });
    }

    // Convert and validate date
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format',
        expectedFormat: 'YYYY-MM-DD'
      });
    }

    // Format phone number
    const phoneNumber = formatIndianPhoneNumber(rawPhoneNumber);
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Indian phone number',
        validFormats: ['9876543210', '09876543210', '+919876543210', '919876543210']
      });
    }

    // Create booking in the database
    const booking = await Bookings.createBooking({
        clientName,
        phoneNumber: `+${phoneNumber}`,
        email,
        bookingDate: bookingDate.toISOString(),
        timeSlot,
        priceRange,
        propertyName,
        requirement,
        status: 'CONFIRMED'
      });
      
      // Debugging: Log the booking object
      console.log('Created Booking:', booking);
      console.log('Booking ID:', booking.id);
      
    // Send WhatsApp Confirmation
    let whatsappSent = false;
    if (twilioClient && process.env.ENABLE_WHATSAPP === 'true') {
      try {
        const twilioPhoneNumber = `whatsapp:+${phoneNumber}`;
        console.log('Sending WhatsApp to:', twilioPhoneNumber);

        await sendWhatsAppConfirmation({
          to: twilioPhoneNumber,
          clientName,
          propertyName,
          priceRange,
          date: bookingDate,
          timeSlot,
          bookingId: booking.id
        });

        whatsappSent = true;
      } catch (whatsappError) {
        console.error('WhatsApp notification failed:', whatsappError);
      }
    }

    return res.status(201).json({
      success: true,
      bookingId: booking.id,
      message: 'Booking created successfully',
      whatsappSent
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message,
        stack: error.stack
      })
    });
  }
};

// Helper function to format Indian phone numbers
function formatIndianPhoneNumber(rawNumber) {
  const digitsOnly = rawNumber.replace(/\D/g, '');

  if (digitsOnly.length === 10) return `91${digitsOnly}`;
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) return `91${digitsOnly.slice(1)}`;
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) return digitsOnly;
  if (digitsOnly.length === 12 && rawNumber.includes('+91')) return digitsOnly;

  return null;
}

async function sendWhatsAppConfirmation({ to, clientName, propertyName, date, timeSlot, bookingId }) {
    if (!twilioClient) {
      console.error('Twilio client is not initialized.');
      return;
    }
  
    const formattedDate = date.toLocaleString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  
    try {
      // ✅ Ensure = require(number is in WhatsApp format
      const fromWhatsApp = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'}`;
      const toWhatsApp = `whatsapp:${to.replace(/whatsapp:/, '')}`; // Remove extra prefix if present
  
      console.log(`Sending WhatsApp from: ${fromWhatsApp} to: ${toWhatsApp}`); // Debugging log
  
      const response = await twilioClient.messages.create({
        body: `Namaste ${clientName},\n\n✅ Your booking is confirmed!\n\n🏠 Property: ${propertyName}\n📅 Date: ${formattedDate}\n📋 Booking ID: ${bookingId}\n\nThank you for choosing us!`,
        from: fromWhatsApp,
        to: toWhatsApp
      });
  
      console.log('WhatsApp message sent successfully:', response.sid);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      console.error('Twilio Error Details:', error.code, error.moreInfo);
    }
  }
      exports.getBooking = async (req, res) => {
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

exports.getPropertyBookings = async (req, res) => {
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

exports.updateBookingStatus = async (req, res) => {
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

exports.deleteBooking = async (req, res) => {
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

exports.getAllBookings = async (req, res) => {
    try {
        console.log("📌 getAllBookings function called!");

        const bookings = await Bookings.getAllbookings();

        console.log("📌 Retrieved bookings:", bookings);

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error("❌ Get all bookings error:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching all bookings',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}