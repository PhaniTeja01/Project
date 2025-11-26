import React, { useState } from 'react';
import { Sparkles, Wand2, BookOpen, Settings, Play, ArrowRight, User } from 'lucide-react';

export default function StoryForge() {
  const [step, setStep] = useState('home');
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState('');
  const [choices, setChoices] = useState([]);
  const [storyHistory, setStoryHistory] = useState([]);
  const [choiceHistory, setChoiceHistory] = useState([]);

  const [settings, setSettings] = useState({
    worldSetting: 'fantasy',
    characterName: '',
    personality: 'brave',
    endingType: 'happy',
    avatar: '🧙'
  });

  const avatars = {
    '🧙': { name: 'Wizard', class: 'Mage', strengths: 'Master of arcane arts, powerful spells', flaws: 'Physically weak, relies on mana' },
    '⚔️': { name: 'Knight', class: 'Warrior', strengths: 'Heavy armor, honorable, strong defense', flaws: 'Slow movement, bound by code of honor' },
    '🏹': { name: 'Archer', class: 'Ranger', strengths: 'Precise aim, quick reflexes, long range', flaws: 'Weak in close combat, limited arrows' },
    '🗡️': { name: 'Rogue', class: 'Assassin', strengths: 'Stealth master, quick strikes, agile', flaws: 'Low health, distrusted by others' },
    '🛡️': { name: 'Paladin', class: 'Holy Warrior', strengths: 'Divine protection, healing powers', flaws: 'Vulnerable to dark magic, strict morals' },
    '🔮': { name: 'Sorcerer', class: 'Spellcaster', strengths: 'Elemental control, foresight abilities', flaws: 'Unpredictable magic, drains life force' },
    '🐉': { name: 'Dragon Rider', class: 'Beast Master', strengths: 'Flying mount, dragon breath attacks', flaws: 'Dependent on dragon, arrogant' },
    '👑': { name: 'Royal', class: 'Noble', strengths: 'Diplomatic skills, wealthy, commands respect', flaws: 'Inexperienced in combat, targeted by enemies' },
    '🦸': { name: 'Hero', class: 'Champion', strengths: 'Balanced abilities, inspiring presence', flaws: 'Burdened by expectations, overconfident' },
    '🥷': { name: 'Ninja', class: 'Shadow Walker', strengths: 'Silent movement, deadly precision, gadgets', flaws: 'Fragile, operates alone' },
    '🤠': { name: 'Gunslinger', class: 'Outlaw', strengths: 'Quick draw, sharpshooting, intimidating', flaws: 'Reckless, ammunition dependent' },
    '🧝': { name: 'Elf', class: 'Forest Guardian', strengths: 'Nature magic, enhanced senses, immortal', flaws: 'Prideful, weak to iron' },
    '🧛': { name: 'Vampire', class: 'Undead Lord', strengths: 'Superhuman strength, regeneration, charm', flaws: 'Sunlight weakness, blood dependency' },
    '🧚': { name: 'Fairy', class: 'Sprite', strengths: 'Flight, enchantments, nature affinity', flaws: 'Tiny size, easily overpowered' },
    '🤖': { name: 'Cyborg', class: 'Tech Warrior', strengths: 'Enhanced strength, advanced tech, data analysis', flaws: 'EMP vulnerable, requires power source' },
    '��': { name: 'Spirit', class: 'Phantom', strengths: 'Phase through walls, possess objects, immortal', flaws: 'Cannot interact physically, bound to location' }
  };

  const worldSettings = {
    fantasy: '🏰 Fantasy Realm',
    scifi: '🚀 Sci-Fi Universe',
    mystery: '🔍 Mystery World',
    horror: '👻 Horror Setting',
    romance: '💖 Romantic World',
    historical: '⏳ Historical Era',
    cyberpunk: '🌃 Cyberpunk City',
    postapocalyptic: '☢️ Post-Apocalyptic',
    steampunk: '⚙️ Steampunk Era',
    underwater: '🌊 Underwater Kingdom',
    space: '🛸 Space Station',
    western: '🤠 Wild West',
    jungle: '🌴 Jungle Adventure',
    arctic: '❄️ Arctic Wasteland',
    desert: '🏜️ Desert Oasis',
    volcanic: '🌋 Volcanic Islands',
    dreamworld: '💭 Dream Realm',
    timetravel: '⏰ Time Paradox',
    parallel: '🌌 Parallel Universe',
    magical: '✨ Magical Academy'
  };

  const personalities = {
    brave: 'Brave & Heroic',
    cunning: 'Cunning & Strategic',
    kind: 'Kind & Compassionate',
    mysterious: 'Mysterious & Enigmatic',
    rebellious: 'Rebellious & Bold',
    wise: 'Wise & Thoughtful',
    chaotic: 'Chaotic & Unpredictable',
    noble: 'Noble & Honorable',
    ruthless: 'Ruthless & Determined',
    playful: 'Playful & Mischievous',
    stoic: 'Stoic & Calm',
    ambitious: 'Ambitious & Driven',
    paranoid: 'Paranoid & Cautious',
    optimistic: 'Optimistic & Cheerful',
    cynical: 'Cynical & Realistic',
    romantic: 'Romantic & Passionate',
    scholarly: 'Scholarly & Analytical',
    wild: 'Wild & Untamed'
  };

  const endingTypes = {
    happy: 'Happy Ending',
    tragic: 'Tragic Ending',
    bittersweet: 'Bittersweet Ending',
    openended: 'Open-Ended',
    twist: 'Plot Twist Ending',
    heroic: 'Heroic Sacrifice',
    villain: 'Villain Wins',
    redemption: 'Redemption Arc',
    mystery: 'Unresolved Mystery',
    timeloop: 'Time Loop',
    apocalyptic: 'World Ending',
    peaceful: 'Peaceful Resolution',
    cliffhanger: 'Cliffhanger',
    revenge: 'Sweet Revenge',
    bittertriumph: 'Bitter Triumph'
  };

  const generateStory = async (isChoice = false, choiceText = '') => {
    setLoading(true);
    try {
      const currentStoryCount = storyHistory.length;
      let prompt = '';
      const charInfo = avatars[settings.avatar];
      
      if (!isChoice) {
        prompt = `Create a unique story opening matching these details:
Character: ${settings.characterName || 'Hero'} - ${charInfo.name} (${charInfo.class})
Personality: ${personalities[settings.personality]}
World: ${worldSettings[settings.worldSetting]}
Avatar: ${settings.avatar}
Ending: ${endingTypes[settings.endingType]}

Write 150 words max. End with 3 distinct numbered choices.

STORY: [unique story text based on all details above]
CHOICES:
1. [choice related to the scenario]
2. [different choice]
3. [third option]`;
      } else {
        const lastPart = storyHistory[storyHistory.length - 1] || '';
        prompt = `Continue this story (already generated ${currentStoryCount} chapters):
Character: ${settings.characterName || 'Hero'} - ${charInfo.name} (${charInfo.class}), personality: ${personalities[settings.personality]}
World: ${worldSettings[settings.worldSetting]}
Previous: ${lastPart.substring(0, 150)}...
Choice made: ${choiceText}

${currentStoryCount >= 2 ? `End the story with ${endingTypes[settings.endingType]} ending.` : 'Continue the story (150 words). Add 3 new numbered choices related to the scenario.'}

STORY: [text that logically continues from the choice]
${currentStoryCount >= 2 ? '' : 'CHOICES:\n1. [next choice]\n2. [alternative]\n3. [third option]'}`;
      }

      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          const waitTime = errorData.message?.match(/\d+/)?.[0] || 'a few';
          throw new Error(`Rate limited. Please wait ${waitTime} seconds before trying again.`);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const fullResponse = data.content.map(item => (item.type === 'text' ? item.text : '')).join('\n');

      const storyMatch = fullResponse.match(/STORY:\s*([\s\S]*?)(?=CHOICES:|$)/);
      const choicesMatch = fullResponse.match(/CHOICES:\s*([\s\S]*)/);

      if (storyMatch) {
        const newStory = storyMatch[1].trim();
        setStory(newStory);
        setStoryHistory(prev => [...prev, newStory]);
      }

      // Always try to parse choices if they exist in the response
      if (choicesMatch) {
        const choicesText = choicesMatch[1].trim();
        const choicesList = choicesText
          .split('\n')
          .filter(line => line.match(/^\d+\./))
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .filter(choice => choice.length > 0);
        
        // Only show choices if we have less than 3 chapters (demo mode has 3 max)
        if (choicesList.length > 0 && currentStoryCount < 2) {
          setChoices(choicesList);
        } else {
          setChoices([]);
        }
      } else {
        setChoices([]);
      }

      setStep('playing');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = (choiceText) => {
    setChoiceHistory(prev => [...prev, choiceText]);
    generateStory(true, choiceText);
  };

  const resetGame = () => {
    setStep('home');
    setStory('');
    setChoices([]);
    setStoryHistory([]);
    setChoiceHistory([]);
    setSettings({
      worldSetting: 'fantasy',
      characterName: '',
      personality: 'brave',
      endingType: 'happy',
      avatar: '🧙'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white">
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              StoryForge
            </h1>
          </div>
          {step !== 'home' && (
            <button onClick={resetGame} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
              New Game
            </button>
          )}
        </div>
      </header>

      {step === 'home' && (
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="mb-8 animate-bounce">
            <Wand2 className="w-20 h-20 mx-auto text-cyan-400" />
          </div>
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
            Your Story Awaits
          </h2>
          <p className="text-xl text-teal-200 mb-12">
            Generate unique, AI-powered interactive stories tailored to your imagination
          </p>
          <button
            onClick={() => setStep('customize')}
            className="group px-8 py-4 bg-gradient-to-r from-cyan-400 to-emerald-500 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <Play className="w-6 h-6" />
            Start Your Adventure
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="grid grid-cols-3 gap-6 mt-20 text-left">
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
              <Sparkles className="w-10 h-10 text-cyan-400 mb-3" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-teal-200">Every story is unique and generated just for you</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
              <Settings className="w-10 h-10 text-emerald-400 mb-3" />
              <h3 className="text-xl font-semibold mb-2">Fully Customizable</h3>
              <p className="text-teal-200">Control every aspect of your narrative</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
              <BookOpen className="w-10 h-10 text-teal-400 mb-3" />
              <h3 className="text-xl font-semibold mb-2">Interactive</h3>
              <p className="text-teal-200">Your choices shape the story's direction</p>
            </div>
          </div>
        </div>
      )}

      {step === 'customize' && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h2 className="text-4xl font-bold mb-2">Customize Your Story</h2>
            <p className="text-teal-200">Shape every detail of your adventure</p>
          </div>

          <div className="space-y-6 overflow-y-auto" style={{maxHeight: 'calc(100vh - 250px)'}}>
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                Choose Your Avatar
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {Object.entries(avatars).map(([emoji, data]) => (
                  <button
                    key={emoji}
                    onClick={() => setSettings({...settings, avatar: emoji})}
                    className={`p-3 rounded-lg transition-all hover:scale-105 ${
                      settings.avatar === emoji
                        ? 'bg-gradient-to-r from-cyan-400 to-emerald-500 shadow-lg scale-105'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    title={`${data.name} - ${data.class}`}
                  >
                    <div className="text-3xl mb-1">{emoji}</div>
                    <div className="text-xs font-semibold truncate">{data.name}</div>
                    <div className="text-xs text-cyan-300 opacity-80 truncate">{data.class}</div>
                  </button>
                ))}
              </div>
              
              {settings.avatar && (
                <div className="mt-4 p-4 rounded-lg bg-white/5 border border-cyan-400/30">
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{settings.avatar}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1">
                        {avatars[settings.avatar].name} <span className="text-cyan-400">• {avatars[settings.avatar].class}</span>
                      </h4>
                      <div className="text-sm space-y-1">
                        <p className="text-emerald-300">
                          <span className="font-semibold">💪 Strengths:</span> {avatars[settings.avatar].strengths}
                        </p>
                        <p className="text-orange-300">
                          <span className="font-semibold">⚠️ Flaws:</span> {avatars[settings.avatar].flaws}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <label className="block text-lg font-semibold mb-3">Character Name</label>
              <input
                type="text"
                value={settings.characterName}
                onChange={(e) => setSettings({...settings, characterName: e.target.value})}
                placeholder="Enter your hero's name..."
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-cyan-400 focus:outline-none transition-all"
              />
            </div>

            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <label className="block text-lg font-semibold mb-3">World Setting (20 options)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {Object.entries(worldSettings).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSettings({...settings, worldSetting: key})}
                    className={`px-3 py-2.5 rounded-lg transition-all text-sm whitespace-nowrap ${
                      settings.worldSetting === key
                        ? 'bg-gradient-to-r from-cyan-400 to-emerald-500 shadow-lg font-semibold'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <label className="block text-lg font-semibold mb-3">Character Personality (18 options)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {Object.entries(personalities).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSettings({...settings, personality: key})}
                    className={`px-3 py-2.5 rounded-lg transition-all text-sm ${
                      settings.personality === key
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg font-semibold'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <label className="block text-lg font-semibold mb-3">Ending Type (15 options)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {Object.entries(endingTypes).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSettings({...settings, endingType: key})}
                    className={`px-3 py-2.5 rounded-lg transition-all text-sm ${
                      settings.endingType === key
                        ? 'bg-gradient-to-r from-teal-400 to-cyan-500 shadow-lg font-semibold'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateStory}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-cyan-400 to-emerald-500 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sticky bottom-0 mt-4"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Your Story...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate Story
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 'playing' && (
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">{settings.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-teal-300">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-sm font-semibold">
                    Chapter {storyHistory.length} • {settings.characterName || 'Hero'}
                  </span>
                </div>
              </div>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{story}</p>
            </div>
          </div>

          {choices.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-4">What will you do?</h3>
              {choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  disabled={loading}
                  className="w-full p-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-500 flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-lg group-hover:text-cyan-300 transition-colors">
                      {choice}
                    </span>
                  </div>
                </button>
              ))}
              {loading && (
                <div className="text-center py-4">
                  <div className="inline-block w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <p className="mt-2 text-teal-300">Weaving your tale...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                The End
              </h3>
              <p className="text-teal-200 mb-8">Your story has reached its conclusion</p>
              
              <div className="text-left mb-8 space-y-6">
                <h4 className="text-2xl font-bold mb-4 text-center">Your Complete Journey</h4>
                {storyHistory.map((segment, index) => (
                  <div key={index} className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">{settings.avatar}</div>
                      <div className="flex items-center gap-2 text-teal-300">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm font-semibold">Chapter {index + 1}</span>
                      </div>
                    </div>
                    <p className="text-base leading-relaxed mb-4 whitespace-pre-wrap">{segment}</p>
                    
                    {choiceHistory[index] && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-500 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                            ✓
                          </div>
                          <div>
                            <p className="text-xs text-teal-300 mb-1">You chose:</p>
                            <p className="text-sm text-cyan-300 font-medium">{choiceHistory[index]}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <button
                onClick={resetGame}
                className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-emerald-500 rounded-full font-semibold hover:shadow-2xl hover:shadow-emerald-500/50 transition-all"
              >
                Create Another Story
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
