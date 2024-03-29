import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";

interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}
interface ChartProps {
  coinId: string;
  isDark: any;
}
function Chart({ coinId, isDark }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], () =>
    fetchCoinHistory(coinId)
  );
  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              data: data?.map((price) => {
                return {
                  x: price.time_open,
                  y: [price.open, price.high, price.low, price.close],
                };
              }),
            },
          ]}
          options={{
            theme: {
              mode: isDark ? "dark" : "light",
            },
            chart: {
              height: 500,
              width: 500,
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            grid: {
              show: false,
            },
            stroke: {
              curve: "smooth",
              width: 3,
            },
            xaxis: {
              type: "datetime",
              labels: {
                show: false,
                format: "M/dd",
              },
              axisTicks: {
                show: false,
              },
              axisBorder: {
                show: false,
              },
              tooltip: {
                enabled: false,
              },
            },
            yaxis: {
              labels: {
                show: false,
              },
            },
            plotOptions: {
              candlestick: {
                colors: {
                  upward: "#FF6363",
                  downward: "#219F94",
                },
              },
            },
            tooltip: {
              custom: ({ dataPointIndex, w }) => {
                const data = w.config.series[0].data[dataPointIndex];
                const date = new Date(data.x).toLocaleDateString("ko-KR", {
                  month: "numeric",
                  day: "numeric",
                });
                const open = data.y[0].toFixed(2);
                const high = data.y[1].toFixed(2);
                const left = data.y[2].toFixed(2);
                const close = data.y[3].toFixed(2);

                return `
                <div class="apexcharts-tooltip-title">${date}</div>
                <div class="apexcharts-tooltip-box apexcharts-tooltip-candlestick">
                  <div>Open: <span>${open}</span></div>
                  <div>High: <span>${high}</span></div>
                  <div>Left: <span>${left}</span></div>
                  <div>Close: <span>${close}</span></div>
                </div>`;
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
