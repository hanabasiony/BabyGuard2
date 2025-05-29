import { useState, useEffect } from "react"

export function Calendar({ onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)

  useEffect(() => {
    // Reset selected day when month changes
    setSelectedDay(null)
  }, [currentDate])

  const daysOfWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"]

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDayClick = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    // Only check if date is before today, not including today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if the selected date is a Friday (5) or Saturday (6)
    const dayOfWeek = selectedDate.getDay()
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      return // Don't allow selection of Fridays and Saturdays
    }

    if (selectedDate < today) {
      return // Don't allow selection of past dates
    }

    setSelectedDay(day)
    
    // Format the date as YYYY-MM-DD
    const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onSelectDate(formattedDate)
  }

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const currentDay = today.getDate()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDay && month === currentDate.getMonth() && year === currentDate.getFullYear()
      const isToday = day === currentDay && month === currentMonth && year === currentYear

      const dateToCheck = new Date(year, month, day)
      dateToCheck.setHours(0, 0, 0, 0)
      const isPastDay = dateToCheck < today
      const isWeekend = dateToCheck.getDay() === 5 || dateToCheck.getDay() === 6

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDayClick(day)}
          disabled={isPastDay || isWeekend}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm
          ${isSelected ? "bg-sky-500 text-white" : ""}
          ${isToday && !isSelected ? "border border-sky-500" : ""}
          ${(isPastDay || isWeekend) ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}`}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-100">
          <span className="text-gray-600 text-lg">←</span>
        </button>

        <h3 className="text-lg font-medium text-gray-900">
          {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>

        <button type="button" onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100">
          <span className="text-gray-600 text-lg">→</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
    </div>
  )
}
