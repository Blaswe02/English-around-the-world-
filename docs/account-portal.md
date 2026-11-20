# Accountportaal — ingebouwd en nog te publiceren

## Wat is aangesloten
- Supabase-project eaatw-hub: otdzfaxvuchzuevcngbj (EU).
- Echte Supabase Auth-sessies; inloggen met een leerlingnaam en wachtwoord.
- Leerlingnamen worden intern vertaald naar username@accounts.eatw.invalid. Er worden geen echte leerling-e-mailadressen gevraagd.
- learning_profiles, learner_progress en passport_stamps met RLS.
- De serverfunctie manage-learning-accounts is gepubliceerd met JWT-controle.
- Alleen de server maakt leerlingaccounts aan; de browser bevat geen beheersleutel.
- Geen automatische promotie van de eerste bezoeker naar docent.

## Eerste docentaccount: eenmalig door de eigenaar
Open https://supabase.com/dashboard/project/otdzfaxvuchzuevcngbj/auth/users.
Gebruik Add user > Create new user en kies zelf het wachtwoord.
Voor de docentnaam daan is het interne adres daan@accounts.eatw.invalid.
Gebruik Auto Confirm User. Dit interne adres ontvangt geen e-mail.
De gebruiker wordt pas docent nadat een beheerder het bijbehorende profiel toevoegt.
Vraag de assistent om dit na het aanmaken te doen; geef alleen de docentnaam door, geen wachtwoord.

Voor de beheerder, nadat dit Auth-account aantoonbaar bestaat:
```sql
insert into public.learning_profiles(user_id, username, display_name, role, class_name)
select id, 'daan', 'Daan', 'teacher', ''
from auth.users where email = 'daan@accounts.eatw.invalid'
on conflict (user_id) do nothing;
```
Controleer dat exact één Auth-gebruiker en het juiste profiel zijn gevonden.
Wijzig de naam als de eigenaar een andere docentnaam kiest.
Stel bij Authentication > Providers > Email publieke registratie uit; leerlingaccounts komen uitsluitend via accountbeheer.
Een schoolwachtwoord is hiervoor niet nodig: kies een apart wachtwoord voor deze website.

## Daarna
- Log in op de website. Mijn reis is het persoonlijke dashboard.
- Voor docenten bevat leerlingaccounts, voortgang per leerling, stempels toekennen en curriculum.
- Maak accounts aan met een unieke leerlingnaam, weergavenaam, klas en wachtwoord (minimaal 10 tekens).
- Wachtwoorden worden niet in de profieltabellen of broncode opgeslagen.
- Leerlingen veranderen hun eigen wachtwoord via Instellingen.
- De docent kan een nieuw leerlingwachtwoord instellen; oudere tokens worden daarna via een servergecontroleerde tijdgrens geweigerd.
- Leerlingvoortgang en stempels worden met user_id opgeslagen. Oude browser-bijnaamvoortgang wordt niet automatisch aan echte accounts toegekend.

## Publiceren op de bestaande Vercel-site
De GitHub-koppeling is op 20 november 2026 hersteld.
Publiceer gewijzigde broncode via de bestaande productiebranch van Blaswe02/English-around-the-world-.
Vercel: Vite preset, npm run build, uitvoermap dist.
De standaard publieke project-URL en publiceerbare sleutel staan in src/auth/publicConfig.ts; dit zijn clientgegevens, geen beheersleutel.
Optionele overrides: VITE_SUPABASE_URL en VITE_SUPABASE_PUBLISHABLE_KEY.
Nooit een service_role- of geheime sleutel in een VITE-variabele plaatsen.

## Gecontroleerd
- TypeScript en een lokale Vite/Rollup QA-build slagen.
- Browser: openbare startpagina, bestemming vraagt login, ongeldige login geeft een fout.
- Database: twee leerlingen zien niet elkaars profielen, voortgang of stempels.
- Leerling kan zichzelf niet tot docent maken of stempels toekennen.
- Docent kan leerlingvoortgang lezen en stempels toekennen.
- Anonieme aanvragen kunnen persoonlijke tabellen niet lezen.
- Oude sessie wordt na een wachtwoordresetgrens geweigerd.
- SQL-testgegevens zijn volledig teruggedraaid.
- Accountbeheer zonder JWT retourneert 401.
- Geslaagde login en de volledige accountbeheerflow moeten nog met het eerste echte docentaccount worden getest.
- Er is nog geen nieuwe Vercel-publicatie bevestigd.

## Grenzen
Het portaal beschermt accountgegevens aan de serverkant. Bestaande externe leswebsites houden hun eigen openbare URL en toegangsregels; de loginpoort van deze website verandert die externe websites niet.
Lesafronding is voortgang, geen cijfer. Paspoortstempels worden door een docent toegekend.


## Docentenaccount gekoppeld
Het Auth-account op het school-e-mailadres is gekoppeld aan profiel daan (Daan), rol teacher. De docent logt in met het eigen e-mailadres en het zelfgekozen wachtwoord. Het Auth-account is inmiddels bevestigd. Leerlingnamen blijven intern naar accounts.eatw.invalid vertaald.


## Activering
Het gekoppelde docentenaccount is na expliciete toestemming van de eigenaar rechtstreeks bevestigd op 20 november 2026. Er is geen bevestigingsmail meer nodig. De eerste geslaagde login moet nog met het door de eigenaar gekozen wachtwoord worden gecontroleerd.

