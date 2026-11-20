# Curriculum destination globe

## Map and implementation
- World geometry: Natural Earth 1:110m admin-0 countries, public domain. https://www.naturalearthdata.com/about/terms-of-use/
- World source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson
- US state geometry: California, Hawaii, New York and Texas extracted from https://github.com/PublicaMundi/MappingAPI/blob/master/data/geojson/us-states.json ; only names and geometry retained. The rings are clockwise for D3 spherical rendering.
- D3 v7 (ISC; licence in public/vendor/D3-LICENSE). Orthographic projection with spherical clipping. All runtime assets are served locally.
- Singapore, Malta and Hawaii also have small point markers for visibility at this scale.
- This is a curriculum overview. Boundaries are illustrative and follow the source datasets.

## Highlight key
- Coral: countries taught in the curriculum: UK, Australia, Canada, USA, India, Ireland, South Africa, New Zealand, Jamaica, Malta, Singapore.
- Gold: individual US state destinations: Hawaii, New York, Texas, California.
- All other countries remain sage. These colours describe the curriculum, not the official status of English.
- The selected destinations are derived from DESTINATION_YEARS in src/data/countries.ts. Globe geography mappings are in src/components/Dashboard/LanguageGlobe.tsx.
