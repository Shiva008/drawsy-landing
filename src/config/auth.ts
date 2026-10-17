export const authConfig = {
  providers: {
    email: true,
    google: true,
    twitter: true,
  },

  /** Firebase weak-password minimum. */
  password: {
    minLength: 6,
  },

  routes: {
    login: "/login",
    signup: "/signup",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    profile: "/profile",
    billing: "/billing",
    pricing: "/pricing",
    /** Default post-auth destination is the canvas (see redirect helpers). */
    afterAuth: "canvas",
  },
} as const;
