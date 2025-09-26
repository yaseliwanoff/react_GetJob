import { Outlet } from 'react-router-dom';
import Footer from '../footer/Footer';
import Header from '../../pages/LandingPage/components/Header';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default MainLayout
