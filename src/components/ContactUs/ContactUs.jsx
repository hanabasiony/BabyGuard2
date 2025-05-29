import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import motherPhoto from "../../assets/images/contactPhoto.png";
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ContactUs() {
    const [selected, setSelected] = useState('Suggestion');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to send a message');
                return;
            }

            const formData = {
                message,
                type: selected
            };

            const response = await axios.post('http://localhost:8000/api/complaints', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Message sent successfully:', response.data);
            toast.success('Message sent successfully!');
            setMessage('');
            setSelected('Suggestion');
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error(error.response?.data?.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    const options = ['Suggestion', 'Complaint'];
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-35">
            <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">
                {/* Left Content */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-blue-700">
                        We're Here for You <br /> & Your Baby!
                    </h2>
                    <p className="text-gray-600">
                        Have a suggestion or complaint?<br />We'd love to hear from you.
                    </p>

                    <form className="bg-white shadow-md rounded-2xl p-6 space-y-4 border border-gray-200" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm text-gray-700">Message</label>
                            <textarea
                                rows="4" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>

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
                                <option value="Suggestion">Suggestion</option>
                                <option value="Complaint">Complaint</option>
                            </select>
                        </div>

                        <button type="submit" className="w-full bg-pink-400 text-white font-semibold py-2 rounded-md hover:bg-pink-500 transition" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
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
                            <i className="fa-solid fa-phone text-blue-400"></i>
                            <span>+20 123 456 789</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <i className="fa-solid fa-location-dot text-blue-400"></i>
                            <span>Cairo, Egypt</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <i className="fa-solid fa-envelope text-blue-400"></i>
                            <span>support@babyguard.com</span>
                        </div>
                        <div className="flex gap-7 pt-4 text-blue-600 text-xl">
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