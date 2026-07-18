const express = require('express');
const Admission = require('../models/Admission');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      hospitalId,
      hospitalName,
      patientName,
      phone,
      emergencyType = 'Emergency Admission',
      availableBeds
    } = req.body;

    if (!hospitalId || !hospitalName || !patientName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Hospital, patient name, and phone are required.'
      });
    }

    const bedsBefore = Number(availableBeds);
    if (!Number.isFinite(bedsBefore) || bedsBefore <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No beds available for this hospital.'
      });
    }

    const admission = await Admission.create({
      hospitalId,
      hospitalName,
      patientName,
      phone,
      emergencyType,
      bedsBefore,
      bedsAfter: bedsBefore - 1
    });

    res.status(201).json({
      success: true,
      message: 'Emergency admission booked successfully.',
      admission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to book admission.',
      error: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json({ success: true, admissions });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admissions.',
      error: error.message
    });
  }
});

module.exports = router;
