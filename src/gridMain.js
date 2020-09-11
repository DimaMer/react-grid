import React from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import EnhancedTable from './components/EnhancedTable'
import makeData from './makeData'
// import My from './components/My'
import styled from "styled-components";
import matchSorter from 'match-sorter'
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom';

const Styles = styled.div`
* {
  font-family: Helvetica Neue, Arial, sans-serif;
    font-size:1.2rem;
}
thead, th{
  background: tomato;
}
.MuiTableRow-root.MuiTableRow-footer{
  background: tomato;
}
h1,
table {
  text-align: center;
}

table {
  border-collapse: collapse;
  width: 70%;
  margin: 0 auto 5rem;
  padding: 1.5rem;
}

th,
td {
  padding: 1.5rem;
  font-size:1.5rem;
}

tr {
  background: hsl(50, 50%, 80%);
}
tr,
td {
  transition: 0.4s ease-in;
}




// tr:first-child {
//   background: hsla(12, 100%, 40%, 0.5);
// }

tr:nth-child(even) {
  background: hsla(50, 50%, 80%, 0.8);
}

td:empty {
  background: hsla(50, 25%, 60%, 0.7);
}
tr:hover:not(#firstrow),
tr:hover td:empty {
  background: #ff0;
  pointer-events: visible;
}

// tr:hover:not(#firstrow) {
//   transform: scale(1.2);
//   font-weight: 700;
//   box-shadow: 0px 3px 7px rgba(0, 0, 0, 0.5);
// }
`




// Define a default UI for filtering
function DefaultColumnFilter({
                                 column: { filterValue, preFilteredRows, setFilter },
                             }) {
    const count = preFilteredRows.length

    return (
        <input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
                                column: { filterValue, setFilter, preFilteredRows, id },
                            }) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    // Render a multi-select box
    return (
        <select
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">All</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values


// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({
                                     column: { filterValue = [], preFilteredRows, setFilter, id },
                                 }) {
    const [min, max] = React.useMemo(() => {
        let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        preFilteredRows.forEach(row => {
            min = Math.min(row.values[id], min)
            max = Math.max(row.values[id], max)
        })
        return [min, max]
    }, [id, preFilteredRows])

    return (
        <div
            style={{
                display: 'flex',
            }}
        >
            <input
                value={filterValue[0] || ''}
                type="number"
                onChange={e => {
                    const val = e.target.value
                    setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
                }}
                placeholder={`Min (${min})`}
                style={{
                    width: '70px',
                    marginRight: '0.5rem',
                }}
            />
            to
            <input
                value={filterValue[1] || ''}
                type="number"
                onChange={e => {
                    const val = e.target.value
                    setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
                }}
                placeholder={`Max (${max})`}
                style={{
                    width: '70px',
                    marginLeft: '0.5rem',
                }}
            />
        </div>
    )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val



const GridMain = () => {
    const columns = React.useMemo(
        () => [
            {
                Header: 'First Name',
                accessor: 'firstName',
                Filter: DefaultColumnFilter,
                filter: 'fuzzyText',
            },
            {
                Header: 'Last Name',
                accessor: 'lastName',
                Filter: DefaultColumnFilter,
                filter: 'fuzzyText',
            },
            {
                Header: 'Age1',
                accessor: 'age',
                Filter: NumberRangeColumnFilter,
                filter: 'between',
            },
            {
                Header: 'Visits',
                accessor: 'visits',
                Filter: NumberRangeColumnFilter,
                filter: 'between',
            },
            {
                Header: 'Status',
                accessor: 'status',
                Filter: SelectColumnFilter,
                filter: 'includes',

            },
            {
                Header: 'Profile Progress',
                accessor: 'progress',
                Filter: NumberRangeColumnFilter,
                filter: 'between',
            },
        ],
        []
    )

    const [data, setData] = React.useState(React.useMemo(() => makeData(20), []))
    const [skipPageReset, setSkipPageReset] = React.useState(false)

    // We need to keep the table from resetting the pageIndex when we
    // Update data. So we can keep track of that flag with a ref.

    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
    const updateMyData = (rowIndex, columnId, value) => {
        // We also turn on the flag to not reset the page
        setSkipPageReset(true)
        setData(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    }
                }
                return row
            })
        )
    }

    return (
        <div>

                <CssBaseline />
                <Styles>
                    <EnhancedTable
                        columns={columns}
                        data={data}
                        setData={setData}
                        updateMyData={updateMyData}
                        skipPageReset={skipPageReset}
                    />
                </Styles>
        </div>
    )
}

export default GridMain
