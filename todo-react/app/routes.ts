import { type RouteConfig,
  layout, 
  route} from "@react-router/dev/routes";

export default [
  layout("./layouts/sidebar.tsx", [
    route("/home","./routes/home.tsx")
  ]),
  route("/","./routes/start.tsx"),
  route("*", "./routes/errorPage.tsx"), // Fallback för 404
] satisfies RouteConfig;
