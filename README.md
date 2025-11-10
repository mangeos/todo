# 🚀 TodoApp  
**Spring Boot React PostgreSQL Docker**

En fullstack webbapplikation för att hantera todos, skapa grupper och samarbeta med teammedlemmar med JWT-autentisering.

## ✨ Funktioner

### 🔐 Autentisering & Säkerhet
- **JWT Token Authentication** - Säker inloggning med JSON Web Tokens
- **Spring Security** - Robust säkerhetskonfiguration
- **Automatisk token-hantering** - Tokens sparas i localStorage
- **Skyddad API-access** - Alla endpoints kräver autentisering

### 📝 Todo Management
- **Skapa, redigera och ta bort todos** - Full CRUD-funktionalitet
- **Markera som klar/oklar** - Enkelt hantera todo-status
- **Datum-baserade todos** - Organisera uppgifter efter datum
- **Checklist-funktionalitet** - Visuell feedback för slutförda uppgifter

### 👥 Gruppsamarbete
- **Skapa och hantera grupper** - Organisera todos i team
- **Lägg till gruppmedlemmar** - Bjud in andra användare
- **Grupp-baserade todos** - Separata todo-listor per grupp
- **Medlemshantering** - Se vilka som ingår i gruppen

### 🎨 Användargränssnitt
- **Modern React UI** - Snygg och responsiv design
- **Dark/Light mode** - Anpassat efter systeminställningar
- **Tailwind CSS** - Modern styling med utility-first CSS
- **Lucide React Icons** - Professionella ikoner
- **Mobilvänlig** - Fungerar perfekt på alla enheter

## 🛠 Tech Stack

### Backend
- **Spring Boot 3** - Java framework för enterprise-applikationer
- **Spring Security** - Autentisering och auktorisering
- **JWT (JJWT)** - JSON Web Token implementation
- **PostgreSQL** - Relationsdatabas
- **Hibernate JPA** - Object-relational mapping
- **REST API** - Web services
- **Maven** - Build automation

### Frontend
- **React 18** - Modern användargränssnitt
- **TypeScript** - Typad JavaScript för bättre utvecklarupplevelse
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Ikonbibliotek
- **Vite** - Snabb build tool och dev server

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **PostgreSQL Container** - Database som tjänst

## 🚀 Snabbstart med Docker

### Förutsättningar
- Docker och Docker Compose
- Node.js 18+ (för lokal utveckling)

### 1. Klona och kör
```bash
git clone [your-repo-url]
cd todo-app
docker-compose up -d