import { onRequestPost as __api_orders__id__items_js_onRequestPost } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\orders\\[id]\\items.js"
import { onRequestDelete as __api_tours__id__itinerary_js_onRequestDelete } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\tours\\[id]\\itinerary.js"
import { onRequestGet as __api_tours__id__itinerary_js_onRequestGet } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\tours\\[id]\\itinerary.js"
import { onRequestPost as __api_tours__id__itinerary_js_onRequestPost } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\tours\\[id]\\itinerary.js"
import { onRequestGet as __api_admin_booking_by_airline_js_onRequestGet } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\admin\\booking-by-airline.js"
import { onRequestGet as __api_admin_booking_by_country_js_onRequestGet } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\admin\\booking-by-country.js"
import { onRequestGet as __api_admin_stats_js_onRequestGet } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\admin\\stats.js"
import { onRequestPost as __api_auth_forgot_password_js_onRequestPost } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\auth\\forgot-password.js"
import { onRequestPost as __api_auth_login_js_onRequestPost } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\auth\\login.js"
import { onRequestPost as __api_auth_logout_js_onRequestPost } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\auth\\logout.js"
import { onRequestPost as __api_auth_register_js_onRequestPost } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\auth\\register.js"
import { onRequestGet as __api_auth_session_js_onRequestGet } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\auth\\session.js"
import { onRequestGet as __api_cart_count_js_onRequestGet } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\cart\\count.js"
import { onRequestDelete as __api_cart__id__js_onRequestDelete } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\cart\\[id].js"
import { onRequestDelete as __api_flights__id__js_onRequestDelete } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\flights\\[id].js"
import { onRequestGet as __api_flights__id__js_onRequestGet } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\flights\\[id].js"
import { onRequestPut as __api_flights__id__js_onRequestPut } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\flights\\[id].js"
import { onRequestDelete as __api_tours__id__js_onRequestDelete } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\tours\\[id].js"
import { onRequestGet as __api_tours__id__js_onRequestGet } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\tours\\[id].js"
import { onRequestPut as __api_tours__id__js_onRequestPut } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\tours\\[id].js"
import { onRequestGet as __api_airlines_js_onRequestGet } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\airlines.js"
import { onRequestDelete as __api_cart_index_js_onRequestDelete } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\cart\\index.js"
import { onRequestGet as __api_cart_index_js_onRequestGet } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\cart\\index.js"
import { onRequestPost as __api_cart_index_js_onRequestPost } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\cart\\index.js"
import { onRequestPost as __api_chatbot_js_onRequestPost } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\chatbot.js"
import { onRequestGet as __api_countries_js_onRequestGet } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\countries.js"
import { onRequestGet as __api_flights_index_js_onRequestGet } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\flights\\index.js"
import { onRequestPost as __api_flights_index_js_onRequestPost } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\flights\\index.js"
import { onRequestPost as __api_orders_index_js_onRequestPost } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\orders\\index.js"
import { onRequestGet as __api_profile_js_onRequestGet } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\profile.js"
import { onRequestPut as __api_profile_js_onRequestPut } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\profile.js"
import { onRequestGet as __api_tours_index_js_onRequestGet } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\tours\\index.js"
import { onRequestPost as __api_tours_index_js_onRequestPost } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\tours\\index.js"
import { onRequestGet as __api_weather_forecast_js_onRequestGet } from "D:\\Học IT\\vibe coding\\vibe coding KHTN\\b7\\travelphuoc\\functions\\api\\weather-forecast.js"

