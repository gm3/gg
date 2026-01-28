// Quest definitions for the Humanity Skill Tree
// Each quest: id, tier (1-3), category, title, description, emoji, points
// Points: { goodness, thoughtfulness, kindness, empathy } - modular stat system

import { STAT_TYPES } from '../state/progressStore.js'

// Helper to assign points based on tier and category
function assignPoints(tier, category) {
  const basePoints = tier === 1 ? 1 : tier === 2 ? 2 : 3
  const points = {
    [STAT_TYPES.GOODNESS]: 0,
    [STAT_TYPES.THOUGHTFULNESS]: 0,
    [STAT_TYPES.KINDNESS]: 0,
    [STAT_TYPES.EMPATHY]: 0
  }

  // Distribute points based on category
  if (category.includes('Social') || category.includes('Kindness')) {
    points[STAT_TYPES.KINDNESS] = basePoints
    points[STAT_TYPES.GOODNESS] = basePoints
  } else if (category.includes('Relationship') || category.includes('Community')) {
    points[STAT_TYPES.THOUGHTFULNESS] = basePoints
    points[STAT_TYPES.EMPATHY] = basePoints
  } else if (category.includes('Environment') || category.includes('Stewardship')) {
    points[STAT_TYPES.GOODNESS] = basePoints
    points[STAT_TYPES.THOUGHTFULNESS] = basePoints
  } else if (category.includes('Self-Development') || category.includes('Civic')) {
    points[STAT_TYPES.THOUGHTFULNESS] = basePoints
    points[STAT_TYPES.EMPATHY] = basePoints
  } else if (category.includes('Volunteering') || category.includes('Leadership')) {
    points[STAT_TYPES.GOODNESS] = basePoints + 1
    points[STAT_TYPES.KINDNESS] = basePoints
  } else {
    // Default distribution
    points[STAT_TYPES.GOODNESS] = basePoints
    points[STAT_TYPES.KINDNESS] = basePoints
  }

  return points
}

