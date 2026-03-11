# Written Summary

## What did you prioritize and why?

Parking enforcement is a collection problem. Every minute an officer walks to the wrong zone is a missed ticket — the driver returns to their car before the officer arrives, and the revenue disappears. The question isn't "where are the violations?" It's "where will they be by the time I walk there?"

The **Zone Queue** ranks zones by a weighted priority score (overstay count, violation count, occupancy). In production, this becomes an interception algorithm — a nearest-neighbor variant matching officer travel time to vehicle meter expiry. Officer 11 minutes away, meter expires in 11 minutes? That zone jumps to the top and is just as valid as an existing violation even though time isn't technically up yet. Once we mark them as violations, we collect as many as we can.

User research (scraping reviews of field apps like Spoke Circuit Route Planner) confirmed one thing: officers want one-tap navigation to Google Maps, not in-app routing. So the **Start Route** button delegates to Google Maps directly.

Three screens and a drawer: **Zone Queue** (where to go next), **Map View** (spatial awareness), **Activity Log** (shift record). The Zone Detail Drawer is the action hub — see the car, cite/warn/skip with one tap. Idea over polish. If the core loop — walk here, see car, ticket car — doesn't work, nothing else matters.

## What did you cut and why?

I cut all animations that we didn't get for free, toast notifications, and any design element that took longer than five minutes to implement. I wanted each screen to be a single-shot build using Claude Code's frontend design skill, then polish only the small things (map pins, card spacing, overstay pills). The goal was scannable-at-a-glance UI, not delightful UI.

I cut in-app navigation entirely. Google Maps gives us turn-by-turn directions, real-time traffic, and walking/driving mode switching for free. Building even a basic routing view would have burned hours for an inferior result.

I cut user auth, multi-officer coordination, and the backend orchestration layer. These are critical for production but add nothing to a prototype that demonstrates the core officer workflow.

## What assumptions did you make about user needs?

Officers want something brain-dead simple. They don't want to read — they want to see their location, see where to go, and walk there. If I can reduce their job to "walk here, look at this car, tap a button," that's the win.

I assumed officers work outdoors in variable conditions, so I designed for high contrast, large touch targets (44px minimum), and thumb-zone-aware layout. I assumed they're often walking or driving, which is why Google Maps navigation and the potential voice assistant evolution matter more than pixel-perfect desktop layouts.

I assumed the backend would handle priority scoring and route optimization. The frontend should be a thin rendering layer — shape the data server-side, send lean task-oriented payloads, and let the client just display and act.

## How did you approach the API design? What tradeoffs did you make?

Every endpoint is atomic and action-oriented. `POST /zones/:id/arrive` doesn't just flip a status — it mutates state and logs the activity entry in a single call. The frontend never has to coordinate two requests to complete one action. This means the client stays simple: fire a mutation, get back the updated state, done.

I used an action-as-URL pattern (`/vehicles/:vid/cite` instead of `POST /vehicles/:vid` with `{ action: "cite" }` in the body). This makes endpoints self-documenting, keeps request bodies empty, and means you can see the full action history in server logs without parsing payloads. The tradeoff is more route files, which I mitigated by consolidating cite/warn/skip into a single dynamic `[action]/route.ts` with runtime validation.

All POST endpoints return `201 Created` with the mutated resources in the response body. The client gets everything it needs to update its cache without a follow-up GET. The tradeoff is slightly larger responses, but it eliminates waterfall requests.

## What would you build next with another 2-3 hours?

**Manual zone and vehicle entry** — officers should be able to add a car they spot or create a new zone on the fly, not be limited to what the backend already knows about.

**Multi-officer coordination** — show every officer's location on the map with which zone they're walking to. The backend orchestrator would path all officers simultaneously using a nearest-neighbor or traveling salesman variant, then push each officer their personalized route. Zones with cars approaching their time limit (within the officer's walking distance) would be treated as valid stops even before a violation fires.

**Voice interface** — an LLM translation layer so officers can say "ticket the Honda Civic at Chestnut and 18th" hands-free while driving. The activity log already captures structured actions; voice just becomes another input method.

**Toasts and micro-feedback** — confirm actions with dismissible notifications. Better loading indicators. Hover states. Expandable activity log entries with full details.

**Airport/campus support** — swap the map tiles for an SVG floor plan overlay. The queue and drawer stay identical; only the map renderer changes.
