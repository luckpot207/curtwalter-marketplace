export function FakeTradingHistoryItem() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-row flex-1 text-sm text-gray-500 border-b items-center">
        <div className="p-4 flex-1 flex ">
          <div className="w-5 h-5 bg-gray-200" />
          <div className="ml-3 w-14 h-5 bg-gray-200" />
        </div>
        <div className="p-4 flex-1">
          <div className="flex items-center animate-pulse">
            <div className="rounded-md w-12 h-12 bg-gray-200" />
            <span className="ml-1 w-12 h-4 bg-gray-200"></span>
          </div>
        </div>
        <div className="p-4 flex-1 flex">
          <div className="w-20 h-5 bg-gray-200" />
        </div>
        <div className="p-4 flex-1 flex ">
          <div className="w-20 h-5 bg-gray-200" />
        </div>
        <div className="p-4 flex-1 flex">
          <div className="w-20 h-5 bg-gray-200" />
        </div>
        <div className="p-4 flex-1 flex ">
          <div className=" w-20 h-5 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
