# Notes Taking App

A modern notes taking application built with Next.js 14, Material UI, and MongoDB. This application allows users to create, view, edit, and delete notes in a beautiful and responsive interface.

## Features

- User authentication (Register, Login, Logout) using NextAuth.js
- Create, read, update, and delete notes
- Responsive design that works on all devices
- Modern UI with Material UI
- Form validation
- Error handling
- Loading states
- Toast notifications

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js 14.0.0 or later
- npm or yarn package manager
- MongoDB (local or Atlas)

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd notes-app
```

2. Install the dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXTAUTH_URL=http://localhost:3000
MONGODB_URL=your_mongodb_connection_string
SECRET_KEY=your_secret_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
notes-app/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   └── register/
│   │   └── notes/
│   │       ├── [id]/
│   │       └── route.ts
│   ├── components/
│   │   ├── CreateNote.tsx
│   │   ├── CreateNoteClient.tsx
│   │   ├── NoteDetailClient.tsx
│   │   ├── NotesList.tsx
│   │   └── NotesPageClient.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   └── db.ts
│   ├── models/
│   │   ├── Note.ts
│   │   └── User.ts
│   ├── notes/
│   │   ├── [id]/
│   │   ├── new/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── services/
│   │   └── notesService.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── public/
│   └── favicon.ico
├── .env.local
├── .gitignore
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## Technologies Used

- Next.js 14
- TypeScript
- Material UI
- NextAuth.js
- MongoDB
- Mongoose
- Axios

## License

This project is licensed under the MIT License - see the LICENSE file for details. 