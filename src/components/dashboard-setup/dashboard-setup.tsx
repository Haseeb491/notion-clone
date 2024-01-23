'use client';

import { AuthUser } from '@supabase/supabase-js'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

interface DashboardSetupProps {
    user: AuthUser,
    subscription: {} | null,
}

const DashboardSetup = ({ user, subscription }: DashboardSetupProps) => {
    return (
        <Card className='w-[800px] h-screen sm:h-auto ' >
            <CardHeader>
                <CardTitle>
                    Create a new workspace
                </CardTitle>
                <CardDescription>
                    Lets create a private workspace to get you started,
                    You can add collaborators to it later in the workspace settings
                </CardDescription>
                <CardContent>
                    <form onSubmit={() => { }}>
                        <div className="flex flex-col gap-4"></div>
                        <div className="flex items-center gap-4 ">
                            <div className="text-5xl">

                            </div>
                        </div>
                    </form>
                </CardContent>
            </CardHeader>
        </Card>
    )
}

export default DashboardSetup