
import {
  CalendarDays,
  Users,
  Trophy,
  Clock3,
  Swords,
  ArrowRight,
  Radio,
  ExternalLink,
  Crown,
} from "lucide-react";

import { Link } from "react-router-dom";
import { tournament } from "../data/tournament";

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-content">
          <div className="eyebrow">
            PYF × 5SD · VALORANT TOURNAMENT 2026
          </div>

          <h1>
            THE ROAD TO
            <br />
            <span className="gradient-text">CHAMPIONSHIP</span>
          </h1>

          <p className="hero-description">
            30 teams. Two divisions. Two champions.
            Three days of competitive VALORANT.
          </p>

          <div className="hero-date">
            <CalendarDays size={17} />
            OCTOBER 23–25, 2026
          </div>

          <div className="hero-actions">
            <Link to="/schedule" className="btn btn-primary">
              View Schedule <ArrowRight size={17} />
            </Link>

            <Link to="/teams" className="btn btn-secondary">
              Explore Teams
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container">
        <div className="stats-grid">
          <div className="stat-card">
            <Users className="stat-icon coral" />
            <strong className="coral">30</strong>
            <span>COMPETING TEAMS</span>
          </div>

          <div className="stat-card">
            <Swords className="stat-icon blue" />
            <strong className="blue">2</strong>
            <span>DIVISIONS</span>
          </div>

          <div className="stat-card">
            <Trophy className="stat-icon gold" />
            <strong className="gold">2</strong>
            <span>CHAMPIONS</span>
          </div>

          <div className="stat-card">
            <Crown className="stat-icon purple" />
            <strong className="purple">$125</strong>
            <span>PRIZE PER WINNING TEAM</span>
          </div>
        </div>
      </section>

      {/* DIVISIONS */}
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="section-label">THE COMPETITION</p>
            <h2>Two Divisions. Two Titles.</h2>
          </div>
          <Link to="/teams" className="text-link">
            View all teams <ArrowRight size={16} />
          </Link>
        </div>

        <div className="division-grid">
          {tournament.divisions.map((division) => (
            <div
              className={`division-card ${division.id}`}
              key={division.id}
            >
              <div className="division-top">
                <span>{division.name}</span>
                <Users size={22} />
              </div>

              <div className="division-count">
                {division.teams}
                <span> TEAMS</span>
              </div>

              <p>{division.description}</p>

              <div className="division-detail">
                <Trophy size={17} />
                Top {division.playoffTeams} qualify for playoffs
              </div>

              <Link to="/teams" className="division-link">
                Explore division <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FORMAT */}
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="section-label">HOW IT WORKS</p>
            <h2>Tournament Format</h2>
          </div>
        </div>

        <div className="format-grid">
          <div className="info-card">
            <Swords className="coral" size={28} />
            <h3>Round Robin</h3>
            <p>
              Every team plays three guaranteed
              Best of 1 (BO1) matches.
            </p>
          </div>

          <div className="info-card">
            <Trophy className="blue" size={28} />
            <h3>Playoffs</h3>
            <p>
              The top eight teams in each division
              advance to the knockout stage.
              Quarterfinals and semifinals are BO1.
            </p>
          </div>

          <div className="info-card">
            <Crown className="gold" size={28} />
            <h3>Grand Finals</h3>
            <p>
              The final two teams compete in a
              Best of 3 (BO3) to determine
              their division champion.
            </p>
          </div>
        </div>

        <div className="notice">
          Playoff matchups are reseeded after each round
          based on standings.
        </div>
      </section>

      {/* EVENT TIMELINE */}
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="section-label">THREE DAYS OF ACTION</p>
            <h2>Event Timeline</h2>
          </div>
          <Link to="/schedule" className="text-link">
            Full schedule <ArrowRight size={16} />
          </Link>
        </div>

        <div className="timeline">
          {tournament.schedule.map((day, index) => (
            <div className="timeline-item" key={day.date}>
              <div className="timeline-date">
                <span>{day.day}</span>
                <strong className={`day-color-${index}`}>
                  {day.date}
                </strong>
              </div>

              <div className="timeline-stage">
                <span>EVENT STAGE</span>
                <h3>{day.stage}</h3>
              </div>
            </div>
          ))}
        </div>

        <p className="timezone-note">
          <Clock3 size={15} />
          All match times are Eastern Time (ET).
        </p>
      </section>

      {/* STREAMS */}
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="section-label">WATCH LIVE</p>
            <h2>Official Streams</h2>
          </div>
        </div>

        <div className="streams-grid">
          {tournament.streams.map((stream) => (
            <a
              key={stream.name}
              href={stream.url}
              target="_blank"
              rel="noopener noreferrer"
              className="stream-card"
            >
              <div className="stream-icon">
                <Radio size={23} />
              </div>

              <div className="stream-info">
                <strong>{stream.name}</strong>
                <span>{stream.stage}</span>
              </div>

              <ExternalLink size={17} className="stream-arrow" />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
