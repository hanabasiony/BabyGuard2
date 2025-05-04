import img2 from "../../assets/images/img1payment.jpeg"
import img3 from "../../assets/images/img2payment.jpeg"

export default function PaymentPage(){
    return (
      <div className="min-h-screen  flex justify-center items-center py-35 bg-pink-50 ">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-sm p-8">
       
  
          {/* Checkout Title */}
          <h2 className="text-4xl font-bold text-blue-800 text-center mb-12">Checkout</h2>
  
          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Delivery Information */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Delivery Information</h3>
  
              <div className="space-y-2">
                <label htmlFor="parentName" className="block text-gray-700 font-medium">
                  Parent Name
                </label>
                <input
                  type="text"
                  id="parentName"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
  
              <div className="space-y-2">
                <label htmlFor="address" className="block text-gray-700 font-medium">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
  
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="city" className="block text-gray-700 font-medium">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="zipCode" className="block text-gray-700 font-medium">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
  
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-gray-700 font-medium">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
  
              <div className="space-y-2">
                <label htmlFor="email" className="block text-gray-700 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
  
              <div className="space-y-2">
                <textarea
                  placeholder="Add a note (e.g., special delivery instructions)"
                  className="w-full border border-gray-300 rounded-md p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                />
              </div>
            </div>
  
            {/* Order Summary */}
            <div>
              <h3 className="text-2xl font-semibold text-blue-800 mb-6">Order Summary</h3>
  
              <div className="space-y-4 mb-8">
                {/* Product 1 */}

<div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                  <div className="bg-gray-100 rounded-lg p-2 w-16 h-16 flex items-center justify-center">
                    <img
                      src={img2}
                      alt="Soft Cotton Onesie"
                    
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Soft Cotton Onesie</h4>
                    <p className="text-gray-600">EGP 150</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">2</span>
                  </div>
                </div>
  
                {/* Product 2 */}
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                  <div className="bg-gray-100 rounded-lg p-2 w-16 h-16 flex items-center justify-center">
                    <img
                      src={img3}
                      alt="Musical Baby Toy"
                      
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Musical Baby Toy</h4>
                    <p className="text-gray-600">EGP 300</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">1</span>
                  </div>
                </div>
              </div>
  
              {/* Totals */}
              <div className="space-y-2 border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">EGP 600</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">EGP 0</span>
                </div>
              </div>
  
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold text-blue-800">Total</span>
                <span className="text-xl font-bold text-blue-800">EGP 600</span>
              </div>
  
              <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-4 px-6 rounded-full transition duration-300">
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }