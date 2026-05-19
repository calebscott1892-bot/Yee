"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Role = "employer" | "candidate";

type Evidence = {
  label: string;
  source: string;
  status: "Verified" | "Reviewing" | "Self-attested";
};

type Candidate = {
  id: string;
  name: string;
  initials: string;
  title: string;
  location: string;
  workMode: string;
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
  preferences: string[];
  evidence: Evidence[];
  auditNote: string;
};

type IntroStatus = "Pending candidate" | "Accepted" | "Declined";

type IntroRequest = {
  id: string;
  candidateId: string;
  candidateName: string;
  roleTitle: string;
  workMode: string;
  compensation: string;
  message: string;
  status: IntroStatus;
  sentAt: string;
  audit: string;
};

type IntroForm = {
  compensation: string;
  message: string;
  roleTitle: string;
  workMode: string;
};

type CandidateProfile = {
  name: string;
  title: string;
  location: string;
  workMode: string;
  availability: string;
  salaryRange: string;
  visibility: "Visible" | "Paused";
  contactConsent: "Intro requests" | "Hidden";
  resumeStatus: "Reviewing" | "Verified" | "Needs evidence";
  summary: string;
};

type ChecklistItem = {
  complete: boolean;
  label: string;
};

type StoredYeeState = {
  version: 1;
  activeRole: Role;
  candidateExpertise: string[];
  candidateProfile: CandidateProfile;
  employerVerified: boolean;
  introForm: IntroForm;
  introRequests: IntroRequest[];
  profileBoosted: boolean;
  selectedCandidateId: string;
  selectedExpertise: string[];
  shortlistedIds: string[];
};

type IconName =
  | "alert"
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

const STORAGE_KEY = "yee.prototype.state.v1";

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

const defaultSelectedExpertise = [
  "Frontend Engineering",
  "Backend Systems",
  "Product Design",
  "Cloud Infrastructure",
  "AI Workflow",
];

const defaultIntroForm: IntroForm = {
  compensation: "$145k - $165k",
  message:
    "We are building a high-trust hiring workflow and your profile matches the product engineering scope we need.",
  roleTitle: "Senior Product Engineer",
  workMode: "Remote",
};

const defaultCandidateProfile: CandidateProfile = {
  availability: "2 weeks notice",
  contactConsent: "Intro requests",
  location: "Remote, US",
  name: "Jordan Hayes",
  resumeStatus: "Reviewing",
  salaryRange: "$120k - $145k",
  summary:
    "Operations-minded product generalist with experience turning messy workflows into calm internal tools.",
  title: "Product Operations Specialist",
  visibility: "Visible",
  workMode: "Remote",
};

