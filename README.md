# Next.js Chat Application - WIWI Chatbot

A modern, full-featured chat application built with Next.js, Firebase, and Gemini AI integration.

## 🚀 Features

- **Real-time Chat**: Instant messaging with real-time updates
- **Authentication**: Secure user authentication via Firebase
- **Responsive Design**: Fully responsive UI that works across devices
- **AI Integration**: Gemini AI capabilities for enhanced chat features
- **User Management**: Complete user registration and profile system

## 📁 Project Structure

```
app/
├── api/               # API routes
├── auth/              # Authentication pages and logic
│   └── [...nextauth]  # NextAuth.js configuration
├── chats/             # Chat interface pages
├── firebase/          # Firebase configuration
├── messages/          # Message handling logic
├── components/        # Reusable UI components
│   ├── LandingPage/   # Landing page components
│   ├── reactbits/     # React utility components
│   └── ui/            # UI component library
├── config/            # Application configuration
├── lib/               # Utility libraries
└── server/            # Server-side functionality
    └── auth/          # Server authentication logic
```

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: CSS (global.css)
- **Backend**: Next.js API routes, Firebase
- **Authentication**: Firebase Auth, NextAuth.js
- **Database**: Firebase Firestore
- **AI**: Gemini AI integration
- **Deployment**: Configured for Next.js deployment

## 🚦 Getting Started

### Prerequisites

- Node.js (v18.x or higher recommended)
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nextjs-chat-app.git
   cd nextjs-chat-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   
   # If using NextAuth.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   
   # If using Gemini AI
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📝 Usage

1. **Authentication**:
   - Register a new account or sign in with existing credentials
   - Choose between email/password or social authentication

2. **Chat Interface**:
   - Navigate to the chat section
   - Select or create a new chat
   - Start sending messages

3. **Features**:
   - Real-time messaging
   - User online status
   - Message read receipts
   - Media sharing capabilities
   - AI-powered chat suggestions

## 🧰 Development

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm start` - Run production server
- `npm run lint` - Run ESLint

### Adding New Features

To extend the application:

1. For new components, add them to the appropriate folder in `components/`
2. For new API routes, create them in the `api/` directory
3. For database changes, update the Firebase integration in `firebase/`

## 📚 Documentation

For more detailed documentation:

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - *Initial work*

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for the robust backend services
- All open-source contributors
