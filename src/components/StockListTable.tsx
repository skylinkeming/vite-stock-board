import React, { useEffect, useState } from "react";
import StockListTableHead from "./StockListTableHead";
import Button from "./Button";
import { IoMdBrush, IoMdRemoveCircle } from "react-icons/io";
import Input from "./Input";

export default function StockListTable(props: {
  stocks: Array<{ symbol: string; sector: string; name: string }>;
  handleEditStock: (symbol: string, newName: string, newSector: string) => void;
  handleRemoveStock: (symbol: string) => void;
  openStockWidget: (symbol: string) => void;
}) {
  const { stocks, handleEditStock, handleRemoveStock, openStockWidget } = props;
  const [hovered, setHovered] = useState<string>("");
  const [filteredStocks, setFilteredStocks] =
    useState<Array<{ symbol: string; sector: string; name: string }>>(stocks);
  const [filtered, setFiltered] = useState({ isFiltered: false, filter: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setFilteredStocks(stocks);
  }, [stocks]);

  const sortByName = (reverse = false) => {
    const sortedStocks = [...filteredStocks].sort((a, b) =>
      reverse ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
    );
    setFilteredStocks(sortedStocks);
  };

  const sortBySector = (reverse = false) => {
    const sortedStocks = [...filteredStocks].sort((a, b) =>
      reverse
        ? b.sector.localeCompare(a.sector)
        : a.sector.localeCompare(b.sector)
    );
    setFilteredStocks(sortedStocks);
  };

  const handleSectorFilter = (selectedSector) => {
    const filteredStocks =
      selectedSector === "All Sectors"
        ? stocks
        : stocks.filter((stock) => stock.sector === selectedSector);

    setFilteredStocks(filteredStocks);
    setFiltered({
      isFiltered: selectedSector !== "All Sectors",
      filter: filteredStocks,
    });
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filteredStocks = stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(searchTerm) ||
        stock.name.toLocaleLowerCase().includes(searchTerm)
    );
    setFilteredStocks(filteredStocks);
  };

  return (
    <section>
      <StockListTableHead
        stocks={stocks}
        sortByName={sortByName}
        sortBySector={sortBySector}
        handleSectorFilter={handleSectorFilter}
      />
      <div className="mx-3">
        <Input
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by symbol or name"
        />
      </div>
      <ul
        style={{ minHeight: "70vh" }}
        className="container container-md overflow-y-scroll"
      >
        {filteredStocks.map((stock) => (
          <li
            className={`grid grid-cols-4 gap-2 items-center bg-slate-900 hover:bg-gray-300 text-white hover:text-gray-900 rounded-md px-4 py-2 border-b-2 border-gray-800 ${
              hovered === stock.symbol ? "hovered" : ""
            }`}
            key={stock.symbol}
            onMouseEnter={() => setHovered(stock.symbol)}
            onMouseLeave={() => setHovered("")}
          >
            <div className="col-span-3 flex justify-between">
              <h4
                className="font-bold cursor-pointer bg-teal-500 hover:bg-slate-700 text-gray-100 py-1 px-2 rounded-md"
                onClick={() => openStockWidget(stock.symbol)}
              >
                {stock.symbol}
              </h4>
              <small className="text-slate-500">{stock.sector}</small>
            </div>
            <div className="col-span-1 flex justify-end">
              {hovered === stock.symbol && (
                <>
                  <Button
                    onClick={() => {
                      const newName = prompt("Enter new name", stock.name);
                      const newSector = prompt("Enter new name", stock.sector);

                      handleEditStock(stock.symbol, newName, newSector);
                    }}
                    classes={"bg-slate-800 hover:bg-slate-700 mr-1"}
                  >
                    <IoMdBrush size={20} />
                  </Button>
                  <Button
                    onClick={() => {
                      handleRemoveStock(stock.symbol);
                    }}
                    classes={"bg-red-800 hover:bg-red-700"}
                  >
                    <IoMdRemoveCircle size={20} />
                  </Button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
