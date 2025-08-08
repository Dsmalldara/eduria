/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRightIcon, UserIcon, BookOpenIcon, AwardIcon, CheckIcon } from "lucide-react"

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [selectedType, setSelectedType] = useState("")
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [showRedirectToast, setShowRedirectToast] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const subjects = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Computer Science",
    "Foreign Languages",
    "Art & Music",
    "Test Prep",
  ]

  useEffect(() => {
    // Get email from localStorage
    const email = localStorage.getItem("userEmail")
    if (email) {
      setUserEmail(email)
    }
  }, [])

  const handleNext = async () => {
    if (step === 0 && selectedType) {
      setStep(1)
    } else if (step === 1 && selectedSubjects.length > 0) {
      setStep(2)
    } else if (step === 2) {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch('/api/onboarding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userType: selectedType,
            subjects: selectedSubjects,
            email: userEmail
          }),
        })

        const data = await response.json()

        if (response.ok) {
          if (data.redirectTo) {
            setShowRedirectToast(true)
            setLoading(false)
            setTimeout(() => {
              router.push(data.redirectTo)
            }, 1500)
          }
        } else {
          setError(data.error || "Failed to save onboarding data")
          setLoading(false)
        }
      } catch (error) {
        console.error("Error saving onboarding data:", error)
        setError("Network error. Please try again.")
        setLoading(false)
      }
    }
  }

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject))
    } else {
      setSelectedSubjects([...selectedSubjects, subject])
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Redirect Toast */}
      {showRedirectToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Profile saved! Redirecting...</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}

      {/* Logo and Header */}
      <div className="p-6 text-center">
        <div className="h-16 w-16 bg-[#c1f52f] rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpenIcon className="h-8 w-8 text-[#321210]" />
        </div>
        <h1 className="text-3xl font-bold text-[#321210]">Eduria</h1>
        <p className="text-gray-600 mt-2">Your personalized tutoring platform</p>
      </div>

      {/* Progress Indicator */}
      <div className="px-6 mb-8">
        <div className="flex justify-between items-center">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`h-3 w-3 rounded-full ${i === step ? "bg-[#c1f52f]" : i < step ? "bg-[#7c5831]" : "bg-gray-200"}`}
              />
            </div>
          ))}
          <div className={`h-0.5 flex-1 mx-2 ${step > 0 ? "bg-[#7c5831]" : "bg-gray-200"}`} />
          <div className={`h-0.5 flex-1 mx-2 ${step > 1 ? "bg-[#7c5831]" : "bg-gray-200"}`} />
        </div>
      </div>

      <div className="flex-1 px-6">
        {step === 0 && (
          <>
            <h2 className="text-2xl font-bold text-[#321210] mb-2">Choose your role</h2>
            <p className="text-gray-600 mb-6">Are you a student looking for help or a tutor offering your expertise?</p>
            <div className="space-y-4">
              <Card
                className={`p-4 cursor-pointer ${selectedType === "student" ? "border-2 border-[#c1f52f]" : ""}`}
                onClick={() => setSelectedType("student")}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="p-3 bg-[#d98d9f]/20 rounded-full mr-3">
                      <UserIcon className="h-6 w-6 text-[#321210]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#321210]">I'm a Student</h3>
                      <p className="text-sm text-gray-600">Looking for expert tutoring</p>
                    </div>
                  </div>
                  {selectedType === "student" && (
                    <div className="h-6 w-6 bg-[#c1f52f] rounded-full flex items-center justify-center">
                      <CheckIcon className="h-4 w-4 text-[#321210]" />
                    </div>
                  )}
                </div>
              </Card>

              <Card
                className={`p-4 cursor-pointer ${selectedType === "tutor" ? "border-2 border-[#c1f52f]" : ""}`}
                onClick={() => setSelectedType("tutor")}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="p-3 bg-[#7c5831]/20 rounded-full mr-3">
                      <AwardIcon className="h-6 w-6 text-[#321210]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#321210]">I'm a Tutor</h3>
                      <p className="text-sm text-gray-600">Offering my teaching expertise</p>
                    </div>
                  </div>
                  {selectedType === "tutor" && (
                    <div className="h-6 w-6 bg-[#c1f52f] rounded-full flex items-center justify-center">
                      <CheckIcon className="h-4 w-4 text-[#321210]" />
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-[#321210] mb-2">
              {selectedType === "student" ? "What do you want to learn?" : "What do you teach?"}
            </h2>
            <p className="text-gray-600 mb-6">Select all that apply. You can change this later.</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {subjects.map((subject) => (
                <div
                  key={subject}
                  className={`p-3 rounded-lg border cursor-pointer ${selectedSubjects.includes(subject) ? "border-[#c1f52f] bg-[#c1f52f]/10" : "border-gray-200"}`}
                  onClick={() => toggleSubject(subject)}
                >
                  <div className="flex items-center">
                    {selectedSubjects.includes(subject) && (
                      <div className="h-5 w-5 bg-[#c1f52f] rounded-full flex items-center justify-center mr-2">
                        <CheckIcon className="h-3 w-3 text-[#321210]" />
                      </div>
                    )}
                    <span className={`text-sm ${selectedSubjects.includes(subject) ? "font-medium" : ""}`}>
                      {subject}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center mb-6">
              <div className="h-20 w-20 bg-[#c1f52f] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckIcon className="h-10 w-10 text-[#321210]" />
              </div>
              <h2 className="text-2xl font-bold text-[#321210] mb-2">You're all set!</h2>
              <p className="text-gray-600">
                {selectedType === "student"
                  ? "Ready to start learning with expert tutors"
                  : "Ready to share your knowledge with students"}
              </p>
            </div>

            <Card className="p-4 mb-4">
              <h3 className="font-bold text-[#321210] mb-3">Your Profile</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-600">Role</p>
                  <p className="font-medium text-[#321210] capitalize">{selectedType}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">{selectedType === "student" ? "Interests" : "Subjects"}</p>
                  <p className="font-medium text-[#321210] text-right">
                    {selectedSubjects.slice(0, 2).join(", ")}
                    {selectedSubjects.length > 2 && ` +${selectedSubjects.length - 2} more`}
                  </p>
                </div>
              </div>
            </Card>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-500 mb-2">
                By continuing, you agree to our{" "}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[#7c5831] underline hover:text-[#321210]"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[#7c5831] underline hover:text-[#321210]"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </>
        )}
      </div>

      {/* Bottom Button */}
      <div className="p-6">
        <Button
          variant="default"
          onClick={handleNext}
          className={`w-full flex items-center justify-center ${(step === 0 && !selectedType) || (step === 1 && selectedSubjects.length === 0) ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={(step === 0 && !selectedType) || (step === 1 && selectedSubjects.length === 0) || loading}
        >
          {loading ? "Saving..." : step === 2 ? "Get Started" : "Continue"}
          <ChevronRightIcon className="h-5 w-5 ml-1" />
        </Button>
      </div>
    </div>
  )
}