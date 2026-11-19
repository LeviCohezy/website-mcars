self.__MIDDLEWARE_MATCHERS = [
  {
    "regexp": "^\\/website-mcars(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!api|cms|_next|_vercel|.*\\..*).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$",
    "originalSource": "/((?!api|cms|_next|_vercel|.*\\..*).*)"
  }
];self.__MIDDLEWARE_MATCHERS_CB && self.__MIDDLEWARE_MATCHERS_CB()