/*
  My Reset Plan (independent): the Behaviour Chain Analysis worksheet, typed on the laptop.
  The worksheet's wording is kept exactly as written: it's free to use for not-for-profit
  organisations "providing that no changes are made to its content". The printable original is at
  resources/behaviour-chain-analysis.pdf for paper copies. Staff see the answers on the
  teacher-led "My Reset Plan" session page.
*/
RP.registerModule({
  id: "reset-plan",
  title: "My Reset Plan",
  icon: "🔗",
  score: false,
  about: `**Understand your patterns to create more choice.** Work through what happened, step by step. Your teacher will go through it with you in your teacher-led Reset Plan session.

About 25 minutes.`,
  items: [
    {
      type: "read", title: "Behaviour Chain Analysis",
      text: `Sometimes a behaviour causes problems - but it did not come out of nowhere.

Behaviour Chain Analysis is a tool to figure out:
- What led to the behaviour
- What kept it going
- Where it could have been stopped

It helps you understand what happened, without shame or judgement - just the facts.

Vulnerabilities are not excuses - they are signals.

This is not about blame. It is about having more choice next time.

From the Behaviour Chain Analysis guide and worksheet, [www.SocialWorkersToolbox.com](https://www.socialworkerstoolbox.com).`
    },
    { type: "write", title: "1. What was the behaviour?", q: "Be specific. What exactly did you do that caused problems?", prompts: ["The behaviour:"] },
    { type: "write", title: "2. What was the trigger?", q: "What was the last straw before the behaviour happened?", prompts: ["The trigger:"] },
    {
      type: "write", title: "3. What were the links in the chain?", chain: true,
      q: "List what happened, step by step, that led to the behaviour. Start as early as you can remember.",
      prompts: ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"]
    },
    {
      type: "select", title: "4. What were your vulnerabilities that day?",
      q: "What made this behaviour more likely?",
      options: ["Tired", "Stressed", "Felt unsupported", "Hungry", "Unwell", "Upset earlier"],
      other: true
    },
    {
      type: "write", title: "5. What were the consequences?",
      prompts: ["Short-term: What happened right after the behaviour?", "Long-term: What happened later or kept happening because of it?"]
    },
    { type: "write", title: "6. Where could the chain have been broken?", q: "Pick one point earlier in the chain. What could you have done differently?", prompts: ["The chain could have been broken:"] },
    { type: "write", title: "7. What might you try next time?", prompts: ["Next time I might try:"] },
    { type: "read", title: "Tip", text: `**Even one small change can shift the outcome next time.**

If you can see the chain, you can change it. You cannot control everything - but you can interrupt the pattern. One small shift early on can change the outcome.` }
  ]
});
