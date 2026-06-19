# Beatport Camelot Key Translator

Eine kleine Chrome-Erweiterung, die auf Beatport die angezeigten Tonarten in die Camelot-Notation übersetzt.

## Beispiel

- `A Minor` → `1m`
- `C Major` → `1d`
- `H Moll` → `3m`
- `Db Major` → `8d`
- `B Moll` → `8m`

## Installation

1. Chrome öffnen und `chrome://extensions/` aufrufen.
2. Oben rechts den **Entwicklermodus** aktivieren.
3. Auf **Entpackte Erweiterung laden** klicken.
4. Diesen Ordner auswählen.

## Funktionsweise

Die Erweiterung läuft auf allen `https://www.beatport.com/*`-Seiten. Sie sucht im sichtbaren Text nach bekannten Tonart-Bezeichnungen (Englisch, Deutsch und enharmonische Verwandte) und ersetzt sie durch den entsprechenden Camelot-Code. Ein Mouseover über den Code zeigt die ursprüngliche Tonart an.

## Unterstützte Schreibweisen

- Englisch: `A Minor`, `A Min`, `A Major`, `A Maj`, `A Flat Major`, `A Sharp Minor`, `D♭ Major`, ...
- Deutsch: `A Moll`, `A Dur`, `Des Dur`, `B Moll`, `H Moll`, ...
- Enharmonisch: `Db Major` ↔ `C# Major`, `B Moll` ↔ `A# Minor`, ...

## Basis-Mapping

| Camelot | Deutsch | Englisch |
|---|---|---|
| 1m | A Moll | A Minor |
| 1d | C Dur | C Major |
| 2m | E Moll | E Minor |
| 2d | G Dur | G Major |
| 3m | H Moll | B Minor |
| 3d | D Dur | D Major |
| 4m | F# Moll | F# Minor |
| 4d | A Dur | A Major |
| 5m | C# Moll | C# Minor |
| 5d | E Dur | E Major |
| 6m | G# Moll | G# Minor |
| 6d | H Dur | B Major |
| 7m | D# Moll | D# Minor |
| 7d | F# Dur | F# Major |
| 8m | A# Moll | A# Minor |
| 8d | C# Dur | C# Major |
| 9m | F Moll | F Minor |
| 9d | Ab Dur | Ab Major |
| 10m | C Moll | C Minor |
| 10d | Eb Dur | Eb Major |
| 11m | G Moll | G Minor |
| 11d | Bb Dur | Bb Major |
| 12m | D Moll | D Minor |
| 12d | F Dur | F Major |
