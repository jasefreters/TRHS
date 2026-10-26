/* Friendships: who's in my support network, what healthy friendships look like, and talking to
   friends when things go wrong. Stands alone. About 20 minutes. */
RP.registerModule({
  id: "friendships",
  title: "Friendships",
  icon: "🤝",
  about: `**Friendships and the people in your corner.** What healthy friendships look like, who's in your support network, and how to talk to a friend when something goes wrong.

About 20 minutes.`,
  items: [
    {
      type: "read", title: "Why friendships matter",
      text: `Good friendships help us feel like we belong. They make school better and help us through hard times.

But friendships can also be complicated. Sometimes friends pressure us, leave us out or argue with us. Knowing what a **healthy** friendship looks like helps you choose who to spend time with, and how to fix things when they go wrong.`
    },
    {
      type: "sort", q: "Is each of these part of a **healthy** or an **unhealthy** friendship?",
      buckets: ["Healthy", "Unhealthy"],
      cards: [
        { text: "Listens when you talk", bucket: 0 },
        { text: "Respects it when you say no", bucket: 0 },
        { text: "Is happy when good things happen to you", bucket: 0 },
        { text: "Says sorry and fixes things after an argument", bucket: 0 },
        { text: "Pressures you to skip class", bucket: 1 },
        { text: "Shares your secrets to get a laugh", bucket: 1 },
        { text: "Only talks to you when they want something", bucket: 1 },
        { text: "Makes you feel bad about yourself", bucket: 1 }
      ]
    },
    {
      type: "select", title: "A good friend",
      q: "What matters most to you in a friend? Choose **three**.",
      options: ["Loyal", "Kind", "Funny", "Honest", "Trustworthy", "A good listener", "Has my back", "Respects my choices", "Fun to be around", "Supportive when things are hard"],
      pick: 3
    },
    {
      type: "write", title: "My support network",
      q: "Your support network is the people you can go to when things are tough. Write **who** they are, not their name (for example \"my aunt\", \"my Year Adviser\", \"my friend from soccer\").",
      prompts: ["At home, I can talk to…", "At school, I can talk to…", "A friend I can count on is…"]
    },
    {
      type: "story", title: "Left out at lunch",
      start: "start",
      nodes: {
        start: { text: "Your friend didn't save you a seat at lunch and is sitting with another group. You feel hurt and left out.", choices: [
          { label: "Ignore them for the rest of the week", to: "ignore" },
          { label: "Post something about them in the group chat", to: "post" },
          { label: "Ask them privately later: \"Hey, I felt a bit left out at lunch. Is everything okay?\"", to: "talk" }
        ] },
        ignore: { text: "Your friend has no idea why you're upset. The week gets awkward and you both feel worse.", choices: [
          { label: "Talk to them privately and say how you felt", to: "talk" },
          { label: "Keep ignoring them", to: "drift" }
        ] },
        post: { end: "bad", text: "The post gets shared around. Your friend is embarrassed and angry, and now a small problem is a big one. Try a different path." },
        drift: { end: "bad", text: "The friendship drifts apart over something that could have been sorted out with one conversation. Try a different path." },
        talk: { end: "good", text: "Your friend says they didn't realise and that the other group had asked them to sit with them. They save you a seat the next day. Talking about it calmly and privately worked." }
      }
    },
    {
      type: "match", q: "Match each friendship problem to a helpful thing to do.",
      pairs: [
        { left: "A friend wants you to do something you don't want to do", right: "Say no clearly and suggest something else" },
        { left: "You had an argument with a friend", right: "Wait until you're both calm, then talk privately" },
        { left: "Someone is spreading rumours about you", right: "Tell a trusted adult and don't post back" },
        { left: "A friend seems really down", right: "Check in with them and tell an adult if you're worried" }
      ]
    },
    {
      type: "write", title: "Being a good friend",
      prompts: ["One thing I do that makes me a good friend is…", "One way I could be a better friend is…", "If a friendship gets difficult, one thing I'll do is…"]
    }
  ]
});
