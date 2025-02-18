import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/index.tsx"),
    ...prefix("dashboard", [
      layout("routes/dashboard/dashboard.tsx", [
        index("routes/dashboard/expense-table.tsx"),
      ]),
    ]),
  ]),
  route("login", "routes/login/login.tsx"),
  route("signup", "routes/signup/signup.tsx"),
] satisfies RouteConfig;
