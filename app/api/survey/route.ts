import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received Survey Data:", body);

    // TODO: Add logic to save the data to a database

    return NextResponse.json({
      message: "Survey submitted successfully!",
      data: body,
    }, { status: 200 });

  } catch (error) {
    console.error("Error processing survey submission:", error);
    return NextResponse.json({
      message: "An error occurred while submitting the survey.",
    }, { status: 500 });
  }
} 