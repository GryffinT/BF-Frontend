# Travelers Coop (BF-Frontend)

Short description
- Travelers Coop is the Electron-based frontend (BF-Frontend) for discovering and saving local businesses and programming-related services. Users can search by category, view place details, and favorite places. This build is distributed as a Windows installer.

Key features
- Search nearby businesses by category
- View place details (address, contact, website, opening hours when available)
- Favorite places and persist them via the remote backend
- Windows installer for end-user distribution (no local backend required)

Tech stack
- Frontend languages: HTML, CSS, JavaScript
- Minimal ancillary file types: JSON (configs), DB-related artifacts (migrations/seeds) where used
- Electron (desktop shell for Windows)

API notes
- Uses IPAPI for IP-based geolocation
- Uses Geoapify Places and Place Details for place search and metadata
- API keys and secrets are managed by the remote backend (not embedded in the distributed app)

Database
- User accounts and favorites are persisted in MongoDB (managed by the backend). End users do not need to run or configure a database locally.

Backend info
- The backend lives in a separate repository: https://github.com/GryffinT/BF-Backend
- The backend is deployed on Railway and exposes the API the frontend uses; because it is hosted remotely, end users only need to install the Windows app and sign up — no backend setup required.

FBLA 2026
- Built for the FBLA 2026 Coding & Programming category.

Contact
- Project: Travelers Coop (BF-Frontend)  
- Frontend repo: https://github.com/GryffinT/BF-Frontend  
- Backend repo: https://github.com/GryffinT/BF-Backend  
- Author: Gryffin T (GryffinT)
