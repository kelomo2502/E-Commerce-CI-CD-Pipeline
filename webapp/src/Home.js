import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [homeData, setHomeData] = useState("");
  const [servicesData, setServicesData] = useState("");
  const [error, setError] = useState("");

  // Fetch Home Data
  const fetchHomeData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/");
      setHomeData(response.data.message);
      console.log(response.data.message)
     
    } catch (err) {
      setError("Error fetching home data");
    }
  };

  // Fetch Services Data
  const fetchServicesData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/services");
      setServicesData(response.data.message);
   
    } catch (err) {
      setError("Error fetching services data");
    }
  };

  useEffect(() => {
    fetchHomeData();
    fetchServicesData();
    
  }, []);

  useEffect(() => {
    if (homeData) {
      console.log("Home Data:", homeData);
    }
    if (servicesData) {
      console.log("Services Data:", servicesData);
    }
  }, [homeData, servicesData]); // Run when homeData or servicesData changes

  return (
    <div>
      <h1>React Frontend</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <h2>Home Data</h2>
        <p>{homeData ? homeData : 'Loading...'}</p>
      </div>
      <div>
        <h2>Services Data</h2>
        <p>{servicesData ? servicesData : 'Loading...'}</p>
      </div>
    </div>
  );
};

export default Home;
