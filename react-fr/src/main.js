
import { Outlet } from "react-router-dom"
import { GlobalContext } from "./contexts/globalContext"
import { useState } from "react"

const Main = () => {
    const [globalSate,setGlobalState] = useState({
        currentUserType: "user"
    });
    return (<>
    <GlobalContext.Provider value={{
        globalSate,setGlobalState
    }}>
    <div style={{backgroundColor:"white"}}>
        <Outlet />
    </div>
    </GlobalContext.Provider>
    </>)
}


export default Main