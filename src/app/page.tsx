"use client";

import { useMemo, useState } from "react";

type Role = "employer" | "candidate";

type Candidate = {
  id: string;
  name: string;
  initials: string;
  title: string;
  location: string;
  preference: string;
  availability: string;
  match: number;
  matchNote: string;
  expertise: string[];
  verified: boolean;
  attestation: string;
  contactConsent: string;
  contactMethods: string[];
  salaryRange: string;
  lastActive: string;
  highlight: string;
};

type IconName =
  | "alert"
  | "arrow"
  | "audit"
  | "boost"
  | "briefcase"
  | "candidate"
  | "check"
  | "chevron"
  | "contact"
  | "eye"
  | "filter"
  | "lock"
  | "message"
  | "profile"
  | "save"
  | "search"
  | "settings"
  | "shield"
  | "spark"
  | "star";

const expertiseOptions = [
  "Frontend Engineering",
  "Backend Systems",
  "Product Design",
  "Cloud Infrastructure",
  "Data Analytics",
  "Cybersecurity",
  "Healthcare Admin",
  "Sales Operations",
  "Customer Success",
  "AI Workflow",
  "Education Tech",
  "Finance Ops",
];

const candidates: Candidate[] = [
  {
    id: "aisha-patel",
    name: "Aisha Patel",
    initials: "AP",
    title: "Senior Frontend Engineer",
    location: "Austin, TX",
    preference: "Remote",
    availability: "Immediately",
    match: 96,
    matchNote: "5 of 5 expertise areas overlap",
    expertise: [
      "Frontend Engineering",
      "Backend Systems",
      "Product Design",
      "Cloud Infrastructure",
      "AI Workflow",
    ],
    verified: true,
    attestation: "Peer and portfolio attested",
    contactConsent: "Open to verified employer contact",
    contactMethods: ["Email", "InMail"],
    salaryRange: "$145k - $165k",
    lastActive: "Today",
    highlight: "Built hiring workflow dashboards and design systems at scale.",
  },
  {
    id: "david-okafor",
    name: "David Okafor",
    initials: "DO",
    title: "Backend Platform Engineer",
    location: "New York, NY",
    preference: "Remote",
    availability: "2 weeks notice",
    match: 91,
    matchNote: "Strong backend and cloud signal",
    expertise: [
      "Backend Systems",
      "Cloud Infrastructure",
      "Data Analytics",
      "Cybersecurity",
      "AI Workflow",
    ],
    verified: true,
    attestation: "Manager reference attested",
    contactConsent: "Open to verified employer contact",
    contactMethods: ["Email"],
    salaryRange: "$155k - $180k",
    lastActive: "Yesterday",
    highlight: "Owns API reliability, event pipelines, and internal developer platforms.",
  },
  {
    id: "maria-gomez",
    name: "Maria Gomez",
    initials: "MG",
    title: "Product Designer",
    location: "San Francisco, CA",
    preference: "Hybrid",
    availability: "4 weeks notice",
    match: 88,
    matchNote: "Excellent design and research overlap",
    expertise: [
      "Product Design",
      "Frontend Engineering",
      "Healthcare Admin",
      "Education Tech",
      "AI Workflow",
    ],
    verified: true,
    attestation: "Case studies attested",
    contactConsent: "Contact by intro request only",
    contactMethods: ["InMail"],
    salaryRange: "$135k - $155k",
    lastActive: "Today",
    highlight: "Turns complex regulated workflows into accessible product surfaces.",
  },
  {
    id: "jason-li",
    name: "Jason Li",
    initials: "JL",
    title: "Cloud Security Engineer",
    location: "Seattle, WA",
    preference: "Remote",
    availability: "Immediately",
    match: 84,
    matchNote: "Cloud, security, and data coverage",
    expertise: [
      "Cloud Infrastructure",
      "Cybersecurity",
      "Backend Systems",
      "Data Analytics",
      "Finance Ops",
    ],
    verified: true,
    attestation: "Certification and employer attested",
    contactConsent: "Open to verified employer contact",
    contactMethods: ["Email", "Calendar"],
    salaryRange: "$150k - $175k",
    lastActive: "3 days ago",
    highlight: "Secures cloud environments while keeping engineering velocity intact.",
  },
  {
    id: "priya-shah",
    name: "Priya Shah",
    initials: "PS",
    title: "Revenue Operations Analyst",
    location: "Chicago, IL",
    preference: "Remote",
    availability: "2 weeks notice",
    match: 80,
    matchNote: "Useful ops and analytics match",
    expertise: [
      "Sales Operations",
      "Data Analytics",
      "Customer Success",
      "Finance Ops",
      "AI Workflow",
    ],
    verified: false,
    attestation: "Self-attested, review pending",
    contactConsent: "Open to verified employer contact",
    contactMethods: ["Email"],
    salaryRange: "$105k - $125k",
    lastActive: "Today",
    highlight: "Automates pipeline reporting, territory planning, and handoff quality.",
  },
  {
    id: "noah-williams",
    name: "Noah Williams",
    initials: "NW",
    title: "Customer Success Lead",
    location: "Denver, CO",
    preference: "Hybrid",
    availability: "6 weeks notice",
    match: 76,
    matchNote: "Good customer and education coverage",
    expertise: [
      "Customer Success",
      "Education Tech",
      "Sales Operations",
      "Data Analytics",
      "AI Workflow",
    ],
    verified: true,
    attestation: "Employer and metrics attested",
    contactConsent: "Contact by intro request only",
    contactMethods: ["InMail"],
    salaryRange: "$120k - $140k",
    lastActive: "1 week ago",
    highlight: "Leads renewal playbooks for high-touch B2B implementation teams.",
  },
];

