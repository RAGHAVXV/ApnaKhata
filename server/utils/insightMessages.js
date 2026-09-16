const getRandomMessage = (messages) => {
  return messages[Math.floor(Math.random() * messages.length)];
};

const budgetInsights = {
  onTrack: [
    {
      title: "Nice one, bhai 😎",
      message:
        "Your spending is under control and things are looking good.",
      punchline:
        "Aise hi chala toh month-end pe wallet bhi khush rahega 😂",
    },
    {
      title: "Solid control, yaar 💰",
      message:
        "You're managing this budget pretty well so far.",
      punchline:
        "Paisa sambhalna bhi ek skill hai, apparently 😎",
    },
  ],

  warning: [
    {
      title: "Careful yaar 😅",
      message:
        "You're getting close to your budget limit.",
      punchline:
        "Thoda sambhal ke, warna wallet bolega bas bhai bas 😂",
    },
    {
      title: "Easy there, bhai 👀",
      message:
        "Your spending is getting a little too close to the limit.",
      punchline:
        "Abhi hero banne ka nahi, thoda budget bachane ka time hai 😭",
    },
  ],

  exceeded: [
    {
      title: "Arre yaar, budget cross ho gaya 💀",
      message:
        "You've spent more than you originally planned.",
      punchline:
        "Wallet ko bhi thoda rest de do bhai 😂",
    },
    {
      title: "Bhai, thoda over ho gaya 😭",
      message:
        "Your budget limit has already been crossed.",
      punchline:
        "Paisa kamaana mushkil hai, udaana surprisingly easy 😂",
    },
  ],
};

const goalInsights = {
  completed: [
    {
      title: "Goal done, bhai! 🎉",
      message:
        "You've successfully reached your savings goal.",
      punchline:
        "Ab celebration banta hai, bas budget ke andar 😎",
    },
  ],

  onTrack: [
    {
      title: "You're doing great, yaar 🚀",
      message:
        "Your savings pace is keeping you on track for your goal.",
      punchline:
        "Aise hi chala toh target bolega, main aa raha hoon 😂",
    },
    {
      title: "Solid progress, bhai 🔥",
      message:
        "You're moving towards your goal at a healthy pace.",
      punchline:
        "Consistency rakho, baaki paisa apna kaam karega 😎",
    },
  ],

  behind: [
    {
      title: "Thoda slow chal raha hai yaar 😅",
      message:
        "At your current savings pace, your goal may take longer than planned.",
      punchline:
        "Thoda extra save karo, warna car ka next model aa jayega 😂",
    },
    {
      title: "Goal toh mast hai, bhai 🎯",
      message:
        "You're making progress, but the current pace needs a small push.",
      punchline:
        "Savings ko thoda accelerator do, phir scene set hai 😎",
    },
  ],

  calculating: [
    {
      title: "Just getting started 👀",
      message:
        "We need a little more financial activity to estimate your goal properly.",
      punchline:
        "Thoda data do bhai, crystal ball abhi purchase nahi kiya 😂",
    },
  ],
};

const getBudgetInsight = (status) => {
  return getRandomMessage(
    budgetInsights[status] || budgetInsights.onTrack
  );
};

const getGoalInsight = (status) => {
  return getRandomMessage(
    goalInsights[status] || goalInsights.calculating
  );
};

module.exports = {
  getBudgetInsight,
  getGoalInsight,
};