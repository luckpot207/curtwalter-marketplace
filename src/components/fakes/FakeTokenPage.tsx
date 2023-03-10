export function FakeTokenPage() {
  return (
    <div className="bg-white h-screen">
      <div className="mx-auto py-16 px-4 sm:py-20 sm:px-6 lg:max-w-7xl lg:px-8">
        {/* Product */}
        <div className="lg:grid lg:grid-rows-1 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          {/* Product image */}
          <div className="lg:row-end-1 lg:col-span-4">
            <div className="animate-pulse  aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden"></div>
          </div>
          {/* Product details */}
          <div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-4">
            <div className="flex flex-col-reverse">
              <div className="mt-2">
                <div
                  data-placeholder
                  className="animate-pulse  mb-2 h-4 w-40 overflow-hidden bg-gray-200"
                />
                <div
                  data-placeholder
                  className="animate-pulse mb-3 mt-2 h-8 w-36 overflow-hidden bg-gray-200"
                />
                <div
                  data-placeholder
                  className="animate-pulse mb-2 h-4 w-40 overflow-hidden bg-gray-200"
                />
              </div>
            </div>

            <div
              data-placeholder
              className="animate-pulse mb-2 mt-5 h-5 w-40 overflow-hidden bg-gray-200"
            />
            <div
              data-placeholder
              className="animate-pulse mb-2 h-10 w-28 overflow-hidden bg-gray-200"
            />
            {/* NFTButtons */}
            <div className="flex flex-row">
              <div
                data-placeholder
                className="animate-pulse mb-2 mt-5 h-12 w-60 overflow-hidden bg-gray-200 rounded-md"
              />
              <div
                data-placeholder
                className="animate-pulse ml-5 mb-2 mt-5 h-12 w-60 overflow-hidden bg-gray-200 rounded-md"
              />
            </div>

            <div
              data-placeholder
              className="animate-pulse  mb-2 mt-8 border-b w-full overflow-hidden bg-gray-200 rounded-md"
            />
            <div className="flex flex-wrap mt-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i}
                  data-placeholder
                  className="animate-pulse bg-gray-200 h-16 rounded-lg pointer-events-none p-2 m-1 w-36"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
