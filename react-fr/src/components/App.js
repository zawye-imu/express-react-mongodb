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
    name: "John",
    fullname: "JohnDoe",
    company: '261 Erdman Ford',
    memberID: '111',
    formerID: '10001',
    mailAddress: 'JD@erd.co',
    startYM: '2024/04',
    endYM: '2024/12'
  },
  {
    name: "Jane",
    fullname: "Jane Doe",
    company: '261 Erdman Ford',
    memberID: '112',
    formerID: '10002',
    mailAddress: 'Jane@erd.co',
    startYM: '2024/04',
    endYM: '2024/12'
  },
  {
    name: "Aung",
    fullname: "Than Aung",
    company: 'Freedom Exp.',
    memberID: '113',
    formerID: 'HJ009',
    mailAddress: 'ta2020@free.net',
    startYM: '2024/04',
    endYM: '2025/12'
  },
  {
    name: "Satou",
    fullname: "Satou",
    company: 'Gfords',
    memberID: '114',
    formerID: 'HHH20',
    mailAddress: 'sky@hotmail.com',
    startYM: '2024/04',
    endYM: '2025/12'
  }
];

const companySelect = data.map(d => d.company);

function App({userType}) {
  //should be memoized or stable
  
  console.log("Logging",userType,DefinedUserType.admin)

  /**
  * @type {import('material-react-table').MRT_ColumnDef<User>[]}
  */
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name', //access nested data with dot notation
        header: '名前',
        filterVariant: 'text',
        size: 150,
        Cell: ({cell})=>{
          return (<span style={{color:'red'}}>{cell.getValue()}</span>)
        }
      },
      {
        accessorKey: 'fullname',
        header: 'Name',
        size: 150,
        Footer: (obj) =>{
          console.log("logging 2",obj);
          return (<span >Hello</span>)
        }
      },
      {
        accessorKey: 'company', //normal accessorKey
        header: '会社',
        filterVariant: 'select',
        filterSelectOptions: companySelect,
        size: 200,
      },
      {
        accessorKey: 'memberID',
        header: '社員ID',
        size: 150,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'formerID',
        header: '旧社員ID',
        size: 150,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'mailAddress', //normal accessorKey
        header: 'メールアドレス',
        size: 200,
      },
      {
        accessorKey: 'startYM', //normal accessorKey
        header: '配属日',
        size: 200,
        filterVariant: "date-range"
      },
      {
        accessorKey: 'endYM', //normal accessorKey
        header: '退出日',
        size: 200,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns, 
    data, 
    initialState: { 
      columnVisibility: { endYM: userType === DefinedUserType.admin ? true : false },
      showColumnFilters: true,
    },
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
