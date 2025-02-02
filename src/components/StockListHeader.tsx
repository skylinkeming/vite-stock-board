import Button from "./Button";

export default function StockListHeader({ setStocks, saveStockListJSON }) {
  return (
    <section className="stock-list-header">
      <hr className="mb-4" />
      <div className="flex justify-between item-center">
        <h3 className="text-teal-500 text-3xl font-bold mb-2">Stock List</h3>
        <p className="text-slate-500 mb-4">
          Click on the stock to edit or delete or click on the stock symbol to
          open the stock widget.
        </p>
      </div>
      <div>
        <Button
          onClick={() => {
            saveStockListJSON([]);
          }}
          classes="bg-teal-500 hover:bg-teal-700 mb-2"
        >
          Save List
        </Button>
        <input
          type="file"
          accept=".json"
          className="bg-slate-400 rounded-md px-2 py-1"
          onChange={(e) => {
            const file = e.target.files![0];
            const reader = new FileReader();
            reader.onload = (e) => {
              const content = e.target?.result;
              const parseData = JSON.parse(content);
              setStocks(parseData);
            };
            reader.readAsText(file);
          }}
        />
      </div>
      <hr className="mb-4" />
    </section>
  );
}
