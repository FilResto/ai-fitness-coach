const fetch = require('node-fetch');
const fs = require('fs').promises;

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.chatURL = 'https://api.openai.com/v1/chat/completions';

    if (!this.apiKey) {
      console.warn('⚠️ OpenAI API key not configured - will use demo plans');
    }
  }

  async generateWorkoutPlan(userData, gymPhotos = []) {
    try {
      if (!this.apiKey) {
        console.log('🔄 Using demo plan (no API key)');
        return this.generateDemoPlan(userData);
      }

      // Analyze gym photos first
      const availableEquipment = await this.analyzeGymPhotos(gymPhotos);
      console.log('🏋️ Detected equipment:', availableEquipment);

      const prompt = this.buildWorkoutPrompt(userData, availableEquipment);

      console.log('🤖 Generating AI workout plan...');

      const response = await fetch(this.chatURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert certified personal trainer with 15+ years of experience. Always provide safe, scientifically accurate, and personalized advice. Create workouts ONLY using the available equipment listed. Respond ONLY with valid JSON in the exact format requested.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from OpenAI');
      }

      const planData = JSON.parse(data.choices[0].message.content.trim());

      return {
        ...planData,
        detectedEquipment: availableEquipment,
        isAiGenerated: true,
        generatedAt: new Date().toISOString(),
        tokensUsed: data.usage?.total_tokens || 0,
        cost: this.calculateCost(data.usage?.total_tokens || 0)
      };

    } catch (error) {
      console.error('❌ AI Service Error:', error);

      return {
        ...this.generateDemoPlan(userData),
        isAiGenerated: false,
        error: 'AI temporarily unavailable - showing demo plan',
        fallbackReason: error.message
      };
    }
  }

