
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";

import {
  LayoutDashboard,
  Swords,
  Users,
  Trophy,
  LogOut,
  CalendarDays,
  ShieldCheck,
  ArrowUpRight,
  ChevronRight,
  FlaskConical,
} from "lucide-react";

import { auth, db } from "../../firebase";
import { teams } from "../../data/teams";
import { matches } from "../../data/matches";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [savedResults, setSavedResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "matches"),
      (snapshot) => {
        const results = {};

        snapshot.forEach((document) => {
          results[document.id] = document.data();
        });

        setSavedResults(results);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading match results:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const upperTeams = teams.filter(
    (team) => team.division === "upper"
  ).length;

  const lowerTeams = teams.filter(
    (team) => team.division === "lower"
  ).length;

  const completedMatches = matches.filter((match) => {
    const saved = savedResults[match.id];

    return saved
      ? saved.status === "completed"
      : match.status === "completed";
  }).length;

  const scheduledMatches = matches.length - completedMatches;

  const stats = [
    {
      title: "Total Teams",
      value: teams.length,
      subtitle: `${upperTeams} Upper · ${lowerTeams} Lower`,
      icon: Users,
    },
    {
      title: "Scheduled Matches",
      value: loading ? "..." : scheduledMatches,
      subtitle: "Matches awaiting results",
      icon: CalendarDays,
    },
    {
      title: "Completed Matches",
      value: loading ? "..." : completedMatches,
      subtitle: "Results recorded",
      icon: Swords,
    },
    {
      title: "Divisions",
      value: 2,
      subtitle: "Upper & Lower",
      icon: Trophy,
    },
  ];

  const openManagement = (path) => {
    navigate(path);
  };

  const handleManagementKeyDown = (event, path) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      openManagement(path);
    }
  };

  return (
    <main className="container admin-dashboard">
      {/* DASHBOARD HEADER */}
      <div className="admin-dashboard-top">
        <div>
          <p className="admin-eyebrow">
            <ShieldCheck size={14} />
            AUTHORIZED ADMINISTRATOR
          </p>

          <h1>
            ADMIN <span>DASHBOARD</span>
          </h1>

          <p>
            Manage your PYF × 5SD tournament.
          </p>
        </div>

        <button
          type="button"
          className="admin-logout"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>

      {/* TOURNAMENT STATISTICS */}
      <div className="admin-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              className="admin-stat-card"
              key={stat.title}
            >
              <div className="admin-stat-icon">
                <Icon size={21} />
              </div>

              <p>{stat.title}</p>

              <strong>{stat.value}</strong>

              <span>{stat.subtitle}</span>
            </div>
          );
        })}
      </div>

      {/* MANAGEMENT HEADER */}
      <div className="admin-section-heading">
        <LayoutDashboard size={20} />
        <h2>Management</h2>
      </div>

      {/* MANAGEMENT CARDS */}
      <div className="admin-management-grid">
        {/* MATCH MANAGEMENT */}
        <div
          className="admin-management-card admin-management-clickable"
          onClick={() => openManagement("/admin/matches")}
          role="link"
          tabIndex={0}
          onKeyDown={(event) =>
            handleManagementKeyDown(event, "/admin/matches")
          }
        >
          <div className="admin-management-icon">
            <Swords size={24} />
          </div>

          <h3>Match Results</h3>

          <p>
            Enter VALORANT match scores, round scores,
            overtime results, and update match statuses.
          </p>

          <div className="admin-management-footer">
            <span className="admin-management-active">
              OPEN MANAGEMENT
            </span>

            <ChevronRight size={18} />
          </div>
        </div>

        {/* TEAM MANAGEMENT */}
        <div
          className="admin-management-card admin-management-clickable"
          onClick={() => openManagement("/admin/teams")}
          role="link"
          tabIndex={0}
          onKeyDown={(event) =>
            handleManagementKeyDown(event, "/admin/teams")
          }
        >
          <div className="admin-management-icon">
            <Users size={24} />
          </div>

          <h3>Team Management</h3>

          <p>
            Edit player rosters, add substitutes,
            remove players, and manage team lineups.
          </p>

          <div className="admin-management-footer">
            <span className="admin-management-active">
              OPEN MANAGEMENT
            </span>

            <ChevronRight size={18} />
          </div>
        </div>

        {/* STANDINGS & PLAYOFFS MANAGEMENT */}
        <div
          className="admin-management-card admin-management-clickable"
          onClick={() => openManagement("/admin/standings")}
          role="link"
          tabIndex={0}
          onKeyDown={(event) =>
            handleManagementKeyDown(event, "/admin/standings")
          }
        >
          <div className="admin-management-icon">
            <Trophy size={24} />
          </div>

          <h3>Standings & Playoffs</h3>

          <p>
            Review qualification positions,
            manage playoff seeding, update brackets,
            and advance winning teams.
          </p>

          <div className="admin-management-footer">
            <span className="admin-management-active">
              OPEN MANAGEMENT
            </span>

            <ChevronRight size={18} />
          </div>
        </div>

        {/* TOURNAMENT SIMULATOR */}
        <div
          className="admin-management-card admin-management-clickable"
          onClick={() => openManagement("/admin/simulator")}
          role="link"
          tabIndex={0}
          onKeyDown={(event) =>
            handleManagementKeyDown(event, "/admin/simulator")
          }
        >
          <div className="admin-management-icon">
            <FlaskConical size={24} />
          </div>

          <h3>Tournament Simulator</h3>

          <p>
            Simulate all tournament results, standings,
            playoff brackets, and champions without
            modifying Firebase.
          </p>

          <div className="admin-management-footer">
            <span className="admin-management-active">
              OPEN SIMULATOR
            </span>

            <ChevronRight size={18} />
          </div>
        </div>
      </div>

      {/* FIREBASE NOTE */}
      <div className="admin-dashboard-note">
        <ArrowUpRight size={18} />

        <p>
          Match results, player rosters, and playoff
          assignments are managed through Firebase
          Firestore. Changes saved in the admin panel
          appear on the public website.
        </p>
      </div>
    </main>
  );
}
