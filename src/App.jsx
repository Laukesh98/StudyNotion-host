
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from '../src/pages/Home.jsx'
import Navbar from './Components/common/Navbar.jsx'
import OpenRoute from './Components/core/Auth/OpenRoute.jsx'

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from './pages/ForgotPassword.jsx'
import UpdatePassword from './pages/UpdatePassword.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import MyProfile from './Components/core/Dashboard/MyProfile.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PrivateRoute from './Components/core/Auth/PrivateRoute.jsx'
import Error from './pages/Error.jsx'
import { ACCOUNT_TYPE } from './utils/constants.js'
import Cart from './Components/core/Dashboard/Cart/index.jsx'
import EnrolledCourses from './Components/core/Dashboard/EnrolledCourses.jsx'
import Settings from './Components/core/Dashboard/Settings/index.jsx'
import { useSelector } from 'react-redux'
import AddCourse from './Components/core/Dashboard/addCourse/index.jsx'
import MyCourses from './Components/core/Dashboard/MyCourses.jsx'
import EditCourse from './Components/core/Dashboard/EditCourse/index.jsx'
import Catalog from './pages/Catalog.jsx'
import CourseDetails from './pages/CourseDetails.jsx'
import ViewCourse from './pages/ViewCourse.jsx'
import VideoDetails from './Components/core/ViewCourse/VideoDetails.jsx'
import Instructor from '../src/Components/core/Dashboard/Settings/Instructor.jsx'



function App() {

  const { user } = useSelector((state) => state.profile)


  return (
    <div className='min-h-screen w-screen bg-richblack-900 flex flex-col font-inter'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='signup' element={
          <OpenRoute>
            <Signup />
          </OpenRoute>
        } >
        </Route>

        <Route path='login' element={
          <OpenRoute>
            <Login />
          </OpenRoute>
        }
        />

        <Route path='/forgot-password' element={
          <OpenRoute>
            <ForgotPassword />
          </OpenRoute>
        } />

        <Route path='/update-password/:id' element={
          <OpenRoute>
            <UpdatePassword />
          </OpenRoute>
        } />

        <Route path='/verify-email' element={
          <OpenRoute>
            <VerifyEmail />
          </OpenRoute>
        } />


        <Route path='/about' element={<About />} />
        <Route path="/contact" element={<Contact />} />



        <Route element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } >
          <Route path='dashboard/my-profile' element={<MyProfile />} />
          <Route path='dashboard/Settings' element={<Settings />} />

          {/* Routes only a student can access   */}
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path='dashboard/cart' element={<Cart />} />
                <Route path='dashboard/enrolled-courses' element={<EnrolledCourses />} />
              </>
            )
          }

          {/* Route only a instructor can access  */}
          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path='dashboard/add-course' element={<AddCourse />} />
                <Route path='dashboard/my-courses' element={<MyCourses />} />
                <Route path='dashboard/edit-course/:courseId' element={<EditCourse />} />
                <Route path='dashboard/instructor' element={<Instructor />} />
              </>
            )
          }
        </Route>


        <Route path='catalog/:catalogName' element={<Catalog />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />

        {/* Video streaming routes  */}
        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>


        <Route path='*' element={<Error />} />
      </Routes>



    </div>
  )
}

export default App
