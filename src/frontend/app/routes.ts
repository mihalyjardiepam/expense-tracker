import { type RouteConfig, index, layout, prefix } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  ...prefix("dashboard", [
    layout("routes/dashboard/dashboard.tsx", [
      index("routes/dashboard/expense-table.tsx")
    ])
  ]),
] satisfies RouteConfig;
