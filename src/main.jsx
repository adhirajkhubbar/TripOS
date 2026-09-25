import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  HashRouter,
  NavLink,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  Bell,
  CalendarDays,
  Car,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Compass,
  Copy,
  Download,
  Filter,
  Heart,
  Hotel,
  LayoutDashboard,
  Map,
  MapPin,
  Menu,
  Moon,
  MoreHorizontal,
  Navigation,
  Plane,
  Plus,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Trash2,
  Utensils,
  WalletCards,
  X,
  Zap,
  LogIn,
  LogOut,
  User,
  Mail,
  Lock,
  UserPlus,
  Pencil,
} from "lucide-react";

import "./styles.css";

/* =========================================================
   HELPERS
========================================================= */

const img = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;

const defaults = {
  trips: [
    {
      id: "goa",
      name: "Goa · Monsoon Escape",
      location: "Goa, India",
      dates: "18–22 Oct 2026",
      status: "Planning",
      budget: 35000,
      spent: 18400,
      cover: img("1512343879784-a960bf40e7f2"),
    },
    {
      id: "kyoto",
      name: "Kyoto · Slow Japan",
      location: "Kyoto, Japan",
      dates: "03–10 Apr 2027",
      status: "Draft",
      budget: 125000,
      spent: 0,
      cover: img("1493976040374-85c8e12f0c0e"),
    },
    {
      id: "dubai",
      name: "Dubai · Design Weekend",
      location: "Dubai, UAE",
      dates: "11–14 Dec 2026",
      status: "Ready",
      budget: 65000,
      spent: 41200,
      cover: img("1512453979798-5ea266f8880c"),
    },
  ],

  itinerary: [
    {
      id: 1,
      day: 1,
      date: "18 Oct",
      time: "10:20",
      title: "Land at Dabolim Airport",
      type: "Flight",
      meta: "IX 287 · Terminal 1",
      cost: 0,
    },
    {
      id: 2,
      day: 1,
      date: "18 Oct",
      time: "12:00",
      title: "Check-in at The Postcard",
      type: "Stay",
      meta: "Fontainhas · 3 nights",
      cost: 7200,
    },
    {
      id: 3,
      day: 1,
      date: "18 Oct",
      time: "14:00",
      title: "Lunch at Gunpowder",
      type: "Food",
      meta: "Seafood · reservation recommended",
      cost: 1800,
    },
    {
      id: 4,
      day: 1,
      date: "18 Oct",
      time: "17:30",
      title: "Fontainhas photo walk",
      type: "Experience",
      meta: "90 min · self-guided",
      cost: 0,
    },
    {
      id: 5,
      day: 2,
      date: "19 Oct",
      time: "08:30",
      title: "Scooter pickup",
      type: "Transport",
      meta: "Arpora · full day",
      cost: 700,
    },
    {
      id: 6,
      day: 2,
      date: "19 Oct",
      time: "10:00",
      title: "Fort Aguada",
      type: "Experience",
      meta: "Golden-hour route",
      cost: 250,
    },
    {
      id: 7,
      day: 2,
      date: "19 Oct",
      time: "13:30",
      title: "Lunch · Vinayak",
      type: "Food",
      meta: "Local Goan thali",
      cost: 900,
    },
    {
      id: 8,
      day: 2,
      date: "19 Oct",
      time: "17:00",
      title: "Vagator sunset",
      type: "Experience",
      meta: "Chapora viewpoint",
      cost: 0,
    },
    {
      id: 9,
      day: 3,
      date: "20 Oct",
      time: "09:30",
      title: "Café crawl",
      type: "Food",
      meta: "Assagao loop",
      cost: 1400,
    },
    {
      id: 10,
      day: 3,
      date: "20 Oct",
      time: "13:00",
      title: "Anjuna beach",
      type: "Experience",
      meta: "Swim · read · reset",
      cost: 0,
    },
    {
      id: 11,
      day: 3,
      date: "20 Oct",
      time: "18:00",
      title: "Sunset sailing",
      type: "Experience",
      meta: "2 hrs · Mandovi",
      cost: 3200,
    },
  ],

  expenses: [
    {
      id: 1,
      category: "Stay",
      merchant: "The Postcard",
      amount: 7200,
      date: "18 Oct",
    },
    {
      id: 2,
      category: "Food",
      merchant: "Gunpowder",
      amount: 1800,
      date: "18 Oct",
    },
    {
      id: 3,
      category: "Transport",
      merchant: "Scooter rental",
      amount: 700,
      date: "19 Oct",
    },
    {
      id: 4,
      category: "Experience",
      merchant: "Sunset sailing",
      amount: 3200,
      date: "20 Oct",
    },
  ],

  favorites: ["Kyoto", "Lisbon"],
};

function load(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(`tripos-${key}`));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(`tripos-${key}`, JSON.stringify(value));
}

function money(number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(number) || 0);
}

function iconFor(type) {
  if (type === "Flight") return Plane;
  if (type === "Stay") return Hotel;
  if (type === "Food") return Utensils;
  if (type === "Transport") return Car;
  return Compass;
}

/* =========================================================
   APP
========================================================= */

