/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as bookings from "../bookings.js";
import type * as breathingVideos from "../breathingVideos.js";
import type * as danPhoto from "../danPhoto.js";
import type * as galleryImages from "../galleryImages.js";
import type * as heroVideo from "../heroVideo.js";
import type * as media from "../media.js";
import type * as payments from "../payments.js";
import type * as practiceSessions from "../practiceSessions.js";
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
  auth: typeof auth;
  bookings: typeof bookings;
  breathingVideos: typeof breathingVideos;
  danPhoto: typeof danPhoto;
  galleryImages: typeof galleryImages;
  heroVideo: typeof heroVideo;
  media: typeof media;
  payments: typeof payments;
  practiceSessions: typeof practiceSessions;
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
