// TradingViewWidget.jsx
import { useEffect, useRef, memo, LegacyRef } from "react";

function StockChart({ symbol }) {
  const container = useRef<LegacyRef<HTMLDivElement>>();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "autosize": true,
          "symbol": "${symbol}",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "withdateranges":true,
          "allow_symbol_change": false,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;
    container.current.innerHTML = "";
    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "100%", width: "100%" }}
    >
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default memo(StockChart);
