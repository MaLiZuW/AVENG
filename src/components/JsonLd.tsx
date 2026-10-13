import type { JsonLdObject } from "@/lib/jsonld";

type JsonLdProps = {
  data: JsonLdObject | JsonLdObject[];
};

/** Build-time JSON-LD script tags (static export safe). */
export default function JsonLd({ data }: JsonLdProps) {
  const payloads = Array.isArray(data) ? data : [data];
  return (
    <>
      {payloads.map((payload, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
        />
      ))}
    </>
  );
}
