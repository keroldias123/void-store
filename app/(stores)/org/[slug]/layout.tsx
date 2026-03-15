import { DashboardHeader } from "../../components/navbar";
import { Navigation } from "../../components/tabs";


interface LayoutProps {
    children: React.ReactNode;
}

export default function OrgLayout({ children }: LayoutProps) {
    
    return(
        <div className="min-h-screen">
        <DashboardHeader />
        <Navigation/>
        <main >{children}</main>
    </div> 
    )
}