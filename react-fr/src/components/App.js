import './App.css';
import { useMemo,useState } from 'react';
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

function createDateFromYearMonth(yearMonthString) {
  // Split the string into year and month parts
  var parts = yearMonthString.split('/');

  // Extract year and month from parts
  var year = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10) - 1; // Subtract 1 because months are zero-based in JavaScript

  // Create a new Date object with the specified year and month
  return new Date(year, month);
}
/**
 * @type {TData}
 */
const sampleData = [
  {
    id:1,
    ordering: 0,  
    active: true,
    name: "John",
    fullname: "JohnDoe",
    company: '261 Erdman Ford',
    memberID: '111',
    formerID: '10001',
    mailAddress: 'JD@erd.co',
    startYM: createDateFromYearMonth('2024/04'),
    endYM: '2024/12'
  },
  {
    id:2,
    ordering: 1, 
    active: true,
    name: "Jane",
    fullname: "Jane Doe",
    company: '261 Erdman Ford',
    memberID: '112',
    formerID: '10002',
    mailAddress: 'Jane@erd.co',
    startYM: createDateFromYearMonth('2024/04'),
    endYM: '2024/12'
  },
  {
    id:3,
    ordering: 2, 
    active: true,
    name: "Aung",
    fullname: "Than Aung",
    company: 'Freedom Exp.',
    memberID: '113',
    formerID: 'HJ009',
    mailAddress: 'ta2020@free.net',
    startYM: createDateFromYearMonth('2024/04'),
    endYM: '2025/12'
  },
  {
    id:4,
    ordering: 3, 
    active: true,
    name: "Satou",
    fullname: "Satou",
    company: 'Gfords',
    memberID: '114',
    formerID: 'HHH20',
    mailAddress: 'sky@hotmail.com',
    startYM: createDateFromYearMonth('2024/04'),
    endYM: '2025/12'
  }
];

const companySelect = sampleData.map(d => d.company);

function App({userType}) {
  //should be memoized or stable

  const [data,setData] = useState(sampleData);
  const [orders,setOrders] =  useState([]);

  const saveEditedUser =  () => {
    console.log("Here")
  }
  

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
          return (<span >Hello</span>)
        }
      },
      {
        accessorKey: 'active',
        header: '状態',
        size: 150,
        Cell: ({cell}) => (cell.getValue() === true ? '有効' : '無効'),
        editVariant: "select",
        editSelectOptions: ['有効','無効'],
        enableEditing: true,
        muiTableBodyCellProps: ({ cell,table }) => ({
          onDoubleClick: (event) => {
            table.setEditingCell(cell)
          },
        }),
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          onChange: (event) => {
            const tmp = [...data]
            tmp.find(t => t.id ===  row.original.id).active = (event.target.value === "有効" ? true : false)
            setData(tmp);
          }
        }),
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
        filterVariant: "date-range",
        Cell: ({ cell }) => cell.getValue().toLocaleDateString(),
        muiFilterDatePickerProps:{
          format:"YYYY/MM",
          views: ['month','year']
        }
      },
      {
        accessorKey: 'endYM', //normal accessorKey
        header: '退出日',
        size: 200,
      },
    ],
    [data]
  );

  const table = useMaterialReactTable({
    columns, 
    data, 
    initialState: { 
      columnVisibility: { endYM: userType === DefinedUserType.admin ? true : false },
      showColumnFilters: true,
      editingCell:null,
    },
    enableRowOrdering:true,
    enableEditing: true,
    editDisplayMode: "row",
    onEditingRowCancel: ()=> console.log("Cancled"),
    onEditingRowSave: saveEditedUser,
    muiRowDragHandleProps:({table}) =>({
      onDragEnd: () => {
        //data re-ordering logic here
        const { draggingRow, hoveredRow } = table.getState();
        console.log("logging drag",draggingRow,hoveredRow)
        data.splice(
          hoveredRow.index,
          0,
          data.splice(draggingRow.index, 1)[0],
        );

        // DB保存するため
        const orders = data.map(d=>d.ordering)
        setOrders(orders)
        


        setData([...data]);
      },
    }),
    enableSorting: false,
    enableRowActions: true,
    displayColumnDefOptions: { 'mrt-row-actions': { size: 120 } },
    renderRowActions: ({row,table}) =>{
      return (<button onClick={()=>table.setEditingRow(row)}>Edit</button>)
    }, 
  });

  return (
    <div className="App">
      Hello
      <button onClick={()=> console.log(orders)}>Check Orders</button>
      <button onClick={()=> console.log(data)}>Check Data</button>
      <MaterialReactTable table={table} />
    </div>
  );
}

export default App;
