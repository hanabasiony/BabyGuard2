import React, { createContext, useEffect, useState } from 'react'

export const authContext = createContext()

export default function AuthcontextProvider({ children }) {

    const [userToken, setuserToken] = useState(null)
    const [loading, setLoading] = useState(true);
    // const [ isAdmin , setIsAdmin ] = useState(null)
    // const [ role , setRole ] = useState(null)



   

    useEffect(function(){
        console.log("refreshed");
        
        if( localStorage.getItem('token') != null){
            setuserToken(localStorage.getItem('token'))
        }
        // if( localStorage.getItem('role') != null){
        //     setuserToken(localStorage.getItem('role'))
        // }

    } , [])
     
    return (
        <>
            <authContext.Provider value={ {
                userToken, setuserToken
             } }>
                {children}

            </authContext.Provider>

        </>
    )
}
