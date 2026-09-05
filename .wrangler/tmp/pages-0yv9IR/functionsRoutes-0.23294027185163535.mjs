import { onRequestGet as __api_weather_forecast_js_onRequestGet } from "D:\\phuoc\\b7\\travelphuoc\\functions\\api\\weather-forecast.js"

export const routes = [
    {
      routePath: "/api/weather-forecast",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_weather_forecast_js_onRequestGet],
    },
  ]