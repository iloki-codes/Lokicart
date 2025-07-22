import AdminSidebar from "../../../components/admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
// import categories from "../../../assets/data.json";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { usePieQuery } from "../../../redux/api/dashboardApi";
// import { CustomError } from "../../../types/api-types";
// import toast from "react-hot-toast";
import { DeadLoader } from "../../../components/Loader";
import { Navigate } from "react-router-dom";

const PieCharts = () => {

    const { user } = useSelector((state:RootState) => state.userReducer);

    const {isLoading, data, isError} = usePieQuery(user?._id!);

    console.log("id passsed", user?._id);
    console.log({data});

    const order = data?.charts.orderFullfillment!;
    const catg = data?.charts.categoryStats!;
    const stock = data?.charts.stockAvailability!;
    const rev = data?.charts.revenueDistribution!;
    const age = data?.charts.userAgeRatio!;
    const who = data?.charts.adminCustomer!;

    if (isError || isLoading) {
      // const err = error as CustomError;
      // toast.error(err.data.message);

      return <Navigate to={"/admin/dashboard"} />;
    }

    // if (isLoading) {
    //   return <div style={{color: "white"}}>Loading</div>
    // }

  return (

    <div className="admin-container">

      <AdminSidebar />

      <main className="chart-container">

        <h1>Pie & Doughnut Charts</h1>

          { isLoading ? <DeadLoader length={20} /> : (

            <>

              <section>
                <div>
                  <PieChart
                    labels={["Processing", "Shipped", "On The Way", "Delivered", "Cancelled"]}
                    data={[
                      order.processing,
                      order.shipped,
                      order.onTheWay,
                      order.delivered,
                      order.cancelledOrder
                    ]}
                    backgroundColor={[
                      `hsl(110,80%, 80%)`,
                      `hsl(110,80%, 50%)`,
                      `hsl(110,40%, 50%)`,
                    ]}
                    offset={[0, 0, 50]}
                  />
                </div>
                <h2>Order Fulfillment Ratio</h2>
              </section>

              <section>
                <div>
                  <DoughnutChart
                    labels={catg.map((i) => Object.keys(i)[0])}

                    data={catg.map((i) => Object.values(i)[0])}

                    backgroundColor={catg.map(
                      (i) => `hsl(${Object.values(i)[0] * 4}, ${Object.values(i)[0]}%, 50%)`
                    )}

                    legends={false}
                    offset={[0, 0, 0, 80]}
                  />
                </div>

                <h2>Product Categories Ratio</h2>

              </section>

              <section>
                <div>
                  <DoughnutChart
                    labels={["In Stock", "Out Of Stock"]}
                    data={[stock.inStock, stock.stockOut]}
                    backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
                    legends={false}
                    offset={[0, 80]}
                    cutout={"70%"}
                  />
                </div>

                <h2> Stock Availability</h2>

              </section>

              <section>
                <div>
                  <DoughnutChart
                    labels={[
                      "Production Cost",
                      "Net Margin",
                      "Discount",
                      "Marketing Cost",
                      "Burnt"
                    ]}
                    data={[
                      rev.productCost,
                      rev.netMargin,
                      rev.discountExpenses,
                      rev.marketingCost,
                      rev.loss,
                    ]}
                    backgroundColor={[
                      "hsl(110,80%,40%)",
                      "hsl(19,80%,40%)",
                      "hsl(69,80%,40%)",
                      "hsl(300,80%,40%)",
                      "rgb(53, 162, 255)",
                    ]}
                    legends={false}
                    offset={[20, 30, 20, 30, 80]}
                  />
                </div>
                <h2>Revenue Distribution</h2>
              </section>

              <section>
                <div>
                  <PieChart
                    labels={[
                      "Teenager(Below 18)",
                      "Youth (18-30)",
                      "Adult (31-60)",
                      "Old (60+)",
                    ]}
                    data={[
                      age["18-"],
                      age["18-30"],
                      age["31-60"],
                      age["60+"]
                    ]}
                    backgroundColor={[
                      `hsl(10, ${80}%, 80%)`,
                      `hsl(10, ${80}%, 50%)`,
                      `hsl(10, ${40}%, 50%)`,
                    ]}
                    offset={[0, 0, 50]}
                  />
                </div>
                <h2>Users Age Group</h2>
              </section>

              <section>
                <div>
                  <DoughnutChart
                    labels={["Admin", "Customers"]}
                    data={[who.admin, who.customer]}
                    backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
                    offset={[0, 50]}
                  />
                </div>
              </section>
            </>
           )
          }

      </main>

    </div>

  );

};

export default PieCharts;
