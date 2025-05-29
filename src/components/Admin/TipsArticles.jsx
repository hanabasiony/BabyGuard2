 "use client"
import { useState } from "react"

function TipsArticles() {
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "Essential Vaccinations for Newborns",
      category: "Health",
      author: "Dr. Sarah Johnson",
      date: "2023-04-15",
      status: "Published",
    },
    {
      id: 2,
      title: "Nutrition Guide for Infants",
      category: "Nutrition",
      author: "Dr. Michael Wilson",
      date: "2023-04-10",
      status: "Published",
    },
    {
      id: 3,
      title: "Sleep Training Tips",
      category: "Development",
      author: "Emma Davis",
      date: "2023-04-05",
      status: "Published",
    },
    {
      id: 4,
      title: "Common Baby Skin Conditions",
      category: "Health",
      author: "Dr. Lisa Brown",
      date: "2023-04-01",
      status: "Draft",
    },
    {
      id: 5,
      title: "Baby-Proofing Your Home",
      category: "Safety",
      author: "Robert Johnson",
      date: "2023-03-25",
      status: "Published",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [newArticle, setNewArticle] = useState({
    title: "",
    category: "",
    author: "",
    date: new Date().toISOString().split("T")[0],
    status: "Draft",
  })

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddArticle = () => {
    if (newArticle.title && newArticle.category && newArticle.author) {
      setArticles([...articles, { ...newArticle, id: articles.length + 1 }])
      setNewArticle({
        title: "",
        category: "",
        author: "",
        date: new Date().toISOString().split("T")[0],
        status: "Draft",
      })
      setShowAddModal(false)
    }
  }

  const handleDeleteArticle = (id) => {
    setArticles(articles.filter((article) => article.id !== id))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Tips & Articles</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-500">This component will be used to manage tips and articles. Connect your API here.</p>
      </div>
    </div>
  )
}

export default TipsArticles
