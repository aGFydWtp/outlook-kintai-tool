import { MetaFunction } from "@remix-run/cloudflare";

import { Index as Home } from "@/components/top";

export const meta: MetaFunction = () => {
  const title = "きょうのよてい⛅";
  return [
    { title: title },
    { property: "og:title", content: title },
    { property: "og:site_name", content: title },
  ];
};

export default function Index() {
  return <Home />;
}
