# DDFIY - Die drei ??? Spotify Zufallsfolge

DDFIY soll eine App für Fans sein, die sie schwer entschieden können, welche Folge der drei ??? sie als nächstes hören wollen.

Die App ist ein privates Projekt von Jakob Vesely und auch nur für meinen Gebrauch konzipiert, weshalb sie auch nur die Folgen von Spotify abrufen bzw. öffnen kann.

Die App ist Open Source und verfügt über keinerlei Anbindung zu irgendwelchen Trackern oder Statistik-Tools. Die einzige Verbindung besteht zur Spotify-API, für deren minimale Verwendung auch eine Authentifizierung notwendig ist. Man muss also einen Spotify Account besitzen, da es sonst der App nicht möglich ist, alle Folgen abzurufen. Die Scopes für die Autorisierung der Spotify-API sind minimal und lesend definiert. Die genaue Verwendung der Daten aus der Spotify API sind im Source Code ersichtlich.

## Technische Hinweise & Snippets

## PWA Icon Generating

```powershell
ngx-pwa-icons
```
