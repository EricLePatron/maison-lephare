import { useEffect, useState } from "react";
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Eye, Clock, Mail, AlertCircle, RefreshCw, Loader2, Calendar, TrendingUp, Heart, BookOpen, Gauge, Globe, Target, FileSearch, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PeriodKey = "24h" | "7d" | "30d" | "90d";

interface ProFunnelRow {
  slug: string;
  views: number;
  rdvClicks: number;
  contactClicks: number;
  convRate: number;
}

interface PeriodData {
  hourly?: boolean;
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
  proFunnel?: ProFunnelRow[];
  totalRdvClicks?: number;
  atelierInscriptions?: { total: number; parAtelier: { nom: string; clics: number }[] };
  atelierCtaClics?: number;
  donClics?: { total: number; desktop: number; mobile: number };
}

interface SeoPage {
  path: string;
  title: string;
  description: string;
  robots: string;
}

interface SeoKeyword {
  query: string;
  clicks: number;
  impressions: number;
  position: number;
  ctr: number;
}

interface SeoData {
  sitemapOk: boolean;
  sitemapUrlCount: number;
  indexedPages: { indexed: number; total: number } | null;
  keywords: SeoKeyword[];
  keywordsTop10Count?: number;
  avgPosition?: number | null;
  score?: number | null;
  pagespeed: { score: number | null; lcp: string | null; cls: string | null } | null;
  pages: SeoPage[];
}

interface DashboardData {
  generatedAt: string;
  periods: Record<PeriodKey, PeriodData>;
  periodLabels: Record<PeriodKey, string>;
  seo?: SeoData;
}

const PERIOD_BUTTONS: { key: PeriodKey; label: string }[] = [
  { key: "24h", label: "Aujourd'hui" },
  { key: "7d",  label: "7 jours"     },
  { key: "30d", label: "30 jours"    },
  { key: "90d", label: "90 jours"    },
];

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

