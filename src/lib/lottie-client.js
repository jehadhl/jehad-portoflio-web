/**
 * Keep the original synchronous browser initialization while allowing Next.js SSR.
 * Next.js bundles this dependency; the require never executes on the server.
 */
const lottie = typeof document === "undefined" ? null : require("lottie-web");
export default lottie;
