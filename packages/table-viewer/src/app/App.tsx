import {FsmEvent, FsmNodeTable, FsmSchemeOrState, FsmNode} from '@podsostate/core';
import {createCounter} from '@podsostate/shared';
import React, {useMemo} from 'react';
import {table} from './table';
import {cn} from './cn';

const getMap = (mapper: FsmNodeTable) => {
  return Array.from(mapper.entries());
};

const eventCounter = createCounter((current) => `event${current}`);

export const App: React.FC = () => {
  const source = useMemo(() => {
    return Array.from(table.table.entries());
  }, []);

  const events = useMemo(() => {
    return source
      .map(([, row]) => {
        return getMap(row)
          .map(([event]) => event)
          .map((event) => {
            if (!event.name) {
              event.name = eventCounter.fire();
            }

            return event;
          });
      })
      .flat()
      .reduce((acc, next) => {
        if (!acc.map((event) => event.name).some((name) => name === next.name)) {
          return [...acc, next];
        }

        return acc;
      }, [] as FsmEvent[])
      .map((event) => event);
  }, []);

  const data = source.map(([col, mapper]) => {
    const rows = Array.from(Array(events.length)).fill('') as FsmNode<FsmSchemeOrState>[];
    getMap(mapper).forEach(([event, item]) => {
      const index = events.map((e) => e.name).indexOf(event.name);
      rows[index] = item;
    });
    return [col, rows] as const;
  });

  return (
    <div className={cn('app')}>
      <main className={cn('main')}>
        <table className={cn('table')}>
          <thead>
            <tr>
              <td className={cn('cell', 'cell-angle')}>From</td>
              {events.map((event, index) => {
                return (
                  <td
                    key={index}
                    className={cn('cell', 'cell-head', event.isLib && 'cell-sys-event')}
                  >
                    {event.name}
                  </td>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.map(([col, rows]) => {
              return (
                <tr key={col.id}>
                  <td className={cn('cell', 'cell-head', table.root.id === col.id && 'cell-root')}>
                    <p>{col.id}</p>
                    <p>{col.source?.name}</p>
                  </td>
                  {rows.map((row, index) => {
                    return (
                      <td key={index} className={cn('cell', 'cell-content')}>
                        <p>{row.id}</p>
                        <p>{row.source?.name}</p>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
};
