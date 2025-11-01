# GitHub User Finder

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd github-user-finder
   ```

2. **Set environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## Usage

1. **Search for a user**: Enter a GitHub username in the search bar (e.g., "octocat")
2. **View profile**: See the user's profile information and statistics
3. **Browse repositories**: Click the "Repositories" tab to see their public repos
4. **Infinite scroll**: Scroll down to automatically load more repositories
5. **Toggle theme**: Click the sun/moon icon in the top-right to switch themes
6. **Explore details**: Click on repository names to visit them on GitHub

### API Integration
- Base URL: `https://api.github.com`
- Endpoints:
  - `GET /users/{username}` - User profile
  - `GET /users/{username}/repos` - User repositories
- Smart caching with memory + localStorage
- Automatic pagination for repositories

### Performance Optimizations
- Debounced search input (500ms)
- Memoized theme creation
- Efficient re-renders with proper dependency arrays
- Intersection Observer for infinite scroll
- Cached API responses

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Rate Limits

GitHub API allows:
- **Unauthenticated**: 60 requests/hour
- **Authenticated**: 5,000 requests/hour

# github-user-finder
