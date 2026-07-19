# GuardianAI

An AI-powered emergency intelligence system that proactively detects emergencies before users manually ask for help.

## Features

### Core Capabilities
- **Intelligent Emergency Detection**: Real-time sensor monitoring (accelerometer, gyroscope, GPS, motion, activity)
- **Audio Distress Detection**: Microphone monitoring for loud sounds and distress signals
- **Contextual Scoring**: Combines multiple signals to calculate emergency confidence scores
- **Smart Countdown**: 10-second countdown with user cancellation option before alerting contacts
- **Automatic Emergency Response**: Triggers notifications when countdown completes without user response

### Emergency Response Flow
- GPS location tracking with reverse geocoding
- Human-readable address display
- Google Maps integration
- Real-time SMS notifications via Twilio
- Email notifications (placeholder for SendGrid/AWS SES)
- Push notifications (placeholder for Firebase Cloud Messaging)

### Dual Mode Operation
- **Manual Mode**: Traditional sensor input sliders for testing and manual analysis
- **Automatic Mode**: Live sensor monitoring with proactive emergency detection

## Technology Stack

### Frontend
- React
- Firebase Authentication
- Firestore
- Browser Geolocation API
- Web Audio API
- Device Motion/Orientation APIs

### Backend
- FastAPI
- Python
- Twilio (SMS notifications)
- Pydantic (data validation)
- python-dotenv (environment management)

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Twilio account (for SMS notifications)

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
# Application Configuration
APP_NAME=GuardianAI
APP_VERSION=1.0.0
DEBUG=True

# Server Configuration
HOST=0.0.0.0
PORT=8000

# CORS Configuration
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]

# Twilio Configuration for SMS Notifications
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### Twilio Setup for SMS Notifications

