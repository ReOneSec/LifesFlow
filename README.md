# Lifesflow Blood Bank Management System

![Lifesflow Banner](https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1920&q=80)

## Overview

Lifesflow is a comprehensive blood bank management system that connects blood donors with those in need. The platform facilitates blood donation requests, donor registration, and appointment scheduling while maintaining a secure and efficient database of donor information.

## Features

### For Donors
- **Quick Registration**: Easy sign-up process for new donors
- **Profile Management**: Update personal information and donation history
- **Appointment Scheduling**: Book donation slots at convenient times
- **Donation Tracking**: Monitor donation history and impact

### For Recipients
- **Blood Request System**: Submit and track blood donation requests
- **Real-time Updates**: Get notifications on request status
- **Donor Search**: Find compatible donors in your area
- **Emergency Requests**: Priority system for urgent cases

### Additional Features
- **Admin Dashboard**: Comprehensive management interface
#### Admin Credentials 
** Email:- admin@lifesflow.org
** Password:- Admin@123
- **Blog & News**: Stay updated with latest information
- **Multi-language Support**: Accessibility for diverse users
- **Responsive Design**: Works seamlessly on all devices

## Technology Stack

- **Frontend**: React.js with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **State Management**: React Context
- **Form Handling**: Native React forms
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lifeflow-blood-bank.git
cd lifeflow-blood-bank
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

### Database Setup

The application uses Supabase as its database. The schema includes tables for:
- User profiles
- Blood requests
- Donations
- Blog posts
- News articles
- Blood group changes

Migration files are available in the `supabase/migrations` directory.

## Project Structure

```
src/
├── components/        # Reusable UI components
├── contexts/         # React context providers
├── lib/             # Utility functions and configurations
├── pages/           # Page components
└── i18n/            # Internationalization files

supabase/
└── migrations/      # Database migration files
```

## Key Components

- **DonorSearch**: Advanced search functionality for finding donors
- **DonorList**: Display and filter donor information
- **RequestBlood**: Form for submitting blood requests
- **AdminDashboard**: Comprehensive admin interface
- **UserProfile**: User information management
- **Appointments**: Donation scheduling system

## Security Features

- Row Level Security (RLS) policies
- User authentication and authorization
- Blood group verification system
- Secure profile management
- Admin access controls

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

- Developer: SAHABAJ ALAM
- Email: support@lifesflow.com
- Website: www.lifesflow.com

## Acknowledgments

- Blood donation community
- Open source contributors
- Medical professionals for guidance
- Supabase team for the excellent backend service

---

Made with ❤️ by SAHABAJ ALAM
