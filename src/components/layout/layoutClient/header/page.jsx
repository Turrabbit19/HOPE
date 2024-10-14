"use client"

import React, { useState, useEffect, useRef } from "react"
import { Search, Bell, MessageCircle, BarChart2, Maximize, Minimize } from "lucide-react"

export default function HeaderClient() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const notificationRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener("fullscreenchange", onFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange)
  }, [])

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b">
      <div className="flex items-center w-1/3">
        <div className="relative w-full max-w-sm">
          <input
            type="search"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>
      <div className="flex items-center justify-center w-1/3">
        <span className="text-sm font-medium">Academic Year: 2024 / 2025</span>
      </div>
      <div className="flex items-center justify-end w-1/3 space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <img
            src="https://flagcdn.com/w20/vn.png"
            width="20"
            alt="vn flag"
            className="rounded-sm"
          />
        </button>
        <div className="relative">
          <button
            ref={buttonRef}
            className="p-2 hover:bg-gray-100 rounded-full border"
            onClick={toggleNotifications}
          >
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
          {showNotifications && (
            <div
              ref={notificationRef}
              className="absolute right-0 mt-2 w-80 bg-white border rounded-md shadow-lg z-10"
            >
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Thông báo</h3>
                <p className="text-sm text-gray-500">Bạn có 3 thông báo chưa đọc</p>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full" />
                  <div>
                    <p className="text-sm font-medium">Bài tập mới đã được đăng</p>
                    <p className="text-xs text-gray-500">2 phút trước</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full" />
                  <div>
                    <p className="text-sm font-medium">Nhắc nhở kỳ thi sắp tới</p>
                    <p className="text-xs text-gray-500">1 giờ trước</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full" />
                  <div>
                    <p className="text-sm font-medium">Điểm Toán 101 đã được công bố</p>
                    <p className="text-xs text-gray-500">Hôm qua</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full border">
          <MessageCircle className="h-5 w-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full border">
          <BarChart2 className="h-5 w-5 text-gray-600" />
        </button>
        <button
          className="p-2 hover:bg-gray-100 rounded-full border"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize className="h-5 w-5 text-gray-600" />
          ) : (
            <Maximize className="h-5 w-5 text-gray-600" />
          )}
        </button>
        <button className="p-1 hover:bg-gray-100 rounded-full border">
          <img
            src="/placeholder.svg?height=32&width=32"
            alt="User avatar"
            className="rounded-full"
            width={32}
            height={32}
          />
        </button>
      </div>
    </header>
  )
}