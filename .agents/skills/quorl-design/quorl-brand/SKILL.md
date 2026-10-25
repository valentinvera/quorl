---
name: quorl-brand
description: Use when creating or reviewing Quorl brand, product UI, landing pages, marketing materials, visual identity, UX writing, color usage, typography, layout, or design-system decisions. Triggers for Quorl brand, Quorl style, persistent AI teammates, agent rosters, conversations, computer use, runs, approvals, skills, routines, and finished-work experiences.
---

# Quorl Brand Guidelines

Quorl is a system for creating and directing persistent AI teammates that complete real work in real tools.

Use this skill to keep Quorl clear, calm, capable, trustworthy, and product-led. Quorl should feel like a command center for a dependable digital team: easy to delegate to, transparent while work is running, and precise when access, intervention, or approval is required.

## Brand Core

| Area | Direction |
| ---- | --------- |
| Positioning | The operating system for persistent AI teammates |
| Short promise | AI teammates that do the work |
| Product promise | Delegate an outcome, let your team work in real tools, and return to a finished result |
| Audience | Individuals and teams delegating operational, technical, creative, administrative, or personal digital work |
| Primary feeling | Assign confidently, observe when needed, and return to verifiable completed work |

## Core Colors

| Name | Hex |
| ---- | --- |
| Quorl Black | `#000000` |
| Quorl White | `#FFFFFF` |

Technical source of truth: shared brand tokens live in `packages/tokens` and are consumed through `@quorl/tokens/tailwind.css`, `@quorl/tokens/uniwind.css`, and `@quorl/tokens`. Web app styles still enter through `@quorl/ui/globals.css`, which imports the shared token CSS. Mobile styling starts in `apps/mobile/styles/globals.css`, which imports `@quorl/tokens/uniwind.css`.

### Semantic Colors

| Scale | Background | Foreground | Usage |
| ----- | ---------- | ---------- | ----- |
| Gray | `#16171AEB` | `#FDFEFFA6` | Structure, hierarchy, and subtle separation |
| Red | `#FF173F2D` | `#FF9592` | Critical states, denial, failure, risk, and irreversible actions |
| Amber | `#FA820022` | `#FFCA16` | Caution, pending work, approvals, uncertainty, and blockers |
| Green | `#22FF991E` | `#46FEA5D4` | Success, completion, connection health, and verified results |
| Blue | `#0077FF3A` | `#70B8FF` | Interactive and informational elements |

## Typography

Use **Geist Variable for everything** in Quorl: product UI, marketing, docs, headings, body text, labels, buttons, and code-like product surfaces unless a real code block requires the system monospace stack. Native surfaces may use the equivalent static Geist cuts when the platform package does not expose a variable font file.

| Font | Role |
| ---- | ---- |
| **Geist Variable** | Display, headings, titles, body, labels, navigation, product UI, and marketing copy |

### Typography Rules

- Use sentence case everywhere: headings, buttons, labels, and navigation.
- Use Geist Variable for all brand and product typography.
- Use Geist Variable weights intentionally: Regular, Medium, Semi Bold, and Bold.
- Use Bold only for strong hierarchy, not decoration.
- Never use decorative display fonts, multiple brand fonts, or novelty typefaces.
- Never use monospace for titles, body copy, labels, or marketing copy.
- Use monospace only for literal code, CLI commands, file paths, env names, or technical snippets.
- Keep letter spacing at `0` unless a specific production asset requires otherwise.
- Prefer concise, stable text that fits compact product UI.

### Typography Scale

Quorl's type scale is calibrated from compact product typography and precise marketing hierarchy. Reuse the shared Tailwind theme and CSS variables from `@quorl/ui/globals.css`; avoid raw `text-[...]` values unless a one-off visual proof needs measurement before becoming a shared style.

**Dense Product UI**

