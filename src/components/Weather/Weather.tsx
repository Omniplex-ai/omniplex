import React from "react";
import styles from "./Weather.module.css";
import { WeatherType } from "@/utils/types";
import { Skeleton } from "@nextui-org/skeleton";

type WeatherProps = {
  weatherResults?: WeatherType;
};

const Weather = ({ weatherResults }: WeatherProps) => {
  return (
    <>
      {weatherResults ? (
        <div className={styles.weatherContainer}>
          <div className={styles.weatherRow}>
            <div>
              <div className={styles.cityName}>{weatherResults.city}</div>
              <div
                className={styles.currentTemp}
              >{`${weatherResults.current.temperature}°C`}</div>
            </div>
            <div className={styles.weatherInfo}>
              <img
                src={`http://openweathermap.org/img/wn/${weatherResults.current.icon}@2x.png`}
                alt="Current Weather Icon"
                className={styles.weatherIcon}
              />
              <div className={styles.weatherCondition}>
                {weatherResults.current.weather}
              </div>
              <div
                className={styles.tempRange}
              >{`H:${weatherResults.daily.maxTemp}° - L:${weatherResults.daily.minTemp}°`}</div>
            </div>
          </div>
          <div className={styles.hourlyForecast}>
            {weatherResults.hourly.map((hour, index) => (
              <div className={styles.hourlyItem} key={index}>
                <div className={styles.hour}>{`${hour.time}`}</div>
                <img
                  src={`http://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                  alt="Hourly Weather Icon"
                  className={styles.weatherForcastIcon}
                />
                <div className={styles.hourTemp}>{`${hour.temperature}°`}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.weatherContainer}>
          <div className={styles.weatherRow}>
            <div>
              <Skeleton className={styles.skeletonCityName} />
              <Skeleton className={styles.skeletonCurrentTemp} />
            </div>
            <div className={styles.weatherInfo}>
              <Skeleton className={styles.skeletonWeatherIcon} />
              <Skeleton className={styles.skeletonWeatherCondition} />
              <Skeleton className={styles.skeletonTempRange} />
            </div>
          </div>
          <div className={styles.hourlyForecast}>
            <div className={styles.skeletonHourlyItem}>
              <Skeleton className={styles.skeletonHour} />
              <Skeleton className={styles.skeletonWeatherForcastIcon} />
              <Skeleton className={styles.skeletonHourTemp} />
            </div>
            <div className={styles.skeletonHourlyItem}>
              <Skeleton className={styles.skeletonHour} />
              <Skeleton className={styles.skeletonWeatherForcastIcon} />
              <Skeleton className={styles.skeletonHourTemp} />
            </div>
            <div className={styles.skeletonHourlyItem}>
              <Skeleton className={styles.skeletonHour} />
              <Skeleton className={styles.skeletonWeatherForcastIcon} />
              <Skeleton className={styles.skeletonHourTemp} />
            </div>
            <div className={styles.skeletonHourlyItem}>
              <Skeleton className={styles.skeletonHour} />
              <Skeleton className={styles.skeletonWeatherForcastIcon} />
              <Skeleton className={styles.skeletonHourTemp} />
            </div>
            <div className={styles.skeletonHourlyItem}>
              <Skeleton className={styles.skeletonHour} />
              <Skeleton className={styles.skeletonWeatherForcastIcon} />
              <Skeleton className={styles.skeletonHourTemp} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Weather;
