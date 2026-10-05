# World Cup Front-Page Weather Centre Plan

## Purpose
Embed the Guyana weather dashboard natively into the England Over 40s World Cup 2026 front page, so tournament visitors can use the operational forecast without a temporary preview URL, a separate domain, or an iframe.

## Implementation approach

- Add a client-side React `WeatherDashboardSection` to the existing **Stadium Broadcast** front-page sequence, directly after the tournament schedule. Add a **Weather** anchor to the existing main navigation.
- Fetch Open-Meteo hourly and daily forecasts in the browser for **Georgetown** and **Berbice (New Amsterdam)**. Keep the existing 60-minute client cache/refresh model, with a manual refresh action and clear unavailable/future-date treatment.
- Show the event range **15 October–1 November 2026** as selectable tournament dates. Values appear only when the selected date is within the live provider window.
- Preserve the full operational reading set: air temperature, feels-like temperature, calculated wet-bulb temperature, wind direction/speed/gusts, precipitation amount/probability/risk, likely rain-period onset/cessation, sunrise and sunset, and a responsive hourly table.
- Include the wet-bulb calculator, with validation and a prefill action using the selected forecast. Wet-bulb is calculated using the Stull approximation from air temperature and relative humidity; it is an indicative planning value.
- Apply clause 12.5 of the supplied *IMC Playing Conditions Guyana 2026* to hourly **air-temperature** forecasts only: amber planning watch from 31°C, amber drinks-protocol status from 32°C, amber at 36°C, and red cessation risk only above 36°C. State prominently that the nominated match-location smartphone app, appointed officials and Competition Committee control match-time decisions.
- Classify hour-level precipitation as Low, Watch, Likely or High. A likely rain window starts when chance is at least 50% or precipitation is at least 0.2 mm, and ends after the last consecutive qualifying hour; onset/cessation remain forecast estimates.

## Design decisions

- **Design movement:** retain the existing Stadium Broadcast visual system: navy structural panels, sky-blue live-data accents and restrained gold for tournament context.
- **Layout:** use a dedicated, full-width weather section with location/date controls above a compact operational summary; use a horizontally scrollable data table only on narrow screens.
- **Status language:** present forecast values as planning evidence, never an authoritative match decision. Empty states state why data is unavailable rather than inferring conditions.
- **Accessibility:** use semantic section/heading structure, labelled controls, `aria-pressed` location/date controls, and text labels in addition to colour for rain and heat status.

## Project structure

| Path | Responsibility |
| --- | --- |
| `client/src/components/WeatherDashboardSection.tsx` | Native front-page weather centre, forecast fetch, calculations, controls and responsive UI. |
| `client/src/pages/Home.tsx` | Places the weather centre in the front-page flow. |
| `client/src/lib/data.ts` | Adds the Weather navigation item. |
| `client/src/components/StickyNav.tsx` | Uses the shared navigation data without bespoke weather navigation logic. |
| `pnpm-workspace.yaml` | Records the reviewed pnpm lifecycle-build permission required for a reproducible local install. |

No server, database or credential is required. Open-Meteo is called by the visitor’s browser over HTTPS.
