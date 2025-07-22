
const Loader = () => {
  return (
    <section className="loader">
      <div></div>
    </section>
  )
}

export const Loadercss = () => {
  return (
    <section style={{height: "calc(100vh - 4rem)",}} className="loader">
      <div></div>
    </section>
  )
};

export default Loader;

interface DeadLoaderProps {
  width?: string;
  length?: number;
  height?: string;
  containerHeight?: string;
}

export const DeadLoader = ({
  width = "unset",
  length = 3,
  height = "30px",
  containerHeight = "unset" } : DeadLoaderProps) => {

  const dead = Array.from({ length }, (_, idx) => (
    <div key={idx} className="deadmoji" style={{ height }}></div>
  ));

    return (
    <div className="dead-loader" style={{ width, height: containerHeight }}>
      {dead}
    </div>
  );

};