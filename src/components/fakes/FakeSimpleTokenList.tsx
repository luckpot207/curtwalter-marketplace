import { FakeSimpleToken } from "./FakeSimpleToken";

export function FakeSimpleTokenList(props: { count: number }) {
  return (
    <div className={`grid custom-grid-cols gap-y-10 gap-x-6 xl:gap-x-8`}>
      {Array.from({ length: props.count }, (v, k) => (
        <FakeSimpleToken key={"simpleToken-" + k} />
      ))}
    </div>
  );
}
