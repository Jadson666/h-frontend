import { useEffect, useState } from 'react';
import { connectWs } from './ws';
import './App.css';
import { wsAdapter, type ResponseDAO } from './adapter';
import { filterRecord } from './filter';

const keySet = new Set();

const Record = ({ data }: { data: ResponseDAO }) => {
  const { source, headline, link, keywords, timestamp, priority } = data;

  return (
    <div
      className={`opacity-0 transform animate-fade-in min-h-30 gap-4 px-4 py-4 col-span-7 grid grid-cols-subgrid border-b border-gray-200 hover:bg-gray-100 transition ${
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

const SimpleLoading = () => {
  return <div className='flex justify-center p-20 col-span-full'>Loading...</div>;
};

function App() {
  const [list, setList] = useState<ResponseDAO[]>([]);
  const [sourceFilter, setSourceFilter] = useState('');
  const [keyFilter, setKeyFilter] = useState('');

  useEffect(() => {
    connectWs({
      onmessage: (data) => {
        if (!keySet.has(data.id)) {
          setList((prev) => [wsAdapter(data), ...prev]);
        }
        keySet.add(data.id);
      }
    });
  }, []);

  return (
    <>
      <div className='flex flex-col items-center py-4'>
        <div className='w-5/6'>
          <div className='border border-gray-300 p-2 rounded-lg'>
            <div className='font-bold mb-4'>FILTERS</div>
            <div className='flex gap-10 w-full'>
              <div className='w-1/2'>
                <label className='block mb-2 text-sm font-medium text-gray-900'>Source</label>
                <input
                  type='text'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='ex. Twitter'
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                />
              </div>
              <div className='w-1/2'>
                <label className='block mb-2 text-sm font-medium text-gray-900'>Keywords</label>
                <input
                  type='text'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='ex. Japan'
                  value={keyFilter}
                  onChange={(e) => setKeyFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className='self-start'>
            *background of row will be <span className='text-red-400'>red</span> when Priority is high
          </div>
          <div className='grid grid-cols-7 border border-gray-300 shadow-lg rounded-lg'>
            <div className='px-4 py-8 gap-4 col-span-7 grid grid-cols-subgrid bg-green-500 text-white'>
              <div className='font-bold'>SOURCE</div>
              <div className='font-bold'>HEADLINE</div>
              <div className='font-bold'>LINK</div>
              <div className='font-bold'>KEYWORDS</div>
              <div className='font-bold'>TIMESTAMP</div>
            </div>
            {list.length > 0 ? (
              list
                .filter((data) =>
                  filterRecord({ keywords: data.keywords, keyFilter, source: data.source, sourceFilter })
                )
                .slice(0, 20)
                .map((data) => <Record data={data} key={data.id} />)
            ) : (
              <SimpleLoading />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