export const routes = [
    {
      routePath: "/api/orders/:id/items",
      mountPath: "/api/orders/:id",
      method: "POST",
      middlewares: [],
      modules: [__api_orders__id__items_js_onRequestPost],
    },
  {
      routePath: "/api/tours/:id/itinerary",
      mountPath: "/api/tours/:id",
      method: "DELETE",
      middlewares: [],
      modules: [__api_tours__id__itinerary_js_onRequestDelete],
    },
  {
      routePath: "/api/tours/:id/itinerary",
      mountPath: "/api/tours/:id",
      method: "GET",
      middlewares: [],
      modules: [__api_tours__id__itinerary_js_onRequestGet],
    },
  {
      routePath: "/api/tours/:id/itinerary",
      mountPath: "/api/tours/:id",
      method: "POST",
      middlewares: [],
      modules: [__api_tours__id__itinerary_js_onRequestPost],
    },
  {
      routePath: "/api/admin/booking-by-airline",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_booking_by_airline_js_onRequestGet],
    },
  {
      routePath: "/api/admin/booking-by-country",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_booking_by_country_js_onRequestGet],
    },
  {
      routePath: "/api/admin/stats",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_stats_js_onRequestGet],
    },
  {
      routePath: "/api/auth/forgot-password",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_forgot_password_js_onRequestPost],
    },
  {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_login_js_onRequestPost],
    },
  {
      routePath: "/api/auth/logout",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_logout_js_onRequestPost],
    },
  {
      routePath: "/api/auth/register",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_register_js_onRequestPost],
    },
  {
      routePath: "/api/auth/session",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_session_js_onRequestGet],
    },
  {
      routePath: "/api/cart/count",
      mountPath: "/api/cart",
      method: "GET",
      middlewares: [],
      modules: [__api_cart_count_js_onRequestGet],
    },
  {
      routePath: "/api/cart/:id",
      mountPath: "/api/cart",
      method: "DELETE",
      middlewares: [],
      modules: [__api_cart__id__js_onRequestDelete],
    },
  {
      routePath: "/api/flights/:id",
      mountPath: "/api/flights",
      method: "DELETE",
      middlewares: [],
      modules: [__api_flights__id__js_onRequestDelete],
    },
  {
      routePath: "/api/flights/:id",
      mountPath: "/api/flights",
      method: "GET",
      middlewares: [],
      modules: [__api_flights__id__js_onRequestGet],
    },
  {
      routePath: "/api/flights/:id",
      mountPath: "/api/flights",
      method: "PUT",
      middlewares: [],
      modules: [__api_flights__id__js_onRequestPut],
    },
  {
      routePath: "/api/tours/:id",
      mountPath: "/api/tours",
      method: "DELETE",
      middlewares: [],
      modules: [__api_tours__id__js_onRequestDelete],
    },
  {
      routePath: "/api/tours/:id",
      mountPath: "/api/tours",
      method: "GET",
      middlewares: [],
      modules: [__api_tours__id__js_onRequestGet],
    },
  {
      routePath: "/api/tours/:id",
      mountPath: "/api/tours",
      method: "PUT",
      middlewares: [],
      modules: [__api_tours__id__js_onRequestPut],
    },
  {
      routePath: "/api/airlines",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_airlines_js_onRequestGet],
    },
  {
      routePath: "/api/cart",
      mountPath: "/api/cart",
      method: "DELETE",
      middlewares: [],
      modules: [__api_cart_index_js_onRequestDelete],
    },
  {
      routePath: "/api/cart",
      mountPath: "/api/cart",
      method: "GET",
      middlewares: [],
      modules: [__api_cart_index_js_onRequestGet],
    },
  {
      routePath: "/api/cart",
      mountPath: "/api/cart",
      method: "POST",
      middlewares: [],
      modules: [__api_cart_index_js_onRequestPost],
    },
  {
      routePath: "/api/chatbot",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_chatbot_js_onRequestPost],
    },
  {
      routePath: "/api/countries",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_countries_js_onRequestGet],
    },
  {
      routePath: "/api/flights",
      mountPath: "/api/flights",
      method: "GET",
      middlewares: [],
      modules: [__api_flights_index_js_onRequestGet],
    },
  {
      routePath: "/api/flights",
      mountPath: "/api/flights",
      method: "POST",
      middlewares: [],
      modules: [__api_flights_index_js_onRequestPost],
    },
  {
      routePath: "/api/orders",
      mountPath: "/api/orders",
      method: "POST",
      middlewares: [],
      modules: [__api_orders_index_js_onRequestPost],
    },
  {
      routePath: "/api/profile",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_profile_js_onRequestGet],
    },
  {
      routePath: "/api/profile",
      mountPath: "/api",
      method: "PUT",
      middlewares: [],
      modules: [__api_profile_js_onRequestPut],
    },
  {
      routePath: "/api/tours",
      mountPath: "/api/tours",
      method: "GET",
      middlewares: [],
      modules: [__api_tours_index_js_onRequestGet],
    },
  {
      routePath: "/api/tours",
      mountPath: "/api/tours",
      method: "POST",
      middlewares: [],
      modules: [__api_tours_index_js_onRequestPost],
    },
  {
      routePath: "/api/weather-forecast",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_weather_forecast_js_onRequestGet],
    },
  ]