'use client'
import { Navbar } from "../../navbar/Navbar"
import ExamsTable from "../../examsTable/ExamsTable"

export default function Dashboard() {  
    
    return (
        <div>
            <Navbar />
            <ExamsTable />
        </div>
    )    
}
