/* Online Conflict and Social Media. The Student Code of Conduct covers online behaviour too. Stands alone. */
RP.registerModule({
  id: "online-conflict",
  title: "Online Conflict and Social Media",
  icon: "📱",
  score: false,
  about: `**Group chats, posts and screenshots.** Work out what's okay online, what to do when things turn nasty, and how to stop online drama following you into school.

About 25–30 minutes.`,
  deeper: ["Why do you think people say things online that they'd never say to someone's face?"],
  items: [
    {
      type: "read", title: "Online is still real life",
      text: `The Student Code of Conduct applies **online too**, even outside school hours, if it affects people at school.

Things to remember:
- **It spreads fast.** A post or message can be screenshotted and shared in seconds.
- **It sticks around.** Deleting something doesn't mean it's gone.
- **Tone gets lost.** A joke in your head can read as an insult on a screen.
- **It comes to school.** A lot of fights at school start in a group chat the night before.`,
      easy: {
        text: `The school rules count **online too**.
- Posts can be screenshotted and shared fast.
- Deleting doesn't always make it go away.
- A joke can look like an insult on a screen.
- Lots of school fights start in group chats.`
      },
      more: `Sharing someone's photo or private message without asking can also break the law, not just school rules. If something online makes you feel unsafe, you can also report it to the eSafety Commissioner.`
    },
    {
      type: "sort", q: "Is it okay online, or not okay?",
      buckets: ["Okay", "Not okay"],
      cards: [
        { text: "Sharing a funny meme about a TV show", bucket: 0 },
        { text: "Leaving a group chat that's getting nasty", bucket: 0 },
        { text: "Blocking someone who keeps messaging you", bucket: 0 },
        { text: "Reporting a harmful post", bucket: 0 },
        { text: "Posting a photo of someone without asking", bucket: 1 },
        { text: "Joining in when someone is being picked on", bucket: 1 },
        { text: "Sending a threat \"as a joke\"", bucket: 1 },
        { text: "Screenshotting a private message to share around", bucket: 1 }
      ]
    },
    {
      type: "story", title: "The group chat",
      start: "start",
      nodes: {
        start: { text: "Your friend posts an embarrassing photo of a classmate in the group chat. People start laughing at it.", choices: [
          { label: "Add a laughing emoji", to: "emoji" },
          { label: "Say nothing and keep scrolling", to: "scroll" },
          { label: "Message your friend privately: \"Not cool. Take it down.\"", to: "private" }
        ] },
        emoji: { text: "More people pile on. The classmate sees it and doesn't come to school the next day.", choices: [
          { label: "Delete your emoji and tell a trusted adult", to: "adult" },
          { label: "Leave it. It's just a joke.", to: "trouble" }
        ] },
        scroll: { text: "The photo keeps getting shared around.", choices: [
          { label: "Report the post and tell a trusted adult", to: "adult" },
          { label: "Do nothing", to: "trouble" }
        ] },
        private: { text: "Your friend takes it down. Speaking up privately helped without making it a bigger deal.", end: "good" },
        adult: { text: "An adult helps get the photo removed and checks on the classmate. You did the right thing, even after a shaky start.", end: "good" },
        trouble: { text: "The school finds out. Everyone who joined in is involved in the consequences, and someone got really hurt.", end: "bad" }
      }
    },
    {
      type: "match", q: "Match each problem to the best thing to do.",
      pairs: [
        { left: "Someone keeps sending you mean messages", right: "Block them and tell a trusted adult" },
        { left: "You see a post planning a fight at school", right: "Tell a staff member straight away" },
        { left: "Something online makes you really angry", right: "Wait until you're calm before replying" },
        { left: "A photo of you was shared without permission", right: "Report it and ask an adult for help" }
      ]
    },
    {
      type: "mc", q: "Why is it a bad idea to reply to something when you're angry?",
      choices: [
        "It isn't. Getting it off your chest is best.",
        "Messages can be screenshotted and shared, and tone is easy to misread.",
        "Your phone might run out of battery.",
        "Nobody reads replies anyway."
      ],
      answer: 1
    },
    {
      type: "slider", title: "Screens and me",
      q: "Be honest. Nobody else sees these numbers except your teacher.",
      sliders: [
        { label: "Hours on my phone on a school night", min: 0, max: 8, unit: "hours", left: "0", right: "8+" },
        { label: "How often online stuff makes me angry or upset", min: 0, max: 10, left: "Never", right: "All the time" }
      ]
    },
    {
      type: "write", title: "My online plan",
      prompts: [
        "When something online makes me angry, I will…",
        "Who I can tell if things get out of hand (a role, like \"my year adviser\", not a name):"
      ]
    },
    {
      type: "read", title: "Key message",
      text: `**Think before you post, pause before you reply.** If it wouldn't be okay at school, it isn't okay online.`
    }
  ]
});
