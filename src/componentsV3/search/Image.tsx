export default function Image(props: { src: string; alt?: string }) {
  //https://assets.alpha.art/opt/c/d/cd5215107005896ce88e2b0cc3ce3b9b9340250b/original.png
  if (props.src && props.src.startsWith("https://assets.alpha.art/opt/")) {
    const pp = props.src.split("/");
    const parts = pp.slice(0, pp.length - 1);
    return (
      <div className="rounded-lg w-20 h-20 group-hover:opacity-60 overflow-hidden">
        <picture className="bg-gray-100 w-full h-full">
          <source
            type="image/webp"
            srcSet={[
              [...parts, "120.webp"].join("/"),
              [...parts, "256.webp 2x"].join("/"),
            ].join(", ")}
          />
          <img
            loading="lazy"
            src={[...parts, "120.png"].join("/")}
            srcSet={[
              [...parts, "120.png"].join("/"),
              [...parts, "256.png 2x"].join("/"),
            ].join(", ")}
            width="80"
            height="80"
            alt={props.alt}
          />
        </picture>
      </div>
    );
  }
  return (
    <img
      src={props.src}
      alt={props.alt}
      width="80"
      height="80"
      className="rounded-lg w-20 h-20 bg-gray-100 group-hover:opacity-60"
    />
  );
}