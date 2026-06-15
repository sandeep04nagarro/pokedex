# Potential Features for Pokedex Enhancement

This document outlines potential features that can be added to the Pokedex application to improve user experience, functionality, and engagement.

---

## 1. Dark Mode / Theme Toggle

**Priority:** High

**Description:** Add a dark/light theme toggle that allows users to switch between color schemes. This is a highly requested modern UI feature that improves accessibility and user experience, especially in low-light conditions.

**Implementation:**
- Frontend: Add theme context with localStorage persistence
- Create CSS variables for both themes
- Add toggle button in header/navbar
- Respect system preference (prefers-color-scheme)

**Files to modify/create:**
- `frontend/src/context/ThemeContext.tsx` (new)
- `frontend/src/index.css` (add dark theme variables)
- `frontend/src/components/ThemeToggle.tsx` (new)
- `frontend/src/App.tsx` (wrap with ThemeProvider)

---

## 2. Pokemon Cries / Audio Playback

**Priority:** High

**Description:** Allow users to listen to each Pokemon's cry (battle sound). The PokeAPI provides cry URLs for both legacy and latest versions of each Pokemon's audio.

**Implementation:**
- Backend: Add `cries` field to PokemonDetail response from PokeAPI
- Frontend: Create CryPlayer component with Play/Stop controls
- Include option to switch between "classic" and "latest" cry versions
- Display audio waveform or animation during playback

**Files to modify/create:**
- `backend/src/types/index.ts` (extend PokemonDetail with cries)
- `backend/src/services/pokemonService.ts` (extract cries from API)
- `frontend/src/types/index.ts` (add PokemonCries interface)
- `frontend/src/components/CryPlayer.tsx` (new)
- `frontend/src/pages/PokemonDetailPage.tsx` (integrate CryPlayer)

---

## 3. Multi-Type Filtering

**Priority:** High

**Description:** Currently users can filter by only one type at a time. Allow selecting multiple types to find Pokemon that have ALL selected types (logical AND) or ANY selected type (logical OR).

**Implementation:**
- Frontend: Convert TypeFilter dropdown to multi-select with checkboxes
- Update API to accept multiple type parameters (e.g., `/api/pokemon/type?types=fire,flying`)
- Backend: Query PokeAPI and intersect results for AND logic
- Show count badge for selected types

**Files to modify/create:**
- `frontend/src/components/TypeFilter.tsx` (enhance to multi-select)
- `frontend/src/hooks/usePokemonList.ts` (handle multiple types)
- `backend/src/routes/pokemon.ts` (update endpoint to accept multiple)
- `backend/src/controllers/pokemonController.ts` (handle array of types)
- `backend/src/services/pokemonService.ts` (implement multi-type logic)

---

## 4. Pokémon Abilities Details

**Priority:** Medium

**Description:** When viewing a Pokemon's abilities, allow users to click on an ability to see its full details (description, generation, effects, Pokemon that can have it).

**Implementation:**
- Backend: Add endpoint `/api/abilities/:name` that fetches ability details from PokeAPI
- Frontend: Make ability badges clickable; navigate to new AbilityDetailPage
- Show ability effect text, short effect, generation, and list of Pokemon

**Files to modify/create:**
- `backend/src/types/index.ts` (add AbilityDetail interface)
- `backend/src/services/abilityService.ts` (new)
- `backend/src/controllers/abilityController.ts` (new)
- `backend/src/routes/abilities.ts` (new)
- `frontend/src/types/index.ts` (add AbilityDetail)
- `frontend/src/services/api.ts` (add getAbility function)
- `frontend/src/pages/AbilityDetailPage.tsx` (new)
- `frontend/src/App.tsx` (add route)

---

## 5. Type Effectiveness / Weakness Chart

**Priority:** Medium

**Description:** Show type effectiveness chart for a Pokemon's types, indicating which types are strong/weak against it (20% to 400% damage multipliers). This helps users understand battle strategies.

