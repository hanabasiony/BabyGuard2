// 
// import axios from 'axios';

// function Complaints() {
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [replyText, setReplyText] = useState('');
//   const [showReplyModal, setShowReplyModal] = useState(false);

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const fetchComplaints = async () => {
//     try {
//       // Replace with your actual API endpoint
//       // const response = await axios.get('/api/complaints');
//       // setComplaints(response.data);
      
//       // Mock data for demonstration
//       const mockComplaints = [
//         {
//           id: 1,
//           userName: 'Sarah Johnson',
//           date: '2024-03-15',
//           message: 'The app keeps crashing when I try to add emergency contacts.',
//           status: 'New',
//           priority: 'High'
//         },
//         {
//           id: 2,
//           userName: 'Mike Peters',
//           date: '2024-03-14',
//           message: 'Would love to have a dark mode option.',
//           status: 'In Progress',
//           priority: 'Medium'
//         }
//       ];
      
//       setComplaints(mockComplaints);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching complaints:', error);
//       setLoading(false);
//     }
//   };

//   const handleReply = async (complaintId) => {
//     if (!replyText.trim()) return;

//     try {
//       // Replace with your actual API endpoint
//       // await axios.post(`/api/complaints/${complaintId}/reply`, { message: replyText });
      
//       // Update local state
//       setComplaints(prevComplaints =>
//         prevComplaints.map(complaint =>
//           complaint.id === complaintId
//             ? { ...complaint, status: 'Responded' }
//             : complaint
//         )
//       );

//       setShowReplyModal(false);
//       setReplyText('');
//       setSelectedComplaint(null);
//     } catch (error) {
//       console.error('Error sending reply:', error);
//     }
//   };

//   const updateStatus = async (complaintId, newStatus) => {
//     try {
//       // Replace with your actual API endpoint
//       // await axios.put(`/api/complaints/${complaintId}`, { status: newStatus });
      
//       // Update local state
//       setComplaints(prevComplaints =>
//         prevComplaints.map(complaint =>
//           complaint.id === complaintId
//             ? { ...complaint, status: newStatus }
//             : complaint
//         )
//       );
//     } catch (error) {
//       console.error('Error updating status:', error);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'New': return 'bg-blue-100 text-blue-800';
//       case 'In Progress': return 'bg-yellow-100 text-yellow-800';
//       case 'Responded': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'High': return 'bg-red-100 text-red-800';
//       case 'Medium': return 'bg-yellow-100 text-yellow-800';
//       case 'Low': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-gray-500">Loading complaints...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-semibold mb-6">Complaints Management</h1>
      
//       <div className="space-y-4">
//         {complaints.map(complaint => (
//           <div key={complaint.id} className="bg-white rounded-lg shadow p-4">
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <h3 className="font-medium">{complaint.userName}</h3>
//                 <p className="text-sm text-gray-500">{new Date(complaint.date).toLocaleDateString()}</p>
//               </div>
//               <div className="flex gap-2">
//                 <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(complaint.status)}`}>
//                   {complaint.status}
//                 </span>
//                 <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(complaint.priority)}`}>
//                   {complaint.priority}
//                 </span>
//               </div>
//             </div>
            
//             <p className="text-gray-600 mb-4">{complaint.message}</p>
            
//             <div className="flex gap-2">
//               <button
//                 onClick={() => {
//                   setSelectedComplaint(complaint);
//                   setShowReplyModal(true);
//                 }}
//                 className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
//               >
//                 Reply
//               </button>
//               <button
//                 onClick={() => updateStatus(complaint.id, 'In Progress')}
//                 className="px-3 py-1 text-sm text-yellow-600 hover:text-yellow-800"
//               >
//                 Mark In Progress
//               </button>
//               <button
//                 onClick={() => updateStatus(complaint.id, 'Responded')}
//                 className="px-3 py-1 text-sm text-green-600 hover:text-green-800"
//               >
//                 Mark Responded
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Reply Modal */}
//       {showReplyModal && selectedComplaint && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Reply to {selectedComplaint.userName}</h2>
//               <button
//                 onClick={() => setShowReplyModal(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 ✕
//               </button>
//             </div>
            
//             <div className="mb-4 p-3 bg-gray-50 rounded">
//               <p className="text-gray-700">{selectedComplaint.message}</p>
//             </div>
            
