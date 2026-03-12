# Written Summary

## What did you prioritize and why?

Parking enforcement is a collection problem. Every minute an officer walks to the wrong zone is a missed ticket — the driver returns before the officer arrives. The question isn't "where are the violations?" It's "where will they be by the time I walk there?"

The **Zone Queue** ranks zones by a weighted priority score (overstay count, violation count, occupancy). In production, this becomes an interception algorithm matching officer travel time to meter expiry — a zone where the meter runs out right as you arrive is just as valid as an existing violation.

I built three screens and a drawer:

- **Zone Queue** — where to go next
- **Map View** — spatial awareness with color-coded markers
- **Activity Log** — shift record of all actions taken
- **Zone Detail Drawer** — the action hub: see the car, cite/warn/skip with one tap

User research (scraping reviews of field apps like Spoke Circuit Route Planner) confirmed officers want one-tap navigation to Google Maps, not in-app routing. So the **Start Route** button delegates directly.

If the core loop — walk here, see car, ticket car — doesn't work, nothing else matters.

## What did you cut and why?

- **Animations and toasts** — anything taking more than five minutes to implement. Scannable-at-a-glance over delightful.
- **In-app navigation** — Google Maps gives turn-by-turn, real-time traffic, and mode switching for free.
- **Auth, multi-officer coordination, backend orchestration** — critical for production, irrelevant for demonstrating the core workflow.

## What assumptions did you make about user needs?

Officers want brain-dead simple. They don't want to read — they want to see where to go, walk there, and tap a button.

- Officers work outdoors in variable conditions → high contrast, large touch targets (44px min), thumb-zone layout
- Officers are walking or driving → Google Maps navigation matters more than pixel-perfect desktop layouts
- The frontend should be a thin rendering layer — shape data server-side, send lean payloads, let the client display and act

## How did you approach the API design? What tradeoffs did you make?

Every endpoint is atomic. `POST /zones/:id/arrive` mutates state and logs activity in a single call — the frontend never coordinates two requests for one action.

- **Action-as-URL pattern** — `/vehicles/:vid/cite` instead of a body payload. Endpoints are self-documenting, request bodies stay empty, server logs show actions without parsing. Tradeoff: more route files, mitigated by consolidating cite/warn/skip into a single dynamic `[action]/route.ts`.
- **201 Created with full response** — all POST endpoints return the mutated resources. The client updates its cache without a follow-up GET. Slightly larger responses, but no waterfall requests.

## What would you build next with another 2-3 hours?

- **Manual zone/vehicle entry** — officers add cars they spot or create zones on the fly
- **Multi-officer coordination** — show all officers on the map, path them simultaneously, push personalized routes
- **Voice interface** — an LLM layer so officers can say "ticket the Honda Civic at Chestnut and 18th" hands-free
- **Toasts and micro-feedback** — confirm actions with dismissible notifications, better loading states, expandable log entries
