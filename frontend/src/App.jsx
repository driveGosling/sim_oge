import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import fakeData from "./data/data.js";
import Header from "./components/Header.jsx";
import Test from "./pages/TestPage.jsx";
import Main from "./pages/MainPage.jsx";
import Footer from "./components/Footer.jsx";
import { VariantProvider, useVariant } from "./contexts/VariantContext.jsx";

const AppRoutes = ({ variantsList }) => {
  const { customVariant } = useVariant();

  return (
    <Routes>
      <Route path="/" element={<Main variantsList={variantsList} />} />
      {variantsList.map((v) => (
        <Route
          key={v.id}
          path={`/test/${v.id}`}
          element={<Test variant={v} />}
        />
      ))}
      <Route path={"/test/custom"} element={<Test variant={customVariant} />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

const App = () => {
  const [variantsList, setVariantsList] = useState([]);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/variants");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const variants = await response.json();
        setVariantsList(variants);
      } catch (e) {
        console.log("Error fetching tests:", e);
        setVariantsList(fakeData.variants);
      }
    };

    fetchVariants();
  }, []);

  return (
    <VariantProvider>
      <BrowserRouter>
        <Header />
        <AppRoutes variantsList={variantsList} />
        <Footer />
      </BrowserRouter>
    </VariantProvider>
  );
};

export default App;
