import { Footer } from "@/components/footer";
import { Navbar } from "./components/navbar";
interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className=" min-h-screen">
            <Navbar />
            <main >{children}</main>
            <Footer />
        </div>
    )
}