//             <textarea
//               value={replyText}
//               onChange={(e) => setReplyText(e.target.value)}
//               className="w-full p-2 border rounded mb-4"
//               rows="4"
//               placeholder="Type your reply..."
//             />
            
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setShowReplyModal(false)}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleReply(selectedComplaint.id)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Send Reply
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Complaints;


import { useState, useEffect } from 'react';

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
  const [data, setData] = useState([]); // This will hold your API data
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState([]);
  const [filterCategory, setFilterCategory] = useState([]);

  // =========================
  // FETCH DATA FROM YOUR API
  // =========================
  useEffect(() => {
    // Example using fetch:
    /*
    fetch('https://your-api-url.com/complaints')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
    */

    // Example using axios:
    /*
    import axios from 'axios';
    axios.get('https://your-api-url.com/complaints')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
    */

    // REMOVE THIS MOCK DATA after connecting your API!
    setData([
      {
        id: 1,
        userName: 'Sarah Johnson',
        userAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        date: 'Apr 15, 2025',
        category: 'Complaint',
        message: 'The app keeps crashing when I try to add multiple emergency contacts. This is really frustrating as I need to add my family members.',
        status: 'In Progress',
      },
      {
        id: 2,
        userName: 'Mike Peters',
        userAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        date: 'Apr 14, 2025',
        category: 'Suggestion',
        message: 'It would be great if we could have a dark mode option. Also, adding voice commands would make it easier to use.',
        status: 'Responded',
      },
      {
        id: 3,
        userName: 'Emma Wilson',
        userAvatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        date: 'Apr 13, 2025',
        category: 'Question',
        message: 'How do I connect multiple devices to monitor my baby? I want both my husband and I to receive notifications.',
        status: 'New',
      },
    ]);
  }, []);
  // =========================

  // Filtering logic
  const filtered = data.filter(item => {
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Complaints' && item.category === 'Complaint') ||
      (activeTab === 'Suggestions' && item.category === 'Suggestion') ||
      (activeTab === 'Questions' && item.category === 'Question');
    const matchesSearch =
      item.userName.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus.length === 0 || filterStatus.includes(item.status);
    const matchesCategory =
      filterCategory.length === 0 || filterCategory.includes(item.category);
    return matchesTab && matchesSearch && matchesStatus && matchesCategory;
  });

  // Export to CSV
  function handleExport() {
    const headers = ['User Name', 'Date', 'Category', 'Message', 'Status'];
    const rows = filtered.map(item => [
      item.userName,
      item.date,
      item.category,
      `"${item.message.replace(/"/g, '""')}"`,
      item.status,
    ]);
    const csvContent =
      [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'complaints.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

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

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h2 className="text-lg font-semibold mb-2">Complaints & Suggestions</h2>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <div className="flex-1">
          <input
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
            placeholder="Search by user name or category"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          className="flex items-center gap-1 px-3 py-2 bg-pink-100 text-pink-700 rounded hover:bg-pink-200 text-sm"
          onClick={handleExport}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Export
        </button>
        <button
          className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
          onClick={() => setShowFilter(true)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Filters
        </button>
      </div>
      <div className="flex gap-2 mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`px-4 py-1 rounded border-b-2 text-sm font-medium ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded shadow p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img
                src={item.userAvatar}
                alt={item.userName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="font-medium text-sm">{item.userName}</div>
                <div className="text-xs text-gray-400">{item.date}</div>
              </div>
              <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${categoryColors[item.category]}`}>
                {item.category}
              </span>
            </div>
            <div className="text-xs text-gray-700 flex-1">{item.message}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[item.status]}`}>
                {item.status}
              </span>
              <span className="ml-auto flex gap-2">
                <button className="text-gray-400 hover:text-blue-500" title="Reply">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 10h7V6a1 1 0 011-1h7a1 1 0 011 1v12a1 1 0 01-1 1h-7a1 1 0 01-1-1v-4H3v-4z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button className="text-gray-400 hover:text-blue-500" title="View">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </span>
            </div>
          </div>
        ))}
      </div>

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
            <div className="flex justify-between mt-6">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={clearFilters}
              >
                Clear
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setShowFilter(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

