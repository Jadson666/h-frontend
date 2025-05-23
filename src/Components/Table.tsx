import { useCallback, useEffect, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { wsAdapter, type ResponseDAO } from '../adapter';
import { connectWs } from '../ws';
import { gridColumnRules } from './constants';
import { filterRecord } from '../filter';
import { SimpleLoading } from './SimpleLoading';

const keySet = new Set();

function Table({ itemHeight = 100, windowHeight = 500, keyFilter = '', sourceFilter = '' }) {
  const [list, setList] = useState<ResponseDAO[]>([]);
  const filteredList = list.filter((row) =>
    filterRecord({ keywords: row.keywords, keyFilter, source: row.source, sourceFilter })
  );
  const listRef = useRef<List>(null);
  const isLoading = list.length === 0;
  const buffer = useRef<ResponseDAO[]>([]);

  // 1. debounce, avoid layout jumping when prepend new record
  // 2. maintain scroll position when prepend new record
  const flushBuffer = useCallback(() => {
    if (!listRef.current) return
    const firstVisibleIndex = (listRef.current.state as { scrollOffset: number }).scrollOffset / itemHeight;
      setList((prev) => [...buffer.current, ...prev]);
      const len = buffer.current.length;
      buffer.current = [];
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollToItem(firstVisibleIndex + len, 'start');
        }
      }, 0);
  }, [itemHeight])

  useEffect(() => {
    const timer = setInterval(() => {
      if (buffer.current.length === 0 || !listRef.current) return;
      flushBuffer()
    }, 3000);
    return () => clearInterval(timer);
  }, [flushBuffer, itemHeight]);

  useEffect(() => {
    const ws = connectWs({
      onmessage: (data) => {
        if (!keySet.has(data.id)) {
          if (listRef.current) {
              buffer.current.unshift(wsAdapter(data));
              keySet.add(data.id);
          }
        }
      }
    });
    return () => ws.close()
  }, [list]);

  return (
    <div>
      {isLoading && <SimpleLoading />}
      {
        <List
          ref={listRef}
          height={windowHeight}
          itemCount={filteredList.length}
          itemSize={itemHeight}
          width='100%'
          style={{ display: isLoading ? 'none' : 'block' }}
        >
          {({ index, style }) => {
            const { source, headline, link, keywords, timestamp, priority } = filteredList[index];
            return (
              <div
                style={style}
                className={`px-4 border-t border-gray-300 p-2 bg-gray-50 hover:bg-gray-200 grid ${gridColumnRules} items-center ${
                  priority ? 'bg-red-100' : ''
                }`}
              >
                <div>{source}</div>
                <div>{headline}</div>
                <div>
                  {link ? (
                    <a
                      href={link}
                      target='_blank'
                      className='underline text-blue-300 hover:text-blue-800 visited:text-purple-600'
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
                    className='cursor-pointer text-white bg-blue-800 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-500 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                    onClick={() => console.log(filteredList[index])}
                  >
                    Print Log
                  </button>
                </div>
              </div>
            );
          }}
        </List>
      }
    </div>
  );
}

export default Table;
