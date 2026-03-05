import { Routes, Route } from 'react-router-dom'
import Layout from './shared/components/Layout'
import HomePage from './pages/HomePage'
import UserDetailPage from './pages/UserDetailPage'
import CountriesPage from './pages/CountriesPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users/:uuid" element={<UserDetailPage />} />
        <Route path="/countries" element={<CountriesPage />} />
      </Routes>
    </Layout>
  )
}
