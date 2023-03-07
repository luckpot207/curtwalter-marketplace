export function FakeSimpleToken() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-8 xl:aspect-h-8" />
      <div className="flex justify-between pl-1 pr-1 mt-4 items-center">
        <div className="mb-2 h-5 w-20 overflow-hidden bg-gray-200 rounded-sm" />
        <div className="mb-2 ml-4 h-5 w-20 overflow-hidden bg-gray-200 rounded-sm" />
      </div>
    </div>
  );
}
