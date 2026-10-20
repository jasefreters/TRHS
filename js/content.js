/*
  Words students see during the day. Draft text: staff should edit it to suit.
  Text can use **bold**, blank lines for new paragraphs, and lines starting with "- " for lists.
*/
window.RP = window.RP || {};

RP.CONTENT = {
  // Social story at the start of each day. Draft wording for staff to adjust.
  story: {
    1: `**Welcome to Day 1 of the Reset Program.**

You're in the Hub because something at school didn't go well. The Reset Program is a chance to stop, think, and get ready to go back to class. It isn't a punishment, and you're not in trouble here.

There might be a few other students in the Hub too. Everyone has their own plan, so people will be doing different things at different times. That's normal.

**Here's how today works:**
- **Group sessions:** laptops go to the side, and you work together with a staff member.
- **On your own:** you do activities on this laptop at your own pace.
- **Individual session:** time one-on-one with a staff member. Today you'll talk about how things are going, your plans and your goals.
- **Breaks:** go to recess and lunch as normal, then come straight back to the Hub.

Your plan is on the left. It shows what's on now and what's next. When you finish something, it gets a tick.

You'll do a short survey now, and another one at the end of the day.

If you get stuck or need to talk, press **I need help** and a staff member will come to you.`,
    2: `**Welcome to Day 2 of the Reset Program.**

Yesterday you started looking at what happened and what you can do differently. Today is about building skills and getting ready to go back to class.

**Today works the same way as Day 1:**
- **Group sessions:** laptops to the side, working together with a staff member.
- **On your own:** activities on this laptop at your own pace.
- **Individual session:** time one-on-one with a staff member to make your success plan: the strategies you'll use, your goals, and the staff you can go to for support.
- **Breaks:** go to recess and lunch as normal, then come straight back to the Hub.

You'll do a short survey now, and another one at the end of the day.

If you get stuck or need to talk, press **I need help** and a staff member will come to you.`
  },

  morning: `After the survey, the morning session is with the whole group. When the staff member starts, put your laptop to the side.`,

  group: `This is a group session. Put your laptop to the side and join the group. The staff member will lead it and tick it off when it's done.`,

  debrief: `The afternoon debrief is with the whole group. Together you'll look back on the day: what went well, what was hard, and what you'll take with you. Then you'll fill in the survey for the end of your day.`,

  // Shown during recess and lunch.
  breakTime: (name, back) => `**It's ${name.toLowerCase()}.** Go to ${name.toLowerCase()} as normal, then come straight back to the Hub by **${back}**.`,

  unassigned: `Your teacher hasn't chosen an activity for this session yet. Press **I need help** if you're not sure what to do.`,

  // Shown when every activity on the plan is finished.
  freeChoice: {
    title: "Free choice",
    text: `You've finished all of your activities. Well done! Check with your teacher, then choose one of these:
- Read a book or magazine from the shelf
- Draw or colour
- Write about something you're looking forward to
- Help set up for the next group session`
  }
};
