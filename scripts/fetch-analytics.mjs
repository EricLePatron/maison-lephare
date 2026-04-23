import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROPERTY_ID = "534146800";
const CREDENTIALS_PATH =
  process.env.GA_CREDENTIALS ||
  "/Users/ericchollet/Downloads/lephare-494208-6a6df4102954.json";

const client = new BetaAnalyticsDataClient({
  keyFilename: CREDENTIALS_PATH,
});

async function fetchMetrics() {
  const today = new Date();
  const formatDate = (d) => d.toISOString().split("T")[0];
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const [overview, topPages, sources] = await Promise.all([
    client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
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
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 10,
    }),
    client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    }),
    client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    }),
  ]);

  const [dailyTrend] = await Promise.all([
    client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    }),
  ]);

  const metrics = overview[0].rows?.[0]?.metricValues || [];

  const data = {
    generatedAt: new Date().toISOString(),
    period: "30 derniers jours",
    overview: {
      sessions: parseInt(metrics[0]?.value || 0),
      users: parseInt(metrics[1]?.value || 0),
      pageViews: parseInt(metrics[2]?.value || 0),
      bounceRate: parseFloat(metrics[3]?.value || 0).toFixed(1),
      avgDuration: Math.round(parseFloat(metrics[4]?.value || 0)),
    },
    topPages: (topPages[0].rows || []).map((row) => ({
      page: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value),
    })),
    sources: (sources[0].rows || []).map((row) => ({
      source: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value),
    })),
    dailyTrend: (dailyTrend[0].rows || []).map((row) => {
      const d = row.dimensionValues[0].value;
      return {
        date: `${d.slice(6, 8)}/${d.slice(4, 6)}`,
        users: parseInt(row.metricValues[0].value),
        sessions: parseInt(row.metricValues[1].value),
      };
    }),
  };

  const outputPath = resolve(__dirname, "../public/dashboard-data.json");
  writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`✅ Dashboard mis à jour : ${outputPath}`);
}

fetchMetrics().catch((err) => {
  console.error("❌ Erreur:", err.message);
  process.exit(1);
});