| Style | Font | Weight | Size/Line | Letter Spacing | Use |
| ----- | ---- | ------ | --------- | -------------- | --- |
| micro | Geist Variable | Regular/Medium | 10/15 | 0 | Dense chart ticks, tiny metadata, compact IDs |
| compact | Geist Variable | Regular/Medium | 11/15.4 | 0 | Secondary dense labels, timestamps, compact sidebar metadata |
| caption | Geist Variable | Regular/Medium | 12/16.8 | 0 | Tables, descriptions, form help, compact product copy |
| small | Geist Variable | Regular/Medium | 13/19.5 | 0 | Navigation, badges, buttons, interactive labels |
| medium | Geist Variable | Regular/Medium/Semi Bold | 14/21 | 0 | Card titles, row titles, small section labels |
| nav | Geist Variable | Regular/Medium | 14/20 | 0 | Desktop landing navigation links |
| action | Geist Variable | Medium | 14/20 | 0 | Compact landing actions and waitlist buttons |
| control | Geist Variable | Regular/Medium | 14/20 | 0 | Compact landing form inputs and placeholders |
| footer | Geist Variable | Regular/Medium | 14/20 | 0 | Footer description and navigation links |
| large | Geist Variable | Regular/Medium | 15/24 | 0 | Mobile paragraphs and standard landing body |
| body | Geist Variable | Regular/Medium/Semi Bold | 16/24 | 0 | Product UI body where more readability is needed |
| emphasis | Geist Variable | Medium/Semi Bold | 17/27.2 | 0 | Compact emphasized status copy |

**Landing Product Demos**

Product demos use a stable interface scale at every breakpoint. Responsive behavior should recompose or hide secondary content instead of scaling the typography.

| Style | Font | Weight | Size/Line | Letter Spacing | Use |
| ----- | ---- | ------ | --------- | -------------- | --- |
| demo-metadata | Geist Variable | Regular/Medium | 12/18 | 0 | Codes, context, compact labels, badges, and supporting metadata |
| demo-control | Geist Variable | Medium/Semi Bold | 14/20 | Buttons, inputs, navigation, and interactive row titles |
| demo-body | Geist Variable | Regular/Medium | 16/24 | Product explanations, delegation, progress, and result copy |
| demo-title | Geist Variable | Semi Bold | 20/28 | Primary title inside each demo surface |
| demo-stat | Geist Variable | Semi Bold | 24/32 | Supporting review metrics |
| demo-score | Geist Variable | Bold | 56/64 | Rare primary run or usage metric |

**Marketing And Editorial**

| Style | Font | Weight | Size/Line | Letter Spacing | Use |
| ----- | ---- | ------ | --------- | -------------- | --- |
| paragraph-md | Geist Variable | Regular/Medium | 18/28 | 0 | Landing paragraphs on medium and large viewports |
| xlarge | Geist Variable | Regular/Medium | 20/26.6 | 0 | Tablet/desktop intro paragraphs |
| paragraph-xl | Geist Variable | Regular/Medium | 20/30 | 0 | Landing paragraphs on wide viewports |
| section | Geist Variable | Regular/Medium/Semi Bold | 24/31.92 | 0 | Mobile section titles, desktop large body |
| subtitle | Geist Variable | Regular/Medium/Semi Bold | 32/36 | 0 | Supporting headlines and quote-scale text |
| hero | Geist Variable | Medium | 38/41.8 | 0 | Mobile hero headlines |
| section-lg | Geist Variable | Medium/Semi Bold/Bold | 40/44 | 0 | Tablet section titles |
| hero-title | Geist Variable | Medium | 46/51 | 0 | Landing hero title on mobile and small viewports |
| title | Geist Variable | Medium/Semi Bold/Bold | 48/48 | 0 | Desktop section titles |
| display | Geist Variable | Medium/Bold | 56/62 | 0 | Tablet/desktop hero headlines and large numeric values |
| display-lg | Geist Variable | Medium/Bold | 64/64 | 0 | Wide hero headlines and primary display moments |
| display-xl | Geist Variable | Bold | 72/72 | 0 | Rare maximum-impact desktop headline only |
| hero-title-xl | Geist Variable | Medium | 96/96 | 0 | Landing hero title on wide viewports |