**Implementation:**
- Backend: Include damage relations in PokemonDetail response from PokeAPI
- Frontend: Create TypeEffectiveness component displaying grid/table
- Color code: Green for resistant, red for vulnerable
- Show multiplier values (e.g., 2x, 4x, 0.25x)

**Files to modify/create:**
- `backend/src/types/index.ts` (add type effectiveness fields)
- `backend/src/services/pokemonService.ts` (fetch damage relations)
- `frontend/src/types/index.ts` (extend PokemonDetail)
- `frontend/src/components/TypeEffectiveness.tsx` (new)
- `frontend/src/pages/PokemonDetailPage.tsx` (integrate component)

---

## 6. Pokémon Moves with Filtering

**Priority:** Medium

**Description:** Display all moves a Pokemon can learn, with filtering by move type, category (physical/special/status), and level. Users should see move details including power, accuracy, and PP.

**Implementation:**
- Backend: Expand PokemonDetail to include moves with详细信息
- Add pagination for moves (Pokemon can have 20+ moves)
- Create moves endpoint if needed
- Frontend: Moves table with sort/filter columns

**Files to modify/create:**
- `backend/src/types/index.ts` (extend PokemonDetail with moves)
- `backend/src/services/pokemonService.ts` (fetch moves)
- `frontend/src/types/index.ts` (extend PokemonDetail)
- `frontend/src/components/MovesList.tsx` (new)
- `frontend/src/pages/PokemonDetailPage.tsx` (add MovesList section)

---

## 7. Pokémon Forms & Variants

**Priority:** Medium

**Description:** Support alternate forms of Pokemon (Mega Evolutions, Alolan forms, Galarian forms, Gigantamax, etc.). Allow users to switch between forms on the detail page and show form-specific differences.

**Implementation:**
- Backend: Accept form query parameter in PokemonDetail endpoint
- Fetch from PokeAPI's `pokemon-form` endpoint
- Frontend: Add form selector dropdown on detail page
- Update stats, sprites, types based on selected form

**Files to modify/create:**
- `backend/src/services/pokemonService.ts` (add getPokemonForm)
- `backend/src/controllers/pokemonController.ts` (optional form endpoint)
- `frontend/src/services/api.ts` (add getPokemonForm)
- `frontend/src/hooks/usePokemonDetail.ts` (support form selection)
- `frontend/src/components/FormSelector.tsx` (new)
- `frontend/src/pages/PokemonDetailPage.tsx` (integrate FormSelector)

---

## 8. Advanced Sorting Options

**Priority:** Medium

**Description:** Extend the current SortBar with more sort criteria: total base stats, weight, height, alphabetical (reverse), type-based sorting.

**Implementation:**
- Extend SortBar dropdown with new options
- Update `usePokemonList` hook to handle all sort types
- Calculate total stats for sorting
- Add icons/indicators for sort direction

**Files to modify:**
- `frontend/src/components/SortBar.tsx` (add options)
- `frontend/src/hooks/usePokemonList.ts` (implement sort logic)

---

## 9. Pokémon Sprite Gallery

**Priority:** Low

**Description:** Display all available sprite variants for a Pokemon: front/default, back, female versions, shiny, shiny back, and official artwork. Allow users to download sprites.

**Implementation:**
- Create SpriteGallery component with tabbed view
- Show all sprite URLs from `pokemon.sprites` object
- Add download button for each sprite
- Responsive grid layout

**Files to modify/create:**
- `frontend/src/components/SpriteGallery.tsx` (new)
- `frontend/src/pages/PokemonDetailPage.tsx` (add gallery section)

---

## 10. Batch Favorites Management

**Priority:** Low

**Description:** Add ability to select multiple Pokemon in the list and add/remove them from favorites in bulk. Also add a "favorites only" filter to the main page.

**Implementation:**
- Add checkbox to each PokemonCard
- Add batch action bar at bottom of page
- Implement "select all on page" functionality
- Add clear-all-favorites endpoint on backend
- Add favorites-only toggle in TypeFilter/SortBar area

