const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: Number,
      required: true
    },
    hospitalName: {
      type: String,
      required: true,
      trim: true
    },
    patientName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    emergencyType: {
      type: String,
      default: 'Emergency Admission',
      trim: true
    },
    bedsBefore: {
      type: Number,
      required: true
    },
    bedsAfter: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Booked', 'Cancelled'],
      default: 'Booked'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admission', admissionSchema);
