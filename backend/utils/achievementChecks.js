const Achievement = require('../models/Achievement');
const User = require('../models/User');

const checkAndAwardAchievements = async (userId) => {
  try {
    // Use .populate() to get the full details of completed modules and unlocked achievements
    const user = await User.findById(userId)
      .populate('completedModules')
      .populate('unlockedAchievements');
      
    if (!user) return;

    // --- CHECK 1: "First Steps" Achievement ---
    const firstStepsAchievement = await Achievement.findOne({ criteriaKey: 'FIRST_STEPS' });
    if (firstStepsAchievement && user.completedModules.length >= 1 && !user.unlockedAchievements.some(a => a._id.equals(firstStepsAchievement._id))) {
      user.unlockedAchievements.push(firstStepsAchievement._id);
      user.points += firstStepsAchievement.points;
      console.log(`Unlocked "First Steps" for user ${user.name}`);
    }

    // --- CHECK 2: "Speed Learner" Achievement ---
    const speedLearnerAchievement = await Achievement.findOne({ criteriaKey: 'SPEED_LEARNER' });
    if (speedLearnerAchievement && user.completedModules.length >= 5 && !user.unlockedAchievements.some(a => a._id.equals(speedLearnerAchievement._id))) {
      user.unlockedAchievements.push(speedLearnerAchievement._id);
      user.points += speedLearnerAchievement.points;
      console.log(`Unlocked "Speed Learner" for user ${user.name}`);
    }

    // --- CHECK 3: "Knowledge Seeker" Achievement ---
    const knowledgeSeekerAchievement = await Achievement.findOne({ criteriaKey: 'KNOWLEDGE_SEEKER' });
    if (knowledgeSeekerAchievement && user.completedModules.length >= 10 && !user.unlockedAchievements.some(a => a._id.equals(knowledgeSeekerAchievement._id))) {
      user.unlockedAchievements.push(knowledgeSeekerAchievement._id);
      user.points += knowledgeSeekerAchievement.points;
      console.log(`Unlocked "Knowledge Seeker" for user ${user.name}`);
    }

    // --- CHECK 4: "Programming Master" Achievement --- (NEW!)
    const progMasterAchievement = await Achievement.findOne({ criteriaKey: 'PROGRAMMING_MASTER' });
    if (progMasterAchievement && !user.unlockedAchievements.some(a => a._id.equals(progMasterAchievement._id))) {
      // Filter the user's completed modules to find only those in the 'Programming' category
      const programmingModules = user.completedModules.filter(
        module => module.category === 'Programming'
      );

      if (programmingModules.length >= 3) {
        user.unlockedAchievements.push(progMasterAchievement._id);
        user.points += progMasterAchievement.points;
        console.log(`Unlocked "Programming Master" for user ${user.name}`);
      }
    }

    // --- CHECK 5: "Point Collector" Achievement --- (NEW!)
    const pointCollectorAchievement = await Achievement.findOne({ criteriaKey: 'POINT_COLLECTOR' });
    if (pointCollectorAchievement && user.points >= 500 && !user.unlockedAchievements.some(a => a._id.equals(pointCollectorAchievement._id))) {
      user.unlockedAchievements.push(pointCollectorAchievement._id);
      user.points += pointCollectorAchievement.points; // Awarding more points for getting points!
      console.log(`Unlocked "Point Collector" for user ${user.name}`);
    }

    await User.findByIdAndUpdate(userId, {
      unlockedAchievements: user.unlockedAchievements,
      points: user.points
    });
    
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
};

module.exports = { checkAndAwardAchievements };