# Design System Document

## 1. Overview & Creative North Star: "The Mindful Curator"
This design system moves away from the cluttered, "plastic" feel of traditional parenting apps. Our Creative North Star is **The Mindful Curator**: a philosophy that treats digital management as a serene, editorial experience. 

We break the "standard template" look by utilizing intentional white space, high-contrast typography scales, and a departure from rigid boxes. By using asymmetric layouts—where a headline might sit slightly offset from a card’s edge—we create a rhythmic flow that feels human and encouraging rather than clinical. The goal is to provide parents with a sense of "organized calm."

## 2. Color & Tonal Depth
The color strategy is rooted in absolute clarity for multi-child management. We move beyond flat fills by using tonal depth and sophisticated transparency.

### Color Roles
- **Primary (Teal - Child 1):** `#006565` (Primary) to `#008080` (Container). Represents stability and growth.
- **Secondary (Coral - Child 2):** `#a43c12` (Secondary) to `#fe7e4f` (Container). Represents warmth and energy.
- **Neutral Surface Palette:** A range from `surface-container-lowest` (#ffffff) to `surface-dim` (#d8dada).

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content. Boundaries must be defined solely through background shifts. Place a `surface-container-lowest` card on a `surface-container-low` background to create a "ghost" boundary. This mimics the look of high-end stationery.

### The "Glass & Gradient" Rule
To elevate the interface, use **Glassmorphism** for the Top Child Toggle and Bottom Navigation. Use a semi-transparent `surface` color with a `20px` backdrop-blur. This allows the primary child colors to bleed through subtly, maintaining the parent's context. 
*   **Signature Texture:** Main CTAs should use a subtle linear gradient from `primary` to `primary_container` (or `secondary` to `secondary_container`) at a 135-degree angle to provide a "jewel-like" depth.

## 3. Typography: Editorial Authority
We pair the geometric stability of **Inter** with the expressive, high-end feel of **Manrope**.

- **Display & Headlines (Manrope):** Used for large milestones and daily summaries. The tight tracking and generous scale of `display-md` (2.75rem) create an authoritative, editorial feel.
- **Titles & Body (Inter):** Used for functional data and descriptions. `title-md` (1.125rem) should be used for card headers to ensure professional readability.
- **Labels (Inter):** Reserved for metadata. Use `label-md` with 5% letter-spacing to give small text a premium, "designed" appearance.

## 4. Elevation & Depth: Tonal Layering
Traditional shadows often look "muddy." We achieve hierarchy through **Tonal Layering**.

- **The Layering Principle:** Stack `surface-container` tiers. A `surface-container-highest` element should be reserved for the most urgent interaction (e.g., a medication reminder), while general logs sit on `surface-container-low`.
- **Ambient Shadows:** For "floating" elements like FABs or the child toggle, use a shadow with a 24px blur and 6% opacity. The shadow color must be a tinted version of `on-surface` (#191c1d) to mimic natural light.
- **The "Ghost Border" Fallback:** If a container lacks contrast against its parent, use the `outline-variant` token at **15% opacity**. Never use a 100% opaque border.

## 5. Components & Interface Elements

### The Signature Child Toggle (Top Navigation)
A prominent, pill-shaped toggle at the top of the screen.
- **Active State:** Uses the child’s specific color (`primary_container` or `secondary_container`) with a white `title-sm` label.
- **Inactive State:** `surface-container-high` with `on-surface-variant` text.
- **Styling:** Apply `xl` (1.5rem) roundedness and a subtle `surface-tint` to the background.

### Cards & Lists
- **Cards:** Forbid divider lines. Use `spacing-6` (1.5rem) of vertical white space to separate list items within a card.
- **Background:** Use `surface-container-lowest` for card bodies.
- **Corner Radius:** Standardize on `lg` (1rem) for content cards to maintain a friendly but professional tone.

### Buttons & Inputs
- **Primary Button:** Gradient-filled (Child Color) with `full` (9999px) rounding.
- **Secondary/Ghost Button:** No background fill; use a `title-sm` font in the child's primary color.
- **Input Fields:** Use `surface-container-low` for the input track. Upon focus, transition the background to `surface-container-lowest` and add a "Ghost Border" in the active child's color.

### Contextual Components
- **The Timeline Thread:** A vertical line-less list using `surface-container-high` dots to mark events.
- **Progress Rings:** Use thin-stroke (2px) circles for developmental milestones to maintain the "clean" aesthetic.

## 6. Do’s and Don'ts

### Do:
- **Use "Breathing Room":** If a screen feels crowded, increase spacing using the `spacing-8` (2rem) or `spacing-10` (2.5rem) tokens.
- **Color-Code Intentionally:** Ensure every Teal element is strictly for Child 1 and every Coral element for Child 2. Never mix these colors in the same container.
- **Layer for Importance:** Move critical info to "higher" surface containers (whiter/brighter) to draw the eye.

### Don't:
- **Don't use 1px lines:** Avoid dividers. If you feel you need a line, use a background color shift instead.
- **Don't use pure black:** Use `on-surface` (#191c1d) for text to keep the interface soft and approachable.
- **Don't use standard "Drop Shadows":** Avoid the default "fuzzy grey box" look. Stick to the Ambient Shadow rules (low opacity, high blur).
- **Don't clutter the Bottom Nav:** Keep to 4-5 icons max, using `label-sm` for clarity.