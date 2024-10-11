import { ReactElement, useState } from "react";
import TableHOC from "../components/admin/TableHOC";
import { Link } from "react-router-dom";
import { Column } from "react-table";

type DataType = {
    _id: string;
    amount: number;
    quantity: number;
    discount: number;
    status: ReactElement;
    action: ReactElement;
}

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
    
    const [rows] = useState<DataType[]>([

        {
            _id: "lorem5686435464684kljmo",
            amount: 299,
            quantity: 100,
            discount: 59,
            status: <span className="yellow">Processing</span>,
            action: <Link to={`/order/lorem5686435464684kljmo`}>View</Link>
        }   
    
    ]);

    const Table = TableHOC<DataType>(
        column, 
        rows, 
        "dashboard-product-box",
        "Orders",
        true
    )();    //fefe

    return (
 
        <div className="container">
            
            <h1>My Orders</h1>
            {Table}
            
        </div>
  )

}

export default Orders;