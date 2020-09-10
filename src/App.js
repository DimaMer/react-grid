import React from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import EnhancedTable from './components/EnhancedTable'
import makeData from './makeData'
// import My from './components/My'
import styled from "styled-components";



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

const App = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
      },
      {
        Header: 'Age1',
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
      {/*<My/>*/}
    </div>
  )
}

export default App
