import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import { Navbar } from "../efficiency-app/nav/Navbar";
import { ReactNode } from "react";

interface Props {
    containerClassName?: string;
    childrenStackClassnames?: string;
    navbarTitle: string;
    headerTitle: string;
    extraHeading?: ReactNode;
    children: ReactNode;

}

export default function OverviewContainer(props: Props) {
    const { containerClassName, navbarTitle, headerTitle, children, childrenStackClassnames, extraHeading } = props;
    return (
        <>
            <Toaster />
            <Navbar title={navbarTitle} />
            <div className={cn('mx-4', 'sm:mx-8', 'p-1')}>
                <div className={cn('pt-8', containerClassName)}>
                    <div className="header-container pb-4">
                        <div className={`flex justify-between items-center flex-row`}>

                            <h2 className={`text-2xl font-semibold mr-4`}>{headerTitle}</h2>

                            {extraHeading ? <div>{extraHeading}</div> : null}
                        </div>
                    </div>
                    <div className={cn('flex', 'flex-col', 'gap-5', childrenStackClassnames)}>
                        {children}
                    </div>

                </div>

            </div>

        </>

    )


}