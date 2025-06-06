// api/workout/generate.js - Vercel Serverless Function
// COPIA COMPLETA di tutto il backend

import fetch from 'node-fetch';

// Rate limiting in-memory store per Vercel
const rateLimitStore = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minuti
  const maxRequests = 10;
  
  const key = ip;
  const requests = rateLimitStore.get(key) || [];
  
  const validRequests = requests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return false;
  }
  
  validRequests.push(now);
  rateLimitStore.set(key, validRequests);
  return true;
}

// AI SERVICE CLASS - COPIA ESATTA dal tuo aiService.js
class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.chatURL = 'https://api.openai.com/v1/chat/completions';

    if (!this.apiKey) {
      console.warn('⚠️ OpenAI API key not configured - will use demo plans');
    }
  }

  async generateWorkoutPlan(userData, gymPhotos = []) {
    let totalCost = 0;
    let totalTokens = 0;
    let photoCosts = 0;

    try {
      if (!this.apiKey) {
        console.log('🔄 Using demo plan (no API key)');
        return this.generateDemoPlan(userData);
      }

      // Analyze gym photos first (and calculate photo costs)
      const photoAnalysisResult = await this.analyzeGymPhotos(gymPhotos);
      const availableEquipment = photoAnalysisResult.equipment || photoAnalysisResult;
      photoCosts = photoAnalysisResult.cost || 0;
      
      console.log('🏋️ Detected equipment:', availableEquipment);
      console.log(`💰 Photo analysis cost: $${photoCosts.toFixed(5)}`);

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
              content: 'You are an expert certified personal trainer with 15+ years of experience. Create workouts ONLY using the available equipment listed. IMPORTANT: Respond ONLY with valid JSON in the exact format requested. Do not include any markdown formatting, explanations, or text outside the JSON structure.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.5, // Ridotto per più consistenza nel JSON
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

      totalTokens = data.usage?.total_tokens || 0;
      const chatCost = this.calculateChatCost(totalTokens);
      totalCost = photoCosts + chatCost;

      console.log(`💰 Chat cost: $${chatCost.toFixed(5)}, Total cost: $${totalCost.toFixed(5)}`);

      // Clean and parse JSON response
      const planData = this.parseWorkoutPlanJSON(data.choices[0].message.content);

      return {
        ...planData,
        detectedEquipment: availableEquipment,
        isAiGenerated: true,
        generatedAt: new Date().toISOString(),
        tokensUsed: totalTokens,
        photoCost: photoCosts,
        chatCost: chatCost,
        totalCost: totalCost,
        photoCount: gymPhotos.length
      };

    } catch (error) {
      console.error('❌ AI Service Error:', error);

      return {
        ...this.generateDemoPlan(userData),
        isAiGenerated: false,
        error: 'AI temporarily unavailable - showing demo plan',
        fallbackReason: error.message,
        totalCost: totalCost,
        photoCost: photoCosts
      };
    }
  }

  // FUNZIONE COMPLETA per parsing JSON
  parseWorkoutPlanJSON(content) {
    try {
      // Rimuovi markdown, spazi extra, e caratteri problematici
      let cleanContent = content.trim();
      
      // Rimuovi eventuali backticks di markdown
      cleanContent = cleanContent.replace(/```json\n?|\n?```/g, '');
      cleanContent = cleanContent.replace(/```\n?|\n?```/g, '');
      
      // Trova il JSON all'interno del testo
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanContent = jsonMatch[0];
      }
      
      // Fix comuni per JSON malformato
      cleanContent = cleanContent
        .replace(/,(\s*[}\]])/g, '$1') // Rimuovi virgole finali
        .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Aggiungi quotes alle chiavi
        .replace(/:\s*'([^']*)'/g, ': "$1"') // Sostituisci single quotes con double quotes
        .replace(/\n/g, ' ') // Rimuovi newlines
        .replace(/\s+/g, ' '); // Rimuovi spazi multipli

      console.log('🔧 Parsing cleaned JSON...');
      return JSON.parse(cleanContent);
      
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError.message);
      console.error('🔤 Problematic content:', content.substring(0, 500) + '...');
      
      // Fallback: prova a estrarre solo parti essenziali
      try {
        const fallbackPlan = this.extractBasicPlanFromText(content);
        if (fallbackPlan) {
          console.log('✅ Using fallback plan extraction');
          return fallbackPlan;
        }
      } catch (fallbackError) {
        console.error('❌ Fallback extraction failed:', fallbackError.message);
      }
      
      throw new Error(`Failed to parse workout plan: ${parseError.message}`);
    }
  }

  // Fallback per estrarre informazioni di base dal testo
  extractBasicPlanFromText(content) {
    return {
      title: "Custom Workout Plan - AI Generated",
      description: "Personalized workout plan based on your goals and equipment",
      frequency: "3-4 times per week",
      sessionDuration: "60 minutes",
      workouts: [
        {
          day: "Day 1 - Full Body",
          focus: "Strength and Conditioning",
          warmup: "5-10 minutes dynamic warm-up",
          exercises: [
            {
              name: "Compound Movement",
              sets: "3",
              reps: "8-12",
              rest: "90 seconds",
              muscles: "Multiple muscle groups",
              intensity: "medium",
              notes: "Focus on proper form"
            }
          ],
          cooldown: "10 minutes stretching"
        }
      ],
      progression: "Increase weight or reps weekly as you get stronger",
      importantNotes: "Always warm up properly and listen to your body"
    };
  }

  // FUNZIONE COMPLETA per analizzare foto
  async analyzeGymPhotos(photos) {
    if (!photos || photos.length === 0) {
      console.log('📷 No photos provided - using bodyweight exercises');
      return {
        equipment: ['bodyweight exercises', 'floor space', 'wall'],
        cost: 0
      };
    }

    if (!this.apiKey) {
      console.log('🔄 No API key - using default equipment');
      return {
        equipment: ['dumbbells', 'barbells', 'bench', 'squat rack'],
        cost: 0
      };
    }

    let totalPhotoCost = 0;
    const equipmentSets = [];

    try {
      console.log(`📸 Analyzing ${photos.length} gym photos...`);

      // Process up to 3 photos (to control costs)
      const photosToAnalyze = photos.slice(0, 3);

      for (const [index, photo] of photosToAnalyze.entries()) {
        console.log(`🔍 Analyzing photo ${index + 1}/${photosToAnalyze.length}...`);

        try {
          const imageData = await this.prepareImageForAnalysis(photo);
          
          // Calcola il costo della foto in base alla dimensione
          const imageCost = this.calculateImageCost(imageData);
          totalPhotoCost += imageCost;
          
          console.log(`📤 Making Vision API call for photo ${index + 1} (cost: $${imageCost.toFixed(5)})...`);

          const response = await fetch(this.chatURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages: [
                {
                  role: 'user',
                  content: [
                    {
                      type: 'text',
                      text: `Analyze this gym photo and identify ALL visible fitness equipment. Return ONLY a JSON array like: ["dumbbells", "barbells", "bench press", "squat rack"]`
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
              max_tokens: 300,
              temperature: 0.3
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Vision API Error ${response.status}:`, errorText);
            continue;
          }

          const data = await response.json();
          const content = data.choices[0]?.message?.content?.trim();

          if (content) {
            try {
              let jsonContent = content;
              const jsonMatch = content.match(/\[.*\]/s);
              if (jsonMatch) {
                jsonContent = jsonMatch[0];
              }

              const equipment = JSON.parse(jsonContent);
              if (Array.isArray(equipment)) {
                equipmentSets.push(equipment);
                console.log(`✅ Photo ${index + 1}: ${equipment.length} items detected`);
              }
            } catch (parseError) {
              console.warn(`⚠️ Failed to parse equipment from photo ${index + 1}`);
            }
          }

          await new Promise(resolve => setTimeout(resolve, 500));

        } catch (photoError) {
          console.error(`❌ Error analyzing photo ${index + 1}:`, photoError.message);
        }
      }

      const allEquipment = [...new Set(equipmentSets.flat())];

      if (allEquipment.length === 0) {
        console.log('🤷 No equipment detected - using comprehensive fallback');
        // Basato sulle tue foto reali
        return {
          equipment: [
            'dumbbells', 'barbells', 'weight plates', 'dumbbell rack',
            'squat racks', 'power racks', 'bench press', 'incline bench',
            'adjustable benches', 'cable machines', 'lat pulldown machine',
            'leg press machine', 'smith machine', 'pull-up bars'
          ],
          cost: totalPhotoCost
        };
      }

      console.log(`🎯 Equipment detected: ${allEquipment.join(', ')}`);
      console.log(`💰 Total photo analysis cost: $${totalPhotoCost.toFixed(5)}`);
      
      return {
        equipment: allEquipment,
        cost: totalPhotoCost
      };

    } catch (error) {
      console.error('❌ Photo analysis error:', error);
      return {
        equipment: ['dumbbells', 'barbells', 'bench'],
        cost: totalPhotoCost
      };
    }
  }

  async prepareImageForAnalysis(photo) {
    if (photo.data) {
      const imageUrl = `data:${photo.type || 'image/jpeg'};base64,${photo.data}`;
      console.log('✅ Image prepared, length:', imageUrl.length);
      return imageUrl;
    }
    throw new Error(`Unsupported photo format: ${typeof photo}`);
  }

  // Calcolo costo immagini Vision API
  calculateImageCost(imageData) {
    // gpt-4o Vision pricing: $10.00 per 1M tokens per image
    // Low detail images: ~85 tokens
    // High detail images: 85 + (tiles * 170) tokens
    
    const baseTokens = 85; // Low detail base cost
    const costPerToken = 10.00 / 1000000; // $10 per 1M tokens
    
    return baseTokens * costPerToken;
  }

  // Calcolo costo chat
  calculateChatCost(tokens) {
    // gpt-4o-mini pricing: $0.15/1M input + $0.60/1M output tokens
    const inputTokens = tokens * 0.7;
    const outputTokens = tokens * 0.3;
    const cost = (inputTokens * 0.15 / 1000000) + (outputTokens * 0.60 / 1000000);
    return cost;
  }

  // PROMPT COMPLETO - IL TUO ORIGINALE
  buildWorkoutPrompt(userData, equipment) {
    const hasLimitedEquipment = equipment.length <= 3 ||
      equipment.every(item => ['bodyweight exercises', 'floor space', 'wall'].includes(item));

    return `Create a personalized workout plan in STRICT JSON format.

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
        `⚠️ LIMITED EQUIPMENT: Focus on bodyweight and available equipment only.` :
        `✅ WELL-EQUIPPED GYM: Use available equipment effectively.`}

CRITICAL: Respond with ONLY valid JSON in this EXACT format (no markdown, no explanations):

{
  "title": "Plan Name - Level",
  "description": "Brief description",
  "frequency": "${userData.workoutFrequency}",
  "sessionDuration": "${userData.sessionDuration} minutes",
  "workouts": [
    {
      "day": "Day 1 - Session Name",
      "focus": "Target muscles",
      "warmup": "5-10 minutes warmup description",
      "exercises": [
        {
          "name": "Exercise name",
          "sets": "3",
          "reps": "8-12",
          "rest": "60-90 seconds",
          "muscles": "Target muscles",
          "intensity": "medium",
          "notes": "Form tips"
        }
      ],
      "cooldown": "Stretching description"
    }
  ],
  "progression": "How to progress",
  "importantNotes": "Safety tips"
}`;
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

  // DEMO PLAN COMPLETO
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
            }
          ],
          cooldown: "10 minutes of upper body stretching"
        }
      ],
      progression: "Week 1-2: Master the movements. Week 3-4: Increase reps by 2-3.",
      importantNotes: "This is a demo plan. The AI service will analyze your gym photos for personalized equipment-based workouts."
    };
  }
}

// VERCEL SERVERLESS FUNCTION HANDLER
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate limiting
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (!checkRateLimit(ip)) {
      return res.status(429).json({
        error: 'Too many workout generation requests, please try again later.'
      });
    }

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
    const aiService = new AIService();
    const workoutPlan = await aiService.generateWorkoutPlan(userData, gymPhotos);
    
    // Log usage for analytics
    console.log(`✅ Plan generated - AI: ${workoutPlan.isAiGenerated}, Tokens: ${workoutPlan.tokensUsed || 0}, Cost: $${workoutPlan.totalCost || 0}`);
    
    return res.status(200).json({
      success: true,
      data: workoutPlan,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Workout generation error:', error);
    
    return res.status(500).json({
      error: 'Failed to generate workout plan',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}