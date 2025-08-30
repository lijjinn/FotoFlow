# User Guide: FotoFlow Application 

## Overview

Welcome to FotoFlow, a digital camera app designed to capture and share event moments effortlessly. This app turns your phone into a digital disposable camera, perfect for weddings, birthdays, family gatherings, or any special occasion. FotoFlow makes sharing photos simple and memorable, preserving those cherished moments in a unified event gallery. **Note:** Users must sign in to create or join events and access any app features.

## Features

* **User Authentication:** Users must sign in to access the app’s main features, ensuring secure and personalized event management.
* **Instant Photo Capture:** Capture photos directly within the app without switching to the phone’s default camera.
* **Event Creation:** Hosts can create personalized events and generate unique QR codes for guest access.
* **Secure Guest Access:** Guests can join events by scanning a QR code without needing an account.
* **Private Local Storage:** Photos are stored directly on the host’s device, ensuring privacy and fast access.
* **Delayed Gallery Reveal:** Hosts control when guests can view submitted photos, preserving the surprise element.
* **Offline Functionality:** Works without an internet connection, perfect for remote events.
* **Simple, Intuitive Interface:** Minimal design for ease of use, even for non-tech-savvy users.

## Technologies Used

* **React Native:** Cross-platform app framework for building the mobile app.
* **Expo:** Simplifies development and testing of React Native apps.
* **QR Code Generation:** Enables fast, contactless event joining.
* **JavaScript:** Core language for application logic.
* **Local File Storage:** Secure, offline photo management.

## Installation

### Prerequisites

* Node.js installed on your system.
* Expo CLI for building and testing the app.
* Git for version control.

### Steps to Run Locally

1. Clone the repository:

```bash
git clone https://github.com/battletatakai/group_app.git
```

2. Navigate to the project directory:

```bash
cd group_app
```

3. Install dependencies:

```bash
npm install
```

4. Start the app:

```bash
npx expo start
```

## Getting Started

### Registering and Logging In

1. Open the app.
2. Tap the **Sign Up** button to create a new account.
3. Enter your email and a secure password.
4. Log in with your newly created account to access all features.

### Creating an Event

1. After logging in, tap the **Create Event** button.
2. Enter the event name and optional description.
3. Generate a unique QR code for guest access.

### Joining an Event

* Scan the QR code to access the camera and start capturing memories. **Note:** You must be logged in to join an event.

### Viewing the Gallery

* Photos become visible based on the host’s reveal settings. Only registered users can view galleries.

## Troubleshooting

* **App Not Starting:** Ensure all dependencies are installed.
* **QR Code Not Scanning:** Make sure the QR code is clear and within frame.
* **Photos Not Saving:** Check device storage permissions.

## Future Enhancements

* **Cloud Storage:** Backup and multi-device access for event photos.
* **In-App Editing Tools:** For better photo organization and management.
* **Guest Analytics:** Gain insights into guest engagement during events.

## License

This project is licensed under the MIT License.

## Community and Support

Join the Expo community for support and collaboration:

* **GitHub:** [Project Repository](https://github.com/battletatakai/group_app.git)
* **Discord:** [Expo Community](https://discord.gg/expo)

## References

* [Expo Documentation](https://docs.expo.dev/)
* [React Native Documentation](https://reactnative.dev/)
* [QR Code Generation Library](https://github.com/mebjas/html5-qrcode)


Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
