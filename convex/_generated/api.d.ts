/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as drops from "../drops.js";
import type * as dropsQueries from "../dropsQueries.js";
import type * as flights from "../flights.js";
import type * as flightsInternal from "../flightsInternal.js";
import type * as lib_game from "../lib/game.js";
import type * as solvers from "../solvers.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  drops: typeof drops;
  dropsQueries: typeof dropsQueries;
  flights: typeof flights;
  flightsInternal: typeof flightsInternal;
  "lib/game": typeof lib_game;
  solvers: typeof solvers;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
