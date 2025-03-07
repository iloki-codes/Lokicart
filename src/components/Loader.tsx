
const Loader = () => {
  return (
    <div className="loader">Loader</div>
  )
}

export default Loader;

export const DeadLoader = ({width = "unset"} : {width?: string}) => {
  return (
    <div className="dead-loader" style={{width}}>
      <div className="dead"></div>
      <div className="dead"></div>
      <div className="dead"></div>
    </div>
  );
};