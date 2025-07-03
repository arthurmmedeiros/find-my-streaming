# 🎬 StreamFinder

**Find where to watch your favorite movies and TV shows across all streaming platforms, or discover new content with AI-powered recommendations.**

StreamFinder is a Next.js application that combines comprehensive streaming availability search with intelligent AI recommendations to help users discover and locate their next watch.

![StreamFinder Preview](https://via.placeholder.com/800x400/1f2937/ffffff?text=StreamFinder+Preview)

## ✨ Features

### 🔍 **Title Search**
- Search for specific movies and TV shows by title
- Real-time streaming availability across major platforms
- Detailed information including ratings, release dates, and plot summaries
- Provider logos and direct links to streaming services

### 🤖 **AI-Powered Recommendations**
- Natural language processing for mood-based recommendations
- Intelligent content discovery based on user preferences
- Personalized suggestions using Google Gemini AI
- Support for complex queries like "romantic comedy with good ratings"

### 🛡️ **Rate Limiting & Security**
- Built-in rate limiting to prevent API abuse
- IP-based request tracking
- Configurable limits per endpoint
- Admin monitoring dashboard

### 📱 **Modern UI/UX**
- Dark theme optimized for viewing
- Responsive design for all devices
- Fast loading with Next.js optimization
- Accessible design patterns

## 🏗️ Architecture

### **Frontend Stack**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management and lifecycle handling

### **Backend Integration**
- **TMDB API** - Movie and TV show data and streaming availability
- **Google Gemini AI** - Natural language processing for recommendations
- **Next.js API Routes** - Server-side API endpoints
- **Edge Runtime** - Fast serverless functions

### **Data Flow**
```
User Input → Next.js Frontend → API Routes → External APIs → Processed Response → UI Update
```

## 🔌 API Integrations

### **The Movie Database (TMDB) API**

StreamFinder integrates with TMDB to provide comprehensive movie and TV show data:

- **Search Endpoints**: Multi-search across movies and TV shows
- **Discover Endpoints**: Genre-based content discovery
- **Watch Providers**: Real-time streaming availability data
- **Media Details**: Ratings, release dates, cast, and plot information

**Key Features:**
- Automatic caching with Next.js revalidation
- Error handling and fallback responses
- Image optimization for posters and backdrops
- Country-specific provider information (US by default)

### **Google Gemini AI Integration**

The AI recommendation system uses Google's Gemini 1.5 Flash model for intelligent content discovery:

**Prompt Processing Pipeline:**
1. **Natural Language Analysis** - Parse user mood and preferences
2. **Criteria Extraction** - Convert to structured search parameters
3. **Content Matching** - Find relevant movies/TV shows via TMDB
4. **Result Ranking** - Sort by relevance and ratings
5. **Explanation Generation** - Create user-friendly explanations

**AI Capabilities:**
- Genre identification and mapping
- Mood and sentiment analysis
- Rating preference understanding
- Year/decade preference extraction
- Media type classification (movie vs TV)

**Example Query Processing:**
```
Input: "I want a feel-good romantic comedy with good ratings"
↓
AI Analysis: {
  mediaType: "movie",
  genres: ["romance", "comedy"],
  minRating: 7.0,
  mood: "feel-good"
}
↓
TMDB Search: Discover movies with romance + comedy genres, rating ≥ 7.0
↓
Output: Curated list with AI explanation
```

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js 18.17+ 
- npm, yarn, or pnpm
- TMDB API account
- Google AI Studio account

### **Environment Variables**
Create a `.env.local` file in the root directory:

```bash
# TMDB API Configuration
TMDB_API_KEY=your_tmdb_api_key_here

# Google Gemini AI Configuration  
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Admin monitoring
ADMIN_TOKEN=your_admin_token_for_monitoring
```

### **Getting API Keys**

#### **TMDB API Key:**
1. Visit [TMDB](https://www.themoviedb.org/)
2. Create an account and go to Settings → API
3. Request an API key (free for non-commercial use)
4. Copy your API Read Access Token

#### **Google Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the generated key

### **Installation Steps**

```bash
# Clone the repository
git clone https://github.com/yourusername/streamfinder.git
cd streamfinder

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
find-my-streaming/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes
│   │   │   ├── recommendations/      # AI recommendation endpoint
│   │   │   └── admin/               # Admin monitoring
│   │   ├── recommendations/          # AI recommendations page
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Home page
│   ├── components/                   # React components
│   │   ├── layout/                  # Layout components
│   │   ├── ui/                      # Reusable UI components
│   │   ├── RecommendationSearch.tsx # AI recommendation interface
│   │   ├── search-bar.tsx           # Search input component
│   │   ├── search-results.tsx       # Search results display
│   │   └── streaming-providers.tsx  # Provider availability
│   ├── hooks/                       # Custom React hooks
│   │   └── useRecommendations.ts    # AI recommendation logic
│   ├── lib/                         # Utility libraries
│   │   ├── api/                     # API clients
│   │   ├── services/                # Business logic
│   │   └── middleware/              # Request middleware
│   └── types/                       # TypeScript definitions
├── public/                          # Static assets
├── package.json                     # Dependencies and scripts
├── tailwind.config.js              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
└── next.config.ts                  # Next.js configuration
```

## 🔧 Configuration

### **Rate Limiting Configuration**

The application includes built-in rate limiting to protect against API abuse:

```typescript
// Default rate limits
const rateLimiters = {
  recommendations: new RateLimiter({
    maxRequests: 10,        // 10 requests per user
    windowMs: 15 * 60 * 1000, // 15 minutes
  }),
  search: new RateLimiter({
    maxRequests: 60,        // 60 requests per user  
    windowMs: 15 * 60 * 1000, // 15 minutes
  })
};
```

### **TMDB Configuration**

```typescript
// Genre mapping for AI recommendations
const GENRE_MAPPING = {
  'action': 28,
  'comedy': 35,
  'drama': 18,
  'horror': 27,
  'romance': 10749,
  'sci-fi': 878,
  'thriller': 53,
  // ... additional genres
};
```

### **AI Model Configuration**

```typescript
// Gemini AI settings
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash' // Fast, cost-effective model
});
```

## 📖 Usage Examples

### **Basic Title Search**
```typescript
// Search for a specific movie or TV show
const results = await getSearchResults("Breaking Bad");
```

### **AI Recommendation Request**
```typescript
// Get AI-powered recommendations
const recommendations = await getRecommendations(
  "I want to watch something funny and uplifting"
);
```

### **Watch Provider Information**
```typescript
// Get streaming availability
const providers = await getWatchProviders("movie", 550); // Fight Club
```

## 🔍 API Endpoints

### **GET /api/admin/stats**
Returns rate limiting statistics and usage metrics.
- **Authentication**: Bearer token required
- **Response**: JSON with current usage statistics

### **POST /api/recommendations**
Generates AI-powered content recommendations.
- **Body**: `{ prompt: string }`
- **Rate Limit**: 10 requests per 15 minutes
- **Response**: `{ results: SearchResult[], explanation: string }`

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
```

### **Environment Variables for Production**
Ensure these are set in your deployment platform:
- `TMDB_API_KEY`
- `GOOGLE_GEMINI_API_KEY` 
- `ADMIN_TOKEN` (optional)

### **Performance Considerations**
- Enable caching for TMDB API responses
- Use Next.js Image Optimization for posters
- Implement proper error boundaries
- Monitor API usage and costs

## 📊 Monitoring & Analytics

### **Built-in Monitoring**
- Rate limiting metrics via `/api/admin/stats`
- Request logging for debugging
- Error tracking and reporting

### **Recommended External Tools**
- **Vercel Analytics** - Page views and performance
- **Sentry** - Error tracking and monitoring
- **Google Analytics** - User behavior insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Use TypeScript for all new code
- Follow the existing code style and patterns
- Add tests for new functionality
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **The Movie Database (TMDB)** - For comprehensive movie and TV data
- **Google AI** - For powering intelligent recommendations
- **Next.js Team** - For the excellent React framework
- **Vercel** - For seamless deployment and hosting

## 📞 Support

For questions, issues, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review the API integration guides

---

**Built with ❤️ using Next.js, TypeScript, and AI**