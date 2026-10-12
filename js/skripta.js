/* ============================================================
   Šiviljstvo Lucija — skripte
   1. Merilni trak (scroll progress, 0–150 cm)
   2. Odpiranje navigacije na mobilnih
   3. Razkrivanje ob drsanju (spoštuje prefers-reduced-motion)
   4. Seznam povpraševanj za trgovino (localStorage)
   5. Izgradnja naročilnih e-pošt (mailto) iz obrazcev
   ============================================================ */

(function () {
  "use strict";

  var EPOSTA = "lucijinbunker@gmail.com";
  /* TELEFON: vstavi preverjeno številko, ko bo potrjena (npr. "040 451 250") */
  var TELEFON = "";

  /* ---------- 1. Merilni trak ---------- */

  var trakPolnilo = document.querySelector(".trak-polnilo");
  var trakCm = document.getElementById("trak-cm");

  function posodobiTrak() {
    if (!trakPolnilo) return;
    var doc = document.documentElement;
    var skupaj = doc.scrollHeight - doc.clientHeight;
    var odstotek = skupaj > 0 ? Math.min(1, Math.max(0, window.scrollY / skupaj)) : 0;
    trakPolnilo.style.width = (odstotek * 100).toFixed(2) + "%";
    if (trakCm) trakCm.textContent = Math.round(odstotek * 150);
  }

  window.addEventListener("scroll", posodobiTrak, { passive: true });
  window.addEventListener("resize", posodobiTrak);
  posodobiTrak();

  /* ---------- 2. Navigacija na mobilnih ---------- */

  var prekini = document.querySelector(".prekini-nav");
  var navigacija = document.querySelector(".navigacija");

  if (prekini && navigacija) {
    prekini.addEventListener("click", function () {
      var odprta = navigacija.classList.toggle("odprta");
      prekini.setAttribute("aria-expanded", odprta ? "true" : "false");
      prekini.setAttribute("aria-label", odprta ? "Zapri navigacijo" : "Odpri navigacijo");
    });
  }

  /* ---------- 3. Razkrivanje ob drsanju ---------- */

  var zmanjsanoGibanje = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!zmanjsanoGibanje && "IntersectionObserver" in window) {
    var opazovalec = new IntersectionObserver(
      function (vnosi) {
        vnosi.forEach(function (v) {
          if (v.isIntersecting) {
            v.target.classList.add("viden");
            opazovalec.unobserve(v.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".razkrij").forEach(function (el) {
      opazovalec.observe(el);
    });
  } else {
    document.querySelectorAll(".razkrij").forEach(function (el) {
      el.classList.add("viden");
    });
  }

  /* ---------- 4. Seznam povpraševanj ---------- */

  var KLJUC = "sivilja-povprasek";

  function preberiSeznam() {
    try {
      return JSON.parse(localStorage.getItem(KLJUC) || "[]");
    } catch (e) {
      return [];
    }
  }

  function shraniSeznam(seznam) {
    try {
      localStorage.setItem(KLJUC, JSON.stringify(seznam));
    } catch (e) {
      /* zasebno okno — seznam živi le v pomnilniku */
    }
  }

  var seznam = preberiSeznam();
  var trak = document.querySelector(".povprasek-trak");
  var stevec = trak ? trak.querySelector(".stevec-st") : null;
  var stevecBeseda = trak ? trak.querySelector(".stevec-beseda") : null;

  /* slovenski dvojnik in množina: 1 izdelek, 2 izdelka, 3 izdelki, 5 izdelkov */
  function sklonIzdelkov(n) {
    var k = n % 100;
    if (k === 1) return "izdelek";
    if (k === 2) return "izdelka";
    if (k === 3 || k === 4) return "izdelki";
    return "izdelkov";
  }

  function posodobiPovprasek() {
    if (!trak) return;
    if (seznam.length > 0) {
      trak.classList.add("viden");
      if (stevec) stevec.textContent = seznam.length;
      if (stevecBeseda) stevecBeseda.textContent = sklonIzdelkov(seznam.length);
    } else {
      trak.classList.remove("viden");
    }
  }

  document.querySelectorAll("[data-dodaj]").forEach(function (gumb) {
    gumb.addEventListener("click", function () {
      var koda = gumb.getAttribute("data-dodaj");
      var ime = gumb.getAttribute("data-ime") || koda;
      if (!seznam.some(function (x) { return x.koda === koda; })) {
        seznam.push({ koda: koda, ime: ime });
        shraniSeznam(seznam);
      }
      posodobiPovprasek();
      gumb.textContent = "Na seznamu ✓";
      gumb.disabled = true;
    });
  });

  var posljiPovprasek = trak ? trak.querySelector(".gumb-na-betonu") : null;

  if (posljiPovprasek) {
    posljiPovprasek.addEventListener("click", function () {
      var telo = "Pozdravljena Lucija,\n\nZanimam se za naslednje izdelke:\n\n";
      seznam.forEach(function (x) {
        telo += "  • " + x.ime + " (" + x.koda + ")\n";
      });
      telo += "\nProsim za morebitne dodatne informacije in ceno.\n\nLep pozdrav,\n";
      window.location.href =
        "mailto:" + EPOSTA +
        "?subject=" + encodeURIComponent("Povpraševanje — Šiviljstvo Lucija") +
        "&body=" + encodeURIComponent(telo);
    });
  }

  var izprazni = trak ? trak.querySelector(".izprazni") : null;

  if (izprazni) {
    izprazni.addEventListener("click", function (e) {
      e.preventDefault();
      seznam = [];
      shraniSeznam(seznam);
      posodobiPovprasek();
      document.querySelectorAll("[data-dodaj]").forEach(function (g) {
        g.disabled = false;
        g.textContent = "Na seznam povpraševanja";
      });
    });
  }

  posodobiPovprasek();

  /* ---------- 5. Obrazci → e-pošta ---------- */

  function vrednost(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  /* Naročilo po meri (narocilo.html) */

  var obrazecMeritev = document.getElementById("obrazec-narocilo");

  if (obrazecMeritev) {
    obrazecMeritev.addEventListener("submit", function (e) {
      e.preventDefault();

      var vrsta = vrednost("vrsta");
      var ime = vrednost("ime");
      var zadeva = "Naročilo po meri — " + (vrsta || "povpraševanje") + (ime ? " (" + ime + ")" : "");

      var crtice = "\n" + "-".repeat(38) + "\n";
      var telo = "NOVILO NAROČILO PO MERI" + crtice;
      telo += "Vrsta oblačila:  " + vrsta + "\n";
      telo += "Ime:              " + ime + "\n";
      telo += "E-pošta:          " + vrednost("eposta") + "\n";
      telo += "Telefon:          " + vrednost("telefon") + "\n";
      telo += crtice + "MERITVE (v cm)\n";
      [["visina", "Višina"], ["prsi", "Obseg prsi"], ["podprsmi", "Pod prsmi"],
       ["pas", "Obseg pasu"], ["boki", "Obseg bokov"], ["ramena", "Širina ramen"],
       ["rokav", "Dolžina rokava"], ["dolzina", "Dolžina (hlače/krilo)"]]
        .forEach(function (par) {
          var v = vrednost(par[0]);
          if (v) telo += "  " + (par[1] + ":").padEnd(20, " ") + v + " cm\n";
        });
      telo += "Dodatne meritve:  " + vrednost("dodatne") + "\n";
      telo += crtice + "ZADEVA\n";
      telo += "Model/inspiracija: " + vrednost("model") + "\n";
      telo += "Priložnost:        " + vrednost("priloznost") + "\n";
      telo += "Blago:             " + vrednost("blago") + "\n";
      telo += "Želeni rok:        " + vrednost("rok") + "\n";
      telo += crtice + "DODATNO\n" + vrednost("sporocilo") + "\n";

      window.location.href =
        "mailto:" + EPOSTA +
        "?subject=" + encodeURIComponent(zadeva) +
        "&body=" + encodeURIComponent(telo);
    });
  }

  /* Kontakt (kontakt.html) */

  var obrazecKontakt = document.getElementById("obrazec-kontakt");

  if (obrazecKontakt) {
    obrazecKontakt.addEventListener("submit", function (e) {
      e.preventDefault();
      var telo =
        "Od: " + vrednost("k-ime") + " (" + vrednost("k-eposta") + ")\n\n" +
        vrednost("k-sporocilo") + "\n";
      window.location.href =
        "mailto:" + EPOSTA +
        "?subject=" + encodeURIComponent("Sporočilo s spletne strani — " + (vrednost("k-ime") || "obiskovalec")) +
        "&body=" + encodeURIComponent(telo);
    });
  }
})();