async analyzeGymPhotos(photos) {
  if (!photos || photos.length === 0) {
    console.log('📷 No photos provided - using bodyweight exercises');
    return ['bodyweight exercises', 'floor space', 'wall'];
  }

  if (!this.apiKey) {
    console.log('🔄 No API key - using default equipment');
    return ['dumbbells', 'barbells', 'bench', 'squat rack'];
  }

  try {
    console.log(`📸 Analyzing ${photos.length} gym photos...`);

    // Process up to 3 photos (to control costs)
    const photosToAnalyze = photos.slice(0, 3);
    const equipmentSets = [];

    for (const [index, photo] of photosToAnalyze.entries()) {
      console.log(`🔍 Analyzing photo ${index + 1}/${photosToAnalyze.length}...`);

      try {
        // Convert photo to base64 if it's a file object
        const imageData = await this.prepareImageForAnalysis(photo);
        console.log(`📤 Making Vision API call for photo ${index + 1}...`);

        const response = await fetch(this.chatURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o', // Assicurati che sia gpt-4o per Vision
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `Analyze this gym photo and identify ALL visible fitness equipment. Be very specific and comprehensive.

Return ONLY a JSON array of equipment names, like:
["dumbbells", "barbells", "bench press", "squat rack", "lat pulldown machine", "treadmill"]

Be specific with machine types.`
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: imageData,
                      detail: 'low'
                    }
                  }
                ]
              }
            ],
            max_tokens: 500, // Aumentato da 300
            temperature: 0.3
          })
        });

        console.log(`📥 Vision API response status: ${response.status}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ Vision API Error ${response.status}:`, errorText);
          continue;
        }

        const data = await response.json();
        console.log(`📊 Vision API response:`, JSON.stringify(data, null, 2));
        
        const content = data.choices[0]?.message?.content?.trim();
        console.log(`🔤 Raw content from API:`, content);

        if (content) {
          try {
            // Prova a estrarre solo la parte JSON se c'è altro testo
            let jsonContent = content;
            
            // Se c'è testo prima o dopo il JSON, prova a estrarre solo il JSON
            const jsonMatch = content.match(/\[.*\]/s);
            if (jsonMatch) {
              jsonContent = jsonMatch[0];
            }
            
            console.log(`🔧 Trying to parse:`, jsonContent);
            const equipment = JSON.parse(jsonContent);
            
            if (Array.isArray(equipment)) {
              equipmentSets.push(equipment);
              console.log(`✅ Photo ${index + 1} analysis: ${equipment.length} items detected -`, equipment);
            } else {
              console.warn(`⚠️ Photo ${index + 1}: Parsed content is not an array:`, typeof equipment);
            }
          } catch (parseError) {
            console.error(`❌ Failed to parse equipment list from photo ${index + 1}:`, parseError.message);
            console.error(`🔤 Content that failed to parse:`, content);
          }
        } else {
          console.warn(`⚠️ Photo ${index + 1}: No content in response`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (photoError) {
        console.error(`❌ Error analyzing photo ${index + 1}:`, photoError);
      }
    }

    // Combine and deduplicate equipment from all photos
    const allEquipment = [...new Set(equipmentSets.flat())];

    if (allEquipment.length === 0) {
      console.log('🤷 No equipment detected - using fallback');
      return ['bodyweight exercises', 'floor space'];
    }

    console.log(`🎯 Final equipment list: ${allEquipment.join(', ')}`);
    return allEquipment;

  } catch (error) {
    console.error('❌ Photo analysis error:', error);
    return ['dumbbells', 'barbells', 'bench']; // Fallback to basic equipment
  }
}

  async prepareImageForAnalysis(photo) {
    console.log('📸 Photo data type:', typeof photo);
    console.log('📸 Photo keys:', Object.keys(photo));
    // If photo is already a base64 string, return it
    if (typeof photo === 'string' && photo.startsWith('data:image')) {
      return photo;
    }

    // If photo is a file object with base64 data
  if (photo.data) {
    const imageUrl = `data:${photo.type || 'image/jpeg'};base64,${photo.data}`;
    console.log('✅ Image prepared, length:', imageUrl.length);
    console.log('🔍 Image URL preview:', imageUrl.substring(0, 100) + '...');
    return imageUrl;
  }

    // If photo is a Buffer
    if (Buffer.isBuffer(photo)) {
      return `data:image/jpeg;base64,${photo.toString('base64')}`;
    }

    // If photo has a path, read the file
    if (photo.path) {
      const fileBuffer = await fs.readFile(photo.path);
      return `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
    }

    throw new Error(`Unsupported photo format: ${typeof photo}`);
  }

  buildWorkoutPrompt(userData, equipment) {
    const hasLimitedEquipment = equipment.length <= 3 ||
      equipment.every(item => ['bodyweight exercises', 'floor space', 'wall'].includes(item));

    return `You are an expert certified personal trainer. Create a personalized workout plan.

PERSONAL DATA:
- Age: ${userData.age} years
- Experience: ${userData.fitnessExperience}
- Primary Goal: ${userData.primaryGoal}
- Frequency: ${userData.workoutFrequency}
- Session Duration: ${userData.sessionDuration} minutes
- Muscle Focus: ${userData.muscleGroupFocus}
- Health Issues: ${userData.healthIssues || 'none'}

AVAILABLE EQUIPMENT:
${equipment.join(', ')}

${hasLimitedEquipment ?
        `⚠️ LIMITED EQUIPMENT DETECTED: Focus on bodyweight exercises, functional movements, and creative use of available space. Make the workout challenging and effective despite equipment limitations.` :
        `✅ WELL-EQUIPPED GYM: Use the available equipment to create varied, progressive workouts.`}

IMPORTANT: Create exercises ONLY using the equipment listed above. Do NOT suggest exercises requiring equipment not in the list.

Create ${this.getWorkoutDays(userData.workoutFrequency)} workout days.

RESPONSE FORMAT (JSON):
{
  "title": "Plan [Goal] - [Level]",
  "description": "Brief plan description noting equipment used",
  "frequency": "${userData.workoutFrequency}",
  "sessionDuration": "${userData.sessionDuration} minutes",
  "workouts": [
    {
      "day": "Day 1 - Session Name",
      "focus": "Main muscle groups",
      "warmup": "5-10 minutes using available equipment",
      "exercises": [
        {
          "name": "Exercise name (using available equipment)",
          "sets": "3-4",
          "reps": "8-15",
          "rest": "60-120 seconds",
          "muscles": "Target muscles",
          "intensity": "high/medium/low",
          "notes": "Form cues and equipment-specific tips"
        }
      ],
      "cooldown": "Stretching and mobility"
    }
  ],
  "progression": "How to progress with available equipment",
  "importantNotes": "Safety tips specific to available equipment"
}

Respond ONLY with valid JSON, no other text.`;
  }

  getWorkoutDays(frequency) {
    switch (frequency) {
      case '1-2': return 2;
      case '3-4': return 3;
      case '5-6': return 4;
      case 'daily': return 5;
      default: return 3;
    }
  }

  generateDemoPlan(userData) {
    return {
      title: `${userData.primaryGoal?.replace('_', ' ').toUpperCase() || 'FITNESS'} Plan - ${userData.fitnessExperience?.toUpperCase() || 'DEMO'}`,
      description: `Personalized ${userData.sessionDuration || 60}-minute workout plan (Demo version)`,
      frequency: userData.workoutFrequency || '3-4 times per week',
      sessionDuration: `${userData.sessionDuration || '60'} minutes`,
      detectedEquipment: ['demo equipment'],
      workouts: [
        {
          day: "Day 1 - Upper Body Strength",
          focus: "Chest, Shoulders, Triceps",
          warmup: "5-10 minutes of arm circles, light cardio, and dynamic stretching",
          exercises: [
            {
              name: "Push-ups",
              sets: "3",
              reps: "10-15",
              rest: "60 seconds",
              muscles: "Chest, Shoulders, Triceps",
              intensity: "medium",
              notes: "Keep core tight, modify on knees if needed"
            },
            {
              name: "Pike Push-ups",
              sets: "3",
              reps: "8-12",
              rest: "60 seconds",
              muscles: "Shoulders, Upper Chest",
              intensity: "medium",
              notes: "Elevate feet for more difficulty"
            }
          ],
          cooldown: "10 minutes of upper body stretching"
        },
        {
          day: "Day 2 - Lower Body Power",
          focus: "Quads, Glutes, Hamstrings",
          warmup: "10 minutes of leg swings, bodyweight squats, and activation exercises",
          exercises: [
            {
              name: "Bodyweight Squats",
              sets: "4",
              reps: "15-20",
              rest: "90 seconds",
              muscles: "Quads, Glutes, Core",
              intensity: "medium",
              notes: "Keep chest up, weight in heels"
            },
            {
              name: "Single-Leg Glute Bridges",
              sets: "3",
              reps: "12 each leg",
              rest: "60 seconds",
              muscles: "Glutes, Hamstrings",
              intensity: "medium",
              notes: "Focus on hip drive and glute activation"
            }
          ],
          cooldown: "15 minutes of lower body stretching and hip mobility"
        }
      ],
      progression: "Week 1-2: Master the movements. Week 3-4: Increase reps by 2-3. Week 5-6: Add additional sets or harder variations.",
      importantNotes: "This is a demo plan. The AI service will analyze your gym photos for personalized equipment-based workouts."
    };
  }

  calculateCost(tokens) {
    // gpt-4o-mini pricing: $0.15/1M input + $0.60/1M output tokens
    const inputTokens = tokens * 0.7;
    const outputTokens = tokens * 0.3;
    const cost = (inputTokens * 0.15 / 1000000) + (outputTokens * 0.60 / 1000000);
    return Math.round(cost * 100000) / 100000;
  }
}

module.exports = new AIService();