**Responsive Landing Roles**

| Style | Font | Weight | Size/Line | Letter Spacing |
| ----- | ---- | ------ | --------- | -------------- |
| Hero title | Geist Variable | Medium | base `hero-title` 46/51, md `display-lg` 64/64, xl `hero-title-xl` 96/96 | 0 |
| Hero subtitle | Geist Variable | Regular/Medium | base `body` 16/24, md `paragraph-md` 18/28, xl `paragraph-xl` 20/30 | 0 |
| Section title | Geist Variable | Medium | base `subtitle` 32/36, md `section-lg` 40/44, xl `title` 48/48 | 0 |
| Section paragraph | Geist Variable | Regular/Medium | base `body` 16/24, md `paragraph-md` 18/28, xl `paragraph-xl` 20/30 | 0 |
| Closing title | Geist Variable | Medium | base `section-lg` 40/44, md `title` 48/48, xl `display` 56/62 | 0 |
| Badge/button | Geist Variable | Medium | `small` 13/19.5 | 0 |
| Desktop nav link | Geist Variable | Regular/Medium | `nav` 14/20 | 0 |
| Mobile nav link | Geist Variable | Regular/Medium | `body` 16/24 | 0 |
| Navbar CTA | Geist Variable | Medium | `action` 14/20 at every breakpoint | 0 |
| Hero waitlist CTA | Geist Variable | Medium | `action` 14/20 at every breakpoint | 0 |
| Closing actions | Geist Variable | Medium | `action` 14/20 at every breakpoint | 0 |
| Hero waitlist input | Geist Variable | Regular | `control` 14/20 at every breakpoint | 0 |
| Footer description/link | Geist Variable | Regular | `footer` 14/20 at every breakpoint | 0 |
| Product UI title | Geist Variable | Medium/Semi Bold | `medium` 14/21 or `body` 16/24 | 0 |
| Product UI metadata | Geist Variable | Regular/Medium | `caption` 12/16.8, `compact` 11/15.4, or `micro` 10/15 | 0 |
| Code | System monospace | Regular | 14/21 | 0 |

## Logo

The active Quorl identity is a compact, friendly monochrome mark with two eye cutouts and a sweeping lower extension. It suggests an approachable digital teammate without turning into a detailed mascot or literal interface icon.

The canonical assets are:

- `assets/brand/quorl-mark.svg`
- `assets/brand/quorl-mark.png`

Use the SVG whenever possible. The PNG is the approved `1024×1024` raster export. Both assets are white with transparent cutouts and require a sufficiently dark background. No approved wordmark, dark mark, favicon set, app-icon set, or alternate logo geometry currently exists; do not invent or reference one as canonical.

### Product Integration

When an application needs its own copy, derive it from `assets/brand/quorl-mark.svg` and keep the source asset canonical. Preserve transparency and verify platform-specific padding before producing web, desktop, iOS, or Android icons.

### Naming

Use `Quorl` as a single word with a capital `Q`. Avoid `QUORL`, `quorl`, `Quorl App`, `Quorl.app`, `Quorl AI`, `Quorl Product`, and descriptive extensions as formal names. Use the product name alone, then explain the product in nearby copy.

### Clearspace

Keep at least `1/4` of the mark's artboard width as clearspace on all sides.

Never place text, icons, badges, UI chrome, page edges, image edges, or other logos inside the clearspace.

### Minimum Size

- Preferred: 24px height
- Extreme cases: 16px height minimum
- Prefer at least 24px rendered height.
- In extreme cases, 16px is the minimum.
- If the eye cutouts close visually, increase the rendered size.

### Logo Restrictions

Never:

