# Money Quest — Economic Model: Sources & Assumptions (V2)

This document records where the game's dollar figures come from and what was
simplified to make them playable. It exists so a judge, a teammate, or future-us
can check our homework.

## Anchor: Columbus, Ohio (Franklin County) metro area

We picked one real U.S. metro and scaled every character and event to it,
instead of inventing round numbers. Columbus is a commonly cited "typical
mid-size American city" in cost-of-living writeups, which is exactly the kind
of place our starting characters (recent grad, student) would actually be
starting out in.

## Primary sources

1. **MIT Living Wage Calculator** (`livingwage.mit.edu`) — Ohio, single adult,
   no children: a living wage of **~$20.38/hour**, i.e. **~$42,390/year /
   ~$3,533/month / ~$815/week** for a full-time (2,080 hr/yr) worker. Component
   estimates reported alongside it: **transportation ~$9,887/year (~$190/week)**
   and **medical ~$3,454/year (~$288/month)**. (Retrieved via secondary
   aggregation — see "Honesty about data access" below.)
2. **BLS Consumer Expenditure Survey** — average annual expenditures for
   consumer units with a reference person **under age 25**: **$49,560** (2023),
   used as a sanity check on total household spending scale for a young adult.
3. **Apartment List, "Cost of Living in Ohio" (2025)** — Columbus asking rent:
   **1BR ≈ $1,136/month, 2BR ≈ $1,360/month**. Used as our housing baseline.

## Honesty about data access

This project does not have live, authenticated access to the MIT calculator's
Columbus-specific metro page or to BLS's category-level cross-tab tables
(food/housing/transportation/healthcare broken out separately for under-25
households). What's cited above are the **Ohio statewide, single-adult**
MIT figures and the **under-25 national** BLS total, both retrieved through
web search of secondary reporting on those two sources. Where we needed a
number neither source gave us directly (e.g. a specific weekly grocery
figure), we derived it proportionally from the BLS total and said so below,
rather than inventing an uncited number.

## How the real numbers became game numbers

- **Rent** is the one true fixed monthly bill, due once per 30-day cycle
  (game-day 30), sized off the Columbus rent figures above: a solo apartment
  sits near the 1BR average, a shared apartment near half the 2BR average.
- **Transportation** in the MIT figure assumes car ownership (insurance, gas,
  maintenance) and is the single biggest non-housing cost (~$190/week) — more
  than our characters, who don't own cars, actually spend. Our in-game transit
  choices (monthly pass / pay-per-ride / bike) are deliberately priced against
  real public-transit pass costs (a mid-size-city monthly pass is commonly in
  the $60–100 range) rather than the full car-ownership figure, and the game
  says so in its Financial Lesson text: choosing not to own a car is itself a
  real cost-saving decision, not a rounding error.
- **Food** is priced down from the BLS under-25 total (roughly scaled assuming
  food is a mid-teens percentage of total household spending), landing each
  grocery-run choice in the $45–155 range for what the game frames as roughly
  a week-to-two-weeks of groceries, not literally one month's food budget —
  the game only asks the player to make this decision twice in 30 days, as a
  simplification.
- **Medical** events (dental cleaning, urgent care visit) are priced as
  single incidents within the ~$288/month MIT medical estimate, under the
  explicit assumption that routine insurance premiums are *not* separately
  modeled (we assume the player either has employer coverage already netted
  into their paycheck, or is on a high-deductible/uninsured path — which is
  why an uncushioned urgent care bill can be large relative to one paycheck).
- **Income** is set *below* each character's full MIT living wage on purpose.
  That gap is the entire point of the Living Wage Calculator's existence —
  it's a published, real phenomenon (entry-level, part-time, and gig income
  commonly fall short of a calculated living wage), not a game-balance trick.
  See each character's `incomeAsShareOfLivingWage` note below.

## The starting characters (V2)

| Character | Start $ | Income / wk | % of OH living wage ($815/wk) | Rent / mo | Housing situation |
|---|---|---|---|---|---|
| Fresh Graduate | $600 | $420 | ~52% | $1,100 | Solo 1BR (≈ Columbus 1BR avg) |
| Working Student | $400 | $300 | ~37% | $680 | Shared 2BR, half the rent |

No character's numbers are tuned to guarantee an ending. Both were
re-simulated against low-risk, mixed, and high-risk play patterns (see
`scripts/` history during development) and each can reach *Financially
Stable*, *Scraping By*, or *Fell Into Debt* depending on choices — including
the weaker starting position (Working Student) reaching Stable with careful
play, and the stronger one (Fresh Graduate) falling into debt with reckless
play.

A third, unlockable character (Trust Fund Kid) exists as a reward/relaxed-mode
option once a player has reached both *Scraping By* and *Fell Into Debt* — see
`data/unlocks.ts` and `data/characters.ts`. Its numbers are a deliberate
head-start, not part of this cost-of-living model.

## What this is not

This is an educational simulation, not a financial-planning tool, and it is
not a claim that these are *the* correct numbers for Columbus in any specific
year. Figures are a reasonable, sourced approximation built for a 30-day
game, not a budget anyone should use to make real decisions.
