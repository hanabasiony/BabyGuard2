import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const categoryColors = {
  Complaint: 'bg-red-100 text-red-700',
  Suggestion: 'bg-blue-100 text-blue-700',
  Question: 'bg-purple-100 text-purple-700',
};

const statusColors = {
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Responded: 'bg-green-100 text-green-700',
  New: 'bg-blue-100 text-blue-700',
};

const tabs = ['All', 'Complaints', 'Suggestions', 'Questions'];
const allStatuses = ['In Progress', 'Responded', 'New'];
const allCategories = ['Complaint', 'Suggestion', 'Question'];

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState([]);
  const [filterCategory, setFilterCategory] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/complaints/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response);

      if (!response.data.data) {
        setComplaints([]);
        return;
      }

      const formattedComplaints = response.data.data.map(item => ({
        id: item._id,
        name: `${item.userId?.fName || ''} ${item.userId?.lName || ''}`.trim() || 'Anonymous',
        email: item.userId?.email || 'No email',
        phone: item.userId?.phoneNumber || 'No phone',
        date: new Date(item.createdAt).toLocaleDateString(),
        type: item.type || 'Complaint',
        message: item.message || 'No message',
        avatar: `https://ui-avatars.com/api/?name=${item.userId?.fName || 'A'}+${item.userId?.lName || 'U'}&background=random`
      }));

      setComplaints(formattedComplaints);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch complaints');
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(item => {
    const matchesTab = activeTab === 'All' || item.type === activeTab;
    const matchesSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.message.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus.length === 0 || filterStatus.includes(item.type);
    const matchesCategory =
      filterCategory.length === 0 || filterCategory.includes(item.type);
    return matchesTab && matchesSearch && matchesStatus && matchesCategory;
  });

  const handleExport = () => {
    const headers = ['Name', 'Email', 'Phone', 'Date', 'Type', 'Message'];
    const rows = filteredComplaints.map(item => [
      item.name,
      item.email,
      item.phone,
      item.date,
      item.type,
      `"${item.message.replace(/"/g, '""')}"`
    ]);
    
    // const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    // const blob = new Blob([csvContent], { type: 'text/csv' });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'complaints.csv';
    // a.click();
    // URL.revokeObjectURL(url);
  };

  // Filter modal logic
  function toggleFilterStatus(status) {
    setFilterStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  }
  function toggleFilterCategory(category) {
    setFilterCategory(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }
  function clearFilters() {
    setFilterStatus([]);
    setFilterCategory([]);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Complaints & Suggestions</h2>
        {/* <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button> */}
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search complaints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-2 mb-6">
        {['All', 'Complaint', 'Suggestion', 'Question'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredComplaints.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[item.type]}`}>
                    {item.type}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  <div>Email: {item.email}</div>
                  <div>Phone: {item.phone}</div>
                  <div>Date: {item.date}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-gray-700">{item.message}</div>
            {/* <div className="mt-4 flex justify-end gap-2">
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h7V6a1 1 0 011-1h7a1 1 0 011 1v12a1 1 0 01-1 1h-7a1 1 0 01-1-1v-4H3v-4z" />
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div> */}
          </div>
        ))}
      </div>

      {filteredComplaints.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No complaints found</p>
        </div>
      )}

      {/* Filter Modal */}
      {showFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={() => setShowFilter(false)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
            </div>
            <div className="mb-4">
              <div className="font-medium mb-1">Status</div>
              <div className="flex flex-wrap gap-2">
                {allStatuses.map(status => (
                  <button
                    key={status}
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      filterStatus.includes(status)
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                    onClick={() => toggleFilterStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <div className="font-medium mb-1">Category</div>
              <div className="flex flex-wrap gap-2">
                {allCategories.map(category => (
                  <button
                    key={category}
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      filterCategory.includes(category)
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                    onClick={() => toggleFilterCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          
          </div>
        </div>
      )}
    </div>
  );
}