export default function Metrics() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [period, setPeriod] = useState<PeriodKey>("24h");
  const load = (silent = false) => {
    if (!silent) setLoading(true);
    setError(false);
    fetch("/dashboard-data.json?t=" + Date.now())
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

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
        <Button variant="outline" onClick={() => load()} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Réessayer
        </Button>
      </div>
    );
  }

  const d = data.periods[period];
  const {
    overview, contactForm, topPages, sources, dailyTrend,
    proFunnel = [], totalRdvClicks = 0,
    atelierInscriptions = { total: 0, parAtelier: [] },
    atelierCtaClics = 0,
    donClics = { total: 0, desktop: 0, mobile: 0 },
  } = d;
  const bouncePercent = Math.round(parseFloat(overview.bounceRate) * 100);

  const publicPages = topPages
    .filter((p) => !p.page.startsWith("/admin") && p.page !== "/dashboard")
    .slice(0, 6);

  const sourcesData = sources.map((s) => ({
    name: SOURCE_LABELS[s.source] || s.source,
    value: s.sessions,
  }));

  const maxDay = dailyTrend.length > 0 ? dailyTrend.reduce((a, b) => (a.users > b.users ? a : b)) : null;
  const isHourly = d.hourly === true;

  // Tendance : compare 2e moitié vs 1ère moitié de la période (non applicable en vue 24h)
  const half = Math.floor(dailyTrend.length / 2);
  const firstHalf = dailyTrend.slice(0, half);
  const secondHalf = dailyTrend.slice(half);
  const avgFirst = firstHalf.reduce((s, d) => s + d.users, 0) / (firstHalf.length || 1);
  const avgSecond = secondHalf.reduce((s, d) => s + d.users, 0) / (secondHalf.length || 1);
  const trend = !isHourly && avgFirst > 0 ? Math.round(((avgSecond - avgFirst) / avgFirst) * 100) : 0;

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-foreground">Métriques du site</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Données collectées {timeAgo(data.generatedAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Sélecteur de période */}
          <div className="flex rounded-lg border bg-background overflow-hidden">
            {PERIOD_BUTTONS.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setPeriod(btn.key)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium transition-colors",
                  period === btn.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>
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
                <p className="text-xs mt-1">
                  {trend > 0 ? (
                    <span className="text-green-600">↑ +{trend}% sur la période</span>
                  ) : trend < 0 ? (
                    <span className="text-red-500">↓ {trend}% sur la période</span>
                  ) : (
                    <span className="text-muted-foreground">stable</span>
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
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Contacts</p>
                <p className="text-3xl font-bold text-foreground">{contactForm.total}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {contactForm.total === 0 ? "Aucune conversion" : `${contactForm.total} demande${contactForm.total > 1 ? "s" : ""} ✓`}
                </p>
              </div>
              <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", contactForm.total > 0 ? "bg-primary/20" : "bg-muted")}>
                <Mail className={cn("h-5 w-5", contactForm.total > 0 ? "text-primary" : "text-muted-foreground")} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">
            {isHourly ? "Visiteurs heure par heure — aujourd'hui" : `Tendance — ${data.periodLabels[period]}`}
          </CardTitle>
          {maxDay && (
            <CardDescription>
              {isHourly
                ? `Pic : ${maxDay.users} visiteurs à ${maxDay.date}`
                : `Pic : ${maxDay.users} visiteurs le ${maxDay.date}`}
            </CardDescription>
          )}
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
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickLine={false}
                interval={period === "90d" ? 6 : period === "30d" ? 2 : period === "24h" ? 2 : 0}
              />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(30 20% 85%)" }}
                formatter={(v: number) => [v, "Visiteurs"]}
                labelFormatter={(label) => isHourly ? `à ${label}` : label}
              />
              <Area type="monotone" dataKey="users" stroke="hsl(24 55% 40%)" strokeWidth={2} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pages + Sources */}
      <div className="grid gap-4 lg:grid-cols-2">
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
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [v, "vues"]} />
                <Bar dataKey="views" fill="hsl(155 22% 55%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Sources de trafic</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={sourcesData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {sourcesData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [v, "sessions"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {sourcesData.map((s, i) => (
                <div key={s.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-foreground">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{s.value}</span>
                    <span className="text-xs text-muted-foreground">{Math.round((s.value / overview.sessions) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Ateliers & Don ────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Inscriptions ateliers */}
        <Card className={atelierInscriptions.total > 0 ? "border-primary/40 bg-primary/5" : ""}>
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Inscriptions ateliers</p>
                <p className="text-3xl font-bold text-foreground">{atelierInscriptions.total}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {atelierInscriptions.total === 0 ? "Aucun clic S'inscrire" : `clic${atelierInscriptions.total > 1 ? "s" : ""} sur S'inscrire ✓`}
                </p>
              </div>
              <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", atelierInscriptions.total > 0 ? "bg-primary/20" : "bg-muted")}>
                <BookOpen className={cn("h-5 w-5", atelierInscriptions.total > 0 ? "text-primary" : "text-muted-foreground")} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Animer un atelier */}
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">CTA Intervenants</p>
                <p className="text-3xl font-bold text-foreground">{atelierCtaClics}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {atelierCtaClics === 0 ? "Bannière « Animer un atelier »" : `clic${atelierCtaClics > 1 ? "s" : ""} bannière intervenant`}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-sage-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clics Don */}
        <Card className={donClics.total > 0 ? "border-primary/40 bg-primary/5" : ""}>
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Clics « Faire un don »</p>
                <p className="text-3xl font-bold text-foreground">{donClics.total}</p>
                {donClics.total > 0 ? (
                  <p className="text-xs text-muted-foreground mt-1">
                    {donClics.desktop > 0 && `${donClics.desktop} desktop`}
                    {donClics.desktop > 0 && donClics.mobile > 0 && " · "}
                    {donClics.mobile > 0 && `${donClics.mobile} mobile`}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">bouton header</p>
                )}
              </div>
              <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", donClics.total > 0 ? "bg-primary/20" : "bg-muted")}>
                <Heart className={cn("h-5 w-5", donClics.total > 0 ? "text-primary" : "text-muted-foreground")} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Funnel Ateliers ───────────────────────────────────────────── */}
      {(() => {
        const ateliersViews = topPages.find((p) => p.page === "/ateliers")?.views ?? 0;
        const convRate = ateliersViews > 0
          ? Math.round((atelierInscriptions.total / ateliersViews) * 100)
          : 0;

        return (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-medium">Funnel Ateliers</CardTitle>
                  <CardDescription>
                    De la visite de la page jusqu'au clic "S'inscrire"
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Étapes du funnel */}
              <div className="grid grid-cols-3 gap-2">
                {/* Étape 1 : Vues */}
                <div className="rounded-xl bg-muted/40 p-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Vues page</p>
                  <p className="text-2xl font-bold text-foreground">{ateliersViews}</p>
                  <p className="text-xs text-muted-foreground mt-1">/ateliers</p>
                </div>
                {/* Flèche */}
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center text-muted-foreground/40">
                      <div className="h-px w-8 bg-muted-foreground/30" />
                      <span className="text-lg">›</span>
                    </div>
                    {ateliersViews > 0 && (
                      <span className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block",
                        convRate >= 10 ? "bg-green-100 text-green-700" : convRate >= 5 ? "bg-yellow-100 text-yellow-700" : "bg-muted text-muted-foreground"
                      )}>
                        {convRate}%
                      </span>
                    )}
                  </div>
                </div>
                {/* Étape 2 : Inscriptions */}
                <div className={cn(
                  "rounded-xl p-4 text-center",
                  atelierInscriptions.total > 0 ? "bg-primary/10 border border-primary/20" : "bg-muted/40"
                )}>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Clics S'inscrire</p>
                  <p className="text-2xl font-bold text-foreground">{atelierInscriptions.total}</p>
                  <p className="text-xs text-muted-foreground mt-1">toutes fiches</p>
                </div>
              </div>

              {/* Détail par atelier */}
              {atelierInscriptions.parAtelier.length > 0 ? (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Clics S'inscrire par atelier</p>
                  <ResponsiveContainer width="100%" height={Math.max(120, atelierInscriptions.parAtelier.length * 44)}>
                    <BarChart
                      data={atelierInscriptions.parAtelier.map((a) => ({ name: a.nom, clics: a.clics }))}
                      layout="vertical"
                      margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 20% 90%)" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} width={150} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [v, "clics S'inscrire"]} />
                      <Bar dataKey="clics" fill="hsl(24 55% 40%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-muted-foreground/20 p-4 text-center space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Détail par atelier à venir</p>
                  <p className="text-xs text-muted-foreground/70">
                    Le nom de chaque atelier sera affiché ici dès que Google Analytics aura enregistré
                    suffisamment d'événements. Cela se remplit automatiquement — aucune action requise.
                  </p>
                </div>
              )}

              {/* CTA bannière intervenant */}
              {atelierCtaClics > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-sage-50 px-4 py-3 text-sm">
                  <span className="text-muted-foreground">Clics bannière "Animer un atelier"</span>
                  <span className="font-semibold text-foreground">{atelierCtaClics}</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })()}

      {/* Insights */}
      <Card className="bg-sage-50 border-sage-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">💡 Points d'attention</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {publicPages.find((p) => p.page === "/maintenance") && (
            <p>⚠️ La page <strong>/maintenance</strong> reçoit encore du trafic sur cette période.</p>
          )}
          {bouncePercent >= 50 && (
            <p>📊 Taux de rebond de <strong>{bouncePercent}%</strong> — travailler les liens internes pour encourager la navigation.</p>
          )}
          {(overview.pageViews / overview.sessions) < 2 && (
            <p>🔗 <strong>{(overview.pageViews / overview.sessions).toFixed(1)} pages/session</strong> — les visiteurs explorent peu le site.</p>
          )}
          {contactForm.total === 0 && (
            <p>📬 Aucun contact reçu {isHourly ? "aujourd'hui" : <>sur les <strong>{data.periodLabels[period]}</strong></>}.</p>
          )}
          {contactForm.total > 0 && (
            <p>✅ <strong>{contactForm.total} demande{contactForm.total > 1 ? "s" : ""} de contact</strong> {isHourly ? "aujourd'hui" : <>sur les {data.periodLabels[period]}</>}.</p>
          )}
          {!isHourly && trend > 10 && (
            <p>📈 Trafic en <strong>hausse de +{trend}%</strong> sur la 2e moitié de la période.</p>
          )}
          {!isHourly && trend < -10 && (
            <p>📉 Trafic en <strong>baisse de {trend}%</strong> sur la 2e moitié de la période.</p>
          )}
          {totalRdvClicks > 0 && (
            <p>📅 <strong>{totalRdvClicks} clic{totalRdvClicks > 1 ? "s" : ""} RDV</strong> enregistré{totalRdvClicks > 1 ? "s" : ""} {isHourly ? "aujourd'hui" : <>sur les {data.periodLabels[period]}</>}.</p>
          )}
          {donClics.total > 0 && (
            <p>💝 <strong>{donClics.total} clic{donClics.total > 1 ? "s" : ""} sur "Faire un don"</strong> {isHourly ? "aujourd'hui" : <>sur les {data.periodLabels[period]}</>}{donClics.mobile > donClics.desktop ? " — majoritairement mobile" : donClics.desktop > donClics.mobile ? " — majoritairement desktop" : ""}.</p>
          )}
          {atelierInscriptions.total > 0 && (
            <p>📚 <strong>{atelierInscriptions.total} inscription{atelierInscriptions.total > 1 ? "s" : ""} atelier</strong>{atelierInscriptions.parAtelier.length > 0 ? ` — atelier le plus cliqué : ${atelierInscriptions.parAtelier[0].nom}` : ""} {isHourly ? "aujourd'hui" : <>sur les {data.periodLabels[period]}</>}.</p>
          )}
        </CardContent>
      </Card>

      {/* === SECTION SEO === */}
      <div className="mt-10 pt-10 border-t border-border/40">
        {/* En-tête avec badge sitemap */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-serif text-foreground">Monitoring SEO</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Données indicatives — Google Search Console</p>
          </div>
          {data?.seo?.sitemapOk ? (
            <Badge variant="outline" className="gap-1.5 text-xs border-emerald-600/30 text-emerald-700 bg-emerald-50">
              <CheckCircle2 className="h-3 w-3" />
              Sitemap OK
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1.5 text-xs border-muted-foreground/30 text-muted-foreground">
              Sitemap non vérifié
            </Badge>
          )}
        </div>

        {!data?.seo ? (
          <p className="text-xs text-muted-foreground">Données SEO non disponibles — relancer npm run dashboard</p>
        ) : (
          <>
            {/* 4 KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Score SEO */}
              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Score SEO</p>
                      <p className="text-3xl font-bold text-foreground">
                        {data.seo.score ?? '—'}
                        {data.seo.score != null && <span className="text-base font-normal text-muted-foreground">/100</span>}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {data.seo.avgPosition != null ? `Pos. moy. ${data.seo.avgPosition}` : '—'}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Gauge className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pages indexées */}
              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Pages indexées</p>
                      <p className="text-3xl font-bold text-foreground">
                        {data.seo.indexedPages?.indexed ?? '—'}
                        {data.seo.indexedPages != null && (
                          <span className="text-base font-normal text-muted-foreground">/{data.seo.indexedPages.total}</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {data.seo.indexedPages != null
                          ? `${data.seo.indexedPages.total - data.seo.indexedPages.indexed} exclues`
                          : 'GSC non configuré'}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(155 22% 55% / 0.12)' }}>
                      <Globe className="h-5 w-5" style={{ color: 'hsl(155, 22%, 40%)' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mots-clés top 10 */}
              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Mots-clés top 10</p>
                      <p className="text-3xl font-bold text-foreground">{data.seo.keywordsTop10Count ?? '—'}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(data.seo.keywords ?? []).length > 0 ? `sur ${(data.seo.keywords ?? []).length} requêtes` : 'GSC non configuré'}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Position moyenne (remplace Backlinks) */}
              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Position moyenne</p>
                      <p className="text-3xl font-bold text-foreground">{data.seo.avgPosition ?? '—'}</p>
                      <p className="text-xs text-muted-foreground mt-1">Top 20 requêtes GSC</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-violet-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tableau méta-données par page */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <FileSearch className="h-4 w-4 text-muted-foreground" />
                  Méta-données par page
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[640px]">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Page</th>
                        <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Titre</th>
                        <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                        <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Robots</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.seo.pages ?? []).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-xs text-muted-foreground italic">Aucune page analysée</td>
                        </tr>
                      ) : (data.seo.pages ?? []).map((page) => {
                        const isNoindex = page.robots.includes('noindex');
                        return (
                          <tr key={page.path} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-2.5 px-4 font-mono text-xs text-muted-foreground whitespace-nowrap">{page.path}</td>
                            <td className="py-2.5 px-4 max-w-[200px]">
                              <p className="truncate text-foreground text-xs">{page.title}</p>
                            </td>
                            <td className="py-2.5 px-4 max-w-[260px]">
                              {page.description ? (
                                <p className="truncate text-muted-foreground text-xs">{page.description}</p>
                              ) : (
                                <span className="text-muted-foreground/40 text-xs italic">—</span>
                              )}
                            </td>
                            <td className="py-2.5 px-4 whitespace-nowrap">
                              <span className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                isNoindex
                                  ? "bg-red-50 text-red-600 border border-red-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              )}>
                                {isNoindex ? 'noindex' : 'index'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* ── Funnel RDV par professionnel ───────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-medium">Funnel RDV par professionnel</CardTitle>
              <CardDescription>
                {proFunnel.length === 0
                  ? "Les données apparaîtront après les premiers clics sur les boutons de prise de RDV."
                  : `${proFunnel.length} professionnel${proFunnel.length > 1 ? "s" : ""} avec activité sur la période`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {proFunnel.length === 0 ? (
            <div className="py-8 text-center">
              <TrendingUp className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Aucune donnée pour cette période.<br />
                Le funnel se remplira au fil des visites et clics sur les profils.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[540px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Professionnel</th>
                    <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Vues fiche</th>
                    <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Clics RDV</th>
                    <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Clics contact</th>
                    <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Conv. RDV</th>
                  </tr>
                </thead>
                <tbody>
                  {proFunnel.map((pro) => {
                    const maxViews = proFunnel[0]?.views || 1;
                    const barWidth = Math.max(4, Math.round((pro.views / maxViews) * 100));
                    const name = pro.slug
                      .split("-")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ");
                    return (
                      <tr key={pro.slug} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 max-w-[180px]">
                              <p className="font-medium text-foreground truncate">{name}</p>
                              <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-primary/40"
                                  style={{ width: `${barWidth}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium tabular-nums">{pro.views}</td>
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          {pro.rdvClicks > 0 ? (
                            <span className="inline-flex items-center gap-1 font-medium text-primary">
                              {pro.rdvClicks}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          {pro.contactClicks > 0 ? (
                            <span className="font-medium">{pro.contactClicks}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          {pro.rdvClicks > 0 ? (
                            <span
                              className={cn(
                                "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium",
                                pro.convRate >= 20
                                  ? "bg-green-100 text-green-700"
                                  : pro.convRate >= 10
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-50 text-red-600"
                              )}
                            >
                              {pro.convRate}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {proFunnel.length > 1 && (
                  <tfoot>
                    <tr className="border-t-2 border-border bg-muted/20">
                      <td className="py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</td>
                      <td className="py-2 px-3 text-right font-bold tabular-nums">
                        {proFunnel.reduce((s, p) => s + p.views, 0)}
                      </td>
                      <td className="py-2 px-3 text-right font-bold tabular-nums text-primary">
                        {proFunnel.reduce((s, p) => s + p.rdvClicks, 0) || "—"}
                      </td>
                      <td className="py-2 px-3 text-right font-bold tabular-nums">
                        {proFunnel.reduce((s, p) => s + p.contactClicks, 0) || "—"}
                      </td>
                      <td className="py-2 px-3 text-right">
                        {(() => {
                          const totalV = proFunnel.reduce((s, p) => s + p.views, 0);
                          const totalR = proFunnel.reduce((s, p) => s + p.rdvClicks, 0);
                          const rate = totalV > 0 ? Math.round((totalR / totalV) * 100) : 0;
                          return totalR > 0 ? (
                            <span className={cn(
                              "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium",
                              rate >= 20 ? "bg-green-100 text-green-700" : rate >= 10 ? "bg-yellow-100 text-yellow-700" : "bg-red-50 text-red-600"
                            )}>{rate}%</span>
                          ) : <span className="text-muted-foreground">—</span>;
                        })()}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
