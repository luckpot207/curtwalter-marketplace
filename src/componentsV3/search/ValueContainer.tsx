import {ValueContainerProps} from "react-select/dist/declarations/src";

export default function ValueContainer(props: ValueContainerProps<any>) {
  return (
    <div className='pl-0 w-full'>{props.children}</div>
  )
}