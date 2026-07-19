"""
Notification Service

Service for sending emergency notifications to contacts.
Supports SMS, email, and push notifications with integration points
for Twilio, Firebase Cloud Messaging, and email services.
"""

import os
import logging
from typing import List, Dict, Optional
from dotenv import load_dotenv
from app.models.contact import contact_model
from app.models.alert import alert_model

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class NotificationService:
    """
    Emergency notification service.
    
    Handles contact retrieval, alert formatting, and notification sending
    across multiple channels (SMS, email, push notifications).
    """
    
    def __init__(self):
        """Initialize the notification service."""
        # Load Twilio credentials from environment
        self.twilio_account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.twilio_auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.twilio_phone_number = os.getenv('TWILIO_PHONE_NUMBER')
        
        # Enable SMS if credentials are available
        self.sms_enabled = bool(self.twilio_account_sid and self.twilio_auth_token and self.twilio_phone_number)
        
        self.email_enabled = False  # Email service integration
        self.push_enabled = False  # Firebase Cloud Messaging integration
        
        # Initialize Twilio client if enabled
        self.twilio_client = None
        if self.sms_enabled:
            try:
                from twilio.rest import Client
                self.twilio_client = Client(self.twilio_account_sid, self.twilio_auth_token)
                logger.info("Twilio SMS service initialized successfully")
            except ImportError:
                logger.error("Twilio library not installed. Run: pip install twilio")
                self.sms_enabled = False
            except Exception as e:
                logger.error(f"Failed to initialize Twilio client: {e}")
                self.sms_enabled = False
    
    def get_emergency_contacts(self) -> List[dict]:
        """
        Retrieve all registered emergency contacts.
        
        Returns:
            List of emergency contacts
        """
        return contact_model.get_all()
    
    @staticmethod
    def _normalize_contact(contact: dict, index: int) -> dict:
        """Ensure a caller-supplied contact has the fields the notifier expects."""
        normalized = dict(contact)
        normalized.setdefault('id', normalized.get('id') or f"contact-{index}")
        normalized.setdefault('name', 'Emergency Contact')
        return normalized
    
    def format_alert_for_notification(self, alert: dict) -> str:
        """
        Format alert for notification channels.
        
        Args:
            alert: Alert dictionary
            
        Returns:
            Formatted alert message
        """
        return alert.get('formatted_message', 'Emergency alert generated')
    
    def format_sms_message(self, alert: dict) -> str:
        """
        Format alert specifically for SMS with concise format.
        
        Args:
            alert: Alert dictionary
            
        Returns:
            Formatted SMS message
        """
        confidence = alert.get('confidence_score', 0)
        risk_level = alert.get('risk_level', 'Unknown')
        reasons = alert.get('reasons', [])
        location = alert.get('user_address', alert.get('user_location', 'Location not available'))
        google_maps_link = alert.get('google_maps_link', '')
        timestamp = alert.get('timestamp')
        
        # Format time
        if timestamp:
            time_str = timestamp.strftime("%Y-%m-%d %H:%M:%S") if hasattr(timestamp, 'strftime') else str(timestamp)
        else:
            time_str = "Unknown time"
        
        # Build SMS message
        sms_body = f"""🚨 GuardianAI Emergency Alert

Emergency Detected!

Confidence: {confidence}%
Risk Level: {risk_level.upper()}

Reason(s):"""
        
        # Add reasons (limit to 3 for SMS)
        for i, reason in enumerate(reasons[:3]):
            sms_body += f"\n• {reason}"
        
        if len(reasons) > 3:
            sms_body += f"\n• ... and {len(reasons) - 3} more"
        
        sms_body += f"""

Location: {location}"""
        
        if google_maps_link:
            sms_body += f"\nGoogle Maps: {google_maps_link}"
        
        sms_body += f"""

Time: {time_str}

If this is a real emergency please contact the user immediately."""
        
        return sms_body
    
    def send_sms_notification(self, contact: dict, message: str) -> Dict:
        """
        Send SMS notification to a contact using Twilio.
        
        Args:
            contact: Contact dictionary with phone_number
            message: Alert message to send
            
        Returns:
            Dictionary with send status and details
        """
        phone_number = contact.get('phone_number')
        
        if not phone_number:
            logger.warning(f"Contact {contact.get('name', 'Unknown')} has no phone number")
            return {
                'success': False,
                'status': 'failed',
                'channel': 'sms',
                'reason': 'Contact has no phone number',
                'contact_phone': None
            }
        
        if not self.sms_enabled or not self.twilio_client:
            logger.warning(f"SMS service not configured. Skipping SMS to {phone_number}")
            return {
                'success': False,
                'status': 'skipped',
                'channel': 'sms',
                'reason': 'SMS service not configured (Twilio credentials required)',
                'contact_phone': phone_number
            }
        
        try:
            # Send SMS via Twilio
            twilio_message = self.twilio_client.messages.create(
                body=message,
                from_=self.twilio_phone_number,
                to=phone_number
            )
            
            logger.info(f"SMS sent successfully to {phone_number}. Message SID: {twilio_message.sid}")
            
            return {
                'success': True,
                'status': 'sent',
                'channel': 'sms',
                'contact_phone': phone_number,
                'message_id': twilio_message.sid,
                'message': message
            }
        except Exception as e:
            logger.error(f"Failed to send SMS to {phone_number}: {str(e)}")
            return {
                'success': False,
                'status': 'failed',
                'channel': 'sms',
                'reason': str(e),
                'contact_phone': phone_number
            }
    
    def send_email_notification(self, contact: dict, message: str) -> Dict:
        """
        Send email notification to a contact.
        
        Integration point for email services (SendGrid, AWS SES, etc.).
        
        Args:
            contact: Contact dictionary with email
            message: Alert message to send
            
        Returns:
            Dictionary with send status and details
        """
        email = contact.get('email')
        
        if not email:
            return {
                'success': False,
                'status': 'failed',
                'channel': 'email',
                'reason': 'Contact has no email address',
                'contact_email': None
            }
        
        if not self.email_enabled:
            return {
                'success': False,
                'status': 'skipped',
                'channel': 'email',
                'reason': 'Email service not configured',
                'contact_email': email
            }
        
        try:
            # TODO: Implement email service integration
            # Example implementation with SendGrid:
            # from sendgrid import SendGridAPIClient
            # from sendgrid.helpers.mail import Mail
            # email_message = Mail(
            #     from_email='alerts@guardianai.com',
            #     to_emails=email,
            #     subject='GuardianAI Emergency Alert',
            #     plain_text_content=message
            # )
            # sg = SendGridAPIClient(SENDGRID_API_KEY)
            # response = sg.send(email_message)
            # return {
            #     'success': True,
            #     'status': 'sent',
            #     'channel': 'email',
            #     'contact_email': email,
            #     'message_id': response.headers.get('X-Message-Id'),
            #     'message': message
            # }
            
            return {
                'success': True,
                'status': 'simulated',
                'channel': 'email',
                'contact_email': email,
                'message': message
            }
        except Exception as e:
            return {
                'success': False,
                'status': 'failed',
                'channel': 'email',
                'reason': str(e),
                'contact_email': email
            }
    
    def send_push_notification(self, contact: dict, message: str) -> Dict:
        """
        Send push notification to a contact.
        
        Integration point for Firebase Cloud Messaging.
        
        Args:
            contact: Contact dictionary (may have device tokens)
            message: Alert message to send
            
        Returns:
            Dictionary with send status and details
        """
        device_token = contact.get('device_token')
        
        if not device_token:
            return {
                'success': False,
                'status': 'failed',
                'channel': 'push',
                'reason': 'Contact has no device token',
                'contact_name': contact.get('name')
            }
        
        if not self.push_enabled:
            return {
                'success': False,
                'status': 'skipped',
                'channel': 'push',
                'reason': 'Push notification service not configured (FCM integration required)',
                'contact_name': contact.get('name')
            }
        
        try:
            # TODO: Implement Firebase Cloud Messaging integration
            # Example implementation:
            # from firebase_admin import messaging
            # push_message = messaging.Message(
            #     notification=messaging.Notification(
            #         title='GuardianAI Emergency Alert',
            #         body=message[:100]  # Truncate for notification
            #     ),
            #     token=device_token
            # )
            # response = messaging.send(push_message)
            # return {
            #     'success': True,
            #     'status': 'sent',
            #     'channel': 'push',
            #     'contact_name': contact.get('name'),
            #     'message_id': response,
            #     'message': message
            # }
            
            return {
                'success': True,
                'status': 'simulated',
                'channel': 'push',
                'contact_name': contact.get('name'),
                'message': message
            }
        except Exception as e:
            return {
                'success': False,
                'status': 'failed',
                'channel': 'push',
                'reason': str(e),
                'contact_name': contact.get('name')
            }
    
    def notify_contacts(self, alert_id: str, contacts: Optional[List[dict]] = None) -> Dict:
        """
        Notify emergency contacts about an alert.
        
        Args:
            alert_id: ID of the alert to send notifications for
            contacts: Optional list of contacts to notify (e.g. the user's saved
                contacts sent from the frontend). When omitted, falls back to the
                server-side contact store.
            
        Returns:
            Dictionary with notification results for each contact
        """
        # Get the alert
        alert = alert_model.get_by_id(alert_id)
        if not alert:
            return {
                'success': False,
                'error': 'Alert not found',
                'notifications': []
            }
        
        # Use contacts passed from the caller (the app's saved contacts) when
        # available; otherwise fall back to the server-side store.
        if contacts:
            contacts = [self._normalize_contact(c, i) for i, c in enumerate(contacts)]
        else:
            contacts = self.get_emergency_contacts()
        
        if not contacts:
            return {
                'success': False,
                'error': 'No emergency contacts registered',
                'notifications': []
            }
        
        # Format messages for different channels
        sms_message = self.format_sms_message(alert)
        email_message = self.format_alert_for_notification(alert)
        push_message = self.format_alert_for_notification(alert)
        
        # Send notifications to all contacts
        notifications = []
        sent_count = 0
        failed_count = 0
        
        for contact in contacts:
            contact_notifications = {
                'contact_id': contact['id'],
                'contact_name': contact['name'],
                'channels': []
            }
            
            # Try SMS (use SMS-specific format)
            sms_result = self.send_sms_notification(contact, sms_message)
            contact_notifications['channels'].append(sms_result)
            if sms_result.get('success'):
                sent_count += 1
            else:
                failed_count += 1
            
            # Try email (use standard format)
            email_result = self.send_email_notification(contact, email_message)
            contact_notifications['channels'].append(email_result)
            if email_result.get('success'):
                sent_count += 1
            else:
                failed_count += 1
            
            # Try push notification (use standard format)
            push_result = self.send_push_notification(contact, push_message)
            contact_notifications['channels'].append(push_result)
            if push_result.get('success'):
                sent_count += 1
            else:
                failed_count += 1
            
            notifications.append(contact_notifications)
        
        logger.info(f"Notification complete: {sent_count} sent, {failed_count} failed")
        
        return {
            'success': True,
            'alert_id': alert_id,
            'total_contacts': len(contacts),
            'sent': sent_count,
            'failed': failed_count,
            'notifications': notifications
        }
    
    def enable_sms(self, account_sid: str, auth_token: str, phone_number: str):
        """
        Enable SMS notifications with Twilio credentials.
        
        Note: This method is deprecated. Credentials should be set via environment variables.
        
        Args:
            account_sid: Twilio account SID
            auth_token: Twilio auth token
            phone_number: Twilio phone number
        """
        logger.warning("enable_sms() is deprecated. Use environment variables instead.")
        self.twilio_account_sid = account_sid
        self.twilio_auth_token = auth_token
        self.twilio_phone_number = phone_number
        self.sms_enabled = True
        
        try:
            from twilio.rest import Client
            self.twilio_client = Client(account_sid, auth_token)
            logger.info("Twilio SMS service enabled via enable_sms()")
        except Exception as e:
            logger.error(f"Failed to initialize Twilio client: {e}")
            self.sms_enabled = False
    
    def enable_email(self, api_key: str, from_email: str):
        """
        Enable email notifications with service credentials.
        
        Args:
            api_key: Email service API key
            from_email: Sender email address
        """
        # TODO: Store credentials securely
        self.email_enabled = True
    
    def enable_push(self, firebase_credentials: dict):
        """
        Enable push notifications with Firebase credentials.
        
        Args:
            firebase_credentials: Firebase service account credentials
        """
        # TODO: Store credentials securely
        self.push_enabled = True


# Singleton instance
notification_service = NotificationService()
