import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROPERTY_ID = "534146800";
const CREDENTIALS_PATH =
  process.env.GA_CREDENTIALS ||
  "/Users/ericchollet/Downloads/lephare-494208-6a6df4102954.json";

const client = new BetaAnalyticsDataClient({ keyFilename: CREDENTIALS_PATH });

const PERIODS = [
  { key: "24h", label: "Aujourd'hui",        startDate: "today",     endDate: "today",  hourly: true  },
  { key: "7d",  label: "7 derniers jours",   startDate: "7daysAgo",  endDate: "today",  hourly: false },
  { key: "30d", label: "30 derniers jours",  startDate: "30daysAgo", endDate: "today",  hourly: false },
  { key: "90d", label: "90 derniers jours",  startDate: "90daysAgo", endDate: "today",  hourly: false },
];

async function fetchPeriod({ startDate, endDate, hourly }) {
  const trendDimension = hourly
    ? [{ name: "hour" }]
    : [{ name: "date" }];

  const [
    overview, topPages, sources, contactEvents, trend,
    proPageViewsResult, proRdvClicksResult, proContactClicksResult,
  ] = await Promise.all([
    client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: "sessions" },
        { name: "activeUsers" },
        { name: "screenPageViews" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
      ],
    }),
    client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 10,
    }),
    client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    }),
    client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { matchType: "EXACT", value: "contact_form_submit" },
        },
      },
    }),
    client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: trendDimension,
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      orderBys: [{ dimension: { dimensionName: hourly ? "hour" : "date" } }],
    }),
    // ── Funnel RDV : vues des fiches profils (/professionnels/[slug]) ──
    client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: "pagePath",
                stringFilter: { matchType: "BEGINS_WITH", value: "/professionnels/" },
              },
            },
            {
              notExpression: {
                filter: {
                  fieldName: "pagePath",
                  stringFilter: { matchType: "EXACT", value: "/professionnels/" },
                },
              },
            },
          ],
        },
      },
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 50,
    }),
    // ── Funnel RDV : clics "Prendre rendez-vous" par page (slug) ──────
    // Note : les custom dimensions GA4 (customEvent:pro_slug) nécessitent
    // d'être enregistrées dans l'admin GA4. On utilise pagePath à la place,
    // ce qui fonctionne car les clics se déclenchent sur la page du profil.
    client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: "eventName",
                stringFilter: { matchType: "EXACT", value: "rdv_click" },
              },
            },
            {
              filter: {
                fieldName: "pagePath",
                stringFilter: { matchType: "BEGINS_WITH", value: "/professionnels/" },
              },
            },
          ],
        },
      },
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 50,
    }),
    // ── Funnel RDV : clics "Contacter par email" par page (slug) ──────
    client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: "eventName",
                stringFilter: { matchType: "EXACT", value: "pro_contact_click" },
              },
            },
            {
              filter: {
                fieldName: "pagePath",
                stringFilter: { matchType: "BEGINS_WITH", value: "/professionnels/" },
              },
            },
          ],
        },
      },
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 50,
    }),
  ]);

  const metrics = overview[0].rows?.[0]?.metricValues || [];

  // Pour 24h : les heures pas encore écoulées ne remontent pas de GA4.
  // On complète le tableau jusqu'à l'heure courante avec des zéros.
  let dailyTrend;
  if (hourly) {
    const currentHour = new Date().getHours();
    const rowsByHour = new Map();
    for (const row of trend[0].rows || []) {
      const h = parseInt(row.dimensionValues[0].value, 10);
      rowsByHour.set(h, {
        users:    parseInt(row.metricValues[0].value),
        sessions: parseInt(row.metricValues[1].value),
      });
    }
    dailyTrend = Array.from({ length: currentHour + 1 }, (_, h) => ({
      date:     `${String(h).padStart(2, "0")}h`,
      users:    rowsByHour.get(h)?.users    ?? 0,
      sessions: rowsByHour.get(h)?.sessions ?? 0,
    }));
  } else {
    dailyTrend = (trend[0].rows || []).map((row) => {
      const d = row.dimensionValues[0].value;
      return {
        date:     `${d.slice(6, 8)}/${d.slice(4, 6)}`,
        users:    parseInt(row.metricValues[0].value),
        sessions: parseInt(row.metricValues[1].value),
      };
    });
  }

  // ── Construire le funnel par professionnel ────────────────────────
  const pathToSlug = (path) =>
    path.replace("/professionnels/", "").replace(/\/$/, "");

  const pageViewsMap = new Map();
  for (const row of proPageViewsResult[0].rows || []) {
    const slug = pathToSlug(row.dimensionValues[0].value);
    if (slug) {
      pageViewsMap.set(slug, (pageViewsMap.get(slug) || 0) + parseInt(row.metricValues[0].value));
    }
  }

  const rdvClicksMap = new Map();
  for (const row of proRdvClicksResult[0].rows || []) {
    const slug = pathToSlug(row.dimensionValues[0].value);
    if (slug && slug !== "(not set)") {
      rdvClicksMap.set(slug, parseInt(row.metricValues[0].value));
    }
  }

  const contactClicksMap = new Map();
  for (const row of proContactClicksResult[0].rows || []) {
    const slug = pathToSlug(row.dimensionValues[0].value);
    if (slug && slug !== "(not set)") {
      contactClicksMap.set(slug, parseInt(row.metricValues[0].value));
    }
  }

  // Union de tous les slugs rencontrés
  const allSlugs = new Set([
    ...pageViewsMap.keys(),
    ...rdvClicksMap.keys(),
    ...contactClicksMap.keys(),
  ]);

  const proFunnel = [...allSlugs]
    .map((slug) => {
      const views        = pageViewsMap.get(slug)    || 0;
      const rdvClicks    = rdvClicksMap.get(slug)    || 0;
      const contactClicks = contactClicksMap.get(slug) || 0;
      const convRate     = views > 0 ? Math.round((rdvClicks / views) * 100) : 0;
      return { slug, views, rdvClicks, contactClicks, convRate };
    })
    .sort((a, b) => b.views - a.views);

  const totalRdvClicks = [...rdvClicksMap.values()].reduce((s, v) => s + v, 0);

  // ── Ateliers & Don : second batch (customEvent:atelier_name peut échouer) ──
  let atelierInscriptions = { total: 0, parAtelier: [] };
  let atelierCtaClics = 0;
  let donClics = { total: 0, desktop: 0, mobile: 0 };

  try {
    const [inscriptionsResult, ctaResult, donResult] = await Promise.all([
      // Inscriptions par atelier (customEvent:atelier_name)
      client.runReport({
        property: `properties/${PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "customEvent:atelier_name" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            stringFilter: { matchType: "EXACT", value: "atelier_inscription_click" },
          },
        },
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
        limit: 30,
      }),
      // Total clics CTA "Animer un atelier"
      client.runReport({
        property: `properties/${PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            stringFilter: { matchType: "EXACT", value: "atelier_cta_click" },
          },
        },
      }),
      // Don : total + desktop vs mobile
      client.runReport({
        property: `properties/${PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "customEvent:location" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            stringFilter: { matchType: "EXACT", value: "don_click" },
          },
        },
        limit: 5,
      }),
    ]);

    const inscriptionRows = inscriptionsResult[0].rows || [];
    atelierInscriptions = {
      total: inscriptionRows.reduce((s, r) => s + parseInt(r.metricValues[0].value), 0),
      parAtelier: inscriptionRows
        .filter((r) => r.dimensionValues[0].value !== "(not set)")
        .map((r) => ({
          nom: r.dimensionValues[0].value,
          clics: parseInt(r.metricValues[0].value),
        })),
    };

    atelierCtaClics = (ctaResult[0].rows || []).reduce(
      (s, r) => s + parseInt(r.metricValues[0].value), 0
    );

    const donRows = donResult[0].rows || [];
    donClics = {
      total: donRows.reduce((s, r) => s + parseInt(r.metricValues[0].value), 0),
      desktop: donRows.find((r) => r.dimensionValues[0].value === "header_desktop")
        ? parseInt(donRows.find((r) => r.dimensionValues[0].value === "header_desktop").metricValues[0].value)
        : 0,
      mobile: donRows.find((r) => r.dimensionValues[0].value === "header_mobile")
        ? parseInt(donRows.find((r) => r.dimensionValues[0].value === "header_mobile").metricValues[0].value)
        : 0,
    };
  } catch (_err) {
    // customEvent:atelier_name ou customEvent:location pas encore enregistrés en GA4 —
    // fallback sur totaux simples sans dimension personnalisée
    try {
      const [inscTot, ctaTot, donTot] = await Promise.all([
        client.runReport({
          property: `properties/${PROPERTY_ID}`,
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: "eventCount" }],
          dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT", value: "atelier_inscription_click" } } },
        }),
        client.runReport({
          property: `properties/${PROPERTY_ID}`,
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: "eventCount" }],
          dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT", value: "atelier_cta_click" } } },
        }),
        client.runReport({
          property: `properties/${PROPERTY_ID}`,
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: "eventCount" }],
          dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT", value: "don_click" } } },
        }),
      ]);
      atelierInscriptions.total = (inscTot[0].rows || []).reduce((s, r) => s + parseInt(r.metricValues[0].value), 0);
      atelierCtaClics = (ctaTot[0].rows || []).reduce((s, r) => s + parseInt(r.metricValues[0].value), 0);
      donClics.total = (donTot[0].rows || []).reduce((s, r) => s + parseInt(r.metricValues[0].value), 0);
    } catch (_) { /* pas de données */ }
  }

  return {
    hourly,
    overview: {
      sessions:    parseInt(metrics[0]?.value || 0),
      users:       parseInt(metrics[1]?.value || 0),
      pageViews:   parseInt(metrics[2]?.value || 0),
      bounceRate:  parseFloat(metrics[3]?.value || 0).toFixed(1),
      avgDuration: Math.round(parseFloat(metrics[4]?.value || 0)),
    },
    contactForm: {
      total: (contactEvents[0].rows || []).reduce(
        (sum, r) => sum + parseInt(r.metricValues[0].value), 0
      ),
    },
    topPages: (topPages[0].rows || []).map((row) => ({
      page:  row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value),
    })),
    sources: (sources[0].rows || []).map((row) => ({
      source:   row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value),
    })),
    dailyTrend,
    proFunnel,
    totalRdvClicks,
    atelierInscriptions,
    atelierCtaClics,
    donClics,
  };
}

async function fetchMetrics() {
  console.log("⏳ Collecte des données GA4 pour 4 périodes...");

  const results = {};
  for (const period of PERIODS) {
    process.stdout.write(`  → ${period.label}... `);
    results[period.key] = await fetchPeriod(period);
    console.log("✓");
  }

  const data = {
    generatedAt: new Date().toISOString(),
    periods: results,
    periodLabels: Object.fromEntries(PERIODS.map((p) => [p.key, p.label])),
  };

  const outputPath = resolve(__dirname, "../public/dashboard-data.json");
  writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`\n✅ Dashboard mis à jour : ${outputPath}`);
}

fetchMetrics().catch((err) => {
  console.error("❌ Erreur:", err.message);
  process.exit(1);
});
