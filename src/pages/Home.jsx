import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

const Home = () => {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    console.log("Number has changed");
  }, [number]);

  const handleClick = () => {
    setNumber(number + 1);
  };

  return (
    <div>
      <Navbar />
      <h1>Home</h1>
      <h1>{number}</h1>
      <button onClick={handleClick}>Click</button>
    </div>
  );
};

export default Home;
