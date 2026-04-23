import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, Eye, MousePointerClick, Clock, TrendingUp } from "lucide-react";

interface DashboardData {
  generatedAt: string;
  period: string;
  overview: {
    sessions: number;
    users: number;
    pageViews: number;
    bounceRate: string;
    avgDuration: number;
  };
  topPages: { page: string; views: number }[];
  sources: { source: string; sessions: number }[];
  dailyTrend: { date: string; users: number; sessions: number }[];
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-[#f0f4f0] p-2 rounded-lg">
          <Icon className="w-5 h-5 text-[#2d5a27]" />
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <div className="text-3xl font-bold text-gray-800">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/dashboard-data.json")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Aucune donnée disponible — lance le script fetch-analytics.
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Chargement...
      </div>
    );

  const generated = new Date(data.generatedAt).toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#f8faf8] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard LePhare
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {data.period} · Mis à jour le {generated}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Users}
            label="Utilisateurs"
            value={data.overview.users.toLocaleString("fr-FR")}
          />
          <StatCard
            icon={TrendingUp}
            label="Sessions"
            value={data.overview.sessions.toLocaleString("fr-FR")}
          />
          <StatCard
            icon={Eye}
            label="Pages vues"
            value={data.overview.pageViews.toLocaleString("fr-FR")}
          />
          <StatCard
            icon={Clock}
            label="Durée moyenne"
            value={formatDuration(data.overview.avgDuration)}
            sub={`Taux de rebond : ${data.overview.bounceRate}%`}
          />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Visiteurs quotidiens
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                interval={4}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#2d5a27"
                strokeWidth={2}
                dot={false}
                name="Utilisateurs"
              />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#8db88a"
                strokeWidth={2}
                dot={false}
                name="Sessions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Pages les plus visitées
            </h2>
            <div className="space-y-3">
              {data.topPages.map((p) => (
                <div key={p.page} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate max-w-[200px]">
                    {p.page === "/" ? "Accueil" : p.page}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {p.views.toLocaleString("fr-FR")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Sources de trafic
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.sources} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  dataKey="source"
                  type="category"
                  tick={{ fontSize: 11 }}
                  width={100}
                />
                <Tooltip />
                <Bar dataKey="sessions" fill="#2d5a27" radius={[0, 4, 4, 0]} name="Sessions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
