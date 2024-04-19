import './App.css';
import { useMemo,useState,useContext } from 'react';
import {
  createRow,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import { userType as  DefinedUserType } from '../data';
import { DatePicker } from '@mui/x-date-pickers';
import { Select,MenuItem } from '@mui/material';
import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { GlobalContext } from '../contexts/globalContext';

function App({userType}) {

  const [orders,setOrders] =  useState([]);
  const [validationErrors,setValidationErrors] = useState({});
  const gs = useContext(GlobalContext);

  const queryClient = useQueryClient();

  const dataQuery = useQuery({
    queryKey: ['userData'],
    queryFn: async () =>{
      const data = await axios.get('http://localhost:8000/users')
      return data.data;
    }
  })

  // サーバーに追加
  const userMutation = useMutation({
    mutationFn: async (user) => {
      return axios.post('http://localhost:8000/user-add', user)
  },
  onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["userData"]})

  })

  // サーバーアップデート
  const userMutationUpdate = useMutation({
    mutationFn: async (data) => {
      const id = data.id;
      delete data.id;
      return axios.put(`http://localhost:8000/user/${id}`, data)
       
  },
  onError: (error) => {
    alert("encounter an error while updating")
  },
  onSuccess: (data,variables,context)=> {
    queryClient.setQueryData(['userData',{_id:data.data._id}],data)
  },
  onSettled: ()=> queryClient.invalidateQueries({queryKey: ["userData"]})
  })


  const saveEditedUser =  ({values,table,row}) => {
    let newValidationErrors = validateUser(values)
    if(Object.values(newValidationErrors).some((error) => error)){
      setValidationErrors(newValidationErrors)
      return
    }

    setValidationErrors({})

      userMutationUpdate.mutateAsync({...values,id:row.id})
      .then(() =>
        {
          table.setEditingRow(null)
        }
      ).catch(err => console.log(err))

  }

  const validateUser = (user) => {
    return {
      name: user.name ? "" : "名前が必要です"
    }
  }

  const createUser = ({values,table}) => {
    // validation here
    let newValidationErrors = validateUser(values)
    if(Object.values(newValidationErrors).some((error) => error)){
      setValidationErrors(newValidationErrors)
      return
    }

    setValidationErrors({})

    userMutation.mutate(values,{
      
      onError: (err)=> {
        alert("User add errr! please check.")
      }
    })
    
    table.setCreatingRow(false)
  }
  

  /**
  * @type {import('material-react-table').MRT_ColumnDef<User>[]}
  */
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name', 
        header: '名前',
        filterVariant: 'text',
        size: 150,
        Cell: ({cell})=>{
          return (<span style={{color:'red'}}>{cell.getValue()}</span>)
        },
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,
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
        // editVariant: "select",
        // editSelectOptions: ['有効','無効'],
        enableEditing: true,
        muiTableBodyCellProps: ({ cell,table }) => ({
          onDoubleClick: (event) => {
            table.setEditingCell(cell)
          },
        }),
        Edit: ({table,row,column,cell}) => {
          const [val,setVal] = useState(cell.getValue())
          return <Select
          sx={{minWidth: 120}}
          variant='standard'
          value={val}
          onChange={(event)=>{
            //　新規行の作成ため
            row._valuesCache[column.id] = event.target.value;

            //　値が変わるため
            setVal(event.target.value)

          }}
          >
            <MenuItem value={true}>有効</MenuItem>
            <MenuItem value={false}>無効</MenuItem>
          </Select>
        }
        // muiEditTextFieldProps: ({ row }) => ({
        //   defaultValue: '有効',
        //   select: true,
        //   onChange: (event) => {
        //     // 編集の場合
        //     const tmp = [...data]
        //     let targetData = tmp.find(t => t.id ===  row.original.id);
        //     // 
        //     if(targetData) {
        //       targetData.active = (event.target.value === "有効" ? true : false)
        //       setData(tmp);
        //     }
            
        //   }
        // }),
      },
      {
        accessorKey: 'company', //normal accessorKey
        header: '会社',
        filterVariant: 'select',
        filterSelectOptions: [],
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
        Edit: ({table,row,column}) => {
          const props = {
            format: "YYYY/MM",
            views: ['month','year']
          };
          return <DatePicker {...props}
          onChange={(newVal)=>{
            row._valuesCache[column.id] = newVal;
          }} label="date"></DatePicker>
        },
        Cell: ({ cell }) => String(cell.getValue()),
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
    [validationErrors]
  );

  const table = useMaterialReactTable({
    columns, 
    data:dataQuery.data || [], 
    getRowId: (r) => (r._id),
    initialState: { 
      columnVisibility: { endYM: userType === DefinedUserType.admin ? true : false,"mrt-row-drag":userType === DefinedUserType.admin ? true : false },
      showColumnFilters: true,
      editingCell:null,
      columnOrder: ["mrt-row-drag","mrt-row-select","mrt-row-actions","name","fullname","active","compnay","memberID",
    "formerID","mailAddress","startYM","endYM"]
    },
    state: {
      showProgressBars: dataQuery.isRefetching,
      showAlertBanner: dataQuery.isError,
      isLoading: dataQuery.isLoading,
      isSaving: userMutation.isPending,
    },
    positionCreatingRow: "bottom",
    enableRowOrdering:true,
    enableEditing: true,
    editDisplayMode: "row",
    onCreatingRowSave: createUser,
    createDisplayMode: "row",
    onEditingRowCancel: ()=> console.log("Canceled"),
    onEditingRowSave: saveEditedUser,
    muiRowDragHandleProps:({table}) =>({
      onDragEnd: () => {
        //data re-ordering logic here
        const { draggingRow, hoveredRow } = table.getState();
        
        // 順番置き換え
        let draggedIndex = draggingRow.index;
        let hoveredIndex = hoveredRow.index;
        
        
        // ドラッグした行を下か上に置く
        // data.splice(
        //   hoveredRow.index,
        //   0,
        //   data.splice(draggingRow.index, 1)[0],
        // );
        let data  = []
        queryClient.setQueryData(["userData"],(oldData) =>{
          data = [...oldData];
          let tmp = oldData[draggedIndex]
          data[draggedIndex] = data[hoveredIndex]
          data[hoveredIndex] = tmp
          return data
        })

        // DB保存するため、idプロパティでもOK
        const orders = data.map(d=>d.ordering)
        setOrders(orders)
      },
    }),
    enableRowSelection: true,
    enableSorting: false,
    enableRowActions: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableGlobalFilter: false,
    enableHiding: false,
    enableTopToolbar: false,
    displayColumnDefOptions: { 'mrt-row-actions': { size: 120 } },
    renderRowActions: ({row,table}) =>{
      return (<button onClick={()=>table.setEditingRow(row)}>Edit</button>)
    }, 
    // enableTopToolbar: false と結果が同様
    // muiTopToolbarProps:{
    //   sx:{
    //     backgroundColor:"silver",
    //     "& .css-78trlr-MuiButtonBase-root-MuiIconButton-root":{
    //       display: "none"
    //     }
    //   }
    // }
  });

  return (
    <div className="App">
      <button onClick={()=> console.log(orders)}>Check Orders</button>
      <button onClick={()=> dataQuery.refetch()}>Refetch Data</button>
      <button onClick={()=> {
        console.log(dataQuery.data)
      }}>Check Query</button>
      <button onClick={()=> table.setCreatingRow(createRow(table,{
        active: true
      }))}>Create Row</button>
      <button onClick={()=> console.log(gs)}>Check context</button>
      <MaterialReactTable table={table} />
    </div>
  );
}

export default App;