function App() {
  const [trips, setTrips] = useState(() =>
    load("trips", defaults.trips)
  );

  const [activeId, setActiveId] = useState(
    () => localStorage.getItem("tripos-active") || "goa"
  );

  const [itinerary, setItinerary] = useState(() =>
    load("itinerary", defaults.itinerary)
  );

  const [expenses, setExpenses] = useState(() =>
    load("expenses", defaults.expenses)
  );

  const [favorites, setFavorites] = useState(() =>
    load("favorites", defaults.favorites)
  );

  const [theme, setTheme] = useState(
    () => localStorage.getItem("tripos-theme") || "dark"
  );

  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);

  /* ================= AUTH ================= */

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tripos-user")) || null;
    } catch {
      return null;
    }
  });

  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  /* ================= SAVE DATA ================= */

  useEffect(() => {
    save("trips", trips);
  }, [trips]);

  useEffect(() => {
    save("itinerary", itinerary);
  }, [itinerary]);

  useEffect(() => {
    save("expenses", expenses);
  }, [expenses]);

  useEffect(() => {
    save("favorites", favorites);
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("tripos-active", activeId);
  }, [activeId]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("tripos-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("tripos-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("tripos-user");
    }
  }, [user]);

  const trip = trips.find((item) => item.id === activeId) || trips[0];

  const notify = (message) => {
    setToast(message);

    clearTimeout(window.__triposToast);

    window.__triposToast = setTimeout(() => {
      setToast("");
    }, 2600);
  };

  /* ================= TRIPS ================= */

  const newTrip = () => {
    const id = `trip-${Date.now()}`;

    const newTripData = {
      id,
      name: "New Trip · Untitled",
      location: "Choose destination",
      dates: "Add dates",
      status: "Draft",
      budget: 50000,
      spent: 0,
      cover: img("1469474968028-56623f02e42e"),
    };

    setTrips((current) => [newTripData, ...current]);
    setActiveId(id);

    notify("New trip created");
  };

  /* ================= ITINERARY ================= */

  const deleteActivity = (id) => {
    setItinerary((current) =>
      current.filter((item) => item.id !== id)
    );

    notify("Activity removed");
  };

  const addActivity = (data) => {
    const activity = {
      id: Date.now(),
      day: Number(data.day) || 1,
      date: data.date || "TBD",
      time: data.time || "12:00",
      title: data.title,
      type: data.type || "Experience",
      meta: data.meta || "Added to your itinerary",
      cost: Number(data.cost) || 0,
    };

    setItinerary((current) => [...current, activity]);

    notify("Activity added");
  };

  /* ================= EXPENSES ================= */

  const addExpense = (expense) => {
    const amount = Number(expense.amount) || 0;

    setExpenses((current) => [
      {
        ...expense,
        id: Date.now(),
        amount,
      },
      ...current,
    ]);

    setTrips((current) =>
      current.map((item) =>
        item.id === activeId
          ? {
              ...item,
              spent: Number(item.spent || 0) + amount,
            }
          : item
      )
    );

    setExpenseOpen(false);

    notify("Expense added");
  };

  /* ================= AUTH ================= */

  const handleLogin = (account) => {
    const loggedUser = {
      name: account.name || account.email.split("@")[0],
      email: account.email,
    };

    setUser(loggedUser);
    setAuthOpen(false);
    notify("Logged in successfully");
  };

  const handleLogout = () => {
    setUser(null);
    setProfileOpen(false);
    notify("Logged out successfully");
  };

  return (
    <div className="app-shell">
      <Sidebar
  open={mobileOpen}
  close={() => setMobileOpen(false)}
  trip={trip}
  trips={trips}
  activeId={activeId}
  setActiveId={setActiveId}
  theme={theme}
  setTheme={setTheme}
  newTrip={newTrip}
  notify={notify}
/>

      <main className="main-shell">
        <Topbar
          trip={trip}
          openMenu={() => setMobileOpen(true)}
          openSearch={() => setSearchOpen(true)}
          notify={notify}
          user={user}
          openLogin={() => setAuthOpen(true)}
          openProfile={() => setProfileOpen(true)}
        />

        <div className="page-wrap">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  trip={trip}
                  trips={trips}
                  newTrip={newTrip}
                  notify={notify}
                />
              }
            />

            <Route
              path="/planner"
              element={
                <Planner
                  trip={trip}
                  itinerary={itinerary}
                  deleteActivity={deleteActivity}
                  addActivity={addActivity}
                  notify={notify}
                />
              }
            />

            <Route
              path="/discover"
              element={
                <Discover
                  favorites={favorites}
                  setFavorites={setFavorites}
                  notify={notify}
                />
              }
            />

            <Route
              path="/budget"
              element={
                <Budget
                  trip={trip}
                  expenses={expenses}
                  openExpense={() => setExpenseOpen(true)}
                  notify={notify}
                />
              }
            />

            <Route
              path="/settings"
              element={
                <SettingsPage
                  theme={theme}
                  setTheme={setTheme}
                  notify={notify}
                />
              }
            />
          </Routes>
        </div>
      </main>

      {mobileOpen && (
        <div
          className="scrim"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {searchOpen && (
        <SearchModal close={() => setSearchOpen(false)} />
      )}

      {expenseOpen && (
        <ExpenseModal
          close={() => setExpenseOpen(false)}
          add={addExpense}
        />
      )}

      {authOpen && (
        <AuthModal
          close={() => setAuthOpen(false)}
          login={handleLogin}
        />
      )}

      {profileOpen && (
        <ProfileModal
          user={user}
          close={() => setProfileOpen(false)}
          login={() => {
            setProfileOpen(false);
            setAuthOpen(true);
          }}
          logout={handleLogout}
        />
      )}

      {toast && (
        <div className="toast">
          <Check size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  open,
  close,
  trip,
  trips,
  activeId,
  setActiveId,
  theme,
  setTheme,
  newTrip,
  notify
})  {
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("tripos-logged-in") === "true"
  );

  const handleLogin = () => {
    localStorage.setItem("tripos-logged-in", "true");
    setLoggedIn(true);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("tripos-logged-in");
    setLoggedIn(false);
    setProfileOpen(false);
  };

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      {/* BRAND */}
      <div className="brand">
        <div className="brand-mark">
          <Compass size={18} />
        </div>

        <div>
          <b>TripOS</b>
          <span>Travel Operating System</span>
        </div>

        <button
          className="icon-btn mobile-close"
          onClick={close}
        >
          <X size={18} />
        </button>
      </div>

      {/* ACTIVE TRIP */}
      <div className="trip-picker">
        <label>ACTIVE TRIP</label>

        <div className="select-wrap">
          <select
            value={activeId}
            onChange={(e) => setActiveId(e.target.value)}
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <ChevronDown size={14} />
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="side-nav">
        <small>WORKSPACE</small>

        {[
          ["/", "Overview", LayoutDashboard],
          ["/planner", "Planner", CalendarDays],
          ["/discover", "Discover", Compass],
          ["/budget", "Budget", WalletCards],
          ["/settings", "Settings", Settings]
        ].map(([to, label, Icon]) => (
          <NavLink
            end={to === "/"}
            key={to}
            to={to}
            onClick={close}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* BOTTOM SECTION */}
      <div className="sidebar-bottom">

        {/* THEME */}
        <button
          className="nav-link theme-button"
          onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
        >
          {theme === "dark" ? (
            <Sun size={17} />
          ) : (
            <Moon size={17} />
          )}

          <span>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </span>
        </button>

        {/* NEW TRIP */}
        <button
          className="new-trip-side"
          onClick={newTrip}
        >
          <Plus size={15} />
          New trip
        </button>

        {/* PROFILE */}
        <div className="profile-wrapper">

          <button
            className="profile"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="avatar">
              AK
            </div>

            <div className="profile-info">
              <b>Adhiraj</b>
              <span>
                {loggedIn ? "Traveler" : "Guest"}
              </span>
            </div>

            <MoreHorizontal size={16} />
          </button>

          {/* PROFILE MENU */}
          {profileOpen && (
            <div className="profile-menu">

              {loggedIn ? (
                <>
                  <div className="profile-menu-header">
                    <div className="avatar large">
                      AK
                    </div>

                    <div>
                      <strong>Adhiraj Khubbar</strong>
                      <span>adhiraj@example.com</span>
                    </div>
                  </div>

                  <div className="profile-divider" />

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      notify?.("Profile settings coming soon");
                    }}
                  >
                    <Settings size={15} />
                    Profile settings
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      notify?.("Account information opened");
                    }}
                  >
                    <ShieldCheck size={15} />
                    Account
                  </button>

                  <div className="profile-divider" />

                  <button
                    className="logout-button"
                    onClick={handleLogout}
                  >
                    <ExternalLink size={15} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="profile-menu-header">
                    <div className="avatar large">
                      AK
                    </div>

                    <div>
                      <strong>Guest account</strong>
                      <span>Not logged in</span>
                    </div>
                  </div>

                  <div className="profile-divider" />

                  <button onClick={handleLogin}>
                    <Check size={15} />
                    Login
                  </button>
                </>
              )}

            </div>
          )}

        </div>
      </div>
    </aside>
  );
}

