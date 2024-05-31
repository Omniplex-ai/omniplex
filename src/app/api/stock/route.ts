import { NextRequest, NextResponse } from "next/server";

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

const fetchJSON = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);
  return response.json();
};

type ChartDataPoint = {
  timestamp: string;
  price: number;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return new NextResponse(JSON.stringify({ error: "Symbol is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Finnhub API URLs
    const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const stockProfileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const companyMetricsUrl = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`;

    // Alpha Vantage intraday data URL
    const alphaVantageUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

    const [quoteData, stockProfileData, companyMetricsData, alphaVantageData] =
      await Promise.all([
        fetchJSON(quoteUrl),
        fetchJSON(stockProfileUrl),
        fetchJSON(companyMetricsUrl),
        fetchJSON(alphaVantageUrl),
      ]);

    if (!quoteData || !stockProfileData || !companyMetricsData) {
      return new NextResponse(JSON.stringify({ error: "Data not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    let chartData: ChartDataPoint[] = [];
    if (alphaVantageData && alphaVantageData["Time Series (Daily)"]) {
      const dailyRawData = alphaVantageData["Time Series (Daily)"];
      chartData = Object.keys(dailyRawData).map((timestamp) => ({
        timestamp: new Date(timestamp).toISOString(),
        price: parseFloat(dailyRawData[timestamp]["4. close"]),
      }));
    }

    const structData = {
      companyName: stockProfileData.name,
      ticker: symbol,
      exchange: stockProfileData.exchange,
      currentPrice: quoteData.c,
      change: {
        amount: parseFloat((quoteData.c - quoteData.pc).toFixed(2)),
        percentage: parseFloat(
          (((quoteData.c - quoteData.pc) / quoteData.pc) * 100).toFixed(2)
        ),
      },
      chartData,
      open: quoteData.o,
      high: quoteData.h,
      low: quoteData.l,
      previousClose: quoteData.pc,
      marketCap: companyMetricsData.metric.marketCapitalization,
      peRatio: companyMetricsData.metric.peBasicExclExtraTTM,
      dividendYield: `${(
        companyMetricsData.metric.dividendYieldIndicatedAnnual * 100
      ).toFixed(2)}%`,
      high52Week: companyMetricsData.metric["52WeekHigh"],
      low52Week: companyMetricsData.metric["52WeekLow"],
    };

    return new NextResponse(JSON.stringify(structData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching stock data", error);
    return new NextResponse(
      JSON.stringify({ error: "An error occurred while fetching stock data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
