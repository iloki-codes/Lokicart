import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducer.types";
import { CustomError } from "../../types/api-types";
import toast from "react-hot-toast";
import { useGetAllOrdersQuery } from "../../redux/api/orderAPI";
import { DeadLoader } from "../../components/Loader";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const arr: Array<DataType> = [];

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transaction = () => {

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const { data, isLoading, isError, error } = useGetAllOrdersQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>(arr);

  
  if (isError) toast.error((error as CustomError).data.message);

  useEffect(() => {
      
      if (data) 
        setRows(
          data.orders.map( (i) => ({
            user: i.user?.name || "Unknown User",
            amount: i.total,
            discount: i.discount,
            quantity: i.orderItems.length,
            status: (
              <span className={
                i.status === "Processing"
                ? "red"
                : i.status === "Shipped"
                ? "green"
                : "purple"
              }
              >
                {i.status}
              </span>),
            action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>
          })
        )
      )
    }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();


  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{ isLoading ? <DeadLoader /> : Table}</main>
    </div>
  );
};

export default Transaction;
