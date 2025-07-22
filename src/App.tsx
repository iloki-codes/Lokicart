import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, useEffect } from 'react';
import { Suspense } from 'react';
import { Toaster } from "react-hot-toast";

import Loader from './components/Loader.tsx';
import Header from "./components/header.tsx";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.ts";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userExistNot } from "./redux/reducer/userReducer.ts";
import { getUser } from "./redux/api/userAPI.ts";
import { UserReducerInitialState } from "./types/reducer.types.ts";
import Footer from "./components/footer.tsx";

const Home = lazy (() => import('./pages/home.tsx'));
const Search = lazy (() => import('./pages/search.tsx'));
const Cart = lazy (() => import('./pages/cart.tsx'));

const Login = lazy (() => import('./pages/login.tsx'));

const SafeRoute = lazy(() => import('./components/safe.routes.tsx'));
const Shipping = lazy (() => import('./pages/shipping.tsx'));
const Orders = lazy (() => import('./pages/orders.tsx'));
const OrderDetails = lazy (() => import('./pages/order-details.tsx'));
const NotFound = lazy (() => import('./pages/not-found.tsx'));
const Checkout = lazy(() => import('./pages/checkout.tsx'));

// ADMIN ROUTES

const Dashboard = lazy(() => import("./pages/admin/dashboard.tsx"));
const Products = lazy(() => import("./pages/admin/products.tsx"));
const Customers = lazy(() => import("./pages/admin/customers.tsx"));
const Transaction = lazy(() => import("./pages/admin/transaction.tsx"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts.tsx"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts.tsx"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts.tsx"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon.tsx"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch.tsx"));
const Toss = lazy(() => import("./pages/admin/apps/toss.tsx"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct.tsx"));
const ProductManagement = lazy(() => import("./pages/admin/management/productmanagement.tsx"));
const TransactionManagement = lazy(() => import("./pages/admin/management/transactionmanagement.tsx"));


const App = () => {

  const { user, loading } = useSelector( (state: { userReducer: UserReducerInitialState}

  ) => state.userReducer );

  const dispatch = useDispatch();

  useEffect(() => {

    onAuthStateChanged(auth, async (user) => {      // this'll be called when something happens in firebase

      if(user) {
        console.log("Logged In!");

        const data = await getUser(user.uid);

        dispatch(userExist(data.user));

      } else {
        console.log("Not Logged In!");

        dispatch(userExistNot());
      }

    });

  }, []);

  return loading ? <Loader /> : (

    <Router>

      <Header user={user}/>

      <Suspense fallback={<Loader />}>

        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />

          {/* Before logging in */}
          <Route path="/login" element={
            <SafeRoute isAuthenticated={user ? false : true}>
              <Login />
            </SafeRoute>} />

          {/*Logged in user routes  */}
          <Route element={<SafeRoute isAuthenticated={user ? true : false} />}>
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/pay" element={<Checkout />} />
          </Route>

          {/* ADMIN ROUTES */}

          <Route element={<SafeRoute
              isAuthenticated={true}
              adminRoute={true}
              isAdmin={user?.role === "admin" ? true : false}
            />}>

            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />

         {/* Charts */}
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />

          {/* Apps */}
            <Route path="/admin/app/coupon" element={<Coupon />} />
            <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/app/toss" element={<Toss />} />

          {/* Management */}
            <Route path="/admin/product/new" element={<NewProduct />} />
            <Route path="/admin/product/:id" element={<ProductManagement />} />
            <Route path="/admin/transaction/:id" element={<TransactionManagement />} />

          </Route>

          <Route path="*" element={<NotFound />} />

        </Routes>

      </Suspense>

      <Toaster position="bottom-center" />

      <Footer />

    </Router>
  );

}

export default App;