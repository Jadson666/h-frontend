import { useState } from 'react';
import Table from './Components/Table';
import { gridColumnRules } from './Components/constants';
import './App.css';

function App() {
  const [sourceFilter, setSourceFilter] = useState('');
  const [keyFilter, setKeyFilter] = useState('');

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
          <div className='border border-gray-300 rounded-2xl overflow-hidden'>
            <div className={`px-4 py-8 col-span-7 grid ${gridColumnRules} bg-gray-600 text-white`}>
              <div className='font-bold'>SOURCE</div>
              <div className='font-bold'>HEADLINE</div>
              <div className='font-bold'>LINK</div>
              <div className='font-bold'>KEYWORDS</div>
              <div className='font-bold'>TIMESTAMP</div>
            </div>
            <Table keyFilter={keyFilter} sourceFilter={sourceFilter}/>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
