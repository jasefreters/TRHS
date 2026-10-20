/*
  Words students see during the day. Draft text: staff should edit it to suit.
  Text can use **bold**, blank lines for new paragraphs, and lines starting with "- " for lists.
*/
window.RP = window.RP || {};

RP.CONTENT = {
  // Social story at the start of each day.
  story: {
    1: `Today is **Day 1** of the Reset Program.

You are here because something at school didn't go well. The Reset Program is a chance to stop, think and get ready to go back to class. It is not a punishment.

There are a few other students here too. Everyone is working on their own plan, so people will be doing different things at different times. That's normal.

Your day has three kinds of sessions:
- **Group sessions**: everyone puts their laptop to the side and works together with the teacher.
- **On your own**: you work through activities on this laptop at your own pace.
- **Individual sessions**: time one-on-one with your teacher. Today you'll talk about how you came to be here, your plans and your goals.

The plan on the left shows what's happening and when. When you finish something, it gets a tick.

If you get stuck or need to talk, press **I need help**. Your teacher will come to you.

At the end of the day there's a short survey about how you're going.`,
    2: `Today is **Day 2** of the Reset Program.

Yesterday you started looking at what happened and what you can do differently. Today is about building skills and getting ready to go back to class.

Your day works the same way as Day 1: group sessions, activities on your own, and an individual session with your teacher.

In your individual session today, you and your teacher will make your success plan: the strategies you'll use, your goals, and the staff you can go to for support.

If you get stuck or need to talk, press **I need help**. Your teacher will come to you.

At the end of the day there's a short survey about how you're going.`
  },

  morning: `The morning session is with the whole group. When your teacher starts, put your laptop to the side.`,

  group: `This is a group session. Put your laptop to the side and join the group. Your teacher will lead this session and tick it off when it's done.`,

  debrief: `The afternoon debrief is with the whole group. Together you'll look back on the day: what went well, what was hard, and what you'll take with you. Then you'll fill in the survey for your day.`,

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