/* =========================================================
   TOPBAR
========================================================= */

function Topbar({
  trip,
  openMenu,
  openSearch,
  notify,
  user,
  openLogin,
  openProfile,
}) {
  return (
    <header className="topbar">
      <button
        className="icon-btn menu-btn"
        onClick={openMenu}
      >
        <Menu size={20} />
      </button>

      <div className="crumb">
        <span>Workspace</span>
        <em>/</em>
        <b>{trip?.name}</b>
      </div>

      <div className="top-actions">
        <button
          className="search-pill"
          onClick={openSearch}
        >
          <Search size={15} />
          <span>Search</span>
          <kbd>⌘ K</kbd>
        </button>

        <button
          className="icon-btn"
          onClick={() =>
            notify("No new notifications")
          }
        >
          <Bell size={17} />
          <i className="notif-dot" />
        </button>

        {/* FIXED TOP RIGHT PROFILE */}
        {user ? (
          <button
            className="avatar small profile-avatar-button"
            onClick={openProfile}
            type="button"
            title="Open profile"
          >
            {user.name
              ? user.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "U"}
          </button>
        ) : (
          <button
            className="avatar small profile-avatar-button"
            onClick={openLogin}
            type="button"
            title="Login"
          >
            <User size={17} />
          </button>
        )}
      </div>
    </header>
  );
}

/* =========================================================
   PAGE HEADER
========================================================= */

