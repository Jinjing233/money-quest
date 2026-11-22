import type { GameEvent } from "../types/game";

export const EVENTS: GameEvent[] = [
  {
    id: "rent-renewal",
    day: 2,
    title: "Your Rent Is Going Up",
    description:
      "Your landlord sends a renewal notice: rent is increasing starting next month. You can sign as-is, try to negotiate, or start looking elsewhere.",
    lesson:
      "Recurring costs compound. A smaller rent increase today is worth more than it looks — it repeats every single month.",
    choices: [
      {
        id: "accept",
        label: "Sign at the new rate (+$50/month)",
        detail: "No hassle now, but your rent goes up for good.",
        effects: { rentDelta: 50 },
      },
      {
        id: "negotiate",
        label: "Try to negotiate the increase",
        detail: "You talk it down to a smaller bump, but it's an uncomfortable conversation.",
        effects: { rentDelta: 20, stress: 6 },
      },
      {
        id: "move",
        label: "Start looking for a cheaper place ($40 application fees)",
        detail: "Costs you time and money now, but could lower your rent for good.",
        effects: { balance: -40, rentDelta: -60, stress: 10 },
      },
    ],
  },
  {
    id: "grocery-run",
    day: 4,
    title: "Grocery Run",
    description:
      "It's time to restock the kitchen. You can keep it cheap, go for a healthy middle ground, or just order what's easy.",
    lesson: "Food is one of the few budget categories you control week to week — small swaps here add up over a month.",
    choices: [
      {
        id: "budget",
        label: "Stick to budget staples ($35)",
        detail: "Rice, beans, and basics. Boring, but it works.",
        effects: { balance: -35, energy: -4 },
      },
      {
        id: "balanced",
        label: "Mix of fresh food and basics ($65)",
        detail: "A bit more variety and nutrition for a bit more money.",
        effects: { balance: -65, energy: 4 },
      },
      {
        id: "delivery",
        label: "Order groceries delivered all week ($120)",
        detail: "Convenient, but the delivery fees add up fast.",
        effects: { balance: -120, energy: 8, stress: -3 },
      },
    ],
  },
  {
    id: "transit-choice",
    day: 6,
    title: "Getting to Work",
    description:
      "Your transit costs are adding up. A monthly pass costs more upfront but is cheaper overall if you stick with it.",
    lesson: "A bigger upfront cost can be cheaper long-term — the trick is having the cash on hand to make that trade.",
    choices: [
      {
        id: "pass",
        label: "Buy the monthly pass ($70)",
        detail: "Bigger hit today, but every ride after this is already paid for.",
        effects: { balance: -70, stress: -4 },
      },
      {
        id: "perride",
        label: "Keep paying per ride ($30 this week)",
        detail: "Flexible, but it costs more than the pass if you keep riding.",
        effects: { balance: -30 },
      },
      {
        id: "bike",
        label: "Bike instead to save money",
        detail: "Free, but tiring, and the weather doesn't always cooperate.",
        effects: { energy: -10, stress: -2 },
      },
    ],
  },
  {
    id: "tax-refund",
    day: 7,
    title: "An Unexpected Refund",
    description: "A tax refund of $180 lands in your account. It's extra money you weren't counting on.",
    lesson:
      "Windfalls are exactly when emergency funds get built — the money tends to disappear fast if it doesn't have a job to do first.",
    choices: [
      {
        id: "save",
        label: "Put it all into an emergency fund",
        detail: "Not exciting, but it's there if something goes wrong.",
        effects: { balance: 180, stress: -6 },
      },
      {
        id: "split",
        label: "Save half, spend half on something you want ($60)",
        detail: "A little bit of both — some cushion, some reward.",
        effects: { balance: 120, stress: -2, energy: 4 },
      },
      {
        id: "spend",
        label: "Spend it on things you've been putting off ($150)",
        detail: "Feels great right now. Leaves you with no safety net.",
        effects: { balance: 30, energy: 10 },
      },
    ],
  },
  {
    id: "flat-tire",
    day: 9,
    title: "Flat Tire",
    description: "Your bike tire blows out on the way to work. You need a way to get around until it's fixed.",
    lesson: "Small repairs delayed often turn into bigger ones — deferred maintenance is still a cost, just a hidden one.",
    choices: [
      {
        id: "repair",
        label: "Get it repaired today ($45)",
        detail: "Back on the road right away.",
        effects: { balance: -45 },
      },
      {
        id: "patch",
        label: "Patch it yourself ($12 kit)",
        detail: "Cheaper, but it might not hold.",
        effects: { balance: -12, stress: 5 },
      },
      {
        id: "bus",
        label: "Take the bus until payday ($20)",
        detail: "A short-term workaround that costs you time.",
        effects: { balance: -20, energy: -6 },
      },
    ],
  },
  {
    id: "friend-birthday",
    day: 11,
    title: "A Friend's Birthday",
    description:
      "A close friend is turning 30 and everyone's chipping in for a dinner out. It's not required, but you'd be the only one missing.",
    lesson: "Social spending isn't automatically wasteful — relationships are part of a stable life too. The goal is balance, not zero.",
    choices: [
      {
        id: "join",
        label: "Go all in ($55)",
        detail: "Full dinner and a gift. Worth it for the friendship.",
        effects: { balance: -55, stress: -12, energy: 5 },
      },
      {
        id: "modest",
        label: "Chip in for a smaller gift, skip dinner ($15)",
        detail: "You show up for what matters without the big bill.",
        effects: { balance: -15, stress: -5 },
      },
      {
        id: "skip",
        label: "Send your congrats and stay home",
        detail: "Saves money, but it stings a little to miss it.",
        effects: { stress: 8 },
      },
    ],
  },
  {
    id: "cracked-screen",
    day: 13,
    title: "Cracked Screen",
    description: "You drop your phone and the screen cracks. It still works, but it's hard to read and getting worse.",
    lesson: "Not every repair needs to happen immediately — but the daily friction of a 'good enough' fix has a real cost too.",
    choices: [
      {
        id: "repair",
        label: "Get a full screen repair ($95)",
        detail: "Expensive, but it's like new again.",
        effects: { balance: -95 },
      },
      {
        id: "diy",
        label: "Apply a screen protector over the crack ($10)",
        detail: "A cheap patch that holds for a while.",
        effects: { balance: -10, stress: 4 },
      },
      {
        id: "ignore",
        label: "Just keep using it as-is",
        detail: "Free today, frustrating every day after.",
        effects: { energy: -6, stress: 8 },
      },
    ],
  },
  {
    id: "dental-checkup",
    day: 15,
    title: "Dental Checkup Reminder",
    description: "A postcard reminds you it's time for a dental checkup. Nothing hurts yet, but it's been over a year.",
    lesson: "Preventative care is almost always cheaper than emergency care — skipping it is a bet, not a guaranteed save.",
    choices: [
      {
        id: "go",
        label: "Go in for the cleaning ($60)",
        detail: "Preventative care now, fewer surprises later.",
        effects: { balance: -60, stress: -4 },
      },
      {
        id: "clinic",
        label: "Find a sliding-scale community clinic ($25)",
        detail: "Takes some research, but it's a lot more affordable.",
        effects: { balance: -25, stress: 3 },
      },
      {
        id: "skip",
        label: "Skip it — nothing hurts",
        detail: "Free for now. You're betting against a bigger bill later.",
        effects: { stress: 5 },
      },
    ],
  },
  {
    id: "weekend-gig",
    day: 17,
    title: "Weekend Gig Opportunity",
    description: "A coworker mentions a weekend gig that pays well. It would mean giving up most of your weekends.",
    lesson: "More income can fix a tight budget, but it isn't free — it's traded for time and energy, which also matter.",
    choices: [
      {
        id: "takeit",
        label: "Take it every weekend",
        detail: "More money coming in every week, but less time to recharge.",
        effects: { incomeDelta: 55, energy: -12, stress: 6 },
      },
      {
        id: "sometimes",
        label: "Pick it up occasionally ($70 one-time)",
        detail: "Some extra cash without committing your whole schedule.",
        effects: { balance: 70, energy: -5 },
      },
      {
        id: "decline",
        label: "Decline and protect your time off",
        detail: "No extra income, but you stay rested.",
        effects: { energy: 6, stress: -4 },
      },
    ],
  },
  {
    id: "hours-cut",
    day: 19,
    title: "Hours Get Cut",
    description: "Your manager cuts next week's schedule — about $100 less than you were counting on. You need to adjust.",
    lesson: "Income isn't always steady, even with a 'stable' job. A cushion turns a cut week into an inconvenience instead of a crisis.",
    choices: [
      {
        id: "extra",
        label: "Pick up a shift somewhere else ($55 recovered)",
        detail: "Takes effort to arrange, but it softens the hit.",
        effects: { balance: -45, energy: -10, stress: 6 },
      },
      {
        id: "tighten",
        label: "Tighten spending this week",
        detail: "No extra hustle, just a leaner week.",
        effects: { balance: -110, stress: 8 },
      },
      {
        id: "cushion",
        label: "Cover it from what you've saved",
        detail: "This is exactly what a cushion is for.",
        effects: { balance: -110, stress: -6 },
      },
    ],
  },
  {
    id: "family-needs-help",
    day: 21,
    title: "Family Needs Help",
    description:
      "Your mom calls — the car needs a repair and money's tight at home this month. She didn't ask directly, but you know it would help.",
    lesson:
      "Supporting family is a real financial pressure for a lot of people — it rarely shows up in a budget template, but it shows up in real life.",
    choices: [
      {
        id: "full",
        label: "Send $130 to help out",
        detail: "A real sacrifice for you, but it matters to them.",
        effects: { balance: -130, stress: -4 },
      },
      {
        id: "partial",
        label: "Send what you can spare ($40)",
        detail: "Not everything, but something.",
        effects: { balance: -40, stress: 4 },
      },
      {
        id: "cant",
        label: "Explain you can't help right now",
        detail: "The honest answer, even though it's hard to say.",
        effects: { stress: 14 },
      },
    ],
  },
  {
    id: "urgent-care-bill",
    day: 24,
    title: "Urgent Care Bill",
    description: "A visit to urgent care for a nasty flu left you with a $230 bill. The clinic offers a payment plan if you need it.",
    lesson:
      "Delaying a bill rarely makes it smaller — payment plans and late fees both mean paying more, later, for less flexibility now.",
    choices: [
      {
        id: "full",
        label: "Pay the full bill now ($230)",
        detail: "It hurts now, but it's over with.",
        effects: { balance: -230 },
      },
      {
        id: "plan",
        label: "Split it into payments ($70 now, rest due later)",
        detail: "Lighter today, but a second payment is coming.",
        effects: { balance: -70, stress: 6 },
        schedule: { delayDays: 4, amount: -170, label: "Urgent care — remaining balance" },
      },
      {
        id: "delay",
        label: "Delay payment entirely",
        detail: "No cost today, but it may come back bigger.",
        effects: { stress: 18, energy: -8 },
        schedule: { delayDays: 6, amount: -280, label: "Urgent care — bill plus late fee" },
      },
    ],
  },
];
