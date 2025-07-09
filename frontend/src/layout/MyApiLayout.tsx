import { Outlet } from "react-router-dom"
import AdminNavbar from "../Admincomponents/AdminNavbar"


const MyApiLayout = () => {
  return (
    <div className="bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white relative overflow-hidden min-h-screen">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%),
                           radial-gradient(circle at 75% 25%, #06b6d4 0%, transparent 50%),
                           radial-gradient(circle at 25% 75%, #6366f1 0%, transparent 50%)`,
          backgroundSize: '800px 800px',
          animation: 'float 20s ease-in-out infinite'
        }}></div>
      </div>
      
      {/* Elegant Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500/8 to-purple-600/8 rounded-full filter blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-3/4 w-80 h-80 bg-gradient-to-br from-cyan-500/6 to-blue-600/6 rounded-full filter blur-3xl animate-float animation-delay-4000"></div>
      </div>
      
      <AdminNavbar/>
      <div className="relative z-10">
        <Outlet/>
      </div>
    </div>
  )
}

export default MyApiLayout