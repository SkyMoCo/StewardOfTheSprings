# Steward of the Springs

A web application for tracking community stewardship of natural hot springs, built for the **Stewards of the Springs** nonprofit organization.

## Live Site

**https://sos.skymoco.dev**

- Public site: `/` `/stewardship` `/about`
- Admin panel: `/admin`
- API docs: `/api/docs`

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, React Router |
| Backend | Python 3.12, FastAPI, SQLAlchemy |
| Database | MySQL 8.0 |
| Reverse proxy / SSL | Caddy 2 (auto HTTPS) |
| Deployment | Docker Compose on IONOS VPS |

## Project Structure

```
StewardOfTheSprings/
├── app/                  # FastAPI backend
│   ├── main.py
│   ├── database.py
│   ├── models/           # SQLAlchemy models
│   ├── routers/          # API route handlers
│   └── schemas/          # Pydantic schemas
├── frontend/             # React frontend
│   └── src/
│       ├── pages/        # Home, Stewardship, About, Admin
│       └── components/   # Navbar, Footer, AdminLayout
├── mysql/                # DB init scripts
├── caddy/                # Caddyfile (production)
├── docker-compose.yml    # Production compose
├── docker-compose.dev.yml # Local dev compose
├── deploy.sh             # Deploy to production
└── admin-guide.pdf       # Non-developer admin guide
```

## Local Development

**Prerequisites:** Docker Desktop

```bash
# Clone the repo
git clone git@github.com:SkyMoCo/StewardOfTheSprings.git
cd StewardOfTheSprings

# Start the dev stack (hot reload on both React and FastAPI)
docker compose -f docker-compose.dev.yml up

# Frontend:  http://localhost:5173
# API:       http://localhost:8000
# API docs:  http://localhost:8000/api/docs
```

The `app/` and `frontend/src/` directories are volume-mounted — edits in VS Code reflect immediately without rebuilding.

## Deploying to Production

```bash
./deploy.sh
```

This rsyncs `app/` and `frontend/` to the production VM and rebuilds only the affected containers.

## Data Model

```
Participant ─┬─< ParticipantSpring >─ Spring
             ├─< SpringLog
             ├─< Milestone
             └─< SEAPCollection
```

- **Participant** — registered stewards and volunteers
- **Spring** — monitored hot spring locations
- **ParticipantSpring** — many-to-many: who stewards which spring
- **SpringLog** — visit check-ins with conditions and notes
- **Milestone** — achievements earned by participants
- **SEAPCollection** — SSI SEAP form data (fields TBD after Lydia review)

## Environment Variables

Copy `.env.dev` for local development. Production `.env` lives on the server only and is not committed.

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLAlchemy connection string |
| `SECRET_KEY` | App secret (used for token signing) |
| `MYSQL_*` | MySQL credentials |
| `ADMIN_USER` | Admin panel username |
| `ADMIN_PASSWORD` | Admin panel password |

## Admin Guide

See [admin-guide.pdf](admin-guide.pdf) for the non-developer guide covering springs, participants, and visit log management.

## Roadmap

- [ ] SEAP form fields (pending Lydia review)
- [ ] User roles and permissions (admin / steward / volunteer)
- [ ] Spring assignment workflow
- [ ] Milestone auto-detection (e.g. 10 visits)
- [ ] Data export for land managers
- [ ] React Native mobile app
