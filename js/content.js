/*
  Words students see during the day. Draft text: staff should edit it to suit.
  Text can use **bold**, blank lines for new paragraphs, and lines starting with "- " for lists.
*/
window.RP = window.RP || {};

RP.CONTENT = {
  // Staff-facing: the opening of the Sentral post (student record → Sentral post), for staff who
  // don't know the program. Plain text, no formatting.
  sentralIntro: `The Reset Program is a two-day program in the Hub for students returning from suspension. The day follows the normal bells, split into half-period sessions: small-group lessons with a staff member (such as RIOT, on resilience, and our T-RED values), independent work on a laptop, and one-on-one time with a teacher to plan their return to class. Students rate themselves on 10 statements about managing their behaviour at the start and end of each day.`,

  // Social story at the start of each day. Draft wording for staff to adjust.
  story: {
    1: `**Welcome to Day 1 of the Reset Program.**

The Reset Program is a chance to stop, think and get ready to go back to class. It isn't a punishment.

Everyone in the Hub has their own plan, so people will be doing different things. Today has three kinds of modules:
- **Group:** laptops to the side, working together with a staff member.
- **Independent:** activities on this laptop, at your own pace.
- **Teacher-led:** one-on-one time with a staff member.

Go to B1 and B2 as normal, then come straight back to the Hub.

If you need help, press **I need help**.`,
    2: `**Welcome to Day 2 of the Reset Program.**

Today is about building skills and getting ready to go back to class. It works the same way as Day 1:
- **Group:** laptops to the side, working together with a staff member.
- **Independent:** activities on this laptop, at your own pace.
- **Teacher-led:** one-on-one time with a staff member, including making your return plan.

Go to B1 and B2 as normal, then come straight back to the Hub.

If you need help, press **I need help**.`
  },

  morning: `Start with the **morning check-in**: are you ready to learn, and a short survey. Then put your laptop to the side for the morning session.`,

  group: `**Group module.** Put your laptop to the side and join the group.`,

  debrief: `Look back on the day with the group, then do the end-of-day survey. After that you'll get your certificate for today.`,

  // Shown during B1 and B2.
  breakTime: (name, back) => `**It's ${name}.** Go to the break as normal, then come straight back to the Hub by **${back}**.`,

  unassigned: `Your teacher hasn't chosen an activity for this session yet. Press **I need help** if you're not sure what to do.`,

  // Shown when every activity on the plan is finished.
  freeChoice: {
    title: "Free choice",
    text: `You've finished all your activities. Well done! Check with your teacher, then choose one:
- Read a book or magazine
- Draw or colour
- Write about something you're looking forward to`
  }
};
