import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import toast from 'react-hot-toast'

function ProductStore() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [showQuantityModal, setShowQuantityModal] = useState(false)
  const [productToEdit, setProductToEdit] = useState(null)
  const [newQuantity, setNewQuantity] = useState("")
  const [quantityError, setQuantityError] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:8000/api/products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setProducts(response.data.data)
      setLoading(false)
    } catch (error) {
      setError("Failed to fetch products")
      setLoading(false)
      console.error("Error fetching products:", error)
      toast.error("Failed to fetch products")
    }
  }

  const handleDeleteClick = (product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.delete(`http://localhost:8000/api/products/admin/delete/${productToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setProducts(products.filter((product) => product._id !== productToDelete._id))
      toast.success("Product deleted successfully")
      setShowDeleteModal(false)
      setProductToDelete(null)
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product")
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setProductToDelete(null)
  }

  const handleEditQuantityClick = (product) => {
    setProductToEdit(product)
    setNewQuantity(product.quantity.toString())
    setQuantityError("")
    setShowQuantityModal(true)
  }

  const handleQuantityChange = (e) => {
    const value = e.target.value
    setNewQuantity(value)
    if (value < 0) {
      setQuantityError("Quantity cannot be negative")
    } else if (!Number.isInteger(Number(value))) {
      setQuantityError("Quantity must be a whole number")
    } else {
      setQuantityError("")
    }
  }

  const handleQuantitySubmit = async () => {
    if (quantityError || !newQuantity) return

    try {
      const token = localStorage.getItem('token')
      const response = await axios.patch(
        `http://localhost:8000/api/products/admin/update-quantity/${productToEdit._id}`,
        { quantity: parseInt(newQuantity) },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setProducts(products.map(product => 
        product._id === productToEdit._id 
          ? { ...product, quantity: parseInt(newQuantity) }
          : product
      ))

      toast.success("Quantity updated successfully")
      setShowQuantityModal(false)
      setProductToEdit(null)
      setNewQuantity("")
    } catch (error) {
      console.error("Error updating quantity:", error)
      setQuantityError("Failed to update quantity")
      toast.error("Failed to update quantity")
    }
  }

  const handleQuantityCancel = () => {
    setShowQuantityModal(false)
    setProductToEdit(null)
    setNewQuantity("")
    setQuantityError("")
  }

  const getStatusColor = (quantity) => {
    if (quantity === 0) return "bg-red-100 text-red-800"
    if (quantity <= 10) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  const getStatusText = (quantity) => {
    if (quantity === 0) return "Out of Stock"
    if (quantity <= 10) return "Low Stock"
    return "In Stock"
  }

  const filteredProducts = products.filter(
    (product) => {
      const searchTermLower = searchTerm.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(searchTermLower);
      const descriptionMatch = Array.isArray(product.description) 
        ? product.description.some(desc => desc.toLowerCase().includes(searchTermLower))
        : false;
      
      return nameMatch || descriptionMatch;
    }
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-300"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-10">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6 pt-10">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600/30 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Delete Product</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Quantity Modal */}
      {showQuantityModal && (
        <div className="fixed inset-0 bg-gray-600/30 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Edit Quantity</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 mb-4">
                  Update quantity for "{productToEdit?.name}"
                </p>
                <div className="mt-2">
                  <input
                    type="number"
                    value={newQuantity}
                    onChange={handleQuantityChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new quantity"
                  />
                  {quantityError && (
                    <p className="mt-2 text-sm text-red-600">{quantityError}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={handleQuantityCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleQuantitySubmit}
                  disabled={!!quantityError || !newQuantity}
                  className="px-4 py-2 bg-rose-300 text-white rounded-md hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Product Store</h1>
        <Link
          to="/admin/product-store/add"
          className="bg-rose-300 text-white px-4 py-2 rounded-lg hover:bg-rose-400 transition-colors"
        >
          Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="h-12 w-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.requiredAge}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">${product.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">{product.rating}</span>
                      <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(product.quantity)}`}
                    >
                      {getStatusText(product.quantity)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEditQuantityClick(product)}
                      className="text-indigo-800 hover:text-indigo-950 mr-3"
                    >
                      Edit Quantity
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900" 
                      onClick={() => handleDeleteClick(product)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ProductStore