**Files to modify/create:**
- `frontend/src/components/PokemonCard.tsx` (add checkbox)
- `frontend/src/components/BatchActionBar.tsx` (new)
- `frontend/src/hooks/usePokemonList.ts` (track selected IDs)
- `backend/src/controllers/favoriteController.ts` (batch endpoints)
- `backend/src/services/favoriteService.ts` (batch operations)
- `frontend/src/services/api.ts` (add batch functions)

---

## 11. Pokémon Locations & Habitats

**Priority:** Low

**Description:** Show where each Pokemon can be encountered in the wild (location areas, habitats). This data is available from PokeAPI's location and location-area endpoints.

**Implementation:**
- Backend: New endpoints for location data
- Frontend: LocationEncounters component with list/cards
- Show version-specific locations if applicable

**Files to modify/create:**
- `backend/src/services/locationService.ts` (new)
- `backend/src/controllers/locationController.ts` (new)
- `backend/src/routes/locations.ts` (new)
- `frontend/src/services/api.ts` (add functions)
- `frontend/src/components/LocationEncounters.tsx` (new)
- `frontend/src/pages/PokemonDetailPage.tsx` (integrate)

---

## 12. Egg Groups & Breeding Info

**Priority:** Low

**Description:** Display egg groups, hatch steps, and gender rate. This helps users understand breeding mechanics.

**Implementation:**
- Include in PokemonDetail response from PokeAPI
- Show egg group badges, gender ratio chart
- Display egg cycle count and approximate hatch steps

**Files to modify:**
- `backend/src/services/pokemonService.ts` (include species data for egg groups)
- `frontend/src/pages/PokemonDetailPage.tsx` (add new section)

---

## 13. Shareable URLs for Filters

**Priority:** Low

**Description:** Ensure all filter/sort/search states are reflected in URL query parameters, allowing users to bookmark or share specific filtered views.

**Implementation:**
- Already partially implemented (ComparePage uses query params)
- Extend to HomePage: sync search, type filter, sort, pagination with URL
- Update usePokemonList to read/write URL params

**Files to modify:**
- `frontend/src/hooks/usePokemonList.ts` (add URL sync)
- `frontend/src/pages/HomePage.tsx` (useSearchParams integration)

---

## 14. Keyboard Navigation & Accessibility

**Priority:** Low

**Description:** Improve accessibility with keyboard shortcuts:
- Arrow keys to navigate Pokemon grid
- Enter to open detail
- `/` to focus search
- `Esc` to clear search
- Proper ARIA labels and roles

**Implementation:**
- Add event listeners in HomePage
- Manage focus management
- Add skip links
- Enhance screen reader announcements

**Files to modify:**
- `frontend/src/pages/HomePage.tsx` (keyboard handlers)
- `frontend/src/components/PokemonCard.tsx` (ARIA attributes)
- `frontend/src/components/SearchBar.tsx` (shortcut indicator)

---

## 15. Statistics Visualization

**Priority:** Low

**Description:** Replace or supplement the current stat bars with interactive charts, such as a radar chart (spider chart) to visualize Pokemon's stat distribution.

**Implementation:**
- Add chart library (recharts or chart.js)
- Create StatRadarChart component
- Show hover tooltips with stat values
- Compare two Pokemon' radar charts (on ComparePage)

**Files to modify/create:**
- Install chart library: `npm install recharts`
- `frontend/src/components/StatRadarChart.tsx` (new)
- `frontend/src/pages/PokemonDetailPage.tsx` (add chart)
- `frontend/src/pages/ComparePage.tsx` (add side-by-side charts)

---

## 16. Export/Share Favorites

**Priority:** Low

**Description:** Allow users to export their favorites list as JSON file or image (PNG). Also generate shareable link to a public favorites view.

**Implementation:**
- Add export button on FavoritesPage
- Generate JSON with Pokemon data and export via Blob
- Create image export using html2canvas
- Optional: Create public route `/favorites/share/:token`

