import "./App.css";
import AddNewStock from "./components/AddNewStock";
import StockChart from "./components/StockChart";
import TodaysDate from "./components/TodaysDate";
import StockListHeader from "./components/StockListHeader";
import StockListTable from "./components/StockListTable";
import { useCallback, useEffect, useRef, useState } from "react";

function App() {
  const [openChart, setOpenChart] = useState<string>("NQ1!");
  const [stocks, setStocks] = useState<
    Array<{ symbol: string; name: string; sector: string }>
  >([]);
  const [newStockSymbol, setNewStockSymbol] = useState("");
  const [newStockName, setNewStockName] = useState("");
  const [newStockSector, setNewStockSector] = useState("");

  const inputRef = useRef(null);
  const stockWidgetRef = useRef(null);

  // Add new stock to the list
  const handleAddStock = () => {
    if (
      newStockSymbol.trim() !== "" &&
      newStockName.trim() !== "" &&
      newStockSector.trim() !== ""
    ) {
      const symbol = newStockSymbol.toLocaleUpperCase();
      if (stocks.some((stock) => stock.symbol === symbol)) {
        alert(`${symbol} already exists in the list!`);
        // Refocus on input
      } else {
        setStocks([
          ...stocks,
          {
            symbol,
            name: newStockName,
            sector: newStockSector,
          },
        ]);

        //Reset inputs
        setNewStockName("");
        setNewStockSector("");
        setNewStockSymbol("");
      }
    } else {
      alert("Please fill all the fields!!");
    }
  };

  const handleEditStock = (
    stockSymbol: string,
    newName: string,
    newSector: string
  ) => {
    const updatedStocks = stocks.map((stock) => {
      if (stock.symbol === stockSymbol) {
        return {
          ...stock,
          symbol: stockSymbol,
          name: newName || stock.name,
          sector: newSector || stock.sector,
        };
      }
      return stock;
    });

    setStocks(updatedStocks);
  };

  const handleRemoveStock = (stockSymbol: string) => {
    if (
      window.confirm(
        `Are you sure you want to remove this stock with Symbol: ${stockSymbol}`
      )
    ) {
      const updatedStocks = stocks.filter(
        (stock) => stock.symbol !== stockSymbol
      );
      setStocks(updatedStocks);
    }
  };

  const openStockWidget = (symbol: string) => {
    stockWidgetRef.current!.scrollIntoView({
      behavior: "smooth",
    });
    setOpenChart(symbol);
  };

  //load and save stocks list to local storage

  useEffect(() => {
    const savedStocks = localStorage.getItem("stocksList");
    if (savedStocks) {
      setStocks(JSON.parse(savedStocks));
    }
  }, []);

  useEffect(() => {
    if (stocks.length > 0) {
      localStorage.setItem("stocksList", JSON.stringify(stocks));
    }
  }, [stocks]);

  const saveStockListToJSON = () => {
    const data = JSON.stringify(stocks, null, 2);
    const blob = new Blob([data], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stocks.json";
    a.click();
  };

  const setTradingView = useCallback(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
    script.async = true;
    script.innerHTML = `
    {
     "symbol":${openChart},
     "widget":"100%",
     "locale":"en",
     "colorTheme":"light",
     "isTransparent":true
    }
    `;
    const container = document.querySelector(
      ".tradingview-widget-container__widget"
    );
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }
  }, [openChart]);

  useEffect(() => {
    setTradingView();
  }, [setTradingView]);

  return (
    <div className="container container-md flex flex-col text-white bg-slate-900 xl:flex-row gap-5 max-w-[100vw]">
      <header className="flex flex-col mt-2">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold mb-4">Stock wishlist</h1>
          <TodaysDate />
        </div>
        <div
          ref={stockWidgetRef}
          className="tradingview-widget-container__widget bg-gray-100 rounded-md mb-2 max-h-80"
        ></div>
        <StockChart symbol={openChart} />
        <AddNewStock
          newStockName={newStockName}
          newStockSymbol={newStockSymbol}
          newStockSector={newStockSector}
          setNewStockName={setNewStockName}
          inputRef={inputRef}
          setNewStockSector={setNewStockSector}
          setNewStockSymbol={setNewStockSymbol}
          handleAddStock={handleAddStock}
        />
      </header>
      <main>
        {/* Add props to stock list header */}
        <StockListHeader saveStockListJSON={saveStockListToJSON}/>
        <StockListTable
          stocks={stocks}
          handleEditStock={handleEditStock}
          handleRemoveStock={handleRemoveStock}
          openStockWidget={openStockWidget}
        />
      </main>
    </div>
  );
}

export default App;
