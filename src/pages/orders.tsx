import { ReactElement, useEffect, useState } from "react";
import TableHOC from "../components/admin/TableHOC";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import { useSelector } from "react-redux";
// import { UserReducerInitialState } from "../types/reducer.types";
import { useMyOrdersQuery } from "../redux/api/orderAPI";
import toast from "react-hot-toast";
import { CustomError } from "../types/api-types";
import { DeadLoader } from "../components/Loader";
import { RootState } from "../redux/store";

type DataType = {
    _id: string;
    amount: number;
    quantity: number;
    discount: number;
    status: ReactElement;
    action: ReactElement;
}

const arr: Array<DataType> = [];

const column: Column<DataType>[] = [{
    Header: "ID",
    accessor: "_id",
}, {
    Header: "Quantity",
    accessor: "quantity",
}, {
    Header: "Amount",
    accessor: "amount",
},
   {
    Header: "Discount",
    accessor: "discount",
}, {
    Header: "Status",
    accessor: "status",
}, {
    Header: "Action",
    accessor: "action",
}]

const Orders = () => {

    const { user } = useSelector(
        (state: RootState) => state.userReducer
      );

      const { data, isLoading, isError, error } = useMyOrdersQuery(user?._id!);

      const [rows, setRows] = useState<DataType[]>(arr);

      if (isError) toast.error((error as CustomError).data.message);

      const Table = TableHOC<DataType>(
        column,
        rows,
        "dashboard-product-box",
        "Orders",
        true
        )();

      useEffect(() => {

          if (data)
            setRows(
              data?.orders.map( (i) => ({
                _id: i._id,
                amount: i.total,
                discount: i.discount,
                quantity: i.orderItems.length,
                status: (
                  <span className={
                    i.status === "Processing"
                    ? "blue"
                    : i.status === "Shipped"
                    ? "purple"
                    : i.status === "On the way"
                    ? "yellow"
                    : i.status === "Delivered"
                    ? "green"
                    : "red"
                  }
                  >
                    {i.status}
                  </span>),
                action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>
              })
            )
          )
        }, [data]);

    return (

        <div className="container">

            <h1>My Orders</h1>

            { isLoading ? <DeadLoader length={6} /> : Table}

        </div>
  )

}

export default Orders;