function PageHeader({
  eyebrow,
  title,
  desc,
  action,
}) {
  return (
    <div className="page-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>

        <h1>{title}</h1>

        {desc && <p>{desc}</p>}
      </div>

      {action}
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  trip,
  trips,
  newTrip,
  notify,
}) {
  const budget = Number(trip?.budget || 0);
  const spent = Number(trip?.spent || 0);

  const pct =
    budget > 0
      ? Math.min(100, Math.round((spent / budget) * 100))
      : 0;

  return (
    <>
      <PageHeader
        eyebrow="MONDAY · 25 SEP 2026"
        title="Good morning, Adhiraj."
        desc="Your trips, plans and travel decisions — in one place."
        action={
          <button
            className="primary"
            onClick={newTrip}
          >
            <Plus size={16} />
            New trip
          </button>
        }
      />

      <div className="hero-grid">
        <div
          className="hero"
          style={{
            backgroundImage: `linear-gradient(90deg,rgba(6,10,20,.94),rgba(6,10,20,.22)),url(${trip.cover})`,
          }}
        >
          <div className="hero-content">
            <span className="status">
              <i />
              {trip.status}
            </span>

            <h2>{trip.name}</h2>

            <p>
              <MapPin size={14} />
              {trip.location}

              <span>·</span>

              <CalendarDays size={14} />
              {trip.dates}
            </p>

            <div className="hero-buttons">
              <NavLink
                to="/planner"
                className="light-btn"
              >
                Open planner
                <ArrowRight size={14} />
              </NavLink>

              <button
                className="glass-btn"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `${trip.name} · ${trip.location}`
                  );

                  notify("Trip summary copied");
                }}
              >
                <Share2 size={14} />
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="budget-hero card">
          <div className="card-top">
            <span>TRIP BUDGET</span>
            <CircleDollarSign size={18} />
          </div>

          <strong>{money(budget)}</strong>

          <div className="budget-bar">
            <span
              style={{
                width: `${pct}%`,
              }}
            />
          </div>

          <div className="budget-meta">
            <span>{money(spent)} spent</span>
            <b>{pct}%</b>
          </div>

          <p>
            {money(Math.max(0, budget - spent))} remaining
          </p>
        </div>
      </div>

      <div className="stats">
        <Stat
          icon={CalendarDays}
          label="Days planned"
          value="3 days"
        />

        <Stat
          icon={Navigation}
          label="Activities"
          value="11"
        />

        <Stat
          icon={Zap}
          label="Plan improvements"
          value="7"
        />
      </div>

      <section className="section">
        <div className="section-head">
          <div>
            <h3>Your trips</h3>
            <span>{trips.length} workspaces</span>
          </div>

          <button
            className="text-btn"
            onClick={newTrip}
          >
            Create trip
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="trip-grid">
          {trips.map((item) => (
            <TripCard
              key={item.id}
              trip={item}
            />
          ))}
        </div>
      </section>

      <section className="insight card">
        <div className="ai-icon large">
          <Sparkles size={19} />
        </div>

        <div>
          <span className="eyebrow">
            TRIPOS INSIGHT
          </span>

          <h3>
            Your Goa plan has a 2.1h buffer on Day 2.
          </h3>

          <p>
            Move Fort Aguada 30 minutes earlier and
            you'll get a cleaner sunset window without
            adding travel time.
          </p>
        </div>

        <NavLink
          to="/planner"
          className="secondary"
        >
          Review plan
          <ArrowRight size={14} />
        </NavLink>
      </section>
    </>
  );
}

/* =========================================================
   STAT
========================================================= */

function Stat({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="stat card">
      <div className="stat-icon">
        <Icon size={17} />
      </div>

      <div>
        <b>{value}</b>
        <span>{label}</span>
      </div>
    </div>
  );
}

/* =========================================================
   TRIP CARD
========================================================= */

function TripCard({ trip }) {
  return (
    <NavLink
      to="/planner"
      className="trip-card"
    >
      <div
        className="trip-image"
        style={{
          backgroundImage: `url(${trip.cover})`,
        }}
      >
        <span>{trip.status}</span>
      </div>

      <div className="trip-body">
        <h3>{trip.name}</h3>

        <p>
          <MapPin size={12} />
          {trip.location}
        </p>

        <small>{trip.dates}</small>
      </div>
    </NavLink>
  );
}

/* =========================================================
   PLANNER
========================================================= */