export const quests = [
  // Tier 1 — 🌱 Seeds (Everyday Kindness)
  { id: 'smile_stranger', tier: 1, category: 'Social Kindness', title: 'Smile at a stranger', description: 'A simple moment of human recognition.', emoji: '😊', points: assignPoints(1, 'Social Kindness') },
  { id: 'say_thank_you_mean_it', tier: 1, category: 'Social Kindness', title: 'Say thank you and mean it', description: 'Offer a sincere expression of gratitude.', emoji: '🙏', points: assignPoints(1, 'Social Kindness') },
  { id: 'hold_door_open', tier: 1, category: 'Social Kindness', title: 'Hold a door open', description: 'Pause for a moment to make someone\'s path easier.', emoji: '🚪', points: assignPoints(1, 'Social Kindness') },
  { id: 'let_someone_merge', tier: 1, category: 'Social Kindness', title: 'Let someone merge in traffic', description: 'Create a small pocket of patience on the road.', emoji: '🚗', points: assignPoints(1, 'Social Kindness') },
  { id: 'give_genuine_compliment', tier: 1, category: 'Social Kindness', title: 'Give a genuine compliment', description: 'Notice something real and kind about someone.', emoji: '🌟', points: assignPoints(1, 'Social Kindness') },
  { id: 'remember_name', tier: 1, category: 'Social Kindness', title: 'Remember someone\'s name', description: 'Show that you care enough to remember.', emoji: '🧠', points: assignPoints(1, 'Social Kindness') },
  { id: 'ask_how_doing_listen', tier: 1, category: 'Social Kindness', title: 'Ask someone how they\'re doing (and listen)', description: 'Offer your attention without rushing the answer.', emoji: '👂', points: assignPoints(1, 'Social Kindness') },

  { id: 'pick_up_litter', tier: 1, category: 'Personal Conduct', title: 'Pick up litter you didn\'t create', description: 'Leave a space better than you found it.', emoji: '🗑️', points: assignPoints(1, 'Personal Conduct') },
  { id: 'return_shopping_cart', tier: 1, category: 'Personal Conduct', title: 'Return a shopping cart', description: 'A small act of responsibility in a shared space.', emoji: '🛒', points: assignPoints(1, 'Personal Conduct') },
  { id: 'be_on_time_today', tier: 1, category: 'Personal Conduct', title: 'Be on time today', description: 'Respect your own time and others\' time.', emoji: '⏰', points: assignPoints(1, 'Personal Conduct') },
  { id: 'phone_away_conversation', tier: 1, category: 'Personal Conduct', title: 'Put your phone away during a conversation', description: 'Give someone your full attention.', emoji: '📵', points: assignPoints(1, 'Personal Conduct') },
  { id: 'apologize_when_wrong', tier: 1, category: 'Personal Conduct', title: 'Apologize when you\'re wrong', description: 'Own a mistake with honesty and care.', emoji: '💬', points: assignPoints(1, 'Personal Conduct') },

  { id: 'leave_kind_comment_online', tier: 1, category: 'Digital Kindness', title: 'Leave a kind comment online', description: 'Add a little warmth to someone\'s notifications.', emoji: '💻', points: assignPoints(1, 'Digital Kindness') },
  { id: 'avoid_argument_escalation', tier: 1, category: 'Digital Kindness', title: 'Don\'t engage in an argument you could escalate', description: 'Choose peace over being "right" on the internet.', emoji: '🕊️', points: assignPoints(1, 'Digital Kindness') },
  { id: 'share_helpful_info_gently', tier: 1, category: 'Digital Kindness', title: 'Share helpful information without dunking', description: 'Offer clarity without shaming anyone.', emoji: '📚', points: assignPoints(1, 'Digital Kindness') },
  { id: 'credit_original_creator', tier: 1, category: 'Digital Kindness', title: 'Credit an original creator', description: 'Acknowledge whose work you\'re benefiting from.', emoji: '✍️', points: assignPoints(1, 'Digital Kindness') },

  // Tier 2 — 🌿 Growth (Community & Care)
  { id: 'check_in_friend', tier: 2, category: 'Relationships', title: 'Check in on a friend unprompted', description: 'Reach out just to say you care.', emoji: '📱', points: assignPoints(2, 'Relationships') },
  { id: 'write_thank_you_message', tier: 2, category: 'Relationships', title: 'Write a thank-you message', description: 'Tell someone how they\'ve impacted you.', emoji: '💌', points: assignPoints(2, 'Relationships') },
  { id: 'forgive_internally', tier: 2, category: 'Relationships', title: 'Forgive someone (internally)', description: 'Let go a little, even if they never know.', emoji: '🕊️', points: assignPoints(2, 'Relationships') },
  { id: 'offer_help_unasked', tier: 2, category: 'Relationships', title: 'Offer help without being asked', description: 'Notice a need and gently step in.', emoji: '🤝', points: assignPoints(2, 'Relationships') },
  { id: 'reconnect_with_someone', tier: 2, category: 'Relationships', title: 'Reconnect with someone you lost touch with', description: 'Send a small, kind message to reopen a door.', emoji: '🔄', points: assignPoints(2, 'Relationships') },

  { id: 'help_neighbor', tier: 2, category: 'Community', title: 'Help a neighbor with something practical', description: 'Lighten a nearby load in a tangible way.', emoji: '🏡', points: assignPoints(2, 'Community') },
  { id: 'donate_unused_items', tier: 2, category: 'Community', title: 'Donate unused items', description: 'Pass along what you no longer need to someone who does.', emoji: '🎁', points: assignPoints(2, 'Community') },
  { id: 'support_local_business', tier: 2, category: 'Community', title: 'Support a local business intentionally', description: 'Choose to keep your support close to home.', emoji: '🏪', points: assignPoints(2, 'Community') },
  { id: 'attend_community_event', tier: 2, category: 'Community', title: 'Attend a community meeting or event', description: 'Show up where your community gathers.', emoji: '🗣️', points: assignPoints(2, 'Community') },
  { id: 'help_someone_learn_skill', tier: 2, category: 'Community', title: 'Help someone learn a skill', description: 'Share what you know with patience.', emoji: '🧑‍🏫', points: assignPoints(2, 'Community') },

  { id: 'reduce_single_use_plastic_week', tier: 2, category: 'Environment', title: 'Reduce single-use plastic for a week', description: 'Experiment with a gentler footprint.', emoji: '♻️', points: assignPoints(2, 'Environment') },
  { id: 'plant_something', tier: 2, category: 'Environment', title: 'Plant something', description: 'Add a small piece of green to the world.', emoji: '🌱', points: assignPoints(2, 'Environment') },
  { id: 'learn_local_environment_issues', tier: 2, category: 'Environment', title: 'Learn about local environmental issues', description: 'Understand what your area is facing.', emoji: '🌍', points: assignPoints(2, 'Environment') },
  { id: 'participate_cleanup', tier: 2, category: 'Environment', title: 'Participate in a cleanup', description: 'Join others in caring for a shared space.', emoji: '🧹', points: assignPoints(2, 'Environment') },

  { id: 'learn_new_issue', tier: 2, category: 'Self-Development', title: 'Learn about an issue you don\'t fully understand', description: 'Let curiosity guide you into nuance.', emoji: '🔍', points: assignPoints(2, 'Self-Development') },
  { id: 'read_disagree_perspective', tier: 2, category: 'Self-Development', title: 'Read a perspective you disagree with', description: 'Listen without needing to win.', emoji: '📖', points: assignPoints(2, 'Self-Development') },
  { id: 'practice_patience_stress', tier: 2, category: 'Self-Development', title: 'Practice patience in a stressful moment', description: 'Notice the tension and soften your response.', emoji: '🧘', points: assignPoints(2, 'Self-Development') },

  // Tier 3 — 🌳 Stewardship (High Impact)
  { id: 'volunteer_local_org', tier: 3, category: 'Volunteering', title: 'Volunteer with a local organization', description: 'Offer your time where it\'s needed nearby.', emoji: '👐', points: assignPoints(3, 'Volunteering') },
  { id: 'volunteer_disaster_relief', tier: 3, category: 'Volunteering', title: 'Volunteer for disaster relief', description: 'Support people facing urgent hardship.', emoji: '🚑', points: assignPoints(3, 'Volunteering') },
  { id: 'recurring_volunteer_work', tier: 3, category: 'Volunteering', title: 'Commit to recurring volunteer work', description: 'Show up consistently for a cause you care about.', emoji: '📆', points: assignPoints(3, 'Volunteering') },

  { id: 'organize_community_event', tier: 3, category: 'Leadership & Initiative', title: 'Organize a community event', description: 'Gather people around something that matters.', emoji: '📣', points: assignPoints(3, 'Leadership & Initiative') },
  { id: 'start_local_fundraiser', tier: 3, category: 'Leadership & Initiative', title: 'Start a local fundraiser', description: 'Help direct resources toward a need.', emoji: '💰', points: assignPoints(3, 'Leadership & Initiative') },
  { id: 'coordinate_donation_drive', tier: 3, category: 'Leadership & Initiative', title: 'Coordinate a donation drive', description: 'Connect donors with organizations that can use their help.', emoji: '📦', points: assignPoints(3, 'Leadership & Initiative') },
  { id: 'mentor_long_term', tier: 3, category: 'Leadership & Initiative', title: 'Mentor someone long-term', description: 'Invest in someone\'s growth over time.', emoji: '🌟', points: assignPoints(3, 'Leadership & Initiative') },

  { id: 'register_to_vote', tier: 3, category: 'Civic Engagement', title: 'Register to vote (if applicable)', description: 'Prepare yourself to participate in civic decisions.', emoji: '🗳️', points: assignPoints(3, 'Civic Engagement') },
  { id: 'help_someone_register_vote', tier: 3, category: 'Civic Engagement', title: 'Help someone else register', description: 'Make civic participation a bit easier for someone else.', emoji: '🤲', points: assignPoints(3, 'Civic Engagement') },
  { id: 'contact_representative', tier: 3, category: 'Civic Engagement', title: 'Contact a representative about an issue', description: 'Share your perspective with someone in office.', emoji: '📨', points: assignPoints(3, 'Civic Engagement') },
  { id: 'attend_town_hall', tier: 3, category: 'Civic Engagement', title: 'Attend a town hall', description: 'Be present where decisions are discussed.', emoji: '🏛️', points: assignPoints(3, 'Civic Engagement') },

  { id: 'community_garden', tier: 3, category: 'Environmental Stewardship', title: 'Start or help maintain a community garden', description: 'Grow something that others can benefit from.', emoji: '🌳', points: assignPoints(3, 'Environmental Stewardship') },
  { id: 'advocate_environment_cause', tier: 3, category: 'Environmental Stewardship', title: 'Advocate for a local environmental cause', description: 'Use your voice for a healthier place to live.', emoji: '📢', points: assignPoints(3, 'Environmental Stewardship') },
  { id: 'reduce_personal_waste_long_term', tier: 3, category: 'Environmental Stewardship', title: 'Reduce personal waste long-term', description: 'Design habits that gently shrink your footprint.', emoji: '🌎', points: assignPoints(3, 'Environmental Stewardship') }
]

