import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  redirect
} from "@tanstack/react-router";
import { RootRouteView } from "./routes/__root";
import { ContentDetailRoute } from "./routes/contents/$id";
import { EditContentRoute } from "./routes/contents/$id.edit";
import { ContentsRoute } from "./routes/contents";
import { NewContentRoute } from "./routes/contents/new";
import { NewContentCollectionRoute } from "./routes/content-collections/new";

const rootRoute = createRootRoute({
  component: RootRouteView
});

const homeRoute = createRoute({
  beforeLoad: () => {
    throw redirect({ to: "/contents" });
  },
  getParentRoute: () => rootRoute,
  path: "/"
});

const contentsRoute = createRoute({
  component: Outlet,
  getParentRoute: () => rootRoute,
  path: "contents"
});

const contentCollectionsRoute = createRoute({
  component: Outlet,
  getParentRoute: () => rootRoute,
  path: "content-collections"
});

const contentsIndexRoute = createRoute({
  component: ContentsRoute,
  getParentRoute: () => contentsRoute,
  path: "/"
});

const newContentRoute = createRoute({
  component: NewContentRoute,
  getParentRoute: () => contentsRoute,
  path: "new"
});

const contentDetailRoute = createRoute({
  component: ContentDetailRoute,
  getParentRoute: () => contentsRoute,
  path: "$id"
});

const editContentRoute = createRoute({
  component: EditContentRoute,
  getParentRoute: () => contentsRoute,
  path: "$id/edit"
});

const newContentCollectionRoute = createRoute({
  component: NewContentCollectionRoute,
  getParentRoute: () => contentCollectionsRoute,
  path: "new"
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  contentsRoute.addChildren([
    contentsIndexRoute,
    newContentRoute,
    contentDetailRoute,
    editContentRoute
  ]),
  contentCollectionsRoute.addChildren([newContentCollectionRoute])
]);

export const router = createRouter({
  defaultPendingMinMs: 0,
  defaultPreload: "intent",
  routeTree
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