- Rotate the mark.
- Apply shadows, glows, outlines, strokes, textures, or gradients.
- Slant, stretch, compress, crop, or distort the geometry.
- Use multiple colors inside the logo.
- Use low-resolution exports when SVG is available.
- Add facial features, text, or other elements inside the mark.
- Modify the silhouette, eye proportions, eye spacing, or internal geometry.
- Put the logo on low-contrast, noisy, or visually busy backgrounds.

## Secondary Elements

No secondary brand symbol, texture, or mascot asset is currently approved. Do not invent one or treat temporary explorations as part of the identity.

## Gradients

| Name | Value |
| ---- | ----- |
| Font gradient | `linear-gradient(97deg, #ffffff 30%, rgba(255,255,255,0.50) 100%)` |
| Smooth gradient | `linear-gradient(96deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.10) 100%)` |
| Border | `linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)` |
| Rainbow border | `linear-gradient(90deg, rgba(2,252,239,0.44) 0%, rgba(255,181,43,0.44) 50%, rgba(160,43,254,0.44) 100%)` |

## Effects

| Name | Value |
| ---- | ----- |
| Glass blur | `backdrop-filter: blur(25px)` |

## Design Tokens

Shared brand tokens live in `packages/tokens`. Use `@quorl/tokens/tailwind.css` for web/Tailwind surfaces, `@quorl/tokens/uniwind.css` for mobile/Uniwind surfaces, and `@quorl/tokens` for typed token access in TypeScript.

Do not redefine Quorl colors, typography, radius, spacing, shadows, blur, or semantic state colors inside individual screens. Add shared brand decisions to `packages/tokens`; keep `@quorl/ui/globals.css` focused on web-specific imports, sources, shadcn integration, and base layers.

## Textures

No Quorl texture assets exist yet. Do not use or invent texture assets.

## Backgrounds

No Quorl background or wallpaper assets exist yet. Do not use or invent background asset URLs.

## Reference Quality Bar

Quorl should reach the product and brand quality level of Vercel, Linear, Resend, and Raycast without copying their logos, exact layouts, marketing claims, colors, animations, or component silhouettes. Treat them as calibration references for taste, precision, restraint, and operational clarity.

Use these references as quality signals:

- Vercel: crisp hierarchy, technical confidence, restrained surfaces, fast scanning, and product-led proof.
- Linear: focused workflows, calm density, explicit state, strong alignment, and operational elegance.
- Resend: monochrome discipline, sharp typography, clear developer-product positioning, and minimal ornament.
- Raycast: compact productivity surfaces, decisive shortcuts/actions, polished details, and strong brand memory.

Quorl should feel equally intentional: not a generic SaaS template, not an AI chat wrapper, and not a decorative dashboard. The product should feel like a serious command center for persistent teammates performing consequential work.

Do not interpret this as "make it look like Vercel/Linear/Resend/Raycast." Interpret it as:

- Every screen needs a clear product idea, not just a beautiful arrangement.
- Every visual object should explain agent ownership, current work, progress, handoffs, approvals, evidence, or the next action.
- Every section should have a distinct composition, not repeated cards with different copy.
- Every component should feel precise, quiet, and necessary.
- Every landing/product surface should look good enough to sit next to those products without feeling like a clone.

## Layout Patterns

| Name | Description |
| ---- | ----------- |
| Right Object Scene | Small label top-left, title top-left (2 lines), 3D object right |
| Interface Scene | Label top-left, title bottom-left (2 lines), UI screenshot background |
| Text Only Scene | Title top-left, 3D abstract scene fills background |
| Text Only Background | Large title centered, subtle texture/gradient background |
| Text Only Subtle | Small centered text (2 lines), minimal dark background |
| Big Number | Large display number centered, small label below |

**Common patterns:**

- Label/category always small, top-left or top-center.
- Titles use 2-line breaks for rhythm.
- Titles are never longer than 3 lines.
- Objects are positioned right, left, or as full background.
- Dark backgrounds with subtle depth.
- Product surfaces should prioritize real conversations, agent rosters, computer activity, run state, handoffs, approvals, artifacts, skills, routines, and memory.

