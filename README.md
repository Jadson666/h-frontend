# Purpose
1. a table to display data from websocket
2. a filter to search by keyword
3. other detailed requirement, see below
# Screenshot
![](./public/demo.png)
# Tech stack
- Vite
  - Websocket is more CSR project, no need to use SSR like Next.js
- Typescript
  - some requirements need to integrate with backend, use typescript as type guard
- Websocket
  - real-time communication is needed
- TailwindCSS
  - it's demo project, effeciency is important
- react-window
  - virtualized list handle large size data
- AI tools
  - only copilot to support coding
# How to start the project
```
yarn dev
```
# Project Guide
1. optimize Performance use react-window (virtualized list), only render the record in-screen
2. async logging pattern to avoid bouncing and layout jumping
3. handle error - retry when lost connection
4. RWD is not applied, please start the project on Desktop

# Task and related progress
1. Display news items in a list format, with each item showing:
   - [x] Timestamp, in either local time or UTC
   - [x] Headline
   - [x] Source
   - [x] Link, if provided
   - [x] Associated keywords and assets, if provided
   - [x] Some way of distinguishing high priority items
   - [x] A button labelled "Log to Console" to log the news item object to the
     console

2. Real-time updates:
   - [x] New items should appear immediately when received
   - [x] Items should be sorted by timestamp (newest first)
   - [ ] (Optional) Animation to catch the users' attention when new items appear

3. Filtering:
   - [x] Allow filtering by news source
   - [x] Allow filtering by keywords and assets
   - [x] Filters should be applied "instantly"

4. Basic styling:
   - [x] Clean, readable layout
   - [ ] (Optional) Responsive design that works on mobile and desktop

5. Error handling:
   - [x] Handle connection loss errors with the WebSocket connection
   - [x] You may silently ignore malformed messages from the WebSocket connection

6. Performance
   - [x] Efficient handling of large numbers of news items
   - [x] Smooth scrolling and filtering
   - [x] Minimal memory usage
   - [x] Optimized re-rendering
   - [x] Note there is no requirement to keep older items on screen
