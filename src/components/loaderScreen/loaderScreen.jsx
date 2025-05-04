import React from 'react'
import { FallingLines , Circles} from 'react-loader-spinner'


export default function LoaderScreen() {
    return (
        <div>
            <div className=" h-screen flex justify-center items-center bg-pink-50">
                {/* <FallingLines
                    color="#fbcfe8"
                    width="100"
                    visible={true}
                    ariaLabel="falling-circles-loading"
                /> */}
                <Circles
                    height="80"
                    width="80"
                    color="#fbcfe8"
                    ariaLabel="circles-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />
            </div>
        </div>
    )
}
