import { FaTrash } from "react-icons/fa";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Order, OrderItem } from "../../../types/types";
import { server } from "../../../redux/store";
import { UserReducerInitialState } from "../../../types/reducer.types";
import { useSelector } from "react-redux";
import { useDeleteOrderMutation, useGetOrderDetailsQuery, useProcessOrderMutation } from "../../../redux/api/orderAPI";
import { DeadLoader } from "../../../components/Loader";
import { responseToast } from "../../../types/utils.features";

const defaultData: Order = {
    shippingInfo: {
        address: "",
        city: "",
        country: "",
        state: "",
        pinCode: "",
    },
    status: "",
    subtotal: 0,
    shippingCharges: 0,
    tax: 0,
    discount: 0,
    total: 0,
    orderItems: [],
    user: {
        name: "",
        _id: ""
    },
    _id: ""
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItem) => (
  <div className="transaction-product-card">
    <img src={`${server}/${photo}`} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

const TransactionManagement = (): JSX.Element => {

    const { user } = useSelector(
        (state: { userReducer: UserReducerInitialState }) => state.userReducer
    );

    const params = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useGetOrderDetailsQuery(params._id!);

    const {
        shippingInfo: { address, city, state, country, pinCode },
        orderItems,
        user:{name},
        status,
        subtotal,
        shippingCharges,
        tax,
        discount,
        total,
    } = data?.order || defaultData;


    const [updateOrder] = useProcessOrderMutation();
    const [deleteOrder] = useDeleteOrderMutation();

    const deleteHandler = async () => {
        const res = await deleteOrder({
            userId: user?._id!,
            orderId: data?.order._id!
        });
        responseToast(res, navigate, "/admin/transaction/");
    };

    const updateHandler = async () => {

        const res = await updateOrder({
            orderId: data?.order._id!,
            userId: user?._id!

        });
        responseToast(res, navigate, "/admin/transaction/");
    };

    // if (isError) return <Navigate to={"/404"} />;


    return (

        <div className="admin-container">

            <AdminSidebar />

                <main className="product-management">

                    { isLoading ? <DeadLoader length={5} /> : (

                    <>

                        <section
                            style={{
                            padding: "2rem",
                            }}
                        >
                        <h2>Order Items</h2>

                        {orderItems.map((i) => (

                            <ProductCard
                                key={i._id}
                                name={i.name}
                                photo={`${server}/${i.photo}`}
                                productId={i.productId}
                                _id={i._id}
                                quantity={i.quantity}
                                price={i.price}
                            />
                        ))}
                        </section>

                        <article className="shipping-info-card">
                        <button className="product-delete-btn" onClick={deleteHandler}>
                            <FaTrash />
                        </button>
                        <h1>Order Info</h1>
                        <h5>User Info</h5>
                        <p>Name: {name}</p>
                        <p>
                            Address: {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
                        </p>
                        <h5>Amount Info</h5>
                        <p>Subtotal: {subtotal}</p>
                        <p>Shipping Charges: {shippingCharges}</p>
                        <p>Tax: {tax}</p>
                        <p>Discount: {discount}</p>
                        <p>Total: {total}</p>

                        <h5>Status Info</h5>
                        <p>
                            Status:{" "}
                            <span className={
                                status === "Processing"
                                ? "blue"
                                : status === "Shipped"
                                ? "purple"
                                : status === "On the way"
                                ? "yellow"
                                : status === "Delivered"
                                ? "green"
                                : "red"
                            }
                            >
                            {status}
                                </span>
                            </p>
                            <button className="shipping-btn" onClick={updateHandler}>
                                Process Status
                            </button>
                            </article>

                    </>

                    )
                }
            </main>

    </div>

    );
};

export default TransactionManagement;
