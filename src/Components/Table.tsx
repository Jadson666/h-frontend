import { useState } from 'react';
import type { ResponseDAO } from '../adapter';

const recordHeight = 150;
const windowHeight = 800;
const overScan = 10;

const SimpleLoading = () => {
  return <div className='flex justify-center p-20 col-span-full'>Loading...</div>;
};

const Record = ({ data, itemHeight, index }: { data: ResponseDAO; itemHeight: number; index: number }) => {
  const { source, headline, link, keywords, timestamp, priority } = data;

  return (
    <div
      style={{ height: `${itemHeight}px`, top: `${itemHeight * index}px` }}
      className={`w-full opacity-0 transform animate-fade-in min-h-30 gap-4 px-4 py-4 col-span-7 grid grid-cols-subgrid border-b border-gray-200 hover:bg-gray-100 transition ${
        priority === 'high' ? 'bg-red-100' : ''
      }`}
    >
      <div>{source}</div>
      <div>{headline}</div>
      <div>
        {link ? (
          <a
            href={link}
            target='_blank'
            className='underline text-blue-600 hover:text-blue-800 visited:text-purple-600'
          >
            Link
          </a>
        ) : (
          ''
        )}
      </div>
      <div>{keywords.join(', ')}</div>
      <div>{new Date(timestamp).toLocaleString()}</div>
      <div>
        <button
          type='button'
          className='cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
          onClick={() => console.log(data)}
        >
          Log to console
        </button>
      </div>
    </div>
  );
};

export const Table = ({ filteredList, isLoading }: { filteredList: ResponseDAO[]; isLoading: boolean }) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / recordHeight) - overScan);
  const endIndex = Math.min(filteredList.length, Math.floor(scrollTop + windowHeight / recordHeight) + overScan);
  const generateRows = () => {
    const items = [];
    for (let i = startIndex; i < endIndex; i++) {
      items.push(<Record key={i} index={i} data={filteredList[i]} itemHeight={recordHeight} />);
    }

    return items;
  };
  return (
    <div>
      <div
        className={`grid grid-cols-7 border border-gray-300 shadow-lg rounded-lg overflow-y-auto h-[${isLoading ? 200: windowHeight}px]`}
        onScroll={(e) => {
          setScrollTop(e.currentTarget.scrollTop);
        }}
      >
        <div className='px-4 py-8 gap-4 col-span-7 grid grid-cols-subgrid bg-green-500 text-white max-h-[88px]'>
          <div className='font-bold'>SOURCE</div>
          <div className='font-bold'>HEADLINE</div>
          <div className='font-bold'>LINK</div>
          <div className='font-bold'>KEYWORDS</div>
          <div className='font-bold'>TIMESTAMP</div>
        </div>
        {isLoading ? <SimpleLoading /> : generateRows()}
      </div>
    </div>
  );
};
