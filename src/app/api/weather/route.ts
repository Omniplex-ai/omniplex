import { NextRequest, NextResponse } from 'next/server';

const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

export const runtime = 'edge';

function formatTime(hour: number) {
	const amPm = hour >= 12 ? 'PM' : 'AM';
	const formattedHour = hour % 12 || 12;
	return `${formattedHour} ${amPm}`;
}

export async function GET(req: NextRequest) {
	console.log('inside weather api.ts');
	const { searchParams } = new URL(req.url);
	const city = searchParams.get('city');

	if (!city || typeof city !== 'string') {
		return new NextResponse(
			JSON.stringify({
				message: 'Query parameter "city" is required and must be a string.',
			}),
			{ status: 400 }
		);
	}

	if (!OPENWEATHERMAP_API_KEY) {
		console.error(
			'OpenWeatherMap API key is undefined. Please check your .env.local file.'
		);
		return new NextResponse(
			JSON.stringify({
				message: 'OpenWeatherMap API key is not configured.',
			}),
			{ status: 500 }
		);
	}
	try {
		const geoCodingurl = `https://open-weather13.p.rapidapi.com/city/${city}/EN`;
		const options = {
			method: 'GET',
			headers: {
				'x-rapidapi-key': OPENWEATHERMAP_API_KEY,
				'x-rapidapi-host': 'open-weather13.p.rapidapi.com',
			},
		};
		const geoResponse = await fetch(geoCodingurl, options);
		//console.log('logging geoResponse:', geoResponse);

		if (!geoResponse.ok) {
			throw new Error(
				`Geocoding API request failed with status ${geoResponse.status}`
			);
		}
		console.log('city:', city);
		const geoData = await geoResponse.json();
		console.log('response code', geoResponse.status);
		console.log('logging geoData:', geoData);
		if (geoData.length === 0) {
			return new NextResponse(
				JSON.stringify({ message: 'City not found.' }),
				{
					status: 404,
				}
			);
		}
		console.log('logging geoData:', geoData);

		const { name, coord } = geoData;
		const { lat, lon } = coord;
		console.log('name:', name);

		const currentWeatherData = geoData;

		console.log('logging currentWeatherData:', currentWeatherData);

		const FORECAST_URL = `https://open-weather13.p.rapidapi.com/city/fivedaysforcast/${lat}/${lon}`;
		const forecastResponse = await fetch(FORECAST_URL, options);

		if (!forecastResponse.ok) {
			throw new Error(
				`Forecast API request failed with status ${forecastResponse.status}`
			);
		}

		const forecastData = await forecastResponse.json();

		const data = {
			city: name,
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
		console.error('API request error:', error);
		return new NextResponse(
			JSON.stringify({ message: 'Internal Server Error' }),
			{ status: 500 }
		);
	}
}
