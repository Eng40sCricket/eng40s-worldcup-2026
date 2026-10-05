# Weather Centre Delivery To Do

- [x] **Front-page placement:** Embedded the full Guyana weather centre natively on the World Cup home page, directly after the tournament schedule, and added a Weather item to the main navigation.
- [x] **Forecast coverage:** Provided Georgetown and Berbice (New Amsterdam) location controls plus 15 October–1 November 2026 date controls; Open-Meteo hourly data refreshes every 60 minutes and has an accessible manual refresh.
- [x] **Operational readings:** Displays temperature, feels-like temperature, calculated wet-bulb temperature, wind direction/speed/gusts, precipitation amount/probability/risk, likely rain onset/cessation, and sunrise/sunset in the selected-day hourly forecast.
- [x] **Wet-bulb calculator:** Provided a validated manual calculator, explains that it is calculated from air temperature and relative humidity, and supports prefill from the selected forecast.
- [x] **Extreme heat:** Cross-referenced IMC Playing Conditions Guyana 2026 clause 12.5 with amber/red planning warnings at the documented air-temperature cut-offs, without claiming that the forecast makes match-control decisions.
- [x] **Validation and delivery:** TypeScript and production-build checks passed; the live front-page weather section and its Berbice/prefill interactions were inspected. The completed change is ready to commit and push to the canonical GitHub `main` branch.
