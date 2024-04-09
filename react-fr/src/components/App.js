import './App.css';
import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import { userType as  DefinedUserType } from '../data';

// Table data スキーマ
/**
 * @typedef {Object} TData - Table data
 * @property {Object} name
 * @property {String} address
 * @property {String} city
 * @property {String} state
 */


/**
 * @type {TData}
 */
const data = [
  {
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    name: {
      firstName: 'Jane',
      lastName: 'Doe',
    },
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    name: {
      firstName: 'Joe',
      lastName: 'Doe',
    },
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia',
  },
  {
    name: {
      firstName: 'Kevin',
      lastName: 'Vandy',
    },
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
  },
  {
    name: {
      firstName: 'Joshua',
      lastName: 'Rolluffs',
    },
    address: '32188 Larkin Turnpike',
    city: 'Charleston',
    state: 'South Carolina',
  }
];

function App({userType}) {
  //should be memoized or stable
  
  console.log("Logging",userType,DefinedUserType.admin)

  /**
  * @type {import('material-react-table').MRT_ColumnDef<User>[]}
  */
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name.firstName', //access nested data with dot notation
        header: 'First Name',
        size: 150,
        Cell: ({cell})=>{
          return (<span style={{color:'red'}}>{cell.getValue()}</span>)
        }
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name',
        size: 150,
        Footer: (obj) =>{
          console.log("logging 2",obj);
          return (<span >Hello</span>)
        }
      },
      {
        accessorKey: 'address', //normal accessorKey
        header: 'Address',
        size: 200,
      },
      {
        accessorKey: 'city',
        header: 'City',
        size: 150,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'state',
        header: 'State',
        size: 150,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns, 
    data, 
    initialState: { columnVisibility: { state: userType === DefinedUserType.admin ? true : false } },
    enableRowActions: true,
    displayColumnDefOptions: { 'mrt-row-actions': { size: 120 } },
    renderRowActions: ({row}) =>{
      return (<button>Click me</button>)
    }, 
  });

  return (
    <div className="App">
      Hello
      <MaterialReactTable table={table} />
    </div>
  );
}

export default App;
