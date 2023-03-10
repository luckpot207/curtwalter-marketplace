import { TwitterIcon, DiscordIcon, HowRareIsIcon, WebsiteIcon } from "./icons";

function Twitter(props: { href: string }) {
  return (
    <li>
      <a
        href={props.href}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500"
      >
        <span className="sr-only">Twitter Link</span>
        <TwitterIcon className="w-5 h-5" />
      </a>
    </li>
  );
}
function Discord(props: { href: string }) {
  return (
    <li>
      <a
        href={props.href}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500"
      >
        <span className="sr-only">Discord Link</span>
        <DiscordIcon className="w-5 h-5 mt-1" />
      </a>
    </li>
  );
}

const ReHowRare = /#\d+/;

function HowRareIs(props: { href: string; name?: string }) {
  let href = props.href;
  if (props.name && ReHowRare.test(props.name ?? "")) {
    if (href.endsWith("/")) {
      href += props.name!.substring(1);
    } else {
      href += "/" + props.name!.substring(1);
    }
  }
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500"
      >
        <span className="sr-only">howrare.is Link</span>
        <HowRareIsIcon className="w-5 h-5" />
      </a>
    </li>
  );
}
function Website(props: { href: string }) {
  return (
    <li>
      <a
        href={props.href}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500"
      >
        <span className="sr-only">Website Link</span>
        <WebsiteIcon className="w-5 h-5" />
      </a>
    </li>
  );
}

export default function Links(props: { links: string[]; name?: string }) {
  return (
    <ul role="list" className="flex items-center space-x-6 mt-4">
      {props.links.map((link) => {
        if (link.startsWith("https://twitter.com/")) {
          return <Twitter key={link} href={link} />;
        } else if (link.startsWith("https://discord.gg/")) {
          return <Discord key={link} href={link} />;
        } else if (link.startsWith("https://howrare.is/")) {
          return <HowRareIs key={link} href={link} name={props.name} />;
        } else {
          return <Website key={link} href={link} />;
        }
      })}
    </ul>
  );
}
