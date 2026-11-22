import type { GameEvent } from "../types/game";

// V2 event set — 24 events (2 of which are mutually-exclusive callbacks on
// the same day), scaled to the Columbus, OH economy in DATA_SOURCES.md.
// Day 2, 4, 6, 7, 9, 11, 13, 15, 17, 19, 21, 24 keep the core beats from V1,
// rebalanced; everything else is new. Four events are conditional on
// balance / stress / energy / a prior choice and simply don't fire if their
// condition isn't met that day — the day plays out quietly instead.

export const EVENTS: GameEvent[] = [
  {
    id: "rent-renewal",
    day: 2,
    title: "Your Landlord Has Entered the Chat",
    description:
      "A text at 11:47pm: rent's going up next cycle. Nothing says \"sleep well\" like a surprise price increase from a guy who still hasn't fixed your sink.",
    lesson: "Recurring costs compound. A smaller monthly bump is worth more than it looks, because it repeats every single cycle.",
    choices: [
      { id: "accept", label: "Just pay it (+$65/month)", detail: "Zero drama. Also zero savings strategy.", effects: { rentDelta: 65 } },
      { id: "negotiate", label: "Ask if there's any wiggle room", detail: "Mildly awkward. Saves you a little, costs you a little dignity.", effects: { rentDelta: 25, stress: 6 } },
      { id: "move", label: "Start apartment hunting ($55 in applications)", detail: "More effort now. Lower rent for good — if it actually works out.", effects: { balance: -55, rentDelta: -80, stress: 10 } },
    ],
  },
  {
    id: "grocery-run",
    day: 4,
    title: "The Fridge Is Lying to You",
    description: "It says there's food in there. There is, technically, one (1) condiment and some ice. Time to restock for the next week or two.",
    lesson: "Food is one of the few budget lines you control week to week. Small swaps here add up over a month.",
    choices: [
      { id: "budget", label: "Rice, beans, and the essentials ($45)", detail: "Boring. Extremely effective.", effects: { balance: -45, energy: -4 } },
      { id: "balanced", label: "A real mix of fresh stuff ($85)", detail: "Costs more, keeps you running better.", effects: { balance: -85, energy: 4 } },
      { id: "delivery", label: "Just order it all delivered ($155)", detail: "Convenient. The fees are doing a lot of damage.", effects: { balance: -155, energy: 8, stress: -3 } },
    ],
  },
  {
    id: "transit-choice",
    day: 6,
    title: "COTA Pass or Chaos",
    description: "Your commute costs are creeping up. A monthly transit pass is a bigger hit today — but it's already paid for every ride after this one.",
    lesson: "A bigger upfront cost can be cheaper long-term. The trick is having the cash on hand to make that trade in the first place.",
    choices: [
      { id: "pass", label: "Buy the monthly pass ($90)", detail: "Ouch today. Free rides for the rest of the month.", effects: { balance: -90, stress: -4 } },
      { id: "perride", label: "Keep paying per ride ($40 this week)", detail: "Flexible. Adds up faster than it feels like it does.", effects: { balance: -40 } },
      { id: "bike", label: "Bike it to save the cash", detail: "Free. Your legs will have opinions about this by Friday.", effects: { energy: -10, stress: -2 } },
    ],
  },
  {
    id: "tax-refund",
    day: 7,
    title: "Surprise, the IRS Likes You This Year",
    description: "A $240 refund lands in your account. It's real money you weren't counting on — which is exactly how it tends to disappear.",
    lesson: "Windfalls are exactly when emergency funds get built. The money has a way of vanishing fast if it doesn't have a job to do first.",
    choices: [
      { id: "save", label: "Put it all into an emergency fund", detail: "Not exciting. There if something goes wrong later.", effects: { balance: 240, stress: -6 } },
      { id: "split", label: "Save half, treat yourself with half ($80)", detail: "Some cushion, some reward. Reasonable person behavior.", effects: { balance: 160, stress: -2, energy: 4 } },
      { id: "spend", label: "Finally buy the stuff you've wanted ($200)", detail: "Feels incredible right now. Leaves zero safety net.", effects: { balance: 40, energy: 10 } },
    ],
  },
  {
    id: "flat-tire",
    day: 9,
    title: "Pop. That Was Not a Good Sound.",
    description: "Your bike tire blows out halfway to work. You've got maybe ten minutes to decide how you're getting there tomorrow.",
    lesson: "Small repairs delayed often turn into bigger ones. Deferred maintenance is still a cost — just a hidden one.",
    choices: [
      { id: "repair", label: "Get it fixed properly today ($60)", detail: "Back on the road immediately.", effects: { balance: -60 } },
      { id: "patch", label: "Patch it yourself ($16 kit)", detail: "Cheaper. Might not hold. We'll see.", effects: { balance: -16, stress: 5 } },
      { id: "bus", label: "Take the bus until payday ($28)", detail: "A workaround. Costs you time you don't love losing.", effects: { balance: -28, energy: -6 } },
    ],
  },
  {
    id: "free-lunch",
    day: 10,
    title: "Someone Brought Donuts",
    description: "No idea whose birthday it is, or if it's anyone's. Doesn't matter. There are donuts in the break room and that's the whole plot today.",
    lesson: "Not everything in a budget is a crisis. Some days are just a free donut — enjoy those.",
    choices: [
      { id: "join", label: "Go make small talk over a donut", detail: "Free, mildly social, surprisingly nice.", effects: { stress: -6, energy: 4 } },
      { id: "decline", label: "Stay at your desk, eat later", detail: "Also fine. Introverts deserve lunch breaks too.", effects: { energy: 2 } },
    ],
  },
  {
    id: "friend-birthday",
    day: 11,
    title: "It's Jess's Golden Birthday (Apparently That's a Thing)",
    description: "Turning 25 on the 25th, and everyone's chipping in for dinner. You'd be the only one missing — which Jess will absolutely notice.",
    lesson: "Social spending isn't automatically wasteful. Relationships are part of a stable life too — the goal is balance, not zero.",
    choices: [
      { id: "join", label: "Go all in — dinner and a gift ($75)", detail: "Worth it for the friendship. Costs what it costs.", effects: { balance: -75, stress: -12, energy: 5 } },
      { id: "modest", label: "Chip in for a card and a small gift ($20)", detail: "You show up for what matters without the big bill.", effects: { balance: -20, stress: -5 } },
      { id: "skip", label: "Send your congrats and stay home", detail: "Saves money. Stings a little to miss it.", effects: { stress: 8 } },
    ],
  },
  {
    id: "cracked-screen",
    day: 13,
    title: "Gravity: 1, Phone: 0",
    description: "One (1) unlucky drop onto concrete and now your screen looks like abstract art. It still works. Reading it is the problem.",
    lesson: "Not every repair needs to happen immediately — but the daily friction of a \"good enough\" fix has a real cost too.",
    choices: [
      { id: "repair", label: "Full screen repair ($125)", detail: "Expensive. Like new again, though.", effects: { balance: -125 } },
      { id: "diy", label: "Slap a screen protector over it ($14)", detail: "A cheap patch that mostly works.", effects: { balance: -14, stress: 4 } },
      { id: "ignore", label: "Just keep using it like this", detail: "Free today. Annoying every day after.", effects: { energy: -6, stress: 8 } },
    ],
  },
  {
    id: "roommate-offer",
    day: 14,
    title: "Your Friend Needs a Place, You Need Cash",
    description: "Money's been tight. A friend between leases casually asks if your place has room for one more. It does, technically.",
    lesson: "When the budget is genuinely tight, the fastest lever isn't always spending less — it's restructuring a fixed cost like rent.",
    condition: ({ balance }) => balance < 400,
    choices: [
      { id: "moveIn", label: "Say yes — split the rent", detail: "Less privacy. A lot more breathing room in the budget, for good.", effects: { rentDelta: -150, stress: 8 } },
      { id: "decline", label: "Not right now", detail: "You keep the place to yourself. The budget stays tight.", effects: {} },
    ],
  },
  {
    id: "friend-loan",
    day: 16,
    title: "\"Can You Spot Me $50? I'm Good For It.\"",
    description: "A friend asks for a quick loan, swears it's just until Friday. You believe them. Mostly.",
    lesson: "Lending to friends is a real financial decision with a real risk of not getting repaid — not a free action, even when it feels like one.",
    choices: [
      { id: "lend", label: "Lend the full $50", detail: "Generous. You may or may not see it again.", effects: { balance: -50, stress: 3 } },
      { id: "partial", label: "Offer $20 instead", detail: "A compromise that still helps.", effects: { balance: -20, stress: 1 } },
      { id: "decline", label: "Say you can't right now", detail: "Honest. A little uncomfortable to say out loud.", effects: { stress: 6 } },
    ],
  },
  {
    id: "dental-checkup",
    day: 15,
    title: "The Postcard That Won't Stop Reminding You",
    description: "A dentist's office has mailed you three of these now. Nothing hurts. It's been over a year, though, and they know it.",
    lesson: "Preventative care is almost always cheaper than emergency care. Skipping it is a bet, not a guaranteed save.",
    choices: [
      { id: "go", label: "Go in for the cleaning ($80)", detail: "Preventative care now, fewer surprises later.", effects: { balance: -80, stress: -4 } },
      { id: "clinic", label: "Find a sliding-scale clinic instead ($35)", detail: "Takes research. Much easier on the wallet.", effects: { balance: -35, stress: 3 } },
      { id: "skip", label: "Skip it — nothing hurts", detail: "Free for now. You're betting against a bigger bill later.", effects: { stress: 5 } },
    ],
  },
  {
    id: "weekend-gig",
    day: 17,
    title: "The Weekend Shift Nobody Else Wants",
    description: "A coworker mentions the weekend slot pays well and nobody's taken it. It would eat most of your Saturdays, though.",
    lesson: "More income can fix a tight budget, but it isn't free. It's traded for time and energy, which also matter.",
    choices: [
      { id: "takeit", label: "Take it every weekend", detail: "Real money, every week, from now on. Less time to recharge.", effects: { incomeDelta: 75, energy: -12, stress: 6 } },
      { id: "sometimes", label: "Pick it up occasionally ($95 one-time)", detail: "Some extra cash without signing your whole schedule away.", effects: { balance: 95, energy: -5 } },
      { id: "decline", label: "Decline — protect your weekends", detail: "No extra income. You stay rested.", effects: { energy: 6, stress: -4 } },
    ],
  },
  {
    id: "shift-callback-favor",
    day: 22,
    title: "Your Coworker Remembers",
    description: "The one who covers for you sometimes needs an easy afternoon off. You, notably, said no to extra shifts a few weeks back. Funny how that works.",
    lesson: "Turning down extra work isn't a loss — it's often what makes you able to show up for people later.",
    condition: ({ decisionHistory }) => decisionHistory.some((d) => d.eventId === "weekend-gig" && d.choiceId === "decline"),
    choices: [
      { id: "helpOut", label: "Cover for them, no question", detail: "Costs you an afternoon. Worth it for the goodwill.", effects: { stress: -6, energy: -4 } },
      { id: "cantToday", label: "Explain you're wiped today", detail: "Honest. They get it — you've got nothing left to give right now.", effects: { energy: 4 } },
    ],
  },
  {
    id: "shift-callback-grind",
    day: 22,
    title: "The Grind Catches Up",
    description: "Three weekends in a row now. Your body has opinions about this, and they are not supportive ones.",
    lesson: "Extra income bought with extra hours is still a real trade — the fatigue it costs doesn't show up on a pay stub.",
    condition: ({ decisionHistory }) => decisionHistory.some((d) => d.eventId === "weekend-gig" && d.choiceId === "takeit"),
    choices: [
      { id: "pushOn", label: "Push through, you need the money", detail: "The paycheck's steady. So is the exhaustion.", effects: { energy: -6, stress: 4 } },
      { id: "coffee", label: "Buy yourself a good coffee and keep going ($6)", detail: "Small treat, small relief.", effects: { balance: -6, energy: 6, stress: -3 } },
    ],
  },
  {
    id: "subscription-audit",
    day: 20,
    title: "That Free Trial Was Never Free",
    description: "You finally read your bank statement closely. There are three streaming subscriptions on there you forgot existed.",
    lesson: "Small recurring charges are easy to ignore individually and expensive together — a five-minute audit is real money.",
    choices: [
      { id: "cancel", label: "Cancel the ones you don't use ($15 saved)", detail: "Five minutes of mild embarrassment, some money back.", effects: { balance: 15, stress: -2 } },
      { id: "ignore", label: "Deal with it later", detail: "Later, as always, is doing a lot of work in that sentence.", effects: { balance: -10 } },
    ],
  },
  {
    id: "family-needs-help",
    day: 21,
    title: "Mom Calls About the Car",
    description: "She didn't ask directly. She never does. But the car needs a repair and money's tight at home this month, and you can hear it in how she's talking around it.",
    lesson: "Supporting family is a real financial pressure for a lot of people. It rarely shows up in a budget template, but it shows up in real life.",
    choices: [
      { id: "full", label: "Send $160 to help out", detail: "A real sacrifice for you. It matters to them.", effects: { balance: -160, stress: -4 } },
      { id: "partial", label: "Send what you can spare ($55)", detail: "Not everything. Still something.", effects: { balance: -55, stress: 4 } },
      { id: "cant", label: "Explain you can't help right now", detail: "The honest answer, even though it's hard to say out loud.", effects: { stress: 14 } },
    ],
  },
  {
    id: "burnout-check",
    day: 18,
    title: "Your Body Is Filing a Complaint",
    description: "You've been running on fumes for a while now, and today it finally catches up — a headache that won't quit and zero motivation to do anything about it.",
    lesson: "Rest has a cost either way. Taking it costs money or time now; skipping it costs more, later, in ways that are harder to budget for.",
    condition: ({ energy }) => energy <= 40,
    choices: [
      { id: "rest", label: "Take the day off and actually rest ($25)", detail: "A real reset. Worth more than it costs.", effects: { balance: -25, stress: -12, energy: 15 } },
      { id: "pushThrough", label: "Push through it anyway", detail: "Free today. The exhaustion doesn't care about your schedule.", effects: { energy: -8, stress: 6 } },
    ],
  },
  {
    id: "hours-cut",
    day: 19,
    title: "The Schedule Just Got Shorter",
    description: "Your manager cuts next week's hours — about $130 less than you were counting on, with zero warning and zero apology.",
    lesson: "Income isn't always steady, even with a \"stable\" job. A cushion turns a cut week into an inconvenience instead of a crisis.",
    choices: [
      { id: "extra", label: "Pick up a shift somewhere else ($65 recovered)", detail: "Takes effort to arrange. Softens the hit.", effects: { balance: -65, energy: -10, stress: 6 } },
      { id: "tighten", label: "Tighten spending this week", detail: "No extra hustle. Just a leaner week.", effects: { balance: -150, stress: 8 } },
      { id: "cushion", label: "Cover it from what you've saved", detail: "This is exactly what a cushion is for.", effects: { balance: -150, stress: -6 } },
    ],
  },
  {
    id: "urgent-care-bill",
    day: 24,
    title: "The Flu Had Other Plans for Your Budget",
    description: "An urgent care visit for what turned out to be a nasty flu leaves you with a $310 bill. The clinic mentions a payment plan, almost as an afterthought.",
    lesson: "Delaying a bill rarely makes it smaller. Payment plans and late fees both mean paying more, later, for less flexibility now.",
    choices: [
      { id: "full", label: "Pay the full bill now ($310)", detail: "It hurts now. It's over with.", effects: { balance: -310 } },
      { id: "plan", label: "Split it into payments ($95 now, rest later)", detail: "Lighter today. A second payment is already on its way.", effects: { balance: -95, stress: 6 }, schedule: { delayDays: 4, amount: -235, label: "Urgent care — remaining balance", key: "urgent-care-remaining" } },
      { id: "delay", label: "Delay payment entirely", detail: "No cost today. It may come back bigger.", effects: { stress: 18, energy: -8 }, schedule: { delayDays: 6, amount: -365, label: "Urgent care — bill plus late fee", key: "urgent-care-late-fee" } },
    ],
  },
  {
    id: "performance-review",
    day: 26,
    title: "Performance Review O'Clock",
    description: "Your manager pulls you in for the quarterly check-in. It's going fine, actually — which is either a great moment to ask for more, or a great moment to just nod and leave.",
    lesson: "Asking for more money is a real, learnable skill — and it's one of the only moves in this game that raises your income instead of just managing what's already there.",
    choices: [
      { id: "askRaise", label: "Ask for a raise", detail: "A little nerve-wracking. It works — a modest bump, starting now.", effects: { incomeDelta: 40, stress: 6 } },
      { id: "nod", label: "Nod along, say thanks", detail: "Comfortable. Leaves money on the table.", effects: {} },
      { id: "vent", label: "Skip it, vent to a friend after", detail: "Doesn't change your paycheck. Does help, a little.", effects: { stress: -8 } },
    ],
  },
  {
    id: "second-grocery-run",
    day: 27,
    title: "The Fridge Strikes Again",
    description: "Round two. You know the drill by now — and exactly how last time's choice worked out.",
    lesson: "The same decision, made twice, isn't a coincidence — it's a pattern. Patterns are what a monthly budget is actually tracking.",
    choices: [
      { id: "budget", label: "Staples again ($30)", detail: "You've got a system now.", effects: { balance: -30, energy: -3 } },
      { id: "balanced", label: "Fresh stuff again ($55)", detail: "Consistent, reasonable.", effects: { balance: -55, energy: 3 } },
      { id: "delivery", label: "Delivery again ($100)", detail: "The fees still aren't free, somehow.", effects: { balance: -100, energy: 6, stress: -2 } },
    ],
  },
  {
    id: "free-concert",
    day: 23,
    title: "Someone Can't Use Their Ticket",
    description: "A coworker's plans fell through and they're handing off a concert ticket for free, no strings attached, tonight.",
    lesson: "Not every good night out costs money — free and low-cost fun is a real budget category, not a consolation prize.",
    choices: [
      { id: "go", label: "Go — free night out", detail: "Loud, fun, free. Hard to say no to that combination.", effects: { energy: 8, stress: -10 } },
      { id: "skip", label: "Stay in and rest instead", detail: "Quiet night. Also genuinely nice sometimes.", effects: { energy: 5 } },
    ],
  },
  {
    id: "self-care-sunday",
    day: 28,
    title: "You Have Officially Hit Your Limit",
    description: "Nothing new went wrong today. You're just done — the kind of tired that's been building for weeks and finally announces itself.",
    lesson: "High stress is a cost even when nothing new happens. Recognizing a limit before it becomes a crisis is a financial skill, not just a feelings one.",
    condition: ({ stress }) => stress >= 65,
    choices: [
      { id: "dayOff", label: "Take the day fully off ($20)", detail: "A small cost. A real reset before the home stretch.", effects: { balance: -20, stress: -15, energy: 10 } },
      { id: "pushThrough", label: "Push through anyway", detail: "Free. The tank's still running on empty, though.", effects: { stress: 5, energy: -5 } },
    ],
  },
  {
    id: "final-stretch",
    day: 29,
    title: "One Day to Go",
    description: "Thirty days almost in the books. Tempting to celebrate a little early — or to hold the line one more day.",
    lesson: "The last decision in any stretch of discipline is often the easiest one to let slide. It counts exactly as much as the first one did.",
    choices: [
      { id: "restraint", label: "Hold off, you're almost there", detail: "Unglamorous. Exactly the right call, probably.", effects: { stress: -3 } },
      { id: "treat", label: "Treat yourself, you earned it ($30)", detail: "A little reward on the way to the finish line.", effects: { balance: -30, stress: -6, energy: 4 } },
    ],
  },
];
