# PRAVEQ MENTOR — Site IA v2 (2026-10-27)

Status: PROPOSAL ONLY. **Do not deploy these specifications by merging into the redirect repository.** The current main/index.html is an intentional redirect to https://praveqmentor.com/. Identify the canonical live-site source before implementation.

## Approved content architecture
- Navigation: Our Approach / Founder / Journal / Free Consultation.
- Our Approach: whom we mentor, personalized study plans, weekly mentoring, essay feedback, interviews, actual service flow, parent-facing FAQ, consultation CTA.
- Founder: Meet Shu; background (Aoyama Gakuin University / EIKEN Grade 1); motivation; principles; Mindset archive (all existing Mindset articles, retained in full).
- Journal: one reverse-chronological feed, **no categories or category tabs**, focused on what PRAVEQ actually provides. Publish operational explainers from the beginning (not pretend student stories).
- Later, real mentoring stories and client experiences ONLY with appropriate consent and anonymization.
- Site architecture differentiates Founder (why learn with Shu) vs Our Approach (how learning works) vs Journal (inside the program).

## URL and migration requirements
1. Inventory the canonical live-site article IDs, slugs, dates, assets, redirects, and all links.
2. Move existing Mindset content to Founder archive without data loss.
3. Preserve old journal/mindset links via 301 redirects where infrastructure allows; otherwise provide canonical and internal replacements.
4. Render Journal as a **single feed** with dates (no taxonomy, no Mindset/Journey filter).
5. Ensure each article has a permanent, canonical deep link, share image metadata, title, and concise description.
6. Do not publish simulated customer stories as real.
7. Retain existing booking link and test on mobile. Do not invent appointment URL.
8. Avoid duplicating GA4 events.

## Journal launch articles — sequence
1. What happens in the initial 100-minute diagnosis? State the actual confirmed contents only.
2. How a four-week EIKEN study plan is built (clearly labeled illustrative example).
3. A week of mentoring: 50-minute session and between-session follow-up.
4. How essay feedback works (self-written sample response, not fictitious student).
5. From a free 30-minute consultation to starting mentorship.

Verify these durations and their relationship to the published contract and program guide before publishing.

## Publishing and distribution
- Publish a Journal article to website after founder approval.
- Generate platform-specific draft posts for Threads, Instagram, and note, based on the article and canonical URL.
- Human approval checkpoint **before each external posting**. No auto-publishing without explicit approval and valid integrations.
- Instagram may require a separate image/carousel asset; never assume API posting permissions.
- Store publication status per channel: draft / awaiting approval / posted / failed, plus URL and timestamp.
- Avoid personal student details in public text and tracking.
- Do not maintain two divergent editorial source-of-truth systems.

## Acceptance tests
- All existing Mindset articles are accessible under Founder, with no missing content.
- Journal renders one timeline; no filters/categories.
- Mobile navigation has Our Approach, Founder, Journal and CTA.
- Initial Journal explanatory pieces are presented as descriptions, not documented outcomes.
- Booking flow works end to end; parent-facing terms and privacy are accessible.
- Social posts never go live automatically on article publication.
- Canonicals, sitemap, robots.txt and analytics conform to the live deployment.
- Redirect repo continues redirecting correctly until the actual deployment source is identified.

## Next implementation dependency
Identify and obtain write access to the **actual content-management/deployment source** of praveqmentor.com. This GitHub repository's root index is a redirect, not the live application. Do not replace main/index.html.