**Files to modify/create:**
- Install `html2canvas` for image export
- `frontend/src/pages/FavoritesPage.tsx` (add export feature)
- `backend/src/controllers/favoriteController.ts` (share endpoint if needed)

---

## 17. Offline Mode with Service Worker

**Priority:** Low

**Description:** Cache Pokemon images and API responses using service workers to enable offline viewing of previously accessed Pokemon. Show "offline" indicator when disconnected.

**Implementation:**
- Configure Vite PWA plugin
- Create service worker for caching strategy
- Add offline fallback page
- Cache images, Pokemon data, and static assets
- Show banner when offline

**Files to modify/create:**
- `frontend/vite.config.ts` (add PWA plugin)
- `frontend/public/sw.js` (service worker)
- `frontend/src/components/OfflineBanner.tsx` (new)

---

## 18. Pokémon Types Coverage Calculator

**Priority:** Low

**Description:** Show which types are covered by a user's current team (favorites). Visualize type coverage strengths and weaknesses across the team.

**Implementation:**
- Frontend: Analyze selected Pokemon types
- Generate matrix of offensive and defensive type coverage
- Show missing type resistances and missing type attacks

**Files to modify/create:**
- `frontend/src/components/TypeCoverage.tsx` (new)
- `frontend/src/pages/FavoritesPage.tsx` (add coverage section)

---

## 19. Pagination with Infinite Scroll

**Priority:** Low

**Description:** Replace current pagination controls with infinite scroll that automatically loads more Pokemon as the user reaches the bottom. Option to toggle between modes.

**Implementation:**
- Detect scroll near bottom
- Fetch next page automatically
- Show loading indicator during fetch
- Add setting to switch between pagination and infinite scroll

**Files to modify:**
- `frontend/src/components/Pagination.tsx` (optional toggle)
- `frontend/src/hooks/usePokemonList.ts` (infinite scroll logic)
- `frontend/src/pages/HomePage.tsx` (scroll event handling)

---

## 20. Pokémon Evolution Simulation

**Priority:** Low

**Description:** Allow users to simulate evolution by showing evolution requirements (level, item, trade, time of day). Display what Pokemon evolves into what and under what conditions.

**Implementation:**
- Backend: Fetch evolution chain with triggers and conditions
- Frontend: Show triggers (level-up, trade, use-item) with required parameters
- Display evolution chain with condition details

**Files to modify:**
- `backend/src/services/pokemonService.ts` (enhance evolution chain with details)
- `frontend/src/components/EvolutionChain.tsx` (show conditions)
- `frontend/src/types/index.ts` (extend EvolutionChain interface)

---

## Summary

| Feature | Priority | Complexity | User Value |
|---------|----------|------------|------------|
| Dark Mode | High | Low | High |
| Pokemon Cries | High | Medium | High |
| Multi-Type Filter | High | Medium | High |
| Abilities Details | Medium | Medium | Medium |
| Type Effectiveness | Medium | Medium | Medium |
| Moves List | Medium | High | Medium |
| Forms Support | Medium | High | Medium |
| Advanced Sorting | Medium | Low | Medium |
| Sprite Gallery | Low | Medium | Low |
| Batch Favorites | Low | High | Low |
| Locations/Habitats | Low | Medium | Low |
| Egg Groups | Low | Low | Low |
| Shareable URLs | Low | Low | Low |
| Keyboard Nav | Low | Low | Low |
| Stats Charts | Low | Medium | Low |
| Export Favorites | Low | Medium | Low |
| Offline Mode | Low | High | Low |
| Type Calculator | Low | High | Low |
| Infinite Scroll | Low | Medium | Low |
| Evolution Details | Low | Medium | Low |

---

**Recommendation:** Start with the High priority features (Dark Mode, Pokemon Cries, Multi-Type Filter) as they provide immediate user value and have relatively low implementation complexity compared to their impact.