## Layout And Composition Rules

Quorl product screens are operational workspaces, not decorative AI chat pages. Design every screen around the work relationship it supports: what was delegated, which teammate owns it, where it is running, what changed, what needs approval, and what result was delivered.

### Composition Before Components

- Start with the user question before choosing components.
- Do not default to "heading plus card grid" unless the information truly has peer items.
- Give each important screen one dominant object:
  - Agent roster: specialists, ownership, availability, and current state.
  - Conversation: delegation, progress, handoffs, approvals, and results.
  - Computer view: the live remote workspace and takeover controls.
  - Run detail: timeline, current state, evidence, files, and unresolved work.
  - Skills and routines: reusable methods, schedules, triggers, ownership, and history.
  - Approval queue: consequential action, context, impact, and explicit user choice.
- Surround the dominant object with only the supporting context needed to act.
- If every section has equal visual weight, redesign the hierarchy before adding surfaces, color, icons, or borders.

### Operational Geometry

Use geometry to communicate product meaning:

- Agent ownership -> stable identity, placement, and clear attribution.
- Run sequence -> ordered timeline or clear progression.
- Working state -> visible motion or emphasis that does not obscure content.
- Waiting state -> explicit blocker, required party, and next action.
- Handoffs -> visible connection between the originating and receiving agents.
- Approvals -> separation from ordinary progress with consequence and scope visible.
- Completion -> result, destination, evidence, and remaining limitations grouped together.

Do not use charts, bars, or diagrams only because data exists. Use them only when they make ownership, progress, cost, coordination, or risk faster to understand.

### Grid And Alignment

- Use a consistent page grid across web product surfaces.
- Align objects to shared edges, baselines, grid lines, or deliberate optical centers.
- Equivalent items must share structure: label position, value position, action alignment, row rhythm, and type role.
- Do not strand conversations, run timelines, computer views, approval queues, or dense tables in narrow tracks when available width would make scanning easier.
- Let dense product tools use the full content width when lookup, comparison, or drag/reorder behavior benefits from it.
- On mobile, recompose the layout before shrinking text or hiding useful context.

### Surfaces And Boundaries

- Treat the page as one continuous workspace by default.
- Use a card, panel, border, or separated surface only when it communicates a real grouping, selected state, warning, interaction zone, or contrast that spacing cannot express.
- Do not wrap every section, message, run, artifact, or agent in a card.
- Do not put cards inside cards or panels inside panels.
- Do not use borders to compensate for weak hierarchy.
- Prefer spacing, alignment, density shifts, and typography before adding boxes.
- Keep radii restrained and consistent with the shared Quorl styles.

### Rhythm And Density

- Build spacing from relationships, not one uniform gap everywhere.
- Keep headings close to the content they introduce.
- Keep labels, values, details, and actions aligned consistently across peer rows.
- Use larger separation only when the user is moving to a new work or control area.
- Empty space must help the dominant object stand out. Accidental holes, orphaned third columns, and underfilled split layouts are failures.
- Quorl can be dense because it is an operational product, but density must remain scannable and calm.

### Screen Structure

- Every section must answer a different operational question.
- Remove repeated summaries that say the same thing with different components.
- Keep one home for each state or result; do not duplicate the same progress, approval request, or artifact at equal prominence.
- End product flows with a finished result, explicit next action, required approval, or unresolved blocker.
- Mobile screens should optimize for delegation, status, notifications, approvals, and quick intervention. Web screens should optimize for deeper coordination, review, configuration, and computer observation.

### Responsive Behavior

- Preserve readable type and tappable controls.
- Give grid and flex children `min-width: 0` so content can reflow safely.
- Reflow before truncating or shrinking important text.
- Long tables, ledgers, and boards may scroll locally when preserving lookup is more useful than forcing everything into stacked cards.
- Light and dark modes should preserve the same hierarchy, not merely invert colors.

### Motion