const candidates: Candidate[] = [
  {
    id: "aisha-patel",
    name: "Aisha Patel",
    initials: "AP",
    title: "Senior Frontend Engineer",
    location: "Austin, TX",
    workMode: "Remote",
    availability: "Immediately",
    match: 96,
    matchNote: "5 of 5 selected areas overlap",
    expertise: [
      "Frontend Engineering",
      "Backend Systems",
      "Product Design",
      "Cloud Infrastructure",
      "AI Workflow",
    ],
    verified: true,
    attestation: "Peer and portfolio attested",
    contactConsent: "Open to verified employer intro requests",
    contactMethods: ["Email relay", "In-app message"],
    salaryRange: "$145k - $165k",
    lastActive: "Today",
    highlight:
      "Built hiring workflow dashboards, accessibility systems, and AI-assisted admin tools for high-volume operations teams.",
    preferences: [
      "Remote-first product team",
      "Design systems ownership",
      "Clear compensation range before intro",
    ],
    evidence: [
      {
        label: "Portfolio walkthrough",
        source: "Reviewed by Yee moderation",
        status: "Verified",
      },
      {
        label: "Frontend architecture sample",
        source: "Candidate supplied work sample",
        status: "Verified",
      },
      {
        label: "Peer reference",
        source: "Former design lead",
        status: "Verified",
      },
    ],
    auditNote:
      "Profile viewed from saved search: Frontend, Backend, Product Design, Cloud, AI Workflow.",
  },
  {
    id: "david-okafor",
    name: "David Okafor",
    initials: "DO",
    title: "Backend Platform Engineer",
    location: "New York, NY",
    workMode: "Remote",
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
    contactConsent: "Open to verified employer intro requests",
    contactMethods: ["Email relay"],
    salaryRange: "$155k - $180k",
    lastActive: "Yesterday",
    highlight:
      "Owns API reliability, event pipelines, and internal developer platforms for compliance-heavy products.",
    preferences: [
      "Platform or infra team",
      "Remote with quarterly onsite",
      "Senior IC path",
    ],
    evidence: [
      {
        label: "Reliability case study",
        source: "Former employer summary",
        status: "Verified",
      },
      {
        label: "Systems design interview",
        source: "Yee attestation session",
        status: "Verified",
      },
      {
        label: "Security training",
        source: "Candidate credential",
        status: "Reviewing",
      },
    ],
    auditNote:
      "Search used job-related filters only: Backend Systems, Cloud Infrastructure, Cybersecurity.",
  },
  {
    id: "maria-gomez",
    name: "Maria Gomez",
    initials: "MG",
    title: "Product Designer",
    location: "San Francisco, CA",
    workMode: "Hybrid",
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
    contactConsent: "Intro request only",
    contactMethods: ["In-app message"],
    salaryRange: "$135k - $155k",
    lastActive: "Today",
    highlight:
      "Turns complex regulated workflows into accessible product surfaces for clinical and education teams.",
    preferences: [
      "Hybrid Bay Area role",
      "Research access",
      "0-to-1 product scope",
    ],
    evidence: [
      {
        label: "Healthcare workflow case study",
        source: "Yee portfolio review",
        status: "Verified",
      },
      {
        label: "Design systems sample",
        source: "Candidate supplied work sample",
        status: "Verified",
      },
      {
        label: "Research plan",
        source: "Self-submitted",
        status: "Self-attested",
      },
    ],
    auditNote:
      "Contact requires candidate acceptance before any direct channel is released.",
  },
  {
    id: "jason-li",
    name: "Jason Li",
    initials: "JL",
    title: "Cloud Security Engineer",
    location: "Seattle, WA",
    workMode: "Remote",
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
    contactConsent: "Open to verified employer intro requests",
    contactMethods: ["Email relay", "Calendar request"],
    salaryRange: "$150k - $175k",
    lastActive: "3 days ago",
    highlight:
      "Secures cloud environments while keeping developer experience and deployment velocity intact.",
    preferences: [
      "Security engineering team",
      "AWS-heavy environment",
      "Incident response rotation capped",
    ],
    evidence: [
      {
        label: "Cloud security credential",
        source: "Credential provider",
        status: "Verified",
      },
      {
        label: "Threat model sample",
        source: "Yee review",
        status: "Verified",
      },
      {
        label: "Employer reference",
        source: "Former security director",
        status: "Verified",
      },
    ],
    auditNote:
      "Employer sees contact relay only until candidate accepts the intro request.",
  },
  {
    id: "priya-shah",
    name: "Priya Shah",
    initials: "PS",
    title: "Revenue Operations Analyst",
    location: "Chicago, IL",
    workMode: "Remote",
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
    contactConsent: "Open to verified employer intro requests",
    contactMethods: ["Email relay"],
    salaryRange: "$105k - $125k",
    lastActive: "Today",
    highlight:
      "Automates pipeline reporting, territory planning, and customer handoff quality for growth teams.",
    preferences: [
      "Revenue operations remit",
      "Manager path available",
      "Remote Central time overlap",
    ],
    evidence: [
      {
        label: "Dashboard sample",
        source: "Candidate supplied work sample",
        status: "Reviewing",
      },
      {
        label: "Pipeline automation summary",
        source: "Self-submitted",
        status: "Self-attested",
      },
    ],
    auditNote:
      "Pending attestation is visible to employers and should affect trust display, not eligibility.",
  },
];

