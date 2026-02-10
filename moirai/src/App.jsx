import './color_palette.css'
import './App.css'
import Navbar from './components/MoiraiNavbar/MoiraiNavbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import DoughnutChart from './components/DoughtnutChart/DoughtnutChart.jsx'
import RadarChart from './components/RadarChart/RadarChart.jsx'


function App() {
  return (
    <>
    <Navbar />

    <DoughnutChart />

    <RadarChart />

    <Footer />
    </>
  )
}

export default App
