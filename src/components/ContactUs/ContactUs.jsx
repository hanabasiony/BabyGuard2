import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import contactUs from "../../assets/images/contact us.jpg";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ContactUs() {
  const [selected, setSelected] = useState("Suggestion");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);

  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);

    if (newMessage.trim().length > 0 && newMessage.trim().length < 10) {
      setMessageError("Message must be at least 10 characters long");
    } else {
      setMessageError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (message.trim().length < 10) {
      setMessageError("Message must be at least 10 characters long");
      toast.error("Message must be at least 10 characters long");
      return;
    }

    setMessageError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to send a message");
        return;
      }

      const formData = {
        message,
        type: selected,
      };

      const response = await axios.post(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/complaints",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Message sent successfully:", response.data);
      toast.success("Message sent successfully!");
      setMessage("");
      setSelected("Suggestion");
      console.log(response);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const options = ["Suggestion", "Complaint", "Question"];
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-35">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-[#8BCFE0]">
            We're Here for You <br /> & Your Baby!
          </h2>
          <p className="text-gray-600">
            Have a suggestion or complaint?
            <br />
            We'd love to hear from you.
          </p>

          <form
            className="bg-white shadow-md rounded-2xl p-6 space-y-4 border border-gray-200"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-sm text-gray-700">Message</label>
              <textarea
                rows="4"
                value={message}
                onChange={handleMessageChange}
                className={`w-full mt-1 px-4 py-2 border rounded-md ${
                  messageError ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-pink-500`}
              />
              {messageError && (
                <p className="text-red-500 text-xs mt-1">{messageError}</p>
              )}
            </div>

            <div className=" mx-auto mt-6">
              <label
                htmlFor="feedbackType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Choose Feedback Type:
              </label>
              <select
                id="feedbackType"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="" disabled>
                  Select one
                </option>
                <option value="Suggestion">Suggestion</option>
                <option value="Complaint">Complaint</option>
                <option value="Question">Question</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-rose-300 text-white font-semibold py-2 rounded-md hover:bg-rose-400 transition"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Right Content */}
        <div className="flex flex-col items-center space-y-6">
          <img src={contactUs} alt="contact us" className="w-56 h-56" />
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center gap-2 text-gray-600">
              <i className="fa-solid fa-phone text-[#8BCFE0]"></i>
              <span>+20 123 456 789</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <i className="fa-solid fa-location-dot text-[#8BCFE0]"></i>
              <span>Cairo, Egypt</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <i className="fa-solid fa-envelope text-[#8BCFE0]"></i>
              <span>support@babyguard.com</span>
            </div>
            <div className="flex gap-7 pt-4 text-blue-600 text-xl">
              <a href="#">
                <i className="fab fa-facebook-f text-[#8BCFE0]"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter text-[#8BCFE0]"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram text-[#8BCFE0]"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
