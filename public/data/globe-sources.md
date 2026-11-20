# English-language globe

## Map and implementation
- Natural Earth 1:110m admin-0 countries, public domain: https://www.naturalearthdata.com/about/terms-of-use/
- Source geometry: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson
- Country name and ADM0_A3 retained; all other attributes stripped. Small island states use point markers because this scale omits them.
- D3 v7 (ISC; licence in public/vendor/D3-LICENSE). Orthographic projection with spherical clipping. Assets served locally; no third-party runtime requests.
- This is an educational overview of sovereign countries, not a definitive legal atlas. Subnational and dependent-territory statuses are not separately classified. Boundaries follow Natural Earth.

## Colour key
Coral: English has national official status. Gold: English used de facto (UK, Australia, Mauritius). Other countries are sage. Status includes official status shared with other languages. Small states are dots. Country sets are editable in src/components/Dashboard/LanguageGlobe.tsx.

## Status references (checked 20 November 2026)
- USA: https://www.whitehouse.gov/presidential-actions/2025/03/designating-english-as-the-official-language-of-the-united-states/
- New Zealand: English Language Act 2026, section 5: https://www.legislation.govt.nz/act/public/2026/49/en/latest
- UK: https://www.gov.uk/government/publications/toponymic-guidelines/toponymic-guidelines-for-map-and-other-editors-united-kingdom-of-great-britain-and-northern-ireland--2
- Australia: https://www.dfat.gov.au/about-australia (national language; separate de facto key)
- Mauritius: https://assets.publishing.service.gov.uk/media/68aee3232f18566482155890/Mauritius_Toponymic_Factfile.pdf (no official languages, de facto English/French)
- Botswana: https://www.gov.bw/about-our-country?page=0
- Ghana: https://london.mfa.gov.gh/ghana/country-profile?lang=en
- Tanzania: https://www.sadc.int/member-states/united-republic-tanzania
