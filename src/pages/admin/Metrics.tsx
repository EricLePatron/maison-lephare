import { useEffect, useState } from "react";
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users, Eye, Clock, TrendingUp, Mail, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  contactForm: { total: number };
  topPages: { page: string; views: number }[];
  sources: { source: string; sessions: number }[];
  dailyTrend: { date: string; users: number; sessions: number }[];
}

const COLORS = ["hsl(24 55% 40%)", "hsl(155 22% 55%)", "hsl(25 50% 70%)", "hsl(155 25% 35%)"];

const SOURCE_LABELS: Record<string, string> = {
  Direct: "Direct",
  "Organic Search": "Recherche",
  Unassigned: "Non assigné",
  Referral: "Référencement",
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m${s.toString().padStart(2, "0")}s`;
}

function formatPage(path: string): string {
  if (path === "/") return "Accueil";
  if (path === "/maintenance") return "Maintenance ⚠️";
  return path.replace("/professionnels/", "/pro/").replace(/^\//, "").replace(/-/g, " ");
}

function timeAgo(isoDate: string): string {
  const diff = (Date.now() - new Date(isoDate).getTime()) / 1000 / 60;
  if (diff < 60) return `il y a ${Math.round(diff)} min`;
  if (diff < 1440) return `il y a ${Math.round(diff / 60)}h`;
  return `il y a ${Math.round(diff / 1440)}j`;
}

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export default function Metrics() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nextRefresh, setNextRefresh] = useState(REFRESH_INTERVAL / 1000);

  const load = (silent = false) => {
    if (!silent) setLoading(true);
    setError(false);
    fetch("/dashboard-data.json?t=" + Date.now())
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); setNextRefresh(REFRESH_INTERVAL / 1000); })
      .catch(() => { setError(true); setLoading(false); });
  };

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    load();
    const interval = setInterval(() => load(true), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setNextRefresh((n) => (n <= 1 ? REFRESH_INTERVAL / 1000 : n - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
        <p className="text-muted-foreground">
          Données non disponibles. Lance <code className="bg-muted px-1 rounded text-xs">npm run dashboard</code> pour les générer.
        </p>
        <Button variant="outline" onClick={load} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Réessayer
        </Button>
      </div>
    );
  }

  const { overview, contactForm, topPages, sources, dailyTrend } = data;
  const bouncePercent = Math.round(parseFloat(overview.bounceRate) * 100);

  // Pages filtrées (sans admin/dashboard)
  const publicPages = topPages
    .filter((p) => !p.page.startsWith("/admin") && p.page !== "/dashboard")
    .slice(0, 6);

  // Sources avec labels FR
  const sourcesData = sources.map((s) => ({
    name: SOURCE_LABELS[s.source] || s.source,
    value: s.sessions,
  }));

  // Pic et tendance
  const maxDay = dailyTrend.reduce((a, b) => (a.users > b.users ? a : b));
  const last7 = dailyTrend.slice(-7);
  const prev7 = dailyTrend.slice(-14, -7);
  const avgLast7 = last7.reduce((s, d) => s + d.users, 0) / 7;
  const avgPrev7 = prev7.reduce((s, d) => s + d.users, 0) / 7;
  const trend = avgPrev7 > 0 ? Math.round(((avgLast7 - avgPrev7) / avgPrev7) * 100) : 0;

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-medium text-foreground">Métriques du site</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.period} · Données collectées {timeAgo(data.generatedAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Actualisation dans {Math.floor(nextRefresh / 60)}:{String(nextRefresh % 60).padStart(2, "0")}
          </span>
          <Button variant="outline" size="sm" onClick={() => load()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Visiteurs</p>
                <p className="text-3xl font-bold text-foreground">{overview.users.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {trend > 0 ? (
                    <span className="text-green-600">↑ +{trend}% vs sem. préc.</span>
                  ) : trend < 0 ? (
                    <span className="text-red-500">↓ {trend}% vs sem. préc.</span>
                  ) : (
                    "stable"
                  )}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Pages vues</p>
                <p className="text-3xl font-bold text-foreground">{overview.pageViews.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(overview.pageViews / overview.sessions).toFixed(1)} pages / session
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-sage-100 flex items-center justify-center">
                <Eye className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Durée moy.</p>
                <p className="text-3xl font-bold text-foreground">{formatDuration(overview.avgDuration)}</p>
                <p className="text-xs text-muted-foreground mt-1">Rebond : {bouncePercent}%</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-cream-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={contactForm.total > 0 ? "border-primary/40 bg-primary/5" : ""}>
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Contacts reçus</p>
                <p className="text-3xl font-bold text-foreground">{contactForm.total}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {contactForm.total === 0 ? "Aucune conversion" : contactForm.total === 1 ? "1 demande ✓" : `${contactForm.total} demandes ✓`}
                </p>
              </div>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${contactForm.total > 0 ? "bg-primary/20" : "bg-muted"}`}>
                <Mail className={`h-5 w-5 ${contactForm.total > 0 ? "text-primary" : "text-muted-foreground"}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Tendance quotidienne</CardTitle>
          <CardDescription>
            Pic : {maxDay.users} visiteurs le {maxDay.date}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(24 55% 40%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(24 55% 40%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 20% 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(30 20% 85%)" }}
                formatter={(v: number) => [v, "Visiteurs"]}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="hsl(24 55% 40%)"
                strokeWidth={2}
                fill="url(#colorUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pages + Sources */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top pages */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Pages les plus visitées</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={publicPages.map((p) => ({ name: formatPage(p.page), views: p.views }))}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 20% 90%)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} width={90} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  formatter={(v: number) => [v, "vues"]}
                />
                <Bar dataKey="views" fill="hsl(155 22% 55%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sources */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Sources de trafic</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie
                  data={sourcesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sourcesData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  formatter={(v: number) => [v, "sessions"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {sourcesData.map((s, i) => (
                <div key={s.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-foreground">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{s.value}</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((s.value / overview.sessions) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="bg-sage-50 border-sage-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">💡 Points d'attention</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {publicPages.find((p) => p.page === "/maintenance") && (
            <p>⚠️ La page <strong>/maintenance</strong> reçoit encore du trafic — traces des anciennes visites.</p>
          )}
          {bouncePercent >= 50 && (
            <p>📊 Taux de rebond de <strong>{bouncePercent}%</strong> — la moitié des visiteurs repart sans explorer. Travailler les liens internes.</p>
          )}
          {(overview.pageViews / overview.sessions) < 2 && (
            <p>🔗 Moyenne de <strong>{(overview.pageViews / overview.sessions).toFixed(1)} pages/session</strong> — encourager la navigation entre les sections.</p>
          )}
          {contactForm.total === 0 && (
            <p>📬 Aucune soumission de formulaire de contact détectée sur la période.</p>
          )}
          {contactForm.total > 0 && (
            <p>✅ <strong>{contactForm.total} demande{contactForm.total > 1 ? "s" : ""} de contact</strong> reçue{contactForm.total > 1 ? "s" : ""} — conversion active.</p>
          )}
          {trend > 10 && (
            <p>📈 Trafic en hausse de <strong>+{trend}%</strong> cette semaine par rapport à la précédente.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
