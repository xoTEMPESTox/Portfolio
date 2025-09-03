import { useState, useEffect } from 'react';
import { Trophy, Star, Award, Target, Zap, Code, Briefcase, BookOpen } from 'lucide-react';

// Import data for calculating achievements
import skillsData from '../data/skills.json';
import projectsData from '../data/projects.json';
import experienceData from '../data/experience.json';
import hackathonsData from '../data/hackathons.json';
import publicationsData from '../data/publications.json';

const GamificationLayer = () => {
  const [userXP, setUserXP] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [skillLevels, setSkillLevels] = useState({});

  // Calculate XP and achievements based on data
  useEffect(() => {
    calculateXPAndAchievements();
  }, []);

  const calculateXPAndAchievements = () => {
    let totalXP = 0;
    const earnedAchievements = [];
    const calculatedSkillLevels = {};

    // Calculate XP from projects (20 XP per project)
    const projectCount = projectsData.repositories.length + projectsData.demos.length;
    totalXP += projectCount * 20;

    // Calculate XP from experience (100 XP per year)
    const experienceYears = parseInt(experienceData.workExperience.length) || 3;
    totalXP += experienceYears * 100;

    // Calculate XP from publications (50 XP per publication)
    const publicationCount = publicationsData.blogs.length + publicationsData.publications.length;
    totalXP += publicationCount * 50;

    // Calculate XP from hackathons (75 XP per hackathon)
    const hackathonCount = hackathonsData.hackathons.length;
    totalXP += hackathonCount * 75;

    // Calculate skill levels based on categories
    skillsData.skills.forEach(skill => {
      const techCount = skill.technologies.split(',').length;
      const level = Math.min(Math.floor(techCount / 2) + 1, 5);
      calculatedSkillLevels[skill.category] = {
        level,
        xp: techCount * 15,
        maxXP: level * 100,
        technologies: skill.technologies.split(',').map(t => t.trim())
      };
    });

    // Define achievements
    const allAchievements = [
      {
        id: 'first_project',
        name: 'First Steps',
        description: 'Completed your first project',
        icon: <Code className="w-6 h-6" />,
        unlocked: projectCount >= 1,
        rarity: 'common',
        xpReward: 25
      },
      {
        id: 'project_master',
        name: 'Project Master',
        description: 'Completed 10+ projects',
        icon: <Target className="w-6 h-6" />,
        unlocked: projectCount >= 10,
        rarity: 'rare',
        xpReward: 100
      },
      {
        id: 'full_stack_dev',
        name: 'Full-Stack Developer',
        description: 'Mastered both frontend and backend technologies',
        icon: <Zap className="w-6 h-6" />,
        unlocked: skillsData.skills.some(s => s.category.includes('Frontend')) && 
                  skillsData.skills.some(s => s.category.includes('Backend')),
        rarity: 'epic',
        xpReward: 150
      },
      {
        id: 'ai_specialist',
        name: 'AI Specialist',
        description: 'Expertise in AI & Machine Learning',
        icon: <Star className="w-6 h-6" />,
        unlocked: skillsData.skills.some(s => s.category.includes('AI')),
        rarity: 'legendary',
        xpReward: 200
      },
      {
        id: 'hackathon_warrior',
        name: 'Hackathon Warrior',
        description: 'Participated in multiple hackathons',
        icon: <Trophy className="w-6 h-6" />,
        unlocked: hackathonCount >= 2,
        rarity: 'rare',
        xpReward: 125
      },
      {
        id: 'published_author',
        name: 'Published Author',
        description: 'Published articles and research',
        icon: <BookOpen className="w-6 h-6" />,
        unlocked: publicationCount >= 2,
        rarity: 'epic',
        xpReward: 175
      },
      {
        id: 'experienced_dev',
        name: 'Experienced Developer',
        description: '3+ years of professional experience',
        icon: <Briefcase className="w-6 h-6" />,
        unlocked: experienceYears >= 3,
        rarity: 'rare',
        xpReward: 150
      },
      {
        id: 'tech_polyglot',
        name: 'Tech Polyglot',
        description: 'Mastered 10+ technologies',
        icon: <Award className="w-6 h-6" />,
        unlocked: Object.values(calculatedSkillLevels).reduce((acc, skill) => acc + skill.technologies.length, 0) >= 10,
        rarity: 'epic',
        xpReward: 200
      }
    ];

    // Filter unlocked achievements
    const unlockedAchievements = allAchievements.filter(achievement => achievement.unlocked);
    
    // Add XP from achievements
    totalXP += unlockedAchievements.reduce((acc, achievement) => acc + achievement.xpReward, 0);

    setUserXP(totalXP);
    setAchievements(unlockedAchievements);
    setSkillLevels(calculatedSkillLevels);
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100 border-gray-300';
      case 'rare': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'epic': return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'legendary': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getXPLevel = (xp) => {
    return Math.floor(xp / 500) + 1;
  };

  const getXPProgress = (xp) => {
    const currentLevelXP = xp % 500;
    return (currentLevelXP / 500) * 100;
  };

  const SkillBar = ({ skill, data }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Level {data.level}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(data.xp / data.maxXP) * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>{data.xp} XP</span>
        <span>{data.maxXP} XP</span>
      </div>
    </div>
  );

  const AchievementBadge = ({ achievement }) => (
    <div className={`p-3 rounded-lg border-2 ${getRarityColor(achievement.rarity)} transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {achievement.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold truncate">{achievement.name}</h4>
          <p className="text-xs opacity-75 truncate">{achievement.description}</p>
          <span className="text-xs font-medium">+{achievement.xpReward} XP</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
          Developer Stats
        </h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Level {getXPLevel(userXP)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {userXP.toLocaleString()} XP
          </div>
        </div>
      </div>

      {/* Overall XP Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress to Level {getXPLevel(userXP) + 1}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(getXPProgress(userXP))}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${getXPProgress(userXP)}%` }}
          ></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Skill Levels */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-500" />
            Skill Levels
          </h3>
          <div className="space-y-4">
            {Object.entries(skillLevels).map(([skill, data]) => (
              <SkillBar key={skill} skill={skill} data={data} />
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-purple-500" />
            Achievements ({achievements.length})
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {achievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
          
          {achievements.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No achievements unlocked yet!</p>
              <p className="text-sm">Complete projects and gain experience to unlock badges.</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {projectsData.repositories.length + projectsData.demos.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Object.keys(skillLevels).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Skill Areas</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {achievements.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Achievements</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {getXPLevel(userXP)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Level</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationLayer;