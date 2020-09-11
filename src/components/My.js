import React from 'react'
import styled from 'styled-components'
import { useTable, useRowSelect } from 'react-table'

import makeData from '../makeData'

const Styles = styled.div`
* {
  font-family: Helvetica Neue, Arial, sans-serif;
}

body {
  background-image: linear-gradient(#aaa 25%, #000);
}

h1,
table {
  text-align: center;
}

table {
  border-collapse: collapse;
  width: 70%;
  margin: 0 auto 5rem;
}

th,
td {
  padding: 1.5rem;
  font-size: 1.3rem;
}

tr {
  background: hsl(50, 50%, 80%);
}

tr,
td {
  transition: 0.4s ease-in;
}

tr:first-child {
  background: hsla(12, 100%, 40%, 0.5);
}

tr:nth-child(even) {
  background: hsla(50, 50%, 80%, 0.7);
}

td:empty {
  background: hsla(50, 25%, 60%, 0.7);
}

tr:hover:not(#firstrow),
tr:hover td:empty {
  background: #ff0;
  pointer-events: visible;
}
tr:hover:not(#firstrow) {
  transform: scale(1.2);
  font-weight: 700;
  box-shadow: 0px 3px 7px rgba(0, 0, 0, 0.5);
}

`

const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef()
      const resolvedRef = ref || defaultRef

      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
      }, [resolvedRef, indeterminate])

      return (
          <>
            <input type="checkbox" ref={resolvedRef} {...rest} />
          </>
      )
    }
)

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable(
      {
        columns,
        data,
      },
      useRowSelect,
      hooks => {
        hooks.visibleColumns.push(columns => [
          // Let's make a column for selection
          {
            id: 'selection',
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
                <div>
                  <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
                <div>
                  <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                </div>
            ),
          },
          ...columns,
        ])
      }
  )

  // Render the UI for your table
  return (
      <Styles>
        <table {...getTableProps()}>
          <thead>
          {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
          ))}
          </thead>
          <tbody {...getTableBodyProps()}>
          {rows.slice(0, 10).map((row, i) => {
            prepareRow(row)
            return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
            )
          })}
          </tbody>
        </table>
        <p>Selected Rows: {Object.keys(selectedRowIds).length}</p>
        <pre>
        <code>
          {JSON.stringify(
              {
                selectedRowIds: selectedRowIds,
                'selectedFlatRows[].original': selectedFlatRows.map(
                    d => d.original
                ),
              },
              null,
              2
          )}
        </code>
      </pre>
      </Styles>
  )
}

function My() {
  const columns = React.useMemo(
      () => [
        {
          Header: 'Name1',
          columns: [
            {
              Header: 'First Name',
              accessor: 'firstName',
            },
            {
              Header: 'Last Name',
              accessor: 'lastName',
            },
          ],
        },
        {
          Header: 'Info1',
          columns: [
            {
              Header: 'Age',
              accessor: 'age',
            },
            {
              Header: 'Visits',
              accessor: 'visits',
            },
            {
              Header: 'Status',
              accessor: 'status',
            },
            {
              Header: 'Profile Progress',
              accessor: 'progress',
            },
          ],
        },
      ],
      []
  )

  const data = React.useMemo(() => makeData(10, 3), [])

  return (
      <Styles>
        <Table columns={columns} data={data} />
      </Styles>
  )
}

export default My
