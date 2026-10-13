import { h } from "preact"

export const HeadMeta = () => ({
  name: "HeadMeta",
  textTransform(_ctx, src) {
    return src
  },
  externalResources(ctx) {
    const verification = ctx?.cfg?.configuration?.googleSiteVerification
    if (!verification) return undefined
    return {
      additionalHead: [
        () => h("meta", { name: "google-site-verification", content: verification }),
      ],
    }
  },
})

export default HeadMeta
