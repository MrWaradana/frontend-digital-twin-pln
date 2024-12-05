'use client';

import OverviewContainer from "@/components/containers/OverviewContainer";
import { Card } from "@/components/ui/card";
import { EFFICIENCY_API_URL, OPTIMUM_OH_API_URL } from "@/lib/api-url";
import { useApiMutation } from "@/lib/APIs/useApiMutation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


export default function Page() {
    const { data: session } = useSession();
    const [data, setData] = useState([])

    const {
        trigger,
        isLoading,
    } = useApiMutation(
        `${OPTIMUM_OH_API_URL}/calculation/time-constraint`,
        !!session?.user.access_token,
        session?.user.access_token
    )


    const handleSubmit = async () => {
        const res = await trigger({
            overhaulCost: 100000000,
            scopeOH: "B",
            costPerFailure: 14560166.232511526,
            metadata: {
                calculatedBy: "user123",
                timestamp: "2024-11-28T10:00:00Z"
            }
        })

        console.log(res)

        if (res) {
            setData(res)
        }


        return (
            <OverviewContainer
                containerClassName="main-container"
                navbarTitle="Components Example"
            >
                <Card className="w-full p-4 bg-white rounded-md">
                    <div className="flex flex-col gap-4">
                        <h1>Oh Calculation chart</h1>

                        <LineChart width={800} height={400} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="overhaulCost" stroke="#8884d8" name="Overhaul Cost" />
                            <Line type="monotone" dataKey="correctiveCost" stroke="#82ca9d" name="Corrective Cost" />
                            <Line type="monotone" dataKey="totalCost" stroke="#ff7300" name="Total Cost" />
                        </LineChart>

                    </div>

                </Card>
            </OverviewContainer>
        )
    }