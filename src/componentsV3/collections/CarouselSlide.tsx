import {SolanaLogo} from "../logo/SolanaLogo";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Image, imageProxyUrl} from "../image/Image";
import {Link} from "react-router-dom";
import {lamportsToSOL, nFormatter} from "../../lib/utils";
import {useCountDown} from "../../lib/useCountDown";

export type CarouselSlideProps = {
  image: string,
  imageType: 'collection' | 'listing'
  title: string
  url?: string,
  floorPrice?: string
  listed?: number,
  addedAt?: string,
  mintAt?: string,
  twitterUrl?: string,
  otherLinks?: string[]
}

export function CarouselSlide({ image, imageType, title, url, floorPrice, listed, addedAt, mintAt, twitterUrl, otherLinks }: CarouselSlideProps) {

  if (otherLinks) {
    twitterUrl = otherLinks?.filter((a) =>
      a.startsWith("https://twitter.com")
    )[0];
  }

  const SlideImage = () => {
    return (
      <Image
        src={imageType === 'listing' ? image : imageProxyUrl(image, imageType)}
        enforceSrc={imageType === 'listing'}
        size='2xl'
        placeholder="blur"
        className='rounded-2xl object-cover'
      />
    )
  }

  const Title = () => {
    return (
      <>
        <span>{title}</span>
      </>
    )
  }

  const LinkTitle = () => {
    return (
      <div className="lines-1 mb-2">
        { url ? (
          <Link to={url}>
            <Title/>
          </Link>
        ) : <Title/> }
      </div>
    )
  }

  const LinkImage = () => {
    return (
      <div className='aspect-w-1 aspect-h-1'>
        { url ? (
          <Link to={url}>
            <SlideImage/>
          </Link>
        ) : <SlideImage/> }
      </div>
    )
  }

  const MintTime = () => {
    const timeLeft: any = useCountDown(new Date(mintAt as any));

    if (!mintAt) return null
    const mintTime = new Date(mintAt as any)

    return (
      <>
        {(mintTime.getTime() > (new Date()).getTime())
          ? (`${timeLeft.days}D ${timeLeft.hours}H ${timeLeft.minutes}M ${timeLeft.seconds}s`)
          : (mintTime.toLocaleDateString('en-US'))}
      </>
    )
  }



  return (
    <div
      className={`w-full inline-flex flex-col text-center dark:border-zinc-700 dark:bg-zinc-800 bg-gray-100 border-gray-100 
      rounded-3xl border shadow-md p-4 hover:border-gray-300 dark:hover:border-zinc-500 my-2`}
    >
      <div className="group relative h-full flex flex-col justify-between">
        <div className="w-full">
          <LinkImage/>
        </div>
        <div className="mt-2">
          <LinkTitle/>
          <div className={`flex-row items-center bg-white dark:bg-zinc-900 items-number-box-shadow text-sm w-full 
                           text-gray-600 dark:text-white rounded-2xl py-2 flex justify-between px-3 h-8`}>

            { floorPrice && (
              <div className="flex items-center justify-start">
                Floor:
                <SolanaLogo className='h-3 w-min ml-1 mr-1 w-3'/>
                {nFormatter(lamportsToSOL(floorPrice ?? 0), 2)}
              </div>
            ) }

            { listed && listed > 0 && (
              <div className="flex items-center justify-start">
                Listed:
                <span className='ml-1'>
                  {listed}
                </span>
              </div>
            ) }

            { mintAt && (
              <div className="flex items-center justify-start">
                Mint:
                <span className='ml-1 mr-1 flex w-full'>
                  <MintTime/>
                </span>
              </div>
            )}

            { !floorPrice && !(listed && listed > 0) && !mintAt && addedAt && (
              <div className="flex items-center justify-start">
                Added:
                <span className='ml-1 mr-1 flex w-full'>
                  { new Date(addedAt as any).toLocaleDateString() }
                </span>
              </div>
            )}

            { twitterUrl && (
              <div className="flex items-center justify-start">
                <a href={twitterUrl} target='_blank' rel='noreferrer'>
                  <FontAwesomeIcon icon={['fab', 'twitter']} className='h-4'/>
                </a>
              </div>
            ) }

          </div>
        </div>
      </div>
    </div>
  )
}