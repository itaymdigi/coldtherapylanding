/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as bookings from "../bookings.js";
import type * as breathingVideos from "../breathingVideos.js";
import type * as danPhoto from "../danPhoto.js";
import type * as galleryImages from "../galleryImages.js";
import type * as payments from "../payments.js";
import type * as scheduleImages from "../scheduleImages.js";
import type * as subscriptions from "../subscriptions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  bookings: typeof bookings;
  breathingVideos: typeof breathingVideos;
  danPhoto: typeof danPhoto;
  galleryImages: typeof galleryImages;
  payments: typeof payments;
  scheduleImages: typeof scheduleImages;
  subscriptions: typeof subscriptions;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
