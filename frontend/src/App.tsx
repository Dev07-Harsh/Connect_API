
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/landingpage'
import AuthPage from './pages/AuthPage'
import LearnMorePage from './pages/LearnMorePage'
import AdminHomePage from './pages/AdminHomePage'
import AdminLayout from './layout/AdminLayout'
import MyAPIs from './pages/MyApi'
import AdminListApiPage from './pages/ListApi'
import MyApiLayout from './layout/MyApiLayout'
import EditApiPage from './pages/UpdateApi'
import UserPage from './userPages/Main'
import UserDashboard from './userPages/Dashboard'
import BookmarksPage from './userPages/Bookmarks'
import HistoryPage from './userPages/History'

const router = createBrowserRouter([
  {
    path : '/',
    element : <LandingPage/>
  },
  {
    path : '/login',
    element : <AuthPage/>
  },
  {
    path : '/signup',
    element : <AuthPage/>
  },{
    path : '/learn-more',
    element : <LearnMorePage/>
  },{
    path : '/admin/',
    element : <AdminLayout/>,
    children : [{
      path : "",
      element : <AdminHomePage/>
    },{
      path : 'my-apis',
      element : <MyApiLayout/>,
      children : [{
        path : '',
        element : <MyAPIs/>
      },{
        path : 'update-api/:id',
        element : <EditApiPage/>
      }]
    },{
      path : 'create-api',
      element : <AdminListApiPage/>
    }]
    
  },{
    path : '/user',
    element: <UserPage/>
  },{
    path : '/user/dashboard',
    element: <UserDashboard/>
  },{
    path : '/user/bookmarks',
    element: <BookmarksPage/>
  },{
    path : '/user/history',
    element: <HistoryPage/>
  }
])

function App() {
  

  return (
    <>
     <RouterProvider router={router}/>
    </>
  )
}

export default App
