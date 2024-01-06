import './App.css';
import React, { useEffect } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  RouterProvider,
  Route,
  Router,
  BrowserRouter,
  Routes,
} from 'react-router-dom';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import WebFontLoader from 'webfontloader';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Products from './pages/Products/Products';
import ForgetPassword from './pages/ForgetPassword/ForgetPassword';
import Account from './pages/Account/Account';
import store from './store';
import { loadUser } from './redux/actions/userAction';
import { useSelector } from 'react-redux';
import UserOptions from './components/UserOptions/UserOptions';
import Orders from './pages/Orders/Orders';
import Dashboard from './pages/Dashboard/Dashboard';
import Cart from './pages/Cart/Cart';
import ProtectedRoute from './pages/ProtectedRoute/ProtectedRoute';
import EditProfile from './pages/EditProfile/EditProfile';
import PasswordUpdate from './pages/PasswordUpdate/PasswordUpdate';
import ResetPassword from './pages/ResetPassword/ResetPassword';

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet /> {/*////this is used to render child */}
      <Footer />
    </>
  );
};

const router = (isAuthenticated, user) =>
  createBrowserRouter(
    [
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            path: '/',
            element: (
              <>
                {isAuthenticated && <UserOptions user={user} />}
                <Home />
              </>
            ),
          },
          {
            path: '/orders',
            element: (
              <>
                {isAuthenticated && <UserOptions user={user} />}
                <Orders />
              </>
            ),
          },
          {
            path: '/dashboard',
            element: (
              <>
                {isAuthenticated && <UserOptions user={user} />}
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </>
            ),
          },
          {
            path: '/cart',
            element: (
              <>
                {isAuthenticated && <UserOptions user={user} />}
                <Cart />
              </>
            ),
          },
          {
            path: '/products',
            element: <Products />,
          },
          {
            path: '/product/new',
            element: (
              <ProtectedRoute>
                <h2>Create Product</h2>,
              </ProtectedRoute>
            ),
          },
          {
            path: '/product/:id',
            element: <ProductDetails />,
          },
          {
            path: '/account',
            element: <Account />,
          },
          {
            path: '/me/update',
            element: (
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            ),
          },
          {
            path: '/password/update',
            element: (
              <ProtectedRoute>
                <PasswordUpdate />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: '/password/forgot',
        element: <ForgetPassword />,
      },
      {
        path: '/password/reset/:token',
        element: <ResetPassword />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '*',
        element: <h2>Not Found</h2>,
      },
    ],
    { basename: '/' }
  );

const App = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);

  let token = localStorage.getItem('token');
  token = token ? JSON.parse(token) : undefined;

  //this is used for donwload the font before loading the app
  //any font we give in below array and if we use then it will load before load the component
  useEffect(() => {
    WebFontLoader.load({
      google: {
        families: ['Roboto', 'Droid Sans', 'Chilanka', 'Inter'],
      },
    });

    store.dispatch(loadUser(token));
  }, [token]);
  return (
    <div className='app'>
      {/* <BrowserRouter>
          <Header />
        <Routes>
          <Route exact path='/' element={<Home />} />
        </Routes>
      </BrowserRouter> */}
      <RouterProvider router={router(isAuthenticated, user)} />
    </div>
  );
};

export default App;
