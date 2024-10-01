
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy } from 'react';

const Dashboard = lazy(() => import("./admin/dashboard.tsx"));
const Products = lazy(() => import("./admin/products.tsx"));
const Customers = lazy(() => import("./admin/customers.tsx"));
const Transaction = lazy(() => import("./admin/transaction.tsx"));
const Barcharts = lazy(() => import("./admin/charts/barcharts.tsx"));
const Piecharts = lazy(() => import("./admin/charts/piecharts.tsx"));
const Linecharts = lazy(() => import("./admin/charts/linecharts.tsx"));
const Coupon = lazy(() => import("./admin/apps/coupon.tsx"));
const Stopwatch = lazy(() => import("./admin/apps/stopwatch.tsx"));
const Toss = lazy(() => import("./admin/apps/toss.tsx"));
const NewProduct = lazy(() => import("./admin/management/newproduct.tsx"));
const ProductManagement = lazy(
  () => import("./admin/management/productmanagement.tsx")
);
const TransactionManagement = lazy(
  () => import("./admin/management/transactionmanagement.tsx")
);


const Admin = () => {
  return (

    <Router>
            
      <Routes>
              
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
    
      </Routes>
    
    </Router>
  
  )

}

export default Admin;