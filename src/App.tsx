import { useEffect, useState } from 'react';
import { connectWs } from './ws';
import './App.css';
import { wsAdapter, type ResponseDAO } from './adapter';
import { filterRecord } from './filter';
import { Table } from './Components/Table';

const keySet = new Set();

function App() {
  const [list, setList] = useState<ResponseDAO[]>([]);
  const [sourceFilter, setSourceFilter] = useState('');
  const [keyFilter, setKeyFilter] = useState('');
  
  const filteredList = list.filter(row => filterRecord({ keywords: row.keywords, keyFilter, source: row.source, sourceFilter }))

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
          <Table isLoading={list.length <= 0} filteredList={filteredList}/>
        </div>
      </div>
    </>
  );
}

export default App;
