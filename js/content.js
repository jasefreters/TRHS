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
- **1:1 with your teacher**: some time during the day your teacher will come and talk with you about how you came to be here and your goals.

The plan on the left shows what's happening and when. When you finish something, it gets a tick.

If you get stuck or need to talk, press **I need help**. Your teacher will come to you.`,
    2: `Today is **Day 2** of the Reset Program.

Yesterday you started looking at what happened and what you can do differently. Today is about building skills and getting ready to go back to class.

Your day works the same way as Day 1: group sessions, activities on your own, and a 1:1 with your teacher.

In your 1:1 today, you and your teacher will plan how you'll go back to class: what will help, who you can go to, and the goal you'll work on.

If you get stuck or need to talk, press **I need help**. Your teacher will come to you.`
  },

  morning: `The morning session is with the whole group. When your teacher starts, put your laptop to the side.`,

  group: `This is a group session. Put your laptop to the side and join the group. Your teacher will lead this session and tick it off when it's done.`,

  debrief: `The afternoon debrief is with the whole group. Put your laptop to the side. Together you'll look back on the day: what went well, what was hard, and what you'll take with you.`,

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
