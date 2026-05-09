import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Explorer } from './pages/Explorer'
import { Assistant } from './pages/Assistant'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Bookmarks } from './pages/Bookmarks'
import { preloadCorpus } from './services/ai'

function App() {
  // Pull every constitution + article from Supabase into the AI's TF-IDF
  // index so the assistant can answer about any country, not just the
  // 29 bundled ones. Failures fall back to the bundled corpus silently.
  useEffect(() => {
    preloadCorpus();
  }, []);
  return (
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="explorer" element={<Explorer />} />
              <Route path="explorer/:constitutionId" element={<Explorer />} />
              <Route path="assistant" element={<Assistant />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="bookmarks" element={<Bookmarks />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
