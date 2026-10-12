# Šiviljstvo Lucija — spletna stran

Spletna stran za **Šiviljstvo Lucija, Lucija Piškurič s.p.** (Črnomelj, Bela Krajina):
šiviljska popravila, unikatni izdelki in oblačila po meri.

## Zgradba

```
sivilja/
├── index.html        Domača stran
├── storitve.html     Storitve in popravila
├── trgovina.html     Trgovina z unikati (povpraševanja po e-pošti)
├── narocilo.html     Naročilo po meri (obrazec z meritvami)
├── o-strani.html     O Luciji
├── kontakt.html      Kontakt in obrazec za sporočilo
├── css/slog.css      Dizajn sistem "bunker + platno"
├── js/skripta.js     Merilni trak, seznam povpraševanj, e-poštna naročila
└── slike/            Fotografije (Lucijini originali)
```

## Fotografije

Stran ne uporablja stock fotografij. Vsaka slika je Lucijin original,
povzet z njenih javnih objav (Facebook stran `@siviljstvolbunker`). Mesta
za slike se sklicujejo na datoteko v `slike/`:

| Datoteka | Namembnost | Vsebina | Stanje |
|---|---|---|---|
| `slike/hero.jpg` | Glavna fotografija (domača stran) | Roke z iglo pri popravilu rokava, merilni trak, škarje | ✅ original (FB naslovnica) |
| `slike/o-strani-1.jpg` | Lucija pri delu | Za industrijskim strojem, pinceta na zapestju | ✅ original (FB profilna) |
| `slike/delo-01.jpg` | Galerija: stroj | Šivalni stroj Jack A4 z vgrajenim 250 cm trakom | ✅ original |
| `slike/delo-02.jpg` | Galerija: materiali | Blago, nit in škarje z bakrenim ročajem | ✅ original |
| `slike/delo-03.jpg` | Galerija: Lucija | V predpasniku z značko L-bunker | ✅ original |
| `slike/znak.jpg` | Njen znak | Kaligrafski monogram SL z iglo | ✅ original |
| `slike/izdelek-01 … 06.jpg` | Izdelki v trgovini | — | ⏳ čakajo njene fotografije izdelkov |

Reže brez fotografije samodejno prikažejo rezerviran prostor
(`slike/rezervirano.svg`) z jasno oznako. Ko Lucija posamezno fotografijo
položi v `slike/` z ustreznim imenom, se prikaže sama — v HTML ni treba
ničesar spreminjati.

Izvorne (nepredelane) datoteke in zavrnjeni posnetki so v mapi `zajem-fb/`,
**ki je izven strani in se ne objavlja** — vsebuje tudi zasebne fotografije.

## Delovni čas

Ure so povzete iz Lucijine objave na Facebooku in se lahko spremenijo:

| Dan | Ure |
|---|---|
| Ponedeljek | 9:00–14:30 |
| Torek | zaprto (šivanje naročil) |
| Sreda | 9:00–16:00 |
| Četrtek, petek | 9:00–14:00 |
| Sobota | po dogovoru |
| Nedelja | zaprto |

Opomba: na izvorni fotografiji tabele so ure za četrtek in petek odrezane
za "14:" — na strani je vpisana varna vrednost 9:00–14:00, naj jo Lucija
potrdi ali popravi v `kontakt.html`.

## Kontakt, ki ga stran uporablja

- E-pošta (naročila, povpraševanja, sporočila): `lucijinbunker@gmail.com`
- Telefonska številka: **ni še potrjena** — javni imeniki je ne navajajo
  (TIS: ni vpisov). Vstavi se v `kontakt.html` (komentirano mesto
  `<!-- TELEFON -->`) in po potrebi v navedbe na drugih straneh.

## Objava (GitHub Pages)

1. Repozitorij naj vsebuje vsebino mape `sivilja/` v korenu.
2. GitHub → **Settings → Pages** → Source: `Deploy from a branch` →
   veja `main`, mapa `/ (root)` → Save.
3. Stran je na `https://robertpezdirc8-prog.github.io/sivilja/`.

## Tehnične opombe

- Statična stran brez odvisnosti za delovanje (edini zunanji vir: Google
  Fonts, z varnimi nadomestki).
- Naročila in sporočila se odpirajo v uporabnikovem e-poštnem programu
  (`mailto:`) — brez strežnika in brez shranjevanja podatkov.
- Seznam povpraševanj v trgovini se hrani v `localStorage` brskalnika.
- Dostopnost: tipkovna navigacija, vidna žarišča, spoštovanje
  `prefers-reduced-motion`, odzivnost do mobilnih širin.
