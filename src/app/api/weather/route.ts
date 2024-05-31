import { NextRequest, NextResponse } from "next/server";

const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const GEOCODING_URL = "http://api.openweathermap.org/geo/1.0/direct";
const CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

export const runtime = "edge";

function formatTime(hour: number) {
  const amPm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour} ${amPm}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");

  if (!city || typeof city !== "string") {
    return new NextResponse(
      JSON.stringify({
        message: 'Query parameter "city" is required and must be a string.',
      }),
      { status: 400 }
    );
  }

  if (!OPENWEATHERMAP_API_KEY) {
    console.error(
      "OpenWeatherMap API key is undefined. Please check your .env.local file."
    );
    return new NextResponse(
      JSON.stringify({ message: "OpenWeatherMap API key is not configured." }),
      { status: 500 }
    );
  }

  try {
    const geoResponse = await fetch(
      `${GEOCODING_URL}?q=${encodeURIComponent(
        city
      )}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`,
      { method: "GET" }
    );

    if (!geoResponse.ok) {
      throw new Error(
        `Geocoding API request failed with status ${geoResponse.status}`
      );
    }

    const geoData = await geoResponse.json();
    if (geoData.length === 0) {
      return new NextResponse(JSON.stringify({ message: "City not found." }), {
        status: 404,
      });
    }

    const { name: cityName, lat, lon } = geoData[0];

    const currentWeatherResponse = await fetch(
      `${CURRENT_WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`,
      { method: "GET" }
    );

    if (!currentWeatherResponse.ok) {
      throw new Error(
        `Current Weather API request failed with status ${currentWeatherResponse.status}`
      );
    }

    const currentWeatherData = await currentWeatherResponse.json();

    const forecastResponse = await fetch(
      `${FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`,
      { method: "GET" }
    );

    if (!forecastResponse.ok) {
      throw new Error(
        `Forecast API request failed with status ${forecastResponse.status}`
      );
    }

    const forecastData = await forecastResponse.json();

    const data = {
      city: cityName,
      current: {
        temperature: Math.round(currentWeatherData.main.temp),
        weather: currentWeatherData.weather[0].main,
        description: currentWeatherData.weather[0].description,
        icon: currentWeatherData.weather[0].icon,
      },
      hourly: forecastData.list.slice(0, 5).map((hour: any) => ({
        time: formatTime(new Date(hour.dt * 1000).getHours()),
        temperature: Math.round(hour.main.temp),
        weather: hour.weather[0].main,
        icon: hour.weather[0].icon,
      })),
      daily: {
        maxTemp: Math.round(
          Math.max(
            ...forecastData.list
              .slice(0, 8)
              .map((item: any) => item.main.temp_max)
          )
        ),
        minTemp: Math.round(
          Math.min(
            ...forecastData.list
              .slice(0, 8)
              .map((item: any) => item.main.temp_min)
          )
        ),
      },
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("API request error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