const complianceItems = [
  {
    icon: "shield" as const,
    title: "Employer verification",
    status: "Verified",
    body: "Only verified organizations can reveal contact options or send requests.",
  },
  {
    icon: "audit" as const,
    title: "Selection log",
    status: "Recording",
    body: "Search filters, profile views, shortlist actions, and contact requests are logged.",
  },
  {
    icon: "lock" as const,
    title: "Consent first",
    status: "Opt-in",
    body: "Candidates control discoverability, contact methods, and visibility to employers.",
  },
  {
    icon: "filter" as const,
    title: "Fair hiring guardrails",
    status: "Skill focused",
    body: "Search ranking stays tied to declared expertise, availability, and job-related signals.",
  },
];

const candidateChecklist = [
  "Basic information",
  "Resume and work history",
  "Five expertise areas",
  "Attestation review",
  "Visibility and contact consent",
];

export default function Home() {
  const [activeRole, setActiveRole] = useState<Role>("employer");
  const [query, setQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([
    "Frontend Engineering",
    "Backend Systems",
    "Product Design",
    "Cloud Infrastructure",
    "AI Workflow",
  ]);
  const [candidateExpertise, setCandidateExpertise] = useState<string[]>([
    "Frontend Engineering",
    "Backend Systems",
    "Product Design",
    "Cloud Infrastructure",
    "AI Workflow",
  ]);
  const [selectedCandidateId, setSelectedCandidateId] = useState("aisha-patel");
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([
    "aisha-patel",
    "jason-li",
  ]);
  const [profileBoosted, setProfileBoosted] = useState(false);

  const visibleCandidates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return candidates
      .filter((candidate) => {
        const matchesExpertise =
          selectedExpertise.length === 0 ||
          selectedExpertise.some((area) => candidate.expertise.includes(area));
        const searchable = [
          candidate.name,
          candidate.title,
          candidate.location,
          candidate.preference,
          ...candidate.expertise,
        ]
          .join(" ")
          .toLowerCase();

        return matchesExpertise && searchable.includes(normalizedQuery);
      })
      .sort((first, second) => second.match - first.match);
  }, [query, selectedExpertise]);

  const selectedCandidate =
    visibleCandidates.find((candidate) => candidate.id === selectedCandidateId) ??
    visibleCandidates[0] ??
    candidates[0];

  const profileCompleteness = profileBoosted ? 92 : 84;

  function toggleExpertise(area: string) {
    setSelectedExpertise((current) => {
      if (current.includes(area)) {
        return current.filter((item) => item !== area);
      }

      if (current.length >= 5) {
        return current;
      }

      return [...current, area];
    });
  }

  function toggleCandidateExpertise(area: string) {
    setCandidateExpertise((current) => {
      if (current.includes(area)) {
        return current.filter((item) => item !== area);
      }

      if (current.length >= 5) {
        return current;
      }

      return [...current, area];
    });
  }

  function toggleShortlist(id: string) {
    setShortlistedIds((current) =>
      current.includes(id)
        ? current.filter((candidateId) => candidateId !== id)
        : [...current, id],
    );
  }

  return (
    <main className="app">
      <aside className="sidebar" aria-label="Workspace navigation">
        <div className="brand">
          <span className="brand-mark">Y</span>
          <span>Yee</span>
        </div>

        <div className="role-switch" aria-label="Choose workspace role">
          <button
            className={activeRole === "employer" ? "active" : ""}
            type="button"
            onClick={() => setActiveRole("employer")}
          >
            <Icon name="briefcase" />
            Employer
          </button>
          <button
            className={activeRole === "candidate" ? "active" : ""}
            type="button"
            onClick={() => setActiveRole("candidate")}
          >
            <Icon name="candidate" />
            Candidate
          </button>
        </div>

        <nav className="nav-section" aria-label="Primary">
          <span className="nav-label">
            {activeRole === "employer"
              ? "Employer workspace"
              : "Candidate workspace"}
          </span>
          <NavItem active icon="search" label="Discover talent" />
          <NavItem icon="save" label="Shortlist" count={shortlistedIds.length} />
          <NavItem icon="message" label="Conversations" count={4} />
          <NavItem icon="alert" label="Talent alerts" />
          <NavItem icon="profile" label="Company profile" />
        </nav>

        <nav className="nav-section" aria-label="Candidate tools">
          <span className="nav-label">Profile tools</span>
          <NavItem icon="profile" label="My profile" />
          <NavItem icon="star" label="Expertise and skills" />
          <NavItem icon="eye" label="Visibility" />
          <NavItem icon="boost" label="Profile boost" />
        </nav>

        <div className="sidebar-footer">
          <NavItem icon="settings" label="Settings" />
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="search-wrap">
            <Icon name="search" />
            <input
              aria-label="Search candidates"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by skill, role, location, or keyword"
            />
          </div>
          <div className="topbar-actions">
            <button type="button" className="icon-button" aria-label="Alerts">
              <Icon name="alert" />
            </button>
            <button type="button" className="icon-button" aria-label="Messages">
              <Icon name="message" />
            </button>
            <div className="account">
              <span>RM</span>
              <div>
                <strong>Riley Morgan</strong>
                <small>Acme Corp</small>
              </div>
              <Icon name="chevron" />
            </div>
          </div>
        </header>

        <div className="content-grid">
          <section className="discovery" aria-labelledby="discovery-title">
            <div className="section-heading">
              <div>
                <h1 id="discovery-title">
                  {activeRole === "employer"
                    ? "Discover consented talent"
                    : "Tune your discoverable profile"}
                </h1>
                <p>
                  Employers search verified, opt-in profiles by job-related
                  expertise. Candidates stop repeating applications.
                </p>
              </div>
              <div className="heading-actions">
                <button type="button" className="button secondary">
                  <Icon name="save" />
                  Save search
                </button>
                <button type="button" className="button primary">
                  <Icon name="alert" />
                  Create alert
                </button>
              </div>
            </div>

            <div className="filter-panel" aria-label="Expertise filters">
              <div className="filter-header">
                <div>
                  <strong>Expertise areas</strong>
                  <span>{selectedExpertise.length}/5 selected</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedExpertise([])}
                  className="text-button"
                >
                  Clear all
                </button>
              </div>
              <div className="chip-grid">
                {expertiseOptions.map((area) => {
                  const selected = selectedExpertise.includes(area);
                  const disabled = !selected && selectedExpertise.length >= 5;

                  return (
                    <button
                      key={area}
                      type="button"
                      disabled={disabled}
                      className={`chip ${selected ? "selected" : ""}`}
                      onClick={() => toggleExpertise(area)}
                    >
                      {area}
                      {selected && <Icon name="check" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="list-toolbar">
              <span>
                Showing {visibleCandidates.length} of {candidates.length}{" "}
                profiles
              </span>
              <div>
                <button type="button" className="button secondary compact">
                  <Icon name="filter" />
                  More filters
                </button>
                <button type="button" className="button secondary compact">
                  Best match
                  <Icon name="chevron" />
                </button>
              </div>
            </div>

            <div className="candidate-list">
              {visibleCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  selected={candidate.id === selectedCandidate.id}
                  shortlisted={shortlistedIds.includes(candidate.id)}
                  selectedExpertise={selectedExpertise}
                  onSelect={() => setSelectedCandidateId(candidate.id)}
                  onShortlist={() => toggleShortlist(candidate.id)}
                />
              ))}
            </div>
          </section>

          <aside className="profile-rail" aria-label="Candidate profile setup">
            <SelectedProfile
              candidate={selectedCandidate}
              shortlisted={shortlistedIds.includes(selectedCandidate.id)}
              onShortlist={() => toggleShortlist(selectedCandidate.id)}
            />

            <section className="panel">
              <div className="panel-heading">
                <h2>Your candidate profile</h2>
                <a href="#profile-preview">Preview</a>
              </div>
              <div className="progress-row">
                <span>Profile completeness</span>
                <strong>{profileCompleteness}%</strong>
              </div>
              <div
                className="progress-bar"
                aria-label={`Profile ${profileCompleteness}% complete`}
              >
                <span style={{ width: `${profileCompleteness}%` }} />
              </div>
              <ul className="check-list">
                {candidateChecklist.map((item, index) => (
                  <li key={item}>
                    <Icon name={index < 4 ? "check" : "alert"} />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <h2>Attested expertise</h2>
                <span>{candidateExpertise.length}/5</span>
              </div>
              <div className="setup-chips">
                {expertiseOptions.slice(0, 10).map((area) => {
                  const selected = candidateExpertise.includes(area);
                  const disabled = !selected && candidateExpertise.length >= 5;

                  return (
                    <button
                      key={area}
                      type="button"
                      disabled={disabled}
                      className={selected ? "active" : ""}
                      onClick={() => toggleCandidateExpertise(area)}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="panel split">
              <div>
                <h2>Visibility and consent</h2>
                <p>Visible to verified employers only.</p>
              </div>
              <button type="button" className="button secondary compact">
                <Icon name="lock" />
                Edit
              </button>
            </section>

            <section className="panel boost-panel">
              <div>
                <h2>Profile boost</h2>
                <p>
                  Optional promotion for higher placement. No hire or interview
                  guarantee.
                </p>
              </div>
              <button
                type="button"
                className={profileBoosted ? "button success" : "button primary"}
                onClick={() => setProfileBoosted((current) => !current)}
              >
                <Icon name="spark" />
                {profileBoosted ? "Boost active" : "Boost profile"}
              </button>
            </section>
          </aside>

          <aside className="trust-rail" aria-label="Trust and compliance">
            <div className="rail-heading">
              <h2>Trust controls</h2>
              <p>Built before ranking or outreach becomes automatic.</p>
            </div>
            {complianceItems.map((item) => (
              <article key={item.title} className="trust-card">
                <div className="trust-icon">
                  <Icon name={item.icon} />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <strong>{item.status}</strong>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
            <section className="policy-note">
              <h3>Product rule</h3>
              <p>
                Boosting can improve placement only inside consented searches.
                It must never claim bias-free outcomes without evidence.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function CandidateCard({
  candidate,
  selected,
  shortlisted,
  selectedExpertise,
  onSelect,
  onShortlist,
}: {
  candidate: Candidate;
  selected: boolean;
  shortlisted: boolean;
  selectedExpertise: string[];
  onSelect: () => void;
  onShortlist: () => void;
}) {
  const overlap = candidate.expertise.filter((area) =>
    selectedExpertise.includes(area),
  );

  return (
    <article className={`candidate-card ${selected ? "selected" : ""}`}>
      <button
        type="button"
        className="candidate-main"
        onClick={onSelect}
        aria-label={`View ${candidate.name}`}
      >
        <Avatar initials={candidate.initials} verified={candidate.verified} />
        <div className="candidate-copy">
          <div className="candidate-name">
            <h2>{candidate.name}</h2>
            {candidate.verified && <Icon name="shield" />}
          </div>
          <p>{candidate.title}</p>
          <span>
            {candidate.location} · {candidate.preference}
          </span>
        </div>
      </button>

      <div className="match-block">
        <strong>Match {candidate.match}%</strong>
        <div className="mini-meter">
          <span style={{ width: `${candidate.match}%` }} />
        </div>
        <small>{candidate.matchNote}</small>
      </div>

      <div className="skills-wrap">
        {(overlap.length > 0 ? overlap : candidate.expertise.slice(0, 3)).map(
          (area) => (
            <span key={area}>{area}</span>
          ),
        )}
      </div>

      <div className="status-wrap">
        <span>
          <Icon name="check" />
          {candidate.availability}
        </span>
        <span>
          <Icon name="lock" />
          {candidate.contactConsent}
        </span>
      </div>

      <div className="card-actions">
        <button type="button" className="button primary compact" onClick={onSelect}>
          View
        </button>
        <button
          type="button"
          className="button secondary compact"
          onClick={onShortlist}
        >
          <Icon name="save" />
          {shortlisted ? "Saved" : "Save"}
        </button>
      </div>
    </article>
  );
}

function SelectedProfile({
  candidate,
  shortlisted,
  onShortlist,
}: {
  candidate: Candidate;
  shortlisted: boolean;
  onShortlist: () => void;
}) {
  return (
    <section className="selected-profile" id="profile-preview">
      <div className="selected-head">
        <Avatar initials={candidate.initials} verified={candidate.verified} />
        <div>
          <h2>{candidate.name}</h2>
          <p>{candidate.title}</p>
        </div>
      </div>
      <p>{candidate.highlight}</p>
      <dl>
        <div>
          <dt>Availability</dt>
          <dd>{candidate.availability}</dd>
        </div>
        <div>
          <dt>Preferred range</dt>
          <dd>{candidate.salaryRange}</dd>
        </div>
        <div>
          <dt>Attestation</dt>
          <dd>{candidate.attestation}</dd>
        </div>
        <div>
          <dt>Last active</dt>
          <dd>{candidate.lastActive}</dd>
        </div>
      </dl>
      <div className="selected-actions">
        <button type="button" className="button primary">
          <Icon name="contact" />
          Request intro
        </button>
        <button type="button" className="button secondary" onClick={onShortlist}>
          <Icon name="save" />
          {shortlisted ? "Saved" : "Save"}
        </button>
      </div>
    </section>
  );
}

function Avatar({
  initials,
  verified,
}: {
  initials: string;
  verified: boolean;
}) {
  return (
    <div className="avatar" aria-hidden="true">
      <span>{initials}</span>
      {verified && <i />}
    </div>
  );
}

function NavItem({
  active = false,
  count,
  icon,
  label,
}: {
  active?: boolean;
  count?: number;
  icon: IconName;
  label: string;
}) {
  return (
    <a className={`nav-item ${active ? "active" : ""}`} href="#">
      <Icon name={icon} />
      <span>{label}</span>
      {typeof count === "number" && <em>{count}</em>}
    </a>
  );
}

function Icon({ name }: { name: IconName }) {
  const common = {
    "aria-hidden": true,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "alert":
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    case "audit":
      return (
        <svg {...common}>
          <path d="M8 4h8" />
          <path d="M9 2h6v4H9z" />
          <path d="M7 4H5a2 2 0 0 0-2 2v14h18V6a2 2 0 0 0-2-2h-2" />
          <path d="M8 12h8" />
          <path d="M8 16h5" />
        </svg>
      );
    case "boost":
    case "spark":
      return (
        <svg {...common}>
          <path d="m13 2-2 7h6l-6 13 2-9H7z" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...common}>
          <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
          <rect x="3" y="6" width="18" height="14" rx="2" />
          <path d="M3 12h18" />
        </svg>
      );
    case "candidate":
    case "profile":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...common}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case "contact":
      return (
        <svg {...common}>
          <path d="M22 2 11 13" />
          <path d="m22 2-7 20-4-9-9-4z" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common}>
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "filter":
      return (
        <svg {...common}>
          <path d="M4 6h16" />
          <path d="M7 12h10" />
          <path d="M10 18h4" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="4" y="10" width="16" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "message":
      return (
        <svg {...common}>
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      );
    case "save":
      return (
        <svg {...common}>
          <path d="M6 3h12v18l-6-4-6 4z" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1.1 1.65V21a2 2 0 1 1-4 0v-.09A1.8 1.8 0 0 0 8.7 19.3a1.8 1.8 0 0 0-2 .36l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.8 1.8 0 0 0 .36-2 1.8 1.8 0 0 0-1.65-1.1H2.5a2 2 0 1 1 0-4h.09A1.8 1.8 0 0 0 4.2 8.7a1.8 1.8 0 0 0-.36-2l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.8 1.8 0 0 0 2 .36h.05A1.8 1.8 0 0 0 9.8 2.5V2a2 2 0 1 1 4 0v.09a1.8 1.8 0 0 0 1.1 1.65 1.8 1.8 0 0 0 2-.36l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.8 1.8 0 0 0-.36 2v.05a1.8 1.8 0 0 0 1.65 1.1H21a2 2 0 1 1 0 4h-.09A1.8 1.8 0 0 0 19.4 15z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-5" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
