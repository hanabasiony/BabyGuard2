import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import motherPhoto from "../../assets/images/contactPhoto.png";

export default function ContactUs() {
    const [selected, setSelected] = useState('Question');
    const [message, setMessage] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            message,
            type: selected
        };

        console.log('Form Data:', formData);
        setMessage('')
    
    };

    const options = ['Question', 'Suggestion', 'Complain'];
    return (
        //    <div className="bg-white width-full">
        //      <div className="p-4 py-35  max-w-4xl mx-auto space-y-6">
        //       {/* Header */}
        //       <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between">
        //         <div>
        //           <h2 className="text-2xl font-semibold">Contact Us</h2>
        //           <p className="text-sm text-gray-500">We’re here to help! Reach out with any questions or feedback.</p>
        //         </div>
        //       </div>

        //       {/* Contact Info */}
        //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
        //         <div className="bg-white p-6 rounded-2xl shadow flex items-start space-x-4">
        //           <Mail className="text-pink-600 w-5 h-5 mt-1" />
        //           <div>
        //             <p className="font-medium">Email</p>
        //             <p>support@mothercare.com</p>
        //           </div>
        //         </div>
        //         <div className="bg-white p-6 rounded-2xl shadow flex items-start space-x-4">
        //           <Phone className="text-pink-600 w-5 h-5 mt-1" />
        //           <div>
        //             <p className="font-medium">Phone</p>
        //             <p>+1 (800) 123-4567</p>
        //           </div>
        //         </div>
        //         <div className="bg-white p-6 rounded-2xl shadow flex items-start space-x-4">
        //           <MapPin className="text-pink-600 w-5 h-5 mt-1" />
        //           <div>
        //             <p className="font-medium">Address</p>
        //             <p>123 Wellness St, Healthy City, NY</p>
        //           </div>
        //         </div>
        //       </div>

        //       {/* Contact Form */}
        //       <form className="bg-white p-6 rounded-2xl shadow space-y-4">
        //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        //           <input
        //             type="text"
        //             placeholder="Your Name"
        //             className="border border-gray-300 rounded-lg px-4 py-2 w-full"
        //             required
        //           />
        //           <input
        //             type="email"
        //             placeholder="Your Email"
        //             className="border border-gray-300 rounded-lg px-4 py-2 w-full"
        //             required
        //           />
        //         </div>
        //         <input
        //           type="text"
        //           placeholder="Subject"
        //           className="border border-gray-300 rounded-lg px-4 py-2 w-full"
        //           required
        //         />
        //         <textarea
        //           placeholder="Your Message"
        //           rows={4}
        //           className="border border-gray-300 rounded-lg px-4 py-2 w-full"
        //           required
        //         />
        //         <button
        //           type="submit"
        //           className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600"
        //         >
        //           Send Message
        //         </button>
        //       </form>
        //     </div>
        //    </div>

        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-35">
            <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">
                {/* Left Content */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-blue-700">
                        We’re Here for You <br /> & Your Baby!
                    </h2>
                    <p className="text-gray-600">
                        Have a question or suggestion?<br />We’d love to hear from you.
                    </p>

                    <form className="bg-white shadow-md rounded-2xl p-6 space-y-4 border border-gray-200" onSubmit={handleSubmit}>

                        <div>
                            <label className="block text-sm text-gray-700">Message</label>
                            <textarea
                                rows="4" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                        {/* old code for delection */}
                        {/* <div className="max-w-md mx-auto">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">Select Type:</h2>


                            <div className="flex gap-4 flex-wrap">
                                {options.map((option) => (
                                    <label key={option} className={` px-5 py-3  cursor-pointer  rounded-xl   border  font-medium  transition  duration-300 
                                     ${selected === option
                                            ? 'bg-pink-400 text-white border-pink-500 shadow-md'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-pink-500'} `}>

                                        <input
                                            type="radio"
                                            name="type"
                                            value={option}
                                            checked={selected === option}
                                            onClick={() => setSelected(option)}
                                            className="hidden" />

                                        {option}
                                    </label>
                                ))}
                            </div>


                            <p className="mt-4 text-gray-600">Selected: <strong>{selected}</strong></p>
                        </div> */}

                        <div className=" mx-auto mt-6">
                            <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700 mb-2">
                                Choose Feedback Type:
                            </label>
                            <select
                                id="feedbackType"
                                value={selected}
                                onChange={(e) => setSelected(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            >
                                <option value="" disabled>Select one</option>
                                <option value="question">Question</option>
                                <option value="suggestion">Suggestion</option>
                                <option value="complaint">Complaint</option>
                            </select>

                            {/* {selected && (
                                <p className="mt-4 text-sm text-gray-600">
                                    You selected: <strong>{selected}</strong>
                                </p>
                            )} */}
                        </div>


                        <button type="submit" onClick={handleSubmit} className="w-full bg-pink-400 text-white font-semibold py-2 rounded-md hover:bg-pink-500 transition" >Send Message</button>
                    </form>
                </div>

                {/* Right Content */}
                <div className="flex flex-col items-center space-y-6">
                    <img
                        src={motherPhoto}
                        alt="Mother and Baby"
                        className="w-56 h-56"
                    />
                    <div className="space-y-4 text-center md:text-left">
                        <div className="flex items-center gap-2 text-gray-600">
                            <i class="fa-solid fa-phone text-blue-400"></i>
                            <span>+20 123 456 789</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <i class="fa-solid fa-location-dot text-blue-400"></i>
                            <span>Cairo, Egypt</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <i class="fa-solid fa-envelope text-blue-400"></i>
                            <span>support@babyguard.com</span>
                        </div>
                        <div className="flex  gap-7 pt-4 text-blue-600 text-xl">
                            <a href="#"><i className="fab fa-facebook-f text-blue-400"></i></a>
                            <a href="#"><i className="fab fa-twitter text-blue-400"></i></a>
                            <a href="#"><i className="fab fa-instagram text-blue-400"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}