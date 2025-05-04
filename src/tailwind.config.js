import x from 'flowbite/plugin'; 

/** @type {import('tailwindcss').Config}*/

//  const plugin = require('flowbite/plugin');
//  import plugin from 'flowbite/plugin';
export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/flowbite/**/*.js"
        ,],
    
    theme: {
        extend: {}
    },
    plugins: [
        // require('flowbite/plugin'),
        x
        // flowbite.plugin()
    ],
}