- Default to stillness.
- Use motion only to explain a state change, preserve continuity, or confirm an action.
- Do not use motion as decoration, suspense, or personality.
- Never gate reading behind animations.
- Respect reduced-motion preferences.

## Web UI Construction Rules

In `apps/web`, use shadcn/ui as the default component foundation through `packages/ui`. Compose Quorl-specific screens from shadcn primitives and shared styles before creating custom component markup.

### shadcn First

Before creating or editing visible web UI:

- Use the `shadcn` skill together with this Quorl skill.
- Inspect the project's shadcn context from `components.json` when component APIs, aliases, install paths, or monorepo behavior matter.
- Check existing components in `packages/ui/src/components`.
- If a needed shadcn component is missing, add it from `apps/web` with `bunx --bun shadcn@latest add <component>` so the CLI installs files into the correct monorepo locations.
- Import web UI primitives from `@quorl/ui/components/*`.
- Use `@quorl/ui/lib/utils` for `cn` and shared UI helpers when available.
- Use the CSS variables exposed by `@quorl/ui/globals.css`, sourced from `@quorl/tokens/tailwind.css`. Do not write raw hex colors, duplicate shared values, or add app-local design variables without a real app-specific need.

### Component Selection

| Need | Use |
| ---- | --- |
| Primary or secondary action | `Button` |
| Email capture, waitlist, settings, or product forms | `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Button` |
| Inline warning, blocker, takeover request, or approval consequence | `Alert` |
| Run state, agent availability, or small metadata with real semantic meaning | `Badge` |
| Run history, approval queues, routine history, or structured agent data | `Table`, `Item`, or composed rows from shadcn primitives |
| Product sections with a real boundary | `Card` only when the boundary means something |
| Separating unrelated regions | `Separator` |
| Navigation modes, agent views, run views, or result categories | `Tabs` or `ToggleGroup` |
| No agents, conversations, runs, routines, approvals, or results | `Empty` |
| Loading states | `Skeleton` or `Spinner` |
| Dialogs, command flows, destructive confirmation | `Dialog`, `AlertDialog`, `Sheet`, or `Command` |
| Explanatory hover affordances | `Tooltip`, `HoverCard`, or `Popover` |

### Custom UI Policy

Custom web components are allowed when they represent Quorl-specific product composition: agent rosters, conversation handoffs, live computer views, run timelines, approval controls, skill and routine builders, result evidence, memory views, or brand-specific landing compositions.

Custom web components are not allowed for generic primitives that shadcn already covers: buttons, inputs, cards, badges, alerts, dialogs, dropdowns, tabs, tables, separators, skeletons, tooltips, forms, and command palettes.

If custom UI is necessary, it must still use shared Quorl styles, shadcn composition conventions, accessible HTML, and restrained Quorl layout rules.

## AI Design Workflow

For AI-assisted UI work, treat the first generated result as a structure draft, not a finished design. Before shipping or handing off UI, run this design pass:

1. Product pass: name the delegation, observation, approval, intervention, coordination, or result-review job each section helps the user complete.
2. Composition pass: remove repeated card grids, equal-weight sections, generic hero patterns, and fake product visuals.
3. Component pass: replace hand-rolled primitives with shadcn components in web and HeroUI Native components in mobile.
4. Token pass: remove raw colors, one-off spacing, one-off radii, and app-local design variables.
5. Density pass: adjust alignment, rhythm, hierarchy, and whitespace so the screen feels designed, not evenly distributed.
6. Responsive pass: verify desktop, tablet, and mobile with Playwright screenshots for web.

## AI Generic Detection Checklist

If any of these are true, revise the UI before calling it done:

- The page could work unchanged for any AI productivity SaaS.
- The hero says a broad promise but does not show real delegation, computer use, progress, coordination, approvals, or finished work.
- The page is mostly a centered headline, email box, logos, feature cards, and FAQ.
- Every section uses the same card/grid silhouette.
- The UI relies on gradients, glow, blur, icon tiles, pills, or decorative dashboards to feel polished.
- A product screenshot or panel looks impressive but does not show a real task, state, action, handoff, approval, or result.
- The code creates local primitives instead of using shadcn components already available in `packages/ui`.
- The screen copies a reference brand instead of translating Quorl's own product idea into a distinct composition.
- The design looks acceptable in one viewport but loses hierarchy, spacing, or useful context in tablet/mobile.

## Reject Patterns

Do not ship these patterns in Quorl:

- Generic centered hero copy followed by a card grid.
- Cards inside cards, panels inside panels, or nested bordered boxes.
- Border gradients, gradient text, glows, blobs, bokeh, glass effects, fake depth, decorative shadows, or ornamental textures.
- Decorative grid backgrounds, stripes, side rails, or noisy abstract backgrounds.
- Repeated metric cards when one composed relationship would explain the product state better.
- Badges, pills, or rounded capsules for ordinary labels, metadata, or every status.
- Icons as decoration, oversized icons, mixed icon styles, or arbitrary icon tiles.
- A dark rounded rectangle around every chart, board, or tool.
- Identical section silhouettes across unrelated product questions.
- Tiny muted copy used to make overcrowded UI fit.
- Tables or boards compressed into narrow columns while useful width is empty.
- Color-only meaning for status, risk, priority, or readiness.
- Fake product screenshots, stock imagery, generic AI illustrations, or visual assets that do not explain the product.
- Repeated recommendation, summary, rationale, and conclusion blocks that say the same thing.
- Authoring-process copy such as "this section shows" or "we organized this by".
- Visible theme toggles in formal marketing or brand pages unless the product context actually requires one.
- Hand-rolled web buttons, inputs, badges, alerts, dialogs, tabs, tables, forms, skeletons, or tooltips when a shadcn component exists.
- Marketing pages that imitate Vercel, Linear, Resend, or Raycast directly instead of using them as a quality bar.

## Design Principles

1. Dark-first design philosophy
2. Sharp contrast between black and light
3. Precision and focus over decoration
4. Accent colors communicate state, not style
5. Simple, stable, intentional forms

## Product Principles

Use these principles when shaping Quorl screens, flows, copy, and visuals:

1. Outcomes over answers.
2. Teammates over generic assistants.
3. Natural delegation before automation setup.
4. Real work belongs in real tools.
5. Autonomy must remain visible and bounded.
6. Finished results need evidence.
7. Sensitive actions stop for approval or takeover.
8. The same team follows the user across web, desktop, and mobile.

## Voice And Tone

Quorl writes directly, calmly, and without hype.

Use:

- Clear, short product language.
- Firm guidance without arrogance.
- Practical language for people delegating real work.
- Technical specificity when it helps.
- No emojis by default.
- Minimal humor.
- No generic AI-productivity language.

Avoid:

- "Unlock your full potential"
- "AI-powered productivity"
- Hype, motivational filler, or vague startup language
- Infantilized, overly colorful, or corporate tone

Preferred copy examples:

```text
I finished the account review and updated the CRM.
```

```text
Waiting for your approval before sending 12 messages.
```

```text
The login requires a one-time code. Take control to continue.
```

```text
Research is complete. The sources and brief are ready to review.
```

## Experience Direction

Quorl should feel operational and focused:

- Onboarding creates a focused first teammate and a safe first task.
- Delegation feels like messaging a trusted colleague.
- Agent identity, ownership, current state, and boundaries stay visible.
- Conversations show useful progress without exposing private reasoning.
- Computer activity can be observed and taken over when human input is required.
- Handoffs between agents remain legible.
- Approvals state the action, destination, consequence, and alternatives clearly.
- Results link to the changed tool, artifact, source, or evidence.
- Mobile supports delegation, monitoring, notifications, approvals, and intervention.
- Web supports deeper coordination, configuration, review, and computer observation.
- Desktop connects remote execution with explicitly authorized local work.
- Dashboards stay operational, not decorative.