export default function Home() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [activeRole, setActiveRole] = useState<Role>("employer");
  const [query, setQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>(
    defaultSelectedExpertise,
  );
  const [candidateExpertise, setCandidateExpertise] = useState<string[]>(
    defaultSelectedExpertise,
  );
  const [selectedCandidateId, setSelectedCandidateId] = useState("aisha-patel");
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([
    "aisha-patel",
    "jason-li",
  ]);
  const [employerVerified, setEmployerVerified] = useState(true);
  const [profileBoosted, setProfileBoosted] = useState(false);
  const [introRequests, setIntroRequests] = useState<IntroRequest[]>([]);
  const [introForm, setIntroForm] = useState<IntroForm>(defaultIntroForm);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(
    defaultCandidateProfile,
  );

  useEffect(() => {
    const hydrationId = window.setTimeout(() => {
      const storedState = readStoredState();

      if (storedState) {
        setActiveRole(
          storedState.activeRole === "candidate" ? "candidate" : "employer",
        );
        setCandidateExpertise(limitedExpertise(storedState.candidateExpertise));
        setCandidateProfile({
          ...defaultCandidateProfile,
          ...storedState.candidateProfile,
        });
        setEmployerVerified(storedState.employerVerified !== false);
        setIntroForm({ ...defaultIntroForm, ...storedState.introForm });
        setIntroRequests(
          Array.isArray(storedState.introRequests)
            ? storedState.introRequests
            : [],
        );
        setProfileBoosted(Boolean(storedState.profileBoosted));
        const storedCandidateId = storedState.selectedCandidateId;
        const nextSelectedCandidateId =
          typeof storedCandidateId === "string" &&
          candidates.some((candidate) => candidate.id === storedCandidateId)
            ? storedCandidateId
            : "aisha-patel";
        setSelectedCandidateId(nextSelectedCandidateId);
        setSelectedExpertise(limitedExpertise(storedState.selectedExpertise));
        setShortlistedIds(
          Array.isArray(storedState.shortlistedIds)
            ? storedState.shortlistedIds.filter((id) =>
                candidates.some((candidate) => candidate.id === id),
              )
            : ["aisha-patel", "jason-li"],
        );
      }

      setHasHydrated(true);
    }, 0);

    return () => window.clearTimeout(hydrationId);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    writeStoredState({
      activeRole,
      candidateExpertise,
      candidateProfile,
      employerVerified,
      introForm,
      introRequests,
      profileBoosted,
      selectedCandidateId,
      selectedExpertise,
      shortlistedIds,
      version: 1,
    });
  }, [
    activeRole,
    candidateExpertise,
    candidateProfile,
    employerVerified,
    hasHydrated,
    introForm,
    introRequests,
    profileBoosted,
    selectedCandidateId,
    selectedExpertise,
    shortlistedIds,
  ]);

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
          candidate.workMode,
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
  const selectedIntroRequest = introRequests.find(
    (request) => request.candidateId === selectedCandidate.id,
  );
  const candidateReadiness: ChecklistItem[] = [
    {
      complete: candidateProfile.visibility === "Visible",
      label: "Profile visibility is on",
    },
    {
      complete: candidateExpertise.length === 5,
      label: `${candidateExpertise.length}/5 expertise areas selected`,
    },
    {
      complete: candidateProfile.contactConsent !== "Hidden",
      label: "Contact consent configured",
    },
    {
      complete: candidateProfile.resumeStatus === "Verified",
      label: `Attestation ${candidateProfile.resumeStatus.toLowerCase()}`,
    },
  ];
  const employerReadiness: ChecklistItem[] = [
    {
      complete: employerVerified,
      label: "Business identity verified",
    },
    {
      complete: true,
      label: "Candidate contact stays relayed",
    },
    {
      complete: true,
      label: "All intro activity is logged",
    },
    {
      complete: true,
      label: "Candidate acceptance required",
    },
  ];
  const sidebarChecklist =
    activeRole === "employer" ? employerReadiness : candidateReadiness;
  const readinessCount = sidebarChecklist.filter((item) => item.complete).length;
  const storageLabel = hasHydrated ? "Saved locally" : "Loading workspace";

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

  function selectCandidate(candidateId: string) {
    setSelectedCandidateId(candidateId);
  }

  function updateCandidateProfile<Field extends keyof CandidateProfile>(
    field: Field,
    value: CandidateProfile[Field],
  ) {
    setCandidateProfile((current) => ({ ...current, [field]: value }));
  }

  function scrollToProfilePreview() {
    document
      .querySelector(".profile-drawer")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function submitIntro(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!employerVerified) {
      return;
    }

    const request: IntroRequest = {
      id: `intro-${selectedCandidate.id}`,
      candidateId: selectedCandidate.id,
      candidateName: selectedCandidate.name,
      roleTitle: introForm.roleTitle,
      workMode: introForm.workMode,
      compensation: introForm.compensation,
      message: introForm.message,
      status: "Pending candidate",
      sentAt: "Just now",
      audit:
        "Request logged with role, range, work mode, and relayed contact consent.",
    };

    setIntroRequests((current) => {
      const existing = current.some(
        (item) => item.candidateId === selectedCandidate.id,
      );

      if (!existing) {
        return [request, ...current];
      }

      return current.map((item) =>
        item.candidateId === selectedCandidate.id
          ? { ...request, id: item.id }
          : item,
      );
    });
  }

  function updateIntroStatus(candidateId: string, status: IntroStatus) {
    setIntroRequests((current) =>
      current.map((request) =>
        request.candidateId === candidateId ? { ...request, status } : request,
      ),
    );
  }

  return (
    <main className="app-shell">
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

        <nav className="nav-section" aria-label="Primary navigation">
          <span className="nav-label">
            {activeRole === "employer"
              ? "Employer workspace"
              : "Candidate workspace"}
          </span>
          <NavItem active icon="search" label="Discover talent" />
          <NavItem icon="save" label="Shortlist" count={shortlistedIds.length} />
          <NavItem icon="message" label="Intro requests" count={introRequests.length} />
          <NavItem icon="audit" label="Audit log" />
          <NavItem icon="profile" label="Company profile" />
        </nav>

        <section className="sidebar-card" aria-label="Workspace readiness">
          <div className="sidebar-card-head">
            <Icon name="shield" />
            <strong>
              {activeRole === "employer"
                ? "Employer trust gate"
                : "Profile readiness"}
            </strong>
            <span>{readinessCount}/4</span>
          </div>
          <ul>
            {sidebarChecklist.map((item) => (
              <li className={item.complete ? "" : "pending"} key={item.label}>
                <Icon name={item.complete ? "check" : "alert"} />
                {item.label}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={
              (activeRole === "employer" ? employerVerified : profileBoosted)
                ? "button success compact"
                : "button secondary compact"
            }
            onClick={() =>
              activeRole === "employer"
                ? setEmployerVerified((current) => !current)
                : setProfileBoosted((current) => !current)
            }
          >
            <Icon name={activeRole === "employer" ? "shield" : "spark"} />
            {activeRole === "employer"
              ? employerVerified
                ? "Pause verification"
                : "Resume verification"
              : profileBoosted
                ? "Boost active"
                : "Boost profile"}
          </button>
        </section>

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
              placeholder="Search skill, role, location, or keyword"
            />
          </div>
          <div className="topbar-actions">
            <span className="storage-pill">
              <Icon name="shield" />
              {storageLabel}
            </span>
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
                <small>
                  {employerVerified ? "Verified employer" : "Verification paused"}
                </small>
              </div>
              <Icon name="chevron" />
            </div>
          </div>
        </header>

        <div className="workspace-grid">
          <section
            className={`talent-column ${
              activeRole === "candidate" ? "candidate-mode" : ""
            }`}
            aria-labelledby="discovery-title"
          >
            <div className="section-heading">
              <div>
                <h1 id="discovery-title">
                  {activeRole === "employer"
                    ? "Discover consented talent"
                    : "Tune your discoverable profile"}
                </h1>
                <p>
                  {activeRole === "employer"
                    ? "Search only opt-in profiles. Review evidence, consent, and fit before sending a structured intro request."
                    : "Publish a concise profile, choose up to five expertise areas, and control when employers can request contact."}
                </p>
              </div>
              <div className="heading-actions">
                {activeRole === "employer" ? (
                  <>
                    <button type="button" className="button secondary">
                      <Icon name="save" />
                      Save search
                    </button>
                    <button type="button" className="button primary">
                      <Icon name="alert" />
                      Create alert
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className={
                        profileBoosted ? "button success" : "button primary"
                      }
                      onClick={() => setProfileBoosted((current) => !current)}
                    >
                      <Icon name="spark" />
                      {profileBoosted ? "Boost active" : "Boost profile"}
                    </button>
                    <button
                      type="button"
                      className="button secondary"
                      onClick={scrollToProfilePreview}
                    >
                      <Icon name="eye" />
                      Profile preview
                    </button>
                  </>
                )}
              </div>
            </div>

            <section className="filter-panel" aria-label="Expertise filters">
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
            </section>

            <div className="list-toolbar">
              <span>
                Showing {visibleCandidates.length} of {candidates.length}{" "}
                profiles
              </span>
              <div>
                <button type="button" className="button secondary compact">
                  <Icon name="filter" />
                  Filters
                </button>
                <button type="button" className="button secondary compact">
                  Best match
                  <Icon name="chevron" />
                </button>
              </div>
            </div>

            <div className="candidate-list">
              {visibleCandidates.map((candidate) => (
                <CandidateRow
                  key={candidate.id}
                  candidate={candidate}
                  selected={candidate.id === selectedCandidate.id}
                  shortlisted={shortlistedIds.includes(candidate.id)}
                  selectedExpertise={selectedExpertise}
                  onSelect={() => selectCandidate(candidate.id)}
                  onShortlist={() => toggleShortlist(candidate.id)}
                />
              ))}
            </div>

            <section className="candidate-setup">
              <div className="candidate-setup-head">
                <div>
                  <h2>Candidate profile setup</h2>
                  <p>
                    Build the profile employers discover. Yee keeps the draft
                    saved locally while the prototype is still client-side.
                  </p>
                </div>
                <span
                  className={
                    profileBoosted
                      ? "success-label accepted"
                      : "status-pill neutral"
                  }
                >
                  <Icon name="spark" />
                  {profileBoosted ? "Boost active" : "Standard visibility"}
                </span>
              </div>

              <div className="profile-builder">
                <div className="profile-builder-grid">
                  <label>
                    <span>Display name</span>
                    <input
                      value={candidateProfile.name}
                      onChange={(event) =>
                        updateCandidateProfile("name", event.target.value)
                      }
                    />
                  </label>
                  <label>
                    <span>Profile title</span>
                    <input
                      value={candidateProfile.title}
                      onChange={(event) =>
                        updateCandidateProfile("title", event.target.value)
                      }
                    />
                  </label>
                  <label>
                    <span>Location</span>
                    <input
                      value={candidateProfile.location}
                      onChange={(event) =>
                        updateCandidateProfile("location", event.target.value)
                      }
                    />
                  </label>
                  <label>
                    <span>Salary range</span>
                    <input
                      value={candidateProfile.salaryRange}
                      onChange={(event) =>
                        updateCandidateProfile("salaryRange", event.target.value)
                      }
                    />
                  </label>
                  <label>
                    <span>Work mode</span>
                    <select
                      value={candidateProfile.workMode}
                      onChange={(event) =>
                        updateCandidateProfile("workMode", event.target.value)
                      }
                    >
                      <option>Remote</option>
                      <option>Hybrid</option>
                      <option>Onsite</option>
                    </select>
                  </label>
                  <label>
                    <span>Availability</span>
                    <select
                      value={candidateProfile.availability}
                      onChange={(event) =>
                        updateCandidateProfile("availability", event.target.value)
                      }
                    >
                      <option>Immediately</option>
                      <option>2 weeks notice</option>
                      <option>4 weeks notice</option>
                      <option>Open to future roles</option>
                    </select>
                  </label>
                  <label>
                    <span>Profile visibility</span>
                    <select
                      value={candidateProfile.visibility}
                      onChange={(event) =>
                        updateCandidateProfile(
                          "visibility",
                          event.target.value as CandidateProfile["visibility"],
                        )
                      }
                    >
                      <option>Visible</option>
                      <option>Paused</option>
                    </select>
                  </label>
                  <label>
                    <span>Contact consent</span>
                    <select
                      value={candidateProfile.contactConsent}
                      onChange={(event) =>
                        updateCandidateProfile(
                          "contactConsent",
                          event.target
                            .value as CandidateProfile["contactConsent"],
                        )
                      }
                    >
                      <option>Intro requests</option>
                      <option>Hidden</option>
                    </select>
                  </label>
                </div>

                <label className="profile-summary-field">
                  <span>Resume summary</span>
                  <textarea
                    value={candidateProfile.summary}
                    onChange={(event) =>
                      updateCandidateProfile("summary", event.target.value)
                    }
                    rows={3}
                  />
                </label>
              </div>

              <div className="candidate-area-header">
                <strong>Discoverable expertise</strong>
                <span>{candidateExpertise.length}/5 selected</span>
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

              <div className="profile-builder-actions">
                <button
                  type="button"
                  className={
                    profileBoosted
                      ? "button success compact"
                      : "button secondary compact"
                  }
                  onClick={() => setProfileBoosted((current) => !current)}
                >
                  <Icon name="spark" />
                  {profileBoosted ? "Boost active" : "Boost profile"}
                </button>
                <span>
                  {hasHydrated
                    ? "Local draft saved in this browser."
                    : "Loading saved draft."}
                </span>
              </div>
            </section>
          </section>

          <ProfileDrawer
            candidate={selectedCandidate}
            introForm={introForm}
            introRequests={introRequests}
            employerVerified={employerVerified}
            selectedIntroRequest={selectedIntroRequest}
            shortlisted={shortlistedIds.includes(selectedCandidate.id)}
            onIntroChange={(field, value) =>
              setIntroForm((current) => ({ ...current, [field]: value }))
            }
            onIntroStatusChange={(status) =>
              updateIntroStatus(selectedCandidate.id, status)
            }
            onShortlist={() => toggleShortlist(selectedCandidate.id)}
            onSubmitIntro={submitIntro}
          />
        </div>
      </section>
    </main>
  );
}

function CandidateRow({
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
    <article className={`candidate-row ${selected ? "selected" : ""}`}>
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
            {candidate.location} - {candidate.workMode}
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

      <div className="row-actions">
        <button type="button" className="button primary compact" onClick={onSelect}>
          View profile
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

function ProfileDrawer({
  candidate,
  employerVerified,
  introForm,
  introRequests,
  selectedIntroRequest,
  shortlisted,
  onIntroChange,
  onIntroStatusChange,
  onShortlist,
  onSubmitIntro,
}: {
  candidate: Candidate;
  employerVerified: boolean;
  introForm: {
    compensation: string;
    message: string;
    roleTitle: string;
    workMode: string;
  };
  introRequests: IntroRequest[];
  selectedIntroRequest?: IntroRequest;
  shortlisted: boolean;
  onIntroChange: (
    field: "compensation" | "message" | "roleTitle" | "workMode",
    value: string,
  ) => void;
  onIntroStatusChange: (status: IntroStatus) => void;
  onShortlist: () => void;
  onSubmitIntro: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const introButtonLabel = !employerVerified
    ? "Verify employer first"
    : selectedIntroRequest
      ? "Update intro request"
      : "Send intro request";

  return (
    <aside className="profile-drawer" aria-label="Selected candidate profile">
      <section className="drawer-card profile-summary">
        <div className="drawer-header">
          <Avatar initials={candidate.initials} verified={candidate.verified} />
          <div>
            <h2>{candidate.name}</h2>
            <p>{candidate.title}</p>
          </div>
        </div>
        <p>{candidate.highlight}</p>
        <div className="summary-actions">
          <button type="button" className="button secondary compact" onClick={onShortlist}>
            <Icon name="save" />
            {shortlisted ? "Saved" : "Save"}
          </button>
          <span className="status-pill">
            <Icon name="lock" />
            Consent checked
          </span>
        </div>
      </section>

      <section className="drawer-card signals-card">
        <h3>Profile signals</h3>
        <div className="signal-grid">
          <Signal label="Availability" value={candidate.availability} />
          <Signal label="Range" value={candidate.salaryRange} />
          <Signal label="Work mode" value={candidate.workMode} />
          <Signal label="Last active" value={candidate.lastActive} />
        </div>
      </section>

      <section className="drawer-card expertise-card">
        <div className="drawer-card-heading">
          <h3>Attested expertise</h3>
          <span>{candidate.expertise.length}/5</span>
        </div>
        <div className="profile-chips">
          {candidate.expertise.map((area) => (
            <span key={area}>{area}</span>
          ))}
        </div>
      </section>

      <section className="drawer-card evidence-card">
        <h3>Evidence</h3>
        <div className="evidence-list">
          {candidate.evidence.map((item) => (
            <article key={item.label}>
              <div>
                <strong>{item.label}</strong>
                <span>{item.source}</span>
              </div>
              <em className={item.status === "Verified" ? "verified" : ""}>
                {item.status}
              </em>
            </article>
          ))}
        </div>
      </section>

      <section className="drawer-card preferences-card">
        <h3>Candidate preferences</h3>
        <ul className="plain-list">
          {candidate.preferences.map((preference) => (
            <li key={preference}>
              <Icon name="check" />
              {preference}
            </li>
          ))}
        </ul>
      </section>

      <section className="drawer-card intro-card">
        <div className="drawer-card-heading">
          <div>
            <h3>Intro request</h3>
            <p>Send a structured request through Yee. Contact remains relayed.</p>
          </div>
          {selectedIntroRequest && (
            <span
              className={`success-label ${getStatusClass(
                selectedIntroRequest.status,
              )}`}
            >
              {selectedIntroRequest.status}
            </span>
          )}
        </div>
        <form className="intro-form" onSubmit={onSubmitIntro}>
          <label>
            <span>Role title</span>
            <input
              value={introForm.roleTitle}
              onChange={(event) => onIntroChange("roleTitle", event.target.value)}
            />
          </label>
          <div className="form-grid">
            <label>
              <span>Work mode</span>
              <select
                value={introForm.workMode}
                onChange={(event) => onIntroChange("workMode", event.target.value)}
              >
                <option>Remote</option>
                <option>Hybrid</option>
                <option>Onsite</option>
              </select>
            </label>
            <label>
              <span>Compensation</span>
              <input
                value={introForm.compensation}
                onChange={(event) =>
                  onIntroChange("compensation", event.target.value)
                }
              />
            </label>
          </div>
          <label>
            <span>Message</span>
            <textarea
              value={introForm.message}
              onChange={(event) => onIntroChange("message", event.target.value)}
              rows={4}
            />
          </label>
          <div className={employerVerified ? "consent-note" : "consent-note blocked"}>
            <Icon name="shield" />
            {employerVerified ? (
              <span>
                Logged for audit. The candidate chooses whether to reveal a direct
                contact channel.
              </span>
            ) : (
              <span>
                Employer verification is paused. Intro requests stay locked until
                the business identity gate is active.
              </span>
            )}
          </div>
          <button
            type="submit"
            className="button primary"
            disabled={!employerVerified}
          >
            <Icon name="contact" />
            {introButtonLabel}
          </button>
        </form>
      </section>

      <section className="drawer-card request-queue">
        <div className="drawer-card-heading">
          <div>
            <h3>Request pipeline</h3>
            <p>Track candidate responses without exposing direct contact.</p>
          </div>
          <span>{introRequests.length}</span>
        </div>

        {introRequests.length === 0 ? (
          <p className="empty-state">No intro requests sent yet.</p>
        ) : (
          <div className="request-list">
            {introRequests.slice(0, 3).map((request) => (
              <article
                className={`request-item ${
                  request.candidateId === candidate.id ? "active" : ""
                }`}
                key={request.id}
              >
                <div className="request-item-head">
                  <div>
                    <strong>{request.candidateName}</strong>
                    <span>{request.roleTitle}</span>
                  </div>
                  <em className={getStatusClass(request.status)}>
                    {request.status}
                  </em>
                </div>
                <dl>
                  <div>
                    <dt>Mode</dt>
                    <dd>{request.workMode}</dd>
                  </div>
                  <div>
                    <dt>Range</dt>
                    <dd>{request.compensation}</dd>
                  </div>
                  <div>
                    <dt>Sent</dt>
                    <dd>{request.sentAt}</dd>
                  </div>
                </dl>
                <p>{request.audit}</p>
                {request.candidateId === candidate.id && (
                  <div className="pipeline-actions">
                    <button
                      type="button"
                      className="button secondary compact"
                      onClick={() => onIntroStatusChange("Accepted")}
                    >
                      <Icon name="check" />
                      Mark accepted
                    </button>
                    <button
                      type="button"
                      className="button secondary compact"
                      onClick={() => onIntroStatusChange("Declined")}
                    >
                      <Icon name="lock" />
                      Mark declined
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {selectedIntroRequest?.status === "Accepted" && (
          <div className="pipeline-outcome accepted">
            <Icon name="message" />
            <span>Relay channel opened. Direct contact still requires final candidate confirmation.</span>
          </div>
        )}
        {selectedIntroRequest?.status === "Declined" && (
          <div className="pipeline-outcome declined">
            <Icon name="lock" />
            <span>No channel released. The decline remains visible in the audit trail.</span>
          </div>
        )}
      </section>

      <section className="audit-note">
        <Icon name="audit" />
        <p>{candidate.auditNote}</p>
      </section>
    </aside>
  );
}

function getStatusClass(status: IntroStatus) {
  return status.toLowerCase().replaceAll(" ", "-");
}

function limitedExpertise(value: unknown) {
  if (!Array.isArray(value)) {
    return defaultSelectedExpertise;
  }

  return value
    .filter(
      (area): area is string =>
        typeof area === "string" && expertiseOptions.includes(area),
    )
    .slice(0, 5);
}

function readStoredState(): Partial<StoredYeeState> | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedState = window.localStorage.getItem(STORAGE_KEY);

    if (!storedState) {
      return null;
    }

    return JSON.parse(storedState) as Partial<StoredYeeState>;
  } catch {
    return null;
  }
}

function writeStoredState(state: StoredYeeState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
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
