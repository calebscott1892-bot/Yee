# Yee

Repository: [calebscott1892-bot/Yee](https://github.com/calebscott1892-bot/Yee)

Yee is a reverse hiring marketplace prototype. Instead of candidates repeatedly applying to jobs, candidates create a consented profile with up to five attested expertise areas. Verified employers search those expertise areas, shortlist relevant people, and request introductions.

## Product Direction

- Candidates control discoverability, contact methods, profile visibility, and optional boost status.
- Employers search by job-related expertise rather than sorting through open application spam.
- Profiles show attestation, availability, consent state, contact rules, and practical match signals.
- Employer verification, audit logs, anti-spam limits, and fair hiring prompts are treated as core product controls.
- Paid boosts can improve placement within eligible searches, but must not imply guaranteed interviews, hiring, or bias-free outcomes.

## Development

```bash
npm run dev
npm run lint
npm run build
npm run test:e2e
```

The app uses Next.js App Router, Tailwind CSS, and Playwright for the first browser interaction test.

## Compliance Notes

This is not legal advice. The prototype keeps early hiring-marketplace constraints visible because employment discovery can become a selection procedure. Relevant baseline references include:

- [EEOC: Employment Tests and Selection Procedures](https://www.eeoc.gov/laws/guidance/employment-tests-and-selection-procedures)
- [EEOC: Uniform Guidelines Q&A](https://www.eeoc.gov/laws/guidance/questions-and-answers-clarify-and-provide-common-interpretation-uniform-guidelines)
- [FTC and EEOC: Background Checks, What Employers Need to Know](https://www.ftc.gov/business-guidance/resources/background-checks-what-employers-need-know)