function Planner({
  trip,
  itinerary,
  deleteActivity,
  addActivity,
  notify,
}) {
  const [mode, setMode] = useState("timeline");
  const [addOpen, setAddOpen] = useState(false);

  const groups = useMemo(() => {
    return [1, 2, 3, 4, 5]
      .map((day) => ({
        day,
        items: itinerary.filter(
          (item) => item.day === day
        ),
      }))
      .filter((group) => group.items.length);
  }, [itinerary]);

  const exportJson = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            trip,
            itinerary,
          },
          null,
          2
        ),
      ],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tripos-itinerary.json";

    a.click();

    URL.revokeObjectURL(url);

    notify("Itinerary exported");
  };

  return (
    <>
      <PageHeader
        eyebrow="TRIP PLANNER"
        title={trip.name}
        desc="Build a realistic itinerary with route, timing and budget tools."
        action={
          <div className="header-actions">
            <button
              className="secondary"
              onClick={exportJson}
            >
              <Download size={15} />
              Export
            </button>

            <button
              className="primary"
              onClick={() => setAddOpen(true)}
            >
              <Plus size={15} />
              Add activity
            </button>
          </div>
        }
      />

      <div className="planner-toolbar">
        <div className="segments">
          <button
            className={
              mode === "timeline"
                ? "active"
                : ""
            }
            onClick={() =>
              setMode("timeline")
            }
          >
            <CalendarDays size={14} />
            Timeline
          </button>

          <button
            className={
              mode === "map" ? "active" : ""
            }
            onClick={() => setMode("map")}
          >
            <Map size={14} />
            Map
          </button>
        </div>

        <button
          className="secondary"
          onClick={() =>
            notify(
              `Route checked: ${itinerary.length} activities across ${
                new Set(
                  itinerary.map(
                    (item) => item.day
                  )
                ).size
              } days`
            )
          }
        >
          <Sparkles size={15} />
          Check route
        </button>
      </div>

      {mode === "map" ? (
        <FakeMap itinerary={itinerary} />
      ) : (
        <div className="planner-layout">
          <div>
            {groups.map((group) => (
              <Day
                key={group.day}
                group={group}
                deleteActivity={
                  deleteActivity
                }
              />
            ))}
          </div>

          <aside className="side-stack">
            <div className="card route-card">
              <div className="card-top">
                <div>
                  <span className="eyebrow">
                    ROUTE HEALTH
                  </span>

                  <h3>92 / 100</h3>
                </div>

                <ShieldCheck size={21} />
              </div>

              <p>
                Your plan has good pacing with
                minimal backtracking.
              </p>

              <div className="health">
                <span
                  style={{
                    width: "92%",
                  }}
                />
              </div>

              <div className="mini-row">
                <span>Travel time</span>
                <b>2h 10m</b>
              </div>

              <div className="mini-row">
                <span>Open buffers</span>
                <b>3</b>
              </div>
            </div>

            <div className="card">
              <div className="card-top">
                <h3>Smart tools</h3>
                <Sparkles size={17} />
              </div>

              <button
                className="action-row"
                onClick={() =>
                  notify(
                    `Route checked: ${itinerary.length} activities are scheduled.`
                  )
                }
              >
                <Sparkles size={15} />

                <span>
                  <b>Check route</b>
                  <small>
                    Review travel between stops
                  </small>
                </span>

                <ChevronRight size={15} />
              </button>

              <button
                className="action-row"
                onClick={() =>
                  notify(
                    "Packing list prepared from your trip activities"
                  )
                }
              >
                <Check size={15} />

                <span>
                  <b>Build packing list</b>
                  <small>
                    Based on your activities
                  </small>
                </span>

                <ChevronRight size={15} />
              </button>
            </div>
          </aside>
        </div>
      )}

      {addOpen && (
        <ActivityModal
          close={() => setAddOpen(false)}
          add={(data) => {
            addActivity(data);
            setAddOpen(false);
          }}
        />
      )}
    </>
  );
}

/* =========================================================
   DAY
========================================================= */

