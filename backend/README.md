# GuardianAI Backend

FastAPI backend for GuardianAI application.

## Project Structure

```
backend/
├── app/
│   ├── main.py              # Application entry point with FastAPI app initialization
│   ├── routes/              # API route modules (endpoints)
│   │   ├── __init__.py      # Routes package initialization
│   │   └── health.py        # Health check endpoints
│   ├── models/              # Database models and data structures
│   │   └── __init__.py      # Models package initialization
│   ├── services/            # Business logic and service layer
│   │   └── __init__.py      # Services package initialization
│   ├── utils/               # Utility functions and helpers
│   │   └── __init__.py      # Utils package initialization
│   ├── schemas/             # Pydantic schemas for validation
│   │   └── __init__.py      # Schemas package initialization
│   └── config/              # Configuration settings
│       ├── __init__.py      # Config package initialization
│       └── settings.py      # Application settings using Pydantic
├── requirements.txt         # Python dependencies
├── .env.example            # Example environment variables
└── README.md               # This file
```

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**

   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```

   - **Mac/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create environment configuration file:**
   ```bash
   copy .env.example .env
   ```
   
   Or on Mac/Linux:
   ```bash
   cp .env.example .env
   ```

6. **Configure environment variables:**
   - Open the `.env` file
   - Modify the settings as needed (default values should work for development)

## Running the Backend

### Option 1: Using Python directly

```bash
python app/main.py
```

### Option 2: Using Uvicorn directly

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Option 3: Using Uvicorn with configuration

```bash
uvicorn app.main:app --reload
```

The backend will start running on `http://localhost:8000`

## Testing the Backend

Once the backend is running, you can test it:

1. **Health check endpoint:**
   - Open your browser and visit: `http://localhost:8000/`
   - You should see: `{"message": "GuardianAI Backend Running Successfully"}`

2. **API documentation (Swagger UI):**
   - Visit: `http://localhost:8000/docs`
   - This provides interactive API documentation

3. **Alternative API documentation (ReDoc):**
   - Visit: `http://localhost:8000/redoc`

## Configuration

The backend uses environment variables for configuration. Key settings:

- `APP_NAME`: Application name (default: GuardianAI)
- `APP_VERSION`: Application version (default: 1.0.0)
- `DEBUG`: Debug mode flag (default: True)
- `HOST`: Server host address (default: 0.0.0.0)
- `PORT`: Server port number (default: 8000)
- `CORS_ORIGINS`: List of allowed CORS origins for the frontend

## CORS Configuration

The backend is configured to allow CORS (Cross-Origin Resource Sharing) for the React frontend. By default, it allows requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (Create React App default)

You can modify the `CORS_ORIGINS` in the `.env` file to add more origins.

## Next Steps

- Add Firebase integration for authentication
- Add AI model integration for AI features
- Implement database models and services
- Add additional API routes for specific features

## Development Notes

- The backend uses FastAPI, a modern, fast web framework for building APIs
- Pydantic is used for data validation and settings management
- Uvicorn is the ASGI server used to run the application
- The project structure follows a modular approach for easy scalability
