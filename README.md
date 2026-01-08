# VibeQueue

A full-stack web application that uses AI to discover music based on natural language descriptions. Users describe a mood or vibe, and the app generates personalized Spotify playlists powered by OpenAI's GPT API.

## Features

- Natural language music discovery using GPT
- Spotify OAuth authentication and playback control
- Real-time song search and playback
- Song history tracking
- Queue management

## Tech Stack

- **Frontend**: React, Axios, Bootstrap
- **Backend**: Django, Django REST Framework
- **APIs**: Spotify Web API, OpenAI API
- **Database**: SQLite

## Prerequisites

- Python 3.x
- Node.js and npm
- Spotify Premium account
- Spotify Developer App credentials ([create here](https://developer.spotify.com/dashboard))
- OpenAI API key ([get here](https://platform.openai.com/api-keys))

## Setup

### Backend Setup

1. Navigate to backend and create virtual environment:
```bash
cd backend/spotifyapp
python -m venv venv
```

2. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file in `backend/spotifyapp/` with your credentials:
```env
SECRET_KEY="your-django-secret-key"
DEBUG="True"
SPOTIFY_CLIENT_ID="your-spotify-client-id"
SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"
SPOTIFY_REDIRECT_URI="http://127.0.0.1:8000/redirect"
OPENAI_API_KEY="your-openai-api-key"
FRONTEND_URL="http://127.0.0.1:3000"
```

5. Run migrations and start server:
```bash
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to frontend and install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm start
```

Frontend runs at `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Click "Log in with Spotify" to authenticate
3. Enter a mood description (e.g., "upbeat summer road trip music")
4. Browse AI-generated recommendations
5. Play songs directly or add to queue

## Project Structure

```
├── backend/
│   └── spotifyapp/
│       ├── config/          # Django settings
│       ├── core/            # Main app (models, views, API endpoints)
│       ├── manage.py
│       └── .env
└── frontend/
    └── src/
        ├── components/      # React components
        ├── services/        # API service layer
        └── App.jsx
```

## License

MIT