function Day({
  group,
  deleteActivity,
}) {
  const title =
    group.day === 1
      ? "Arrival & Panjim"
      : group.day === 2
      ? "North Goa"
      : "Slow Beach Day";

  return (
    <div className="day-card card">
      <div className="day-title">
        <div>
          <span className="day-chip">
            DAY {group.day}
          </span>

          <h3>{title}</h3>
        </div>

        <span>{group.items[0]?.date}</span>
      </div>

      <div className="timeline">
        {group.items.map((item) => {
          const Icon = iconFor(item.type);

          return (
            <div
              className="timeline-item"
              key={item.id}
            >
              <div className="time">
                {item.time}
              </div>

              <div className="activity">
                <div className="activity-icon">
                  <Icon size={15} />
                </div>

                <div className="activity-main">
                  <b>{item.title}</b>
                  <span>{item.meta}</span>
                </div>
              </div>

              <strong>
                {item.cost
                  ? money(item.cost)
                  : "Free"}
              </strong>

              <button
                className="delete"
                onClick={() =>
                  deleteActivity(item.id)
                }
                title="Remove"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   MAP
========================================================= */

function FakeMap({ itinerary }) {
  return (
    <div className="map-large">
      <div className="map-grid" />

      <div className="map-label">
        GOA · ROUTE PREVIEW
      </div>

      {itinerary.slice(0, 6).map((item, index) => (
        <div
          key={item.id}
          className="map-pin"
          style={{
            left: `${15 + index * 13}%`,
            top: `${62 - (index % 3) * 17}%`,
          }}
        >
          <span>{index + 1}</span>
        </div>
      ))}

      <div className="map-route" />
    </div>
  );
}

/* =========================================================
   ACTIVITY MODAL
========================================================= */

function ActivityModal({
  close,
  add,
}) {
  const [form, setForm] = useState({
    title: "",
    time: "12:00",
    type: "Experience",
    meta: "",
    cost: 0,
    day: 1,
    date: "18 Oct",
  });

  const update = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div className="modal-layer">
      <form
        className="modal"
        onSubmit={(event) => {
          event.preventDefault();
          add(form);
        }}
      >
        <div className="modal-head">
          <div>
            <span className="eyebrow">
              ITINERARY
            </span>

            <h2>Add activity</h2>
          </div>

          <button
            type="button"
            className="icon-btn"
            onClick={close}
          >
            <X size={17} />
          </button>
        </div>

        <div className="form-grid">
          <label>
            Activity name

            <input
              required
              value={form.title}
              onChange={(event) =>
                update(
                  "title",
                  event.target.value
                )
              }
              placeholder="e.g. Beach sunset"
            />
          </label>

          <label>
            Time

            <input
              type="time"
              value={form.time}
              onChange={(event) =>
                update(
                  "time",
                  event.target.value
                )
              }
            />
          </label>

          <label>
            Type

            <select
              value={form.type}
              onChange={(event) =>
                update(
                  "type",
                  event.target.value
                )
              }
            >
              <option>Experience</option>
              <option>Food</option>
              <option>Transport</option>
              <option>Stay</option>
              <option>Flight</option>
            </select>
          </label>

          <label>
            Day

            <select
              value={form.day}
              onChange={(event) =>
                update(
                  "day",
                  Number(event.target.value)
                )
              }
            >
              <option value="1">Day 1</option>
              <option value="2">Day 2</option>
              <option value="3">Day 3</option>
              <option value="4">Day 4</option>
              <option value="5">Day 5</option>
            </select>
          </label>

          <label className="wide">
            Notes

            <input
              value={form.meta}
              onChange={(event) =>
                update(
                  "meta",
                  event.target.value
                )
              }
              placeholder="Location, booking, duration…"
            />
          </label>

          <label>
            Cost

            <input
              type="number"
              min="0"
              value={form.cost}
              onChange={(event) =>
                update(
                  "cost",
                  event.target.value
                )
              }
            />
          </label>
        </div>

        <div className="modal-foot">
          <button
            type="button"
            className="secondary"
            onClick={close}
          >
            Cancel
          </button>

          <button className="primary">
            <Plus size={14} />
            Add activity
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================================================
   DISCOVER
========================================================= */

function Discover({
  favorites,
  setFavorites,
  notify,
}) {
  const places = [
    [
      "Kyoto",
      "Japan",
      "1493976040374-85c8e12f0c0e",
    ],
    [
      "Lisbon",
      "Portugal",
      "1555881400-74d7acaacd8b",
    ],
    [
      "Bali",
      "Indonesia",
      "1537996194471-e657df975ab4",
    ],
    [
      "Cape Town",
      "South Africa",
      "1580060839134-75a5edca2e99",
    ],
    [
      "Amalfi",
      "Italy",
      "1533105079780-92b9be482077",
    ],
    [
      "Istanbul",
      "Türkiye",
      "1524231757912-21f4fe3e703b",
    ],
  ];

  const toggle = (name) => {
    setFavorites((current) =>
      current.includes(name)
        ? current.filter(
            (item) => item !== name
          )
        : [...current, name]
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="DISCOVER"
        title="Find your next place."
        desc="Curated destinations you can save to your TripOS workspace."
        action={
          <button
            className="secondary"
            onClick={() =>
              notify(
                "Filters are ready for the next release"
              )
            }
          >
            <Filter size={15} />
            Filters
          </button>
        }
      />

      <div className="discover-grid">
        {places.map(
          ([name, country, imageId]) => (
            <article
              className="destination"
              key={name}
              style={{
                backgroundImage: `url(${img(
                  imageId
                )})`,
              }}
            >
              <div className="destination-top">
                <button
                  className={`heart ${
                    favorites.includes(name)
                      ? "saved"
                      : ""
                  }`}
                  onClick={() =>
                    toggle(name)
                  }
                >
                  {favorites.includes(name)
                    ? "♥"
                    : "♡"}
                </button>
              </div>

              <div className="destination-bottom">
                <span>{country}</span>

                <h3>{name}</h3>

                <div>
                  <Star
                    size={12}
                    fill="currentColor"
                  />
                  4.8

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        `${name}, ${country}`
                      );

                      notify(
                        `${name} copied`
                      );
                    }}
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                </div>
              </div>
            </article>
          )
        )}
      </div>
    </>
  );
}

/* =========================================================
   BUDGET
========================================================= */

function Budget({
  trip,
  expenses,
  openExpense,
  notify,
}) {
  const total = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount || 0),
    0
  );

  const cats = expenses.reduce(
    (result, expense) => {
      result[expense.category] =
        (result[expense.category] || 0) +
        Number(expense.amount || 0);

      return result;
    },
    {}
  );

  const budget = Number(trip.budget || 0);

  const percentage =
    budget > 0
      ? Math.min(100, (total / budget) * 100)
      : 0;

  return (
    <>
      <PageHeader
        eyebrow="MONEY CONTROL"
        title="Trip budget"
        desc="Keep spending visible before it becomes a surprise."
        action={
          <button
            className="primary"
            onClick={openExpense}
          >
            <Plus size={15} />
            Add expense
          </button>
        }
      />

      <div className="budget-layout">
        <div className="card">
          <div className="budget-big">
            <div>
              <span className="eyebrow">
                TOTAL SPENT
              </span>

              <h2>{money(total)}</h2>

              <p>
                of {money(budget)} planned
              </p>
            </div>

            <div
              className="ring"
              style={{
                "--p": `${percentage}%`,
              }}
            >
              <b>
                {Math.round(percentage)}%
              </b>
            </div>
          </div>

          <div className="budget-bar tall">
            <span
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>

          <div className="category-list">
            {Object.entries(cats).map(
              ([category, amount]) => (
                <div
                  className="cat-row"
                  key={category}
                >
                  <span>
                    <i className="cat-dot" />
                    {category}
                  </span>

                  <b>{money(amount)}</b>
                </div>
              )
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-top">
            <h3>Recent expenses</h3>
            <WalletCards size={17} />
          </div>

          <div className="expense-list">
            {expenses.map((expense) => (
              <div
                className="expense"
                key={expense.id}
              >
                <div className="expense-icon">
                  <CircleDollarSign
                    size={15}
                  />
                </div>

                <div>
                  <b>{expense.merchant}</b>

                  <span>
                    {expense.category} ·{" "}
                    {expense.date}
                  </span>
                </div>

                <strong>
                  {money(expense.amount)}
                </strong>
              </div>
            ))}
          </div>

          <button
            className="secondary full"
            onClick={() =>
              notify(
                "All transactions are already loaded"
              )
            }
          >
            View all transactions
          </button>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   EXPENSE MODAL
========================================================= */

function ExpenseModal({
  close,
  add,
}) {
  const [form, setForm] = useState({
    merchant: "",
    category: "Food",
    amount: "",
    date: "25 Sep 2026",
  });

  const update = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div className="modal-layer">
      <form
        className="modal"
        onSubmit={(event) => {
          event.preventDefault();
          add(form);
        }}
      >
        <div className="modal-head">
          <div>
            <span className="eyebrow">
              MONEY
            </span>

            <h2>Add expense</h2>
          </div>

          <button
            type="button"
            className="icon-btn"
            onClick={close}
          >
            <X size={17} />
          </button>
        </div>

        <div className="form-grid">
          <label>
            Merchant

            <input
              required
              value={form.merchant}
              onChange={(event) =>
                update(
                  "merchant",
                  event.target.value
                )
              }
              placeholder="e.g. Café"
            />
          </label>

          <label>
            Amount (₹)

            <input
              required
              type="number"
              min="0"
              value={form.amount}
              onChange={(event) =>
                update(
                  "amount",
                  event.target.value
                )
              }
            />
          </label>

          <label>
            Category

            <select
              value={form.category}
              onChange={(event) =>
                update(
                  "category",
                  event.target.value
                )
              }
            >
              <option>Food</option>
              <option>Stay</option>
              <option>Transport</option>
              <option>Experience</option>
              <option>Shopping</option>
            </select>
          </label>

          <label>
            Date

            <input
              value={form.date}
              onChange={(event) =>
                update(
                  "date",
                  event.target.value
                )
              }
            />
          </label>
        </div>

        <div className="modal-foot">
          <button
            type="button"
            className="secondary"
            onClick={close}
          >
            Cancel
          </button>

          <button className="primary">
            <Plus size={14} />
            Save expense
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage({
  theme,
  setTheme,
  notify,
}) {
  const [compact, setCompact] =
    useState(false);

  return (
    <>
      <PageHeader
        eyebrow="WORKSPACE"
        title="Settings"
        desc="Control your TripOS experience and preferences."
      />

      <div className="settings-list">
        <Setting
          title="Compact itinerary"
          desc="Reduce vertical spacing when reviewing long itineraries."
          on={compact}
          toggle={() =>
            setCompact(!compact)
          }
        />

        <Setting
          title="Dark interface"
          desc="Use the darker workspace theme."
          on={theme === "dark"}
          toggle={() =>
            setTheme(
              theme === "dark"
                ? "light"
                : "dark"
            )
          }
        />

        <div className="card danger-card">
          <div>
            <span className="eyebrow">
              LOCAL DATA
            </span>

            <h3>Reset workspace</h3>

            <p>
              Remove trips, expenses,
              favorites and preferences stored
              in this browser.
            </p>
          </div>

          <button
            className="danger"
            onClick={() => {
              localStorage.clear();
              location.reload();
            }}
          >
            <Trash2 size={14} />
            Reset data
          </button>
        </div>

        <button
          className="secondary"
          onClick={() =>
            notify(
              "TripOS is running locally — no database required"
            )
          }
        >
          <ShieldCheck size={15} />
          Check workspace status
        </button>
      </div>
    </>
  );
}

function Setting({
  title,
  desc,
  on,
  toggle,
}) {
  return (
    <div className="setting card">
      <div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>

      <button
        className={`toggle ${on ? "on" : ""}`}
        onClick={toggle}
      >
        <span />
      </button>
    </div>
  );
}

/* =========================================================
   SEARCH
========================================================= */

function SearchModal({ close }) {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const results = [
    ["Overview", "/"],
    ["Planner", "/planner"],
    ["Discover", "/discover"],
    ["Budget", "/budget"],
    ["Settings", "/settings"],
  ].filter(([name]) =>
    name
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="modal-layer">
      <div className="search-modal">
        <div className="search-input">
          <Search size={17} />

          <input
            autoFocus
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search TripOS…"
          />

          <kbd>ESC</kbd>

          <button onClick={close}>
            <X size={16} />
          </button>
        </div>

        <div className="search-results">
          {results.map(([name, path]) => (
            <button
              key={path}
              onClick={() => {
                navigate(path);
                close();
              }}
            >
              <Compass size={15} />

              <span>{name}</span>

              <ArrowRight size={14} />
            </button>
          ))}

          {!results.length && (
            <p>No matching workspace.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   AUTH MODAL
========================================================= */

function AuthModal({
  close,
  login,
}) {
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const update = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setError("");
  };

  const submit = (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    if (
      !form.email.includes("@") ||
      !form.email.includes(".")
    ) {
      setError("Please enter a valid email.");
      return;
    }

    if (form.password.length < 4) {
      setError(
        "Password must contain at least 4 characters."
      );
      return;
    }

    login({
      name:
        mode === "signup"
          ? form.name
          : form.email.split("@")[0],
      email: form.email,
    });
  };

  return (
    <div className="modal-layer">
      <form
        className="modal auth-modal"
        onSubmit={submit}
      >
        <div className="modal-head">
          <div>
            <div className="brand-mark auth-brand">
              <Compass size={18} />
            </div>

            <span className="eyebrow">
              TRIPOS ACCOUNT
            </span>

            <h2>
              {mode === "login"
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p>
              {mode === "login"
                ? "Log in to access your TripOS workspace."
                : "Create a local TripOS traveler account."}
            </p>
          </div>

          <button
            type="button"
            className="icon-btn"
            onClick={close}
          >
            <X size={17} />
          </button>
        </div>

        <div className="auth-form">
          {mode === "signup" && (
            <label>
              <span>
                <User size={14} />
                Full name
              </span>

              <input
                required
                value={form.name}
                onChange={(event) =>
                  update(
                    "name",
                    event.target.value
                  )
                }
                placeholder="Adhiraj Khubbar"
              />
            </label>
          )}

          <label>
            <span>
              <Mail size={14} />
              Email
            </span>

            <input
              required
              type="email"
              value={form.email}
              onChange={(event) =>
                update(
                  "email",
                  event.target.value
                )
              }
              placeholder="adhiraj@example.com"
            />
          </label>

          <label>
            <span>
              <Lock size={14} />
              Password
            </span>

            <input
              required
              type="password"
              value={form.password}
              onChange={(event) =>
                update(
                  "password",
                  event.target.value
                )
              }
              placeholder="••••••••"
            />
          </label>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            className="primary auth-submit"
            type="submit"
          >
            {mode === "login" ? (
              <>
                <LogIn size={15} />
                Login
              </>
            ) : (
              <>
                <UserPlus size={15} />
                Create account
              </>
            )}
          </button>
        </div>

        <div className="auth-switch">
          <span>
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>

          <button
            type="button"
            onClick={() =>
              setMode(
                mode === "login"
                  ? "signup"
                  : "login"
              )
            }
          >
            {mode === "login"
              ? "Create account"
              : "Login"}
          </button>
        </div>

        <small className="auth-note">
          Authentication is stored locally in your
          browser. This version does not use a
          server or database.
        </small>
      </form>
    </div>
  );
}

/* =========================================================
   PROFILE MODAL
========================================================= */

function ProfileModal({
  user,
  close,
  login,
  logout,
}) {
  if (!user) {
    return (
      <div className="modal-layer">
        <div className="modal profile-modal">
          <div className="modal-head">
            <div>
              <span className="eyebrow">
                TRIPOS ACCOUNT
              </span>

              <h2>You're not logged in</h2>

              <p>
                Login to access your traveler
                profile.
              </p>
            </div>

            <button
              className="icon-btn"
              onClick={close}
            >
              <X size={17} />
            </button>
          </div>

          <button
            className="primary full"
            onClick={login}
          >
            <LogIn size={15} />
            Login
          </button>
        </div>
      </div>
    );
  }

  const initials =
    user.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="modal-layer">
      <div className="modal profile-modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">
              MY PROFILE
            </span>

            <h2>Traveler account</h2>
          </div>

          <button
            className="icon-btn"
            onClick={close}
          >
            <X size={17} />
          </button>
        </div>

        <div className="profile-large">
          <div className="profile-large-avatar">
            {initials}
          </div>

          <div>
            <h3>{user.name}</h3>

            <p>{user.email}</p>

            <span>Traveler</span>
          </div>
        </div>

        <div className="profile-actions">
          <button
            className="action-row"
            onClick={() => {
              close();
            }}
          >
            <Pencil size={16} />

            <span>
              <b>Edit profile</b>
              <small>
                Profile editing can be connected
                later
              </small>
            </span>

            <ChevronRight size={15} />
          </button>

          <button
            className="action-row"
            onClick={() => {
              close();
              window.location.hash =
                "#settings";
            }}
          >
            <Settings size={16} />

            <span>
              <b>Account settings</b>
              <small>
                Manage your TripOS preferences
              </small>
            </span>

            <ChevronRight size={15} />
          </button>

          <button
            className="action-row logout-row"
            onClick={logout}
          >
            <LogOut size={16} />

            <span>
              <b>Logout</b>
              <small>
                Sign out from this browser
              </small>
            </span>

            <ChevronRight size={15} />
          </button>
        </div>

        <div className="modal-foot">
          <button
            className="secondary full"
            onClick={close}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   RENDER
========================================================= */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App/>
    </HashRouter>
  </React.StrictMode>
);