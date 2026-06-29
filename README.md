# C202 Field Notes — Managing Human Capital Quiz

A no-backend, mobile-friendly study site for C202 vocabulary and
easily-confused terms. Progress saves in your browser via `localStorage`.

## Run it

No build step, no server required.

1. Keep `index.html`, `style.css`, and `script.js` in the same folder.
2. Double-click `index.html` (or open it from your browser with **File → Open**).

That's it — it runs entirely client-side.

## What's included right now

I didn't have `c202_vocab.txt` or `FINAL_quiz_C202_70questions.txt` — they
weren't attached, only the build spec describing them. So the deck is
currently seeded with the **12 "commonly confused" term groups already
listed in your spec** (33 terms total: commitment types, adverse impact vs.
disparate treatment, job analysis/description/specification, training vs.
development, pay types, turnover types, recruiting sources, interview
styles, rater errors, policies/procedures/rules, and the five
conflict-handling styles). Definitions are written from standard HR/OB
concepts, in my own words.

Modes built and working: **Define→Term**, **Term→Define**, **Similar
Terms** (biases distractors toward the same confusable group), **Hard
Mode** (type the answer), **Flashcards**, **Missed Review** (a term clears
once you get it right twice in a row), **Final Review**, **Search**, and a
**Dashboard** (accuracy, mastery count, most-missed terms/questions). A
term is "mastered" after three correct answers in a row.

### Final Review tab

A new **Final Review** section quizzes from a 25-question bank covering
Chapter 4 (job analysis, job descriptions/specifications, talent
inventories, succession planning, job design — enrichment / enlargement /
rotation, organizational structure, policies/procedures/rules) plus extra
review topics pulled forward from later chapters: opportunity bias (Ch. 8),
the Kirkpatrick training-evaluation model (Ch. 7), safety culture (Ch. 12),
functional vs. dysfunctional stress (Ch. 12), and legitimating tactics
(Ch. 13).

It behaves like the other quiz modes: one question at a time, immediate
correct/incorrect feedback, an explanation, and a line connecting the
question back to your vocabulary deck where a matching term already
exists. Missed questions resurface more often (spaced-repetition style)
until answered correctly twice in a row; a question is "mastered" after
two correct answers in a row. Its own stats show up on the Dashboard tab
under "Final assessment review."

**Not yet included:** the full vocabulary list and the original 70 exam
questions, since those source files weren't uploaded.

## To add your real content

Upload `c202_vocab.txt` and `FINAL_quiz_C202_70questions.txt` and I can:

- Expand the `TERMS` array in `script.js` with your full vocabulary list
  (same `{ id, term, definition, group }` shape — group similar terms
  together so Similar Terms mode keeps using them as distractors).
- Add a dedicated **Exam Practice** mode that pulls straight from your
  70-question bank, with per-question explanations.

Everything else (mastery tracking, missed review, dashboard, search) will
automatically pick up any new terms you add — no other code changes
needed.
