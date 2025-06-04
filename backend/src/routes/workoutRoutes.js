const express = require('express');
const aiService = require('../services/aiService');

const router = express.Router();

// POST /api/workout/generate
router.post('/generate', async (req, res) => {
  try {
    const { personalInfo, goals, gymPhotos } = req.body;
    
    // Validate required data
    if (!personalInfo || !goals) {
      return res.status(400).json({
        error: 'Missing required data',
        message: 'Personal info and goals are required'
      });
    }

    // Combine user data
    const userData = {
      ...personalInfo,
      ...goals
    };

    console.log(`📝 Generating workout for: ${userData.fullName}, Goal: ${userData.primaryGoal}`);
    
    // Generate workout plan
    const workoutPlan = await aiService.generateWorkoutPlan(userData, gymPhotos);
    
    // Log usage for analytics
    console.log(`✅ Plan generated - AI: ${workoutPlan.isAiGenerated}, Tokens: ${workoutPlan.tokensUsed || 0}, Cost: $${workoutPlan.cost || 0}`);
    
    res.json({
      success: true,
      data: workoutPlan,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Workout generation error:', error);
    
    res.status(500).json({
      error: 'Failed to generate workout plan',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/workout/health
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'AI Workout Generator',
    timestamp: new Date().toISOString(),
    aiConfigured: !!process.env.OPENAI_API_KEY
  });
});

module.exports = router;