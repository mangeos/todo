import { type RouteConfig, index,
  layout, 
  route} from "@react-router/dev/routes";

export default [
  layout("./layouts/sidebar.tsx", [
    route("","./routes/home.tsx")
  ])
] satisfies RouteConfig;
