import SideBar from "../sidebar/sideBar"
import Header from "../header/header"
import { Box, Container, Grid } from "@material-ui/core"

const Main = () => {

    return (
        <>

            <div className="flex  bg-black main">
                <SideBar />
                <div className="h-full  flex flex-col content-center  w-full">
                    <Header />
                </div>
            </div>
        </>
    )

}

export default Main