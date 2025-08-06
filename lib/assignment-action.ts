"use server"

import { prisma } from "./prisma"

export async function createAssignment(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const subject = formData.get("subject") as string
    const description = formData.get("description") as string
    const dueDate = formData.get("dueDate") as string
    const priority = formData.get("priority") as string
    const tutorId = formData.get("tutorId") as string

    if (!title || !subject || !description || !dueDate || !tutorId) {
      throw new Error("Missing required fields")
    }

    const assignment = await prisma.assignment.create({
      data: {
        id: `assignment_${Date.now()}`,
        title,
        description,
        resourceUrl: "", // Add file upload logic here
        classId: "", // You'll need to associate with a class
        createdAt: new Date(),
      },
    })

    return { success: true, assignment }
  } catch (error) {
    console.error("Error creating assignment:", error)
    throw new Error("Failed to create assignment")
  }
}

export async function submitAssignment(formData: FormData) {
  try {
    const assignmentId = formData.get("assignmentId") as string
    const submissionText = formData.get("submissionText") as string
    const studentId = formData.get("studentId") as string

    if (!assignmentId || !studentId) {
      throw new Error("Missing required fields")
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        submittedUrl: submissionText, // Store submission content
        submittedAt: new Date(),
      },
    })

    return { success: true, assignment: updatedAssignment }
  } catch (error) {
    console.error("Error submitting assignment:", error)
    throw new Error("Failed to submit assignment")
  }
}

export async function gradeAssignment(formData: FormData) {
  try {
    const assignmentId = formData.get("assignmentId") as string
    const grade = Number.parseInt(formData.get("grade") as string)
    const feedback = formData.get("feedback") as string

    if (!assignmentId || isNaN(grade)) {
      throw new Error("Missing required fields")
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        grade,
        // You might want to add a feedback field to your schema
      },
    })

    return { success: true, assignment: updatedAssignment }
  } catch (error) {
    console.error("Error grading assignment:", error)
    throw new Error("Failed to grade assignment")
  }
}

export async function deleteAssignment(assignmentId: string) {
  try {
    await prisma.assignment.delete({
      where: { id: assignmentId },
    })

    return { success: true }
  } catch (error) {
    console.error("Error deleting assignment:", error)
    throw new Error("Failed to delete assignment")
  }
}

export async function getAssignments(userId: string, userType: "student" | "tutor") {
  try {
    if (userType === "tutor") {
      // Get assignments created by this tutor
      const classes = await prisma.renamedclass.findMany({
        where: { tutorId: userId },
        include: {
          assignment: true,
        },
      })

      return classes.flatMap((cls) => cls.assignment)
    } else {
      // Get assignments for this student
      const classes = await prisma.renamedclass.findMany({
        where: { studentId: userId },
        include: {
          assignment: true,
        },
      })

      return classes.flatMap((cls) => cls.assignment)
    }
  } catch (error) {
    console.error("Error fetching assignments:", error)
    throw new Error("Failed to fetch assignments")
  }
}
