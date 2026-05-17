import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { ErrorBoundary } from './components/ErrorBoundary'
import { preloadCorpus } from './services/ai'

// Code-split the heavier secondary pages. Home stays eager — it's the
// first paint on most visits and we want it instant. The others load on
// demand; the initial JS bundle shrinks significantly.
const Explorer = lazy(() => import('./pages/Explorer').then((m) => ({ default: m.Explorer })))
const Assistant = lazy(() => import('./pages/Assistant').then((m) => ({ default: m.Assistant })))
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })))
const Signup = lazy(() => import('./pages/Signup').then((m) => ({ default: m.Signup })))
const Bookmarks = lazy(() => import('./pages/Bookmarks').then((m) => ({ default: m.Bookmarks })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

const PageLoader = () => (
  <div className="min-h-[40vh] flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-brand-500/70" />
  </div>
)

function App() {
  // Pull every constitution + article from Supabase into the AI's TF-IDF
  // index so the assistant can answer about any country, not just the
  // 29 bundled ones. Failures fall back to the bundled corpus silently.
  useEffect(() => {
    preloadCorpus();
  }, []);
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system">
        <AuthProvider>
          <DataProvider>
            <Router>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="explorer" element={<Explorer />} />
                    <Route
                      path="explorer/:constitutionId"
                      element={<Explorer />}
                    />
                    <Route path="assistant" element={<Assistant />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="bookmarks" element={<Bookmarks />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