1. **Create a Twilio Account**
   - Go to [https://www.twilio.com](https://www.twilio.com)
   - Sign up for a free trial account
   - Verify your phone number

2. **Get Your Twilio Credentials**
   - Navigate to the Twilio Console
   - Go to Settings → General Settings
   - Copy your **Account SID** and **Auth Token**

3. **Get a Twilio Phone Number**
   - In the Twilio Console, go to Phone Numbers → Buy a Number
   - Select a number from your country
   - Purchase the number (free trial includes one number)

4. **Configure GuardianAI**
   - Add your Twilio credentials to the `.env` file:
     ```env
     TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     TWILIO_AUTH_TOKEN=your_auth_token_here
     TWILIO_PHONE_NUMBER=+1234567890
     ```
   - Ensure the phone number includes the country code (e.g., +1 for US)

5. **Test Twilio Integration**
   - Start the backend server
   - Trigger an emergency alert
   - Check that SMS is sent to your emergency contacts
   - Check backend logs for success/failure messages

**Important Notes:**
- Never commit your `.env` file to version control
- Never share your Twilio Auth Token
- Twilio trial numbers can only send to verified phone numbers
- For production, upgrade to a paid Twilio account

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
   - Edit `src/firebase/firebaseConfig.js`
   - Add your Firebase project credentials
   - Ensure Firebase Authentication and Firestore are enabled

4. **Start development server**
```bash
npm run dev
```

### Running the Application

1. **Start the backend**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. **Start the frontend**
```bash
cd frontend
npm run dev
```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Usage

### Manual Mode
1. Navigate to Emergency Dashboard
2. Adjust sensor input sliders
3. Configure profile settings
4. Click "Analyze Emergency"
5. View analysis results
6. If alert is generated, notifications are sent automatically

### Automatic Mode
1. Navigate to Emergency Dashboard
2. Click "Automatic Mode" button
3. Grant permissions for:
   - Microphone (audio distress detection)
   - GPS (location tracking)
   - Motion sensors (device movement)
4. Monitor live sensor data on dashboard
5. If emergency is detected (confidence ≥ 90):
   - Full-screen countdown appears (10 seconds)
   - Click "I'm Safe" to cancel if false alarm
   - If no response, emergency contacts are notified automatically

### Emergency Contacts
1. Navigate to Emergency Contacts page
2. Add contacts with:
   - Name
   - Phone number (for SMS)
   - Email (for email notifications)
   - Device token (for push notifications)
3. Contacts are notified when alerts are generated

## API Endpoints

### POST /predict
Analyzes sensor data and generates emergency alerts.

**Request Body:**
```json
{
  "accelerometer": 50,
  "gyroscope": 50,
  "gps_speed": 50,
  "inactivity_time": 30,
  "screen_status": "Active",
  "accessibility_profile": "Women",
  "gps_latitude": 17.385044,
  "gps_longitude": 78.486671,
  "user_address": "Hyderabad, Telangana, India"
}
```

**Response:**
```json
{
  "confidence_score": 95,
  "risk_level": "Emergency",
  "risk_emoji": "🔴",
  "reasons": [
    "Critical impact detected",
    "Extended inactivity"
  ],
  "alert": {
    "id": "alert-id",
    "emergency_status": "CONFIRMED",
    "formatted_message": "...",
    "timestamp": "2026-07-19T10:30:00",
    "google_maps_link": "https://maps.google.com/?q=17.385044,78.486671"
  }
}
```

### POST /notify
Sends notifications to emergency contacts for a given alert.

**Request Body:**
```json
{
  "alert_id": "alert-id"
}
```

**Response:**
```json
{
  "success": true,
  "alert_id": "alert-id",
  "total_contacts": 3,
  "sent": 3,
  "failed": 0,
  "notifications": [
    {
      "contact_id": "contact-1",
      "contact_name": "John Doe",
      "channels": [
        {
          "success": true,
          "status": "sent",
          "channel": "sms",
          "contact_phone": "+1234567890",
          "message_id": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }
      ]
    }
  ]
}
```

## SMS Message Format

Emergency SMS notifications include:

```
🚨 GuardianAI Emergency Alert

Emergency Detected!

Confidence: 95%
Risk Level: EMERGENCY

Reason(s):
• Critical impact detected
• Extended inactivity

Location: Hyderabad, Telangana, India
Google Maps: https://maps.google.com/?q=17.385044,78.486671

Time: 2026-07-19 10:30:00

If this is a real emergency please contact the user immediately.
```

## Project Structure

```
GuardianAI/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application
│   │   ├── models/                # Data models
│   │   │   ├── alert.py
│   │   │   └── contact.py
│   │   ├── schemas/               # Pydantic schemas
│   │   │   └── alert.py
│   │   └── services/              # Business logic
│   │       ├── emergency_engine.py
│   │       ├── alert_generator.py
│   │       └── notification_service.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   │   └── EmergencyCountdown.jsx
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useSensorMonitoring.js
│   │   │   ├── useAudioMonitoring.js
│   │   │   └── useEmergencyDetection.js
│   │   ├── pages/                 # Page components
│   │   │   └── EmergencyDashboard.jsx
│   │   ├── services/              # API services
│   │   │   └── api.js
│   │   └── firebase/              # Firebase configuration
│   │       └── firebaseConfig.js
│   └── package.json
└── README.md
```

## Security Considerations

- **Never hardcode credentials**: Always use environment variables
- **Protect Twilio credentials**: Auth token provides full account access
- **Validate phone numbers**: Ensure emergency contacts have valid numbers
- **Rate limiting**: Consider implementing rate limits for SMS sending
- **Logging**: All SMS send attempts are logged for audit purposes

## Troubleshooting

### SMS Not Sending
- Verify Twilio credentials in `.env` file
- Check backend logs for error messages
- Ensure Twilio phone number is verified
- Verify emergency contacts have valid phone numbers
- Check Twilio account balance (trial accounts have limits)

### Sensor Monitoring Not Working
- Ensure browser permissions are granted
- Check browser compatibility (Chrome/Edge recommended)
- Verify device has required sensors
- Check console for JavaScript errors

### Location Not Updating
- Ensure GPS permission is granted
- Check device location services are enabled
- Verify reverse geocoding API is accessible
- Check network connection

## Future Enhancements

- [ ] Implement Random Forest AI model for improved detection
- [ ] Add email notification integration (SendGrid/AWS SES)
- [ ] Add push notification integration (Firebase Cloud Messaging)
- [ ] Implement voice keyword detection for distress phrases
- [ ] Add emergency contact priority levels
- [ ] Implement emergency escalation logic
- [ ] Add emergency history and analytics
- [ ] Create mobile app (React Native)

## License

This project is part of GuardianAI emergency intelligence system.

## Support

For issues or questions, please refer to the project documentation or contact the development team.
